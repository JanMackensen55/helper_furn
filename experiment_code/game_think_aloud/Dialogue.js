import * as Constants from './Constants.js';
import Diagram from './Diagram.js';
import OkayScene from './OkayScene.js';
import {writeProfit, writeProducedItems, submit, writeLog} from './SosciWriter.js';

/**
 * @classdesc
 * This class implements a dialogue, that is shown if the player finishes a month.
 * It displays the furniture built by the player and compares it to the optimal solution.
 * It also renders a {@link Diagram} and gives feedback, if activated (see [GameProperties]{@link module:GameProperties}).
 * @class Dialogue
 * @extends Phaser.GameObjects.Container
 * @constructor 
 * @param {object} data the data object, used to create the dialogue.
 * @param {Phaser.Scene} data.scene the scene where the dialogue is placed.
 * @param {number} data.x the x coordinate of the dialogue.
 * @param {number} data.y the y coordinate of the dialogue.
 * @param {Player} data.player the player instance that is used to retrieve the profit and information on what the player built. 
 * @param {object} data.lp the optimal solution of the linear problem, that is compared to the player's performance.
 * @param {number} data.month the month. This value is used to define which values should be read by the player and model. Usually, this refers to the last month.
 * @param {boolean} data.done a boolean specifying whether the year is over and the last month has been played. If this boolean is true, then
 * the dialogue is changed to a final summary.
 * @param {object} data.model the linear problem
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class Dialogue extends Phaser.GameObjects.Container {
    constructor(data){
        let { scene, x, y, player, lp, month, done, model, scalingX, scalingY } = data;
        let reflect_text = "Bitte reflektiere laut deine Lösung"
        let spriteFrame = new Phaser.GameObjects.Sprite(scene, 0,0, 'summaryFrame').setScale(1.3*scalingX, 1.3*scalingY);
        let spriteButton = new Phaser.GameObjects.Sprite(scene,0,186*scalingY, 'summaryButton').setScale(scalingX, scalingY);
        let summaryText = new Phaser.GameObjects.Text(scene, 0,-190*scalingY, 'Monat beendet:',{fontSize:24*Constants.SCALING,color: '#000'}).setOrigin(0.5, 0.5);
        let ownText = new Phaser.GameObjects.Text(scene, -spriteFrame.width*scalingX/2,-150*scalingY, ' Eigene Leistung', {fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        //Player values
        let ownProfitText = new Phaser.GameObjects.Text(scene, ownText.x,ownText.y+30*scalingY,"", {fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        let builtText = new Phaser.GameObjects.Text(scene, ownProfitText.x,ownProfitText.y+60*scalingY, 'Hergestellt:', {fontSize:20*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        let producedBeds = new Phaser.GameObjects.Text(scene, ownProfitText.x, builtText.y+30*scalingY, '',{fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        let producedBookcases = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBeds.y+30*scalingY, '',{fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        let producedTables = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedBookcases.y+30*scalingY, '',{fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        let producedChairs = new Phaser.GameObjects.Text(scene, ownProfitText.x, producedTables.y+30*scalingY, '', {fontSize:18*Constants.SCALING,color: '#000'}).setOrigin(0,0.5);
        //Optimal values
        let optimalText = new Phaser.GameObjects.Text(scene, -ownProfitText.x,ownText.y, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let possibleOptimum = new Phaser.GameObjects.Text(scene, optimalText.x, builtText.y,'',{fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let linearProfitText = new Phaser.GameObjects.Text(scene, optimalText.x,optimalText.y+30*scalingY, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let optimalBeds = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBeds.y, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let optimalBookcases = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedBookcases.y, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let optimalTables = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedTables.y, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        let optimalChairs = new Phaser.GameObjects.Text(scene, linearProfitText.x, producedChairs.y, '', {fontSize:18*Constants.SCALING, color: '#000'}).setOrigin(1,0.5);
        
        //Feedback section
        let feedbackFrame = new Phaser.GameObjects.Sprite(scene, 0,110*scalingY, 'feedbackFrame').setScale(scalingX, scalingY);
        //feedbackFrame.setTint("0xdf0000")
        feedbackFrame.displayWidth = spriteFrame.width*scalingX;
        feedbackFrame.displayHeight = 60*scalingY;
        let feedbackText = new Phaser.GameObjects.Text(scene, feedbackFrame.x, feedbackFrame.y, reflect_text, {fontSize:17*Constants.SCALING,color: '#000'}).setOrigin(0.5,0.5);
        let okayText = new Phaser.GameObjects.Text(scene, spriteButton.x, spriteButton.y, 'Okay',{fontSize:22*Constants.SCALING,color: '#FFFFFF'}).setOrigin(0.5,0.5);
        super(scene, x ,y ,[spriteFrame,feedbackFrame,spriteButton,summaryText,ownProfitText,linearProfitText, okayText, ownText, optimalText, builtText, producedBeds,producedBookcases,producedTables,producedChairs,optimalBeds, optimalBookcases,optimalTables,optimalChairs, feedbackText, possibleOptimum]);
        this.scene = scene;
        this.okayText = okayText;
        this.summaryButton = spriteButton;
        this.x = x;
        this.y = y;
        
        /**
         * The player instance. This is used to read the number of items the player built and his or her profit.
         * @type {Player}
         */
        this.player = player;

        /**
         * The solution of the underlying linear programming problem. It is generated by 
         * [loadSolution]{@link glpkUtility#loadSolution} and has the following structure:
         * @property {list} numberOfBeds the number of beds built to work optimal for every month.
         * @property {list} numberOfBookCases the number of bookcases built every month.
         * @property {list} numberOfChairs the number of chairs built to work optimal for every month.
         * @property {list} numberOfTables the number of tables built to work optimal for every month.
         * @property {number} objective the total optimal profit for the year.
         */
        this.lp = lp;

        /**
         * The values of the underlying linear programming problem. It is generated by 
         * [loadSolution]{@link glpkUtility#parseLP} and has the following structure:
         * @property {value} workshopAAvailable time available in workshop A
         * @property {value} workshopBAvailable time available in workshop B
         * @property {value} workshopCAvailable time available in workshop C
         * @property {value} workshopDAvailable time available in workshop D
         * @property {list} metalAvailable quantity of metal available per month
         * @property {list} woodAvailable quantity of wood available per month
         * @property {list} items list of items that can be built
         */
        this.model = model;

        /**
         * The month the dialogue is representing.
         * @type {number}
         */
        this.month = month;

        // values that are used to move the text on the okay button down if it is pressed, in order to create 
        // a more realistic pressing animation.
        this.okayTextInit = this.okayText.y
        this.okayTextPressedPos = this.okayText.y+2;

        // Text elements for the produced items of optimal solution and player.
        this.linearProfitText = linearProfitText;
        this.optimalBeds = optimalBeds;
        this.optimalBookcases = optimalBookcases;
        this.optimalTables = optimalTables;
        this.optimalChairs = optimalChairs;
        this.optimalText = optimalText;
        this.possibleOptimum = possibleOptimum;
        this.summaryText = summaryText;
        this._ownProfitText = ownProfitText;
        this._producedBeds = producedBeds;
        this._producedBookcases = producedBookcases;
        this._producedTables = producedTables;
        this._producedChairs = producedChairs;

        this.ownProfitText = player.monthlyProfit[month];
        this.producedBeds = player.beds;
        this.producedBookcases = player.bookcases;
        this.producedTables = player.tables;
        this.producedChairs = player.chairs;
        
        /**
         * The optimal profit for the current month.
         * @type {number}
         */
        this.monthlyProfit = this.getMonthProfit(month);

        /**
         * An array containing the optimal profit for each month.
         * @type {number[]}
         */
        this.lpProfits = this.getAllOptimalProfits();

        this.feedbackText = feedbackText;
        this.feedbackFrame = feedbackFrame;


        // Only display the optimal solution if it is specified,
        if (Constants.DISPLAY_OPTIMAL_SOLUTION === 'always'){
            this.optimalText.text = 'Optimale Lösung';
            if (Constants.SHOW_SOLUTION_ASPECTS === 'all' || Constants.SHOW_SOLUTION_ASPECTS === 'profit'){
                linearProfitText.text = this.monthlyProfit+'G';
                
                
            }
            if (Constants.SHOW_SOLUTION_ASPECTS === 'all' || Constants.SHOW_SOLUTION_ASPECTS === 'products'){
                this.possibleOptimum.text = 'Mögliches Vorgehen:';
                optimalBeds.text = this.lp.numberOfBeds[month];
                optimalBookcases.text = this.lp.numberOfBookCases[month];
                optimalTables.text = this.lp.numberOfTables[month];
                optimalChairs.text = this.lp.numberOfChairs[month];
            }
        }
        
        // Make the button clickable
        this.summaryButton.setInteractive({useHandCursor: true});
        this.summaryButton.on('pointerdown', () => {
            this.summaryButton.setTexture('summaryButtonPressed');
            this.okayText.y = this.okayTextPressedPos;
            // after the click: reset the sliders, close the scene and save the values of the player.
            this.summaryButton.on('pointerup', () => {
                this.scene.parentScene.eventEmitter.emit('dialogueClosed', 'monthSummary');
                this.summaryButton.setTexture('summaryButton');
                this.okayText.y = this.okayTextInit;
                this.player.stash = {};
                this.player.saveTotalProduced();
                this.player.beds = 0;
                this.player.bookcases = 0;
                this.player.tables = 0;
                this.player.chairs = 0;
                if (this.player.monthlyProfit[this.month]==this.monthlyProfit && this.month != 0 && !done){
                    this.player.ui.update_stars(this.month, true)
                    this.scene.parentScene.scene.add(Constants.SCENES.OKAY, OkayScene, false);
                    this.scene.parentScene.scene.launch(Constants.SCENES.OKAY, {parent: this.scene.parentScene, start:false, perfect:true});
                    this.scene.remove(Constants.SCENES.SUMMARY, false)
                }
                else if (!done){
                    this.player.ui.update_stars(this.month, false)
                    this.scene.remove(Constants.SCENES.SUMMARY);
                }
            });
        });
        
        if (done){
            this.setFinalSummary(); // Start the final summary if the year is done.
        }else{
            //if (Constants.DISPLAY_FEEDBACK) this.makeFeedback();
            if (!Constants.ON_LOCAL_MACHINE){
                writeProfit('model', month,this.monthlyProfit);
                writeProducedItems('model', month, {
                beds: this.lp.numberOfBeds[month],
                bookcases: this.lp.numberOfBookCases[month],
                tables: this.lp.numberOfTables[month],
                chairs: this.lp.numberOfChairs[month]
            });
        }
        }

    }


    /**
     * Multiplies every item with its price at the given month and adds them up
     * to generate an optimal profit for a month.
     * @param {Number} month the actual month starting by zero.
     */
    getMonthProfit(month){
        let profitBed = this.lp.numberOfBeds[month]*this.model.items.bed.profit[month];
        let profitBookcase = this.lp.numberOfBookCases[month]*this.model.items.bookcase.profit[month];
        let profitTable = this.lp.numberOfTables[month]*this.model.items.table.profit[month];
        let profitChair = this.lp.numberOfChairs[month]*this.model.items.chair.profit[month];
        return profitBed+profitBookcase+profitTable+profitChair;
    }

    set producedBeds(numberOfBeds){
        this._producedBeds.text = 'Betten: '+ numberOfBeds;
    }
    set producedBookcases(numberOfBookCases){
        this._producedBookcases.text = 'Regale: '+numberOfBookCases;
    }
    set producedTables(numberOfTables){
        this._producedTables.text = 'Tische: '+numberOfTables;
    }
    set producedChairs(numberOfChairs){
        this._producedChairs.text = 'Stühle: '+numberOfChairs;
    }
    set ownProfitText(profit){
        this._ownProfitText.text = 'Profit:'+profit+ 'G'
    }


    /**
     * Starts the summary of the year, with additional information for the player.
     * This function also listens for the final click of the button to submit all 
     * stored values to SosciSurvey.
     */
    setFinalSummary(){
        this.summaryText.text = 'Jahr beendet!';
        this.ownProfitText = this.player.money;
        this.producedBeds = this.player.totalBeds.slice(1).reduce((a,b) => a+b, 0);;
        this.producedBookcases = this.player.totalBookcases.slice(1).reduce((a,b) => a+b, 0);;
        this.producedTables = this.player.totalTables.slice(1).reduce((a,b) => a+b, 0);;
        this.producedChairs = this.player.totalChairs.slice(1).reduce((a,b) => a+b,0);;
        this.feedbackFrame.setVisible(true);
        this.feedbackText.text = 'Gute Arbeit!';
        this.feedbackText.x = this.feedbackFrame.x;
        this.feedbackText.setOrigin(0.5);
        this.okayText.text = 'Weiter!';
        this.summaryButton.on('pointerdown', () => {
            this.summaryButton.setTexture('summaryButtonPressed');
            this.okayText.y = this.okayTextPressedPos;
            
            this.summaryButton.on('pointerup', () => {
                this.scene.parentScene.eventEmitter.emit('dialogueClosed', 'finalSummary');
                writeLog(this.scene.parentScene.eventEmitter.getActions());
                submit();
            });
        });
        if (Constants.DISPLAY_OPTIMAL_SOLUTION === 'always' || Constants.DISPLAY_OPTIMAL_SOLUTION === 'end'){
            if (Constants.SHOW_SOLUTION_ASPECTS === 'all' || Constants.SHOW_SOLUTION_ASPECTS === 'profit'){
                this.linearProfitText.text = this.lpProfits.slice(1).reduce((a,b)=> a+b, 0)
            }
            if (Constants.SHOW_SOLUTION_ASPECTS === 'all' || Constants.SHOW_SOLUTION_ASPECTS === 'products'){
                this.optimalBeds.text = this.lp.numberOfBeds.slice(1).reduce((a,b) => a+b,0);
                this.optimalBookcases.text = this.lp.numberOfBookCases.slice(1).reduce((a,b) => a+b,0);
                this.optimalTables.text = this.lp.numberOfTables.slice(1).reduce((a,b) => a+b,0);
                this.optimalChairs.text = this.lp.numberOfChairs.slice(1).reduce((a,b) => a+b,0);
            }
        }

    }


    /**
     * Initiates the feedback towards the player.
     * The threshold values can be defined in GameProperties.js.
     */
    makeFeedback(){
        let percentage = this.player.monthlyProfit[this.month]/this.monthlyProfit;
        this.medal.setVisible(true);
        this.feedbackFrame.setVisible(true);
        if (percentage === 1){
            this.feedbackText.text = Constants.FEEDBACK_PERFECT;
            this.medal.setTexture('medal_perfect');
            return;
        }
        if (percentage >= Constants.PERCENTAGE_VERY_GOOD){
            this.feedbackText.text = Constants.FEEDBACK_VERY_GOOD;
            this.medal.setTexture('medal_very_good');
            return;
        }
        if (percentage >= Constants.PERCENTAGE_GOOD){
            this.feedbackText.text = Constants.FEEDBACK_GOOD;
            this.medal.setTexture('medal_good');
            return;
        }
        this.feedbackText.text = Constants.FEEDBACK_LOW;
        this.medal.setTexture('medal_hammer').setScale(0.25);

    }


    /**
     * Retrieves the optimal profit for every month and stores returns that list.
     */
    getAllOptimalProfits(){
        let profits = [];
        for (let i =0; i< Constants.MONTHS; i++){
            profits.push(this.getMonthProfit(i));
        }
        return profits;
    }
}

export default Dialogue;