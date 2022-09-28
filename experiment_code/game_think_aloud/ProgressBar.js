import * as Constants from './Constants.js';
/**
 * @classdesc
 * This class implements an horizontal progress bar that can be used to show item usage or time left.
 * @class ProgressBar
 * @constructor
 * @param {object} data the data which is required to represent a progressbar.
 * @param {Phaser.Scene} data.scene the scene where the progressbar should be rendered.
 * @param {number} data.x the x coordinate of the progress bar.
 * @param {number} data.y the y coordinate of the progress bar.
 * @param {string} data.workshop the name of the workshop or material that is used. It will be displayed inside the progressbar.
 * @param {Phaser.Sprite} data.image the image object, that will be displayed to the left of the progress bar. (see [Phaser documentation]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.Sprite.html}).
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class ProgressBar extends Phaser.GameObjects.Container{
    constructor(data){
        let {scene, x,y, workshop, image, scalingX, scalingY} = data;
        // Build the progressbar consisting of a right part, a middle part and the left part.
        let barLeftShadowCap = new Phaser.GameObjects.Sprite(scene, 0,0,'left-cap-shadow').setOrigin(0, 0.5).setScale(scalingX, scalingY);
        let barMiddleShadow = new Phaser.GameObjects.Sprite(scene, barLeftShadowCap.x+barLeftShadowCap.width,barLeftShadowCap.y,'middle-shadow').setOrigin(0,0.5).setScale(scalingX, scalingY);
        barMiddleShadow.displayWidth = Constants.MAX_BAR_WIDTH;
        let barRightShadow = new Phaser.GameObjects.Sprite(scene,barMiddleShadow.x+barMiddleShadow.displayWidth,barLeftShadowCap.y,'right-cap-shadow').setOrigin(0,0.5).setScale(scalingX, scalingY);
        let barLeftCap = new Phaser.GameObjects.Sprite(scene, barLeftShadowCap.x,barLeftShadowCap.y,'left-cap').setOrigin(0, 0.5).setScale(scalingX, scalingY);
        let barMiddle = new Phaser.GameObjects.Sprite(scene, barLeftCap.x+barLeftCap.width,barLeftShadowCap.y,'middle').setOrigin(0,0.5).setScale(scalingX, scalingY);
        barMiddle.displayWidth = 0;
        let barRightCap = new Phaser.GameObjects.Sprite(scene,barMiddle.x+barMiddle.displayWidth,barLeftShadowCap.y,'right-cap').setOrigin(0,0.5).setScale(scalingX, scalingY);
        let valueText = new Phaser.GameObjects.Text(scene,barMiddle.x+barMiddle.width, barLeftShadowCap.y, "",{fontSize: 17*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0,0.5);
        let workshopText = new Phaser.GameObjects.Text(scene, barMiddle.x+barMiddle.width, barLeftShadowCap.y-20*scalingY, workshop,{fontSize: 17*Constants.SCALING, color: '#000'}).setOrigin(0,0.5);
        image.x = barLeftShadowCap.x;
        image.y = barLeftShadowCap.y;
        
        super(scene, x,y, [barLeftShadowCap,barMiddleShadow, barRightShadow,barLeftCap,barMiddle,barRightCap,valueText, workshopText,image]);

        /**
         * The progressbar consisting of three parts. The different parts are used for the animation.
         * @type {object}
         * @property {Phaser.GameObjects.Sprite} leftCap the left part of the bar
         * @property {Phaser.GameObjects.Sprite} middle the middle part of the bar
         * @property {Phaser.GameObjects.Sprite} rightCap the right part of the bar
         */
        this.bar = {middle: barMiddle, leftCap: barLeftCap, rightCap: barRightCap};

        /**
         * It is possible to have a text inside the progressbar, which can be useful
         * to display seconds that are left until the process has been finished for example.
         * @type {Phaser.GameObjects.Text}
         */
        this.valueText = valueText;
    }

    set value(newT){
        this._valueText = newT;
        this.valueText.text = this._valueText;
    }


    /**
     * Animates the progressbar to a desired percent value.
     * @param {number} percent the percent value to fill the bar. The value can be between 0 and 1.
     */
    setMeterPercentage(percent = 1){
        const width = Constants.MAX_BAR_WIDTH * percent;
        this.scene.tweens.add({
            targets : this.bar.middle,
            displayWidth: width,
            duration: 500,
            ease: Phaser.Math.Easing.Circular.Out,
            onUpdate: () => {
                this.bar.rightCap.x = this.bar.middle.x + this.bar.middle.displayWidth;
                this.bar.leftCap.visible = this.bar.middle.displayWidth > 0;
                this.bar.middle.visible = this.bar.middle.displayWidth > 0;
                this.bar.rightCap.visible = this.bar.middle.displayWidth > 0;
            }
        });
    }
}
export default ProgressBar;