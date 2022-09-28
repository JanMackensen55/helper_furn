from scipy.stats import variation
from agents.optimal_solution import OptimalSolution
from agents import visualization as vis

class Agent:
    """This class serves as a wrapper for agents that simulate the game.

    The constructor loads all relevant values for the simulation such as costs, available material and time.
    This class should be used as an abstract class, which implements the data logic.
    Concrete agents should extend this class.

    Attributes:
        months (int): the amount of available months.
        available_wood (list): the amount of wood the player has for every month.
        available_metal (list): the amount of metal the player can use for every month.
        availableA (list): the amount of hours for workshop A.
        availableB (list): the amount of hours for workshop B.
        availableC (list): the amount of hours for workshop C.
        availableD (list): the amount of hours for workshop D.
        costs (dict): a dictionary holding the cost of each product.
        prices (dict): a dictonary holding the prices of each product for each month.
        profits (list): the profit of the agent for every month.
        produced_items (dict): a dictionary which keeps track of the amount of produced items
                               each month.
    """
    def __init__(self, model, months=12):
        self.name = 'Agent'
        col_months = ['Month 1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

        self.col_months = col_months[0:months]

        self.model = model
        self.months = range(months)
        self.month_gen = self.month_generator()
        self.__load_resources()
        self.__load_available_workshop_time()
        self.__load_costs()
        self.__load_profits()
        self.profits = [0]*12
        self.produced_items = {
            'chairs': [0]*12,
            'tables': [0]*12,
            'bedframes': [0]*12,
            'bookcases': [0]*12
        }

        self.initial_wood = self.available_wood.copy()
        self.initial_metal = self.available_metal.copy()
        self.initialA = self.availableA.copy()
        self.initialB = self.availableB.copy()
        self.initialC = self.availableC.copy()
        self.initialD = self.availableD.copy()

        self.optimal_solution = OptimalSolution(self)

    def produce(self, item, amount=1):
        """Produce an item.
        this method takes the item and its amount to produce and calculates
        the profit and consumes the costs

        Args:
            item (str): the items that should be produced. Possible values: 'chairs', 'tables'
                        'bedframes' and 'bookcases'.
            amount(int): default: 1. defines how often the item should be produced.

        Returns:
            bool: True, the process was successful, False if the agent cannot aford the desired amount of items
                  in this case, nothing will be produced.
        """
        if self.canAfford(item, amount):
            # consume resources
            self.available_wood[self.month] -= amount*self.costs[item]['wood']
            self.available_metal[self.month] -= amount*self.costs[item]['metal']
            if self.costs[item].get('hoursA'):
                self.availableA[self.month] -= amount*self.costs[item]['hoursA']
                self.availableB[self.month] -= amount*self.costs[item]['hoursB']
            if self.costs[item].get('hoursC'):
                self.availableC[self.month] -= amount*self.costs[item]['hoursC']
                self.availableD[self.month] -= amount*self.costs[item]['hoursD']

            # add to the profit and the produced items
            self.profits[self.month] += amount*self.prices[item][self.month]
            self.produced_items[item][self.month] += amount
            return True
        else:
            return False



    def simulate_year(self):
        """Simulate a year.
        This function starts a simulation using the individual strategy to decide which items should be built.
        After that it changes the month and repeats, untill the last month is over.
        """
        while self.next_month():
            while len(self.get_affordable_items()) > 0:
                item, amount = self.strategy()
                self.produce(item,amount)
        return True


    def strategy(self):
        """The blueprint for the strategy that must be implemented by the concrete agents."""
        pass

    def get_affordable_items(self):
        """Returns a dicitonary of items that can be produced."""
        affordable_items = {}
        for k in self.produced_items.keys():
            num = 0
            while self.canAfford(k,num):
                num += 1
            affordable_items[k] = num-1
            if num <=1:
                affordable_items.pop(k)
        return affordable_items


    def next_month(self):
        """Go to the next month.
        This functions stepps to the next month by increasing the generator method.

        Retruns:
            bool: True, if the change was successful, Flase if the 12 months are already reached.
        """

        month = next(self.month_gen)
        if month >= 0:
            self.month = month
            return True
        else: return False


    def month_generator(self):
        for i in self.months:
            yield i
        while True:
            yield -1


    def canAfford(self, item, amount):
        """Checks if an item can be afforded by the agent.

        Args:
            item (str): the string identifier of the product. Possible values are:
                    'chairs', 'tables', 'bedframes' and 'bookcases'.
            amount (int): the amount of the items that should be checked.

        Returns:
            bool: True, if the agent can afford the given amount of items, False if not.

        """
        try:
            if amount*self.costs[item]["wood"] > self.available_wood[self.month]: return False
            if amount*self.costs[item]['metal'] > self.available_metal[self.month]: return False
            if self.costs[item].get('hoursA'):
                if amount*self.costs[item]['hoursA'] > self.availableA[self.month]: return False
                if amount*self.costs[item]['hoursB'] > self.availableB[self.month]: return False
            elif self.costs[item].get('hoursC'):
                if amount*self.costs[item]['hoursC'] > self.availableC[self.month]: return False
                if amount*self.costs[item]['hoursD'] > self.availableD[self.month]: return False
            return True
        except KeyError:
            raise ValueError('"{}" is not found. possible values are: "chairs", "tables", "bedframes" or "bookcases"'.format(item))


    def __load_available_workshop_time(self):
        workshops = [t.upper() for t in list(self.model.workshopEQ.values())[0:4]]
        self.availableA = [workshops.pop(0)]*12
        self.availableB = [workshops.pop(0)]*12
        self.availableC = [workshops.pop(0)]*12
        self.availableD = [workshops.pop(0)]*12


    def __load_resources(self):
        self.available_wood = [int(e.upper()) for i, e in enumerate(self.model.materialEQ.values()) if i % 2 == 0]
        self.available_metal = [int(e.upper()) for i, e in enumerate(self.model.materialEQ.values()) if i % 2 != 0]


    def __load_costs(self):
        result = {'chairs': {},
             'tables': {},
             'bedframes': {},
             'bookcases': {}}
        names = ['wood', 'metal', 'hoursA', 'hoursB', 'hoursC', 'hoursD']
        material_constraints = list(self.model.materialEQ.values())[0:2]
        time_constraints = list(self.model.workshopEQ.values())[0:4]
        result = self.__parse_from_constraint(material_constraints, names, result)
        result = self.__parse_from_constraint(time_constraints, names[2:], result)
        self.costs = result


    def __parse_from_constraint(self, constraints, names, dictionary):
        for i, con in enumerate(constraints):
            for v in con.body.args:
                val = v.to_string().split('*')
                if len(val) > 1:
                    dictionary[val[1][0:val[1].index('[')]][names[i]] = int(val[0])
                else: dictionary[val[0][0:val[0].index('[')]][names[i]]= 1
        return dictionary


    def __load_profits(self):
        self.prices = {
            'chairs': [],
            'tables': [],
            'bedframes': [],
            'bookcases': []
        }
        profits = self.model.cost.expr.args
        for profit in profits:
            p = profit.to_string().split('*')
            if len(p) > 1:
                self.prices[p[1][0:p[1].index('[')]].append(int(p[0]))
            else:
                self.prices[p[0][0:p[0].index('[')]].append(1)

    def pprint(self):
        vis.pprint(self)

    def print_profits(self):
        print('Agent solution: ', sum(self.profits))
        vis.pprint_profit(self)
        print('Optimal solution: ', sum(self.optimal_solution.profits))
        vis.pprint_profit(self.optimal_solution)

    def plot_profits(self):
        vis.plot_profits(self)

    def plot_produced_items(self, agent=None):
        """Creates a plot of the produced items over a year

        Args:
            agent: an agent class or the optimal solution of an agent.
        """
        if not agent:
            agent=self
        vis.plot_produced_items(agent)

    def plot_unused_resources(self, agent=None):
        """Creates a plot of the produced items over a year

        Args:
            agent: an agent class or the optimal solution of an agent.
        """
        if not agent:
            agent=self
        vis.plot_unused_resources(agent)

    def get_unused_resources(self):
        unused_resources = {
            'wood': self.available_wood,
            'metal': self.available_metal,
            'hoursA': self.availableA,
            'hoursB': self.availableB,
            'hoursC': self.availableC,
            'hoursD': self.availableD
        }
        return unused_resources
