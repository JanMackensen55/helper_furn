import Building from "./Building.js";
import * as Constants from './Constants.js';

/**
 * @classdesc
 * This class implements a storage building, that can hold the parts of 
 * the items.
 * 
 * @class Storage
 * @extends Building
 * @constructor
 * @param {object} data this object is needed to render the workshop building.
 *    It contains the same parameters as the constructor of {@link Building}.
 */
class Storage extends Building
{
    constructor(data)
    {
        super(data);
        this.addClickListener(this.createDialogue);

        /**
         * This object keeps track of the parts that have been produced to indicate
         * how many parts are available to produce an item.
         * @type {object}
         */
        this.parts = {
            [Constants.PART_NAME_CHAIR_LEG]: 0,
            [Constants.PART_NAME_CHAIR_BACK]: 0,
            [Constants.PART_NAME_TABLE_LEG]: 0,
            [Constants.PART_NAME_TABLE_TOP]: 0,
            [Constants.PART_NAME_BED_FRAME]: 0,
            [Constants.PART_NAME_BED_TOP]: 0,
            [Constants.PART_NAME_BOOKCASE_LEG]: 0,
            [Constants.PART_NAME_BOOKCASE_TOP]: 0
        };
    }

    createDialogue()
    {
        this.scene.scene.launch('storageDialogue',
        {
            mainScene: this.scene,
            height: 500,
            width: 500,
            storage: this
        });
    }

    /**
     * This function checks if the available amount of parts inside the storage
     * is sufficient to build an item and builds it.
     */
    combineAvailable()
    {
        this.scene.items.forEach(item =>
            {
                if (this.parts[item.parts[0].name] >= item.parts[0].demand && this.parts[item.parts[1].name] >= item.parts[1].demand)
                {
                    this.emit('built'+item.branch, item);
                }
            }
        );
    }
}

export default Storage;