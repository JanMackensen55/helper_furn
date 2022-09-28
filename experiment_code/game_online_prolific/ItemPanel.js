import Button from "./Button.js";
import { PRODUCE_PARTS, PRODUCE_IN_MANAGEMENT} from "./Constants.js";
import PartDisplay from "./PartDisplay.js";
import EventDispatcher from "./EventDispatcher.js";

/**
 * @description
 * This module ensures that all items are displayed in the game 
 *
 * @module ItemPanel
 */

/**
 * @classdesc
 * This class creates an item display class for each item.
 * 
 * @class ItemPanel
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} scene the Phaser scene where the ItemPanel should be displayed. This is usually a {@link ManagementDialogue}.
 * @param {Number} x Position of the ItemPanel on the x axis
 * @param {Number} y Position of the ItemPanel on the y axis
 * @param {Array} items List of all items included in the panel 
 */
export default class ItemPanel extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x, y, items} = data;
        super(scene,x,y);
        let offset = 0;
        items.forEach(item =>
            {
                let display = new ItemDisplay({
                    scene: scene,
                    x: x,
                    y: y+offset,
                    item: item
                });
                this.add(display);
                offset += 90;
            });
    }
}

/**
 * @classdesc
 * This class creates a display of all values of an item.
 * 
 * @class ItemDisplay
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} scene the Phaser scene where the ItemPanel should be displayed. This is usually a {@link ManagementDialogue}.
 * @param {Number} x Position of the diagram on the x axis
 * @param {Number} y Position of the diagram on the y axis
 * @param {Item} item The item whose values are to be displayed 
 */
export class ItemDisplay extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x ,y, item} = data;
        let panel = new Phaser.GameObjects.Sprite(scene,0,0, 'panel-long');
        panel.displayHeight = 95;
        panel.displayWidth = 400;
        let picture = item.image;
        picture.x = -panel.displayWidth/2;
        let header = new Phaser.GameObjects.Text(scene, 0,-panel.displayHeight/2+20, item.name, {fontSize: 17,color: '#000'}).setOrigin(0.5,0.5);
        let profit = new Phaser.GameObjects.Text(scene, picture.x+picture.displayWidth+20,-15, 'Profit: ' +item.profit[scene.mainScene.month]+' ', {fontSize: 15,color: '#000'}).setOrigin(0,0);
        let gold = new Phaser.GameObjects.Sprite(scene, profit.x+profit.width, profit.y,'gold').setOrigin(0.2,0.35).setScale(1.7);
        let woodText = new Phaser.GameObjects.Text(scene, profit.x,profit.y+20, 'Cost: ' + item.costs.wood, {fontSize: 15,color: '#000'});
        let wood = new Phaser.GameObjects.Sprite(scene, woodText.x+woodText.width, woodText.y,'wood').setOrigin(0.2,0.35).setScale(0.04).setOrigin(-0.1,0.2);
        let metalText = new Phaser.GameObjects.Text(scene, wood.x+wood.displayWidth,woodText.y, item.costs.metal, {fontSize: 15,color: '#000'}).setOrigin(-1,0);
        let metal = new Phaser.GameObjects.Sprite(scene, metalText.x+metalText.width, metalText.y, 'metal').setOrigin(-0.5,0.3).setScale(0.05);
        let partOne = new Phaser.GameObjects.Sprite(scene, woodText.x+woodText.width, woodText.y, item.parts[0].imageCode).setOrigin(-0.1,0.3);
        let partTwo = new Phaser.GameObjects.Sprite(scene, metalText.x+metalText.width, metalText.y, item.parts[1].imageCode).setOrigin(-0.5,0.3);
        let workshopOne, workshopTwo, hoursOne, hoursTwo;
        if (item.branch == 0)
        {   
            workshopOne = scene.mainScene.workshopA.image;
            hoursOne = item.costs.hoursA;
            workshopTwo = scene.mainScene.workshopB.image;
            hoursTwo = item.costs.hoursB;
        }
        else if (item.branch == 1)
        {
            workshopOne = scene.mainScene.workshopC.image;
            hoursOne = item.costs.hoursC;
            workshopTwo = scene.mainScene.workshopD.image;
            hoursTwo = item.costs.hoursD;
            partTwo.x += 3;
            partOne.setScale(0.6);
            partTwo.setScale(0.8);
        }
        let durationOne =  new Phaser.GameObjects.Text(scene, woodText.x,metalText.y+20,'Duration(hrs.): '+hoursOne + ' in', {fontSize: 15,color: '#000'});
        let pictureOne = new Phaser.GameObjects.Sprite(scene, durationOne.x+durationOne.width,durationOne.y,workshopOne).setScale(0.38).setOrigin(0,0.4);
        let durationTwo =  new Phaser.GameObjects.Text(scene, pictureOne.x+pictureOne.displayWidth,durationOne.y,hoursTwo+' in', {fontSize: 15,color: '#000'}).setOrigin(-0.2,0);
        let pictureTwo = new Phaser.GameObjects.Sprite(scene, durationTwo.x+durationTwo.width,durationTwo.y,workshopTwo).setScale(0.38).setOrigin(-0.3,0.4);
        let buttonImage = 'notes';
        let buttonImageScaling = 0.25;
        let noteOffset = 10; // If the note image is shown istead of the arrow, push it to the left to stay in the middle of the button.
        let partDisplay = new Phaser.GameObjects.Sprite(scene, 0,0,'').setVisible(false);
        if (PRODUCE_PARTS)
        {
            partDisplay = new PartDisplay(
            {
                scene: scene,
                x: 320,
                y: 0,
                item: item
            });
            partDisplay.alpha = 0;
            buttonImage = 'right';
            buttonImageScaling = 0.45;
            noteOffset = 0;
        }
        super(scene,x,y,[panel, picture,header,profit,gold, durationOne,durationTwo,pictureOne,pictureTwo,partDisplay,woodText,metalText,wood,metal]);
        this.partDisplay = partDisplay;
        this.item = item;
        this.button = new Button(scene, panel.width, 0, 'button-green', 'button-green-pressed',buttonImage,
        this.buttonCallback,this);
        this.button.setOrigin(1,0.5);
        this.button.setButtonScale(0.9);
        this.button.image.x -= noteOffset;
        this.button.image.y -= noteOffset/4;
        this.button.setImageScale(buttonImageScaling);
        this.add([this.button]);
        this.scene = scene;
        this.emitter = EventDispatcher.getInstance();
        this.profit = profit;
    }

    /**
     * Changes the price of the item depending on the month
     */
    updatePrice()
    {
        this.profit.text = 'Profit: ' +this.item.profit[this.scene.mainScene.month];
    }

    /**
     * This method ensures that the corresponding item can be built at the push of a
     * button if the constant PRODUCE_PARTS is false. If this variable is true, the
     * information about the parts will be displayed.
     */
    buttonCallback()
    {
       
        if (PRODUCE_PARTS)
        {
            this.togglePartsDisplay();
        }
        else
        {
            let result = this.scene.management.produce(this.item);
            if (result.status)
            {
                this.button.showMessage('Will be built!');
                this.scene.clickSound.play();
            }
            else 
            {
                this.button.showMessage(result.reason, true);
                this.scene.errorSound.play();
            }
        }
                         
    }

    /**
     * This method ensures that an information window is displayed over the parts.
     */
    togglePartsDisplay()
    {
        this.partDisplay.active = !this.partDisplay.active;
        if (this.partDisplay.active)
        {
            this.emitter.emit('openedPartsDisplay', this.item.name);
            this.button.image.setTexture('left');
            let otherPanels = this.parentContainer.list.filter(e =>
                {
                    return e !== this;
                });
            otherPanels.forEach(e =>
                {
                    if (e.partDisplay.active)
                    {
                        e.partDisplay.active = false;
                        e.button.image.setTexture('right');
                    }                        
                });
        }else
        {
            this.button.image.setTexture('right');
        }

    }

}