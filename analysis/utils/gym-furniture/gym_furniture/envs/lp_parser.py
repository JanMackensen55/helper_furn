"""
This module handels the parsing of the linear problem to enable simulation
for the agents.
"""


def parse_lp(file):
    """
    Parses the linear problem and converts it to a dictionary

    Args:
    file: the path to the linear problem
    """
    lp = read_file(file)
    # read out number of months in the problem
    months = int(int(lp[-3][-2:])/4)
    costs = parse_costs(lp, months)
    resources = parse_resources(lp, months)
    profit = parse_profit(lp, months)
    result = {
        'resources': resources,
        'costs': costs,
        'profit': profit
    }
    #print(result)
    return result


def parse_resources(lp, months):
    """
    Parse the resources of every item from the given linear program
    """
    resource_list = list(filter(lambda e: e.startswith('<='),lp))
    materials = list(map(lambda e: int(e.split(' ')[1]),resource_list[0:months*2]))#14
    wood = [e for i, e in enumerate(materials) if i % 2 == 0]
    metal = [e for i, e in enumerate(materials) if i % 2 != 0]
    hours = list(map(lambda e: int(e.split(' ')[1]),resource_list[months*2:(months*2)+4]))#14:18
    available_resources = {
        'wood': wood,
        'metal': metal,
        'hours A': hours.pop(0),
        'hours B': hours.pop(0),
        'hours C': hours.pop(0),
        'hours D': hours.pop(0)
    }
    return available_resources


def parse_costs(lp, months):
    """
    Parse the costs of every item of the given linear program

    Args:
    lp: the linear problem
    """
    costs_list = list(filter(lambda e: e.startswith('+'), lp[slice(lp.index('s.t.'), len(lp))]))
    costs_list = list(map(lambda e: e.split(' '), costs_list))
    costs_bed = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x1',costs_list)))
    costs_bookcase = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str(months+1),costs_list)))# 15
    costs_table = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str((months*2)+1),costs_list)))# 22
    costs_chair = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str((months*3)+1),costs_list)))#8
    costs = {
        'Bed' : {
            'wood': costs_bed.pop(0),
            'metal': costs_bed.pop(0),
            'hours A': 0,
            'hours B': 0,
            'hours C': costs_bed.pop(0),
            'hours D': costs_bed.pop(0)
        },
        'Bookcase' : {
            'wood': costs_bookcase.pop(0),
            'metal': costs_bookcase.pop(0),
            'hours A': 0,
            'hours B': 0,
            'hours C': costs_bookcase.pop(0),
            'hours D': costs_bookcase.pop(0)
        },
        'Table' : {
            'wood': costs_table.pop(0),
            'metal': costs_table.pop(0),
            'hours C': 0,
            'hours D': 0,
            'hours A': costs_table.pop(0),
            'hours B': costs_table.pop(0)
        },
        'Chair' : {
            'wood': costs_chair.pop(0),
            'metal': costs_chair.pop(0),
            'hours C': 0,
            'hours D': 0,
            'hours A': costs_chair.pop(0),
            'hours B': costs_chair.pop(0)
        },
    }
    return costs


def parse_profit(lp, months):
    """
    Parse the profit variables from the given linear problem

    Args:
    lp: the linear problem to parse
    """
    profit_list = list(filter(lambda e: e.startswith('+'), lp[slice(0, lp.index('s.t.'))]))
    profit_list = list(map(lambda e: e.split(' '), profit_list))
    profit_list.sort(key=lambda a: int(a[1].split('x')[1]))

    profit_numbers = list(map(lambda e: int(e[0]), profit_list))
    profit = {
        'Bed': profit_numbers[slice(0,months)],#7
        'Bookcase': profit_numbers[slice(months,2*months)],#7
        'Table': profit_numbers[slice(2*months,3*months)],#7
        'Chair': profit_numbers[slice(3*months,4*months)]#7
    }
    return profit


def read_file(path):
    """
    Reads a file for further processing.

    Args:
    path: the path to the desired file.

    """
    with open(path, 'r') as f:
        file = f.read()

    return file.split('\n')
