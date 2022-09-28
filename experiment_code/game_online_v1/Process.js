/**
 * @classdesc
 * This class implements a process that organizes the production of an item.
 * It distributes the work over the workshops and handels their status using callbacks.
 * If ever workshop has finished the work it signals to the {@link Management} that the process is done.
 * 
 * @class Process
 * @extends Phaser.Events.EventEmitter
 * @see [Phaser.Events.EventEmitter]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Events.EventEmitter.html}
 * @constructor
 * @param {object} data the data that is passed to start a process.
 * @param {Management} data.management the management building that starts the process.
 * @param {module:Item~Item} data.item the item that is to be produced.
 * 
 */
class Process extends Phaser.Events.EventEmitter
{
    constructor(data)
    {
        super();

        /**
         * The associated management building that starts the process. This management instance
         * listens to the progress of this process class.
         * @type {Management}
         */
        this.management = data.management;

        /**
         * The workshops that will be involved in this production process. During production
         * these workshops will be instructed to build the item that is produced in this process.
         * @type {Workshop[]}
         */
        this.workshops = this.management.workshops;

        /**
         * The item that is produced in this process.
         * @type {module:Item~Item}
         */
        this.item = data.item;

        /**
         * The number of workshops that are still working. This value gets decremented if a workshop
         * has finised its work. If all workshops have finished their work, the product is done.
         * @type {number}
         */
        this.stillWorking = this.workshops.length;
    }

    /**
     * Starts the production of the item. 
     * This method calls every involved workshop in [workshops]{@link Process#workshops} and listens
     * if they're finished. If a workshop has finished, the function [handelFinished]{@link Process#handelFinished} is called.
     * @returns {object} return an object with a status that is true if everything is done.
     */
    start()
    {
        // get the production times for every item.
        let times = Object.values(this.item.costs).slice(2);
        
        for (let i=0; i < times.length; i++) // go through every production time
        {
            if (times[i] == 0) // If an item doesn't need time in this workshop, finish this workshop directly
            {
                this.handelFinished();
            }
            else // if it needs more than 0 hours in a workshop, listen to the finish of this workshop and let it work.
            {
                this.once(this.workshops[i].name, this.handelFinished, this);
                this.workshops[i].work({process: this, time: times[i]});
            }
        }
    
        return {status: true};
    }

    /**
     * If a workshop is finished, the [stillWorking]{@link Process#stillWorkung} value is decremented by 1.
     * If all the workshops are done, emit the event that the process is done to the {@link Management}.
     */
    handelFinished()
    {
        this.stillWorking --;
        if (this.stillWorking == 0)
        {
            this.emit('done');   
        }
    }
}

export default Process;