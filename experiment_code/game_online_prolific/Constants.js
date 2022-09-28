/**
 *
 * This module contains settings concerning the games functionality.
 * To change the behavior of the game, see {@link module:GameProperties}.
 *
 * @module Constants
 */

import {parseLP} from './glpkUtility.js';



 /*
  * Load the Game Properties into this script allows to access them
  * via the constants.
  */
export * from './GameProperties.js';

/**
 * Provide the path to the linear programming problem in cplex format.
 * @name module:Constants#MODEL
 */
export const MODEL = 'model_v6_parts.xml';

/**
 * The path to the optimal solution in JSON format.
 * @name module:Constants#SOLUTION
 */
export const SOLUTION = 'model_v6_solution_parts.xml';

/**
 * Disables the SosciSurvey functions, to enable testing
 * on local machines.
 * If you want to run the project on SosciSurvey, in order
 * to obtain data, this option must be set to 'false'.
 * @name module:Constants#ON_LOCAL_MACHINE
 */
export const ON_LOCAL_MACHINE = true;

/**
 * A Json file mapping the action keys to the fulltext 
 * action.
 * @name module:Constants#ACTION_MAP
 */
export const ACTION_MAP = "action_map.xml";


// Importing the linear model and parsing the game relevant information
var config = parseLP();

/**
 * The available wood for every month.
 * @name module:Constants#WOOD
 */
export const WOOD = config.woodAvailable;

/**
 * The metal available for the player.
 * @name module:Constants#METAL
 */
export const METAL = config.metalAvailable;

/**
 * The hours available for workshop A.
 * @name module:Constants#HOURS_A
 */
export const HOURS_A = config.workshopAAvailable;

/**
 * The hours available for workshop B.
 * @name module:Constants#HOURS_B
 */
export const HOURS_B = config.workshopBAvailable;

/**
 * The hours available in workshop C
 * @name module:Constants#HOURS_C 
 */
export const HOURS_C = config.workshopCAvailable;

/**
 * The hours available in workshop D
 * @name module:Constants#HOURS_D
 */
export const HOURS_D = config.workshopDAvailable;

/**
 * The values for the chair item.
 * These values consist of the costs of the item and the profit.
 * @name module:Constants#CHAIR
 */
export const CHAIR = config.items.chair;

/**
 * The values for a bed item.
 * This variable stores the costs and profit of the bed.
 * @name module:Constants#BED
 */
export const BED = config.items.bed;

/**
 * The values for a table item.
 * Stores information about the costs and profit of the table.
 * @name module:Constants#TABLE
 */
export const TABLE = config.items.table;

/**
 * Values for the bookcase.
 * It contains information about the costs and profits.
 * @name module:Constants#BOOKCASE
 */
export const BOOKCASE = config.items.bookcase;


/**
 * Define the width of the diagram inside the market
 * dialogue.
 * @name module:Constants#DIAGRAM_WIDTH
 */
export const DIAGRAM_WIDTH = 280;


/**
 * Define the height of the diagram inside the market
 * dialogue.
 * @name module:Constants#DIAGRAM_HEIGHT
 */
export const DIAGRAM_HEIGHT = 65;

/**
 * The Width of a Text input dialogue.
 * This is used to ask questions to the player.
 * @name module:Constants#TEXTDIALOGUE_WIDTH
 */
export const TEXTDIALOGUE_WIDTH = 500;

/**
 * The height of the dialogue for text input.
 * @name module:Constants#TEXTDIALOGUE_HEIGHT
 */
export const TEXTDIALOGUE_HEIGHT = 400;