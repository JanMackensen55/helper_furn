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
    costs = parse_costs(lp)
    resources = parse_resources(lp)
    profit = parse_profit(lp)
    result = {
        'resources': resources,
        'costs': costs,
        'profit': profit
    }
    return result


def parse_resources(lp):
    """
    Parse the resources of every item from the given linear program
    """
    resource_list = list(filter(lambda e: e.startswith('<='),lp))
    materials = list(map(lambda e: int(e.split(' ')[1]),resource_list[0:24]))
    wood = [e for i, e in enumerate(materials) if i % 2 == 0]
    metal = [e for i, e in enumerate(materials) if i % 2 != 0]
    hours = list(map(lambda e: int(e.split(' ')[1]),resource_list[24:28]))
    available_resources = {
        'wood': wood,
        'metal': metal,
        'hours A': hours.pop(0),
        'hours B': hours.pop(0),
        'hours C': hours.pop(0),
        'hours D': hours.pop(0)
    }
    return available_resources


def parse_costs(lp):
    """
    Parse the costs of every item of the given linear program

    Args:
    lp: the linear problem
    """
    costs_list = list(filter(lambda e: e.startswith('+'), lp[slice(lp.index('s.t.'), len(lp))]))
    costs_list = list(map(lambda e: e.split(' '), costs_list))
    costs_bed = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x1',costs_list)))
    costs_bookcase = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str(13),costs_list)))
    costs_table = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str(25),costs_list)))
    costs_chair = list(map(lambda e: int(e[0]), filter(lambda e: e[1] == 'x'+str(37),costs_list)))
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


def parse_profit(lp):
    """
    Parse the profit variables from the given linear problem

    Args:
    lp: the linear problem to parseonline
    """
    profit_list = list(filter(lambda e: e.startswith('+'), lp[slice(0, lp.index('s.t.'))]))
    profit_list = list(map(lambda e: e.split(' '), profit_list))
    profit_list.sort(key=lambda a: int(a[1].split('x')[1]))

    profit_numbers = list(map(lambda e: int(e[0]), profit_list))
    profit = {
        'Bed': profit_numbers[slice(0,12)],
        'Bookcase': profit_numbers[slice(12,2*12)],
        'Table': profit_numbers[slice(2*12,3*12)],
        'Chair': profit_numbers[slice(3*12,4*12)]
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
