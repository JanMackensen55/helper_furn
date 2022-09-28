import numpy as np
import numpy.random as npr
import os
import sys
import shutil
import matplotlib.pyplot as plt
sys.path.insert(0,os.path.dirname(sys.path[0]) +'/utils')
from lp_utils import *
import pyomo.environ as pyo
import numpy as np
from pyomo.opt import SolverFactory
import matplotlib.pyplot as plt

from itertools import combinations_with_replacement, permutations, product
import pickle

import pandas as pd

def update_res_bed(wood, metal,C,D,i):
    wood -= 4*i
    metal -= 3*i
    C -= 3*i
    D -= 4*i
    return wood,metal,C,D

def update_res_bookcase(wood, metal,C,D,i):
    wood -= 5*i
    metal -= 7*i
    C -= 5*i
    D -= 3*i
    return wood,metal,C,D

def update_res_table(wood, metal,A,B,i):
    wood -= 2*i
    metal -= 5*i
    A -= 4*i
    B -= 6*i
    return wood,metal,A,B

def update_res_chair(wood, metal,A,B,i):
    wood -= 4*i
    metal -= i
    A -= 4*i
    B -= i
    return wood,metal,A,B

def find_solutions(resources,prices,f):
    wood,metal,A,B,C,D = resources
    solutions = []
    profits = []
    for bookcases in range(10):
        wood1, metal1, C1, D1 = update_res_bookcase(wood,metal,C,D,bookcases)
        if min(wood1,metal1,C1,D1) < 0:
            break
        for beds in range(14):
            wood2, metal2, C2, D2 = update_res_bed(wood1, metal1,C1,D1,beds)
            if min(wood2,metal2,C2,D2) < 0:
                break
            for tables in range(11):
                wood3,metal3,A1,B1 = update_res_table(wood2, metal2,A,B,tables)
                if min(wood3,metal3,A1,B1) < 0:
                    break
                chairs = math.floor(min(wood3/4,metal3,A1/4,B1))
                wood4,metal4,A2,B2 = update_res_chair(wood3, metal3,A1,B1,chairs)
                if ((wood4<4 or metal4<3 or C2<3 or D2<4) and (wood4<5 or metal4<7 or C2<5 or D2<3)
                    and (wood4<2 or metal4<5 or A2<4 or B2<6)):
                    profit = beds*prices[0] + bookcases*prices[1] + tables*prices[2] + chairs*prices[3]
                    #f.write('\n {},{},{},{},{}'.format(beds, bookcases, tables, chairs, profit))
                    solutions.append((beds, bookcases, tables, chairs))
                    profits.append(profit)
    return solutions, profits


def check_constraints(items, costs, res, rep):
        """Test if a specific action is feasible_action
        Arg: action (int) = number signfiying which item is build
        """
        cum_cost = np.zeros(6)
        if rep == 0:

            for i in items:

                cum_cost += costs[i]
        # if costs too high for resources return False

        else:

            for i in range(len(items)):
                for j in range(items[i]):
                    cum_cost+= costs[i]
        if np.ndarray.min(res-cum_cost) < 0:
            return False

        return True



def solution_tree(items,costs,res, all_nodes, leaves, semi_leaves):
    '''go through all possible branches recursively
    save all nodes visited, all semi leaves ( leaves which do not have all possible furniture items as children)
    and full leaves (no children of the node)
    '''
    # set condition for children
    children = False
    # go thorugh each possible furniture item and check wether they are feasible
    for i in range(len(items)):

        new_item = items.copy()

        new_item[i]+=1
        if check_constraints(new_item,costs,res,rep = 1):
            # if the item is feasible note as child note
            all_nodes.append(new_item)
            # go further down the path

            solution_tree(new_item,costs, res, all_nodes, leaves, semi_leaves)
            children = True # note that it is at least one child has been found

        elif i == 3 and children == False:
            # if it is the last furniture item and no children were detected before: this is a leave
            leaves.append(items)
        else:
            # at least one action is not available: semi-leaf
            semi_leaves.append(items)


    return all_nodes, leaves, semi_leaves

def pruned_tree(month,version, study):
    '''
    built and prune the tree for a specific month
    '''


    resources, profit, costs = load_lp_model(modelfile = 'online_model.lp')




    if version is 'full':
        items = [0,0,0,0]
        costs = np.array([[4., 3., 0., 0., 3., 4.],
       [5., 7., 0., 0., 5., 3.],
       [2., 5., 4., 6., 0., 0.],
       [4., 1., 4., 1., 0., 0.]])
    else:
        items = [0,0,0,0,0,0,0,0]
        costs = np.array([[1,1,0,0,0,2],[2,1,0,0,3,0],[1,2,0,0,0,1],[2,1,0,0,5,0],[0,1,1,0,0,0],[2,1,0,6,0,0],[1,0,1,0,0,0],[0,1,0,1,0,0]])


    res = resources[month]
    nodes_dupl, leaves_dupl, semi_leaves_dupl = solution_tree(items,costs,res,all_nodes = [], leaves = [], semi_leaves = [])

    #prune the tree: paths which are only permutations of other paths can be deleted
    nodes = list(set(map(tuple, nodes_dupl)))
    leaves = list(set(map(tuple, leaves_dupl)))
    semi_leaves = list(set(map(tuple, semi_leaves_dupl)))
    return nodes, leaves, semi_leaves

#nodes, leaves, semi_leaves = pruned_tree(0)

def create_all_trees(version = 'full', months = range(12), study = 'online'):
    '''creates all monthly trees and writes them to a file'''
    print('start calculating trees')
    if study == 'online':
        solution_branches = []
        leaves_all=[]
        semi_leaves_all = []
        nodes_all = []

        for m in months:

            nodes, leaves, semi_leaves = pruned_tree(m, version, study)
            leaves_all.append(leaves)
            semi_leaves_all.append(semi_leaves)
            nodes_all.append(nodes)
            solution_branches.append(len(leaves))
            print('month ' + str(m))


        file = "online_solution_tree_"+'_months_'+ str(months) + '_version_'+version+".txt"
        with open(file, "wb") as f:
            pickle.dump(nodes_all, f)
            pickle.dump(semi_leaves_all,f)
            pickle.dump(leaves_all,f)
            pickle.dump(solution_branches,f)
    elif study == 'thinkaloud':
        resources, profit, costs = load_lp_model(modelfile = 'thinkaloud_model.lp')
        with open('thinkaloud_solution_tree.csv','w') as f:
            f.write('bookcases, beds, tables, chairs, profit')
            leaves = {}
            optlist = {}
            leaves_all = []
            for m in range(7):
                print(m+1)
                f.write('\n month '+str(m+1))
                solutions, profits = find_solutions(resources[m],profit[m],f)
                leaves[m+1] = solutions
                optlist[m+1] = profits
                leaves_all.append(solutions)
create_all_trees()
