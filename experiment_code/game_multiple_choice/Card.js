import Slider from './Slider.js';
import * as Constants from './Constants.js';

/**
 * @classdesc
 * This class represents a Card.
 * Cards are used to display items that can be built. A card contains a picture of the item and information
 * like its selling price and costs. Additionally each card has a {@link Slider} the player can use to adjust the desired amount
 * of items to be built.
 * 
 * @class Card
 * @extends Phaser.GameObjects.Container
 * @see Slider
 * @constructor
 * 
 * @param {object} data the data object containing relevant data to create a card.
 * @param {Phaser.Scene} data.scene the scene, where a card should be created. This should be a {@link MainScene} instance.
 * @param {string} data.title the title of the card. It will be displayed on top of the card, usually indicating the name of the item, e.,g., Chair.
 * @param {number} data.x the x-coordinate of the center of the card object.
 * @param {number} data.y the y-coordinate of the center of the card object.
 * @param {string} data.image the image key, referring to a picture of the item that should be represented by that card. For more
 *                            information about retrieving an image key, read about the [Loader Plugin]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#image__anchor} in the Phaser 
 *                            documentation.
 * @param {object} data.item A container that holds the [costs]{@link Card#costs} and the potential [profit]{@link Card#profitList} of the item.
 * @param {number} data.branch A number that can be 1 or 2, representing one of the two branches. Items in branch 1 will be built by workshop A and B, while 
 *                             items from branch 2 will be built by workshop C and D.
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 * 
 */
class Card extends Phaser.GameObjects.Container {
    constructor(data)
    {
        let { scene, title, x, y, image, item, branch, scalingX, scalingY} = data;
        let {costs, profit} = item;
        // define all the ui elements
        let scale = scalingX
        let goldIcon = new Phaser.GameObjects.Sprite(scene, 0,0, 'gold_icon').setOrigin(0,0.17).setScale(1.5*scalingX, 1.5*scalingY);
        let potentialGoldIcon = new Phaser.GameObjects.Sprite(scene, 0,0, 'gold_icon').setOrigin(0,0.17).setScale(1.5*scalingX, 1.5*scalingY).setVisible(false);
        let spriteImage = new Phaser.GameObjects.Sprite(scene, 0,0, 'card_background').setScale(scalingX, scalingY); 
        let titleText = new Phaser.GameObjects.Text(scene,0,100,title, {fontSize: 24*scale, color: '#000'});
        let profitText = new Phaser.GameObjects.Text(scene,-110*scalingX,-50*scalingY, "",{fontSize: 19*scale, color: '#000'});
        let costText = new Phaser.GameObjects.Text(scene,profitText.x,profitText.y+25*scalingY, "",{fontSize: 19*scale, color: '#000'});
        let woodIcon = new Phaser.GameObjects.Sprite(scene, costText.x+95*scalingX,costText.y, 'wood_icon').setScale(0.05*scalingX, 0.05*scalingY).setOrigin(0,0.25);
        let ironIcon = new Phaser.GameObjects.Sprite(scene, costText.x+150*scalingX,costText.y,'iron_icon').setScale(0.05*scalingX, 0.05*scalingY).setOrigin(0,0.25);
        let durationTextOne = new Phaser.GameObjects.Text(scene, -30*scalingX,5*scalingY,'Dauer in ',{fontSize: 15*scale, color: '#000'});
        let durationTextTwo = new Phaser.GameObjects.Text(scene, -30*scalingX,30*scalingY,'Dauer in ',{fontSize: 15*scale, color: '#000'});
        let spriteWorkshopA = new Phaser.GameObjects.Sprite(scene, durationTextOne.x+durationTextOne.width,durationTextOne.y,'workshop-a').setScale(0.095*scalingX, 0.095*scalingY).setOrigin(0,0.33).setVisible(false);
        let spriteWorkshopB = new Phaser.GameObjects.Sprite(scene, durationTextTwo.x+durationTextTwo.width,durationTextTwo.y,'workshop-b').setScale(0.09*scalingX, 0.09*scalingY).setOrigin(0,0.33).setVisible(false);
        let spriteWorkshopC = new Phaser.GameObjects.Sprite(scene, durationTextOne.x+durationTextOne.width,durationTextOne.y,'workshop-c').setScale(0.095*scalingX, 0.095*scalingY).setOrigin(0,0.33).setVisible(false);
        let spriteWorkshopD = new Phaser.GameObjects.Sprite(scene, durationTextTwo.x+durationTextTwo.width,durationTextTwo.y,'workshop-d').setScale(0.09*scalingX, 0.09*scalingY).setOrigin(0,0.33).setVisible(false);
        let itemPanel = new Phaser.GameObjects.Sprite(scene,(spriteImage.width/2)-19*scalingX, (spriteImage.height/2)-14*scalingY, 'itemNumberPanel').setOrigin(0, 0)
        itemPanel.setDisplaySize(35*scalingX, 35*scalingY)
        itemPanel.setSize(35*scalingX, 35*scalingY)
        let itemNumber = new Phaser.GameObjects.Text(scene, itemPanel.x+itemPanel.width/2, itemPanel.y+itemPanel.height/2, "0", {fontSize: 30*scale, color: '#FFFFFF'}).setOrigin(0.5, 0.5)
        let itemPanelText = new Phaser.GameObjects.Text(scene, itemPanel.x, itemPanel.y+itemPanel.height/2, "Momentan Gebaut:", {fontSize: 19*scale, color: '#000'}).setOrigin(1, 0.5)
        //Potential values
        let potentialProfit = new Phaser.GameObjects.Text(scene, profitText.width, profitText.y,"", {fontSize: 19*scale, color: '#008000'}).setOrigin(0,0);
        let spriteArrowProfit = new Phaser.GameObjects.Sprite(scene, potentialProfit.x - 15*scalingX, potentialProfit.y+potentialProfit.height/4, 'green_arrow').setScale(0.3*scalingX, 0.3*scalingY).setOrigin(0,0).setVisible(false);
        // Add all resources to the scene
        super(scene,x,y,[spriteImage, goldIcon, potentialGoldIcon, titleText, costText, profitText, durationTextOne, durationTextTwo, potentialProfit,spriteArrowProfit,spriteWorkshopA,spriteWorkshopC,spriteWorkshopB,spriteWorkshopD, woodIcon, ironIcon, itemPanel, itemNumber, itemPanelText]);
        /**
         * The slider at the bottom of a card, which is used to specify the quantity of that item to be built.
         * @type {module:Slider~Slider}
         */

        /**
         * this.slider = new Slider({
            scene: scene,
            card: this,
            x: 2*scalingX,
            y: 110.9*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        }); 
         */
        
        this.itemNumber = itemNumber
        this.scalingX = scalingX
        this.scalingY = scalingY
        this.goldIcon = goldIcon;
        this.potentialGoldIcon = potentialGoldIcon;
        /**
         * The error panel, that will be displayed if the player cannot increase the slider
         * because of missing materials or time
         * @type {MissingPanel}
         */
        //this.errorPanel = this.slider.panel
        // add the slider and the panel to the card
        //this.add(this.errorPanel);
        
        //this.add(this.slider);

        /**
         * The branch of the item represented by this card.
         * It is either 1 or 2 representing one of the two branches. Items in branch 1 will be built in
         * workshop A and B, while items from branch 2 will be built at workshop C and D.
         * @type {number}
         */
        this.branch = branch;
        this.spriteImage = spriteImage;
        
        /**
         * The scene wher the card should be rendered. 
         * A {@link MainScene} instance is recommendet.
         */
        this.scene = scene;

        // Text elements of that card.
        this.titleText = titleText;
        this.costText = costText;
        this.profitText = profitText;
        this.durationTextOne = durationTextOne;
        this.durationTextTwo = durationTextTwo;

        // The symbols for the different workshops.
        this.spriteHammer = spriteWorkshopA;
        this.spriteDrill = spriteWorkshopB;
        this.spriteSaw = spriteWorkshopC;
        this.spriteTape = spriteWorkshopD;

        // Material icons
        this.woodIcon = woodIcon;
        this.metalIcon = ironIcon;
        this.title = title;

        /**
         * The costs of the item. Accessing the costs will invoce the getter, that returns the [scaledCosts]{@link Card#scaledCosts}.
         * It consists of several parts:
         * 
         * @type {object}
         * @property {number} wood the costs of wood  
         * @property {number} metal the costs of metal
         * @property {number} hoursA the time needed in workshop A
         * @property {number} hoursB the time needed in workshop B
         * @property {number} hoursC the time needed in workshop C
         * @property {number} hoursD the time needed in workshop D
         */
        this.costs = costs;

        /**
         * The scaled costs are the costs multiplied by the chosen amount specified by the slider.
         * As an Example: if the slider is on position 5, each value inside the [costs]{@link Card#costs} is multiplied
         * by 5 and stored in this variable.
         * @type{object}
         * @property {number} wood the costs of wood  
         * @property {number} metal the costs of metal
         * @property {number} hoursA the time needed in workshop A
         * @property {number} hoursB the time needed in workshop B
         * @property {number} hoursC the time needed in workshop C
         * @property {number} hoursD the time needed in workshop D
         */
        this.scaledCosts = this._costs;

        /**
         * An array, describing the selling value of the item each month.
         * @type {number[]}
         */
        this.profitList = profit;


        this.bulidItemImage(image)
        this.add([this.itemImage])

        // Add the card to the scene
        this.scene.add.existing(this);
        this.spriteArrowProfit = spriteArrowProfit;
        this._potentialProfit = potentialProfit;
    }


    /**
     * Displays the potential profit next to the value of a card in green text.
     * @param {Number} profit the number that should be displayed next to the card. If this value is 0, nothing will be 
     *  displayed.
     */
    set potentialProfit(profit){
        if (profit == 0){
            this.spriteArrowProfit.setVisible(false);
            this._potentialProfit.text = '';
            this.potentialGoldIcon.setVisible(false);
        }else{
            // create a green arrow next to the price of an item
            this.spriteArrowProfit.setVisible(true);
            // followed by the amount of potential profit.
            this._potentialProfit.text = profit;
            this._potentialProfit.x = this.goldIcon.x + this.goldIcon.width + 30*Constants.SCALINGX;
            this.spriteArrowProfit.x = this._potentialProfit.x - 15*Constants.SCALINGX;
            this.potentialGoldIcon.x = this._potentialProfit.x + this._potentialProfit.width;
            this.potentialGoldIcon.y = this._potentialProfit.y;
            this.potentialGoldIcon.setVisible(true);


        }
    }
    

    /**
     * Sets the new month, which also sets the value of a card,
     * corresponding to the month.
     * @param {Number} newMonth the month that should be set.
     */
    set month(newMonth){
        this._month = newMonth;
        this.profit = this.profitList[this._month];
        this.scaledProfit = this._profit;
    }
    get month(){return this._month;}
    

    /**
     * Specify the name of a Card.
     * @param {string} newName The string that should be displayed in the top middle of 
     * a card.
     */
    set title(newName) {
        this._title = newName;
        this.titleText.text = this._title;
        this.titleText.maxwidth = this.spriteImage.width;
        this.titleText.x = -this.titleText.width/2;
        this.titleText.y = -75*this.scalingY;
         
    }
    get title(){return this._title}

    set costs(newCosts) {
        this._costs = newCosts;
        this.costText.maxwidth = this.spriteImage.width;
        this.updateCostTexts(this._costs);
        
    }


    bulidItemImage(imageName){
        switch(imageName){
            case "bed_pic":
                this.itemImage = new Phaser.GameObjects.Sprite(this.scene, 0,0, imageName)
                this.itemImage.setDisplaySize(70 * this.scalingX, 70 * this.scalingY)
                this.itemImage.setPosition(-75*this.scalingX, 30*this.scalingX)
                break;
            case "bookcase_pic":
                this.itemImage = new Phaser.GameObjects.Sprite(this.scene, 0,0, imageName)
                this.itemImage.setDisplaySize(65 * this.scalingX, 75 * this.scalingY)
                this.itemImage.setPosition(-75*this.scalingX, 30*this.scalingX)
                break;
            case "table_pic":
                this.itemImage = new Phaser.GameObjects.Sprite(this.scene, 0,0, imageName)
                this.itemImage.setDisplaySize(70 * this.scalingX, 50 * this.scalingY)
                this.itemImage.setPosition(-75*this.scalingX, 30*this.scalingX)
                break;
            case "chair_pic":
                this.itemImage = new Phaser.GameObjects.Sprite(this.scene, 0,0, imageName)
                this.itemImage.setDisplaySize(65 * this.scalingX, 75 * this.scalingY)
                this.itemImage.setPosition(-75*this.scalingX, 30*this.scalingX)
                break;
        }
    }

    /**
     * updates the costs of the card, by splitting the cost object and adjusting the 
     * elements depending on their size.
     * @param {object} costs the costs containing:
     *  'wood','metal','hoursA','hoursB','hoursC','hoursD'.
     */
    updateCostTexts(costs){
        this.costText.text = 'Kosten:' + costs.wood + '   ,'+ costs.metal;
        if (costs.wood >= 10){
            this.woodIcon.x = this.woodIcon.x+10*this.scalingX;
            this.metalIcon.x = this.metalIcon.x+10*this.scalingX;
        }if (costs.metal >=10){
            this.metalIcon.x=this.metalIcon.x+10*this.scalingX;
        }
        if (this.branch === 1){
            this.durationTextOne.text = 'Dauer in:   ' + costs.hoursA + "Std.";
            this.durationTextTwo.text = 'Dauer in:   ' + costs.hoursB + "Std.";
            this.spriteHammer.setVisible(true);
            this.spriteDrill.setVisible(true);
        }else {
            this.durationTextOne.text = 'Dauer in:   ' + costs.hoursC + "Std.";
            this.durationTextTwo.text = 'Dauer in:   ' + costs.hoursD + "Std.";
            this.spriteSaw.setVisible(true);
            this.spriteTape.setVisible(true);
        }
    }

    get costs(){return this.scaledCosts;}

    set profit(newProfit) {
        this._profit = newProfit;
        this.profitText.text = 'Wert:' + this._profit;
        this.goldIcon.x = this.profitText.x + this.profitText.width;
        this.goldIcon.y = this.profitText.y
    }
    get profit(){return this.scaledProfit;}


    

    /**
     * Scales the properties 'profit', 'costs', and the working hours by a given factor.
     * @param {int} addValue A multiplier for the profits that should be updated.
     */
    scaleProperties(addValue){
        let factor = this.scene.player.stash[this.title].number + addValue;
        let canAfford = this.scene.player.previewValues(this, addValue);
        if (canAfford.result){
            this.scaledCosts = {
                wood: factor*this._costs.wood, 
                metal: factor*this._costs.metal, 
                hoursA: factor*this._costs.hoursA,
                hoursB: factor*this._costs.hoursB,
                hoursC: factor*this._costs.hoursC,
                hoursD: factor*this._costs.hoursD,
            };
            this.scaledProfit = factor*this._profit;
            if (Constants.INFORM_POTENTIAL_OUTCOME_COSTS){
                this.potentialCosts = this.scaledCosts;
                this.potentialProfit = this.scaledProfit;
            }
            this.itemNumber.text = factor
            return canAfford;
        }else{

            return canAfford;
        }
    }


    /**
     * Resets the the costs and sliders to zero, to start a new month.
     */
    resetProperties(){
        this.costs = this._costs;
        this.potentialCosts = null;
        this.potentialProfit = 0;
        this.profit = this._profit;
        this.itemNumber.text = 0
        //this.slider.resetSlider();
    }
}

export default Card;