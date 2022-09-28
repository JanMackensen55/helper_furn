import {getScaling} from './Item.js';

/**
 * @classdesc
 * This class is responsible for displaying the items that will be produced next for  one workshop.
 * It displays the five next items. If the queue is longer than five, these items are invisible until they belong to the 
 * indices 0-4.
 * 
 * @class WorkshopQueue
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {object} data the data object that contains the required information to build the queue.
 * @param {Phaser.Scene} data.scene the scene where the queue should be rendered in. This is usually a [WorkshopDialogue]{@link WorkshopDialogue}.
 * @param {number} data.x the x coordinate where the queue is displayed in.
 * @param {number} data.y the y coordinate where the queue is displayed in.
 */
class WorkshopQueue extends Phaser.GameObjects.Container
{
    constructor(data)
    {   
        let {scene, x,y} = data
        let queue = scene.workshop.queue;
        let sprites = [];
        let spriteX = -125; // this is the location of the first image
        for (let i = 0; i < 5; i++)
        {
           
            // Pushing placeholders in form of invisible chairs to the list of sprites
            // this way it can be controlled, that only five items are shown inside the queue.
            sprites.push(new Phaser.GameObjects.Sprite(scene,spriteX,0, 'chair').setScale(getScaling('chair')).setAlpha(0));
            spriteX += 60; // To display the item side-by-side, the x coordinate is increased every iteration.
        }   
        
        super(scene,x,y,sprites);

        /**
         * This is a list of sprites.
         * Its size is always 5 corresponding to the maximum of visible values in this queue.
         * If the queue is smaller than 5, the rest of the items inside the sprite list will be set to invisible,
         * but they still use space. This ensures the stack-like behavior.
         * 
         * @type {Array.<Phaser.Sprite>}
         */
        this.sprites = sprites;

        /**
         * The queue is obtained from the {@link Workshop#queue}.
         * It is a list of objects that are structured the following way:
         * @type {Array.<object>}
         * @property {Process} process the production process of the item
         * @property {number} time the production duration that is reserved for the process.
         */
        this.queue = queue;

        /**
         * The scene where this object is rendered.
         * 
         * @see [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
         */
        this.scene = scene;
    }

    /**
     * Refresh the status of the queue.
     * This function iterates over the images and if there are items inside the queue,
     * it displays them by getting the imageCode and making them visible by setting alpha to 1.
     * If an item does not exist in the queue, it is set to transparent (= invisible).
     */
    update()
    {
        for (let i = 0; i < this.sprites.length; i++)
        {
            if (this.queue && this.scene.workshop.queue.length > 0)
            {
                if (this.queue[i])
                {
                    let imageKey = this.queue[i].process.item.imageCode;
                    this.sprites[i].setTexture(imageKey)
                    this.sprites[i].setScale(getScaling(imageKey));
                    this.sprites[i].setAlpha(1);
                }
                else this.sprites[i].setAlpha(0);
            }
            else this.sprites[i].setAlpha(0);
        }
    }
}

export default WorkshopQueue;
