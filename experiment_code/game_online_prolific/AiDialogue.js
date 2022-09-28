import {ON_LOCAL_MACHINE, TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT, MINIMUM_TEXT_SIZE} from './Constants.js';
import FormUtil from './formUtil.js';
import Button from './Button.js';
import {LikertScale} from './LikertScale.js';
import {writeAssessment} from './SosciWriter.js';
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
class AiDialogue extends InteractionScene
{
    constructor()
    {
        super('aiDialogue');
    }

    create()
    {
        /**
         * This is the title of the dialogue.
         * @type {String}
         */
        this.title = this.data.title;

        /**
         * The profit of the items in the scenario that the character describes. The item entries of this object have the properties 
         * profit and solution.
         * @type {Object}
         * @property {Object} chair the properties of the chair
         * @property {Object} table the table item
         * @property {Object} bookcase the bookcase item
         * @property {Object} bed the bed item
         * @property {Object} material the material which can be accessed with wood and metal.
         */
        this.aiData = this.data.aiData;



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
        this.height =  1.5* TEXTDIALOGUE_HEIGHT;
        this.width =  1.3 * TEXTDIALOGUE_WIDTH;
        this.createDialogue('Nachricht von Mike');
        
        let questionElem = new Phaser.GameObjects.Text(this, -270,-190, 'Hi, \nich habe letzten Monat, parallel zu dir, versucht eine Lösung zu \nfinden, aber ich bin mir nicht sicher, ob sie gut ist. \nKannst du mir Feedback geben?', {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let ownText = new Phaser.GameObjects.Text(this, -270,-140, '',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        
        // Player Values
        let ownProfitText = new Phaser.GameObjects.Text(this, ownText.x+150,ownText.y, 'Profit pro Möbelstück:',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let priceBeds = this.createFurnitureEntry(ownProfitText.x+10,ownProfitText.y+30,'bed',0.09,this.aiData.bed.profit,true);
        let priceBookcases = this.createFurnitureEntry(ownProfitText.x+10,priceBeds[0].y+30,'bookcase',0.2,this.aiData.bookcase.profit,true);
        let priceTables = this.createFurnitureEntry(priceBeds[0].x+80,priceBeds[0].y,'table',0.03,this.aiData.table.profit,true);
        let priceChairs = this.createFurnitureEntry(priceBeds[0].x+80,priceBeds[0].y+30,'chair',0.12,this.aiData.chair.profit,true);
        
        let ownResourceText = new Phaser.GameObjects.Text(this, ownText.x,ownText.y, 'Material:',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let woodSprite = new Phaser.GameObjects.Sprite(this, ownResourceText.x+10, ownResourceText.y+30,'wood').setScale(0.05);
        let wood = new Phaser.GameObjects.Text(this, woodSprite.x+20, ownResourceText.y+30, this.aiData.material.wood, {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let metalSprite = new Phaser.GameObjects.Sprite(this, woodSprite.x, wood.y+30,'metal').setScale(0.05);
        let metal = new Phaser.GameObjects.Text(this, woodSprite.x+20, wood.y+30, this.aiData.material.metal, {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        // Optimal Values
        let arrowRight = new Phaser.GameObjects.Sprite(this, ownProfitText.x+200, ownText.y+45,'arrow-right').setOrigin(0.5).setScale(0.8).setTintFill('0xf0f0f0');
        let optimalText = new Phaser.GameObjects.Text(this, ownProfitText.x+270,ownText.y, 'Hergestellt:',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let optimalBeds = this.createFurnitureEntry(optimalText.x+10, priceBeds[0].y,'bed',0.09,this.aiData.bed.solution);
        let optimalBookcases = this.createFurnitureEntry(optimalText.x+10, priceBookcases[0].y,'bookcase',0.2,this.aiData.bookcase.solution);
        let optimalTables = this.createFurnitureEntry(optimalText.x+80, priceTables[0].y,'table',0.03,this.aiData.table.solution);
        let optimalChairs = this.createFurnitureEntry(optimalText.x+80, priceChairs[0].y,'chair',0.12,this.aiData.chair.solution);

        let questionHow = new Phaser.GameObjects.Text(this, -270,-40,'Wie gut ist meine Lösung?',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let feedbackText = new Phaser.GameObjects.Text(this, ownProfitText.x, priceChairs.y+30, '',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        //let bad = new Phaser.GameObjects.Text(this, -240, -20, 'schlecht',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        //let good = new Phaser.GameObjects.Text(this, 160, -20, 'optimal',  {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        let questionWhy = new Phaser.GameObjects.Text(this, -270,30, 'Was habe ich richtig/falsch gemacht?', {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        
        this.panel.add(questionElem);
        //this.panel.add(bad);
        //this.panel.add(good);
        this.panel.add(ownText);
        this.panel.add([woodSprite,metalSprite,arrowRight]);
        this.panel.add(ownProfitText);
        this.panel.add(priceChairs);
        this.panel.add(priceTables);
        this.panel.add(priceBookcases);
        this.panel.add(priceBeds);
        
        this.panel.add(ownResourceText);
        this.panel.add(wood);
        this.panel.add(metal);
        
        this.panel.add(optimalText);
        this.panel.add(optimalBeds);
        this.panel.add(optimalBookcases);
        this.panel.add(optimalTables)
        this.panel.add(optimalChairs);
        
        this.panel.add(questionHow);
        this.panel.add(questionWhy);
        this.panel.disableCloseButton();
        let sendButton = new Button(this,200,250,'button-long', 'button-long-pressed','Absenden',this.sendText,this);
        sendButton.setButtonScale(0.75);
        this.likertScale = new LikertScale({scene: this, x: 0, y: 0});
        this.panel.add(this.likertScale);
        this.sendButton = sendButton;
        this.panel.add(sendButton);
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
        //this.formUtil.placeElementAt(400,400, 'asses', true, true);
        //this.formUtil.disableResize('asses');
        // Set up the textarea to be displayed at the right place
        this.formUtil.scaleToGameW('textarea', .65);
        this.formUtil.scaleToGameH('textarea',.25);
        this.formUtil.placeElementAt(400,540, 'textarea', true, true);
        this.formUtil.disableResize('textarea');
        this.fadeIn(this.showTextArea);
        
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
        //let asses = document.getElementById('asses');
        let textarea = document.getElementById('textarea');
        if (!this.likertScale.getValue())
        {
            this.sendButton.showMessage("Bitte wähle eine der fünf Antworten.",alert=true,10,1000);   
            return;
        }
        if (textarea.value.length < MINIMUM_TEXT_SIZE)
        {
            this.sendButton.showMessage("Bitte schreibe etwas mehr.", alert=true, 10,1000);
            return;
        }
        if (ON_LOCAL_MACHINE) 
        {
            console.log(this.likertScale.getValue());
            console.log(textarea.value);
        }
        else writeAssessment(this.questionNumber, this.likertScale.getValue(),textarea.value,true);
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

    /**
     * Creates an image and a text element. This can be used to create entries for furniture inside the table.
     * @param {number} x x-position of the sprite
     * @param {number} y y-position of the sprite
     * @param {String} picture the image key of the furniture that should be displayed.
     * @param {number} [scale=1] the scale of the image.
     * @param {*} value the value that should be displayed beneath the sprite
     * @param {boolean} [gold=false] defines whether a money symbol should be displayed additionally.
     * @returns {Array} a list containing the image and the text object to be added to the scene
     */
    createFurnitureEntry(x, y, picture, scale=1, value, gold=false)
    {
        let sprite = new Phaser.GameObjects.Sprite(this,x,y, picture).setScale(scale);
        let text = new Phaser.GameObjects.Text(this, sprite.x+20, y, value, {fontSize:14,color: '#000'}).setOrigin(0,0.5);
        if (gold)
        {
            let goldSprite = new Phaser.GameObjects.Sprite(this,text.x+25, y, 'gold').setScale(1.3);
            return [sprite,text,goldSprite]
        }
        return [sprite,text];
    }

}

export default AiDialogue;