import random
import numpy as np
import pandas as pd
import os
import sys
nb_dir = os.path.split(os.getcwd())[0]
if nb_dir not in sys.path:
    sys.path.append(nb_dir)

from tqdm.notebook import tqdm
from tqdm import tqdm
from agents import stats, Agent
from model_builder import Item, ModelBuilder
import logging


def create_sample(profit = False, material = True, hours = False, costs= False,  factor_resources= 1):
    """This function creates a dataset to train the linear regression"""

    if profit:
        chair_profit = random.choices(range(1,4), k=12)  # 12*4
        table_profit =random.choices(range(2,7), k=12)
        bed_profit =random.choices(range(3,8), k=12)
        bookcase_profit = random.choices(range( 5,11), k=12)
    else:
        chair_profit = [2,3,2,2,3,1,2,2,2,2,3,2]
        table_profit =[ 4,4,4,5,4,3,4,3,4,4,5,3]
        bed_profit =[4,7,3,5,5,5,7,5,5,4,4,6]
        bookcase_profit = [7,8,6,8,10,7,7,7,10,9,8,10]

    # define the items:
    if costs:
        chair = Item(costs_wood=1,costs_metal=1,costs_time_one=2,costs_time_two=1,profit=chair_profit)
        table = Item(random.randint(2,4),random.randint(1,3),random.randint(1,3),random.randint(1,2),table_profit)
        bed = Item(random.randint(2,4),random.randint(2,4),random.randint(1,3),random.randint(1,3), bed_profit)
        bookcase = Item(random.randint(3,6),random.randint(2,5),random.randint(2,5),random.randint(2,4),bookcase_profit)
    else:
        chair = Item(costs_wood=4,costs_metal=1,costs_time_one=4,costs_time_two=1,profit=chair_profit)
        table = Item(2,5,4,6,table_profit)
        bed = Item(4,3,3,4, bed_profit)
        bookcase = Item(5,7,5,3,bookcase_profit)
    # Making calculations for one year
    months = 12
    # specifying available materials
    if hours:
        avail_hours_a = random.randint(5,50)*factor_resources # 4
        avail_hours_b = random.randint(5,50)*factor_resources
        avail_hours_c = random.randint(5,50)*factor_resources
        avail_hours_d = random.randint(5,50)*factor_resources
    else:
        avail_hours_a =26*factor_resources
        avail_hours_b = 30*factor_resources
        avail_hours_c = 23*factor_resources
        avail_hours_d = 26*factor_resources
    if material:
        avail_wood = list(map(lambda resource: factor_resources*resource,random.choices(range(20,100), k=12))) # 12 * 2
        avail_metal = list(map(lambda resource: factor_resources*resource, random.choices(range(20,100), k=12)))
    else:
        avail_wood = [52,38,40,46,57,54,25,54,25,49,47,52]
        avail_metal = [49,21,44,48,97,49,58,44,46,44,59,37]
    sample = {
        'chair': chair,
        'table': table,
        'bed': bed,
        'bookcase': bookcase,
        'wood': avail_wood,
        'metal': avail_metal,
        'hours_a': avail_hours_a,
        'hours_b': avail_hours_b,
        'hours_c': avail_hours_c,
        'hours_d': avail_hours_d
    }
    return sample


def create_sample_set(size=100, profit = False, material = True, hours = False,costs = False, factor_resources= 1):
        samples = []

        for i in range(size):
            sample = create_sample(profit, material, hours, costs, factor_resources)
            samples.append(sample)
        return samples

def compute_variables(sample):
      model_builder = ModelBuilder(months=12, avail_wood=sample.get('wood'), avail_metal=sample.get('metal')
                                  , avail_hours_a=sample.get('hours_a'),avail_hours_b=sample.get('hours_b')
                                  , avail_hours_c=sample.get('hours_c'),avail_hours_d=sample.get('hours_d')
                                  , chair=sample.get('chair'),table=sample.get('table'), bed=sample.get('bed')
                                  , bookcase=sample.get('bookcase'))
      model = model_builder.build_model(dual = False, verbose = False)
      optimal_solution = Agent(model, months=12).optimal_solution
      item_variation_over_year = [stats.get_month_variation(optimal_solution, k) for k in optimal_solution.produced_items.keys()]
      item_distribution_for_one_month = [stats.get_distributed_variation(optimal_solution, m) for m in range(12)]
      return item_variation_over_year+item_distribution_for_one_month

def make_dataset(samples,profit = False, material = True, hours = False, costs = False ):

    y_s = sum(np.array([profit, material, hours, costs], dtype = int) * np.array([48,24,4,16]))
    Y = np.zeros((len(samples), y_s))
    X = np.zeros((len(samples), 16))
    for i, sample in enumerate(tqdm(samples,total = len(samples), desc="Creating samples")):
        yvals = []
        xvals = compute_variables(sample)
        if True in np.isnan(xvals):
            continue
        for v in sample.values():

            if type(v) == Item:
               if costs and profit:
                  yvals.extend(v.get_array())
               elif profit:
                    yvals.extend(v.profit)
               else:
                    pass
            elif type(v) == list:
               if material:
                   yvals.extend(v)
               else:
                   pass
            else:

               if hours :
                   yvals.append(v)
               else:
                   pass
               #yvals.append(v)


        Y[i] = yvals
        X[i] = compute_variables(sample)
    return X, Y

if __name__ == '__main__':
    profit, material, hours, costs = False, False, False, False
    data_id = ''
    for arg in sys.argv[1:]:
        data_id = data_id + '_'+ arg
        if arg== 'profit':
            profit = True

        elif arg == 'material':
            material = True
        elif arg == 'hours':
            hours = True
        elif arg == 'costs':
            costs = True




    s = create_sample_set(10000, profit, material, hours, costs,  1)

    X, Y = make_dataset(s, profit, material, hours, costs)

    np.save('targets_v3'+ data_id, Y)
    np.save('values_v3'+data_id, X)
