import * as Constants from './Constants.js';
import NewsDialogue from './NewsDialogue.js';
/**
 * @classdesc
 * This class creates a scene in which the NewsDialogue {@link NewsDialogue} can then be inserted.
 * 
 * @class NewsScene
 * @extends Phaser.Scene
 * 
 */
class NewsScene extends Phaser.Scene
{
    constructor(){
        // Initiate the scene with the corresponding key
        super({key: Constants.SCENES.NEWS});
    }

    /**
     * This function is run when the class is initialized.
     * The optimal solution and the player's data is loaded in order 
     * to compare them in a diagramm.
     * @param {object} data the data object, that is passed on initialization. This happens at {@link MainScene#startSummary}.
     * @param {object} data.lp the optimal solution of the linear programming problem.
     * @param {Player} data.player a player instance to obtain the scores. 
     * @param {Phaser.Scene} data.scene the scene that started the SummaryScene. This should be the {@link MainScene} instance.
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
    }

    /**
     * This method creates the NewsDialogue and the background in the scene.
     */
    create()
    {
        /**
         * A background image, that is used to darken the background around the dialogue.
         * @type Phaser.GameObjects.Sprite
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html}
         */
        this.background = new Phaser.GameObjects.Sprite(this,Constants.WIDTH*Constants.SCALING/2,Constants.HEIGHT*Constants.SCALING/2, 'shadowBackground').setScale(Constants.SCALINGX, Constants.SCALINGY);
        // Add the background to the scene.
        this.add.existing(this.background);

        /**
         * The dialogue that compares the scores of the player with the scores of the model.
         * @type {Dialogue}
         */
        this.dialogue = new NewsDialogue({
            scene: this,
            mainScene: this.parentScene,
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
            ease: 'Linear',
            onComplete: function(){
                if (Constants.DISPLAY_DIAGRAM === 'always') this.targets[0].addDiagram();
                else if (Constants.DISPLAY_DIAGRAM === 'half' && this.targets[0].month+1 == Math.floor(Constants.MONTHS/2)) this.targets[0].addDiagram();
                else if (Constants.DISPLAY_DIAGRAM === 'end' && this.targets[0].month == Constants.MONTHS) this.targets[0].addDiagram(); 
            }
        });
    }

    /**
     * Closes a scene. This is called when the player clickes the "okay" button on the Dialogue.
     * @param {string} key the key of the scene that is to be closed.
     */
    remove(key){
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
                this.parent.scene.parentScene.input.enabled = true;
                this.parent.scene.scene.remove(key);
            }
        });
    }
}
export default NewsScene;