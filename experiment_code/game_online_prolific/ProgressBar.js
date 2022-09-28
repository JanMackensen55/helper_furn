/**
 * @classdesc
 * This class implements a progress bar.
 * 
 * @class ProgressBar
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the ProgressBar should be displayed.
 * @param {Number} data.x Position of the ProgressBar on the x axis
 * @param {Number} data.y Position of the ProgressBar on the y axis
 * @param {Object} data.workshop Workshop whose production displays the progress bar.
 * @param {Number} data.width Length of the Progress bar
 */
export default class ProgressBar extends Phaser.GameObjects.Container{
    constructor(data){
        let {scene, x,y, workshop, width} = data;
        let barLeftShadowCap = new Phaser.GameObjects.Sprite(scene, 0,0,'left-cap-shadow').setOrigin(0, 0.5);
        let barMiddleShadow = new Phaser.GameObjects.Sprite(scene, barLeftShadowCap.x+barLeftShadowCap.width,barLeftShadowCap.y,'middle-shadow').setOrigin(0,0.5);
        barMiddleShadow.displayWidth = width;
        let barRightShadow = new Phaser.GameObjects.Sprite(scene,barMiddleShadow.x+barMiddleShadow.displayWidth,barLeftShadowCap.y,'right-cap-shadow').setOrigin(0,0.5);
        let barLeftCap = new Phaser.GameObjects.Sprite(scene, barLeftShadowCap.x,barLeftShadowCap.y,'left-cap').setOrigin(0, 0.5);
        let barMiddle = new Phaser.GameObjects.Sprite(scene, barLeftCap.x+barLeftCap.width,barLeftShadowCap.y,'middle').setOrigin(0,0.5);
        barMiddle.displayWidth = 0;
        let barRightCap = new Phaser.GameObjects.Sprite(scene,barMiddle.x+barMiddle.displayWidth,barLeftShadowCap.y,'right-cap').setOrigin(0,0.5);
        let valueText = new Phaser.GameObjects.Text(scene,barMiddle.x+barMiddle.width, barLeftShadowCap.y,  '',{fontSize:14,color: '#fff'}).setOrigin(0,0.5);
        super(scene, x,y, [barLeftShadowCap,barMiddleShadow, barRightShadow,barLeftCap,barMiddle,barRightCap,valueText]);
        this.bar = {middle: barMiddle, leftCap: barLeftCap, rightCap: barRightCap};
        this.valueText = valueText;
        this.maxWidth = width;
    }

    set value(newT){
        this._valueText = newT;
        this.valueText.text = this._valueText;
    }


    /**
     * Animates the progressbar to a desired percent value.
     * @param {*} percent the percent value to fill the bar. The value can be between 0 and 1.
     */
    setMeterPercentage(percent = 1){
        const width = this.maxWidth * percent;
        this.scene.tweens.add({
            targets : this.bar.middle,
            displayWidth: width,
            duration: 500,
            ease: Phaser.Math.Easing.Circular.Out,
            onUpdate: () => {
                this.bar.rightCap.x = this.bar.middle.x + this.bar.middle.displayWidth;
                this.bar.leftCap.visible = Math.round(this.bar.middle.displayWidth) > 0;
                this.bar.middle.visible = Math.round(this.bar.middle.displayWidth) > 0;
                this.bar.rightCap.visible = Math.round(this.bar.middle.displayWidth) > 0;
            }
        });
    }
}