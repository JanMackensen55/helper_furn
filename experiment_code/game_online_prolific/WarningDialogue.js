import InteractionScene from './InteractionScene.js';
import Button from './Button.js';
import {TEXTDIALOGUE_WIDTH, TEXTDIALOGUE_HEIGHT} from './Constants.js'
/**
 * @classdesc
 * This class asks the player if he or she is sure to proceed.
 * It can be used if the player skips a month without having produced anything
 * of if it is tryed to skip the month while workshops are still producing.
 * In order to make this dialogue work, the data dictionary must contain the field
 * "text", filled with the text, the player recieves. Also the fields mentioned in {@link DialogueScene}
 * must be filled in.
 * 
 * @class WarningDialogue
 * @extends InteractionScene
 * @example
 * // Starts a warningDialogue asking the player if he or she is sure to proceed.
 * this.scene.launch('warningDialogue', {mainScene: this, title: "Warning", text: "Are you sure you want to proceed?"});
 */

class WarningDialogue extends InteractionScene
{
    constructor()
    {
        super("warningDialogue");
    }

    create()
    {
        /**
         * The title of the dialogue
         * @type {String}
         */
        this.title = this.data.title;

        /**
         * The text message that should be displayed to the player.
         * It should be a question that can be answered with "yes" or "no",
         * since the player gets two buttons to answer.
         * @type {String}
         */
        this.text = this.data.text;

        // adjusting the height of the dialogue
        this.height =  0.7 *TEXTDIALOGUE_HEIGHT;
        this.width = TEXTDIALOGUE_WIDTH
        

        // Add the panel to fill it with contents
        this.createDialogue(this.title);

        let textElement = new Phaser.GameObjects.Text(this, -200,-60, this.text, {color: "#000", wordWrap: {width: 420, useAdvancedWrap: true}});
        let buttonNo = new Button(this, -100, 50, "button-long", "button-long-pressed", "No", this.handelResponse.bind(this,false),this);
        let buttonYes = new Button(this, 100, buttonNo.y, "button-long", "button-long-pressed", "Yes", this.handelResponse.bind(this,true),this);
        buttonYes.setButtonScale(0.8);
        buttonNo.setButtonScale(0.8);
        this.panel.add([textElement, buttonYes,buttonNo]);
        this.panel.disableCloseButton();
        this.fadeIn();

    }

    /**
     * Act according to the decision of the player.
     * Used as a callback function from the buttons.
     * @param {boolean} response the response of the player, if set to false, the
     *  dialoge closes without any further actions.
     *  If set to true, the dialogue closes and emits a callback called "clickedYes".
     */
    handelResponse(response)
    {
        if (response)
        {
            this.emitter.emit("clickedYes");
        }
        else this.close();
    }


    
}
export default WarningDialogue;
