import numpy as np
import pandas as pd
import gym
import gym_furniture


def get_diff(rewards):
    env= gym.make('SmallFurniture-v0')

    opt = [env.optimal_solution( month) for month in range(env.months)]
    return [((rewards[m]/opt[m])-1)*100 for m in range(12)]

def strategy_similiarity_state(env, traj, month, strategy, first_group= None):
    #vp_traj = get_vp_solutions( vp, month)
    state = env.reset(month-1)
    m = month-1
    #print(m)
    #print(env.month)
    vp_reward = 0.
    simc = 0
    if first_group != None:
        a = first_group # signifies which group is first
        action_sets= [[0,1], [2,3]]
    for vp_action in traj:
        if np.isnan(vp_action):
            break
        if strategy == 'global greedy': # always take best profit action

            action = greedy(env, env.rewards_month[:,m], furniture_items= [0,1,2,3])
        elif strategy == 'grouped greedy': # always take best possible actions in the two groups alternating
            action = greedy(env, env.rewards_month[:,m], furniture_items= action_sets[a])
            a+=1
            if a > 1:
                a=0
            if action == None: # if no action in grouped from before is feasible, turn to other group
                 action = greedy(env, env.rewards_month[:,m], furniture_items= action_sets[a])
        elif strategy == 'material balancing':
            action = balancing(env)
        elif strategy == 'greedy material balancing':
            action = greedy_balancing(env, env.rewards_month[:,m],res_set=[0,1],furniture_items= [0,1,2,3])
        elif strategy == 'greedy, then material balancing':
            action = first_greedy_then_balancing(env,  env.rewards_month[:,m],res_set=[0,1])
        elif strategy == 'minimize_min':
            action = minimize_min_material(env, res_set=[0,1],furniture_items= [0,1,2,3])
        elif strategy == 'greedy_minimize_min':
            action = greedy_minimize_min_material(env, env.rewards_month[:,m],res_set=[0,1], furniture_items= [0,1,2,3])
        elif strategy == 'cost_benefit':
            action = cost_benefit(env, env.rewards_month[:,m], furniture_items= [0,1,2,3])
        if action == vp_action:
            simc +=1
        state, reward, done, debug_info = env.step(int(vp_action))
        vp_reward += reward

    sim = simc/len(traj)
    return sim

def strategy_similiarity(s1, s2):
    return float((len(set(s1) & set(s2)))/ max(len(s1),len(s2)))
def strategy_traj(strategy_actions, strat_type = 'global greedy'):
    traj_dict = {}
    for m in range(len(strategy_actions)):
        solution = []
        current_sol = [0,0,0,0]
        solution.append(tuple(current_sol))

        for s in range(len(strategy_actions[m])):
            current_sol = [current_sol[i]+1 if i==strategy_actions[m][s] else current_sol[i] for i in range(4)]
            solution.append(tuple(current_sol))
        traj_dict[m+1] = solution
    df_traj = pd.DataFrame.from_dict(traj_dict, orient = 'index')
    df_traj = df_traj.melt(value_name = 'solutions', ignore_index=False)
    df_traj['month'] = df_traj.index

    df_traj =df_traj.applymap(lambda x: np.nan if x is None else x)
    df_traj = df_traj.dropna()
    df_traj['Beds'], df_traj['Bookcases'], df_traj['Tables'], df_traj['Chairs'] = zip(*df_traj.solutions)
    df_traj['strategy'] = strat_type
    df_traj= df_traj.rename(columns={'variable': 'steps'})
    return df_traj

def cost_benefit(env, profits, furniture_items= [0,1,2,3]):
    rank = []
    for f in furniture_items:
        if env.is_feasible(f):
            rank.append(profits[f]/sum([env.costs[f, r]/env.state[r] if env.state[r] >0 else 0 for r in range(6)]))
        else:
            rank.append(np.nan)

    if np.isnan(rank).all():
            return None

    return np.nanargmax(rank)


def greedy(env, profits, furniture_items= [0,1,2,3]):
    '''Returns always the most profitable, feasible item, if none in set it feasible return np.nan'''
    feasible_profits = [profits[i] if env.is_feasible(i) and i in furniture_items else np.nan for i in range(4)]
    if np.isnan(feasible_profits).all():
        return None
    return np.nanargmax(feasible_profits)
# how to deal with infeasibility

def balancing(env,res_set=[0,1], furniture_items= [0,1,2,3]):
    state_ratio = env.state[res_set[0]]/env.state[res_set[1]]

    ratios = np.array([env.costs[i][res_set[0]]/env.costs[i][res_set[1]]
                       if env.is_feasible(i) and i in furniture_items else np.nan for i in range(4) ])

    if np.isnan(ratios).all():
            return None
    if (state_ratio > 1) and any(r > 1 for r in ratios): # wood > metal
        idx = np.argmin(abs(state_ratio-ratios[ratios>1]))
        balancing_item = ratios[ratios>1][idx]
    elif state_ratio < 1 and any(r < 1 for r in ratios): # if wood < metal
        idx = np.argmin(abs(state_ratio-ratios[ratios<1]))
        balancing_item = ratios[ratios<1][idx]
    else: # if res1== res2 or no ratio fits
        idx = np.nanargmin(abs(state_ratio-ratios))
        balancing_item = ratios[idx]
    return np.where(ratios ==balancing_item)[0][0]


def greedy_balancing(env, profits,res_set=[0,1],furniture_items= [0,1,2,3]):
    state_ratio = env.state[res_set[0]]/env.state[res_set[1]]
    ratios = np.array([env.costs[i][res_set[0]]/env.costs[i][res_set[1]]
                       if env.is_feasible(i) and i in furniture_items else np.nan for i in range(4) ])
    if np.isnan(ratios).all():
            return None
    if (state_ratio > 1) and any(r > 1 for r in ratios):
        cor_profits = [profits[i] if ratios[i] > 1 else np.nan for i in range(len(profits)) ]
    elif state_ratio < 1 and any(r < 1 for r in ratios):
        cor_profits = [profits[i] if ratios[i] < 1  else np.nan for i in range(len(profits)) ]
    else: # if res1== res2 or no ratio fits
        cor_profits = [profits[i] if not np.isnan(ratios[i])  else np.nan for i in range(len(profits)) ]
    return np.nanargmax(cor_profits)


def first_greedy_then_balancing(env, profits,res_set=[0,1]):

    max_profit_item = np.argmax(profits)
    if env.is_feasible(max_profit_item):
        return max_profit_item

    return balancing(env, res_set)

def minimize_min_material(env, res_set=[0,1],furniture_items= [0,1,2,3]):
    material = [env.state[res_set[0]], env.state[res_set[1]]]
    min_res = np.argmin(material)
    cost_items = [env.costs[i][min_res] if env.is_feasible(i) else np.nan for i in range(4)]
    if np.isnan(cost_items).all():
        return None
    return np.nanargmax(cost_items)

def greedy_minimize_min_material(env, profits,res_set=[0,1], furniture_items= [0,1,2,3]):
    material = [env.state[res_set[0]], env.state[res_set[1]]]
    min_res = np.argmin(material)
    cost_items = [env.costs[i][min_res] if env.is_feasible(i) else np.nan for i in range(4)]

    indices = list(np.array((cost_items)).argsort())

    feasible_profits = [profits[i] if env.is_feasible(i) and i in furniture_items else np.nan for i in range(4)]

    idxs_profit= list(np.array((feasible_profits)).argsort())

    greedy_min = [idxs_profit.index(i)+indices.index(i)  for i in range(4)]


    return np.nanargmax(greedy_min)


def minimize_max_material(env,res_set=[0,1],furniture_items= [0,1,2,3]):
    min_res = np.argmax(env.state[res_set[0]], env.state[res_set[1]])
    cost_items = [env.costs[i][min_res] if env.is_feasible(i) else np.nan for i in range(4)]
    return np.nanargmax(cost_items)




def strategy_run(env, strategy = 'greedy', first_group = None):

    rewards_all, actions_all, states_all = [], [],[]
    for m in range(env.months):
        state = env.reset(m)
        states, rewards, actions = [],[],[]
        done = False
        if first_group != None:
            a = first_group # signifies which group is first
            action_sets= [[0,1], [2,3]]
        while not done:
            if strategy == 'greedy': # always take best profit action
                action = greedy(env, env.rewards_month[:,m], furniture_items= [0,1,2,3])
            elif strategy == 'grouped greedy': # always take best possible actions in the two groups alternating
                action = greedy(env, env.rewards_month[:,m], furniture_items= action_sets[a])
                a+=1
                if a > 1:
                    a=0
                if action == None: # if no action in grouped from before is feasible, turn to other group
                     action = greedy(env, env.rewards_month[:,m], furniture_items= action_sets[a])
            elif strategy == 'material balancing':
                action = balancing(env)
            elif strategy == 'greedy material balancing':
                action = greedy_balancing(env, env.rewards_month[:,m],res_set=[0,1],furniture_items= [0,1,2,3])
            elif strategy == 'greedy, then material balancing':
                action = first_greedy_then_balancing(env,  env.rewards_month[:,m],res_set=[0,1])
            elif strategy == 'minimize_min':
                action = minimize_min_material(env, res_set=[0,1],furniture_items= [0,1,2,3])
            elif strategy == 'greedy_minimize_min':
                action = greedy_minimize_min_material(env, env.rewards_month[:,m],res_set=[0,1], furniture_items= [0,1,2,3])
            elif strategy == 'cost_benefit':
                action = cost_benefit(env, env.rewards_month[:,m], furniture_items= [0,1,2,3])

            state, reward, done,_ = env.step(action)
            states.append(state)
            rewards.append(reward)
            actions.append(action)

        rewards_all.append(sum(rewards))
        actions_all.append(actions)
        states_all.append(states)
    return rewards_all, actions_all, states_all
