import { MONTHS, ON_LOCAL_MACHINE, TEXTDIALOGUE_HEIGHT} from './Constants.js';
import InteractionScene from "./InteractionScene.js";
import ProfitSummary from "./ProfitSummary.js";
import {submit, writeLog} from './SosciWriter.js';

/**
 * @classdesc
 * This Scene acts as a final summary for the player after he or she finishes the last month.
 * It will start a summary similar to a [MarketDialogue]{@link MarketDialogue} with the exception that the 
 * values are summed up for the entire year. Furthermore this scene cannot be closed but it ends the game
 * and goes to the next page after ten seconds if the game runs on Soscisurvey and [ON_LOCAL_MACHINE]{@link module:Constants#ON_LOCAL_MACHINE} is set to false.
 * 
 * @class FinalSummary
 * @extends DialogueScene
 */
class FinalSummary extends InteractionScene
{
    constructor()
    {
        super('finalSummary');
    }

    /**
     * Creates the dialogues and all related game objects that are required in this scene.
     * This function runs automatically after the scene has been started.
     */
    create()
    {
        /**
         * The background sprite. It is a black, slightly transparent rectangle, that is used to darken the
         * background.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.background = new Phaser.GameObjects.Sprite(this, 0,0,'shadow-background').setScale(9);

        // First the background is set to fully transparent. We will animate this value later
        // to create a "fade in" effect.
        this.background.alpha = 0;
        // adding the background to this scene.
        this.add.existing(this.background);
        
        //change the height of the dialogue
        this.height = 1.3 * TEXTDIALOGUE_HEIGHT;
        this.width = this.width + 20;

        // Create the dialogue for the final year.
        this.createDialogue('Task completed');

        // we do not want the player to be able to close this window, since the redirection should 
        // happen automatically
        this.panel.disableCloseButton();
        /**
         * The a summary container that is used to display the profits of the player and the optimal
         * solution in a clear manner. The [setFinalValues]{@link ProfitSummary#setFinalValues} function is used
         * to obtain the values for the entire year.
         * 
         * @type {ProfitSummary}
         */
        this.summary = new ProfitSummary(
            {
                scene: this,
                mainScene: this.mainScene,
                x: 0,
                y: -70,
                lpSolution: this.mainScene.lpSolution,
                player: this.mainScene.player,
                month: MONTHS
            }
        );

        // manipulate the summary scene to show the summed values.
        this.summary.setFinalValues();

        // add the summary containeer to the panel
        this.panel.add(this.summary);

        // animate the background from alpha = 0 to alpha = 1 in one second
        this.tweens.add(
            {
                targets: this.background,
                alpha: 1,
                duration: 1000
            }
        );

        // fade in the dialogue. 
        this.fadeIn();
        // Adding a timer to submit the values in the end and
        // close the game.
        if (!ON_LOCAL_MACHINE)
        {   
            let button = new Phaser.GameObjects.Sprite(this, -120, 180, 'button-long');
            button.displayWidth -= 30;
            let buttonText = new Phaser.GameObjects.Text(this, button.x, button.y, 'Continue', {fontSize: 18, color: '#fff'}).setOrigin(0.5);
            button.setInteractive();
            button.on('pointerdown', function()
            {
                button.setTexture('button-long-pressed');
                this.close();
                writeLog(this.mainScene.eventEmitter.getActions());
                submit();
            }, this);
            this.panel.add([button, buttonText]);
            this.continueText = new Phaser.GameObjects.BitmapText(this, 90,180,'black_font', '', 12,Phaser.GameObjects.BitmapText.ALIGN).setOrigin(0.5);
            this.panel.add(this.continueText);
            this.endTimer = this.time.addEvent({
                delay: 60000,
                callback: this.end,
                callbackScope: this
            });
        }
    }

    /**
     * This function is an infinite loop that updates the seconds that are left until the values are sent
     * to Soscisurvey.
     */
    update()
    {
        if (this.continueText)
        {
            this.continueText.text = 'Auto-Continue: ' + Math.ceil((this.endTimer.delay - this.endTimer.elapsed)/1000);
        }
    }

    end()
    {
        this.close();
        writeLog(this.mainScene.eventEmitter.getActions());
        submit();
    }
}

export default FinalSummary;