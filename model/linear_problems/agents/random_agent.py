"""Container for the random agent"""
from random import choice, randint
from agents import Agent


class RandomAgent(Agent):
    """A simple agent which will make random decisions."""
    def __init__(self, model, months):
        super().__init__(model, months)
        self.name = 'Random'

    def strategy(self):
        """Implements the strategy of the agent.
        This agent choses a random item and produces one.

        Returns:
            tuple: a tuple (item, amount) which corresponds to a random item string and the amount,
                 which will be always one in this case.
        """
        affordable = self.get_affordable_items()
        item, amount = choice(list(affordable.items()))
        return item, 1
