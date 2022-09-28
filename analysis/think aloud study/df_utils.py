import pandas as pd
import numpy as np
import ast
import json
import os
from lp_parser import parse_lp


def load_lp_model():
    '''Load the model description containing resources and profits given in each month and the costs of parts'''
    instance_model = parse_lp('model_v6_parts.lp')
    keys_res = list(instance_model['resources'].keys())
    months = len(instance_model['resources'][keys_res[0]])
        # assign resources
    resources_month = np.zeros((months,len(keys_res)))
    for i in range(len(keys_res)):
        resources_month[:,i] = instance_model['resources'][keys_res[i]]

    # make array for rewards for full furniture items
    furniture_keys = list(instance_model['costs'].keys())
    rewards_month = np.zeros((months,4))
    for j in range(4):
        rewards_month[:, j] = np.array(list(instance_model['profit'][furniture_keys[j]]))
    # action number corresponds to the parts which can be built
    action_number = 4
    # cost dict not defined in optimal solution
    cost_dict = {'bed frame': [1,1,0,0,0,2], 'bed top': [2,1,0,0,3,0], 'shelf':[1,2,0,0,0,1], 'shelf frame':[2,1,0,0,5,0],'table leg': [0,1,1,0,0,0], 'table top':[2,1,0,6,0,0] ,'chair leg': [1,0,1,0,0,0], 'chair back' :[0,1,0,1,0,0]}
    return resources_month, rewards_month, cost_dict

def create_df_resources(df_built, df_actions):
    '''Calculate the amount of material/workshop hours left after each decision to built'''

    resources_month, _, cost_dict = load_lp_model()
    # only use successful building actions for the calcukation
    df_resources = df_built[(df_built.action_type == 'successful built') & (df_built.month > 0) ]
    df_resources = df_resources.reset_index()
    df_resources = df_resources.drop(['index','action' , 'level_0', 'counts', 'action_type'],  axis=1)
    resources = ['wood', 'metal', 'wsA', 'wsB', 'wsC', 'wsD']


    df_resources[resources] = 0
    initial =pd. DataFrame(columns = df_resources.columns)
    for vp in df_resources['vp'].unique():
        for m in range(1,13):
            try:
                # needed because one person did not built any item in month 1
                first = df_resources[(df_resources.month == m)&(df_resources.vp == vp)].timepoint.idxmin()
                first_timepoint =  df_actions[(df_actions.month == m)&(df_actions.vp == vp)].timepoint.min()
            except ValueError:
                pass

                # set initial resources in each month: initial resources - first action cost
            df_resources.loc[first,resources] =  resources_month[m-1]- cost_dict[df_resources.loc[first, 'furniture_parts']]

            idxs = df_resources[(df_resources.month == m)&(df_resources.vp == vp)].index
            for i in range(1,len(df_resources[(df_resources.month == m)&(df_resources.vp == vp)])):
                    df_resources.loc[idxs[i], resources] = df_resources.loc[idxs[i-1], resources]- cost_dict[df_resources.loc[idxs[i], 'furniture_parts']]

            initial.loc[len(initial)] = [first_timepoint, m, vp, first_timepoint/60, 'na', 'na', 'na', 0,0,0,0,0,0 ]
            initial.loc[len(initial)-1, resources ] = resources_month[m-1]
    df_resources = df_resources.append(initial)
    df_resources[resources] = df_resources[resources].apply(pd.to_numeric)
    return df_resources

def calculate_monthly_playtime(df_actions):
    '''Calculate the timepoint relative to the start of the month (how much time was spent in month)'''

    vp_list = df_actions['vp'].unique()

    df_play_times = pd.DataFrame(columns = range(7))
    df_play_times.columns.name = 'month'
    for vp in vp_list :
        df_vp = df_actions[df_actions['vp']== vp]
        # the play phase in most months starts after the newspaper or a question window was closed
        start_month = []
        end_month = []
        for i in range(1,8):
            if i == 1:
                # in tutorial, just take the minimum action as start
                start_month.append(df_vp['timepoint'].min())
                end_month.append( df_vp[(df_vp.action== 'TY')]['timepoint'].values)

            else:
                # in the last month take the last message as endpoint and count the newspaper close as start
                start_month.append(df_vp[(df_vp.month==i)]['timepoint'].min())
                end_month.append(df_vp[(df_vp.month==i) & (df_vp.action == 'NM')]['timepoint'].values)

        month_play_time = []
        for i in range(7):
            month_play_time.append(end_month[i]-start_month[i])

        month_play_minutes = [seconds/60 for seconds in month_play_time]
        df_play_times.loc[len(df_play_times)]= month_play_minutes

    df_play_times =df_play_times.set_index(vp_list)
    df_play_times = df_play_times.melt(value_name = 'minutes', ignore_index=False)#

    return df_play_times

def map_actions(df_actions):
    '''Returns df with actions codes mapped to action types'''
    tutorial = ['TX', 'TY']
    question_dlgs = ['RX', 'RY', 'DO', 'MO' , 'XP']
    warning  = ['XY', 'XN']
    successful_actions = ['IS', 'IT', 'IR', 'IB', 'DS', 'DT', 'DR', 'DB', 'SS', 'ST', 'SR', 'SB', 'ZS', 'ZT', 'ZR', 'ZB', 'EA', 'EB', 'EC', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EJ', 'EK', 'EL', 'EM', 'EN', 'EO', 'EP', 'EQ', 'ER', 'ES', 'ET', 'EU', 'EV', 'EW', 'EX', 'OA', 'OB', 'OC', 'OD', 'OE', 'OF', 'OG', 'OH', 'OI', 'OJ', 'OK', 'OL', 'OM', 'ON', 'OO', 'OP', 'OQ', 'OR', 'OS', 'OT', 'OU', 'OV', 'OW', 'OX']
    failed_actions = ['HS', 'MS', 'AS', 'BS', 'CS', 'FS', 'HT', 'MT', 'AT', 'BT', 'CT', 'FT', 'HR', 'MR', 'AR', 'BR', 'CR', 'FR', 'HB', 'MB', 'AB', 'BB', 'CB', 'FB', 'NS', 'NT', 'NR', 'NB']
    stay_action = ['TS', 'TT', 'TR', 'TB']
    conditions = [
        (df_actions['action'].isin(tutorial)),
        (df_actions['action'].isin(question_dlgs)),
        (df_actions['action'].isin(successful_actions)),
        (df_actions['action'].isin(failed_actions)),
        (df_actions['action'].isin(stay_action)),
        (df_actions['action'].isin(warning)),
        (df_actions['action']== 'NM')
        ]

    # create a list of the values we want to assign for each condition
    values = ['tutorial','question', 'successful built', 'failed built', 'change nothing', 'warning', 'end month']

    # create a new column and use np.select to assign values to it using our lists as arguments
    df_actions['action_type'] = np.select(conditions, values)
    df_actions['minutes'] = df_actions['timepoint']/60
    return df_actions

def transform_action_df(df_raw):

    '''Returns dataframe with tuples from SosciSurvey split '''
    cur_dir =  os.getcwd()
    parent_dir = os.path.dirname(os.path.dirname(cur_dir))
    df_actions = pd.DataFrame(columns = ['action','timepoint','month', 'vp']) # define columns of dataframe
    c=0
    for index, row in df_raw.iterrows(): # go through each row
         # get the tuples of the action data
        #if c > 1:
        #    print(str(actions[0][0]))
        if index == 272:
            actions= df_raw[df_raw.index.isin([index])].values
            df_tp = pd.DataFrame(ast.literal_eval(str(actions[0][0])),columns = ['action','timepoint','month', 'slider_state'])
            df_built = df_tp['slider_state'].apply(pd.Series)
            df_built.columns =  ['chairs', 'tables', 'bookcases', 'beds']
            df = pd.concat([df_built, df_tp[['action','timepoint','month']]],axis = 1)
        elif index == 279:
            missing_data=parent_dir +'/data/think_aloud/'+'vp_'+str(index)+'_LG01_01'
            with open(missing_data) as f:
                lines = f.readlines()
            actions = lines[0]
            df_tp = pd.DataFrame(ast.literal_eval(str(actions)),columns = ['action','timepoint','month', 'slider_state'])
            df_built = df_tp['slider_state'].apply(pd.Series)
            df_built.columns =  ['chairs', 'tables', 'bookcases', 'beds']
            df = pd.concat([df_built, df_tp[['action','timepoint','month']]],axis = 1)

        else:
            actions= df_raw[df_raw.index.isin([index])].values

            df = pd.DataFrame(ast.literal_eval(str(actions[0][0])),columns = ['action','timepoint','month', 'chairs', 'tables', 'bookcases', 'beds'])

            # eval the string and add to dataframe
        df['vp'] = index
        df_actions = df_actions.append(df) # add dataframe of one vp to the whole dataframe
        c+=1
    df_actions = map_actions(df_actions)

    # separate tutorial
    for vp in df_actions['vp'].unique():
        mx = df_actions.loc[(df_actions.vp== vp) &(df_actions.action_type == 'question')&(df_actions.month == 1), 'timepoint'].max()
        df_actions.loc[(df_actions.timepoint < mx) & ( df_actions['vp']== vp) , 'month'] = 0


    return df_actions


def decompose_csv(file_identifier):
    '''Returns all dataframes to callcuate from data'''
    df = pd.read_csv(file_identifier,  encoding = 'UTF-16', sep = ';') # read file
    df =df.drop(df.columns[1:5], axis = 1) # drop unnecessary cells
    df = df.drop(df.columns[-8:], axis = 1)
    #df = df[df['MD01_01'].notna()] # drop records were we tested/which were not played

    df = df.set_index('CASE') # set case identifier as index
    df = df.drop(223) # drop the first test data
    df = df.drop(224)
    df = df.drop(228) # NaN pilot
    df = df.drop(314)#failed experiment 
    df_model = df.filter(regex='MD') # dataframe for model parameters
    df_general = df.filter(regex='GE') # dataframe for general questions
    df_vp_sol = df.filter(regex='PL') # dataframe for player data

    # qualitative data
    df_free_answers = df.filter(regex='AN')
    df_assessment = df.filter(regex='AS0')
    df_mike_feedback = df.filter(regex='FB')
    df_qual = pd.concat([df_free_answers, df_mike_feedback, df_assessment], axis=1) # concatenate qualitative data

    df_full_time = df.filter(regex='TI') # get full time of the experiment
    df_actions_raw = df.filter(regex='LG') # dataframe for action codes
    df_actions = transform_action_df(df_actions_raw) # transform to useful dataframe
#    df_resources = create_df_resources(df_furniture, df_actions)
    return df, df_model, df_general, df_vp_sol, df_qual, df_full_time, df_actions#, df_furniture, df_resources
