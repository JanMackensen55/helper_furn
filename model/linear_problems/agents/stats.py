from scipy.stats import variation

def get_month_variation(agent, item):
    """This function computes the variation coefficient the building 
    frequency over the months.

    Args:
        item (str): the item to be examined. Possible values: "chairs", "tables","bedframes","bookcases".

    Returns:
        float: the variation coefficient
    """
    return variation(agent.produced_items[item])

def get_distributed_variation(agent, month):
    """Retruns the variation of items built in one month

    Args:
        month (int): the month to provide

    Returns:
        [type]: [description]
    """
    return variation([v[month] for v in agent.produced_items.values()])