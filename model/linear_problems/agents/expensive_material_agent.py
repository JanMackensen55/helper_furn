"""Container for the expensive_material agent"""
from agents import Agent

class ExpensiveMaterialAgent(Agent):
    """This agent builds items that need the most resources first."""
    def __init__(self, model):
        super().__init__(model)
        self.name = 'Expensive Material'

    
    def strategy(self):
        """Find the item that needs the most resources among the affordable items.
        
        Returns:
             tuple: a tuple (item, amount) which corresponds to the most expensive item and its maximum 
                    buildable amount.
        """
        affordable = self.get_affordable_items()
        item = self.get_most_expensive_item(affordable)
        return item, affordable.get(item)

    
    def get_most_expensive_item(self, affordable):
        """Return the item with the highest costs.
        In this case every kind of cost has the same weight.

        Args:
            affordable (dict): the dictionary containing the items that can be afforded.
        
        Returns:
            str: the most expensive item among the affordable items.
        """
        costs = [(k, sum(list(self.costs[k].values()))) for k in affordable.keys()]
        most_exp_item = [k[0] for k in costs if k[1] == max([l[1] for l in costs])][0]
        return most_exp_item