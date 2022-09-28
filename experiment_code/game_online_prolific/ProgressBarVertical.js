/**
 * @classdesc
 * This class implements a progress bar. But this progressbar is verical and not horizontally aligned.
 * 
 * @class ProgressBarVertical
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the ProgressBar should be displayed.
 * @param {Number} data.x Position of the ProgressBar on the x axis
 * @param {Number} data.y Position of the ProgressBar on the y axis
 * @param {Object} data.workshop Workshop whose production displays the progress bar.
 * @param {Number} data.height Length of the Progress bar.
 */
export default class ProgressBarVertical extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x, y, height} = data;
        let bottomShadow = new Phaser.GameObjects.Sprite(scene, 0,0,'vertical_shadow_bottom').setOrigin(0.9,1);
        let midShadow = new Phaser.GameObjects.Sprite(scene, bottomShadow.x,bottomShadow.y-bottomShadow.height,'vertical_shadow_mid').setOrigin(0.9,1);
        midShadow.displayHeight = height;
        let topShadow = new Phaser.GameObjects.Sprite(scene, midShadow.x,midShadow.y-midShadow.displayHeight,'vertical_shadow_top').setOrigin(0.9,1);
        
        let bottom = new Phaser.GameObjects.Sprite(scene, bottomShadow.x,bottomShadow.y, 'vertical_blue_bottom').setOrigin(0.9,1);
        let mid = new Phaser.GameObjects.Sprite(scene, midShadow.x,bottom.y-bottom.height, 'vertical_blue_mid').setOrigin(0.9,1);
        let top = new Phaser.GameObjects.Sprite(scene, topShadow.x,mid.y-mid.displayHeight, 'vertical_blue_top').setOrigin(0.9,1);
        mid.displayHeight = 0;
        super(scene,x,y,[topShadow,midShadow,bottomShadow,bottom, mid,top]);
        this.maxHeight = height;
        this.bar = {top: top,mid: mid,bottom: bottom};
    }
     /**
     * Animates the progressbar to a desired percent value.
     * @param {*} percent the percent value to fill the bar. The value can be between 0 and 1.
     */
    setMeterPercentage(percent = 1){
        const height = this.maxHeight * percent;
        this.scene.tweens.add({
            targets : this.bar.mid,
            displayHeight: height,
            duration: 500,
            ease: Phaser.Math.Easing.Circular.Out,
            onUpdate: () => {
                this.bar.top.y = this.bar.mid.y - this.bar.mid.displayHeight;
                this.bar.bottom.visible = Math.round(this.bar.mid.displayHeight) > 0;
                this.bar.mid.visible = Math.round(this.bar.mid.displayHeight) > 0;
                this.bar.top.visible = Math.round(this.bar.mid.displayHeight) > 0;
            }
        });
    }
}