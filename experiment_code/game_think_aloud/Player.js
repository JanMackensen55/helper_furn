import {writeProfit, writeProducedItems} from './SosciWriter.js';
import * as Constants from './Constants.js';
/**
 * @classdesc
 * This class represents the palyer of the game.
 * It is used to keep track of the profits and produced items of the player.
 * It also unpacks the material that is available each month.
 * @class Player
 * @constructor
 * @param {object} data the data that is unpacked to create a player.
 * @param {UI} data.ui an {@link UI} instance to update the new values.
 * @param {Phaser.scene} data.scene the scene that creates the player. it is ususally the main scene.
 * @param {number[]} data.availableWood the wood the palyer has every month.
 * @param {number[]} data.availableMetal the metal the palyer has every month.
 * @param {number} data.hoursA the available hours at workshop A.
 * @param {number} data.hoursB the available hours at workshop B.
 * @param {number} data.hoursC the available hours at workshop C.
 * @param {number} data.hoursD the available hours at workshop D.
 * 
 */
class Player {
    constructor(data){
        let {ui, money, wood, metal, hoursA, hoursB, hoursC, hoursD} = data;
        
        /**
         * The ui instace is used to display the material and the money of the player.
         * @type {UI}
         */
        this.ui = ui;
        
        /**
         * The amount of money the player has generated during the game.
         * Setting this value will automatically set the value for money in the 
         * ui instance, making the changes visible.
         * @type {number}
         */
        this.money = money;

        /**
         * The available wood each month.
         * @type {number[]}
         */
        this.woodList = wood;

        /**
         * The available metal each month.
         * @type {number[]}
         */
        this.metalList = metal;

        /**
         * The available amount of time in workshop A in the beginning
         * of a month.
         * @type {number}
         */
        this.totalHoursA = hoursA;

        /**
         * The available amount of time in workshop B in the beginning
         * of a month.
         * @type {number}
         */
        this.totalHoursB = hoursB;

        /**
         * The available amount of time in workshop C in the beginning
         * of a month.
         * @type {number}
         */
        this.totalHoursC = hoursC;

        /**
         * The available amount of time in workshop D in the beginning
         * of a month.
         * @type {number}
         */
        this.totalHoursD = hoursD;

        /**
         * The time in workshop A, that is left to the player.
         * This value changes, as the player draggs a slider from cards
         * with branch 1. 
         * @type {number}
         */
        this.hoursA = this.totalHoursA;

        /**
         * The time in workshop B, that is left to the player.
         * This value changes, as the player draggs a slider from cards
         * with branch 1. 
         * @type {number}
         */
        this.hoursB = this.totalHoursB;

        /**
         * The time in workshop C, that is left to the player.
         * This value changes, as the player draggs a slider from cards
         * with branch 2. 
         * @type {number}
         */
        this.hoursC = this.totalHoursC;

        /**
         * The time in workshop D, that is left to the player.
         * This value changes, as the player draggs a slider from cards
         * with branch 2. 
         * @type {number}
         */
        this.hoursD = this.totalHoursD;

        /**
         * The stash keeps record every item that is planned for production, 
         * thus every card, that has a slider position > 0, will appear in the stash 
         * with its corresponding total costs. The keys are the titles of the cards
         * (see {@link Card#title}) and the values are an object, containing the costs, defined 
         * similarly to {@link Card#costs}.
         * @type {object}
         */
        this.stash = {};

        /**
         * These are the total costs of all cards, stored in the [stash]{@link Player#stash}.
         * @type {object}
         * @property {number} wood the costs of wood.
         * @property {number} metal the costs of metal.
         * @property {number} hoursA the time needed in workshop A.
         * @property {number} hoursB the time needed in workshop B.
         * @property {number} hoursC the time needed in workshop C.
         * @property {number} hoursD the time needed in workshop D.
         * @property {number} profit the total profit of the items.
         * @property {number} number the total amount of items.
         */
        this.combinedCosts = {};

        /**
         * This array holds the profit each month that is made by the player.
         * @type {number[]}
         */
        this.monthlyProfit = [];

        /**
         * The total amount of produced beds each month.
         * @type {number[]}
         */
        this.totalBeds = [];

        /**
         * The total amount of produced bookcases each month.
         * @type {number[]}
         */
        this.totalBookcases = [];

        /**
         * The total amount of produced beds each month.
         * @type {number[]}
         */
        this.totalTables = [];

        /**
         * The total amount of produced beds each month.
         * @type {number[]}
         */
        this.totalChairs = [];
        
        /**
         * The amount of beds in the current month.
         * @type {number}
         */
        this.beds = 0;

        /**
         * The amount of bookcases in the current month.
         * @type {number}
         */
        this.bookcases = 0;

        /**
         * The amount of tables in the current month.
         * @type {number}
         */
        this.tables = 0;

        /**
         * The amount of chairs in the current month.
         * @type {number}
         */
        this.chairs = 0;
    }

    /**
     * This function adds the produced items of one month to the 
     * total amount of produced items.
     * This allows to count the produced items per month.
     */
    saveTotalProduced(){
        this.totalBeds.push(this.beds);
        this.totalBookcases.push(this.bookcases);
        this.totalTables.push(this.tables);
        this.totalChairs.push(this.chairs);
    }

    set money(newMoney){
        this._money = newMoney;
        this.ui.updateEarnedMoney(this.money);
    }
    get money(){return this._money;}

    set wood(newWood){
        this._wood = newWood;
        this.ui.updateWood(0, this.woodList[this.month]);
    }
    get wood(){return this._wood;}

    set metal(newMetal){
        this._metal = newMetal;
        this.ui.updateMetal(0, this.metalList[this.month]);
    }
    get metal(){return this._metal;}

    set month(newMonth){
        this._month = newMonth;
        this.wood = this.woodList[this._month];
        this.metal = this.metalList[this._month];
    }
    get month(){return this._month;}

    set hoursA(newHours){
        this.leftHoursA = newHours;
        this.ui.updateHours('A',this.leftHoursA,this.totalHoursA);
        
    }
    set hoursB(newHours){
        this.leftHoursB = newHours;
        this.ui.updateHours('B', this.leftHoursB, this.totalHoursB);
    }
    set hoursC(newHours){
        this.leftHoursC = newHours;
        this.ui.updateHours('C', this.leftHoursC, this.totalHoursC);
    }
    set hoursD(newHours){
        this.leftHoursD = newHours;
        this.ui.updateHours('D', this.leftHoursD, this.totalHoursD);
    }

    get hoursA(){return this.leftHoursA;}
    get hoursB(){return this.leftHoursB;}
    get hoursC(){return this.leftHoursC;}
    get hoursD(){return this.leftHoursD;}
    get totalA(){return this.totalHoursA;}
    get totalB(){return this.totalHoursB;}
    get totalC(){return this.totalHoursC;}
    get totalD(){return this.totalHoursD;}

    /**
     * checks if the player has enough ressources to build the desired product
     * @param {Object} costs an object containing the costs of the product. 
     *  The object must contain the fields 'wood','metal','hoursA','hoursB','hoursC','hoursD'
     * 
     * @returns {{result: boolean, reason: string}} if the player can afford the item given the costs, the result is true and no reason is provided.
     *   If the player cannot afford the item given the costs. the result is false and the reason is a string, informing the player, why he/she 
     *   cannot afford the desired item.
     * 
     * 
     * @example
     * canAfford(
     *     {
     *         wood: 14,
     *         metal: 10, 
     *         hoursA: 3,
     *         hoursB: 1,
     *         hoursC: 0,
     *         hoursD: 0
     *     }); 
     *     // Returns either {result: true}, or {result: flase, reason: 'Zu wenig Zeit in B'}
     */
    canAfford(costs){
        if (costs.wood > this.wood) return { result: false, reason: 'Nicht genug Holz'};
        if (costs.metal > this.metal) return { result: false, reason: 'Nicht genug Metall'};
        if (costs.hoursA > this.hoursA) return { result: false, reason: 'Zu wenig Zeit in A'};
        if (costs.hoursB > this.hoursB) return { result: false, reason: 'Zu wenig Zeit in B'};
        if (costs.hoursC > this.hoursC) return { result: false, reason: 'Zu wenig Zeit in C'};
        if (costs.hoursD > this.hoursD) return { result: false, reason: 'Zu wenig Zeit in D'};
        return {result: true};
    }

    /**
     * This function adds all scheduled items to the produced items of player
     * and stores the profit of them.
     * The produced items and the profit of this month are stored into the corresponding
     * SosciSurvey variable.
     */
    produce() {
        let tempProfit= 0;
        for (let card in this.stash){
            this.money = this.money+ this.stash[card].profit;
            tempProfit = tempProfit + this.stash[card].profit;
            this.wood = this.wood - this.stash[card].wood;
            this.metal = this.metal - this.stash[card].metal;
            this.hoursA = this.leftHoursA - this.stash[card].hoursA;
            this.hoursB = this.leftHoursB - this.stash[card].hoursB;
            this.hoursC = this.leftHoursC - this.stash[card].hoursC;
            this.hoursD = this.leftHoursD - this.stash[card].hoursD;
            switch (card) {
                case 'Bett':
                    this.beds = this.beds + this.stash[card].number;
                    break;
                case 'Regal':
                    this.bookcases = this.bookcases + this.stash[card].number;
                    break;
                case 'Tisch':
                    this.tables = this.tables + this.stash[card].number;
                    break;
                case 'Stuhl':
                    this.chairs = this.chairs + this.stash[card].number;
                    break;

            }
        }
        if (!Constants.ON_LOCAL_MACHINE){
            writeProducedItems('player',this.month, {
                beds: this.beds,
                bookcases: this.bookcases,
                tables: this.tables,
                chairs: this.chairs
            });
            writeProfit('player',this.month, tempProfit);
        }
        this.monthlyProfit.push(tempProfit);
    }

    /**
     * This function calculates the potential costs of producing an item,
     * taking other scheduled items into account.
     * If the player can afford the requested amount of the desired card, the costs
     * will be added to the stash. The stash is used to view the potential costs for a month.
     * @param {Card} card An object of the type Card. 
     * @param {Number} factor The number, indicating how many times the card should be produced.
     * @returns {{result: boolean, reason: string}} if the player can afford the item given the costs, the result is true and no reason is provided.
     *   If the player cannot afford the item given the costs. the result is false and the reason is a string, informing the player, why he/she 
     *   cannot afford the desired item.
     */
    previewValues(card, factor){
        let stash = { ...this.stash };
        let cardCosts = {
            wood: factor*card._costs.wood,
            metal: factor*card._costs.metal,
            hoursA: factor*card._costs.hoursA,
            hoursB: factor*card._costs.hoursB,
            hoursC: factor*card._costs.hoursC,
            hoursD: factor*card._costs.hoursD,
            profit: factor*card._profit,
            number: factor
        }
        stash[card.title] = {
            wood: cardCosts.wood,
            metal: cardCosts.metal, 
            hoursA: cardCosts.hoursA,
            hoursB: cardCosts.hoursB,
            hoursC: cardCosts.hoursC,
            hoursD: cardCosts.hoursD,
            profit: cardCosts.profit,
            number: cardCosts.number
        };
        this.combinedCosts = this.combineCosts(stash);
        let canAfford =  this.canAfford(this.combinedCosts);
        if (canAfford.result){
            this.stash[card.title] = stash[card.title];
            if (Constants.INFORM_POTENTIAL_OUTCOME_COSTS){
                this.ui.updateMoney(this.money, this.combinedCosts.profit);
                this.ui.updateWood(this.combinedCosts.wood, this.woodList[this.month]);
                this.ui.updateMetal(this.combinedCosts.metal, this.metalList[this.month]);

                if (card.branch == 1){
                    this.ui.updateHours('A', 1-this.combinedCosts.hoursA+this.totalHoursA-1, this.totalHoursA);
                    this.ui.updateHours('B', 1-this.combinedCosts.hoursB+this.totalHoursB-1, this.totalHoursB);

                }else {
                    this.ui.updateHours('C', 1-this.combinedCosts.hoursC+this.totalHoursC-1, this.totalHoursC);
                    this.ui.updateHours('D', 1-this.combinedCosts.hoursD+this.totalHoursD-1, this.totalHoursD);
                }
            }
        }
        return canAfford;
    }

    /**
     * A helper function, which adds up the costs for every scheduled card.
     * @param {Object} stash the object containing the scheduled items to build (see {@link Player#stash}).
     * @returns The costs of all scheduled cards, including 'profit' and 'number' as meta information.
     */
    combineCosts(stash){
        let combinedCosts = {
            wood: 0,
            metal: 0,
            hoursA: 0,
            hoursB: 0,
            hoursC: 0,
            hoursD: 0,
            profit:0,
            number: 0
        };
        for (var card in stash){
            for (var costs in stash[card]){
                combinedCosts[costs] = combinedCosts[costs] + stash[card][costs]
            }
        }
        return combinedCosts;

    }

    /**
     * Resets the Progress bars of the month to zero.
     */
    resetBars(){
        this.hoursA = this.totalA;
        this.hoursB = this.totalB;
        this.hoursC = this.totalC;
        this.hoursD = this.totalD;
    }

}
export default Player;