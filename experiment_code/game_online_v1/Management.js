import Building from './Building.js';
import Process from './Process.js';
import * as Constants from './Constants.js';

/**
 * @classdesc
 * This Class is responsible for rendering a management building.
 * In a management Building the player can see the Items that can be produced along with its costs and profit.
 * This should serve as information source for planning which items should be produced in the actual month.
 * Each management represents one production branch. 
 * 
 * @class Management
 * @extends Building
 * 
 * @constructor
 * @param {object} data an object that stores the information needed to build this class. 
 * @param {Phaser.Scene} data.scene the scene where the management building should be built in. See [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 * @param {Number} data.x the x coordinate where the building should be placed. 
 * @param {Number} data.y the y coordinate for the building.
 * @param {String} data.image the image key of the building.
 * @param {String} data.name the name of the building.
 * @param {Array} data.items the items that should be described by the management.
 * @param {Storage} data.storage the storage building, where the management should store produced items.
 * @param {Player} data.player the player instance.
 * @param {Number} data.branch the branch of the management.
 * 
 */
class Management extends Building
{
    constructor(data)
    {
        super(data);
        /**
         * This is a list of items that should be managed in this building.
         * This list corresponds to the branch of this management.
         * 
         * @type {Array}
         */
        this.items = data.items;

        /**
         * This is the list of workshops the management is responsible for.
         * This list is used to schedule production processes. If something is produced, the management calls the 
         * workshops in this list.
         * 
         * @type {Array}
         */
        this.workshops = data.workshops;

        /**
         * This is the storage. If the option [PRODUCE_PARTS]{@link GameProperties#PRODUCE_PARTS} is activated,
         * this storage is called after the production is finished causing the produced part to be stored.
         *
         * @type {Storage}
         */
        this.storage = data.storage;

        /**
         * The player. This is needed to add the profit and applying the costs.
         * 
         * @type {Player}
         */
        this.player = this.scene.player;
        this.addClickListener(this.createDialogue);
        
        /**
         * The Branch helps applying branch specific properties like duration and responsible workshops.
         * There are two possible values for the branch:
         * 
         * + `0` - The branch including `chairs` and `tables`.
         * + `1` - The branch includin `beds` and `bookcases`.
         * 
         * @type {Number}
         */
        this.branch = data.branch;
        if (this.branch == 0) this.sign.setTexture('sign1').setScale(0.3);
        else this.sign.setTexture('sign2').setScale(0.3);
        this.sign.y -=40;
        this.sign.x += 30;
        this.sign.alpha = 1;
        this.add(this.sign);

        if(Constants.PRODUCE_PARTS)
        {
            // Add a listener to wait if an item is complete in order to sell it.
            this.storage.on('built'+this.branch, function(item)
            {
                this.item = item;
                this.sell();
            },this);
        }
    }

    /**
     * This function is used as the callback function of the clicklistener.
     * If the building is clicked, a new [ManagementDialogue]{@link ManagementDialogue} will be launched.
     * @see {@link Building#addClickListener}
     */
    createDialogue()
    {
        this.scene.scene.launch('managementDialogue', {
            mainScene: this.scene, 
            height: 300,
            width: 500,
            management: this
        });      
    }
    

    /**
     * Produces an item, by consuming its costs and invoking a process.
     * @see Process
     * @param {Item} item The item that should be produced. 
     * @returns {object} an object holding true inside its status attribute if the item can be produced, 
     *          else the dictionary status is false and it has an accessable reason. 
     * 
     * Example return if the item cannot be produced: {status: false, reason: 'not enough wood!'}
     * These values come from the canAfford method.
     */
    produce(item)
    {

        let canAfford = this.canAfford(item);
        if (canAfford.status) // check if the item is affordable
        {
            // consume the required material form the players available resources
            this.player.availableWood[this.scene.month.value] -= item.costs.wood;
            this.player.availableMetal[this.scene.month.value] -= item.costs.metal;
            let times = Object.values(item.costs).slice(2); // slice the wood and metal from the items costs - only the times are left
            for (let i=0; i < times.length; i++)
            {
                // distribute the time costs over the workshops
                this.workshops[i].availableHours -= times[i];
            }
            // Start a new process
            let process = new Process({management: this, item: item});
            process.start();
            
            if(Constants.PRODUCE_PARTS)
            {
                // store the item if the process sends that the workshop is done producing
                process.on('done', this.store, {storage: this.storage, part: item, management: this});
            }
            else
            {
                // sell the item.
                process.on('done', this.sell, {player: this.player, item: item, scene: this.scene});
            }
        }
        return canAfford;
    }
    

    /**
     * Sells an item in the given context and add its profit to the players
     * money. After that, the produced item is added to the players statistics.
     */
    sell()
    {
        let profit = this.item.profit[this.scene.month.value];
        this.scene.buildSound.play();
        this.player.money += profit;
        this.player.monthlyProfit[this.scene.month.value] += profit;
        switch (this.item.name) // using the item name to add the produced item to the statistics.
        {
            case Constants.ITEM_NAME_CHAIR:
                this.player.producedItems.chairs[this.scene.month.value] += 1;
                break;
            
            case Constants.ITEM_NAME_TABLE:
                this.player.producedItems.tables[this.scene.month.value] += 1;
                break;
            
            case Constants.ITEM_NAME_BED:
                this.player.producedItems.beds[this.scene.month.value] += 1;
                break;

            case Constants.ITEM_NAME_BOOKCASE:
                this.player.producedItems.bookcases[this.scene.month.value] += 1;
                break;
        }
        if (Constants.PRODUCE_PARTS)
        {
            this.item.parts.forEach(part => 
                {
                    this.storage.parts[part.name] -= part.demand; // consume the parts after the item has been sold.
                });
        }
    }

    /**
     * Stores the last produced part inside the storage.
     * If the GameProperty [AUTOMATIC_SELLING]{@link module:GameProperties#AUTOMATIC_SELLING} is activated, it invokes
     * the [combineAvailable]{@link Storage#combineAvailable} function of storage, producting every item 
     * that can be afforded.
     */
    store()
    {
        this.storage.parts[this.part.name] +=1;
        if (Constants.AUTOMATIC_SELLING)
        {
            this.storage.combineAvailable();
        }
    }

    /**
     * Checks if the player has the required resources and if the 
     * workshops have enough time to produce the requested item.
     * @param {Item} item the item that should be produced.
     * @returns {{status: boolean, reason: string}} if the item can be afforded it just returns `status: true`. If not,
     *     the status is set to `false` and the `reason` corresponds to the reason of why the item could not be produced.
     */
    canAfford(item)
    {
        let costs = item.costs;
        if (costs.wood > this.player.availableWood[this.scene.month.value]) return {status: false, reason: 'Nicht genug Holz!'};
        if (costs.metal > this.player.availableMetal[this.scene.month.value]) return {status: false, reason: 'Nicht genug Metall!'};
        if (costs.hoursA > this.scene.workshopA.availableHours) return {status: false, reason: 'Keine Zeit mehr in A!'};
        if (costs.hoursB > this.scene.workshopB.availableHours) return {status: false, reason: 'Keine Zeit mehr in B!'};
        if (costs.hoursC > this.scene.workshopC.availableHours) return {status: false, reason: 'Keine Zeit mehr in C!'};
        if (costs.hoursD > this.scene.workshopD.availableHours) return {status: false, reason: 'Keine Zeit mehr in D!'};
        else return {status: true};
    }
}

export default Management;