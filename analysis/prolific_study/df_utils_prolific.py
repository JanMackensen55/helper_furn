import pandas as pd
import numpy as np
import ast
import json
import os
import sys
sys.path.insert(0,os.path.dirname(sys.path[0]) +'/utils')

from lp_utils import *



def create_df_resources(df_built, df_actions):
    '''Calculate the amount of material/workshop hours left after each decision to built'''

    resources_month, _, _ = load_lp_model()
    # aggregate the cost dict to account for the collection of parts with one click

    cost_dict = {'bed frame': [2,2,0,0,0,4], 'bed top': [2,1,0,0,3,0], 'shelf':[3,6,0,0,0,3], 'shelf frame':[2,1,0,0,5,0],'table leg': [0,4,4,0,0,0], 'table top':[2,1,0,6,0,0] ,'chair leg': [4,0,4,0,0,0], 'chair back' :[0,1,0,1,0,0]}
    # only use successful building actions for the calcukation
    df_resources = df_built[(df_built.action_type == 'successful built')  ]
    df_resources = df_resources.reset_index()
    df_resources = df_resources.drop(['index','action' , 'level_0', 'counts', 'action_type'],  axis=1)
    resources = ['wood', 'metal', 'wsA', 'wsB', 'wsC', 'wsD']


    df_resources[resources] = 0
    df_resources.timepoint = pd.to_numeric(df_resources.timepoint)
    initial =pd. DataFrame(columns = df_resources.columns)
    for vp in df_resources['vp'].unique():
        for t in range(6):
            # get the month for the trial

            m = df_resources[ (df_resources.trial == t) & (df_resources.vp ==vp)].month.values[0]
            try:
                # needed because one person did not built any item in month 1
                first = df_resources[(df_resources.trial == t)&(df_resources.vp == vp)].timepoint.idxmin()
                first_timepoint =  df_actions[(df_actions.trial == t)&(df_actions.vp == vp)].timepoint.min()
            except ValueError:
                pass

                # set initial resources in each month: initial resources - first action cost
            df_resources.loc[first,resources] =  resources_month[m-1]- cost_dict[df_resources.loc[first, 'furniture_parts']]

            idxs = df_resources[(df_resources.trial == t)&(df_resources.vp == vp)].index
            for i in range(1,len(idxs)):
                    df_resources.loc[idxs[i], resources] = df_resources.loc[idxs[i-1], resources]- cost_dict[df_resources.loc[idxs[i], 'furniture_parts']]

            initial.loc[len(initial)] = [first_timepoint, t, vp, first_timepoint/60, 'na', 'na', 'na', m, 0,0,0,0,0,0 ]
            initial.loc[len(initial)-1, resources ] = resources_month[m-1]
    df_resources =pd.concat([df_resources, initial], ignore_index=True) #df_resources.append(initial)
    df_resources[resources] = df_resources[resources].apply(pd.to_numeric)
    return df_resources

def calculate_monthly_playtime(df_actions):
    '''Calculate the timepoint relative to the start of the month (how much time was spent in month)'''

    vp_list = df_actions['vp'].unique()

    df_play_times = pd.DataFrame(columns = range(0,6))
    df_play_times.columns.name = 'trial'
    df_actions.timepoint = pd.to_numeric(df_actions.timepoint)

    for vp in vp_list :

        df_vp = df_actions[df_actions['vp']== vp]
        # the play phase in most months starts after the newspaper or a question window was closed
        df_messages = df_vp[(df_vp.action_type == 'question') ]
        start_month = []
        end_month = []
        first_action_month = []
        for i in range(0,6):

            start_month.append(df_messages[df_messages['trial']==i]['timepoint'].max())
                #end_month = pd.concat([end_month, df_vp[df_vp['month']==i]['timepoint'].max()], ignore_index=True)

            end_month.append(df_vp[df_vp['trial']==i]['timepoint'].max())


        month_play_time = []
        for i in range(6):
            month_play_time.append(end_month[i]-start_month[i])
        month_play_minutes = [seconds/60 for seconds in month_play_time]
        df_play_times.loc[len(df_play_times)]= month_play_minutes

    df_play_times =df_play_times.set_index(vp_list)
    df_play_times = df_play_times.melt(value_name = 'minutes', ignore_index=False)#
    return df_play_times

def get_part_dictionary():
    '''Returns dictionary mapping action codes for built parts to part names'''
    furniture_dict = {'TL': 'table leg', # tischbein
                      'TP': 'table top', # tischplatte
                      'CB': 'chair leg', # stuhlbein
                      'CK': 'chair back', # stuhllehne
                     'RF': 'shelf frame', # Regalrahmen
                     'RP': 'shelf', # Regalbrett
                    'BE': 'bed top', # Bettrahmen
                    'BB': 'bed frame', # Bettgestell
                      }
    table_leg = ['WT', 'MT', 'AT', 'BT', 'CT', 'DT'] # 4
    table_top = [ 'WP', 'MP', 'AP', 'BP', 'CP', 'DP'] # 1
    chair_leg = [ 'WC', 'MC', 'AC', 'BC', 'CC', 'DC'] #4
    chair_back = ['WL', 'ML', 'AL', 'BL', 'CL', 'DL'] #1
    bed_top = ['WF', 'MF', 'AF', 'BF', 'CF', 'DF'] # 1
    bed_frame = ['WG', 'MG', 'AG', 'BG', 'CG', 'DG'] # 2
    shelf_frame = ['WS', 'MS', 'AS', 'BS', 'CS', 'DS' ] # 1
    shelf = ['WR', 'MR', 'AR', 'BR', 'CR', 'DR'] # 3
    furniture_dict.update(dict.fromkeys(table_leg, 'table leg'))
    furniture_dict.update(dict.fromkeys(table_top, 'table top'))
    furniture_dict.update(dict.fromkeys(chair_leg, 'chair leg'))
    furniture_dict.update(dict.fromkeys(chair_back, 'chair leg'))
    furniture_dict.update(dict.fromkeys(bed_frame, 'bed frame'))
    furniture_dict.update(dict.fromkeys(bed_top, 'bed top'))
    furniture_dict.update(dict.fromkeys(shelf_frame, 'shelf frame'))
    furniture_dict.update(dict.fromkeys(shelf, 'shelf'))
    return furniture_dict

def create_furniture_action_df(df_actions, df):
    '''Returns dataframe with action codes mapped to parts, furniture items signified, when the last part of that item was built
       and for each parts signified if it was used in a furniture item or not
       Trial 6 with the two closing actions is ignored here'''
    furniture_dict = get_part_dictionary()
    df_built = df_actions[((df_actions.action_type == 'successful built' )| (df_actions.action_type == 'failed built' ))]
    df_built = df_built.reset_index()
    # map action codes to full furniture items
    df_built['furniture_parts']= df_built.action.map(furniture_dict)
    # set up empty columns
    df_built['counts'] = 0
    df_built['useful'] = 'not used'
    df_built['full_furniture'] = 'nothing'
    df_built['month'] = 0
    # overview of parts to full furniture
    tables = ['TL', 'TP', 'Table', 'PL04_']
    chairs = ['CB', 'CK',  'Chair', 'PL05_']
    bookcases = ['RF','RP', 'Bookcase', 'PL03_']
    beds = ['BE','BB', 'Bed', 'PL02_']
    furniture = [tables, chairs, bookcases, beds]

    for idx in  df_actions['vp'].unique():

        months = ast.literal_eval(df.loc[idx,'EO01_01'])

        for t in range(6):
            # count number of times a part was built

            df_built['counts'].update(df_built[(df_built['vp']==idx) & (df_built.trial ==  t) & (df_built.action_type == 'successful built') ].groupby("action").cumcount()+1  )
            # take out counts for failed built (if failed no other parts of that kind can be built again, so there are the last)
            df_built['counts'] = np.where((df_built.action_type == 'failed built'),0,df_built.counts)
            m = months[t]+1
            df_built['month'] = np.where(((df_built['vp']==idx) & (df_built.trial ==  t)), m, df_built.month)
            for item in furniture:
                # create lookup for soscisurvey data (oriented on months)

                if m< 10:
                    col_name = item[-1]+'0' +str(m)
                else:
                    col_name = item[-1]+str(m)
                # get number of full furniture items built from SosciSurvey data

                n_items = int(df.loc[idx,col_name])
                # tag used items with true, rest with false
                if n_items != 0:
                    df_built['useful'].update(df_built[(df_built['vp']==idx) & (df_built.trial ==  t) & (df_built.action ==  item[0])].counts <=  n_items  )
                    df_built['useful'].update(df_built[(df_built['vp']==idx) & (df_built.trial ==  t) & (df_built.action ==  item[1])].counts <=  n_items  )

                    for i in range(1,n_items+1):

                            # tag each time a full item was built ( max of each part needed)
                            r1 = df_built.index[(df_built['vp']==idx) & (df_built.trial ==  t)
                                           & (df_built.action ==  item[0]) & (df_built.counts == i)]

                            r2 = df_built.index[(df_built['vp']==idx) & (df_built.trial ==  t)
                                       &(df_built.action ==  item[1]) & (df_built.counts == i)]

                            row = max(r1,r2)

                            df_built.loc[row,'full_furniture'] = item[-2]
    # tag used, not used and failes actions
    df_built['useful'] = np.where((df_built.useful == True),'used',df_built.useful)
    df_built['useful'] = np.where((df_built.useful == False),'not used',df_built.useful)
    df_built['useful'] = np.where((df_built.action_type == 'failed built'),'failed',df_built.useful)
    return df_built



def map_actions(df_actions):
    '''Returns df with actions codes mapped to action types'''

    question_dlgs = ['XR', 'XA', 'XL', 'XC','XF','XT', 'XN', 'DO']
    closing_buildings = ['XG','XS','XW', 'XM'] # XW closes workshop buildings
    planning_buildings =  ['OS', 'O1', 'O2', 'RB', 'RR', 'RC', 'RT', 'ST']
    production_buildings = ['OA', 'OB', 'OC', 'OD']
    successful_actions = [ 'TL','TP','CB','CK','BE','BB','RF','RP']
    failed_actions = ['WT', 'MT', 'AT', 'BT', 'CT', 'DT', 'WP', 'MP', 'AP', 'BP', 'CP',
    'DP', 'WC', 'MC', 'AC', 'BC', 'CC', 'DC', 'WL', 'ML', 'AL', 'BL', 'CL', 'DL', 'WF', 'MF',
     'AF', 'BF', 'CF', 'DF', 'WG', 'MG', 'AG', 'BG', 'CG', 'DG', 'WS', 'MS', 'AS', 'BS', 'CS', 'DS',
     'WR', 'MR', 'AR', 'BR', 'CR', 'DR']
    sound = ['SM', 'SA']
    conditions = [
        (df_actions['action'].isin(question_dlgs)),
        (df_actions['action'].isin(closing_buildings)),
        (df_actions['action'].isin(planning_buildings)),
        (df_actions['action'].isin(production_buildings)),
        (df_actions['action'].isin(successful_actions)),
        (df_actions['action'].isin(failed_actions)),
        (df_actions['action'].isin(sound)),
        (df_actions['action']== 'XD'),
        (df_actions['action']== 'SK')
        ]

    # create a list of the values we want to assign for each condition
    values = ['question', 'close building', 'planning building', 'production building', 'successful built', 'failed built', 'sound', 'warning', 'skipped']

    # create a new column and use np.select to assign values to it using our lists as arguments
    df_actions['action_type'] = np.select(conditions, values)
    df_actions['minutes'] = df_actions['timepoint']/60
    return df_actions

def transform_action_df(df_raw):
    '''Returns dataframe with tuples from SosciSurvey split '''
    df_actions = pd.DataFrame(columns = ['action','timepoint','trial', 'vp']) # define columns of dataframe
    for index, row in df_raw.iterrows(): # go through each row
        actions= df_raw[df_raw.index.isin([index])].values # get the tuples of the action data
        df = pd.DataFrame(ast.literal_eval(actions[0][0]),columns = ['action','timepoint','trial']) # eval the string and add to dataframe
        df['vp'] = index
        df_actions =pd.concat([df_actions, df], ignore_index=True)

        #df_actions = df_actions.append(df) # add dataframe of one vp to the whole dataframe
    df_actions = map_actions(df_actions)
    #for vp in df_actions.vp.unique():

        #df_actions['trial'] = np.where(((df_actions['vp']==vp) & (df_built.trial ==  0)), m, df_built.month)


    # separate tutorial
    for vp in df_actions['vp'].unique():
        mx = df_actions.loc[(df_actions.vp== vp) &(df_actions.action_type == 'question')&(df_actions.trial == 0), 'timepoint'].max()
        df_actions.loc[(df_actions.timepoint < mx) & ( df_actions['vp']== vp) , 'trial'] = 100

    return df_actions

def get_complete_sol(df_resources):
    part_cost_dict = {'bed frame': [2,2,0,0,0,4], 'bed top': [2,1,0,0,3,0], 'shelf':[3,6,0,0,0,3],
                    'shelf frame':[2,1,0,0,5,0],'table leg': [0,4,4,0,0,0], 'table top':[2,1,0,6,0,0] ,
                    'chair leg': [4,0,4,0,0,0], 'chair back' :[0,1,0,1,0,0]}

    df_complete_sol = pd.DataFrame(columns = range(6))
    df_complete_sol.columns.name = 'trial'
    for vp in df_resources['vp'].unique():
        player_sol = []
        for t in range(6):

                last_timestep = df_resources.loc[(df_resources.trial == t)&(df_resources.vp == vp)].timepoint.idxmax()
                leftover = df_resources.loc[last_timestep, ['wood', 'metal', 'wsA', 'wsB', 'wsC', 'wsD']]
                unused_parts = df_resources.loc[(df_resources.trial == t)&(df_resources.vp == vp) & (df_resources.useful == 'not used'), 'furniture_parts']
                for i in range(len(unused_parts)):

                    leftover = leftover +part_cost_dict[unused_parts.iloc[i]]
                player_sol.append(is_complete(leftover.values))
        df_complete_sol.loc[len(df_complete_sol)]= player_sol

    df_complete_sol =df_complete_sol.set_index(df_resources['vp'].unique())
    return df_complete_sol




def is_complete(leftover_res):
    costs = np.array([[4., 3., 0., 0., 3., 4.],
                       [5., 7., 0., 0., 5., 3.],
                       [2., 5., 4., 6., 0., 0.],
                       [4., 1., 4., 1., 0., 0.]])
    for i in range(4):
        # if there is still an action possible
         if np.ndarray.min(leftover_res-costs[i]) >= 0:
            return False

    return True


def get_player_solution(df, df_resources):
    df['EO01_01']
    ps = 'PL01_'
    ms = 'MD01_'

    info = []
    df_complete_sol = get_complete_sol(df_resources)
    df_complete_sol['vp'] = df_complete_sol.index

    df_c = df_complete_sol.melt(value_name = 'complete', id_vars = 'vp')

    for index, row in df.iterrows():

        if row['EO01_01'] is not np.nan:
            i = 1
            for m in ast.literal_eval( row['EO01_01']):
                if df_c[(df_c.vp ==index) & (df_c.trial== i-1)].complete.values[0] == False:
                    comp = 'incomplete'
                else:
                    comp = 'complete'
                if m< 9:
                    diff = ((row[ps+'0'+str(m+1)] / row[ms+'0'+str(m+1)]) -1) *100
                    info.append([index, row[ps+'0'+str(m+1)],  row[ms+'0'+str(m+1)], diff, i, m+1,comp] )
                else:
                    diff = ((row[ps+str(m+1)] / row[ms+str(m+1)]) -1) *100
                    info.append([index, row[ps+str(m+1)],  row[ms+str(m+1)], diff, i, m+1, comp] )
                i +=1
    df_vp_sol = (pd.DataFrame(info, columns = ['vp', 'profit', 'optimum', 'difference', 'trial', 'month','complete']))

    #df_complete_mask = df_complete_sol.melt(value_name = 'complete')

    #df_vp_sol['complete'] = np.where((df_vp_sol['complete'] == True),'complete',df_vp_sol.complete)
    #df_vp_sol['complete'] = np.where((df_vp_sol['complete'] == False),'incomplete',df_vp_sol.complete)
    #df_vp_sol['complete'] = np.where((df_vp_sol['interrupted'] == 1),'interrupted',df_vp_sol.complete)

    return df_vp_sol

def read_cache(directory):
        df = pd.read_pickle(directory + 'cached_df.pkl')
        df_model= pd.read_pickle(directory + 'cached_df_model.pkl')
        df_vp_sol= pd.read_pickle(directory + 'cached_df_vp_sol.pkl')
        df_qual= pd.read_pickle(directory + 'cached_df_qual.pkl')
        df_actions= pd.read_pickle(directory + 'cached_df_actions.pkl')
        df_furniture= pd.read_pickle(directory + 'cached_df_furniture.pkl')
        df_resources= pd.read_pickle(directory + 'cached_df_resources.pkl')
        df_play_times= pd.read_pickle(directory + 'cached_df_playtimes.pkl')
        df_general= pd.read_pickle(directory + 'cached_df_general.pkl')
        return df, df_model, df_general, df_vp_sol, df_qual, df_actions, df_furniture, df_resources, df_play_times

def decompose_csv(file_identifier):
    '''Returns all dataframes to callcuate from data'''
    directory = 'data_cache/' + file_identifier[-20:-4] + '/'
    if not os.path.exists(directory):
        os.makedirs(directory)

    if not os.listdir(directory):
        df = pd.read_csv(file_identifier,  encoding = 'UTF-16', sep = ';') # read file
        df =df.drop(df.columns[1:5], axis = 1) # drop unnecessary cells
        df = df.drop(df.columns[-8:], axis = 1)
        df = df[df['LG01_01'].notna()] # drop records were we tested/which were not played
        df = df[df['UD01_RV1'].notna()]
        df = df.set_index('CASE') # set case identifier as index
        # drop due to no complete submitted solutions
        df = df.drop(96)
        df = df.drop(118)
        df = df.drop(123)
        df = df.drop(136)
        # drop due to tapping out too often/long
        df = df.drop(143)
        df = df.drop(93)

        #group 2
        # no complete solution
        df = df.drop(152)
        df = df.drop(154) # & at least one month with no item
        df = df.drop(157) # & at least one month with no item
        df = df.drop(158) # & at least one month with no item
        df = df.drop(159)
        df = df.drop(160) # & at least one month with no item
        df = df.drop(161) # &failed first attention check
        df = df.drop(174)
        df = df.drop(175) # & build in one month only one item
        df = df.drop(179) # & failed second attention check

        # group 3
        df = df.drop(185) # did not build anything was asked to return
        # no complete solution
        df = df.drop(182)
        df = df.drop(183)
        df = df.drop(195)
        df = df.drop(200) # actually not that bad
        df = df.drop(201)
        df = df.drop(203)

        # group 4
        # no complete solution
        df = df.drop(212)
        df = df.drop(213)
        df = df.drop(219)
        df = df.drop(225)

        df_model = df.filter(regex='MD') # dataframe for model parameters
        df_general =   df[['GE13', 'GE15', 'GE16','GE17_01','CQ01_01', 'CQ01_02']].copy() # dataframe for general questions

         # dataframe for player data

        # qualitative data
        df_likert = df.filter(regex='AS0')

        #df_full_time = df.filter(regex='TI') # get full time of the experiment
        df_actions_raw = df.filter(regex='LG') # dataframe for action codes
        df_actions = transform_action_df(df_actions_raw) # transform to useful dataframe
        df_furniture= create_furniture_action_df(df_actions, df)
        df_resources = create_df_resources(df_furniture, df_actions)
        df_play_times = calculate_monthly_playtime(df_actions)
        df_vp_sol = get_player_solution(df, df_resources)

        df.to_pickle(directory + 'cached_df.pkl')
        df_model.to_pickle(directory + 'cached_df_model.pkl')
        df_vp_sol.to_pickle(directory + 'cached_df_vp_sol.pkl')
        df_likert.to_pickle(directory + 'cached_df_qual.pkl')
        df_actions.to_pickle(directory + 'cached_df_actions.pkl')
        df_furniture.to_pickle(directory + 'cached_df_furniture.pkl')
        df_resources.to_pickle(directory + 'cached_df_resources.pkl')
        df_play_times.to_pickle(directory + 'cached_df_playtimes.pkl')
        df_general.to_pickle(directory + 'cached_df_general.pkl')
        return df, df_model, df_general, df_vp_sol, df_likert, df_actions, df_furniture, df_resources, df_play_times
    else:
        print('read cache')
        return  read_cache(directory)
