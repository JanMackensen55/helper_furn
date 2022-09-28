import os
import sys
#currentdir = os.getcwd()
#äparent_dir = os.path.dirname(currentdir)
#sys.path.insert(0, parent_dir)
#from df_utils import *
import pickle
solver = 'cplex_direct' # might be 'cplex' or 'glpk'

import pyomo.environ as pyo
import numpy as np
from pyomo.opt import SolverFactory
import pandas as pd
from lp_utils import *

def get_vp_solutions(df_built, vp, month):
    t = [ f-1 for f in furniture_list(df_built,[vp], month).values[0]]
    return t

def part_code(part):
    if part == 'bed frame':
        return 1
    elif part == 'bed top':
        return 2
    elif part == 'shelf frame':
        return 3
    elif part == 'shelf':
        return 4
    elif part == 'table leg':
        return 5
    elif part == 'table top':
        return 6
    elif part == 'chair leg':
        return 7
    elif part == 'chair back':
        return 8
    else:
        return 9

def part_list(df_built,vp_list, month):
    solution = {}
    for v in vp_list:
       # solution[v] = [0]
        c = 0
        for part in df_built.furniture_parts[(df_built.vp == v) & (df_built.month == month)]:
            if c == 0:
                solution[v] = [part_code(part)]
            else:
                solution[v].append(part_code(part))
            c+=1
    df_solution_paths = pd.DataFrame.from_dict(solution, orient = 'index')
    return df_solution_paths

def get_unused_parts(df_built, month):
    solution = {}
    use_map = {'not used' : 'f', 'used':'', 'failed': 'f', None: ''}
    for v in df_built[df_built.month ==month].vp.unique():

       # solution[v] = [0]
        c = 0
        for use in df_built.useful[(df_built.vp == v) & (df_built.month == month)]:
            if c == 0:
                solution[v] = [use_map[use]]
            else:
                solution[v].append(use_map[use])

            c+=1
    df_mask = pd.DataFrame.from_dict(solution, orient = 'index')
    return df_mask

def fur_code(furniture):
    if furniture == 'Bed':
        return 1
    elif furniture == 'Bookcase':
        return 2
    elif furniture == 'Table':
        return 3
    elif furniture == 'Chair':
        return 4
    else:
        return 5

def furniture_list(df_built,vp_list, month):
    solution = {}
    for v in vp_list:
       # solution[v] = [0]
        c = 0
        for furniture in df_built.full_furniture[(df_built.vp == v) &
                                    (df_built.full_furniture != 'nothing') & (df_built.month == month)]:
            if c == 0:
                solution[v] = [fur_code(furniture)]
            else:
                solution[v].append(fur_code(furniture))
            c+=1
    df_solution_paths = pd.DataFrame.from_dict(solution, orient = 'index')

    return df_solution_paths

def furniture_list_one_vp(df_built,vp, months = 13):
    solution = {}
    for month in range(months):
        c = 0
        for furniture in df_built.full_furniture[(df_built.vp == vp) &
                                    (df_built.full_furniture != 'nothing') & (df_built.month == month)]:
            if c == 0:
                solution[month] = [fur_code(furniture)]
            else:
                solution[month].append(fur_code(furniture))
            c+=1
    df_solution_paths = pd.DataFrame.from_dict(solution, orient = 'index')

    return df_solution_paths


def map_to_profit(df_solutions, month = 12, target = 'month'):
    profit_dict = {}
    res, profits, costs = load_lp_model()
    if target == 'month':
        m = month
        for idx, row in df_solutions.iterrows():
            profit_dict[idx] = [(profits[m, int(item-1)]-profits[m].min())/(profits[m].max()-profits[m].min())
                    if not np.isnan(item) else np.nan for item in row  ]
    else:
        for idx, row in df_solutions.iterrows():
            profit_dict[idx] = [(profits[idx-1, int(item-1)]-profits[idx-1].min())/(profits[idx-1].max()-profits[idx-1].min())
                                if not np.isnan(item) else np.nan for item in row  ]
    df_mapped = pd.DataFrame(profit_dict)
    return df_mapped.transpose()





def get_furniture_dict(df, df_complete_sol):
    furn_col = [ 'PL02_', 'PL03_','PL04_', 'PL05_']
    df_sol= df.astype(int,  errors='ignore')
    df_furn =pd. DataFrame(columns = range(1,13))
    df_furn.columns.name = 'month'
    for m in range(1,13):
            if m< 10:
                month_cols = [item+'0' +str(m) for item in furn_col]
            else:
                month_cols = [item +str(m) for item in furn_col]


            df_furn[m] = df_sol[month_cols].apply(tuple, axis=1)

    df_furn = df_furn.melt(value_name = 'solutions', ignore_index=False)
    df_complete_mask = df_complete_sol.melt(value_name = 'complete', ignore_index=False)


    df_furn = pd.concat([df_furn, df_complete_mask['complete']], axis = 1)
    return df_furn


def get_furniture_dict_prolific(df, df_vp_sol):
    furn_col = [ 'PL02_', 'PL03_','PL04_', 'PL05_']
    df_sol= df.astype(int,  errors='ignore')
    df_furn =pd. DataFrame(columns = range(1,13))
    df_furn.columns.name = 'month'
    for m in range(1,13):
            if m< 10:
                month_cols = [item+'0' +str(m) for item in furn_col]
            else:
                month_cols = [item +str(m) for item in furn_col]


            df_furn[m] = df_sol[month_cols].apply(tuple, axis=1)

    df_furn = df_furn.melt(value_name = 'solutions', ignore_index=False)
    df_furn['complete'] = False

    for idx, row in df_vp_sol.loc[df_vp_sol.complete == 'complete', ['vp', 'month']].iterrows():
        df_furn.loc[(df_furn.month == row.month) & (df_furn.index == row.vp), 'complete'] = True
    #df_furn = pd.concat([df_furn, df_complete_mask['complete']], axis = 1)
    return df_furn


def generate_feasible_solutions(df_furn):

    furn_col = [ 'PL02_', 'PL03_','PL04_', 'PL05_']

    with open("solution_tree.txt", "rb") as f:
        nodes_all = pickle.load(f)
        semi_leaves_all= pickle.load(f)
        leaves= pickle.load(f)
        solution_branches = pickle.load(f)
        df_leaves = pd.DataFrame(leaves)

    df_leaves= df_leaves.fillna(value=np.nan)
    df_leaves= df_leaves.transpose()
    df_leaves.columns = range(1,13)
    df_leaves.columns.name = 'month'
    df_leaves = df_leaves.melt(value_name='solutions', ignore_index = False)
    df_leaves = df_leaves.dropna()
    df_leaves['Beds'], df_leaves['Bookcases'], df_leaves['Tables'], df_leaves['Chairs'] = zip(*df_leaves.solutions)
# map count of solutions of vps onto the complete solution set
    for m in range(1,13):
        df_counts = df_furn[(df_furn.month == m) & (df_furn.solutions.isin(df_leaves[(df_leaves.month==m)].solutions))].value_counts()
        #df_counts = df_furn[(df_furn.month == m) & (df_furn.complete == True)].value_counts()

        for i in range(len(df_counts)):

            count = df_counts.iloc[i]
            solution = df_counts.index[i][1]
            df_leaves.loc[(df_leaves.month==m) & (df_leaves.solutions == solution), 'Number of solutions'] = count

    resources, profit, costs = load_lp_model()
    solution_profits = {}
    paths = {}
    for m in range(12):
        month_sol = []
        month_fact = []

        for sol in leaves[m]:
            cum_profit = 0
            product = 1

            for j in range(4):
                cum_profit += sol[j]*profit[m,j]
                product *= np.math.factorial(sol[j])

            fact = np.math.factorial(sum(sol))/product
            month_fact.append(fact)
            month_sol.append(cum_profit)
        solution_profits[m] = month_sol

        paths[m] = [fact/sum(month_fact) for fact in month_fact]
    df_profit = pd.DataFrame.from_dict(solution_profits, orient = 'index')
    df_profit = df_profit.transpose()
    df_profit = df_profit.fillna(value=np.nan)
    df_profit.columns.name = 'Month'
    df_paths = pd.DataFrame.from_dict(paths, orient = 'index')
    df_paths = df_paths.transpose()
    df_paths = df_paths.fillna(value=np.nan)
    df_paths.columns.name = 'Month'

    df_sol = df_profit.melt(value_name = 'profit', ignore_index = False)
    df_sol = df_sol.dropna()
    df_sol = pd.concat([df_sol['profit'],df_leaves, df_paths.melt(value_name = 'paths', ignore_index = False).dropna()], axis = 1)
    return df_profit, df_paths, df_sol


def array_from_fur(furniture):
    if furniture == 'Bed':
        return [1,0,0,0]
    elif furniture == 'Bookcase':
        return [0,1,0,0]
    elif furniture == 'Table':
        return [0,0,1,0]
    elif furniture == 'Chair':
        return [0,0,0,1]
    else:
        return [0,0,0,0]
def solution_dict(month, df_built):
    solution = {}
    for v in df_built[df_built.month == month].vp.unique():
        current_sol = [0,0,0,0]
        solution[v] = [tuple(current_sol)]
        for furniture in df_built.full_furniture[(df_built.vp == v) &
                                    (df_built.full_furniture != 'nothing') & (df_built.month == month)]:
            current_sol = np.add(current_sol,array_from_fur(furniture))
            solution[v].append(tuple(current_sol))
        if len(solution[v]) == 1:
            key = solution.pop(v, None)
    return solution

def get_solution_df(solution_dict):
    df_solution_paths = pd.DataFrame.from_dict(solution_dict, orient = 'index')
    df_solution_paths = df_solution_paths.melt(value_name = 'solutions', ignore_index=False)
    df_solution_paths =df_solution_paths.applymap(lambda x: (np.nan, np.nan,np.nan, np.nan) if x is None else x)
    df_solution_paths['Beds'], df_solution_paths['Bookcases'], df_solution_paths['Tables'], df_solution_paths['Chairs'] = zip(*df_solution_paths.solutions)
    df_solution_paths['vp'] = df_solution_paths.index
    return df_solution_paths

def get_sol_leaves():
    with open("solution_tree.txt", "rb") as f:
        nodes_all = pickle.load(f)
        semi_leaves_all= pickle.load(f)
        leaves= pickle.load(f)
        solution_branches = pickle.load(f)
    return nodes_all, semi_leaves_all, leaves, solution_branches
