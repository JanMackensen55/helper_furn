import Diagram from './Diagram.js';
import * as Constants from './Constants.js';

/**
 * @classdesc
 * This class is used to compare the profit of the player with the optimal solution.
 * Therefore several text elements as well as a diagram and feedback are generated.
 * It should be placed inside a {@link Panel} to ensure it is displayed properly.
 * 
 * @class ProfitSummary
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * 
 * @constructor
 * @param {object} data the object that contains values required to buld the summary  of the profit:
 * @param {Phaser.Scene} data.scene the Phaser scene where the summary should be displayed. This is 
 * usually a {@link MarketDialogue}.
 * @param {number} data.x the x coordinate for the object.
 * @param {number} data.y the y coordinate for the object.
 * @param {Player} data.player an instance of the player to retrieve the profits.
 * @param {number} data.month the current month of the game.
 * 
 */
class FeedbackSummary extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, mainScene, x,y, lpSolution, player, month} = data;
        month = mainScene.monthLookUP[mainScene.num_month-1];
        let ownText = new Phaser.GameObjects.Text(scene, -190,-110, 'Your solution:', {fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        // Player Values
        let ownProfitText = new Phaser.GameObjects.Text(scene, ownText.x,ownText.y+30, '', {fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        //let builtText = new Phaser.GameObjects.Text(scene, ownProfitText.x,ownProfitText.y+30, 'Hergestellt:', {fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        let producedBeds = new Phaser.GameObjects.Text(scene, ownProfitText.x, ownProfitText.y+30,  '',{fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        let producedBookcases = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBeds.y+30,  '',{fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        let producedTables = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBookcases.y+30,  '',{fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        let producedChairs = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedTables.y+30,  '',{fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        // Optimal Values
        let optimalText = new Phaser.GameObjects.Text(scene, -ownProfitText.x-20,ownText.y, '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);
        let possibleOptimum = new Phaser.GameObjects.Text(scene, optimalText.x, ownText.y,'',10,Phaser.GameObjects.Text.ALIGN).setOrigin(1,0.5);
        let linearProfitText = new Phaser.GameObjects.Text(scene, optimalText.x,optimalText.y+30, '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);
        let optimalBeds = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBeds.y,  '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);
        let optimalBookcases = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBookcases.y,  '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);
        let optimalTables = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedTables.y,  '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);
        let optimalChairs = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedChairs.y,  '', {fontSize: 15, color: '#000'}).setOrigin(1,0.5);


        let feedbackText = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedChairs.y+30, '', {fontSize: 15, color: '#000'}).setOrigin(0,0.5);
        super (scene, x ,y , [ownText, ownProfitText,producedBeds,producedChairs,producedTables,producedBookcases,optimalText,possibleOptimum,linearProfitText,optimalBeds,optimalBookcases,optimalChairs,optimalTables, feedbackText])
        
        /**
         * The solution of the linear problem. This is used to display the optimal solution.
         * 
         * @property {list} numberOfBeds the number of beds built to work optimal for every month.
         * @property {list} numberOfBookCases the number of bookcases built every month.
         * @property {list} numberOfChairs the number of chairs built to work optimal for every month.
         * @property {list} numberOfTables the number of tables built to work optimal for every month.
         * @property {number} objective the total optimal profit for the year.
         */
        this.lpSolution = lpSolution;
        
        /**
         * This is the scene that defines where this object is rendered.
         * 
         * @type {Phaser.Scene}
         */
        this.scene = scene;
        
        /**
         * The month from which the results should be displayed.
         * In this case the last month is used to display the recent profit.
         * 
         * @type {number}
         */
        this.month = month;

        /**
         * The player instance.
         * This is used to retrieve the profit of the player.
         * 
         * @type {Player}
         */
        this.player = player;
        // These values are to be manipulated using the set function
        this._ownProfitText = ownProfitText;
        this._producedBeds = producedBeds;
        this._producedBookcases = producedBookcases;
        this._producedTables = producedTables;
        this._producedChairs = producedChairs;

        /**
         * The display of the optimal solution.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.linearProfitText = linearProfitText;

        /**
         * The text placeholder that displays the number of optimal beds.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.optimalBeds = optimalBeds;

        /**
         * The text placeholder that displays the number of optimal bookcases.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.optimalBookcases = optimalBookcases;

        /**
         * The text placeholder that displays the number of optimal tables.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.optimalTables = optimalTables;

        /**
         * The text placeholder that displays the number of optimal chairs.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.optimalChairs = optimalChairs;

        /**
         * The text element for the headline of the optimal solution.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.optimalText = optimalText;

        /**
         * The headline for the possible optimal number of furniture built.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.possibleOptimum = possibleOptimum;
        
        /**
         * The textfield that displays the feedback.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.feedbackText = feedbackText;

        /**
         * The text element that displays the produced beds by the player.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.producedBeds = player.producedItems.beds[month];

        /**
         * The text element that displays the produced bookcases by the player.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.producedBookcases = player.producedItems.bookcases[month];

        /**
         * The text element that displays the produced tables by the player.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.producedTables = player.producedItems.tables[month];

        /**
         * The text element that displays the produced chairs by the player.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.producedChairs = player.producedItems.chairs[month];

        /**
         * A text field that displays the player's profit of the given month.
         * @type {Phaser.GameObjects.Text}
         * @see [Text]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Text.html}
         */
        this.ownProfitText = player.monthlyProfit[month];

        // Give the optimal text the value of the optimal profit
        this.optimalText.text = 'My solution:';

        this.optimalBeds.text = this.lpSolution.numberOfBeds[month];
        this.optimalBookcases.text = this.lpSolution.numberOfBookCases[month];
        this.optimalTables.text = this.lpSolution.numberOfTables[month];
        this.optimalChairs.text = this.lpSolution.numberOfChairs[month];
        this.linearProfitText.text = getMonthOptimalProfit(lpSolution, month);
    
        this.makeFeedback(); // If feedback should be shown, show it.
    }

    /**
     * Sets the textfield for the player's produced beds to the given value with a preceeding name. 
     * 
     * @param {number} numberOfBeds the number that should be displayed in the text field.
     */
    set producedBeds(numberOfBeds){
        this._producedBeds.text = 'Beds: '+ numberOfBeds; // We want to give the texfield also a title.
    }

    /**
     * Sets the textfield for the player's produced bookcases to the given value with a preceeding name. 
     * 
     * @param {number} numberOfBookCases the number that should be displayed in the text field.
     */
    set producedBookcases(numberOfBookCases){
        this._producedBookcases.text = 'Bookcases: '+numberOfBookCases;
    }

    /**
     * Sets the textfield for the player's produced tables to the given value with a preceeding name. 
     * 
     * @param {number} numberOfTables the number that should be displayed in the text field.
     */
    set producedTables(numberOfTables){
        this._producedTables.text = 'Tables: '+numberOfTables;
    }

    /**
     * Sets the textfield for the player's produced chairs to the given value with a preceeding name. 
     * 
     * @param {number} numberOfChairs the number that should be displayed in the text field.
     */
    set producedChairs(numberOfChairs){
        this._producedChairs.text = 'Chairs: '+numberOfChairs;
    }

    /**
     * Sets the textfield to display the given profit.
     * 
     * @param {number} profit the profit that should be displayed.
     */
    set ownProfitText(profit){
        this._ownProfitText.text = 'Profit: '+profit;
    }

    /**
     * Initiates the feedback towards the player.
     * The threshold values can be defined in [GameProperties]{@link module:GameProperties}.
     * @param {bool} isFinal defines if this is the feedback for the final solution at the end of the year.
     * @returns nothing, but the objects inside this dialogue responsible for the feedback ([medal]{@link ProfitSummary#medal},
     *    [feedbackText]{@link ProfitSummary#feedbackText} and [feedbackFrame]{@link ProfitSummary#feedbackFrame}) are made visible and filled with the feedback. 
     */
    makeFeedback(isFinal=false){
        // Calculate the percentage of the optimal solution the player reached.
        var percentage = this.player.monthlyProfit[this.month]/getMonthOptimalProfit(this.lpSolution, this.month);
        // and the frame of the feedback.
        if (percentage === 1){ // reached 100%?
            this.feedbackText.text = Constants.FEEDBACK_PERFECT;
            return;
        }
        if (percentage >= Constants.PERCENTAGE_VERY_GOOD){ // better than the very good threshold.
            this.feedbackText.text = Constants.FEEDBACK_VERY_GOOD;
            return;
        }
        if (percentage >= Constants.PERCENTAGE_GOOD){ // better than the goood threshold
            this.feedbackText.text = Constants.FEEDBACK_GOOD;
            return;
        }
        // anything below:
        this.feedbackText.text = Constants.FEEDBACK_LOW;

    }

    /**
     * This method is used for the summary after the whole year. 
     * instead of drawing just the profit of the last month, all values 
     * are summed up.
     */
    setFinalValues()
    {
        // Print values of the player
        this.ownProfitText = this.player.money;
        this.producedChairs = this.player.producedItems.chairs.reduce((a,b) => a+b);
        this.producedTables = this.player.producedItems.tables.reduce((a,b) => a+b);
        this.producedBeds = this.player.producedItems.beds.reduce((a,b) => a+b);
        this.producedBookcases = this.player.producedItems.bookcases.reduce((a,b) => a+b);

        // Print optimal values
        if (Constants.DISPLAY_OPTIMAL_SOLUTION == 'end' || Constants.DISPLAY_OPTIMAL_SOLUTION == 'always')
        {
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'profit')
            {
                this.optimalText.text = 'Optimal solution';
                let optimalProfit = getAllOptimalProfits(this.lpSolution).reduce((a,b) => a+b);
                this.linearProfitText.text = optimalProfit;
            }
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'products')
            {
                this.possibleOptimum.text = 'Possible procedure:';
                this.optimalChairs.text = this.lpSolution.numberOfChairs.reduce((a,b) => a+b);
                this.optimalTables.text = this.lpSolution.numberOfTables.reduce((a,b) => a+b);
                this.optimalBeds.text = this.lpSolution.numberOfBeds.reduce((a,b) => a+b);
                this.optimalBookcases.text = this.lpSolution.numberOfBookCases.reduce((a,b) => a+b);
            }
        }
        if (!this.diagram && Constants.SHOW_DIAGRAM)
        {
            this.addDiagram();
            this.add(this.diagram);
        }
        this.makeFeedback(true);
    }

}

/**
 * Multiplies every item with its price at the given month and adds them up
 * to generate an optimal profit for a month.
 * @param {Object} the linear problem solution to get the values from.
 * @param {Number} month the actual month starting at zero.
 */
function getMonthOptimalProfit(lp, month){
    let profitBed = lp.numberOfBeds[month]*Constants.BED.profit[month];
    let profitBookcase = lp.numberOfBookCases[month]*Constants.BOOKCASE.profit[month];
    let profitTable = lp.numberOfTables[month]*Constants.TABLE.profit[month];
    let profitChair = lp.numberOfChairs[month]*Constants.CHAIR.profit[month];
    return profitBed+profitBookcase+profitTable+profitChair;
    }

/**
 * Retrieves the optimal profit for every month and stores returns that list.
 * @param {object} the optimal solution that usually has been generated by the function [loadSolution]{@link glpkUtility#loadSolution}.
 * 
 */
function getAllOptimalProfits(lp){
    let profits = [];
    for (let i =0; i< Constants.MAX_MONTHS; i++){
        profits.push(getMonthOptimalProfit(lp, i));
    }
    return profits;
}

export default FeedbackSummary;
export {getMonthOptimalProfit, getAllOptimalProfits};
