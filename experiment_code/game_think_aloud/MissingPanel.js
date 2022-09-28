import {MISSING_TEXT_DURATION, SCALING} from './Constants.js'
import *  as Constants from './Constants.js';
/**
 * @classdesc
 * This Class creates a panel to inform the player of missing material. It is used to be placed behind a card and 
 * appear if the player tries to drag the slider to a position the player cannot afford.
 * @class MissingPanel
 * @extends Phaser.GameObjects.Container
 * @constructor
 * @param {object} data the data object used to create the panel.
 * @param {Phaser.GameObject} data.parent a gameObject the panel should be placed behind. This is usually a {@link Card}.
 * @param {number} data.x the x coordinate where the panel should be placed.
 * @param {number} data.y the y coordinate where the panel should be placed.
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class MissingPanel extends Phaser.GameObjects.Container{
    constructor(data){
        let {parent, x,y, scalingX, scalingY} = data;
        let panel = new Phaser.GameObjects.Sprite(parent.scene,0,0,'panelWhite').setScale(scalingX, scalingY);
        panel.displayWidth = 230*scalingX;
        panel.displayHeight = 35*scalingY;
        let errorText = new Phaser.GameObjects.Text(parent.scene, panel.x,0, 'Nicht genug Metall!',{fontSize: 18*SCALING, color: '#000'}).setOrigin(0.5,0.4);
        super(parent.scene,x,y,[panel,errorText]);
        this.panel = panel;
        this.parent = parent;
        this.errorText = errorText;
        this.scene = parent.scene;
        this.active = false;
    }


    /**
     * Animates the panel to appear and to disappear.
     * @param {string} message The message that should be written inside the panel.
     */
    showError(message){
        if (this.active){
            return;
        }
        this.scene.eventEmitter.emit("warningBySlide", this.parent.card.title, message);
        this.active = true;
        this.errorText.text = message;
        this.scene.tweens.add({
            targets: this,
            y: 135*Constants.SCALINGY,
            duration: 300,
            ease: 'Expo',
            completeDelay: MISSING_TEXT_DURATION,
            onComplete: function(){
                this.parent.scene.tweens.add({
                    targets: this.data[0].target,
                    y: 105*Constants.SCALINGY,
                    duration: 400,
                    ease: Phaser.Math.Easing.Back.In,
                    onComplete: this.data[0].target.active=false
                });
            }
        });
    }

}
export default MissingPanel;