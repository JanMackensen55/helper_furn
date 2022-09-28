
import { AUTOMATIC_SELLING } from './Constants.js';
import {getScaling} from './Item.js';

/**
 * @description
 * This module creates the storage dialogs and shows the player which item parts are currently in the storage.
 *
 * @module Storage
 */

/**
 * @classdesc
 * This class creates an entry for each item in the storage
 * 
 * @class StoragePanel
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the StoragePanel should be displayed.
 * @param {Number} data.x Position of the StoragePanel on the x axis.
 * @param {Number} data.y Position of the StoragePanel on the y axis.
 * @param {Array} data.items items for which an entry is to be created
 */
export default class StoragePanel extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x,y,items} = data;
        super(scene, x, y);
        let offset = 0;
        this.entries = [];
        items.forEach(item => 
            {
                let entry = new StorageEntry(
                    {
                        scene: scene,
                        x: x,
                        y: y+offset,
                        item: item
                    }
                );
                this.add(entry)
                offset += 100;
                this.entries.push(entry);
            });
    }
}

/**
 * @classdesc
 * Creates an entry for an item in the storage.
 * It shows which parts the item consists of, how many of the parts are currently in the storage
 * and how many parts are needed to build the item.
 * 
 * @class StorageEntry
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the StorageEntry should be displayed.
 * @param {Number} data.x Position of the StorageEntry on the x axis.
 * @param {Number} data.y Position of the StorageEntry on the y axis.
 * @param {Array} data.item item for which an entry is to be created
 */
class StorageEntry extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x,y, item} = data;
        let frame = new Phaser.GameObjects.Sprite(scene, 0,0, 'panel-long');
        frame.setScale(2);
        frame.displayHeight = 100; 
        let topPart = new Phaser.GameObjects.Sprite(scene, -160,-23, item.parts[0].imageCode).setScale(0.7);
        let topText = new Phaser.GameObjects.Text(scene, topPart.x+ 20, topPart.y,   scene.storage.parts[item.parts[0].name]+'/'+item.parts[0].demand, {fontSize: 18, color: '#000'}).setOrigin(0,0.5);
        let bottomPart = new Phaser.GameObjects.Sprite(scene, topPart.x, topPart.y+50, item.parts[1].imageCode).setScale(0.7);
        let bottomText = new Phaser.GameObjects.Text(scene, topPart.x+ 20, bottomPart.y,   scene.storage.parts[item.parts[1].name]+'/'+item.parts[1].demand, {fontSize: 18, color: '#000'}).setOrigin(0,0.5);
        
        super(scene,x,y,[frame, topPart,bottomPart, topText, bottomText]);
        this.tree = this.drawTree(scene,new Phaser.Math.Vector2(topText.x+topText.width,topText.y), new Phaser.Math.Vector2(bottomText.x+bottomText.width,bottomText.y), frame.y)
        this.scene = scene;
        this.item = item;
        this.topText = topText;
        this.bottomText = bottomText;
        this.add(this.tree);
        this.demandOne = item.parts[0].demand;
        this.demandTwo = item.parts[1].demand;
        this.availableOne = this.scene.storage.parts[item.parts[0].name];
        this.availableTwo = this.scene.storage.parts[item.parts[1].name];
        this.itemPicture = new Phaser.GameObjects.Sprite(scene,120, frame.y, item.imageCode).setScale(getScaling(item.imageCode));
        this.button = new Phaser.GameObjects.Sprite(scene, topText.x+40+this.drawLength, frame.y, 'button-square');
        this.button.displayHeight = this.button.displayHeight + 20;
        this.button.diplayWidth = this.button.diplayWidth - 20;
        this.wrench = new Phaser.GameObjects.Sprite(scene, this.button.x, this.button.y, 'wrench').setScale(0.4).setTint(0xe2d2ac);
        this.addButtonListener();
        this.add(this.itemPicture);
        if (!AUTOMATIC_SELLING)
        {
            this.add(this.button);
            this.add(this.wrench);
        }

    }

    /**
     * This function is used to set the text color of the 
     * available parts display. If all need parts are available
     * the text turns black, otherwise it remains red, setting 
     * the cond boolean to false to disable the merging into an item.
     */
    updateItemDisplay()
    {
        this.availableOne = this.scene.storage.parts[this.item.parts[0].name];
        this.availableTwo = this.scene.storage.parts[this.item.parts[1].name];
        if (this.availableOne >= this.demandOne)
        {
            this.topText.setColor('#000');
            this.condOne = true;
        } 
        else
        { 
            this.topText.setColor('#cf3434');
            this.condOne = false;
        }
        if (this.availableTwo >= this.demandTwo)
        {
            this.bottomText.setColor('#000');
            this.condTwo = true;
        }
        else
        {
            this.bottomText.setColor('#cf3434');
            this.condTwo = false;
        }
        
    }

    /**
     * This function signals whether there are enough parts available
     * to combine them into an item.
     * 
     * @returns true, if the conditions for both parts are satisfied,
     *          false, if not.
     */
    canMerge()
    {
        return this.condOne && this.condTwo;
    }

    set availableOne(value)
    {
        this._availableOne = value;
        this.topText.text = this.scene.storage.parts[this.item.parts[0].name]+'/'+this.item.parts[0].demand;
    }

    get availableOne()
    {
        return this._availableOne;
    }
    set availableTwo(value)
    {
        this._availableTwo = value;
        this.bottomText.text = this.scene.storage.parts[this.item.parts[1].name]+'/'+this.item.parts[1].demand;
    }
    get availableTwo()
    {
        return this._availableTwo;
    }
    /**
     * Used to draw the line, indicating that two parts can be combined to create an item.
     * @param {Phaser.Scene} scene, the scene to draw in, should be the scene that implements the drawing.
     * @param {Phaser.Math.Vector2} topPos the position of the top text to connect with the line.
     * @param {Phaser.Math.Vector2} bottomPos the position of the bottom text to connect with the line.
     * @param {Number} frameMidY the middle of the frame to enable drawing in the middle of that frame.
     */
    drawTree(scene, topPos, bottomPos, frameMidY)
    {
        let graphics = new Phaser.GameObjects.Graphics(scene);
        this.drawLength = 100;
        graphics.lineStyle(3, 0x838796);
        graphics.beginPath();
        graphics.moveTo(topPos.x+15, topPos.y);
        graphics.lineTo(topPos.x+ this.drawLength, topPos.y);
        graphics.lineTo(topPos.x+ this.drawLength, frameMidY);
        graphics.moveTo(topPos.x+15, bottomPos.y);
        graphics.lineTo(topPos.x+this.drawLength, bottomPos.y);
        graphics.lineTo(topPos.x+this.drawLength, frameMidY);
        graphics.lineTo(topPos.x+this.drawLength*2, frameMidY);
        graphics.strokePath();
        return graphics;
    }

    /**
     * This function implements a click listener for the
     * merging button. If it is clicked, it will be checked
     * if all required parts for that item are available and 
     * a corresponding event is triggered.
     */
    addButtonListener()
    {
        
        this.button.setInteractive();
        this.button.on('pointerdown', function(){
            if (this.canMerge())
            {
                this.successAnimation();
                this.scene.storage.emit('built'+this.item.branch, this.item);
            }else
            {
                this.failAnimation();  
            } 
        }, this);
    }

    /**
     * This animation is triggered, if an item can be built successfully.
     */
    successAnimation()
    {
        let wrench = this.wrench;
        let tween = this.scene.tweens.addCounter(
            {
                from: 0,
                to: 360,
                duration: 500,
                ease: Phaser.Math.Easing.Expo.Out,
                onUpdate: function(tween)
                {
                    wrench.setAngle(tween.getValue());
                }
            }
        );
    }

    /**
     * If it is not possible to build an item, this animation 
     * is triggered and nothing more happens.
     */
    failAnimation()
    {
        let wrench = this.wrench;
        this.scene.errorSound.play();
        let tween = this.scene.tweens.addCounter(
            {
                from: 0,
                to: 45,
                duration: 300,
                ease: Phaser.Math.Easing.Elastic.In,
                yoyo: true,
                onUpdate: function(tween)
                {
                    wrench.setAngle(tween.getValue());
                }
            }
        );
    }
}