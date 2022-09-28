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

    resources_month, _, cost_dict = load_lp_model()
    # only use successful building actions for the calcukation
    df_resources = df_built[(df_built.action_type == 'successful built') & (df_built.month > 0) ]
    df_resources = df_resources.reset_index()
    df_resources = df_resources.drop(['index','action' , 'level_0', 'counts', 'action_type'],  axis=1)
    resources = ['wood', 'metal', 'wsA', 'wsB', 'wsC', 'wsD']


    df_resources[resources] = 0
    df_resources.timepoint = pd.to_numeric(df_resources.timepoint)
    initial =pd. DataFrame(columns = df_resources.columns)
    for vp in df_resources['vp'].unique():
        for m in range(1,13):
            try:
                # needed because one person did not built any item in month 1
            #    print(df_resources[(df_resources.month == m)&(df_resources.vp == vp)].timepoint)
                first = df_resources[(df_resources.month == m)&(df_resources.vp == vp)].timepoint.idxmin()
                first_timepoint =  df_actions[(df_actions.month == m)&(df_actions.vp == vp)].timepoint.min()
            except ValueError:
                pass

                # set initial resources in each month: initial resources - first action cost
            df_resources.loc[first,resources] =  resources_month[m-1]- cost_dict[df_resources.loc[first, 'furniture_parts']]

            idxs = df_resources[(df_resources.month == m)&(df_resources.vp == vp)].index
            for i in range(1,len(idxs)):
                    df_resources.loc[idxs[i], resources] = df_resources.loc[idxs[i-1], resources]- cost_dict[df_resources.loc[idxs[i], 'furniture_parts']]

            initial.loc[len(initial)] = [first_timepoint, m, vp, first_timepoint/60, 'na', 'na', 'na', 0,0,0,0,0,0 ]
            initial.loc[len(initial)-1, resources ] = resources_month[m-1]
    df_resources =pd.concat([df_resources, initial], ignore_index=True) #df_resources.append(initial)
    df_resources[resources] = df_resources[resources].apply(pd.to_numeric)
    return df_resources


def get_diff_mask(df_vp_sol, df_model, df_complete_sol):
    df_diff = get_df_diff(df_vp_sol, df_model)
    df_plot = df_diff.melt(value_name = 'difference', ignore_index=False)#

    df_complete_mask = df_complete_sol.melt(value_name = 'complete', ignore_index=False)

    df_interrupted = df_vp_sol.filter(regex='^PL06',axis=1).copy()
    df_interrupted['PL06_12'] = 0
    df_interrupted.columns =(range(1,13))
    df_interrupted = df_interrupted.melt(value_name = 'interrupted', ignore_index=False)

    df_diff_with_mask = pd.concat([df_plot, df_complete_mask['complete'], df_interrupted['interrupted']], axis = 1)
    df_diff_with_mask['complete'] = np.where((df_diff_with_mask['complete'] == True),'complete',df_diff_with_mask.complete)
    df_diff_with_mask['complete'] = np.where((df_diff_with_mask['complete'] == False),'incomplete',df_diff_with_mask.complete)
    df_diff_with_mask['complete'] = np.where((df_diff_with_mask['interrupted'] == 1),'interrupted',df_diff_with_mask.complete)

    return df_diff_with_mask





def calculate_monthly_playtime(df_actions):
    '''Calculate the timepoint relative to the start of the month (how much time was spent in month)'''

    vp_list = df_actions['vp'].unique()

    df_play_times = pd.DataFrame(columns = range(0,13))
    df_play_times.columns.name = 'month'
    df_actions.timepoint = pd.to_numeric(df_actions.timepoint)

    for vp in vp_list :

        df_vp = df_actions[df_actions['vp']== vp]
        # the play phase in most months starts after the newspaper or a question window was closed
        df_messages = df_vp[(df_vp.action_type == 'question') ]
        start_month = []
        end_month = []
        first_action_month = []
        for i in range(0,13):
            if i == 0:
                # in tutorial, just take the minimum action as start
                #start_month = pd.concat([start_month, df_vp['timepoint'].min()], ignore_index=True)
                start_month.append(df_vp['timepoint'].min())
                #end_month = pd.concat([end_month, df_vp[df_vp.month==i]['timepoint'].max()], ignore_index=True)
                end_month.append(df_vp[df_vp.month==i]['timepoint'].max())

            elif i == 12:
                # in the last month take the last message as endpoint and count the newspaper close as start
                #start_month = pd.concat([start_month, df_messages[(df_messages.month == i) & (df_messages.action == 'XN')]['timepoint'].max()], ignore_index=True)

                start_month.append(df_messages[(df_messages.month == i) & (df_messages.action == 'XN')]['timepoint'].max())
                idx = df_messages[(df_messages.month == i)]['timepoint'].idxmax()
                #end_month = pd.concat([end_month, df_vp.loc[idx-1]['timepoint']], ignore_index=True)
                end_month.append(df_vp.loc[idx-1]['timepoint'])

            else:
            #    start_month = pd.concat([start_month, df_messages[df_messages['month']==i]['timepoint'].max()], ignore_index=True)

                start_month.append(df_messages[df_messages['month']==i]['timepoint'].max())
                #end_month = pd.concat([end_month, df_vp[df_vp['month']==i]['timepoint'].max()], ignore_index=True)

                end_month.append(df_vp[df_vp['month']==i]['timepoint'].max())


        month_play_time = []
        for i in range(13):
            month_play_time.append(end_month[i]-start_month[i])
        month_play_minutes = [seconds/60 for seconds in month_play_time]
        df_play_times.loc[len(df_play_times)]= month_play_minutes

    df_play_times =df_play_times.set_index(vp_list)
    df_play_times = df_play_times.melt(value_name = 'minutes', ignore_index=False)#
    df_play_times.loc[(df_play_times.index == 170) & (df_play_times.month == 12), 'minutes'] = 3
    df_play_times.loc[(df_play_times.index == 188) & (df_play_times.month == 12), 'minutes'] = 3
    df_play_times.loc[(df_play_times.index == 230) & (df_play_times.month == 12), 'minutes'] = 3
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

def create_furniture_action_df(df_actions, df_vp_sol):
    '''Returns dataframe with action codes mapped to parts, furniture items signified, when the last part of that item was built
       and for each parts signified if it was used in a furniture item or not'''
    furniture_dict = get_part_dictionary()
    df_built = df_actions[((df_actions.action_type == 'successful built' )| (df_actions.action_type == 'failed built' ))]
    df_built = df_built.reset_index()
    df_built['furniture_parts']= df_built.action.map(furniture_dict)
    df_built['counts'] = 0
    df_built['useful'] = 'not used'
    df_built['full_furniture'] = 'nothing'
    tables = ['TL', 'TP', 4, 1, 'Table', 'PL04_']
    chairs = ['CB', 'CK', 4, 1, 'Chair', 'PL05_']
    bookcases = ['RF','RP', 1, 3, 'Bookcase', 'PL03_']
    beds = ['BE','BB', 1,2 , 'Bed', 'PL02_']
    furniture = [tables, chairs, bookcases, beds]
    for idx in  df_actions['vp'].unique():
        for m in range(1,13):
            # count number of times a part was built
            df_built['counts'].update(df_built[(df_built['vp']==idx) & (df_built.month ==  m) ].groupby("action").cumcount()+1  )
            # take out counts for failed built (if failed no other parts of that kind can be built again)
            df_built['counts'] = np.where((df_built.action_type == 'failed built'),0,df_built.counts)
            for item in furniture:
                # create lookup for soscifurvey data
                if m< 10:
                    col_name = item[-1]+'0' +str(m)
                else:
                    col_name = item[-1]+str(m)
                # get number of full furniture items built from SosciSurvey data
                n_items = int(df_vp_sol.loc[idx,col_name])
                # tag used items with true, rest with false
                if n_items != 0:
                    df_built['useful'].update(df_built[(df_built['vp']==idx) & (df_built.month ==  m) & (df_built.action ==  item[0])].counts <=  n_items * item[2] )
                    df_built['useful'].update(df_built[(df_built['vp']==idx) & (df_built.month ==  m) & (df_built.action ==  item[1])].counts <=  n_items * item[3] )
                    for i in range(1,n_items+1):
                            # tag each time a full item was built ( max of each part needed)
                            r1 = df_built.index[(df_built['vp']==idx) & (df_built.month ==  m)
                                           &(df_built.action ==  item[0]) & (df_built.counts == i*item[2])]

                            r2 = df_built.index[(df_built['vp']==idx) & (df_built.month ==  m)
                                       &(df_built.action ==  item[1]) & (df_built.counts == i*item[3])]
                            row = max(r1,r2)

                            df_built.loc[row,'full_furniture'] = item[-2]
    # tag used, not used and failes actions
    df_built['useful'] = np.where((df_built.useful == True),'used',df_built.useful)
    df_built['useful'] = np.where((df_built.useful == False),'not used',df_built.useful)
    df_built['useful'] = np.where((df_built.action_type == 'failed built'),'failed',df_built.useful)
    return df_built



def map_actions(df_actions):
    '''Returns df with actions codes mapped to action types'''

    question_dlgs = ['XR', 'XA', 'XL', 'XF','XT', 'XN']
    closing_buildings = ['XG','XS','XW', 'XM', 'DO'] # XW closes workshop buildings
    planning_buildings =  ['OS', 'O1', 'O2', 'RB', 'RR', 'RC', 'RT', 'ST']
    production_buildings = ['OA', 'OB', 'OC', 'OD']
    successful_actions = [ 'TL','TP','CB','CK','BE','BB','RF','RP']
    failed_actions = ['WT', 'MT', 'AT', 'BT', 'CT', 'DT', 'WP', 'MP', 'AP', 'BP', 'CP', 'DP', 'WC', 'MC', 'AC', 'BC', 'CC', 'DC', 'WL', 'ML', 'AL', 'BL', 'CL', 'DL', 'WF', 'MF', 'AF', 'BF', 'CF', 'DF', 'WG', 'MG', 'AG', 'BG', 'CG', 'DG', 'WS', 'MS', 'AS', 'BS', 'CS', 'DS', 'WR', 'MR', 'AR', 'BR', 'CR', 'DR']
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
    df_actions = pd.DataFrame(columns = ['action','timepoint','month', 'vp']) # define columns of dataframe
    for index, row in df_raw.iterrows(): # go through each row
        actions= df_raw[df_raw.index.isin([index])].values # get the tuples of the action data
        df = pd.DataFrame(ast.literal_eval(actions[0][0]),columns = ['action','timepoint','month']) # eval the string and add to dataframe
        df['vp'] = index
        df_actions =pd.concat([df_actions, df], ignore_index=True)
        #df_actions = df_actions.append(df) # add dataframe of one vp to the whole dataframe
    df_actions = map_actions(df_actions)

    # separate tutorial
    for vp in df_actions['vp'].unique():
        mx = df_actions.loc[(df_actions.vp== vp) &(df_actions.action_type == 'question')&(df_actions.month == 1), 'timepoint'].max()
        df_actions.loc[(df_actions.timepoint < mx) & ( df_actions['vp']== vp) , 'month'] = 0
    return df_actions

def get_complete_sol(df_resources):
    part_cost_dict = {'bed frame': [1,1,0,0,0,2], 'bed top': [2,1,0,0,3,0], 'shelf':[1,2,0,0,0,1],
                      'shelf frame':[2,1,0,0,5,0],'table leg': [0,1,1,0,0,0], 'table top':[2,1,0,6,0,0] ,
                      'chair leg': [1,0,1,0,0,0], 'chair back' :[0,1,0,1,0,0]}
    df_complete_sol = pd.DataFrame(columns = range(1,13))
    df_complete_sol.columns.name = 'month'
    for vp in df_resources['vp'].unique():
        player_sol = []
        for m in range(1,13):

                last_timestep = df_resources.loc[(df_resources.month == m)&(df_resources.vp == vp)].timepoint.idxmax()
                leftover = df_resources.loc[last_timestep, ['wood', 'metal', 'wsA', 'wsB', 'wsC', 'wsD']]
                unused_parts = df_resources.loc[(df_resources.month == m)&(df_resources.vp == vp) & (df_resources.useful == 'not used'), 'furniture_parts']
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


def get_df_diff(df_vp_sol, df_model):
    difference = ((df_vp_sol.filter(regex='PL01').values/df_model.filter(regex = 'MD01').iloc[0].values)-1)*100
    df_diff = pd.DataFrame(difference, columns = list(range(1,13)))
    df_diff['vp'] = df_vp_sol.index#range(1, len(df_diff) + 1)
    df_diff = df_diff.set_index('vp')
    df_diff.columns.name = 'month'
    return df_diff


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
        df = df[df['MD01_01'].notna()] # drop records were we tested/which were not played

        df = df.set_index('CASE') # set case identifier as index
        df = df.drop(125) # drop the first test data
        df = df.drop(184)
        df = df.drop(227)
        df = df.drop(228)
        df = df.drop(143)

        df_model = df.filter(regex='MD') # dataframe for model parameters
        df_general = df.filter(regex='GE') # dataframe for general questions
        df_vp_sol = df.filter(regex='PL') # dataframe for player data

        # qualitative data
        df_free_answers = df.filter(regex='AN')
        df_assessment = df.filter(regex='AS0')
        df_mike_feedback = df.filter(regex='FB')
        df_qual = pd.concat([df_free_answers, df_mike_feedback, df_assessment], axis=1) # concatenate qualitative data

        #df_full_time = df.filter(regex='TI') # get full time of the experiment
        df_actions_raw = df.filter(regex='LG') # dataframe for action codes
        df_actions = transform_action_df(df_actions_raw) # transform to useful dataframe
        df_furniture= create_furniture_action_df(df_actions, df_vp_sol)
        df_resources = create_df_resources(df_furniture, df_actions)
        df_play_times = calculate_monthly_playtime(df_actions)
        df.to_pickle(directory + 'cached_df.pkl')
        df_model.to_pickle(directory + 'cached_df_model.pkl')
        df_vp_sol.to_pickle(directory + 'cached_df_vp_sol.pkl')
        df_qual.to_pickle(directory + 'cached_df_qual.pkl')
        df_actions.to_pickle(directory + 'cached_df_actions.pkl')
        df_furniture.to_pickle(directory + 'cached_df_furniture.pkl')
        df_resources.to_pickle(directory + 'cached_df_resources.pkl')
        df_play_times.to_pickle(directory + 'cached_df_playtimes.pkl')
        df_general.to_pickle(directory + 'cached_df_general.pkl')
        return df, df_model, df_general, df_vp_sol, df_qual, df_actions, df_furniture, df_resources, df_play_times
    else:
        print('read cache')
        return  read_cache(directory)
