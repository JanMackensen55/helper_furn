"""Conatiner for the margin_profit agent"""
import math
from agents import Agent

class WeightedMarginAgent(Agent):
    """This agent builds the items that give the highest profit 
        and tries to keep the costs low.
    """
    def __init__(self, model):
        super().__init__(model)
        self.name = 'Weighted Margin'

    
    def strategy(self):
        """Find the item that gives the highest profit considering its costs.
        """
        affordable = self.get_affordable_items()
        item = self.get_best_item(affordable)
        return item, 1

    def get_best_item(self, affordable):
        rare_resources = self.find_rare_resources()
        costs = [(k, sum([val*rare_resources[resource] for resource, val in self.costs[k].items()])) for k in affordable.keys()]
        prices = [(k, self.prices[k][self.month]) for k in affordable.keys()]
        margins = [(prices[i][0], prices[i][1]-costs[i][1]) for i in range(len(prices))]
        best_item = [k[0] for k in margins if k[1] == max([l[1] for l in margins])][0]
        return best_item


    def find_rare_resources(self):
        avail_resources = [self.available_wood[self.month], self.available_metal[self.month], self.availableA[self.month],self.availableB[self.month],self.availableC[self.month], self.availableD[self.month]]
        multiplicator = len(avail_resources)
        result = [0]*multiplicator
        multiplicator = multiplicator
        i = 0
        while multiplicator > 0:
            if avail_resources[i] == min(avail_resources):
                result[i] = multiplicator
                multiplicator -= 1
                avail_resources[i] = math.inf
                i = 0
            else: i += 1
        result_dict = {
            'wood': result.pop(0),
            'metal': result.pop(0),
            'hoursA': result.pop(0),
            'hoursB': result.pop(0),
            'hoursC': result.pop(0),
            'hoursD': result.pop(0)
        }
        return result_dict
