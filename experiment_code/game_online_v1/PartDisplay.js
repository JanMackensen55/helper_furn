import Button from "./Button.js";
import { PRODUCE_ONE_CLICK } from './Constants.js';
import { PRODUCE_IN_MANAGEMENT } from "./GameProperties.js";
import { scalePartsCosts } from "./Item.js";
/**
 * @classdesc
 * This class displays the parts of an item and has buttons to initiate its production.
 * 
 * @class PartDisplay
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * 
 * @constructor 
 * @param {object} data the object that contains the values required to build the part display.
 * @param {Phaser.Scene} data.scene A phaser scene that defines where the Display is rendered.
 * @param {number} data.x the x coordinate for the object.
 * @param {number} data.y the y coordinate for the object.
 * @param {Item} data.item the item. This item provides the parts that will be displayed
 *    inside the part display.
 * 
 */
class PartDisplay extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x, y, item} = data;
        // Initiate the visible resources needed:
        let partDisplay = new Phaser.GameObjects.Sprite(scene, 0, 0, 'part-display').setScale(2.5);
        let header = new Phaser.GameObjects.Text(scene, 0,-110,  'Einzelteile', {fontSize: 15,color: '#000'});
        // Images for the two parts
        let partOne = new Phaser.GameObjects.Sprite(scene, -20, -40, item.parts[0].imageCode).setScale(2.5).setScale(1);
        let partTwo = new Phaser.GameObjects.Sprite(scene, -20, 60, item.parts[1].imageCode).setScale(2.5).setScale(1);
        // names of the two parts
        let partOneText = new Phaser.GameObjects.Text(scene, 60,-80,  item.parts[0].demand + 'x'+item.parts[0].name, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        let partTwoText = new Phaser.GameObjects.Text(scene, 60,15,  item.parts[1].demand + 'x'+item.parts[1].name, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        // Set the costs. Scale them if the everything needs to be produced with just one click.
        let costsOne = item.parts[0].costs;
        let costsTwo = item.parts[1].costs;
        if (PRODUCE_ONE_CLICK)
        {
            costsOne = scalePartsCosts(item.parts[0]);
            costsTwo = scalePartsCosts(item.parts[1]);
        }
        let costsWoodOne = new Phaser.GameObjects.Text(scene, partOneText.x-40,partOneText.y+20, costsOne.wood, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        let woodOne = new Phaser.GameObjects.Sprite(scene, costsWoodOne.x+costsWoodOne.width, costsWoodOne.y,'wood').setScale(0.04).setOrigin(0,0.5);
        let costsMetalOne = new Phaser.GameObjects.Text(scene, costsWoodOne.x,costsWoodOne.y+20, costsOne.metal, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        let metalOne = new Phaser.GameObjects.Sprite(scene, costsMetalOne.x+costsMetalOne.width, costsMetalOne.y, 'metal').setOrigin(0,0.5).setScale(0.05);
        let costsWoodTwo = new Phaser.GameObjects.Text(scene, costsWoodOne.x,partTwoText.y+20, costsTwo.wood, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        let woodTwo = new Phaser.GameObjects.Sprite(scene, costsWoodTwo.x+costsWoodTwo.width, costsWoodTwo.y,'wood').setScale(0.04).setOrigin(0,0.5);
        let costsMetalTwo = new Phaser.GameObjects.Text(scene, costsWoodTwo.x,costsWoodTwo.y+20, costsTwo.metal, {fontSize: 15,color: '#000'}).setOrigin(0.5,0.5);
        let metalTwo = new Phaser.GameObjects.Sprite(scene, costsMetalTwo.x+costsMetalTwo.width, costsMetalTwo.y, 'metal').setOrigin(0,0.5).setScale(0.05);
        let workshopOne, workshopTwo, hoursOne, hoursTwo;
        if (item.branch == 0)
        {   
            workshopOne = scene.mainScene.workshopA.image;
            hoursOne = costsOne.hoursA;
            workshopTwo = scene.mainScene.workshopB.image;
            hoursTwo = costsTwo.hoursB;
        }
        else if (item.branch == 1)
        {
            workshopOne = scene.mainScene.workshopC.image;
            hoursOne = costsOne.hoursC;
            workshopTwo = scene.mainScene.workshopD.image;
            hoursTwo = costsTwo.hoursD;
        }
        let durationOne =  new Phaser.GameObjects.Text(scene, costsWoodOne.x,costsMetalOne.y+20,hoursOne + ' in', {fontSize: 15,color: '#000'}).setOrigin(0.08,0.5);
        let pictureOne = new Phaser.GameObjects.Sprite(scene, durationOne.x+durationOne.width,durationOne.y,workshopOne).setScale(0.38).setOrigin(0,0.5);
        let durationTwo =  new Phaser.GameObjects.Text(scene, costsWoodOne.x,metalTwo.y+20,hoursTwo+' in', {fontSize: 15,color: '#000'}).setOrigin(0.06,0.5);
        let pictureTwo = new Phaser.GameObjects.Sprite(scene, durationTwo.x+durationTwo.width,durationTwo.y,workshopTwo).setScale(0.38).setOrigin(0,0.5);
        super(scene, x, y, [partDisplay, header, partOne,partTwo, partOneText,partTwoText,costsWoodOne,woodOne,costsMetalOne,metalOne, durationOne, pictureOne,costsWoodTwo,woodTwo,costsMetalTwo,metalTwo,durationOne,durationTwo,pictureOne,pictureTwo]);
        this.metalOne = metalOne;
        this.metalTwo = metalTwo;
        /**
         * This is the scene that defines where this object is rendered.
         * 
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * The costs of the first part of the item. It is used to display the costs of the 
         * part in the user interface.
         * If the option [PRODUCE_ONE_CLICK]{@link module:GameProperties#PRODUCE_ONE_CLICK} is activated,
         * the costs are scaled to represent the total costs of producing the amount of parts to built the final item.
         * As an example: If the part costs 1 metal but the part is required 4 time to produce the item, its
         * costs will be displayed as 4 metal.
         * 
         * @property {number} wood the costs of wood  
         * @property {number} metal the costs of metal
         * @property {number} hoursA the time needed in workshop A
         * @property {number} hoursB the time needed in workshop B
         * @property {number} hoursC the time needed in workshop C
         * @property {number} hoursD the time needed in workshop D
         */
        this.costsOne = costsOne;
        /**
         * The same as for [costsOne]{@link PartDisplay#costsOne} but for the second item.
         */
        this.costsTwo = costsTwo;
        
        /**
         * This is the item that should be produced. From this property the parts are read and 
         * displayed. 
         * 
         * @type {Item}
         */
        this.item = item;

        if (PRODUCE_IN_MANAGEMENT)
        {
            this.createProduceButtons();
        }

        /**
         * Defines if the display is currently active, which means that it is visible.
         * @type {boolean}
         */
        this.active = false;
    }


    /**
     * This function will be delivered to the two buttons that are created in this class.
     * It initiates the building process of the part after checking if it can be produced.
     * @see Button
     */
    callbackFunction()
    {
        let scaledItem = {...this.item};
        let productionAmount = 1;
        if (PRODUCE_ONE_CLICK)
        {
            scaledItem.costs = this.costs;
            productionAmount = this.item.demand;
        }
        let result = this.scene.management.canAfford(scaledItem);
        if (result.status)
            {
                for (let i = 0; i < productionAmount; i++)
                {
                    this.scene.management.produce(this.item);
                }
                this.scene.clickSound.play();
                this.button.showMessage('Wird gebaut!');
            }
            else
            {
                this.scene.errorSound.play();
                this.button.showMessage(result.reason, true);
            }
    }


    /**
     * The setter for the activity status of this display.
     * If it is set to true, it will animate its appearance.
     * If set to false it will deactivate itself with an anmation.
     * 
     * @param {boolean} val The value to set partDisplay active or inactive.
     */
    set active(val)
    {
        this._active  = val
        if (this._active)
        {
            
            this.scene.tweens.add
            (
                {
                    targets: this,
                    alpha: 1,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out
                }
            );
        }
        else
        {
            this.scene.tweens.add
            (
                {
                    targets: this,
                    alpha: 0,
                    duration: 500,
                    ease: Phaser.Math.Easing.Sine.Out
                }
            );
        }
    }
    
    /**
     * Requests the active value.
     * @returns {boolean} a boolean indicating if the partDisplay is active.
     */
    get  active()
    {
        return this._active;
    }

    /**
     * This function creates two buttons to produce the parts.
     * It is only invoked, if [PRODUCE_IN_MANAGEMENT]{@link module:GameProperties#PRODUCE_IN_MANAGEMENT} is set to `true` is true.
     */
    createProduceButtons()
    {
         /**
         * The button for the first item.
         * If it is clicked, the first part will be produced.
         * This button is created if [PRODUCE_IN_MANAGEMENT]{@link module:GameProperties#PRODUCE_IN_MANAGEMENT} is set to `true`.
         * 
         * @type {Button}
         */
        this.buttonOne = new Button(this.scene,140,this.metalOne.y,'button-square-unpressed','button-square','notes', this.callbackFunction, undefined, this.item.parts[0].name);
        this.buttonOne.setImageScale(0.25);

        /**
         * This is the context that is given to the first button. 
         * The context is assigned individually, which enables to have only one [callbackFunction]{@link PartDisplay#callbackFunction}
         * for both buttons. The different contexts represent the data that is used by the callback function to initiate the production of the parts.
         *
         * @property {Phaser.Scene} scene The scene that is used by this class
         * @property {Button} button the button to trigger the message.
         * @property {object} item this should be an object representing an [itempart]{@link Item#parts}.
         * @property {object} costs the (scaled) costs of the item, depending on the options. See {@link PartDisplay#costsOne}.
         * 
         */
        this.buttonOne.setContext(  
        {
            scene: this.scene,
            button: this.buttonOne,
            item: this.item.parts[0],
            costs: this.costsOne  
        });
        // The button is near the right border, so we push the text more to the left.
        // This ensures that it is readable.
        this.buttonOne.messageOffsetX = -60;
        this.add(this.buttonOne);
        
        /**
         * This is the second button, representing the second part of the item.
         * @type {Button}
         */
        this.buttonTwo = new Button(this.scene,140,this.metalTwo.y,'button-square-unpressed','button-square','notes', this.callbackFunction,undefined, this.item.parts[1].name);
        this.buttonTwo.setImageScale(0.25);
        // We use this context to produce a specific item without needing to write a whole new 
        // callback function, since the callback function for both buttons will use individual contexts.
        this.buttonTwo.setContext(  
        {
            scene: this.scene,
            button: this.buttonTwo,
            item: this.item.parts[1],
            costs: this.costsTwo 
        });
        this.buttonTwo.messageOffsetX = -60;
        this.add([this.buttonOne, this.buttonTwo]);
    }
}

export default PartDisplay;