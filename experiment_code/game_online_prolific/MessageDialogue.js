import {ON_LOCAL_MACHINE, TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT} from './Constants.js';
import DialogueScene from './DialogueScene.js';
import FormUtil from './formUtil.js';
import Button from './Button.js';
import InteractionScene from './InteractionScene.js';
import {writeAnswer} from './SosciWriter.js';



/**
 * @classdesc
 * This class provides dialogue scene to get a user text input.
 * In order to create this dialogue the values required by the DialogueScene must be provided on creation.
 * Therefore, see {@link DialogueScene#init}.
 * @calss MessageDialogue
 * In order to run this scene, it can be launched with phaser's scene plugin.
 * Additionaly, a title and a question text should be provided.
 * @example
 * // go to the place, where the scene should be started and insert the following line
 * this.scene.launch('textDialogue', {mainScene: this, title: PROVIDE_A_TITLE, question: PROVIDE_A_QUESTION questionNumber: NUMBER});
 * // "this" must be a scene, because this.scene points at the scene manager of the specific scene.
 * 
 */
class MessageDialogue extends InteractionScene
{
    constructor()
    {
        super('messageDialogue');
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
        /**
         * This is the title of the dialogue.
         * @type {String}
         */
        this.title = this.data.title;

        let avatar = this.data.avatar;
        /**
         * The question that is displayed to the user above the input field, where the player can 
         * type in the answer.
         * @type {String}
         */
        this.question = this.data.question;
        this.height = TEXTDIALOGUE_HEIGHT;
        this.width = 1.2 * TEXTDIALOGUE_WIDTH;
        this.createDialogue(this.title);
        this.renderQuestion();
        this.panel.disableCloseButton();
        let sendButton = new Button(this,90,130,'button-long', 'button-long-pressed','Okay',this.close,this);
        let avatarSprite = new Phaser.GameObjects.Sprite(this,190,-120, avatar).setScale(1);
        sendButton.setButtonScale(0.75);
        this.panel.add(sendButton);
        this.panel.add(avatarSprite);
        


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
        this.questionElem = new Phaser.GameObjects.Text(this.mainScene, 0,-this.height/2+160, this.question, {fontSize: 17,color: "#000"}).setOrigin(0.5,0.3);
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
export default MessageDialogue;