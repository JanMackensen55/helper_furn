import Choice from "./Choice.js"

class MultipleChoice extends Phaser.GameObjects.Container{

    constructor(data){
        let {scene, x, y,scalingX, scalingY, cards} = data
        let background = new Phaser.GameObjects.Sprite(scene, 0,0, 'panel').setScale(scalingX, scalingY)
        background.displayHeight = 180*scalingY
        background.displayWidth = 800*scalingY
        super(scene,x,y,[background])
        this.button = new Choice({
            scene: scene,
            choiceHandler:this,
            x:0,
            y:-50,
            card: cards[0],
            numBulid:1,
            explainText: "Because Holz 1 is the resource, which is hardest to not overuse and Tisch 1 has the best Holz 1-profit ratio.",
            scalingX:scalingX*0.85,
            scalingY:scalingY*0.85
        })
        this.button2 = new Choice({
            scene: scene,
            choiceHandler:this,
            x:-320,
            y:-50,
            card: cards[1],
            numBulid:1,
            explainText: "Because Holz 1 is the resource, which is hardest to not overuse and Tisch 1 has the best Holz 1-profit ratio.",
            scalingX:scalingX*0.85,
            scalingY:scalingY*0.85
        })

        this.button3 = new Choice({
            scene: scene,
            choiceHandler:this,
            x:320,
            y:-70,
            card: cards[3],
            numBulid:1,
            explainText: "Because Holz 1 is the resource, which is hardest to not overuse and Tisch 1 has the best Holz 1-profit ratio.",
            scalingX:scalingX*0.85,
            scalingY:scalingY*0.85
        })

        this.button4 = new Choice({
            scene: scene,
            choiceHandler:this,
            x:320,
            y:10,
            card: cards[2],
            numBulid:1,
            explainText: "Because Holz 1 is the resource, which is hardest to not overuse and Tisch 1 has the best Holz 1-profit ratio.",
            scalingX:scalingX*0.85,
            scalingY:scalingY*0.85
        })
        this.add([this.button, this.button2, this.button4, this.button3])
        this.scene.add.existing(this);
    }

    
}export default MultipleChoice