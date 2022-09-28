/**
 * @module Item
 */

/**
 * @classdesc
 * This class implements an item, that can be built by workshops.
 * 
 * @class Item
 * 
 * @constructor
 * @param {object} data the data object contains the values the class needs to be created.
 * @param {string} data.name name of the item, that will be displayed to the player.
 * @param {object} data.costs the costs of the item (see [costs]{@link module:Item~Item#costs}).
 * @param {array} data.profit an array holding the price of the item for every month.
 * @param {Phaser.GameObjects.Sprite} [data.image] an image object of the item. This can be added to the item if an already scaled image is 
 *     present.
 * @param {number} data.branch a number that is 0 or 1. This value is used to define to which branch the
 *     item belongs. Depending on the branch different workshops are assigned to the item.
 * @param {string} data.imageCode the image code that is used to display the image of the item.
 * @param {array} data.parts the parts the item consists of. This is necessary, if the option [PRODUCE_PARTS]{@link module:GameProperties#PRODUCE_PARTS} is activated.
 *     see [parts]{@link module:Item~Item#parts}.
 */
class Item
{
    constructor(data)
    {
        let {name, costs, profit, image, branch, imageCode, parts} = data;
        
        /**
         * The name of the item that is displayed to the player.
         * @type {string}
         */
        this.name = name;

        /**
         * The costs of the item.
         * It consists of several parts:
         * 
         * @type {object}
         * @property {number} wood the costs of wood  
         * @property {number} metal the costs of metal
         * @property {number} hoursA the time needed in workshop A
         * @property {number} hoursB the time needed in workshop B
         * @property {number} hoursC the time needed in workshop C
         * @property {number} hoursD the time needed in workshop D
         */
        this.costs = costs;

        /**
         * The profit this item yields for every month.
         * @type {Array}
         */
        this.profit = profit;

        /**
         * The Image object of the item. It can be set if there is already an image to show. Otherwise
         * the image can created using the [imageCode]{@link module:Item~Item#imageCode}.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.image = image;

        /**
         * The branch of the item, that defines which workshops are associated to the item.
         * A 0 stands for the first branch (Workshop A and B) and 1 stands for the second branch (Workshop C and D).
         * @type {number}
         */
        this.branch = branch;

        /**
         * The image code for the item. This is a string that maches the string given by the corresponding
         * load function of the {@link Preloader}. 
         * @see [Phaser.Loader.LoaderPlugin]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#image__anchor}
         */
        this.imageCode = imageCode;
        
        /**
         * The parts define what needs to be built if the item should be created.
         * A parts is a list containing two part object. A parts object is defined as follows:
         * @property {string} name the name of the part that will be displayed.
         * @property {string} imageCode the string defining the key of the image that should be shown.
         * @property {number} demand defines which quantity of this part is required to build an item.
         * @property {object} costs defines how much a part costs. The structure is the same as the [costs]{@link module:Item~Item#costs} of an item.
         */
        this.parts = parts;
    }

 
}

/**
 * This function is used to get the proper scaling for each item. This is necessary because the 
 * images of the items have different sizes. By using this function, the images are scaled to the same size.
 * @function getScaling
 * @param {string} code the image code for which the scaling should be retreived.
 * @returns {number} the scaling of the requested image, that can be used for the [setScale]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html#setScale__anchor}
 *    function on a sprite.
 * @memberof module:Item
 * @static
 */
function getScaling(code)
{
    switch (code)
    {
        case 'chair':
            return 0.2;
        case 'table':
            return 0.05;
        case 'bed':
            return 0.15;
        case 'bookcase':
            return 0.4;
        default:
            return 1;
    }
}

/**
 * This function calculates the costs of producing a given itemPart so many times until its quantity is sufficient to
 * create an item.
 * @function scalePartsCosts
 * @param {object} itemPart an item part with the structure described in [parts]{@link module:Item~Item#parts}.
 * @returns {number} the new total costs, scaled by its demand value.
 * @memberof module:Item
 * @static
 */
function scalePartsCosts(itemPart)
{
    let newCosts = {}
    Object.keys(itemPart.costs).forEach(e =>
    {
        newCosts[e] = itemPart.costs[e] * itemPart.demand;
    });
    return newCosts;
}

export default Item;
export {getScaling, scalePartsCosts}