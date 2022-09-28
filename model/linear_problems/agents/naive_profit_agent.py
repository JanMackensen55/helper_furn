"""Container for the naive_profit agent"""
from agents import Agent

class NaiveProfitAgent(Agent):
    """This agent builds the item with the highest profit first.
    If an item is found, the maximum possible amount is built.
    It does not consider the item costs.
    """
    def __init__(self, model):
        super().__init__(model)
        self.name = 'Naive Profit'
    
    def strategy(self):
        """Find the item which provides the highest profit among the affordable items.
        
        Returns:
            tuple: a tuple (item, amount) which corresponds to the most valuable item and its amount to produce.
        """
        affordable = self.get_affordable_items()
        item = self.get_most_valuable_item(affordable)
        return item, affordable.get(item)


    def get_most_valuable_item(self, affordable):
        """Return the item with the highest costs.
        In this case costs are not considered.
        Args:
            affordable (dict): the dictionary containing the items that can be afforded.
        
        Returns:
            str: the most expensive item among the affordable items.
        """
        prices = [(k, self.prices[k][self.month]) for k in affordable.keys()]
        most_valuable_item = [k[0] for k in prices if k[1] == max([l[1] for l in prices])][0]
        return most_valuable_item