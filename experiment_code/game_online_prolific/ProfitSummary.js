import Diagram from './Diagram.js';
import * as Constants from './Constants.js';
import MedalFeedback from './MedalFeedback.js';

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
class ProfitSummary extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, mainScene, x,y, lpSolution, player, month} = data;
        month = month -1;
        let ownText = new Phaser.GameObjects.Text(scene, -190,-110, 'Own performance', {fontSize:17,color: '#000'}).setOrigin(0,0.5);
        // Player Values
        let ownProfitText = new Phaser.GameObjects.Text(scene, ownText.x,ownText.y+30, '', {fontSize:17,color: '#000'}).setOrigin(0,0.5);
        let builtText = new Phaser.GameObjects.Text(scene, ownProfitText.x,ownProfitText.y+30, 'Made:', {fontSize:17,color: '#000'}).setOrigin(0,0.5);
        let producedBeds = new Phaser.GameObjects.Text(scene, ownProfitText.x, builtText.y+30,  '',{fontSize:17,color: '#000'}).setOrigin(0,0.5);
        let producedBookcases = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBeds.y+30,  '',{fontSize:17,color: '#000'}).setOrigin(0,0.5);
        let producedTables = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBookcases.y+30,  '',{fontSize:17,color: '#000'}).setOrigin(0,0.5);
        let producedChairs = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedTables.y+30,  '',{fontSize:17,color: '#000'}).setOrigin(0,0.5);
        // Optimal Values
        let optimalText = new Phaser.GameObjects.Text(scene, -ownProfitText.x,ownText.y, '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let possibleOptimum = new Phaser.GameObjects.Text(scene, optimalText.x, builtText.y,'',{fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let linearProfitText = new Phaser.GameObjects.Text(scene, optimalText.x,optimalText.y+30, '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let optimalBeds = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBeds.y,  '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let optimalBookcases = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBookcases.y,  '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let optimalTables = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedTables.y,  '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);
        let optimalChairs = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedChairs.y,  '', {fontSize:17,color: '#000'}).setOrigin(1,0.5);

        let feedbackFrame = new Phaser.GameObjects.Sprite(scene, 0,235, 'panel-white').setVisible(false);
        feedbackFrame.displayWidth = scene.panel.panel.displayWidth;
        feedbackFrame.displayHeight = 60;
        let medal = new Phaser.GameObjects.Sprite(scene,-100,feedbackFrame.y,'').setScale(0.6).setVisible(false);
        let feedbackText = new Phaser.GameObjects.Text(scene, medal.x+medal.width,medal.y, '', {fontSize:17,color: '#000'}).setOrigin(0,0.5);
        super (scene, x ,y , [ownText, ownProfitText,builtText,producedBeds,producedChairs,producedTables,producedBookcases,optimalText,possibleOptimum,linearProfitText,optimalBeds,optimalBookcases,optimalChairs,optimalTables, feedbackFrame, feedbackText, medal])
        
        this.mainScene = mainScene
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
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.linearProfitText = linearProfitText;

        /**
         * The text placeholder that displays the number of optimal beds.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.optimalBeds = optimalBeds;

        /**
         * The text placeholder that displays the number of optimal bookcases.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.optimalBookcases = optimalBookcases;

        /**
         * The text placeholder that displays the number of optimal tables.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.optimalTables = optimalTables;

        /**
         * The text placeholder that displays the number of optimal chairs.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.optimalChairs = optimalChairs;

        /**
         * The text element for the headline of the optimal solution.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.optimalText = optimalText;

        /**
         * The headline for the possible optimal number of furniture built.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.possibleOptimum = possibleOptimum;
        
        /**
         * The Graphic that is displaying the medal, the player sees as feedback.
         * 
         * @type {Phaser.GameObjects.Sprite}
         * @see [The Phaser Documentation]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.medal = medal;

        /**
         * The textfield that displays the feedback.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.feedbackText = feedbackText;

        /**
         * The frame around the feedback section.
         * @type {Phaser.GameObjects.Sprite}
         * @see [The Phaser Documentation]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.feedbackFrame = feedbackFrame;

        /**
         * The text element that displays the produced beds by the player.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.producedBeds = player.producedItems.beds[month];

        /**
         * The text element that displays the produced bookcases by the player.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.producedBookcases = player.producedItems.bookcases[month];

        /**
         * The text element that displays the produced tables by the player.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.producedTables = player.producedItems.tables[month];

        /**
         * The text element that displays the produced chairs by the player.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.producedChairs = player.producedItems.chairs[month];

        /**
         * A text field that displays the player's profit of the given month.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.ownProfitText = player.monthlyProfit[month];

        // if the optimal solution should be displayed:
        if (Constants.DISPLAY_OPTIMAL_SOLUTION == 'always')
        {
            // if all solution aspects or the profit should be shown:
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'profit')
            {
                // Give the optimal text the value of the optimal profit
                this.optimalText.text = 'Optimal solution';
                this.linearProfitText.text = getMonthOptimalProfit(lpSolution, month);
            }
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'products')
            {
                // if also the products should be shown, fill in the contents of the optimal solution.
                this.possibleOptimum.text = 'Possible approach:';
                this.optimalBeds.text = this.lpSolution.numberOfBeds[month];
                this.optimalBookcases.text = this.lpSolution.numberOfBookCases[month];
                this.optimalTables.text = this.lpSolution.numberOfTables[month];
                this.optimalChairs.text = this.lpSolution.numberOfChairs[month];
            }
            if (Constants.SHOW_DIAGRAM) // If the diagram should be shown, add it.
            {
                this.addDiagram();
                // make the diagram an object belonging to the summary:
                this.add(this.diagram);
            }
        }
        if (Constants.DISPLAY_FEEDBACK) this.makeFeedback(); // If feedback should be shown, show it.
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
     * Adds a diagram object to bottom of the Dialogue.
     */
    addDiagram(){
        if (!Constants.MEDAL_FEEDBACK){
            this.diagram = new Diagram({
                scene: this.scene,
                mainScene: this.scene.mainScene,
                lpProfits: getAllOptimalProfits(this.lpSolution),
                playerProfits: this.player.monthlyProfit,
                months: Constants.MONTHS,
                x: -75,
                y: 75
            });
        }else{
            this.diagram = new MedalFeedback(
                {
                    scene: this.scene,
                    mainScene: this.scene.mainScene,
                    x: 0,
                    y: 170,
                    lpProfits: getAllOptimalProfits(this.lpSolution),
                    playerProfits: this.player.monthlyProfit,
                    months: Constants.MONTHS,
                    width: 300
                });
            this.diagram.lastMonthText.destroy()
            this.diagram.title.setFontSize(17);
        }

    }

    /**
     * Initiates the feedback towards the player.
     * The threshold values can be defined in [GameProperties]{@link module:GameProperties}.
     * @param {bool} isFinal defines if this is the feedback for the final solution at the end of the year.
     * @returns nothing, but the objects inside this dialogue responsible for the feedback ([medal]{@link ProfitSummary#medal},
     *    [feedbackText]{@link ProfitSummary#feedbackText} and [feedbackFrame]{@link ProfitSummary#feedbackFrame}) are made visible and filled with the feedback. 
     */
    makeFeedback(isFinal=false){
        if (isFinal) // did we finish the year?
        {
            this.medal.setVisible(false); // We don't need the medal as we have a final text.
            this.feedbackText.x = this.feedbackFrame.x;
            this.feedbackFrame.setVisible(false);
            this.feedbackText.text = ""; // display this text to the user
            this.feedbackText.setOrigin(0.5); // center it inside the feedback frame.
            return; // nothing more to do.
        }
        else // We are in a normal month
        {
            // Calculate the percentage of the optimal solution the player reached.
            var percentage = this.player.monthlyProfit[this.month]/getMonthOptimalProfit(this.lpSolution, this.month);
        }
        this.medal.setVisible(true); // display the medal
        this.feedbackFrame.setVisible(true); // and the frame of the feedback.
        if (percentage === 1){ // reached 100%?
            this.feedbackText.text = Constants.FEEDBACK_PERFECT;
            this.medal.setTexture('medal-perfect'); // perfect feedback
            return;
        }
        if (percentage >= Constants.PERCENTAGE_VERY_GOOD){ // better than the very good threshold.
            this.feedbackText.text = Constants.FEEDBACK_VERY_GOOD;
            this.medal.setTexture('medal-very-good');
            return;
        }
        if (percentage >= Constants.PERCENTAGE_GOOD){ // better than the goood threshold
            this.feedbackText.text = Constants.FEEDBACK_GOOD;
            this.medal.setTexture('medal-good');
            return;
        }
        // anything below:
        this.feedbackText.text = Constants.FEEDBACK_LOW;
        this.medal.setTexture('medal-hammer').setScale(0.25);

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
        this.producedChairs = this.customReduce(this.player.producedItems.chairs, this.mainScene.monthLookUP);
        this.producedTables = this.customReduce(this.player.producedItems.tables, this.mainScene.monthLookUP);
        this.producedBeds = this.customReduce(this.player.producedItems.beds, this.mainScene.monthLookUP);
        this.producedBookcases = this.customReduce(this.player.producedItems.bookcases, this.mainScene.monthLookUP);
        // Print optimal values
        if (Constants.DISPLAY_OPTIMAL_SOLUTION == 'end' || Constants.DISPLAY_OPTIMAL_SOLUTION == 'always')
        {
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'profit')
            {
                this.optimalText.text = 'Optimal solution';
                let optimalProfit = this.customReduce(getAllOptimalProfits(this.lpSolution), this.mainScene.monthLookUP);
                this.linearProfitText.text = optimalProfit;
            }
            if (Constants.SHOW_SOLUTION_ASPECTS == 'all' || Constants.SHOW_SOLUTION_ASPECTS == 'products')
            {
                this.possibleOptimum.text = 'Possible approach:';
                this.optimalChairs.text = this.customReduce(this.lpSolution.numberOfChairs, this.mainScene.monthLookUP)
                this.optimalTables.text = this.customReduce(this.lpSolution.numberOfTables, this.mainScene.monthLookUP)
                this.optimalBeds.text = this.customReduce(this.lpSolution.numberOfBeds, this.mainScene.monthLookUP)
                this.optimalBookcases.text = this.customReduce(this.lpSolution.numberOfBookCases, this.mainScene.monthLookUP)
            }
        }
        if (!this.diagram && Constants.SHOW_DIAGRAM)
        {
            this.addDiagram();
            this.add(this.diagram);
        }
        this.makeFeedback(true);
    }

    customReduce(reduceArray, lookUpArray){
        var sum=0
        for (let i=0; i<reduceArray.length; i++){
            if (lookUpArray.includes(i)){
                sum = sum + reduceArray[i]
            }
        }
        return sum
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
   for (let i =0; i < Constants.MAX_MONTHS; i++){
        profits.push(getMonthOptimalProfit(lp, i));
    }
   return profits;
}

export default ProfitSummary;
export {getMonthOptimalProfit, getAllOptimalProfits};
