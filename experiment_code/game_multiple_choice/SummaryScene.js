import * as Constants from './Constants.js';
import Dialogue from './Dialogue.js';
import NewsScene from './NewsScene.js';

/**
 * @classdesc
 * This class is used to display a dialogue that informs the player about the 
 * profit and the built furniture after finishing a month.
 * It also serves as comparison between player and optimal solution.
 * 
 * @class SummaryScene
 * @extends Phaser.Scene
 * 
 */
class SummaryScene extends Phaser.Scene
{
    constructor(){
        // Initiate the scene with the corresponding key
        super({key: Constants.SCENES.SUMMARY});
    }

    /**
     * This function is run when the class is initialized.
     * The optimal solution and the player's data is loaded in order 
     * to compare them.
     * @param {object} data the data object, that is passed on initialization. This happens at {@link MainScene#startSummary}.
     * @param {object} data.lp the optimal solution of the linear programming problem.
     * @param {Player} data.player a player instance to obtain the scores. 
     * @param {Phaser.Scene} data.parent scene that started the SummaryScene. This should be the {@link MainScene} instance.
     * @param {Object} data.model the linear problem
     */
    init(data){
        this.lp = data.lp;
        this.player = data.player;
        this.parentScene = data.parent;
        this.eventEmitter = data.parent.eventEmitter;
        this.model = data.model
    }

    /**
     * This preloader loads additional resources for the dialogue.
     * This method should not be used if there are more resources, as it will slow down the 
     * process.
     */
    preload(){
        this.load.image('shadowBackground', 'ShadowSummary.png');
        this.load.image('summaryFrame', 'SummaryFrame.png');
        this.load.image('feedbackFrame', 'panelWhite.png');
        this.load.image('medal_perfect', 'medal_perfect.png');
        this.load.image('medal_very_good', 'medal_very_good.png');
        this.load.image('medal_good', 'medal_good.png');
        this.load.image('medal_hammer', 'medal_hammer.png');
    }

    /**
     * This method builds the {@link SummarScene#Dialogue} and adds it to the scene.
     */
    create()
    {
        /**
         * A background image, that is used to darken the background around the dialogue.
         * @type Phaser.GameObjects.Sprite
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html}
         */
        this.background = new Phaser.GameObjects.Sprite(this,Constants.WIDTH*Constants.SCALING/2,Constants.HEIGHT*Constants.SCALING/2, 'background').setScale(Constants.SCALINGX, Constants.SCALINGY);
        // Add the background to the scene.
        this.add.existing(this.background);

        /**
         * The dialogue that compares the scores of the player with the scores of the model.
         * @type {Dialogue}
         */
        this.dialogue = new Dialogue({
            scene: this,
            x: Constants.WIDTH*Constants.SCALING/2,
            y: Constants.HEIGHT*Constants.SCALING/2,
            player: this.player,
            lp: this.lp,
            month: this.parentScene.month.value,
            done: this.parentScene.month.done,
            model: this.model,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });
        // add the dialogue to the scene
        this.add.existing(this.dialogue);
        this.dialogue.scale = 0;
        if (this.parentScene.month.value > 4){
            this.dialogue.feedbackFrame.setVisible(false)
            this.dialogue.feedbackText.setVisible(false)
        }
        // fade in the dialogue
        this.fadeIn();
        // disable the inputs of the MainScene as long as the dialogue is active.
        this.parentScene.input.enabled = false;

      
    }

    /**
     * This method handels the animtion to fade in the background and the dialogue.
     */
    fadeIn(){
        this.background.alpha = 0;
        
        // increase the opacity of the background - a fade effect appears
        this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: Constants.FADE_DELAY,
            ease: 'Linear',
        });
        
        // increase the scale of the dialogue to one, which creates a zoom effect.
        this.tweens.add({
            targets: [this.dialogue],
            'scale': 1,
            duration: Constants.ZOOM_DURATION,
            ease: 'Linear'
        });
    }

    /**
     * Closes a scene. This is called when the player clickes the "okay" button on the Dialogue.
     * @param {string} key the key of the scene that is to be closed.
     */
    remove(key, nextMonth=true){
        // Zoom out the dialogue, by decreasing its scale to zero 
        this.tweens.add({
            targets: [this.dialogue],
            scale: 0,
            duration: Constants.ZOOM_DURATION,
            ease: Phaser.Math.Easing.Linear,
        });
        // Fade out the background
        this.tweens.add({
            targets: this.background,
            alpha: 0,
            duration: Constants.FADE_DELAY,
            ease: 'Linear',
            onComplete: function(){
                if (nextMonth){
                    this.parent.scene.parentScene.input.enabled = true;
                    this.parent.scene.parentScene.nextMonth();
                }
                this.parent.scene.scene.remove(key);
            }
        });
    }
}
export default SummaryScene;