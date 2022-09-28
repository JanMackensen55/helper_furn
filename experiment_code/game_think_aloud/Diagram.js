import * as Constants from './Constants.js';
/**
 * @classdesc 
 * Implements a diagram that displays a comparison of profit on the y-axix and the month on the x-axis.
 * It is used to compare the player's and the optimal profit during the game. 
 * @class Diagram
 * @constructor
 * @param {object} data the data object that is used to create a diagram.
 * @param {Phaser.Scene} data.scene the scene in which the diagram should be drawn.
 * @param {Array} data.lpProfits a list of the optimal profits for every month.
 * @param {Array} data.playerProfits a list of the player's profits for every month.
 * @param {number} data.month the number of months. This is used to scale the x-axis. 
 * @param {number} data.x the x position for the starting point of the diagram.
 * @param {number} data.y the y position for the diagram.
 */
class Diagram{
    constructor(data){
        let {scene, lpProfits, playerProfits, months, x,y} = data;
        /**
         * The scene where this diagram is drawn.
         * @type {Phaser.Scene}
         */
        this.scene = scene;
        /**
         * The x bottom left starting point of the diagram. This is initially set via the x value given by the constructor.
         * 
         * @type {number}
         */
        this.startX = x;
        /**
         * The y starting point of the diagram.
         * 
         * @type {number}
         */
        this.startY = y;
        /**
         * This is an instance of the Phaser graphics and is used to draw inside a scene.
         * @type {Phaser.GameObjects.Graphics}
         * @see [Phaser.GameObjects.Graphics]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html}
         */
        this.graphics = scene.add.graphics();

        /**
         * The list of optimal profits for every month. The length of this array is used to 
         * define for how many months the graph is displayed. As we only want to display the values until the
         * current month, the length of this array always corresponds to the actual month.
         * @type {Array}
         */
        this.lpProfits = lpProfits;

        /**
         * The profits of the player for every month. The length of this array is used to 
         * define for how many months the graph is displayed. As we only want to display the values until the
         * current month, the length of this array always corresponds to the actual month.
         * @type {Array}
         */
        this.playerProfits = playerProfits;

        /**
         * This value defines the maximum number of months for which the diagram should be scaled.
         * It also has impact to the labeling and scaling of the x-axis. This is normally set to 12, 
         * to always display the x-axis with 12 steps.
         * @type {number}
         */
        this.maxMonths = months-1;
    
        /**
         * This is maximum profit that can be reached for a month in the game.
         * It is used to scale the y-axis of the diagram, causing the maximum profit to be the highest point.
         */
        this.maxProfit = Math.max(...this.lpProfits);
        
        // Draw the elements of the diagram
        this.addBorder();
        this.addDescription();
        this.addOptimalProfit();
        this.addPlayerProfit();
        
    }

    
    /**
     * Adds a border for the diagram, by drawing a rectangle.
     */
    addBorder(){
        // Define additional values to draw the diagram
        this.maxY = this.startY-Constants.DIAGRAM_HEIGHT*Constants.SCALINGY;
        this.maxX = this.startX+Constants.DIAGRAM_WIDTH*Constants.SCALINGX;
        // Drawing the border
        this.graphics.lineStyle(1.5*Constants.SCALINGX, 0x000000);
        this.graphics.beginPath();
        this.graphics.moveTo(this.startX,this.startY);
        this.graphics.lineTo(this.startX,this.maxY);
        this.graphics.lineTo(this.maxX, this.maxY);
        this.graphics.lineTo(this.maxX, this.startY);
        this.graphics.closePath();
        this.graphics.strokePath();

        this.modelColor = 0x1a75ff;
        this.playerColor = 0xffa31a;
    }



    /**
     * Adds the profit of the player to the diagram
     */
    addPlayerProfit(){
        this.graphics.lineStyle(2*Constants.SCALINGX, this.playerColor);
        this.graphics.beginPath();
        this.graphics.moveTo(this.startX,this.startY);
        for (let i = 1; i < this.playerProfits.length; i++){
            this.graphics.lineTo(this.scaleWidth(i), this.scaleHeight(this.playerProfits[i]));
        }
        this.graphics.strokePath();
    }


    /**
     * Adds the profits from the linear model for each month
     * to the diagram. 
     */
    addOptimalProfit(){
        this.graphics.lineStyle(2*Constants.SCALINGX, this.modelColor);
        this.graphics.beginPath();
        this.graphics.moveTo(this.startX,this.startY);
        for (let i = 1; i < this.playerProfits.length; i++){
            this.graphics.lineTo(this.scaleWidth(i), this.scaleHeight(this.lpProfits[i]));
        
        }
        this.graphics.strokePath();
    }

    /**
     * This function scales a profit value relative to the maximum value
     * and the height of the diagram.
     * @param {int} value The profit for a given month
     * @returns the scaled value to be added as y coordinate to the diagram.
     */
    scaleHeight(value){
        return Number(this.startY-(value*(Constants.DIAGRAM_HEIGHT*Constants.SCALINGY/this.maxProfit)));
    }


    /**
     * This function scales the given month relative to the maximum
     * amount of months and the width of the diagram.
     * @param {int} value a month starting at 1.
     * @returns the scaled value to be added as x coordinate to the diagram.
     */
    scaleWidth(value){
        return Number((value*(Constants.DIAGRAM_WIDTH*Constants.SCALINGX/this.maxMonths))+this.startX);
    }

    
    /**
     * Adds the description for the axis
     */
    addDescription(){
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.startX, this.startY-(Constants.DIAGRAM_HEIGHT*Constants.SCALINGY/2), 'Profit', {fontSize:14*Constants.SCALING,color: '#000'}).setOrigin(0.5,1.5)).setRotation(-1.570796);
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.startX, this.maxY, this.maxProfit, {fontSize:14*Constants.SCALING,color: '#000'}).setOrigin(1,0.5));
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.startX, this.startY, 0, {fontSize:14*Constants.SCALING,color: '#000'}).setOrigin(1,1));
        for (let i = 0; i <= this.maxMonths; i++){
            this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.scaleWidth(i), this.startY, i,{fontSize:16*Constants.SCALING,color: '#000'}).setOrigin(0.5,0));
        }
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.startX+(Constants.DIAGRAM_WIDTH*Constants.SCALINGX/2), this.maxY, 'Monat', {fontSize:16*Constants.SCALING,color: '#000'}).setOrigin(0.5,1.5));

        this.graphics.beginPath();
        this.graphics.lineStyle(1*Constants.SCALINGX, this.modelColor);
        this.graphics.moveTo(this.maxX+10*Constants.SCALINGX,this.maxY);
        this.graphics.lineTo(this.maxX+20*Constants.SCALINGX,this.maxY);
        this.graphics.strokePath();
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.maxX+20*Constants.SCALINGX, this.maxY, 'Opt.', {fontSize:16*Constants.SCALING,color: '#000'}).setOrigin(-0.1, 0.5));
        this.graphics.beginPath();
        this.graphics.lineStyle(1*Constants.SCALINGX, this.playerColor);
        this.graphics.moveTo(this.maxX+10*Constants.SCALINGX,this.maxY+20*Constants.SCALINGY);
        this.graphics.lineTo(this.maxX+20*Constants.SCALINGX,this.maxY+20*Constants.SCALINGY);
        this.graphics.strokePath();
        this.scene.add.existing(new Phaser.GameObjects.Text(this.scene, this.maxX+20*Constants.SCALINGX, this.maxY+20*Constants.SCALINGY, 'Sie', {fontSize:16*Constants.SCALING,color: '#000'}).setOrigin(-0.1,0.5));
        
    }

}
export default Diagram;