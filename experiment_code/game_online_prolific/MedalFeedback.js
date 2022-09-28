import { PERCENTAGE_GOOD, PERCENTAGE_VERY_GOOD } from './Constants.js';

/**
 * @classdesc
 * This class is for displaying one medal per level.
 * Depending on how many percent of the optimal solution you have reached,
 * no, a bronze, a silver or a gold medal is displayed for this level.
 * 
 * @class MedalFeedback
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {object} data an object that stores the information needed to build this class.
 * @param {Phaser.Scene} data.scene The scene in which the medals are to be displayed. Usually in the NewsScene.
 * @param {Phaser.Scene} data.mainScene The main scene of the game (MainScene.js) which is needed to get information about the current month.
 * @param {Number} data.x the x coordinate where the medals should be placed.
 * @param {Number} data.y the y coordinate where the medals should be placed.
 * @param {Array} data.lpProfits List of optimal profits for each month
 * @param {Array} data.playerProfits List of the obtained profits of the player
 * @param {Number} data.months Number of months of the game
 * @param {Number} data.width Width of the medals display
 */
export default class MedalFeedback extends Phaser.GameObjects.Container{
    constructor(data){
        let {scene, mainScene,  x, y,lpProfits, playerProfits, months, width} = data;
        let object_list = []
        let title = new Phaser.GameObjects.Text(scene, 0,-70, 'Your achievements in the furniture company:', {fontSize: 22, color: '#000', align: 'center'}).setOrigin(0.5);
        object_list.push(title)
        let star_number = months;
        let pos_first_star = -width/2
        let step_width = width/(star_number-1)
        for (var i = 0; i < star_number; i++) {
            let percentOptimal = playerProfits[mainScene.monthLookUP[i]]/lpProfits[mainScene.monthLookUP[i]]
            let medal = new Phaser.GameObjects.Sprite(scene, pos_first_star+(i)*step_width, -10, 'medal_good').setScale(1).setOrigin(0.5,0.5);
            if (percentOptimal == 1){
                medal = new Phaser.GameObjects.Sprite(scene, pos_first_star+(i)*step_width, -10, 'medal_perfect').setScale(1).setOrigin(0.5,0.5);
            }else if (percentOptimal > PERCENTAGE_VERY_GOOD){
                medal = new Phaser.GameObjects.Sprite(scene, pos_first_star+(i)*step_width, -10, 'medal_very_good').setScale(1).setOrigin(0.5,0.5);
            }else if(percentOptimal > PERCENTAGE_GOOD){
                medal = new Phaser.GameObjects.Sprite(scene, pos_first_star+(i)*step_width, -10, 'medal_good').setScale(1).setOrigin(0.5,0.5);
            }else{
                medal.setTintFill("0x888888")
            }
            object_list.push(medal)
        }
        let performance = Math.round(playerProfits[mainScene.monthLookUP[mainScene.num_month-1]]/lpProfits[mainScene.monthLookUP[mainScene.num_month-1]]*100)
        if (mainScene.num_month === 0){
            var perfText = "You have successfully completed the tutorial"
        }else{
            var perfText = "Last month you reached " + performance.toString() + "% of the optimal solution."
        }
        let lastMonthText =  new Phaser.GameObjects.Text(scene, 0,55, perfText, {fontSize: 18, color: '#000', align: 'center'}).setOrigin(0.5);
        object_list.push(lastMonthText)
        super(scene, x, y, object_list);
        this.lastMonthText = lastMonthText;
        this.title = title;

        //this.scene.add.existing(this);
    }

}