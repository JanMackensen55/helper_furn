import gym
import numpy as np
from .lp_parser import parse_lp
import os
import json
# TODO: Anpasssen welche states als observation zurückgegeben werden
def neighbour_indice(ind):
    if ind%2 == 0:
        return ind+1
    return ind-1


class TAFurnitureEnv(gym.Env):
    """
    Environment class for the small furniture example
    One action corresponds to one furniture item
    One episode corresponds to one month
    """

    def __init__(self):
        """ Initialise environment with resource fluctuations provided by the lp model
        """
        # load lp model
        dir_path = os.path.dirname(os.path.realpath(__file__))
        # ------------ load data ------------------#

        instance_model = parse_lp(dir_path+'/thinkaloud_model.lp')

        keys_res = list(instance_model['resources'].keys())
        self.months = len(instance_model['resources'][keys_res[0]])
        # assign resources
        self.resources_month = np.zeros((self.months,len(keys_res)))
        for i in range(len(keys_res)):
            self.resources_month[:,i] = instance_model['resources'][keys_res[i]]

        # make array for rewards for full furniture items
        furniture_keys = list(instance_model['costs'].keys())
        self.rewards_month = np.zeros((4,self.months))
        for j in range(4):
            self.rewards_month[j, :] = np.array(list(instance_model['profit'][furniture_keys[j]]))
        # action number corresponds to the parts which can be built
        self.action_number = 4
        # assign costs for each item
        self.costs = np.zeros((4,6))
        for i in range(len(furniture_keys)):
            for j in range(len(keys_res)) :
                self.costs[i,j] = instance_model['costs'][furniture_keys[i]][keys_res[j]]
        self.action_keys = ['bed', 'bookcase','table',  'chair' ]

        self.furniture_built = np.zeros((4)) # whole furniture built
        self.parts_failed = np.zeros((4))
        self.observation_space = 6


    def substract_res(self, action):
        """Substract the cost of the furniture item (action)
        Arg: action (int) = number signfiying which item is build
        """
        substract = self.state - self.costs[action]
        return substract

    def get_keys(self):
        return self.action_keys

    def is_feasible(self, action):
        """Test if a specific action is feasible_action
        Arg: action (int) = number signfiying which item is build
        """
        # if costs too high for resources return False
        if np.ndarray.min(self.state - self.costs[action]) < 0:
            return False

        return True


    def end_of_month(self):
        """ Test if any action is feasible, and if not declare end of month (episode)
        """
        for i in range(self.action_number):

            if self.is_feasible(i) == True:
                return False

        return True ## terminal step

        # Taking one step in the environment
    def step(self,action):
        """ Take one step by building a furniture item and reducing the resources by the costs for this item
        Arg: action (int) = number signfiying which item is build

        """
        done = False
        # if action is feasible, substract costs for action and set reward for furniture build
        if self.is_feasible(action):
            self.furniture_built[action] += 1
            reward = self.rewards_month[action, self.month]
            self.state = self.substract_res(action)
            done =  self.end_of_month()
        else:
            #reward = -1 # otherwise leave state as is
            reward = 0
            self.parts_failed[action] +=1
            done = True

         # if end of  month, indicate terminal state

        #done =  self.end_of_month()

        # return the observation to the agent
        observation = self.get_observation()
        return observation,  reward,  done, {}



    def reset(self, month):
        """ reset environment to beginning of one episode
        Arg: month (int) = month in which episode is in
        """
        self.month = month

        self.state = self.resources_month[self.month,:]
        self.parts_failed = np.zeros(self.action_number) # parts failed to built
        self.furniture_built = np.zeros((4)) # whole furniture built

        observation = self.get_observation()
        return observation # return first state


      # Function to return observation for agent
    def get_observation(self):
        """ Return Observation containing current resources, parts currently available
        """
        #costs =self.costs.flatten()
        #args = (self.state, costs, self.rewards_month[:,self.month])
        #args = (self.state,self.parts_built)
        #observation = np.concatenate(args)
        observation = self.state
        return observation


    def random_action(self):
        """ Return random action (Used for random agent)
        """
        return np.random.randint(0, self.action_number)

    def feasible_rewards(self):
        """ Return action with most immediate reward TODO: Adapt to new environment, what is most rewarding action?
        """
        feasible_action = np.zeros(self.action_number, dtype = 'bool')
        for i in range(self.action_number):
            feasible_action[i] = self.is_feasible( i) # indicate which actions are feasible
            feasible_action.astype(np.int)
        feasible_rewards = feasible_action * self.rewards_month[:,self.month]
        # nonfeasible actions are set to 0 reward

        return feasible_rewards


    def optimal_solution(self, month):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        f = open(dir_path + '/thinkaloud_model_solution.xml')
        data = json.load(f)
            #f.read()
        #var = np.array(( [3, 6, 1, 4, 1, 4, 4, 1, 1, 1, 4, 1],[1, 0, 4, 2, 4, 2, 2, 4, 4, 4, 2, 4],[4, 0, 4, 4, 2, 4, 4, 4, 2, 1, 3, 0],[0, 3, 2, 2, 3, 2, 2, 2, 4, 5, 3, 5]))
        optimal_val = 0
        keys = ['numberOfBeds', 'numberOfBookCases', 'numberOfTables', 'numberOfChairs']
        for i in range(4):
            optimal_val +=self.rewards_month[i,month]*data[keys[i]][month]
        return optimal_val



    # def final_state(self):
    #     """ Check if end of the year is reached (not necessary if month = episode)
    #     """
    #     if self.month == 11:
    #         return True
    #     return False
