"""This module takes care of the visualization of the results."""
import pandas as pd
from matplotlib.ticker import MultipleLocator
from IPython.display import display
from matplotlib import pyplot as plt


def pprint(agent):
    """Give a summary of every important value of the agent.
    The function prints the available and initial material
    and the performance of the agent with the performance of the 
    linear programm.
    """
    pprint_material(agent)
    print('\n' + '-'*40 + '\n')
    pprint_prices(agent)
    print('\n' + '-'*40 + '\n')
    print('Agent:')
    pprint_items_built(agent)
    pprint_profit(agent)
    print('\n' + '-'*40 + '\n')
    print('Model:')
    pprint_items_built(agent.optimal_solution)
    pprint_profit(agent.optimal_solution)


def pprint_profit(agent):
    """Prettyprint the profit of the agent/model as a table.
    
    Args:
        agent: an agent object or an optimal solution object
    """
    print('Profit for 12 Months:')
    df = pd.DataFrame([agent.profits],columns=agent.col_months)
    display(df)

def pprint_items_built(agent):
    """Prettyprint the number of built items from the agent/model as a table.
    
    Args:
        agent: an agent object or an optimal solution object
    """
    print('Items built for 12 Months:')
    df = pd.DataFrame.from_dict(agent.produced_items, orient='index',columns=agent.col_months)
    display(df)

def pprint_prices(agent):
    print('Prices of Each Item for 12 Months:')
    df = pd.DataFrame.from_dict(agent.prices, orient='index',columns=agent.col_months)
    display(df)

def pprint_material(agent):
    print('Starting Resources: ')
    resource_data = [
        ['Wood'] +agent.initial_wood,
        ['Metal']+agent.initial_metal,
        ['Hours in A'] + agent.initialA,
        ['Hours in B'] + agent.initialB,
        ['Hours in C'] + agent.initialC,
        ['Hours in D'] + agent.initialD
        ]
    df_material = pd.DataFrame(resource_data, columns=['Resource']+agent.col_months)
    display(df_material)
    print('\n Resources Left Each Month: ')
    resource_data = [
        ['Wood'] +agent.available_wood,
        ['Metal']+agent.available_metal,
        ['Hours in A'] + agent.availableA,
        ['Hours in B'] + agent.availableB,
        ['Hours in C'] + agent.availableC,
        ['Hours in D'] + agent.availableD
        ]
    df_material = pd.DataFrame(resource_data, columns=['Resource']+agent.col_months)
    display(df_material)

def plot_profits(agent):
    """Plots the profits for each month compared to the optimal solution

    Args:
        agent (Agent): specify the agent to plot its profits.
    """
    plt.plot(range(1,13), agent.profits)
    plt.plot(range(1,13), agent.optimal_solution.profits)
    plt.title('Profit Comparison')
    plt.xlabel('Months')
    plt.ylabel('Profit')
    plt.legend(['Profit of Agent', 'Optimal Profit'])
    plt.xticks(range(1,13))
    plt.show()



def plot_produced_items(agent):
    """Generates a barplot for the produced items of each month of the year

    Args:
        agent (Agent): The agent for wich the produced items should be plottet.
    """
    df = pd.DataFrame(agent.produced_items, index=range(1,13))
    ax = df.plot(kind='bar', legend=True,width=0.8,figsize=(12,5),rot=1, title='Produced Items', xlabel='Months', ylabel='Amount')
    ax.xaxis.set_minor_locator(MultipleLocator(0.5))
    ax.tick_params(which='minor', length=20, direction='in')
    plt.show()


def plot_unused_resources(agent):
    df_left = pd.DataFrame(agent.get_unused_resources(), index=range(1,13))
    ax = df_left.plot(kind='bar', legend=True,width=0.8,figsize=(15,5),rot=1, title='Unused Resources', xlabel='Months', ylabel='Amount')
    ax.xaxis.set_minor_locator(MultipleLocator(0.5))
    ax.tick_params(which='minor', length=20, direction='in')
    plt.show()