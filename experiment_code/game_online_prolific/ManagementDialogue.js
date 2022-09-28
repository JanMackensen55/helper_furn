import {SOUND_VOLUME, PRODUCE_PARTS, PRODUCE_IN_MANAGEMENT} from './Constants.js';
import DialogueScene from './DialogueScene.js';
import ItemPanel from './ItemPanel.js';

/**
 * @classdesc
 * This is the Dialogue that appears if a [Management Building]{@link Management} has been clicked by the player.
 * Its main task is to render a [Panel]{@link Panel}, that informs about buildable [Items]{@link Item}, its costs and profits.
 * To display the Items it initiaties an ItemPanel.
 * If the options [PRODUCE_PARTS]{@link module:GameProperties#PRODUCE_PARTS} and [PRODUCE_IN_MANAGEMENT]{@link module:GameProperties#PRODUCE_IN_MANAGEMENT} are active,
 * the panel gets pushed to the left in order to display additional building opions.
 * @class ManagementDialogue
 * @extends DialogueScene
 * @constructor
 */
class ManagementDialogue extends DialogueScene
{
    constructor()
    {
        super('managementDialogue');
    }
    /**
     * This function is always run after a scene is started.
     * It creates the resources that are needed to display and handel the dialogue.
     */
    create()
    {
        // We set the volume of the sound globally.
        this.sound.setVolume(SOUND_VOLUME);
        
        /**
         * Adds the clicksound, which was loaded by the {@link Preloader} to the scene.
         * The sound is added using phasers [BaseSoundManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSoundManager.html#add}
         * @type {Phaser.Sound.BaseSound}
         */
        this.clickSound = this.sound.add('click');
        
        /**
         * Adds the errorsound, which was loaded by the {@link Preloader} to the scene.
         * The sound is added using phasers [BaseSoundManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSoundManager.html#add}
         * @type {Phaser.Sound.BaseSound}
         */
        this.errorSound = this.sound.add('error');

        // We set the images of items to facilitate the display. This way is just used by the management dialogue.
        this.mainScene.chair.image = new Phaser.GameObjects.Sprite(this, 0,0, 'chair').setScale(0.2).setOrigin(-0.3,0.5);
        this.mainScene.table.image = new Phaser.GameObjects.Sprite(this, 0,0, 'table').setScale(0.05).setOrigin(-0.3,0.5);
        this.mainScene.bed.image = new Phaser.GameObjects.Sprite(this, 0,0, 'bed').setScale(0.15).setOrigin(-0.3,0.5);
        this.mainScene.bookcase.image = new Phaser.GameObjects.Sprite(this, 0,0, 'bookcase').setScale(0.4).setOrigin(-0.3,0.5);

         /**
         * A management instance, which is the management that has been clicked.
         * This makes sure, that all actions taken in this scene affect the right management building.
         * 
         * @type {Management}
         */
        this.management = this.data.management;
        this.createDialogue(this.management.name);
        this.panel.headerSize = 16;
        if (PRODUCE_PARTS)
        {
            this.panel.x -= 120;
        }

        /**
         * The ItemPanel here organizes the items that should be displayed in this management.
         * 
         * @type {ItemPanel}
         */
        this.itemPanel = new ItemPanel({
            scene: this,
            x: 0,
            y: -10,
            items: this.management.items
        });
        this.panel.add(this.itemPanel);
        this.fadeIn();
        if (this.mainScene.tutorialPhase) this.panel.buttonRound.disableInteractive();
    }

    /**
     * This function is called after every frame, updating the queue status of the workshop and the progressbars
     */
    update()
    {
        this.itemPanel.list.forEach((item) =>
            {
                item.updatePrice();
            });
    }
}

export default ManagementDialogue;