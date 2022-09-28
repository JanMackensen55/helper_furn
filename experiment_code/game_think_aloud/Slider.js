import {MAX_SLIDER_VALUES, INFORM_MISSING_MATERIAL, SCALING, SLIDER_STOPPING_TIME} from './Constants.js'
import MissingPanel from './MissingPanel.js';
import Timer from './Timer.js';

/**
 * @module Slider
 */


 /**
  * @classdesc
  * This class implements a slider element, that can be used to adjust the quantity of an item to be built.
  * 
  * @class Slider
  * @extends Phaser.GameObjects.Container
  * @constructor
  * @param {object} data the data object that is used to initialize the slider.
  * @param {Phaser.Scene} data.scene the scene to render the slider in.
  * @param {Card} data.card the card where the slider should be attached to.
  * @param {Number} data.x the x coordinate of the slider.
  * @param {Number} data.y the y coordinate of the slider element.
  * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
  * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
  */
class Slider extends Phaser.GameObjects.Container{
    constructor(data){
        let scale = SCALING
        let { scene, card, x, y, depth, scalingX, scalingY} = data;
        let spriteBackground = new Phaser.GameObjects.Sprite(scene, 0,0, 'slider_background').setScale(scalingX, scalingY);
        let panelItemNumber = new Phaser.GameObjects.Sprite(scene, 80*scalingX,-3*scalingY, 'itemNumberPanel').setScale(0.3*scalingX, 0.3*scalingY);
        //let buttonMinus = new Phaser.GameObjects.Sprite(scene, -100, 30, 'slider_background'); here I will add the button
        panelItemNumber.displayWidth= 50*scalingX;
        let panelText = new Phaser.GameObjects.Text(scene,panelItemNumber.x,panelItemNumber.y, 'Bauen',{fontSize: 20*scale, color: '#FFFFFF'}).setOrigin(0.5, 0.5);
        super(scene, x,y,[spriteBackground,panelItemNumber, panelText]);
        
        /**
         * The slider component creates the knob, that can be dragged with the mouse.
         * It handels the movement and the calculation of its value.
         * @type {SliderComponent}
         */
        this.sliderComponent = new SliderComponent({
            scene: scene,
            card: card,
            x:-40*scalingX,
            y: -5*scalingY,
            maxValues: MAX_SLIDER_VALUES,
            scalingX: scalingX,
            scalingY: scalingY
        });
        // add the component to the slider
        this.add(this.sliderComponent);
        this.spriteBackground = spriteBackground;
        this.panelText = panelText;

        /**
         * The number of items that should be displayed beneath the slider, indicating the 
         * quantity to build, that has been selected. This is manipulated as the player drags the slider knob.
         * @type {number}
         */
        this.itemNumber = 0;
        
        /**
         * The card that is connected to the slider. 
         * @type {Card}
         */
        this.card = card;

        // Not used anymore.
        this.depth = depth;

        /**
         * A panel that appear when the player tryes to drag a slider above the 
         * material or time limitations. 
         * @type {MissingPanel}
         */
        this.panel = new MissingPanel({
            parent: this,
            x: this.spriteBackground.x*scalingX,
            y: 105*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });


    }
   
    set itemNumber (newT){
        this.panelText.text = newT;
    }
   
    /**
     * Resets the slider to its initial position and the item number to 0.
     * This is used for starting a new month.
     */
    resetSlider(){
        this.sliderComponent.spriteSlideKnob.x = this.sliderComponent.zeroPosKnob;
        this.sliderComponent.maxAffordableX = this.sliderComponent.zeroPosKnob;
        this.itemNumber = 0;
    }

}


/**
 * @classdesc
 * This class implements the slider logic. It takes care of the scaling of values and the calculation of the 
 * drag position.
 * 
 * @class SliderComponent
 * @extends Phaser.GameObjects.Container
 * @constructor
 * @param {object} data the data object that is used to create a slider component.
 * @param {Phaser.Scene} data.scene the scene to render the component in.
 * @param {Card} data.card
 * @param {Number} data.x the x coordinate of the slider component.
 * @param {Number} data.y the y coordinate of the slider component.
 * @param {Number} data.maxValues this number will be displayed, if the slider is dragged to the rightmost position. All values inbetween
 * 0 and maxValues will be scaled according to this value.
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class SliderComponent extends Phaser.GameObjects.Container{
    constructor(data){
        const knobPadding = 7;
        const scaleSpriteSliderBorder  = 0.8;
        const signPadding = 15;
        let {scene, card, x, y, maxValues, scalingX, scalingY} = data;
        let spriteSliderBorder = new Phaser.GameObjects.Sprite(scene,8*scalingX,0,'slide_border');
        spriteSliderBorder.scaleX = scaleSpriteSliderBorder*scalingX;
        spriteSliderBorder.scaleY = scalingY;
        let startOfSlider = spriteSliderBorder.x - spriteSliderBorder.width*scaleSpriteSliderBorder*scalingX/2;
        let endofSlider = spriteSliderBorder.x + spriteSliderBorder.width*scaleSpriteSliderBorder*scalingX/2
        let zeroPosKnob = startOfSlider + knobPadding*scalingX;
        let maxPosKnob = endofSlider - knobPadding*scalingX;
        let minusPos = startOfSlider - signPadding*scalingX;
        let plusPos = endofSlider + signPadding*scalingX;
        let spriteMinusButton = new Phaser.GameObjects.Sprite(scene, minusPos, 0, 'slider_minus');
        spriteMinusButton.scaleX = scalingX;
        spriteMinusButton.scaleY = scalingY;
        let spritePlusButton = new Phaser.GameObjects.Sprite(scene, plusPos, 0, 'slider_plus');
        spritePlusButton.scaleX = scalingX;
        spritePlusButton.scaleY = scalingY;
        let spriteSlideKnob = new Phaser.GameObjects.Sprite(scene, zeroPosKnob,0, 'slide_knob').setScale(scalingX, scalingY);
        super(scene, x, y, [spriteSliderBorder, spriteSlideKnob, spriteMinusButton, spritePlusButton]);//spriteMinusButton
        this.card = card;
        // The zero position of the knob
        this.zeroPosKnob = zeroPosKnob;
        // The position that indicates the maximum position depending on the player's available materials.
        this.maxAffordableX = zeroPosKnob;
        // Image resources
        this.spriteSliderBorder = spriteSliderBorder;
        this.spriteSlideKnob = spriteSlideKnob;
        this.spriteMinusButton = spriteMinusButton;
        this.spritePlusButton = spritePlusButton
        // Make the knob interactive and make it draggable
        this.spriteSlideKnob.setInteractive();
        this.scene.input.setDraggable(this.spriteSlideKnob);
        this.scaledSliderValue;
        this.timer = new Timer();
        // if the slider get dragged
        this.spriteSlideKnob.on('dragstart', (pointer, dragX, dragY) =>{
            this.oldScaledSliderValue = this.scaleSliderVal(dragX, zeroPosKnob, maxPosKnob, maxValues/200);
            this.timer.startTimer();
        });
        // If the slider is dragged
        this.spriteSlideKnob.on('drag', (pointer,dragX, dragY) =>{
            this.dragStatus = "success";
            this.spriteSlideKnob.setDataEnabled(); // Get more data from the game object. We need this to adjust the right slider.
            var factor = maxValues/200; // Scale the factor
            let container = this.spriteSlideKnob.data.parent.parentContainer;
            this.maxNum = this.getMaxNumber(container); // Update the maximum affordable position
            this.scaledSliderValue = this.scaleSliderVal(dragX, zeroPosKnob, maxPosKnob, factor); // Get the value of the slider depending on its position
            if (this.scaledSliderValue <= this.maxNum){ // If the player can afford the position, permit.
                container.card.scaleProperties(this.scaledSliderValue);
                container.parentContainer.itemNumber = this.scaledSliderValue;
                this.spriteSlideKnob.x = this.getX(this.scaledSliderValue,zeroPosKnob,maxPosKnob,factor);
            }     
            else{        //If  not:
                this.reason = container.card.scaleProperties(this.maxNum+1).reason
                this.dragStatus = "maximum";
                if (INFORM_MISSING_MATERIAL){
                    // Show error why the player can't afford more.
                    if (!container.card.errorPanel.active){
                        container.card.errorPanel.showError(this.reason);
                    }
                } //If the option is not activated, simply reset the slider to the maximum possible value.
                container.card.scaleProperties(this.maxNum);
                container.parentContainer.itemNumber = this.maxNum;
                this.spriteSlideKnob.x = this.getX(this.maxNum,zeroPosKnob,maxPosKnob,factor);

            
            }
            // When dragged to or below zero, rescale the value to 0 and keep the knob at the minimum position.
            // This prevents the knob from escaping its background.
            if (this.spriteSlideKnob.x < zeroPosKnob){
                this.dragStatus = "minimum";
                this.spriteSlideKnob.x = zeroPosKnob;
                container.parentContainer.itemNumber = 0;
                container.card.scaleProperties(0);
            }
            // checks if there were long pauses between the slider movements and logs them
            this.newScaledSliderValue = this.scaleSliderVal(dragX, zeroPosKnob, maxPosKnob, factor);
            if (this.oldScaledSliderValue != this.newScaledSliderValue){
                let elTime = this.timer.getElapsedTime()/1000
                let numberOfemits = Math.floor((elTime)/SLIDER_STOPPING_TIME);
                for (let i = 0; i < numberOfemits; i++) {
                    this.scene.eventEmitter.emit("slidingBreak", this.card.title, this.oldScaledSliderValue, elTime, i+1);
                }
                this.oldScaledSliderValue = this.newScaledSliderValue;
                this.timer.startTimer();
            }
        });
        //if the slider get dropped
        this.spriteSlideKnob.on('dragend', (pointer, gameObject, target)=>{
            let elTime = this.timer.getElapsedTime()/1000
            let numberOfemits = Math.floor((elTime)/SLIDER_STOPPING_TIME);
            for (let i = 0; i < numberOfemits; i++) {
                this.scene.eventEmitter.emit("slidingBreak", this.card.title, this.oldScaledSliderValue, elTime, i+1);
            }
            if (this.dragStatus == 'success'){
                this.scene.eventEmitter.emit("sliderActions", this.card.title, undefined, undefined);
            }
            else if(this.dragStatus == "minimum"){
                this.scene.eventEmitter.emit("sliderActions", this.card.title, true, undefined);
            }
            else{
                this.scene.eventEmitter.emit("sliderActions", this.card.title, true, this.reason);
            }
        });

        this.spriteMinusButton.setInteractive();
        this.spriteMinusButton.on('pointerdown', () => {
            this.spriteSlideKnob.setDataEnabled();
            this.spriteMinusButton.setScale(0.97.scalingX, 0.97*scalingY);
            var factor = maxValues/200;
            let container = this.spriteSlideKnob.data.parent.parentContainer;
            this.maxNum = this.getMaxNumber(container); // Update the maximum affordable position
            this.newScaledSliderValue = this.scaleSliderVal(this.spriteSlideKnob.x, zeroPosKnob, maxPosKnob, factor)-1;
            
            container.card.scaleProperties(this.newScaledSliderValue);
            container.parentContainer.itemNumber = this.newScaledSliderValue;
            this.spriteSlideKnob.x = this.getX(this.newScaledSliderValue,zeroPosKnob,maxPosKnob,factor);

            // When dragged to or below zero, rescale the value to 0 and keep the knob at the minimum position.
            // This prevents the knob from escaping its background.
            if (this.spriteSlideKnob.x < zeroPosKnob){
                this.spriteSlideKnob.x = zeroPosKnob;
                container.parentContainer.itemNumber = 0;
                container.card.scaleProperties(0);
                this.scene.eventEmitter.emit('arrowButtons', this.card.title, "decrease", "fail");
            }
            else{
                this.scene.eventEmitter.emit('arrowButtons', this.card.title, "decrease", undefined);
            }
            this.spriteMinusButton.once('pointerup', () => {
                this.spriteMinusButton.setScale(scalingX, scalingY);
            });

                });
        this.spritePlusButton.setInteractive();
        this.spritePlusButton.on('pointerdown', () => {
            this.spritePlusButton.setScale(0.97.scalingX, 0.97*scalingY);
            this.spriteSlideKnob.setDataEnabled();
            var factor = maxValues/200;
            let container = this.spriteSlideKnob.data.parent.parentContainer;
            this.maxNum = this.getMaxNumber(container); // Update the maximum affordable position
            this.newScaledSliderValue = this.scaleSliderVal(this.spriteSlideKnob.x, zeroPosKnob, maxPosKnob, factor)+1;
            if (this.newScaledSliderValue <= this.maxNum){ // If the player can afford the position, permit.
                container.card.scaleProperties(this.newScaledSliderValue);
                container.parentContainer.itemNumber = this.newScaledSliderValue;
                this.spriteSlideKnob.x = this.getX(this.newScaledSliderValue,zeroPosKnob,maxPosKnob,factor);
                this.scene.eventEmitter.emit('arrowButtons', this.card.title, "increase", undefined);
            }
            else{            //If  not:
                let reason = container.card.scaleProperties(this.maxNum+1).reason
                if (INFORM_MISSING_MATERIAL){
                    // Show error why the player can't afford more.
                    if (!container.card.errorPanel.active){
                        container.card.errorPanel.showError(reason);
                    }
                } //If the option is not activated, simply reset the slider to the maximum possible value.
                container.card.scaleProperties(this.maxNum);
                container.parentContainer.itemNumber = this.maxNum;
                this.spriteSlideKnob.x = this.getX(this.maxNum,zeroPosKnob,maxPosKnob,factor);
                this.scene.eventEmitter.emit('arrowButtons', this.card.title, "increase", reason);
            }
            this.spritePlusButton.once('pointerup', () => {
                this.spritePlusButton.setScale(scalingX, scalingY);
            });
                });
    }

    /**
     * This method finds the maximum amount of the requested item, that can be built with the available material.
     * @param {SliderComponent} container A slider component, that has a card instance stored to read out the maximum affordable amount.
     * @returns {number} The maximum affordable quantity of the item stored in container.
     */
    getMaxNumber(container){
        for (let i = 1; true; i++){
            let canAfford = container.card.scaleProperties(i).result;
            if (!canAfford){
                return i-1;
            }
        }
    }

    /**
     * This function converts the coordinates of the slider knob to a corresponding item quantity, depending on the scaling.
     * If for example the maximum value for a slider is set to 10, that means that if it is dragged to the center, the value 
     * 5 is displayed as it is the half.
     * @param {number} x the x value of the slider.
     * @param {number} min the zero position of the knob.
     * @param {number} max the maximum postion of the knob.
     * @param {number} factor the scaling factor depending on the maximum values.
     */
    scaleSliderVal(x, min, max, factor){
        return Math.round(100*factor*((x-min)/(max)));
    }

    /**
     * This method reverts the scaleSliderVal function and converts a value to coordinates.
     * @param {number} value the value that is to be converted
     * @param {number} min the minimum value representing the zero position.
     * @param {number} max the maximum value, representing the rightmost postition.
     * @param {number} factor the scaling factor.
     */
    getX(value, min, max, factor){
        return (((value*max)/(100*factor))+min);
    }
}
export default Slider;
export {SliderComponent};