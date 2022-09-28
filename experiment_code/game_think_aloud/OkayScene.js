import * as Constants from './Constants.js';
import WarningDialogue from './WarningDialogue.js';
import NewsScene from './NewsScene.js';

/**
 * @classdesc
 * This class is used to inform the player that the tutorial had started or ended.
 * Also it informs the player when he has found the perfect solution. 
 *
 * @class OkayScene
 * @extends Phaser.Scene
 *
 */
class OkayScene extends Phaser.Scene
{
    constructor(){
        // Initiate the scene with the corresponding key
        super({key: Constants.SCENES.OKAY});
    }

    /**
     * This function is run when the class is initialized.
     * @param {Phaser.Scene} data.parent the scene that started the Scene. This should be the {@link MainScene} instance.
     * @param {boolean} data.start indicates if start or end of the tutorial
     * @param {boolean} data.perfect indicates whether the player has found the perfect solution or not.
     */
    init(data){
        this.parentScene = data.parent;
        this.tutorialStart = data.start;
        this.perfect_scene = data.perfect;
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
     * This method creates all the graphical elements that will be used for the scene.
     * The contents change depending on the variables this.tutorialStart and this.perfect_scene.
     * The WarningDialogue is used as a template for the creation.{@link WarningScene#WarningDialogue}
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
        if (this.perfect_scene){
            this.headerText= "Optimale Lösung gefunden!"
            this.text = ""
        }
        else{
            if (this.tutorialStart){
                this.headerText = "Start des Tutorials";
                this.text = "Der erste Monat ist ein Tutorial Monat. In diesem darfst du alle Besonderheiten unserer Verwaltungsplattform selbstständig kennenlernen. \n \n Bitte begründe alle deine Aktionen laut.";
            }
            else{
                this.headerText = "Tutorial beendet";
                this.text = "Du hast den Tutorial Monat erfolgreich abgeschlossen. Ab jetzt sollst du Versuchen in jedem Monat die beste mögliche Produktion einzustellen. Die Furniture Company zählt auf dich!";
            }
        }
        /**
         * The dialogue that compares the scores of the player with the scores of the model.
         * @type {Dialogue}
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
        this.dialogue.buttonNo.destroy();
        this.dialogue.buttonNoText.destroy();
        this.dialogue.buttonYes.destroy();
        this.dialogue.buttonYesText.destroy();
        this.add.existing(this.dialogue);

        this.star = new Phaser.GameObjects.Sprite(this, Constants.WIDTH*Constants.SCALINGX/2, Constants.HEIGHT*Constants.SCALINGY/2,'star').setScale(Constants.SCALINGX*2, Constants.SCALINGY*2);
        if (this.perfect_scene){
            this.add.existing(this.star)
        }

        this.okayButton.setInteractive();
        this.okayButton.on('pointerdown', () => {
            this.okayButton.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.okayButton.once('pointerup', () => {
                if (this.perfect_scene){
                    this.parentScene.eventEmitter.emit('dialogueClosed', "perfect");
                }
                else{
                    if (this.tutorialStart){
                        this.parentScene.eventEmitter.emit('tutorialDialogueClosed', this.tutorialStart);
                        this.parentScene.tutorialPhase = this.tutorialStart;
                    }
                    else{
                        this.parentScene.tutorialPhase = this.tutorialStart;
                        this.parentScene.eventEmitter.emit('tutorialDialogueClosed', this.tutorialStart);
                    }
                }
                this.okayButton.setTexture('month_done');
                this.remove(Constants.SCENES.OKAY) // makes the dialouge disappear
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
        this.tweens.add({
            targets: [this.star],
            'scale': 1.5,
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
        if (this.perfect_scene){
            this.parentScene.nextMonth()
        }
        else if (!this.tutorialStart){
            this.parentScene.scene.add(Constants.SCENES.NEWS, NewsScene, false);
            this.parentScene.scene.launch(Constants.SCENES.NEWS, {parent: this.parentScene, lp: this.parentScene.lp, player: this.parentScene.player, model: this.parentScene.model});
        }
        // Zoom out the dialogue, by decreasing its scale to zero
        this.tweens.add({
            targets: [this.dialogue, this.buttonText, this.okayButton, this.star],
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
export default OkayScene;
