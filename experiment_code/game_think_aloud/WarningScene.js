import * as Constants from './Constants.js';
import WarningDialogue from './WarningDialogue.js';

/**
 * @classdesc
 * This class is used to warn the player should he complete
 * a month without having built anything. The player can then decide
 * if he really wants to finish the month or not. 
 * 
 * @class WarningScene
 * @extends Phaser.Scene
 * 
 */
class WarningScene extends Phaser.Scene
{
    constructor(){
        // Initiate the scene with the corresponding key
        super({key: Constants.SCENES.WARNING});
    }
    
    /**
     * This function is run when the class is initialized.
     * @param {Phaser.Scene} data.parent the scene that started the WarningScene. This should be the {@link MainScene} instance.
     */
    init(data){
        this.parentScene = data.parent;
    }

    /**
     * This preloader loads additional resources for the dialogue.
     * This method should not be used if there are more resources, as it will slow down the 
     * process.
     */
    preload(){
        this.load.image('shadowBackground', 'ShadowSummary.png');
        this.load.image('panel', 'panel_brown.png');
        this.load.image('panel-contents', 'contents.png');
    }

    /**
     * This method builds the {@link WarningScene#WarningDialogue} and adds it to the scene.
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
        let text = "Du hast in diesem Monat noch nichts gebaut. Bist du dir sicher, dass du zum nächsten Monat springen willst?";
        /**
         * The dialogue that compares the scores of the player with the scores of the model.
         * @type {Dialogue}
         */
        this.dialogue = new WarningDialogue({
            scene: this,
            parentScene: this.parentScene,
            x: Constants.WIDTH*Constants.SCALING/2,
            y: Constants.HEIGHT*Constants.SCALING/2,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY,
            header: "Achtung",
            text: text
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
            ease: 'Linear'
        });
    }

    /**
     * Closes a scene. This is called when the player clickes the any button on the Dialogue.
     * @param {string} key the key of the scene that is to be closed.
     */
    
    remove(key){
        this.parentScene.input.enabled = true;
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
                this.parent.scene.scene.remove(key);
            }
        });
    }
}
export default WarningScene;