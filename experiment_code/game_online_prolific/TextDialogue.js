import {ON_LOCAL_MACHINE, TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT, MINIMUM_TEXT_SIZE} from './Constants.js';
import DialogueScene from './DialogueScene.js';
import FormUtil from './formUtil.js';
import Button from './Button.js';
import {writeAnswer} from './SosciWriter.js';
import InteractionScene from './InteractionScene.js';



/**
 * @classdesc
 * This class provides dialogue scene to get a user text input.
 * In order to create this dialogue the values required by the DialogueScene must be provided on creation.
 * Therefore, see {@link DialogueScene#init}.
 * @calss TextDialouge
 * In order to run this scene, it can be launched with phaser's scene plugin.
 * Additionaly, a title and a question text should be provided.
 * @example
 * // go to the place, where the scene should be started and insert the following line
 * this.scene.launch('textDialogue', {mainScene: this, title: PROVIDE_A_TITLE, question: PROVIDE_A_QUESTION questionNumber: NUMBER});
 * // "this" must be a scene, because this.scene points at the scene manager of the specific scene.
 * 
 */
class TextDialogue extends InteractionScene
{
    constructor()
    {
        super('textDialogue');
    }

    create()
    {
        /**
         * This is the title of the dialogue.
         * @type {String}
         */
        this.title = this.data.title;

        /**
         * The question number specifies in what sosci survey item the value is stored.
         * This is important, if there are multiple text dialogues to keep track of the different questions.
         * @type {number}
         */
        this.questionNumber = this.data.questionNumber;
        
        let avatar = this.data.avatar;
        /**
         * The question that is displayed to the user above the input field, where the player can 
         * type in the answer.
         * @type {String}
         */
        this.question = this.data.question;
        this.height = TEXTDIALOGUE_HEIGHT;
        this.width = 1.25 * TEXTDIALOGUE_WIDTH;
        this.createDialogue(this.title);
        this.renderQuestion();
        this.panel.disableCloseButton();
        let sendButton = new Button(this,90,150,'button-long', 'button-long-pressed','Submit',this.sendText,this);
        sendButton.setButtonScale(0.75);
        this.sendButton = sendButton

        let avatarSprite = new Phaser.GameObjects.Sprite(this,200,-120, avatar).setScale(1);
        this.panel.add([sendButton,avatarSprite]);
        /**
         * The form util takes care of the setup of the text area.
         * @type {FormUtil}
         */
        this.formUtil = new FormUtil({
            scene: this
        });
        // Set up the textarea to be displayed at the right place
        this.formUtil.scaleToGameW('textarea', .5);
        this.formUtil.scaleToGameH('textarea',.3);
        this.formUtil.placeElementAt(400,450, 'textarea', true, true);
        this.formUtil.disableResize('textarea');
        this.fadeIn(this.showTextArea); // create the dialogue, by animating the panel given in the super class.
        
    }

    showTextArea()
    {
        this.formUtil.showTextArea('textarea');
    }

    /**
     * Displays the quesiton on the dialogue.
     */
    renderQuestion()
    {
        this.questionElem = new Phaser.GameObjects.Text(this.mainScene, -50,-this.height/2+100, this.question, {fontSize: 17,color: "#000"}).setOrigin(0.5,0.3);
        this.panel.add(this.questionElem);
    }

    /**
     * This function sends the text that has been typed in by the player
     * via the Sosci Writer.
     * If [ON_LOCAL_MACHINE]{@link module:Constants#ON_LOCAL_MACHINE} is set to true,
     * the value is just being printed.
     */
    sendText()
    {
        let textarea = document.getElementById('textarea');
        if (textarea.value.length < MINIMUM_TEXT_SIZE)
        {
            this.sendButton.showMessage("Please write a little more.", alert=true, 10,1000);
            return;
        }
        if (ON_LOCAL_MACHINE) console.log(textarea.value);
        else writeAnswer(this.questionNumber, textarea.value);
        textarea.value = '';
        this.formUtil.hideTextArea('textarea');
        this.close();
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
export default TextDialogue;