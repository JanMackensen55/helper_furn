import * as Constants from './Constants.js';

/**
 * @classdesc
 * This class draws a diagram comparing the player's solutions with the perfect solutions. The profits achieved are broken down by month.
 * 
 * @class Diagram
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the diagram should be displayed. This is usually a {@link NewsScene}.
 * @param {Array} data.lpProfits the optimal solutions
 * @param {Array} data.playerProfits the solutions of the player
 * @param {Number} data.months number of months in the experiment
 * @param {Number} data.x Position of the diagram on the x axis
 * @param {Number} data.y Position of the diagram on the y axis
 * @param {Number} data.height Height of the diagram
 * @param {Number} data.width Width of the diagram
 */
class Diagram extends Phaser.GameObjects.Container{
    constructor(data){
        let {scene, lpProfits, playerProfits, months, x,y, height, width} = data;
        let graphics = new Phaser.GameObjects.Graphics(scene);
        super(scene, x,y,[graphics]);
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.graphics = graphics;
        this.lpProfits = lpProfits;
        this.playerProfits = playerProfits;
        this.maxMonths = months;
        this.maxProfit = Math.max(...this.lpProfits);
        if (height && width)
        {
            this.diagramHeight = height;
            this.diagramWidth = width;
        }
        else
        {
            this.diagramHeight = Constants.DIAGRAM_HEIGHT;
            this.diagramWidth = Constants.DIAGRAM_WIDTH;
        }
        // Draw the elements of the diagram
        this.addBorder();
        this.addDescription();
        this.addOptimalProfit();
        this.addPlayerProfit();
        
    }

    
    /**
     * Adds a border for the diagram, by drawing lines
     */
    addBorder(){
        // Define additional values to draw the diagram
        this.maxY = this.startY-this.diagramHeight;
        this.maxX = this.startX+this.diagramWidth;
        // Drawing the border
        this.graphics.lineStyle(1.5, 0x000000);
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
        this.graphics.lineStyle(2, this.playerColor);
        this.graphics.beginPath();
        this.graphics.moveTo(this.startX,this.startY);
        for (let i = 0; i < this.playerProfits.length-1; i++){
            this.graphics.lineTo(this.scaleWidth(i+1), this.scaleHeight(this.playerProfits[i]));
        }
        this.graphics.strokePath();
    }


    /**
     * Adds the profits from the linear model for each month
     * to the diagram. 
     */
    addOptimalProfit(){
        this.graphics.lineStyle(2, this.modelColor);
        this.graphics.beginPath();
        this.graphics.moveTo(this.startX,this.startY);
        for (let i = 0; i < this.playerProfits.length-1; i++){
            this.graphics.lineTo(this.scaleWidth(i+1), this.scaleHeight(this.lpProfits[i]));
        
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
        return Number(this.startY-(value*(this.diagramHeight/this.maxProfit)));
    }


    /**
     * This function scales the given month relative to the maximum
     * amount of months and the width of the diagram.
     * @param {int} value a month starting at 1.
     * @returns the scaled value to be added as x coordinate to the diagram.
     */
    scaleWidth(value){
        return Number((value*(this.diagramWidth/this.maxMonths))+this.startX);
    }

    
    /**
     * Adds the description for the axis
     */
    addDescription(){
        this.add(new Phaser.GameObjects.Text(this.scene, this.startX, this.startY-(Constants.DIAGRAM_HEIGHT/2), 'Profit', {fontSize:14,color: '#000'}).setOrigin(0.5,0.9).setRotation(-1.570796));
        this.add(new Phaser.GameObjects.Text(this.scene, this.startX, this.maxY, this.maxProfit, {fontSize:13,color: '#000'}).setOrigin(1,0.5));
        this.add(new Phaser.GameObjects.Text(this.scene, this.startX, this.startY, 0, {fontSize:13,color: '#000'}));
        for (let i = 0; i <= this.maxMonths; i++){
            this.add(new Phaser.GameObjects.Text(this.scene, this.scaleWidth(i), this.startY, i, {fontSize:13,color: '#000'}));
        }
        this.add(new Phaser.GameObjects.Text(this.scene, this.startX+(Constants.DIAGRAM_WIDTH/2), this.maxY, 'Monat', {fontSize:14,color: '#000'}).setOrigin(0,1));

        this.graphics.beginPath();
        this.graphics.lineStyle(1, this.modelColor);
        this.graphics.moveTo(this.maxX+10,this.maxY);
        this.graphics.lineTo(this.maxX+20,this.maxY);
        this.graphics.strokePath();
        this.add(new Phaser.GameObjects.Text(this.scene, this.maxX+20, this.maxY, 'Opt.', {fontSize:14,color: '#000'}));
        this.graphics.beginPath();
        this.graphics.lineStyle(1, this.playerColor);
        this.graphics.moveTo(this.maxX+10,this.maxY+20);
        this.graphics.lineTo(this.maxX+20,this.maxY+20);
        this.graphics.strokePath();
        this.add(new Phaser.GameObjects.Text(this.scene, this.maxX+20, this.maxY+20, 'Du', {fontSize:14,color: '#000'}));
        
    }

}
export default Diagram;