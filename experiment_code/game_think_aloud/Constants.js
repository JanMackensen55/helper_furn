/**
 *
 * This module contains settings concerning the games functionality.
 * To change the behavior of the game, see {@link module:GameProperties}.
 *
 * @module Constants
 */
import {parseLP} from './glpkUtility.js';

/**
 * Provide the path to the linear programming problem for group 1 in cplex format.
 * @name module:Constants#MODEL_1
 */
export const MODEL_1 =  ' thinkaloud_model_group1.xml '; //'model_v4.xml';

/**
 * Provide the path to the linear programming solution for group 1 in cplex format.
 * @name module:Constants#SOLUTION_1
 */
export const SOLUTION_1 = 'thinkaloud_model_group1_solution.xml';

/**
 * Provide the path to the linear programming problem for group 2 in cplex format.
 * @name module:Constants#MODEL_2
 */
export const MODEL_2 =  ' thinkaloud_model_group2.xml ';

/**
 * Provide the path to the linear programming solution for group 2 in cplex format.
 * @name module:Constants#SOLUTION_2
 */
export const SOLUTION_2 = 'thinkaloud_model_group2_solution.xml';

/**
 * Number of months
 * @name module:Constants#MONTHS
 */
export const MONTHS = 7;

/**
 * The width of the game
 * @name module:Constants#WIDTH
 */
 export const WIDTH = 800;

 /**
  * The height of the game
  * @name module:Constants#HEIGHT
  */
 export const HEIGHT = 600;

/**
  * Enable automatic adjustment to the available screen size
  * @name module:Constants#AUTOSCALING
  */
 export const AUTOSCALING = false;

 /**
  * Scaling of the game window
  * @name module:Constants#SCALING
  */
  export const SCALING = 1.3;

 /**
  * Scaling of the game window on x axis
  * @name module:Constants#SCALINGX
  */
 export const SCALINGX = (WIDTH/800)*SCALING;

 /**
  * Scaling of the game window on y axis
  * @name module:Constants#SCALINGY
  */
  export const SCALINGY = (HEIGHT/600)*SCALING;

 /**
  * Scene keys, that are used in the game.
  * @name module:Constants#SCENES
  */
 export const SCENES = {
   MAIN: "MainScene",
   SUMMARY: "SummaryScene",
   WARNING: "WarningScene",
   NEWS: "NewsScene",
   OKAY: "OkayScene",
   EXPLAIN: "ExplainScene"
 };

/**
 * Disables the SosciSurvey functions, to enable testing
 * on local machines.
 * If you want to run the project on SosciSurvey, in order
 * to obtain data, this option must be set to 'false'.
 * @name module:Constants#ON_LOCAL_MACHINE
 */
 export const ON_LOCAL_MACHINE = true;

  /**
   * Specifies the maximum width of the bar that indicates the available
   * hours.
   * @name module:Constants#MAX_BAR_WIDTH
   */
 export const MAX_BAR_WIDTH = 150*SCALINGX;

 /**
  * Specify the fade-in duration of the background.
  * @name module:Constants#FADE_IN_TIME
  */
 export const FADE_IN_TIME = 300;

 /**
  * Specify the delay of the other sprites after the fade in. This creates the effect of the screen turning
  * darker before the dialogue starts.
  * @name module:Constants#FADE_DELAY
  */
 export const FADE_DELAY = 75;

 /**
  * The duration of the zoom effect when showing the dialogue.
  * @name module:Constants#ZOOM_DURATION
  */
 export const ZOOM_DURATION = 150;

 /**
  * Define the maximum values for the slider
  * @name module:Constants#MAX_SLIDER_VALUES
  */
 export const MAX_SLIDER_VALUES = 20;

/**
 * Define the display duration of the missing material text
 * @name module:Constants#MISSING_TEXT_DURATION
 */
export const MISSING_TEXT_DURATION = 700;

/**
 * Define the display duration of the item price change notification
 * @name module:Constants#ITEM_PRICE_CHANGES_DURATION
 */
export const ITEM_PRICE_CHANGES_DURATION = 4000;

/**
 * Define the width of the diagram of profit
 * @name module:Constants#DIAGRAM_WIDTH
 */
export const DIAGRAM_WIDTH = 480;

/**
 * Define the height of the diagram of profit
 * @name module:Constants#DIAGRAM_HEIGHT
 */
export const DIAGRAM_HEIGHT = 80;

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

/**
 * Time interval in which, in case of not moving the slider, this
 * not moving is logged (sec)
 * @name module:Constants#SLIDER_STOPPING_TIME
 */
export const SLIDER_STOPPING_TIME = 1;


/**
  * Import the Game Properties
  */
export * from './GameProperties.js';


/**
 * A Json file mapping the action keys to the fulltext
 * action.
 * @name module:Constants#ACTION_MAP
 */
export const ACTION_MAP = "action_map.xml";
