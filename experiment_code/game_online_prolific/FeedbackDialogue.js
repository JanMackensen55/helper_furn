import {ON_LOCAL_MACHINE, TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT} from './Constants.js';
import DialogueScene from './DialogueScene.js';
import FormUtil from './formUtil.js';
import Button from './Button.js';
import {writeAnswer} from './SosciWriter.js';
import FeedbackSummary from "./FeedbackSummary.js";
import {submit} from './SosciWriter.js';
import InteractionScene from './InteractionScene.js';

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
class FeedbackDialogue extends InteractionScene
{
    constructor()
    {
        super('feedbackDialogue');
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

        // Create the dialogue for the final year.
        this.createDialogue('Feedback from Anna');
        this.question = '';
        this.height = 1.25 * TEXTDIALOGUE_HEIGHT;
        this.width = TEXTDIALOGUE_WIDTH;
        this.renderQuestion();
        this.panel.disableCloseButton();
        let sendButton = new Button(this,90,130,'button-long', 'button-long-pressed','Thanks',this.close,this);
        sendButton.setButtonScale(0.75);
        this.panel.add(sendButton);

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
        this.summary = new FeedbackSummary({
                scene: this,
                mainScene:this.mainScene,
                x: 0,
                y: 0,
                lpSolution: this.mainScene.lpSolution,
                player: this.mainScene.player,
                month: this.mainScene.month
            }
        );

        // manipulate the summary scene to show the summed values.
        //this.summary.setFinalValues();

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
    }
        
    /**
     * Displays the quesiton on the dialogue.
     */
    renderQuestion()
    {
        this.questionElem = new Phaser.GameObjects.BitmapText(this.mainScene, 0,-this.height/2+90, 'black_font', this.question, 11, Phaser.GameObjects.BitmapText.ALIGN_LEFT).setOrigin(0.5);
        this.panel.add(this.questionElem);
    }


    /**
     * Adjust the size of the question text.
     * @param {number} size the desired fontsize for the question
     */
    setQuestionFontSize(size)
    {
        this.questionElem.setFontSize(size);
    }
}


export default FeedbackDialogue;