import Diagram from './Diagram.js';
import DialogueScene from "./DialogueScene.js";
import ItemPriceTable from './ItemPriceTable.js';
import { MONTHS } from './Constants.js';
import { getAllOptimalProfits } from './ProfitSummary.js';
import Button from './Button.js';
import InteractionScene from './InteractionScene.js';

/**
 * @classdesc
 * This Class servs as a summary of the last month while providing
 * information about the coming month. 
 * After closing this dialogue, the new month will start.
 */
class NewsScene extends InteractionScene
{
    constructor()
    {
        super('newsScene');
    }

    /**
     * Create all the gameObjects necessary to create the scene.
     */
    create()
    {
        /**
         * The background sprite. It is a black, slightly transparent rectangle, that is used to darken the
         * background.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.background = new Phaser.GameObjects.Sprite(this, 0,0,'shadow-background').setScale(9);
        
        // making the backround transparent to animate its fade in later
        this.background.alpha = 0;
        // add the background to the scene
        this.add.existing(this.background);
        this.createDialogue();
        
        // We overwrite the typical panel texture by a newspaper texture.
        this.panel.panel.setTexture('newspaper');
        // we don't need the white paper texture in this case.
        this.panel.contents.destroy();
        // we also do not need the close button as we will have a "continue" button.
        this.panel.buttonRound.destroy();
        // delete the cross...
        this.panel.cross.destroy();
        // ...and the header text
        this.panel.headerText.destroy();
        this.addDiagram();
        this.displayPriceChanges();
        this.displayNewResouces();
        this.addButtonSection();
        // animate the fade in for the black backround.
        this.tweens.add(
            {
                targets: this.background,
                alpha: 1,
                duration: 1000
            }
        );
        // make the newpaper appear.
        this.fadeIn();

    }


    /**
     * This function displays the price changes on the newspaper.
     * It just creates a new {@link PriceTable} object and changes it to fit inside the newspaper
     * displayed in this scene.
     */
    displayPriceChanges()
    {
        let newPrices = [];
        let oldPrices = [];
        let title = new Phaser.GameObjects.Text(this, -200,80, 'Neuer Profit', {fontSize: 20, color: '#000'}).setOrigin(0.5);
        this.mainScene.items.forEach(item =>
            {
                newPrices.push(item.profit[this.mainScene.month.value]);
                oldPrices.push(item.profit[this.mainScene.month.value-1]);
            });
        /**
         * The price table that is used to display the price changes on the newspaper.
         * @type {ItemPriceTable}
         */
        this.priceTable = new ItemPriceTable(
        {
            scene: this,
            x: -170,
            y: 180, 
            pricesOld: oldPrices,
            pricesNew: newPrices
        });
        this.priceTable.title.destroy();
        this.priceTable.spriteFrame.destroy();
        this.priceTable.setScale(1);
        this.panel.add(title);
        this.panel.add(this.priceTable);
    }


    /**
     * Adds the button to continue with the next month.
     */
    addButtonSection()
    {
        let title = new Phaser.GameObjects.Text(this, 205,80, 'Monat Beginnen', {fontSize: 20, color: '#000'}).setOrigin(0.5);
        let descriptionText = new Phaser.GameObjects.Text(this, title.x-5,140, 'Klicke auf "Starten"\num einen neuen Monat\nzu beginnen.', {fontSize: 15,color: '#000'}).setOrigin(0.5);
        let button = new Phaser.GameObjects.Sprite(this, title.x,260, 'button-long');
        button.displayWidth -= 30;
        let buttonText = new Phaser.GameObjects.Text(this, button.x, button.y, 'Starten', {fontSize: 18, color: '#fff'}).setOrigin(0.5);
        this.panel.add([title, descriptionText, button, buttonText]);
        button.setInteractive();
        button.on('pointerdown', function()
        {
            button.setTexture('button-long-pressed');
            button.once('pointerup', function()
            {
                this.mainScene.startTimer();
                this.close();
            }, this);
            this.input.on('pointerup', function()
            {
                button.setTexture('button-long');
            },this);
        }, this);
    }

    /**
     * Display the new resources available in the next month.
     */
    displayNewResouces()
    {
        let title = new Phaser.GameObjects.Text(this, 0,90, 'Verfügbares\nMaterial', {fontSize: 20, color: '#000', align: 'center'}).setOrigin(0.5);
        let description = new Phaser.GameObjects.Text(this,0,150, 'In diesem Monat\nhat die Furniture C.O.\ndie folgenden\nRohstoffe:', {fontSize: 15, color: '#000', align:'left'}).setOrigin(0.5);
        let woodText = new Phaser.GameObjects.Text(this, -90,200, this.mainScene.player.availableWood[this.mainScene.month.value], {fontSize: 18, color: '#000'}).setOrigin(0.2);;
        let woodPicture = new Phaser.GameObjects.Sprite(this, woodText.x+woodText.width, woodText.y, 'wood').setScale(0.05).setOrigin(0, 0.3);
        let metalText = new Phaser.GameObjects.Text(this, woodText.x,woodText.y+30, this.mainScene.player.availableMetal[this.mainScene.month.value], {fontSize: 18, color: '#000'}).setOrigin(0.2);;
        let metalPicture = new Phaser.GameObjects.Sprite(this, metalText.x+metalText.width, metalText.y, 'metal').setScale(0.05).setOrigin(0, 0.3);
        this.panel.add([woodText, woodPicture, metalText, metalPicture, title, description]);
        
    }


    /**
     * Add the diagram to the dialogue
     */
    addDiagram()
    {
        this.diagram = new Diagram(
            {
                scene: this,
                x : -140,
                y: 5,
                lpProfits: getAllOptimalProfits(this.mainScene.lpSolution),
                playerProfits: this.mainScene.player.monthlyProfit,
                months: MONTHS,
                height: 100,
                width: 510
            });
        
        this.panel.add(this.diagram);
    }
}

export default NewsScene;