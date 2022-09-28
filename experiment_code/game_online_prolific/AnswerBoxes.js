import { RadioButton } from "./LikertScale.js";

/**
 * @classdesc
 * This class implements the answers to a question, displaying
 * radio buttons that can be checked. Depending on the checked button
 * the class tests if the answers is right or wrong.
 * @class AnswerBoxes
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {object} data.scene the scene where the AnswerBoxes should be rendered in. Normally in the ControlDialogue.
 * @param {Number} data.x the x coordinate of the buttons
 * @param {Number} data.y the y coordinate of the buttons
 * @param {Array} data.answers List of possible answers
 * @param {Number} data.numRightAnswer Number of the correct answer 
 */
class AnswerBoxes extends Phaser.GameObjects.Container{

    constructor(data){
        let {scene, x, y, answers, numRightAnswer} = data;
        let buttons = [];
        let texts = [];
        let initX = -200;
        let stepWidth = 400 / (answers.length-1)
        for (let i=0; i < answers.length; i++)
        {
            buttons.push(new RadioButton({scene:scene, x:initX+stepWidth*i, y:0, value:i}).setScale(0.8));
            texts.push(new Phaser.GameObjects.Text(scene, initX+stepWidth*i, -25, answers[i], {fontSize: 12, color: "#000"}).setOrigin(0.5,0.5));
        }
        
       super(scene,x,y,buttons.concat(texts));
       this.numRightAnswer = numRightAnswer;
       this.activeButton;
       this.buttons = buttons;
       this.addCheckedListeners();
    }

    /**
     * Uncheck the other buttons to ensure that only one radioButton is checked at the same time.
     * @param {RadioButton} exception the button that should not be unchecked (which is the button that was
     * recently clicked).
     */
    uncheckButtons(exception)
    {
         this.activeButton = exception;
         this.buttons.map(x => 
             {
                 if(x !== exception){
                     x.isChecked = false;
                 }
             });
    }
 
     /**
      * Adds a checked listener for each radio button.
      * This helps to identify which button has been clicked. This information is used to unceck the other buttons
      * that might be active. With this method it is ensured, that only one radio button at a time is checked.
      */
    addCheckedListeners()
    {
         this.buttons.forEach(button =>
             {
                 button.on('buttonChecked', this.uncheckButtons,this)
             });
    }

    /**
     * Check if one of the boxes is selected
     * @returns ture if an answer is given else false
     */
    answerGiven()
    {
        if (this.activeButton){
            return true
        }
        return false
    }

    /**
     * Check if the right box is selected
     * @returns true if answer is right else false
     */
    rightAnswer()
    {
        if(this.activeButton.value == this.numRightAnswer){
            return true
        }
        return false
    }
    
}export default AnswerBoxes