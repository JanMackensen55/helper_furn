import Building from "./Building.js";
import ProgressBar from "./ProgressBar.js";
import ProgressBarVertical from "./ProgressBarVertical.js";
import ExperimentTime from "./ExperimentTime.js";
import {ON_LOCAL_MACHINE, PRODUCTION_TIME_SCALING} from './Constants.js';

/**
 * @classdesc
 * This class provides all the functionality needed to build item parts in a workshop. 
 * 
 * @class Workshop
 * @extends Building
 * @constructor
 * 
 * @param {Number} data.time (not used)
 * @param {Number} data.availableHoursTime that can be worked in a workshop.
 * @param {Array} data.items list of items that can be produced in this workshop.
 * @param {Object} data.management Mangement building that is responsible for the items that are produced in this workshop
 * @param {String} data.sign Name of the sign sprite for this workshop  
 */
export default class Workshop extends Building
{
    constructor(data){
        let {time, availableHours, items, management, sign} = data;
        super(data);
        this.time = time;
        this.items = items;
        this.management = management;
        this._busy = false;
        this.queue = [];
        this.initialHeight = this.displayHeight;
        this.initialY = this.y;
        this.addBars();
        this.initialHours = availableHours;
        this.availableHours = this.initialHours;
        this.addClickListener(this.createDialogue);
        this.sign.setTexture(sign).setScale(0.3);
        this.sign.y -=40;
        this.sign.x += 30;
        this.sign.alpha = 1;
        this.add(this.sign);

        

    }

    set availableHours(hours)
    {
        this._availableHours = hours;
        this.timeBar.setMeterPercentage(this.availableHours/this.initialHours);
    }
    get availableHours()
    {
        return this._availableHours;
    }

    set busy(status)
    {
        this._busy = status;
        this.setProduceAnimation(this._busy);
    }

    get busy()
    {
        return this._busy;
    }

    createDialogue()
    {
        this.scene.scene.launch('workshopDialogue', {
            mainScene: this.scene, 
            height: 300,
            width: 500,
            workshop: this,
        });
    }

    /**
     * Initiates the animation of the building to signal that it is busy.
     * @param {boolean} on defining if the animation should be started or stopped.
     */
    setProduceAnimation(on)
    {
        if (on)
        {
            if(this.tween && this.tween.isPlaying())
            {
                this.tween.loopCounter = 100;
                this.tween.loop = -1;
            }
            else
            {
                this.tween = this.scene.tweens.add({
                    targets: [this.buildingSprite],
                    displayHeight: this.buildingSprite.displayHeight+15,
                    y: this.buildingSprite.y - 5,
                    ease: Phaser.Math.Easing.Linar,
                    duration: 400,
                    hold: 0,
                    yoyo: true,
                    loop: -1,
                    onUpdate: () => 
                    {
                        if (!ON_LOCAL_MACHINE){
                            this.controllTimer.updateTime()
                            if (this.timer.elapsed < this.controllTimer.elapsed){
                                this.timer.elapsed = this.controllTimer.elapsed
                            } 
                        }
                        this.progressBar.setMeterPercentage(this.timer.elapsed/this.timer.delay);    
                    },
                    onComplete: () =>
                    {
                        this.progressBar.setMeterPercentage(0);
                    }
                });
            }
        }
        else
        {
            if(this.tween)
            {
                this.tween.loop = 0;
                this.tween.loopCounter = 0;
            }
            

        }
    }

    /**
     * Initiate the working animation and the timer in order to finish a 
     * process. If the time is over, the done() function of this workshop is called,
     * signaling the process that this workshop is done.
     * If the workshop is already producing, the process will be queued.
     * 
     * @param {Object} data an object holding the process and the amount of 
     *                 time that will be needed to finish the process.
     */
    work(data)
    {
        let process = data.process;
        let time = data.time; 
        if (this.busy)
        { 
            this.queue.push({process: process, time: time});
        }
        else
        {
            if (time > 0) this.busy = true;
            this.timer = this.scene.time.addEvent({delay: time*PRODUCTION_TIME_SCALING*1000, callback: this.done, callbackScope: {workshop: this, process: process}});
            if (!ON_LOCAL_MACHINE){
                this.controllTimer = new ExperimentTime({
                    delayValue: time*PRODUCTION_TIME_SCALING*1000
                })
            }
            this.item = process.item;
        }
        
    }

    /**
     * Stops the current production and detatching its process
     * and clearing the queue.
     * 
     */
    interrupt()
    {
        if (this.timer && this.timer.callbackScope)
        {
            let process = this.timer.callbackScope.process;
            process.removeAllListeners();
            this.timer.remove();
            this.busy = false;
            this.queue = [];
        }
    }

    /**
     * This function is triggered after the working timer has expired.
     * It emits a 'finished' event to the process, that can handel the result.
     * After that, the queue is checked to produce the next item.
     */
    done()
    {
        this.process.emit(this.workshop.name, this.process);
        this.workshop.busy = false;
        if (this.workshop.queue.length > 0)
        {
            this.workshop.work(this.workshop.queue.shift());
        }
    }

    /**
     * Add the bars for available time and producing time,
     * that are visible on the map.
     */
    addBars()
    {
        this.timeBar = new ProgressBarVertical(
            {
                scene: this.scene,
                x: this.buildingSprite.x+this.buildingSprite.width,
                y: this.buildingSprite.y+ this.buildingSprite.displayHeight/2,
                height: 50
            });
        this.progressBar = new ProgressBar(
            {
                scene: this.scene,
                x: this.buildingSprite.x- this.buildingSprite.width/2,
                y: this.buildingSprite.y + this.buildingSprite.height/1.3,
                width: 50
            });
        this.progressBar.setMeterPercentage(0);
        this.progressBar.setScale(1,0.5);
        this.add(this.progressBar);
        this.add(this.timeBar);
    }

    /**
     * Reset the available working hours back to the initial values
     * to refill the capacity. Usually done at the change of month.
     */
    resetHours()
    {
        this.availableHours = this.initialHours;
    }

}