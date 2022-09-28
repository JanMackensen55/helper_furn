## Overview

This directory contains several linear problem definitions as well as some helper classes that should facilitate the creation and testing of linear programming problems.

### Structure

Information about the directories:



#### game_online

Contains linear problems for the online-experiment. The extension "parts" generally indicates that the problem is designed for a game where different parts should be produced to build a piece of furniture. However, the costs of each part are hardcoded in the game (MainScene#createItems()), **make sure to assign costs of each part that sum to the total costs of an item in the linear problem.**



#### game_think_aloud

Contains linear problems for the think aloud game with different values. Like in the **game_online** directory, higher numbers denote newer versions.



#### agents

A python package, that contains several strategies for solving the linear problem. It also comes with a base class to build new agents on as well as statistics and visualization tools.

#### model_builder

This python package allows to build a linear model and provides functions to export the model as well as its solution.


