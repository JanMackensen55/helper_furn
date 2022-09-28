import Building from './Building.js';

/**
 * @classdesc
 * This class renders a market building with that can be used to 
 * compare the profits of the player with the optimal solution.
 * 
 * @class Market
 * @extends Building
 * @constructor
 * @param {object} data the object that is used to provide the required information.
 * See {@link Building} for more information.
 */
class Market extends Building
{
    constructor(data)
    {
        super(data);

        /**
         * The player instance to retrieve the profits.
         * @type {Player}
         */
        this.player = this.scene.player;

        /**
         * The linear programming problem solution that is used to be compared to the player's performance.
         */
        this.lp = this.scene.lpSolution;

        // add the click listener to the building and trigger the createDialogue function if clicked.
        this.addClickListener(this.createDialogue);
    }

    /**
     * This function launches the market Dialogue scene where the 
     * information is actually rendered.
     * @see MarketDialogue
     */
    createDialogue()
    {
        this.scene.scene.launch('marketDialogue',
        {
            mainScene: this.scene,
            height: 400,
            width: 500,
            market: this
        });
    }
}
export default Market;