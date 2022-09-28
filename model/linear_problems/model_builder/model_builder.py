import pyomo.environ as pyo
import numpy as np
from pyomo.opt import SolverFactory
import matplotlib.pyplot as plt

import logging


class ModelBuilder():
    """This class handels the creation of a linear model."""
    def __init__(self, months, avail_wood,avail_metal,
                avail_hours_a,avail_hours_b,avail_hours_c, avail_hours_d,
                chair, table,bed,bookcase, continuous = False):
        """Create a new linear model.

        Args:
            months (int): the amount of months to simulate
            avail_wood (list): the amount of available wood for every month
            avail_metal (list): the amount of available metal for every month
            avail_hours_a (int): available hours in workshop A.
            avail_hours_b (int): available hours in workshop B-
            avail_hours_c (int): available hours in workshop C.
            avail_hours_d (int): available hours in workshop D.
            chair (Item): an Item object representing the chair item.
            table (Item): an Item object representing the table item.
            bed (Item): an Item object representing the bed item.
            bookcase (Item): an Item object representing the bookcase item.
        """
        self.months = months
        self.time = range(months)
        self.avail_wood = avail_wood
        self.avail_metal = avail_metal
        self.avail_hours_a = avail_hours_a
        self.avail_hours_b = avail_hours_b
        self.avail_hours_c = avail_hours_c
        self.avail_hours_d = avail_hours_d
        self.chair = chair
        self.table = table
        self.bed = bed
        self.bookcase = bookcase

        if continuous:
            self.domain = pyo.NonNegativeReals
        else:
            self.domain = pyo.NonNegativeIntegers

    def add_variables(self, m):
        """Add the variables to the model.

        Args:
            m (ConcreteModel): the model to add the variables to.

        Returns:
            ConcreteModel: the model with newly added variables
        """
        m.bedframes = pyo.Var(self.time, within=self.domain)
        m.bookcases = pyo.Var(self.time, within=self.domain)
        m.tables = pyo.Var(self.time, within=self.domain)
        m.chairs = pyo.Var(self.time, within=self.domain)
        return m


    def add_objective(self, m):
        """Add the objective to the linear model

        Args:
            m (ConcreteModel): A linear model to add the objective to.

        Returns:
            ConcreteModel: The model with the newly added objective.
        """
        m.cost = pyo.Objective(expr = sum(
        m.chairs[i] * self.chair.profit[i] +
        m.tables[i] * self.table.profit[i] +
        m.bedframes[i] * self.bed.profit[i] +
        m.bookcases[i] * self.bookcase.profit[i] for i in self.time),
        sense=pyo.maximize)
        return m


    def add_constraints(self, m):
        """Add the constraints to the model

        Args:
            m (ConcreteModel): The model to add the constraints to.

        Returns:
            ConcreteModel: The model with the added constraints.
                The constraints will be material and workshop constraints.
        """
        m.materialEQ = pyo.ConstraintList()
        m.workshopEQ = pyo.ConstraintList()

        for i in self.time:
            m.materialEQ.add(self.chair.costs_wood*m.chairs[i] + self.table.costs_wood*m.tables[i] + self.bed.costs_wood*m.bedframes[i] + self.bookcase.costs_wood*m.bookcases[i] <= self.avail_wood[i])
            m.materialEQ.add(self.chair.costs_metal*m.chairs[i] + self.table.costs_metal*m.tables[i] + self.bed.costs_metal*m.bedframes[i] + self.bookcase.costs_metal*m.bookcases[i] <= self.avail_metal[i])

        for i in self.time:
            m.workshopEQ.add(self.chair.costs_time_one*m.chairs[i] + self.table.costs_time_one*m.tables[i] <= self.avail_hours_a)
            m.workshopEQ.add(self.chair.costs_time_two*m.chairs[i] + self.table.costs_time_two*m.tables[i] <=self.avail_hours_b)
            m.workshopEQ.add(self.bed.costs_time_one*m.bedframes[i] + self.bookcase.costs_time_one*m.bookcases[i] <= self.avail_hours_c)
            m.workshopEQ.add(self.bed.costs_time_two*m.bedframes[i] + self.bookcase.costs_time_two*m.bookcases[i] <= self.avail_hours_d)
        return m


    def build_model(self, dual = True, verbose = True):
        """Build the model and add the result as the files 'result'

        Returns:
            ConcreteModel: The final model to work with.
        """
        #logging.getLogger('pyomo.core').setLevel(logging.ERROR)
        m = pyo.ConcreteModel()
        if dual == 'True':
            m.dual = pyo.Suffix(direction=pyo.Suffix.IMPORT)

        m = self.add_variables(m)
        m = self.add_objective(m)
        m = self.add_constraints(m)

        m.results = SolverFactory('cplex_direct').solve(m, tee=verbose)
        self.model = m
        return m

    def save_model(self, filename='model'):
        """Saves the model on the disk.

        Args:
            filename (str, optional): The name of the file. Defaults to 'model'.
        """
        self.model.write(filename=filename+'.lp')
