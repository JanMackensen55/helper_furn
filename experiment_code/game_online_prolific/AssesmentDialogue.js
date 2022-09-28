import {ON_LOCAL_MACHINE, TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT, MINIMUM_TEXT_SIZE, ASSESMENT_TEXT} from './Constants.js';
import DialogueScene from './DialogueScene.js';
import FormUtil from './formUtil.js';
import Button from './Button.js';
import {writeAnswer,writeAssessment} from './SosciWriter.js';
import InteractionScene from './InteractionScene.js';
import {LikertScale} from './LikertScale.js';



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
class AssesmentDialogue extends InteractionScene
{
    constructor()
    {
        super('assesmentDialogue');
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
        
        /**
         * The question that is displayed to the user above the input field, where the player can 
         * type in the answer.
         * @type {String}
         */
        this.question = this.data.question;
        if (ASSESMENT_TEXT){
            this.height = 1.3 * TEXTDIALOGUE_HEIGHT;
        }else{
            this.height = 0.8 * TEXTDIALOGUE_HEIGHT;
        }
        this.width = 1.25 * TEXTDIALOGUE_WIDTH;
        this.createDialogue('Self-assessment');
        
        if (ASSESMENT_TEXT){
            let questionElem = new Phaser.GameObjects.Text(this, -190,-150, 'How good do you think your solution is?', {color: "#000", fontSize: 18}).setOrigin(0,0.5);
            let questionWhy = new Phaser.GameObjects.Text(this, -190,-50,'Why do you rate your performance that way?', {fontSize: 18, color: "#000"}).setOrigin(0,0.5);
            this.panel.add(questionWhy);
            this.panel.add(questionElem);
        }
        else{
            let questionElem = new Phaser.GameObjects.Text(this, 0,-60, 'How good do you think your solution is?', {color: "#000", fontSize: 20}).setOrigin(0.5,0.5);
            this.panel.add(questionElem);
        }
        //this.panel.add(bad);
        //this.panel.add(good);
        
        this.panel.disableCloseButton();
        if (ASSESMENT_TEXT){
            let sendButton = new Button(this,90,200,'button-long', 'button-long-pressed','Submit',this.sendText,this);
            sendButton.setButtonScale(0.75);
            this.sendButton = sendButton;
            this.panel.add(sendButton);
        }
        else{
            let sendButton = new Button(this,0,80,'button-long', 'button-long-pressed','Submit',this.sendText,this);
            sendButton.setButtonScale(1.2);
            this.sendButton = sendButton;
            this.panel.add(sendButton);
        }
        this.likertScale = new LikertScale({scene: this, x: 0, y: 0});
        this.panel.add(this.likertScale);
        if (ASSESMENT_TEXT){
            /**
             * The form util takes care of the setup of the text area.
             * @type {FormUtil}
             */
            this.formUtil = new FormUtil({
                scene: this
            });
            // Set up the assesrange to be displayed at the right place
            //this.formUtil.scaleToGameW('asses', .3);
            //this.formUtil.scaleToGameH('asses',.1);
            //this.formUtil.placeElementAt(400,320, 'asses', true, true);
            // this.formUtil.disableResize('asses');
            // Set up the textarea to be displayed at the right place
            this.formUtil.scaleToGameW('textarea', .5);
            this.formUtil.scaleToGameH('textarea',.3);
            this.formUtil.placeElementAt(400,380, 'textarea', true, true); // online: this.formUtil.placeElementAt(400,480, 'textarea', true, true);
            this.formUtil.disableResize('textarea');
            this.fadeIn(this.showTextArea);
        }
        else this.fadeIn();
    }

    showTextArea()
    {
        //this.formUtil.showTextArea('asses');
        this.formUtil.showTextArea('textarea');
        
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
        // If the user didn't choose any response on the likert scale
        // we will infrom about that as a button alert.
        if (!this.likertScale.getValue())
        {
            this.sendButton.showMessage("Please choose one of the five answers.",alert=true, 10,1000);   
            return;
        }
        if ((textarea.value.length < MINIMUM_TEXT_SIZE) && ASSESMENT_TEXT)
        {
            this.sendButton.showMessage("Please write a little more.", alert=true, 10,1000);
            return;
        }

        if (ON_LOCAL_MACHINE) 
        {
            console.log(this.likertScale.getValue());
            console.log(textarea.value);
        }
        else
        {   
            if (ASSESMENT_TEXT) writeAssessment(this.questionNumber, this.likertScale.getValue(),textarea.value);
            else  writeAssessment(this.questionNumber, this.likertScale.getValue());
        }
        if (ASSESMENT_TEXT){
            textarea.value = '';
            this.formUtil.hideTextArea('textarea');
        }
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
export default AssesmentDialogue;