import * as Constants from './Constants.js';
import WarningDialogue from './WarningDialogue.js';

/**
 * @classdesc
 * This class creates a scene that asks the subject to justify aloud the decisions
 * they make during the month. The scene continues only when the subject presses
 * the okay button.
 * 
 * @class ExplainScene
 * @extends Phaser.Scene
 * @see [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 * @constructor
 * @param {String} sceneName The scene name is defined at creation of the scene and is used to find, launch or close the scene by the [SceneManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}.
 * 
 */
class ExplainScene extends Phaser.Scene
{
    constructor(){
        // Initiate the scene with the corresponding key
        super({key: Constants.SCENES.EXPLAIN});
    }
     
     /**
      * This function is run when the class is initialized.
      * @param {Phaser.Scene} data.parent the scene that started the Scene. This should be the {@link MainScene} instance.
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
     * Also this method creates all other graphical elements of the scene and gives the button its functionality.
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
        this.headerText = "Erkläre deine Lösung";
        this.text = "Bitte erkläre, warum du genau diese Anzahl der verschiedenen Möbel gebaut hast und weshalb deine Lösung gut ist. Wenn du auf okay drückst, kannst du deine Lösung ansehen. Um dann den Monat abzuschließen, drücke erneut auf Monat beenden.";
        
        /**
         * The WarningDialogue gives us an easy to use tamplete to display text with buttons
         * @type {WarningDialogue}
         */
        this.dialogue = new WarningDialogue({
            scene: this,
            parentScene: this.parentScene,
            x: Constants.WIDTH*Constants.SCALINGX/2,
            y: Constants.HEIGHT*Constants.SCALINGY/2,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY,
            header: this.headerText,
            text: this.text
        });
        // add the dialogue to the scene
        this.okayButton = new Phaser.GameObjects.Sprite(this, Constants.WIDTH*Constants.SCALINGX/2, Constants.HEIGHT*Constants.SCALINGY/2+this.dialogue.buttonNo.y,'month_done').setScale(0.75*Constants.SCALINGX, 0.75*Constants.SCALINGY);
        this.buttonText = new Phaser.GameObjects.Text(this, this.okayButton.x, this.okayButton.y, 'Okay', {fontSize: 16*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0.5,0.5);
        this.add.existing(this.okayButton);
        this.add.existing(this.buttonText);
        this.monthDoneButton = new Phaser.GameObjects.Sprite(this, 620*Constants.SCALINGX,480*Constants.SCALINGY,'month_done').setOrigin(0, 0.5).setScale(0.75*Constants.SCALINGX, 0.75*Constants.SCALINGY);
        this.monthDoneText = new Phaser.GameObjects.Text(this, this.monthDoneButton.x+this.monthDoneButton.width*0.75*Constants.SCALINGX/2, this.monthDoneButton.y, 'Monat beenden', {fontSize: 16*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0.5,0.5);
        this.add.existing([this.monthDoneButton, this.monthDoneText])
        this.dialogue.buttonNo.destroy();
        this.dialogue.buttonNoText.destroy();
        this.dialogue.buttonYes.destroy();
        this.dialogue.buttonYesText.destroy();
        this.add.existing(this.dialogue);

        this.okayButton.setInteractive();
        this.okayButton.on('pointerdown', () => {
            this.okayButton.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.okayButton.once('pointerup', () => {
                this.parentScene.eventEmitter.emit('explainingDialogue', true);
                this.fadeOut()
                this.monthDoneButton.setInteractive();
                this.okayButton.setTexture('month_done');
            });
        });

        this.monthDoneButton.on('pointerdown', () => {
            this.monthDoneButton.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.monthDoneButton.once('pointerup', () => {
                this.parentScene.eventEmitter.emit('explainingDialogue', false);
                this.monthDoneButton.setTexture('month_done');
                this.remove(Constants.SCENES.EXPLAIN)
                this.parentScene.monthDoneBehavior();
            });
        });
        
        this.dialogue.scale = 0;
        this.buttonText.scale = 0;
        this.okayButton.scale = 0;
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
            targets: [this.dialogue, this.buttonText, this.okayButton],
            'scale': 1,
            duration: Constants.ZOOM_DURATION,
            ease: 'Linear'
        });
    }
   
    /**
     * This method handels the animtion to fade out the background and the dialogue.
     * Finally, it deletes all the elements created by the ExplainScene.
     */
    fadeOut(){
        this.tweens.add({
            targets: this.background,
            alpha: 0,
            duration: Constants.FADE_DELAY,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: [this.dialogue, this.buttonText, this.okayButton],
            'scale': 0,
            duration: Constants.ZOOM_DURATION,
            ease: 'Linear',
            onComplete: () =>{
                this.okayButton.destroy();
                this.buttonText.destroy();
                this.dialogue.destroy();
                this.background.destroy();
            }
        });
    }
  
    /**
     * Closes a scene. This is called when the player clickes the any button on the Dialogue.
     * @param {string} key the key of the scene that is to be closed.
     */
    remove(key){
        this.parentScene.input.enabled = true;
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
export default ExplainScene;