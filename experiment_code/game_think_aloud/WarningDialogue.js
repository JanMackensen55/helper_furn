import * as Constants from './Constants.js';
import ExpainScene from './ExplainScene.js';

/**
 * @class WarningDialogue
 * @classdesc
 * This class implements a dialogue, that is shown if the player finishes a month without bulding something.
 * It lets the player decide if he really wants to finish the month or if he wants to build something
 * 
 * @extends Phaser.GameObjects.Container
 * @constructor
 * 
 * @param {object} data the data object, used to create the dialogue.
 * @param {Phaser.Scene} data.scene the scene where the dialogue is placed.
 * @param {Phaser.Scene} data.parentScene The Scene in which the Scene in which the Dialogue is placed is placed (MainScene)
 * @param {number} data.x the x coordinate of the dialogue.
 * @param {number} data.y the y coordinate of the dialogue.
 * @param {number} data.scalingX factor with which the scene is scaled on the x axis
 * @param {number} data.scalingY factor with which the scene is scaled on the y axis
 * 
 */
class WarningDialogue extends Phaser.GameObjects.Container{
    constructor(data){
        let { scene, parentScene, x, y, scalingX, scalingY, header, text} = data;
        let panel = new Phaser.GameObjects.Sprite(scene, 0,0, 'panel').setScale(scalingX, scalingY);
        let contents = new Phaser.GameObjects.Sprite(scene, -1,-5, 'panel-contents').setScale(scalingX, scalingY);
        panel.displayHeight = 0.7 * Constants.TEXTDIALOGUE_HEIGHT*scalingY; 
        panel.displayWidth = Constants.TEXTDIALOGUE_WIDTH*scalingX; 
        contents.displayHeight = panel.displayHeight - 50*scalingY;
        contents.displayWidth = panel.displayWidth - 70*scalingX;
        let headerText = new Phaser.GameObjects.Text(scene, panel.x, contents.y-contents.displayHeight/2, header, {fontSize:24*Constants.SCALING,color: '#000'}).setOrigin(0.5, -0.8);
        let textElement = new Phaser.GameObjects.Text(scene, -200*scalingX,-60*scalingY, text, {fontSize:16*Constants.SCALING, color: "#000", wordWrap: {width: 420*scalingY, useAdvancedWrap: true}});
        let buttonNo = new Phaser.GameObjects.Sprite(scene, -100*scalingX,80*scalingY,'month_done').setScale(0.75*scalingX, 0.75*scalingY);
        let buttonNoText = new Phaser.GameObjects.Text(scene, buttonNo.x, buttonNo.y, 'Nein', {fontSize: 16*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0.5,0.5);
        let buttonYes = new Phaser.GameObjects.Sprite(scene, 100*scalingX, buttonNo.y,'month_done').setScale(0.75*scalingX, 0.75*scalingY);
        let buttonYesText = new Phaser.GameObjects.Text(scene, buttonYes.x, buttonYes.y, 'Ja', {fontSize: 16*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0.5,0.5);
        
        super(scene,x,y,[panel, contents, textElement, buttonYes, buttonYesText, buttonNo, buttonNoText, headerText]);
        this.parentScene = parentScene;
        scene.add.existing(this);
        this.buttonNo = buttonNo;
        this.buttonYes = buttonYes;
        this.buttonNoText = buttonNoText;
        this.buttonYesText = buttonYesText;

        // Behavior of the No button
        this.buttonNo.setInteractive();
        this.buttonNo.on('pointerdown', () => {
            this.buttonNo.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.buttonNo.once('pointerup', () => {
                this.parentScene.eventEmitter.emit('interactiveDialogueClosed', 'warningDialogue', 'No');
                this.buttonNo.setTexture('month_done');
                this.scene.remove(Constants.SCENES.WARNING) // makes the dialouge disappear
            });
        });

        // Behavior of the Yes button
        this.buttonYes.setInteractive();
        this.buttonYes.on('pointerdown', () => {
            this.buttonYes.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.buttonYes.once('pointerup', () => {
                this.parentScene.eventEmitter.emit('interactiveDialogueClosed', 'warningDialogue', 'Yes');
                this.buttonYes.setTexture('month_done');
                this.scene.remove(Constants.SCENES.WARNING); // makes the dialouge disappear
                if (this.parentScene.month.value > 4){
                    this.parentScene.scene.add(Constants.SCENES.EXPLAIN, ExpainScene, false);
                    this.parentScene.scene.launch(Constants.SCENES.EXPLAIN, {parent: this.parentScene});
                }
                else{
                    this.parentScene.monthDoneBehavior(); // End the month
                }

            });
        });
    }
}
export default WarningDialogue;