
/**
 * @description
 * This Module informs the user of pricechanges in the new month.
 *
 * @module ItemPriceTable
 */

/**
 * Decides which arrow should be displayed and where the arrow should be displayed.
 * If oldPrice is higher than newPrice, the arrow will be red and downwards, vice versa
 * the arrow will be green and upwards. If they are the same, a whit line will indicate 
 * that no change has happened.
 * @param {*} scene the scene, to render the symbols
 * @param {*} oldPrice the old price for example the price of an item one month before.
 * @param {*} newPrice the new price to be compared to the old price.
 * @param {*} x the x position where the arrow should be rendered.
 * @param {*} y the y position where the arrow should be rendered.
 */
function createArrow(scene, oldPrice, newPrice, x,y){
    if (oldPrice < newPrice){
        return new Phaser.GameObjects.Sprite(scene,x,y,'arrow_up').setTint(0x1aff1a).setOrigin(0,0.5);
    }else if (oldPrice > newPrice){
        return new Phaser.GameObjects.Sprite(scene,x,y,'arrow_down').setTint(0xff1a1a).setOrigin(0,0.5);
    }else{
        let symbol = new Phaser.GameObjects.Sprite(scene,x,y,'no_changes').setTint(0xd1d1d1).setOrigin(0.2,0.5);
        symbol.displayWidth = 20; 
        return symbol
    }
}

/**
 * @classdesc
 * This Class informs the user of pricechanges in the new month.
 * 
 * @class ItemPriceTable
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the ItemPriceTable should be displayed.
 * @param {Number} data.x Position of the ItemPriceTable on the x axis
 * @param {Number} data.y Position of the ItemPriceTable on the y axis
 * @param {Array} data.pricesOld List of old prices for the items
 * @param {Array} data.pricesNew List of new prices for the items
 */
export default class ItemPriceTable extends Phaser.GameObjects.Container{
    constructor (data){
        let {scene, x, y, pricesOld, pricesNew} = data;
        let texts = [];
        let sprites = [];
        let spriteFrame = new Phaser.GameObjects.Sprite(scene,0,0,'panel-blue');
        let spriteBed = new Phaser.GameObjects.Sprite(scene,-80,-50,'bed');
        let spriteBookcase = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteBed.y+40,'bookcase');
        let spriteTable = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteBookcase.y+40,'table');
        let spriteChair = new Phaser.GameObjects.Sprite(scene,spriteBed.x,spriteTable.y+40,'chair');
        let textBedOld = new Phaser.GameObjects.Text(scene, spriteBed.x+30,spriteBed.y, pricesOld[2],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textBedOld);
        let textBookcaseOld = new Phaser.GameObjects.Text(scene, spriteBookcase.x+30,spriteBookcase.y, pricesOld[3],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textBookcaseOld);
        let textTableOld = new Phaser.GameObjects.Text(scene, spriteTable.x+30,spriteTable.y, pricesOld[1],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textTableOld);
        let textChairOld = new Phaser.GameObjects.Text(scene, spriteChair.x+30,spriteChair.y, pricesOld[0],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textChairOld);
        let itemHeight = 30;
        let arrBed = createArrow(scene, pricesOld[2],pricesNew[2],textBedOld.x+30,textBedOld.y);
        let arrBookcase = createArrow(scene, pricesOld[3],pricesNew[3],textBookcaseOld.x+30,textBookcaseOld.y);
        let arrTable = createArrow(scene, pricesOld[1],pricesNew[1],textTableOld.x+30,textTableOld.y);
        let arrChair = createArrow(scene, pricesOld[0],pricesNew[0],textChairOld.x+30,textChairOld.y);
        let textBedNew = new Phaser.GameObjects.Text(scene, arrBed.x+30,spriteBed.y, pricesNew[2],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textBedNew);
        let textBookcaseNew = new Phaser.GameObjects.Text(scene, arrBookcase.x+30,spriteBookcase.y, pricesNew[3],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textBookcaseNew);
        let textTableNew= new Phaser.GameObjects.Text(scene, arrTable.x+30,spriteTable.y, pricesNew[1],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textTableNew);
        let textChairNew = new Phaser.GameObjects.Text(scene, arrChair.x+30,spriteChair.y, pricesNew[0],{color: '#000', fontSize: 25}).setOrigin(0,0.5);
        texts.push(textChairNew);
        let itemWidth = itemHeight;
        spriteBed.displayHeight = itemHeight;
        spriteBed.displayWidth = itemWidth;
        spriteBookcase.displayHeight = itemHeight;
        spriteBookcase.displayWidth = itemWidth;
        spriteTable.displayHeight = itemHeight-10;
        spriteTable.displayWidth = itemWidth;
        spriteChair.displayHeight = itemHeight;
        spriteChair.displayWidth = itemWidth;
        sprites.push(...[spriteBed,spriteBookcase,spriteChair,spriteTable])
        spriteFrame.setScale(2);
        let title = new Phaser.GameObjects.Text(scene,-85,-85,  'Neue Preise!', {color: '#000', fontSize: 25});
        super(scene,x,y,[spriteFrame,title,spriteBed,spriteBookcase,spriteTable,spriteChair,textBedOld,textBookcaseOld,textTableOld,textChairOld, textBedNew,textBookcaseNew,textTableNew,textChairNew,arrBed,arrBookcase,arrTable,arrChair]);
        this.scene = scene;
        this.texts = texts;
        this.sprites = sprites;
        this.sprites.map(e=> e.setScale(e.scale*1.3));
        this.title = title;
        this.spriteFrame = spriteFrame;
        this.setScrollFactor(0);
        this.scene.add.existing(this);
        //this.setScale(1.5);
        
    }

    /**
     * Makes the dialog window with the changes appear and disappear. 
     */
    run()
    {
        this.scene.tweens.add(
            {
                targets: this,
                x: 900,
                duration: 500,
                ease: Phaser.Math.Easing.Back.Out,
                completeDelay: 4000,
                onComplete: function()
                {
                    this.targets[0].scene.tweens.add(
                        {
                            targets: this.targets[0],
                            x: 1500,
                            duration: 500,
                            ease: Phaser.Math.Easing.Expo.In,
                            completeDelay: 3000,
                            onComplete: function()
                            {
                                this.targets[0].destroy();
                            }
                    });
                }

        });
    }

}

