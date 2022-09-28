
/**
 * @module ItemPriceTable 
 */

import { SCALINGX, SCALINGY, SCALING } from "./Constants.js";

/**
 * @description
 * Decides which arrow should be displayed and where the arrow should be displayed.
 * If oldPrice is higher than newPrice, the arrow will be red and downwards, vice versa
 * the arrow will be green and upwards. If they are the same, a white line will indicate 
 * that no change has happened.
 * @function createArrow
 * @param {Phaser.Scene} scene the scene, to render the symbols
 * @param {number} oldPrice the old price for example the price of an item one month before.
 * @param {number} newPrice the new price to be compared to the old price.
 * @param {number} x the x position where the arrow should be rendered.
 * @param {number} y the y position where the arrow should be rendered.
 * @returns {Phaser.GameObjects.Sprite} the symbol depending on the old and new price. If old and new are the same the symbol will be a line,
 *     if the old price is higher than the new price, then the arrow is red pointing down. Vice versa the arrow will be green and point up.
 */
function createArrow(scene, oldPrice, newPrice, x,y){
    if (oldPrice < newPrice){
        return new Phaser.GameObjects.Sprite(scene,x,y,'arrow_up').setTint(0x1aff1a).setOrigin(0,0.5).setScale(SCALINGX, SCALINGY);
    }else if (oldPrice > newPrice){
        return new Phaser.GameObjects.Sprite(scene,x,y,'arrow_down').setTint(0xff1a1a).setOrigin(0,0.5).setScale(SCALINGX, SCALINGY);
    }else{
        let symbol = new Phaser.GameObjects.Sprite(scene,x,y,'no_changes').setOrigin(0.2,0.5).setScale(SCALINGX, SCALINGY);
        symbol.displayWidth = 25*SCALINGX; 
        return symbol
    }
}

/**
 * 
 * This class informs the player about the price changes in the new month, by animating a table with the pictures of the items, their old prices
 * and new prices. Additionally, arrows will indicate the movement of the price changes.
 * @class ItemPriceTable
 * @constructor
 * @param {object} data the data that is used to create the price table.
 * @param {Phaser.Scene} data.scene the scene where this table is rendered.
 * @param {number} data.x the x position where the table is rendered.
 * @param {number} data.y the y position where the table is rendered.
 * @param {number[]} data.pricesOld the old prices of the items. The first element is the old price of chair, followed by table, bed and bookcase.
 * @param {number[]} data.pricesOld the new prices of the items. The first element is the old price of chair, followed by table, bed and bookcase.
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 * 
 */
class ItemPriceTable extends Phaser.GameObjects.Container{
    constructor (data){
        let {scene, x, y, pricesOld, pricesNew, scalingX, scalingY} = data;
        let texts = [];
        let sprites = [];
        let spriteFrame = new Phaser.GameObjects.Sprite(scene,0,0,'itemNumberPanel').setScale(scalingX, scalingY);
        let spriteBed = new Phaser.GameObjects.Sprite(scene,-75*scalingX,-50*scalingY,'bed_pic').setScale(scalingX, scalingY);
        let spriteBookcase = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteBed.y+40*scalingY,'bookcase_pic').setScale(scalingX, scalingY);
        let spriteTable = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteBookcase.y+40*scalingY,'table_pic').setScale(scalingX, scalingY);
        let spriteChair = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteTable.y+40*scalingY,'chair_pic').setScale(scalingX, scalingY);
        let textBedOld = new Phaser.GameObjects.Text(scene, spriteBed.x+30*SCALINGX,spriteBed.y, pricesOld[0],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        texts.push(textBedOld);
        let textBookcaseOld = new Phaser.GameObjects.Text(scene, spriteBookcase.x+30*SCALINGX,spriteBookcase.y, pricesOld[1],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        texts.push(textBookcaseOld);
        let textTableOld = new Phaser.GameObjects.Text(scene, spriteTable.x+30*scalingX,spriteTable.y, pricesOld[2],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        texts.push(textTableOld)
        let textChairOld = new Phaser.GameObjects.Text(scene, spriteChair.x+30*scalingX,spriteChair.y, pricesOld[3],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        texts.push(textChairOld);
        let itemHeight = 30*scalingY;
        let arrBed = createArrow(scene, pricesOld[0],pricesNew[0],textBedOld.x+30*scalingX,textBedOld.y);
        let arrBookcase = createArrow(scene, pricesOld[1],pricesNew[1],textBookcaseOld.x+30*scalingX,textBookcaseOld.y);
        let arrTable = createArrow(scene, pricesOld[2],pricesNew[2],textTableOld.x+30*scalingX,textTableOld.y);
        let arrChair = createArrow(scene, pricesOld[3],pricesNew[3],textChairOld.x+30*scalingX,textChairOld.y);
        let textBedNew = new Phaser.GameObjects.Text(scene, arrBed.x+30*scalingX,spriteBed.y, pricesNew[0],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        let textBookcaseNew = new Phaser.GameObjects.Text(scene, arrBookcase.x+30*scalingX,spriteBookcase.y, pricesNew[1], {color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        let textTableNew= new Phaser.GameObjects.Text(scene, arrTable.x+30*scalingX,spriteTable.y, pricesNew[2],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        let textChairNew = new Phaser.GameObjects.Text(scene, arrChair.x+30*scalingX,spriteChair.y, pricesNew[3],{color: '#000', fontSize: 25*SCALING}).setOrigin(0,0.5);
        let itemWidth = itemHeight;
        spriteBed.displayHeight = itemHeight;
        spriteBed.displayWidth = itemWidth;
        spriteBookcase.displayHeight = itemHeight;
        spriteBookcase.displayWidth = itemWidth;
        spriteTable.displayHeight = itemHeight-10*scalingY;
        spriteTable.displayWidth = itemWidth;
        spriteChair.displayHeight = itemHeight;
        spriteChair.displayWidth = itemWidth;
        sprites.push(...[spriteBed,spriteBookcase,spriteChair,spriteTable])
        spriteFrame.setScale(2*scalingX, 2*scalingY);
        let title = new Phaser.GameObjects.Text(scene,-85*scalingX,-85*scalingY, 'Neue Preise!', {color: '#000', fontSize: 25*SCALING});
        super(scene,x,y,[spriteFrame,title,spriteBed,spriteBookcase,spriteTable,spriteChair,textBedOld,textBookcaseOld,textTableOld,textChairOld, textBedNew,textBookcaseNew,textTableNew,textChairNew,arrBed,arrBookcase,arrTable,arrChair]);
        this.scene = scene;
        this.texts = texts;
        this.sprites = sprites;
        this.spriteFrame = spriteFrame;
        this.title = title;
        this.scene.add.existing(this);
        
    }

}

export default ItemPriceTable;