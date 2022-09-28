import * as Constants from './Constants.js';
import Diagram from './Diagram.js';
import ItemPriceTable from './ItemPriceTable.js';
import {writeProfit, writeProducedItems, submit, writeLog} from './SosciWriter.js';

/**
 * @classdesc
 * This class implements a dialog that shows the player a newspaper on which the player
 * is shown how prices will change next month and what raw materials will be available next month.
 * Also, the player is shown a diagram {@link Diagram} of his performance in the previous months.
 * @class NewsDialogue
 * @extends Phaser.GameObjects.Container
 * @constructor 
 * @param {object} data the data object, used to create the dialogue.
 * @param {Phaser.Scene} data.scene the scene where the dialogue is placed.
 * @param {Phaser.Scene} data.mainScene The main scene from which the game is controlled
 * @param {number} data.x the x coordinate of the dialogue.
 * @param {number} data.y the y coordinate of the dialogue.
 * @param {Player} data.player the player instance that is used to retrieve the profit and information on what the player built. 
 * @param {object} data.lp the optimal solution of the linear problem, that is compared to the player's performance.
 * @param {number} data.month the month. This value is used to define which values should be read by the player and model. Usually, this refers to the last month.
 * @param {boolean} data.done a boolean specifying whether the year is over and the last month has been played. If this boolean is true, then 
 *  the dialogue is changed to a final summary.
 * @param {object} data.model the linear problem
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class NewsDialogue extends Phaser.GameObjects.Container {
    constructor(data){
        let { scene, mainScene,x, y, player, lp, month, done, model,scalingX, scalingY } = data;
        let panel = new Phaser.GameObjects.Sprite(scene, 0,0, 'newspaper').setScale(scalingX, scalingY);
        panel.displayWidth = 620*scalingX; 
        panel.displayHeight = 560*scalingY;
        super(scene,x,y,[panel]);
        this.scene = scene;
        this.mainScene = mainScene;
        this.player = player;
        this.lp = lp;
        this.month = month;
        this.panel = panel;
        this.model = model;
        this.panel.setTexture('newspaper');
        this.addDiagram();
        this.displayPriceChanges();
        this.displayNewResouces();
        this.addButtonSection();
    }


    /**
     * This function displays the price changes on the newspaper.
     * It just creates a new {@link PriceTable} object and changes it to fit inside the newspaper
     * displayed in this scene.
     */
     displayPriceChanges()
    {
        let title = new Phaser.GameObjects.Text(this.scene, -200*Constants.SCALINGX,80*Constants.SCALINGY, 'Neuer Profit', {fontSize: 20*Constants.SCALING, color: '#000'}).setOrigin(0.5);
        /**
         * The price table that is used to display the price changes on the newspaper.
         * @type {ItemPriceTable}
         */
        this.priceTable = new ItemPriceTable(
        {
            scene: this.scene,
            x: -170*Constants.SCALINGX,
            y: 180*Constants.SCALINGY, 
            pricesOld: [
                this.model.items.bed.profit[this.month-1],
                this.model.items.bookcase.profit[this.month-1],
                this.model.items.table.profit[this.month-1],
                this.model.items.chair.profit[this.month-1]
            ],
            pricesNew: [
                this.model.items.bed.profit[this.month],
                this.model.items.bookcase.profit[this.month],
                this.model.items.table.profit[this.month],
                this.model.items.chair.profit[this.month]
            ],
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });
        this.priceTable.title.destroy();
        this.priceTable.spriteFrame.destroy();
        this.priceTable.setScale(1);
        this.add([title]);
        this.add([this.priceTable]);
    }

    /**
     * Adds the button to continue with the next month.
     */
    addButtonSection()
    {
        let title = new Phaser.GameObjects.Text(this.scene, 205*Constants.SCALINGX,80*Constants.SCALINGY, 'Monat Beginnen', {fontSize: 20*Constants.SCALING, color: '#000'}).setOrigin(0.5);
        let descriptionText = new Phaser.GameObjects.Text(this.scene, title.x-5*Constants.SCALINGX,140*Constants.SCALINGY, 'Bitte denke weiterhin daran, alle deine Aktionen laut zu begründen.', {fontSize: 15*Constants.SCALING,color: '#000', wordWrap: {width: 200*Constants.SCALINGY, useAdvancedWrap: true}}).setOrigin(0.5);
        let button = new Phaser.GameObjects.Sprite(this.scene, title.x,240*Constants.SCALINGY, 'month_done').setScale(Constants.SCALINGX, Constants.SCALINGY);
        button.displayWidth -= 30*Constants.SCALINGX;
        let buttonText = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'Starten', {fontSize: 18*Constants.SCALING, color: '#fff'}).setOrigin(0.5);
        this.add([title, descriptionText, button, buttonText]);
        button.setInteractive();
        button.on('pointerdown', function()
        {
            button.setTexture('month_done_pressed');
            button.once('pointerup', function()
            {
                this.scene.parentScene.eventEmitter.emit('dialogueClosed', 'newspaper');
                this.scene.remove(Constants.SCENES.NEWS);
            }, this);
        }, this);
    }

    /**
     * Display the new resources available in the next month.
     */
    displayNewResouces()
    {
        let title = new Phaser.GameObjects.Text(this.scene, 0,90*Constants.SCALINGY, 'Verfügbares\nMaterial', {fontSize: 20*Constants.SCALING, color: '#000', align: 'center'}).setOrigin(0.5);
        let description = new Phaser.GameObjects.Text(this.scene,0,150*Constants.SCALINGY, 'In diesem Monat\nhat die Furniture C.O.\ndie folgenden\nRohstoffe:', {fontSize: 15*Constants.SCALING, color: '#000', align:'left'}).setOrigin(0.5);
        let woodText = new Phaser.GameObjects.Text(this.scene, -90*Constants.SCALINGX,200*Constants.SCALINGX, this.mainScene.player.woodList[this.mainScene.month.value], {fontSize: 18*Constants.SCALING, color: '#000'}).setOrigin(0.2);;
        let woodPicture = new Phaser.GameObjects.Sprite(this.scene, woodText.x+woodText.width, woodText.y, 'wood_icon').setScale(0.05*Constants.SCALINGX, 0.05*Constants.SCALINGY).setOrigin(0, 0.3);
        let metalText = new Phaser.GameObjects.Text(this.scene, woodText.x,woodText.y+30*Constants.SCALINGY, this.mainScene.player.metalList[this.mainScene.month.value], {fontSize: 18*Constants.SCALING, color: '#000'}).setOrigin(0.2);;
        let metalPicture = new Phaser.GameObjects.Sprite(this.scene, metalText.x+metalText.width, metalText.y, 'iron_icon').setScale(0.05*Constants.SCALINGX, 0.05*Constants.SCALINGY).setOrigin(0, 0.3);
        this.add([woodText, woodPicture, metalText, metalPicture, title, description]);
        
    }
 
 
     /**
      * Add the diagram to the dialogue
      */
    addDiagram()
    {
        this.diagram = new Diagram(
        {
            scene: this.scene,
            x : 140*Constants.SCALINGX,
            y: 310* Constants.SCALINGY,
            lpProfits: this.getAllOptimalProfits(),
            playerProfits: this.mainScene.player.monthlyProfit,
            months: Constants.MONTHS
        });
    }

    /**
     * Multiplies every item with its price at the given month and adds them up
     * to generate an optimal profit for a month.
     * @param {Number} month month you are currently in (the actual month starting by zero).
     */
    getMonthProfit(month){
        let profitBed = this.lp.numberOfBeds[month]*this.model.items.bed.profit[month];
        let profitBookcase = this.lp.numberOfBookCases[month]*this.model.items.bookcase.profit[month];
        let profitTable = this.lp.numberOfTables[month]*this.model.items.table.profit[month];
        let profitChair = this.lp.numberOfChairs[month]*this.model.items.chair.profit[month];
        return profitBed+profitBookcase+profitTable+profitChair;
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

}export default NewsDialogue;