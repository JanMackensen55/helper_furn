import pandas as pd
import numpy as np
import ast
import json
import os
import sys



def load_lp_model(modelfile = 'online_model.lp'):
    '''Load the model description containing resources and profits given in each month and the costs of parts'''
    #instance_model = parse_lp('model_v6_parts.lp')
    #path =sys.path[0]
    path =  os.path.dirname(os.path.realpath(__file__))
    instance_model = parse_lp(path + '/' + modelfile)
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
    # cost dict not defined in optimal solution
    cost_dict = {'bed frame': [1,1,0,0,0,2], 'bed top': [2,1,0,0,3,0], 'shelf':[1,2,0,0,0,1], 'shelf frame':[2,1,0,0,5,0],'table leg': [0,1,1,0,0,0], 'table top':[2,1,0,6,0,0] ,'chair leg': [1,0,1,0,0,0], 'chair back' :[0,1,0,1,0,0]}
    return resources_month, rewards_month, cost_dict




def parse_lp(file):
    """
    Parses the linear problem and converts it to a dictionary

    Args:
    file: the path to the linear problem
    """
    lp = read_file(file)
    # read out number of months in the problem
    months = int(int(lp[-3][-2:])/4)
    costs = parse_costs(lp, months)
    resources = parse_resources(lp, months)
    profit = parse_profit(lp, months)
    result = {
        'resources': resources,
        'costs': costs,
        'profit': profit
    }
    #print(result)
    return result




def parse_resources(lp, months):
    """
    Parse the resources of every item from the given linear program
    """
    resource_list = list(filter(lambda e: e.startswith('<='),lp))
    materials = list(map(lambda e: int(e.split(' ')[1]),resource_list[0:months*2]))#14
    wood = [e for i, e in enumerate(materials) if i % 2 == 0]
    metal = [e for i, e in enumerate(materials) if i % 2 != 0]
    hours = list(map(lambda e: int(e.split(' ')[1]),resource_list[months*2:(months*2)+4]))#14:18
    available_resources = {
        'wood': wood,
        'metal': metal,
        'hours A': hours.pop(0),
        'hours B': hours.pop(0),
        'hours C': hours.pop(0),
        'hours D': hours.pop(0)
    }
    return available_resources


def parse_costs(lp, months):
    """
    Parse the costs of every item of the given linear program

    Args:
    lp: the linear problem
    """
    costs_list = list(filter(lambda e: e.startswith('+'), lp[slice(lp.index('s.t.'), len(lp))]))
    costs_list = list(map(lambda e: e.split(' '), costs_list))
    costs_bed = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x1',costs_list)))
    costs_bookcase = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str(months+1),costs_list)))# 15
    costs_table = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str((months*2)+1),costs_list)))# 22
    costs_chair = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str((months*3)+1),costs_list)))#8
    costs = {
        'Bed' : {
            'wood': costs_bed.pop(0),
            'metal': costs_bed.pop(0),
            'hours A': 0,
            'hours B': 0,
            'hours C': costs_bed.pop(0),
            'hours D': costs_bed.pop(0)
        },
        'Bookcase' : {
            'wood': costs_bookcase.pop(0),
            'metal': costs_bookcase.pop(0),
            'hours A': 0,
            'hours B': 0,
            'hours C': costs_bookcase.pop(0),
            'hours D': costs_bookcase.pop(0)
        },
        'Table' : {
            'wood': costs_table.pop(0),
            'metal': costs_table.pop(0),
            'hours C': 0,
            'hours D': 0,
            'hours A': costs_table.pop(0),
            'hours B': costs_table.pop(0)
        },
        'Chair' : {
            'wood': costs_chair.pop(0),
            'metal': costs_chair.pop(0),
            'hours C': 0,
            'hours D': 0,
            'hours A': costs_chair.pop(0),
            'hours B': costs_chair.pop(0)
        },
    }
    return costs


def parse_profit(lp, months):
    """
    Parse the profit variables from the given linear problem

    Args:
    lp: the linear problem to parse
    """
    profit_list = list(filter(lambda e: e.startswith('+'), lp[slice(0, lp.index('s.t.'))]))
    profit_list = list(map(lambda e: e.split(' '), profit_list))
    profit_list.sort(key=lambda a: int(a[1].split('x')[1]))

    profit_numbers = list(map(lambda e: int(e[0]), profit_list))
    profit = {
        'Bed': profit_numbers[slice(0,months)],#7
        'Bookcase': profit_numbers[slice(months,2*months)],#7
        'Table': profit_numbers[slice(2*months,3*months)],#7
        'Chair': profit_numbers[slice(3*months,4*months)]#7
    }
    return profit


def read_file(path):
    """
    Reads a file for further processing.

    Args:
    path: the path to the desired file.

    """


    with open(path, 'r') as f:
        file = f.read()

    return file.split('\n')


def leftover_res_model(df_model):
    """ calculate the leftover resources for the model solutions
    """

    path =sys.path[0]
    instance_model = parse_lp(path + '/online_model.lp')

    keys_res = list(instance_model['resources'].keys())
    months = len(instance_model['resources'][keys_res[0]])

    resources_month = np.zeros((months,len(keys_res)))
    for i in range(len(keys_res)):
        resources_month[:,i] = instance_model['resources'][keys_res[i]]

    costs = np.zeros((4,6))
    furniture_keys = list(instance_model['costs'].keys())

    for i in range(len(furniture_keys)):
        for j in range(len(keys_res)) :
            costs[i,j] = instance_model['costs'][furniture_keys[i]][keys_res[j]]
    df_model.loc[df_model.index == 132]
    furn = ['MD02_','MD03_', 'MD04_', 'MD05_' ]
    df_leftover = pd.DataFrame(columns = range(0,6))
    for m in range(1,13):
        res = resources_month[m-1] # initial resources
        for i in range(len(furn)):

            if m< 10:
                col_name = furn[i]+'0' +str(m)
            else:
                col_name = furn[i]+str(m)
            res = res - int(df_model.loc[(df_model.index==132), col_name ].values)*costs[i]
        df_leftover.loc[len(df_leftover)] = res
    df_leftover.columns = ['wood', 'metal','wsA', 'wsB', 'wsC', 'wsD' ]
    df_leftover.insert(0, 'month', range(1,13))
    return df_leftover




def add_objective(m, profits, time):
        """Add the objective to the linear model

        Args:
            m (ConcreteModel): A linear model to add the objective to.
maximum_indices = np.where(A==max(a))
        Returns:
            ConcreteModel: The model with the newly added objective.
        """

        m.cost = pyo.Objective(expr = sum(
        m.chairs[i] * profits[i, -1] +
        m.tables[i] * profits[i,2] +
        m.bedframes[i] * profits[i, 0] +
        m.bookcases[i] * profits[i, 1] for i in time),
        sense=pyo.maximize)
        return m


def add_constraints( m, costs, resources, time):
    """Add the constraints to the model

    Args:
        m (ConcreteModel): The model to add the constraints to.

    Returns:
        ConcreteModel: The model with the added constraints.
            The constraints will be material and workshop constraints.
    """
    m.materialEQ = pyo.ConstraintList()
    m.workshopEQ = pyo.ConstraintList()

    bed_costs = costs[ 0,:]
    bookcase_costs = costs[ 1,:]
    table_costs = costs[2,:]
    chair_costs = costs[-1,:]


    for i in time:
        for j in range(6):
            if j <2 :
                m.materialEQ.add(chair_costs[j]*m.chairs[i] + table_costs[j]*m.tables[i] + bed_costs[j]*m.bedframes[i] + bookcase_costs[j]*m.bookcases[i] <= resources[i,j])
            else:
                m.workshopEQ.add(chair_costs[j]*m.chairs[i] + table_costs[j]*m.tables[i] + bed_costs[j]*m.bedframes[i] + bookcase_costs[j]*m.bookcases[i] <= resources[i,j])

    return m

def add_variables( m, time):
        """Add the variables to the model.

        Args:
            m (ConcreteModel): the model to add the variables to.

        Returns:
            ConcreteModel: the model with newly added variables
        """

        m.bedframes = pyo.Var(time, within=pyo.NonNegativeIntegers)
        m.bookcases = pyo.Var(time, within=pyo.NonNegativeIntegers)
        m.tables = pyo.Var(time, within=pyo.NonNegativeIntegers)
        m.chairs = pyo.Var(time, within=pyo.NonNegativeIntegers)


        return m


def build_model(time, solver, modelfile = 'online_model.lp'):
    """Build the model and add the result as the files 'result'

    Returns:
        ConcreteModel: The final model to work with.
    """
    #time = range(1)
    resources, profits, costs = load_lp_model()
    m = pyo.ConcreteModel()


    m = add_variables(m, time)
    m = add_objective(m, profits, time)
    m = add_constraints(m, costs, resources, time)
    m.results = SolverFactory('glpk').solve(m, tee=False)
    model = m
    return m
