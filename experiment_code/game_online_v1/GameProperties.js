/**
 * This module specifies changes in the behavior of the game.
 * @module GameProperties
 */

/**
 * Specify how many months the simulation should last
 *
 * @name module:GameProperties#MONTHS  
 */
export const MONTHS = 12;

/**
 * Set the volume of the game sound effect.
 * This value can be between 0 and 1.
 * 
 * @name module:GameProperties#SOUND_VOLUME
 */
export const SOUND_VOLUME = 0.4;

/**
 * Specify how many seconds a month should have.
 * 
 * @name module:GameProperties#MONTH_SECONDS
 */
export const MONTH_SECONDS = [180,180,180,180,180,180,180,180,180,180,180,180];

 /**
  * Decide wheter the player has to build the parts of the furniture or if he/she just
  * needs one click in order to produce an item.
  * 
  * true - the parts need to be produced individually
  * false - the piece of furniture will be produced with one click, without splitting it into its components
  * @name module:GameProperties#PRODUCE_PARTS
  */
 export const PRODUCE_PARTS = true;

/**
 * Specify whether a market building should be created, where the player can 
 * compare the own performance with the optimal solution.
 * @name: module:GameProperties#ENABLE_MARKET
 */
export const ENABLE_MARKET = false;


/**
 * Set this to true to display Warnings if the player wants to skip a month
 * without having produced something or with active workshops.
 * @name: module:GameProperties#WARNINGS_AT_SKIP
 */
export const WARNINGS_AT_SKIP = true;

/**
* Define if the required amount of parts is queued with one click.
* If set to false, one click will initiate the production of just one item.
* If set to true, one click will produce the required amount of the item
* @name module:GameProperties#PRODUCE_ONE_CLICK
*/
 export const PRODUCE_ONE_CLICK = false;


 /**
  * This value defines how the production time should be scaled.
  * If the value is 1, one working hour corresponds to one second,
  * a value of 2 - two seconds etc.
  * @name module:GameProperties#PRODUCTION_TIME_SCALING
  */
 export const PRODUCTION_TIME_SCALING = 2;

/**
 * Decide if items should be sold automatically if all the required material
 * is available (true) or if the player has to combine the parts
 * to items inside the storage (false).
 * 
 * This Property only has an effect, if [PRODUCE_PARTS]{@link module:GameProperties#PRODUCE_PARTS} is set to 'true'.
 * @name module:GameProperties#AUTOMATIC_SELLING
 */
export const AUTOMATIC_SELLING = true;


/**
 * Specify if the itemparts should be produced inside the 
 * management.
 * If this value is set to false, the player has to open the
 * corresponding workshop in order to produce the parts.
 * @name module:GameProperties#PRODUCE_IN_MANAGEMENT
 */
export const PRODUCE_IN_MANAGEMENT = false;



/**
 * Reset working workshops and - if [PRODUCE_PARTS]{@link module:GameProperties#PRODUCE_PARTS} is true - the available
 * part on month change to prevent workshops carry the work over to the next month.
 * @name module:GameProperties#MONTHLY_RESET 
 */
export const MONTHLY_RESET = true;

 /**
  * Set the name for the chair
  * @name module:GameProperties#ITEM_NAME_CHAIR
  */
 export const ITEM_NAME_CHAIR = 'Stuhl';
 /**
  * Set the name for the table
  * @name module:GameProperties#ITEM_NAME_TABLE
  */
 export const ITEM_NAME_TABLE = 'Tisch';
 /**
  * Set the name for the bed
  * @name module:GameProperties#ITEM_NAME_BED
  */
 export const ITEM_NAME_BED = 'Bett';
 /**
  * Set the name for the bookcase
  * @name module:GameProperties#ITEM_NAME_BOOKCASE
  */
 export const ITEM_NAME_BOOKCASE = 'Regal';

/**
  * Set the name for the chair leg
  * @name module:GameProperties#PART_NAME_CHAIR_
  */
 export const PART_NAME_CHAIR_LEG = 'Stuhlbein';

 /**
  * Set the name for the chair back
  * @name module:GameProperties#PART_NAME_CHAIR_BACK
  */
 export const PART_NAME_CHAIR_BACK = 'Lehne';

 /**
  * Set the name for the table leg
  * @name module:GameProperties#PART_NAME_TABLE_LEG
  */
 export const PART_NAME_TABLE_LEG = 'Tischbein';
 /**
  * Set the name for the table top
  * @name module:GameProperties#PART_NAME_TABLE_TOP
  */
 export const PART_NAME_TABLE_TOP = 'Tischplatte';
 /**
  * Set the name for the bedframe
  * @name module:GameProperties#PART_NAME_BED_FRAME
  */
 export const PART_NAME_BED_FRAME = 'Bettrahmen';
  /**
  * Set the name for the bed-top
  * @name module:GameProperties#PART_NAME_BED_TOP
  */
 export const PART_NAME_BED_TOP = 'Bettgestell';
  /**
  * Set the name for the bookcase leg
  * @name module:GameProperties#PART_NAME_BOOKCASE_LEG
  */
 export const PART_NAME_BOOKCASE_LEG = 'Regalrahmen';
  /**
  * Set the name for the bookcase top
  * @name module:GameProperties#PART_NAME_BOOKCASE_TOP
  */
 export const PART_NAME_BOOKCASE_TOP = 'Regalbrett';


 /**
 * Shows a feedback text inside the market.
 * depending on the distance of the profit towards the optimal profit.
 * @name module:GameProperties#DISPLAY_FEEDBACK
 */
export const DISPLAY_FEEDBACK = true;


/**
 * Specify when the optimal solution should be displayed.
 * possible values:
 * 'always' : The optimal solution is displayed every month on the summary page.
 * 'end' : Displays the optimal solution in the end of the last month.
 * 'never' : The player gets never informed about the optimal solution. 
 * 
 * Uncomment the statement that you want to use.
 * export const DISPLAY_OPTIMAL_SOLUTION = 'always';
 * export const DISPLAY_OPTIMAL_SOLUTION = 'end';
 * export const DISPLAY_OPTIMAL_SOLUTION = 'never';
 * 
 * @name module:GameProperties#DISPLAY_OPTIMAL_SOLUTION
 * 
 */
export const DISPLAY_OPTIMAL_SOLUTION = 'always';

/**
 * Specify what is displayed if an optimal solution is shown.
 * Possible values:
 * 'all': displays the profit and each produced product.
 * 'profit': only displays the profit.
 * 'products': only displays the products that need to be produced to achieve the optimal profit.
 * 
 * NOTE: if DISPLAY_OPTIMAL_SOLUTION is set to 'never', none of these values are displayed.
 * 
 * uncomment the statement that you want to use.
 * export const SHOW_SOLUTION_ASPECTS = 'all';
 * export const SHOW_SOLUTION_ASPECTS = 'profit';
 * export const SHOW_SOLUTION_ASPECTS = 'products';
 * 
 * @name module:GameProperties#SHOW_SOLUTION_ASPECTS
 */
export const SHOW_SOLUTION_ASPECTS = 'all';


/**
 * If set to true, the player gets a summary after a month is done. 
 * The time of the next month starts if the player closes the summary.
 * 
 * @name module:GameProperties#MONTHLY_PAUSE
 */
export const MONTHLY_PAUSE = true;


/**
 * Define if the diagram should be displayed.
 * 
 * @name module:GameProperties#SHOW_DIAGRAM
 */
export const SHOW_DIAGRAM = true;

/**
 * The text to be displayed if the user has achieved the optimal
 * solution in terms of profit for one month
 * 
 * @name module:GameProperties#FEEDBACK_PERFECT
 */
 export const FEEDBACK_PERFECT = 'Perfekt!';

/**
 * The text for a very good solution
 * @name module:GameProperties#FEEDBACK_VERY_GOOD
 */
export const FEEDBACK_VERY_GOOD = 'Sehr gut!';
/**
 * Specify what proportion of the own solution regarding
 * the optimal solution will count as 'very good'
 * if set to 0.9, everything from 90% of the optimal
 * solution and above will count as 'very good', until 1 is reached, which will
 * trigger the perfect feedback.
 * @name module:GameProperties#PERCENTAGE_VERY_GOOD
 */
export const PERCENTAGE_VERY_GOOD = 0.95;

/**
 * The Text for a good solution
 * @name module:GameProperties#FEEDBACK_GOOD
 */
export const FEEDBACK_GOOD = 'Nicht schlecht!';
/**
 * Specify at which percentage of the score depending on the optimal solution the player should 
 * recieve a 'good' message.
 * Everything below that value will trigger the 'low' feedback,
 * values above the 'PRECENTAGE_VERY_GOOD' will trigger the 'very good'
 * message. 
 * @name module:GameProperties#PERCENTAGE_GOOD
 */
export const PERCENTAGE_GOOD = 0.7;

/**
 * The feedback text for a low profit, compared to the optimal 
 * solution
 * 
 * @name module:GameProperties#FEEDBACK_LOW
 */
export const FEEDBACK_LOW = 'Das geht besser!';

/**
 * This section covers sosciSurvey relevant values.
 * Make sure that the variable number for profit etc. is the same for model and 
 * Player.
 * I.E. PL01 should be the profit for the player and MD01 should be the profit for 
 * the Model.
 */

 /**
  * Specify the variable name of the Player section
  * @name module:GameProperties#SOCI_PLAYER_VAR
  */
 export const SOSCI_PLAYER_VAR = 'PL';
 
 /**
  * Specify the variable name of the Model section
  * @name module:GameProperties#SOCI_MODEL_VAR
  */
 export const SOSCI_MODEL_VAR = 'MD';


/**
 * Specify the variable name of the Player Time
 * @name module:GameProperties#SOCI_PLAYER_TIME_VAR
 */
export const SOSCI_PLAYER_TIME_VAR = 'PT01';


 /**
  * Specify the variable name for player profit
  * @name module:GameProperties#SOCI_PROFIT
  */
 export const SOSCI_PROFIT = '01';

 /**
  * Specify the name of the variable for produced Beds
  * @name module:GameProperties#SOCI_BEDS
  */
 export const SOSCI_BEDS = '02';

 /**
  * Specify the name of the variable for produced Bookcases
  * @name module:GameProperties#SOCI_BOOKCASES
  */
 export const SOSCI_BOOKCASES = '03';

 /**
  * Specify the name of the variable for produced Tables
  * @name module:GameProperties#SOCI_TABLES
  */
 export const SOSCI_TABLES = '04';

 /**
  * Specify the name of the variable for produced Chairs
  * @name module:GameProperties#SOCI_CHAIRS
  */
 export const SOSCI_CHAIRS = '05';

 /**
  * The variable that should indicated if the player had producing workshops as the month
  * has changed
  * 
  * @name module:GameProperties#SOCI_WAS_PRODUCING
  */
 export const SOSCI_WAS_PRODUCING = '06';
 
 /**
  * The variable that represents the free-text answers of the user.
  * @name module:GameProperties#SOSCI_ANSWER
  */
 export const SOSCI_ANSWER = 'AN01';

 /**
  * The variable represents the assessment answers of the user.
  * @name module:GameProperties#SOSCI_ASSESSMENT
  */
 export const SOSCI_ASSESSMENT = 'AS';


 /**
  * The feeback that the player gives to mike
  * @name module:GameProperties_SOSCI_FEEDBACK
  */
 export const SOSCI_FEEDBACK = 'FB';

  /**
  * The variable where the log is saved
  * @name module:GameProperties_SOSCI_LOG
  */
 export const SOSCI_LOG = 'LG01_01';

 /**
  * The minimum text length, the user needs to provide in order to answer the question.
  * @name module:GameProperties#MINIMUM_TEXT_SIZE
  */
 export const MINIMUM_TEXT_SIZE = 30;