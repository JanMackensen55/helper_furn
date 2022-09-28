import {MAX_MONTHS} from './Constants.js';
/**
 * @classdesc
 * This class implements the data of the player.
 * It also keeps track of the profit, available material and produced items.
 * @class Player
 * @constructor
 * @param {Object} data a data object containing the required information.
 * @param {Phaser.Scene} data.scene the scene the player belongs to. This is usually the {@link MainScene}.
 * @param {number[]} data.availableWood the wood the player has availlable each month.
 * @param {number[]} data.availableMetal the metal the player has availlable each month.
 */
class Player
{
    constructor(data)
    {
        this.scene = data.scene;
        /**
         * The money the player has throughout the game.
         */
        this.money = 0;

        /**
         * This field keeps track of the profit that is made each month.
         * @type{number[]}
         */
        this.monthlyProfit = new Array(MAX_MONTHS).fill(0);
        this.availableWood = data.availableWood;
        this.availableMetal = data.availableMetal;
        this.initialWood = [...data.availableWood];
        this.initialMetal = [...data.availableMetal];
        this.producedItems = 
        {
            chairs: new Array(MAX_MONTHS).fill(0),
            tables: new Array(MAX_MONTHS).fill(0),
            beds: new Array(MAX_MONTHS).fill(0),
            bookcases: new Array(MAX_MONTHS).fill(0)
        };
        
    }

}
export default Player;