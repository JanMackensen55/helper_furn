"""This module provides classes to store data.
This should facilitate the building of models.
"""

class Item:
    """This class allows the storage of an item and its components.
    
    Attributes:
        costs_wood (int): the wood costs of the item.
        costs_metal (int): the metal costs of the item.
        costs_time_one (int): the duration at the first workshop.
        costs_time_two (int): the duration at the second workshop.
        profit (list): the prices of the item for every month.

    """
    def __init__(self, costs_wood, costs_metal, costs_time_one, costs_time_two, profit):
        """Create a new item.

        Args:
            costs_wood (int):  the wood costs of the item.
            costs_metal (int): the metal costs of the item.
            costs_time_one (int): the duration at the first workshop.
            costs_time_two (int): the duration at the second workshop.
            profit (list): the prices of the item for every month.

        """
        self.costs_wood = costs_wood
        self.costs_metal = costs_metal
        self.costs_time_one = costs_time_one
        self.costs_time_two = costs_time_two
        self.profit = profit


    def get_array(self):
        """Returns a list of all values inside this class to facilitate the conversion.
        """
        li = [self.costs_wood,self.costs_metal,self.costs_time_one,self.costs_time_two]
        li.extend(self.profit)
        return li
        