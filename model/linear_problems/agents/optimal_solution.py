"""This module implements a class to represent an optimal solution."""
import numpy as np
import json
class OptimalSolution:
    """The class is intended to be used by agents.
    It allows the comparison between the solution of an agent and
    the optimal solution obtained by the linear program.

    Attributes:
        profits (list): the optimal profit for every month.
        produced_items (dict): the amount of produced items each month.
        used_resources(dict): the amount of used resources for each month.


    """
    def __init__(self, agent):
        col_months = ['Month 1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']


        self.agent = agent
        self.months = len(self.agent.months)
        self.col_months = self.agent.col_months
        self.__load_produced_items(agent.model)
        self.__calculate_profit(agent.prices)
        self.__load_used_resources(agent.costs)
        self.__load_initial_values()


    def __calculate_profit(self, prices):
        self.profits = [0]*self.months
        for i in range(self.months):
            for k in prices.keys():
                self.profits[i] += prices[k][i]*self.produced_items[k][i]


    def __load_produced_items(self, model):
        self.produced_items = {
            'chairs': [model.chairs._data]*self.months,
            'tables': [model.tables._data]*self.months,
            'bedframes': [model.bedframes._data]*self.months,
            'bookcases': [model.bookcases._data]*self.months
        }
        for k in self.produced_items.keys():
            for i in range(self.months):
                self.produced_items[k][i] = int(self.produced_items[k][i][i].value)


    def __load_used_resources(self, costs):
        self.used_resources = {
            'wood': [0]*self.months,
            'metal': [0]*self.months,
            'hoursA': [0]*self.months,
            'hoursB': [0]*self.months,
            'hoursC': [0]*self.months,
            'hoursD': [0]*self.months
        }

        for item, resources in costs.items():
            for resource, cost in resources.items():
                self.used_resources[resource] = [self.used_resources[resource][i]+cost*self.produced_items[item][i] for i in range(len(self.used_resources[resource]))]

    def __load_initial_values(self):
         self.initial_values = {
            'wood': self.agent.initial_wood,
            'metal': self.agent.initial_metal,
            'hoursA': self.agent.initialA,
            'hoursB': self.agent.initialB,
            'hoursC': self.agent.initialC,
            'hoursD': self.agent.initialD
        }

    def get_unused_resources(self):
        unused_resources = {}
        for k, value in self.initial_values.items():
            unused_resources[k] = [value[i] - self.used_resources[k][i] for i in range(self.months)]
        return unused_resources


    def save_solution(self, filename):
        result = {
            'objective': sum(self.profits),
            'numberOfBeds': self.produced_items['bedframes'],
            'numberOfBookCases': self.produced_items['bookcases'],
            'numberOfTables': self.produced_items['tables'],
            'numberOfChairs': self.produced_items['chairs']
        }
        with open(filename+'.xml', 'w') as file:
            json.dump(result,file)
