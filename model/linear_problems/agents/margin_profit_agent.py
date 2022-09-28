"""Conatiner for the margin_profit agent"""
from agents import Agent

class MarginProfitAgent(Agent):
    """This agent builds the items that give the highest profit 
        and tries to keep the costs low.
    """
    def __init__(self, model):
        super().__init__(model)
        self.name = 'Margin Profit'

    
    def strategy(self):
        """Find the item that gives the highest profit considering its costs.
        """
        affordable = self.get_affordable_items()
        item = self.get_best_item(affordable)
        return item, affordable.get(item)

    def get_best_item(self, affordable):
        costs = [(k, sum(list(self.costs[k].values()))) for k in affordable.keys()]
        prices = [(k, self.prices[k][self.month]) for k in affordable.keys()]
        margins = [(prices[i][0], prices[i][1]-costs[i][1]) for i in range(len(prices))]
        best_item = [k[0] for k in margins if k[1] == max([l[1] for l in margins])][0]
        return best_item