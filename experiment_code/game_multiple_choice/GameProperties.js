/**
 * This file contains interaction related settings.
 * @module GameProperties
 */


/**
 * Decide if the player should be informed, why the product 
 * can't be produced.
 * Example:
 * The player will recieve feedback that he/she has not enough
 * wood to produce the desired amount of chairs.
 * 
 * This also applies if the missing resource is workshop time.
 * 
 * @name module:GameProperties#INFORM_MISSING_MATERIAL
 */
export const INFORM_MISSING_MATERIAL = true;

/**
 * Decide if the player should be informed of the potential outcome
 * before producting the desired amount of furniture.
 * If activated, the player sees how much wood, metal
 * and workshop time will be used.
 * 
 * @name module:GameProperties#INFORM_POTENTIAL_OUTCOME_COSTS
 */
export const INFORM_POTENTIAL_OUTCOME_COSTS = true;


/**
 * Decide if the potential profit should be displayed before
 * building.
 * If activated the player can see the potential total profit
 * for this month.
 * 
 * @name module:GameProperties#INFORM_POTENTIAL_OUTCOME_PROFIT
 */
export const INFORM_POTENTIAL_OUTCOME_PROFIT = false;


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
 * @name module:GameProperties#SHOW_SOLUTION_ASPECTS
 */
export const SHOW_SOLUTION_ASPECTS = 'all';

/**
 * Specifies whether the explanation for the choices should be shown permanently to the test subjects,
 * or whether they should only be shown when hovering over the corresponding button.
 * @name module:GameProperties#SHOW_EXPLAINATION_PERMANENTLY
 */
export const SHOW_EXPLAINATION_PERMANENTLY = false;

/**
 * Shows a feedback text inside the market.
 * depending on the distance of the profit towards the optimal profit.
 * @name module:GameProperties#DISPLAY_FEEDBACK
 */
export const DISPLAY_FEEDBACK = true;


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
 * Specify when the diagram should be displayed.
 * Possible values: 
 * 'always'
 * 'half'
 * 'end'
 * 'never'
 * 
 * You can copy the values that you need:
 * export const DISPLAY_DIAGRAM = 'always';
 * export const DISPLAY_DIAGRAM = 'half';
 * export const DISPLAY_DIAGRAM = 'end';
 * export const DISPLAY_DIAGRAM = 'never';
 * 
 * @name module:GameProperties#DISPLAY_DIAGRAM
 */
export const DISPLAY_DIAGRAM = 'always';



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
  * The variable that represents the answers of the user.
  * @name module:GameProperties#SOSCI_ANSWER
  */
 export const SOSCI_ANSWER = 'AN01';


  /**
  * The variable where the log is saved
  * @name module:GameProperties_SOSCI_LOG
  */
   export const SOSCI_LOG = 'LG01_01';
