import {SHOW_EXPLAINATION_PERMANENTLY} from './Constants.js'

class Choice extends Phaser.GameObjects.Container{

    constructor(data){
        let {scene, choiceHandler, x, y, card, numBulid, explainText, scalingX, scalingY} = data
        let choiceButton = new Phaser.GameObjects.Sprite(scene, 0, 0,'month_done').setOrigin(0, 0.5).setScale(scalingX*1.5, scalingY*1.3).setOrigin(0.5,0.5);
        super(scene,x,y,[])
        this.choiceButton = choiceButton
        switch(card.title){
            case "Bett":
                this.choiceItem = new Phaser.GameObjects.Sprite(scene, 0,0, 'bed_pic');
                this.choiceItem.setDisplaySize(45 * scalingX, 45 * scalingY)
                this.choiceItem.setSize(45 * scalingX, 45 * scalingY)
                break;
            case "Regal":
                this.choiceItem = new Phaser.GameObjects.Sprite(scene, 0,0, 'bookcase_pic');
                this.choiceItem.setDisplaySize(40* scalingX, 50 * scalingY)
                this.choiceItem.setSize(40 * scalingX, 50 * scalingY)
                break;
            case "Tisch":
                this.choiceItem = new Phaser.GameObjects.Sprite(scene, 0,0, 'table_pic');
                this.choiceItem.setDisplaySize(50 * scalingX, 30 * scalingY)
                this.choiceItem.setSize(50 * scalingX, 30 * scalingY)
                break;
            case "Stuhl":
                this.choiceItem = new Phaser.GameObjects.Sprite(scene, 0,0, 'chair_pic');
                this.choiceItem.setDisplaySize(45 * scalingX, 50 * scalingY)
                this.choiceItem.setSize(45 * scalingX, 50 * scalingY)
                break;
        }
        this.panelItemNumber = new Phaser.GameObjects.Sprite(scene, this.choiceButton.x, this.choiceButton.y, 'numberPanel').setScale(0.7*scalingX, 0.7*scalingY);
        let text1 = "Build "
        let text2 = " from:"
        this.choiceText1 = new Phaser.GameObjects.Text(scene, 0 , this.choiceButton.y, text1, {fontSize: 20*scalingX, color: '#000000'}).setOrigin(0.5, 0.5);
        this.choiceText2 = new Phaser.GameObjects.Text(scene, 0, this.choiceButton.y, text2, {fontSize: 20*scalingX, color: '#000000'}).setOrigin(0.5, 0.5);
        this.numText = new Phaser.GameObjects.Text(scene, 0, this.choiceButton.y, numBulid, {fontSize: 26*scalingX, color: '#000000'}).setOrigin(0.5, 0.5);
        this.totalLen = (this.choiceText1.width+this.numText.width+this.choiceText2.width+this.choiceItem.displayWidth)/2
        this.choiceText1.x = (this.choiceButton.x - this.totalLen) + this.choiceText1.width/2
        this.numText.x =  (this.choiceButton.x - this.totalLen) + this.choiceText1.width + this.numText.width/2
        this.choiceText2.x = (this.choiceButton.x - this.totalLen) + this.choiceText1.width + this.numText.width + this.choiceText2.width/2
        this.choiceItem.x = (this.choiceButton.x - this.totalLen) + this.choiceText1.width + this.numText.width + this.choiceText2.width + this.choiceItem.width/2
        this.choiceItem.y = this.choiceButton.y
        this.panelItemNumber.x = (this.choiceButton.x - this.totalLen) + this.choiceText1.width + this.numText.width/2
        this.choiceButton.setInteractive();
        this.choiceButton.on('pointerdown', () => {
            this.choiceButton.setTexture('month_done_pressed');
            this.choiceButton.once('pointerup', () => {
                card.scaleProperties(numBulid)
                //choiceHandler.deleteChoices()
                //choiceHandler.updateChoices()
                this.choiceButton.setTexture('month_done');
            });
        });
        this.explainText = new Phaser.GameObjects.Text(this.scene, 0, this.choiceButton.y+(this.choiceButton.height*scalingY*1.4)/2, explainText, {fontSize: 14*scalingX, color: '#000', wordWrap: {width: this.choiceButton.width*1.5*scalingX, useAdvancedWrap: true}}).setOrigin(0.5, 0);
        this.explainText.setVisible(SHOW_EXPLAINATION_PERMANENTLY)
        this.explainFrame = new Phaser.GameObjects.Sprite(scene, 0, this.choiceButton.y, 'panel_beige').setOrigin(0.5, 0)
        this.explainFrame.setDisplaySize(this.choiceButton.width*1.5*scalingX, (this.choiceButton.height*1.4*scalingY)/2 + this.explainText.height + 5*scalingY)
        this.explainFrame.setSize((this.choiceButton.width)*1.5*scalingX, (this.choiceButton.height*1.4*scalingY)/2 + this.explainText.height+ 5*scalingY)
        this.explainFrame.setVisible(SHOW_EXPLAINATION_PERMANENTLY)
        this.add([this.explainFrame, this.explainText, this.choiceButton, this.choiceItem, this.choiceText1, this.choiceText2, this.panelItemNumber,this.numText])
        
        if(!SHOW_EXPLAINATION_PERMANENTLY){
            this.choiceButton.on('pointerover', () => {
                this.explainFrame.setVisible(true)
                this.explainText.setVisible(true)
                this.choiceButton.once('pointerout',() =>{
                    this.explainFrame.setVisible(false)
                    this.explainText.setVisible(false)
                })
            })
        }

        this.scene.add.existing(this);
    }
} export default Choice