import ProgressBar from './ProgressBar.js';
import * as Constants from './Constants.js';
import WarningScene from './WarningScene.js';
import ExpainScene from './ExplainScene.js';
/**
 * @classdesc
 * The UI handels the components like the top bar and every progressbar
 * @class UI
 * @constructor
 * @param {object} data the data object to render the object.
 * @param {Phaser.Scene} data.scene the scene where the UI should be rendered.
 * @param {number} data.x the x coordinate for the UI.
 * @param {number} data.x the y coordinate for the UI.
 * @param {number} data.scalingX specifies how much the sprites are scaled in x direction
 * @param {number} data.scalingY specifies how much the sprites are scaled in y direction
 */
class UI extends Phaser.GameObjects.Container {
    constructor(data){
        let {scene, x, y, scalingX, scalingY} = data;
        let spriteBorder = new Phaser.GameObjects.Sprite(scene,400*scalingX,10*scalingY, 'border').setScale(scalingX, scalingY);
        let goldIcon = new Phaser.GameObjects.Sprite(scene, 0,0,'gold_icon').setScale(scalingX, scalingY);
        let panel = new Phaser.GameObjects.Sprite(scene, 580*scalingX, 65*scalingY, 'panel_beige').setOrigin(0,0).setScale(scalingX, scalingY);
        panel.displayHeight = 465*scalingY;
        panel.displayWidth = 250*scalingX;
        super(scene,x,y, [spriteBorder, panel, goldIcon]);
        this.scene = scene;
        // Icons and text elements
        this.goldIcon = goldIcon;
        this.moneyText = new Phaser.GameObjects.Text(scene, 10*scalingX, 5*scalingY, "",{fontSize: 20*Constants.SCALING, color: '#000'});
        this.woodText = new Phaser.GameObjects.Text(scene, 120*scalingX, 5*scalingY, "",{fontSize: 20*Constants.SCALING, color: '#000'});
        this.metalText = new Phaser.GameObjects.Text(scene, 220*scalingX, 5*scalingY, "",{fontSize: 20*Constants.SCALING, color: '#000'});
        //this.monthText = this.add.text(500, 0, '', {fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        let potentialGoldIcon = new Phaser.GameObjects.Sprite(scene, 0,0, 'gold_icon').setOrigin(0,0.17).setScale(scalingX, scalingY).setVisible(false);
        let potentialProfit = new Phaser.GameObjects.Text(scene, this.moneyText.x+this.moneyText.width, this.moneyText.y,"", {fontSize: 20*Constants.SCALING, color: '#008000'}).setOrigin(0,0);
        let spriteArrowProfit = new Phaser.GameObjects.Sprite(scene, potentialProfit.x - 15*scalingX, potentialProfit.y+potentialProfit.height/4, 'green_arrow').setScale(0.3*scalingX, 0.3*scalingY).setOrigin(0,0).setVisible(false);
        
        //star coins
        this.star_list = []
        let star_number = Constants.MONTHS-1;
        let pos_first_star = panel.x + 30*scalingX
        let step_width = (panel.width*2.3*scalingX-10*scalingX) / star_number
        for (var i = 0; i < star_number; i++) {
            let star = new Phaser.GameObjects.Sprite(scene, pos_first_star+i*step_width, spriteBorder.y+2*scalingY, 'star').setScale(scalingX*0.26, scalingY*0.26);
            star.setTintFill("0xffffff")
            this.star_list.push(star)
        }
        this.add(this.star_list)

        /**
         * This is the progressbar representing the available wood.
         * @type {ProgressBar}
         */
        this.barWood = new ProgressBar({
            scene: scene,
            workshop: 'Holz',
            image: new Phaser.GameObjects.Sprite(scene,0 ,0,'wood_icon').setScale(0.08*scalingX, 0.08*scalingY).setOrigin(1,0.5),
            x: 630*scalingX,
            y: 120*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });

        /**
         * The progressbar, showing the available metal.
         * @type {ProgressBar}
         */
        this.barMetal = new ProgressBar({
            scene: scene,
            workshop: 'Metall',
            image: new Phaser.GameObjects.Sprite(scene,0 ,0,'iron_icon').setScale(0.08*scalingX, 0.08*scalingY).setOrigin(1,0.5),
            x: this.barWood.x,
            y: this.barWood.y+60*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });

        /**
         * This progressbar shows the available time at workshop A.
         * @type {ProgressBar}
         */
        this.barA = new ProgressBar({
            scene: scene,
            workshop: 'Werkstatt A',
            image: new Phaser.GameObjects.Sprite(scene,0 ,0,'workshop-a').setScale(0.18*scalingX, 0.18*scalingY).setOrigin(1,0.5),
            x: this.barWood.x,
            y: this.barMetal.y+60*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });

        /**
         * In this progressbar the available time at workshop B is shown.
         * @type {ProgressBar}
         */
        this.barB = new ProgressBar({
            scene: scene,
            workshop: 'Werkstatt B',
            image: new Phaser.GameObjects.Sprite(scene,0,0,'workshop-b').setScale(0.17*scalingX, 0.17*scalingY).setOrigin(1,0.5),
            x: this.barA.x,
            y: this.barA.y+60*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });

        /**
         * This Bar represents the available time at workshop C.
         * @type {ProgressBar}
         */
        this.barC = new ProgressBar({
            scene: scene,
            workshop: 'Werkstatt C',
            image: new Phaser.GameObjects.Sprite(scene, 0,0,'workshop-c').setScale(0.16*scalingX, 0.16*scalingY).setOrigin(1.05,0.5),
            x: this.barA.x,
            y: this.barB.y+60*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });

        /**
         * The Progressbar showing the time available at workshop D.
         * @type {ProgressBar}
         */
        this.barD = new ProgressBar({
            scene: scene,
            workshop: 'Werkstatt D',
            image: new Phaser.GameObjects.Sprite(scene, 0,0,'workshop-d').setScale(0.15*scalingX, 0.15*scalingY).setOrigin(1.1,0.5),
            x: this.barA.x,
            y: this.barC.y+60*scalingY,
            scalingX: scalingX,
            scalingY: scalingY
        });


        /**
         * This button is used to end the current month.
         * If the button is clicked, the scheduled items will be produced
         * and the Summary is triggered.
         * @type {Phaser.GameObjects.Sprite}
         */
        this.monthDoneButton = new Phaser.GameObjects.Sprite(scene, 620*scalingX,480*scalingY,'month_done').setOrigin(0, 0.5).setScale(0.75*scalingX, 0.75*scalingY);
        this.monthDoneButton.setInteractive();
        this.monthDoneButton.on('pointerdown', () => {
            this.monthDoneButton.setTexture('month_done_pressed'); // Make the button appear "pressed"
            this.monthDoneButton.once('pointerup', () => {
                let month = this.scene.month.value;
                this.scene.eventEmitter.emit('monthDone')
                if (this.isEmpty(this.scene.player.stash)) {
                    this.scene.scene.add(Constants.SCENES.WARNING, WarningScene, false);
                    this.scene.scene.launch(Constants.SCENES.WARNING, {parent: this.scene});   
                } else {
                    if(this.scene.month.value > 4){
                        this.scene.scene.add(Constants.SCENES.EXPLAIN, ExpainScene, false);
                        this.scene.scene.launch(Constants.SCENES.EXPLAIN, {parent: this.scene});
                    }
                    else{
                        this.scene.monthDoneBehavior();
                    }   
                }
                this.monthDoneButton.setTexture('month_done');
            });
        });
        this.monthDoneText = new Phaser.GameObjects.Text(scene, this.monthDoneButton.x+this.monthDoneButton.width*0.75*scalingX/2, this.monthDoneButton.y, 'Monat beenden', {fontSize: 16*Constants.SCALING, color: '#FFFFFF'}).setOrigin(0.5,0.5);
        this.add([this.moneyText, this.woodText, this.metalText, this.monthDoneButton, this.barA, this.barB, this.barC, this.barD, this.monthDoneText, this.barWood, this.barMetal, potentialGoldIcon, spriteArrowProfit, potentialProfit]);
        this.scene.add.existing(this);
        this.spriteArrowProfit = spriteArrowProfit;
        this.potentialProfit = potentialProfit;
        this.potentialGoldIcon = potentialGoldIcon;
    }

    /**
     * This method updates the color of the stars depending on whether the optimal solution was reached in the month
     * @param {value} month month whose star is to be updated
     * @param {boolean} optimal_solution indicates whether optimal solution has been achieved
     */
    update_stars(month, optimal_solution){
        if (month==0) return;
        if(optimal_solution){
            this.star_list[month-1].clearTint()
        }
        else{
            this.star_list[month-1].setTintFill("0x696969")
        }
    }

    /**
     * this metode indicates whether the player.stash is empty or not
     * @param {object} stash stash dictionary object.
     * @returns {boolean} True if empty otherwise false.
     */
    isEmpty(stash){
        for(const [key, value] of Object.entries(stash)){
            if (value.number > 0){
                return false;
            };
        };
        return true;
    }

    /**
     * Displays the amount of money that has already been collected
     * and also the amount of money that can be collected
     * @param {Number} earnedMoney  the amount of money already collected
     * @param {Number} newMoney the amount of money can be collected
     */
    updateMoney(earnedMoney, newMoney){
        this.moneyText.text = earnedMoney;
        this.goldIcon.x = this.moneyText.x+this.moneyText.width;
        this.goldIcon.y = this.moneyText.y;
        this.goldIcon.setOrigin(0,0.17).setScale(1.5*Constants.SCALINGX, 1.5*Constants.SCALINGY);
        if (newMoney == 0){
            this.spriteArrowProfit.setVisible(false);
            this.potentialProfit.text = '';
            this.potentialGoldIcon.setVisible(false);
        }else{
            this.potentialProfit.text = "+" + newMoney;
            this.potentialProfit.x = this.goldIcon.x + this.goldIcon.width + 30*Constants.SCALINGX;
            this.spriteArrowProfit.x = this.potentialProfit.x - 15*Constants.SCALINGX;
            this.spriteArrowProfit.y = this.potentialProfit.y+this.potentialProfit.height/4;
            this.spriteArrowProfit.setVisible(true);
            this.potentialGoldIcon.x = this.potentialProfit.x + this.potentialProfit.width;
            this.potentialGoldIcon.y = this.potentialProfit.y;
            this.potentialGoldIcon.setVisible(true);
            this.potentialGoldIcon.setOrigin(0,0.17).setScale(1.5*Constants.SCALINGX, 1.5*Constants.SCALINGY);
        }
    }

    /**
     * Displays the amount of money that has already been collected
     * @param {Number} earnedMoney the amount of money already collected
     */
    updateEarnedMoney(earnedMoney){
        this.moneyText.text = earnedMoney;
        this.goldIcon.x = this.moneyText.x+this.moneyText.width;
        this.goldIcon.y = this.moneyText.y;
        this.goldIcon.setOrigin(0,0.17).setScale(1.5*Constants.SCALINGX, 1.5*Constants.SCALINGY);
        this.spriteArrowProfit.setVisible(false);
        this.potentialGoldIcon.setVisible(false);
        this.potentialProfit.text = "";
    }


    /**
     * Adjusts the Progressbar indicating the used wood depending on the maximum
     * available wood.
     * @param {Number} newWood the amount of wood that should be added to the progressbar.
     * @param {Number} maxWood the maximum available amount of wood.
     */
    updateWood(newWood, maxWood){
        //this.woodText.text = newWood+'H';
        if (Constants.INFORM_POTENTIAL_OUTCOME_COSTS){
            this.barWood.value = maxWood-newWood;
            this.barWood.setMeterPercentage((maxWood-newWood)/maxWood) + " Stück";

        }
    }

    /**
     * Adjusts the Progressbar indicating the used wood depending on the maximum
     * available metal.
     * @param {Number} newMetal the amount of metal that should be added to the progressbar.
     * @param {Number} maxMetal the maximum available amount of metal.
     */
    updateMetal(newMetal, maxMetal){
        //this.metalText.text = newMetal+'M';
        if (Constants.INFORM_POTENTIAL_OUTCOME_COSTS){
            this.barMetal.value = maxMetal-newMetal;
            this.barMetal.setMeterPercentage((maxMetal-newMetal)/maxMetal) + " Stück";

        }
    }



    /**
     * This function updates a specified Progressbar which displays the available amount of time in a given workshop.
     * @param {string} barStr could be 'A', 'B', 'C' or 'D' and specifies which time bar should be updated.
     * @param {Number} actualHours the amount of hours that should be added to the progressbar.
     * @param {Number} startHours the maximum amount of available hours.
     */
    updateHours(barStr, actualHours, startHours){
        let bar;
        switch (barStr){
            case 'A':
                bar = this.barA;
                break;
            case 'B':
                bar = this.barB;
                break;
            case 'C':
                bar = this.barC;
                break;
            case 'D':
                bar = this.barD;
                break;
            default:
                return;
        }
        //actualHours = Die Stunden, die man uebrig hat
        if (Constants.INFORM_POTENTIAL_OUTCOME_COSTS){ //Boolean, true wenn angezeigt werden soll, wie viele Stunden verbleibend sind
            bar.value = actualHours +  ' Stunden';
            bar.setMeterPercentage(actualHours/startHours);
        }else{
            bar.value = startHours + ' Stunden';
            bar.setMeterPercentage(actualHours/startHours);
        }
    }


}
export default UI;