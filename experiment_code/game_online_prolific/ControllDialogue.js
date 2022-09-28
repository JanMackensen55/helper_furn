import InteractionScene from './InteractionScene.js';
import Button from './Button.js';
import AnswerBoxes from './AnswerBoxes.js';
import { writeQuestion } from './SosciWriter.js';
import {TEXTDIALOGUE_HEIGHT, TEXTDIALOGUE_WIDTH, ON_LOCAL_MACHINE} from './Constants.js'

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
class ControllDialogue  extends InteractionScene
{
    constructor()
    {
        super('controllDialogue');
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
        
        
        this.question = this.data.question;
        this.answers = this.data.answers;
        this.numRightAnswer = this.data.numRightAnswer
        this.height = 0.8 * TEXTDIALOGUE_HEIGHT;
        this.width = 1.25 * TEXTDIALOGUE_WIDTH;
        this.createDialogue('Question');
        let questionElem = new Phaser.GameObjects.Text(this, 0,-60, this.question, {color: "#000", fontSize: 18, wordWrap: {width: 550, useAdvancedWrap: true}}).setOrigin(0.5,0.5);
        this.panel.add(questionElem);
        this.panel.disableCloseButton();
        let sendButton = new Button(this,0,90,'button-long', 'button-long-pressed','Submit',this.sendText,this);
        sendButton.setButtonScale(1.2);
        this.sendButton = sendButton;
        this.panel.add(sendButton);
        
        this.answerBoxes = new AnswerBoxes({scene: this, x: 0, y: 0, answers:this.answers, numRightAnswer:this.numRightAnswer});
        this.panel.add(this.answerBoxes);
        this.fadeIn();
    }

    /**
     * This function sends the text that has been typed in by the player
     * via the Sosci Writer.
     * If [ON_LOCAL_MACHINE]{@link module:Constants#ON_LOCAL_MACHINE} is set to true,
     * the value is just being printed.
     */
    sendText()
    {
        if (!this.answerBoxes.answerGiven())
        {
            this.sendButton.showMessage("Please choose one of the answers.",alert=true, 10,1000);   
            return;
        }
        if (ON_LOCAL_MACHINE) 
        {
            console.log(this.answerBoxes.rightAnswer());
        }
        else
        {   
            writeQuestion(this.questionNumber, this.answerBoxes.rightAnswer());
        }
        this.close();
    }

}export default ControllDialogue;