from random import choice
from agents import Agent

class RandomAgentAllIn(Agent):
    """This is a special version of the RandomAgent.
    Instead of just producing one random item, this agent
    pics a random affordable item and builds the maximum possible amount of that item.
    This should model the behavior of a person that randomly drags sliders to the maximum position
    """
    def __init__(self, model):
        super().__init__(model)
        self.name = 'Random All-In'

    def strategy(self):
        """Implements the strategy of the agent.
        A random item is chosen and the maximum amount shall be produced.
        Returns:
            tuple: a tuple (item, amount) which corresponds to a random item string and the amount,
                 corresponding to the maximum buildable amount of that random item.
        """
        affordable = self.get_affordable_items()
        item, amount = choice(list(affordable.items()))
        return item, amount