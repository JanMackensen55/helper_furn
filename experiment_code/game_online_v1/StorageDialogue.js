import DialogueScene from "./DialogueScene.js";
import StoragePanel from "./StoragePanel.js";
import {SOUND_VOLUME} from './Constants.js';

/**
 * @classdesc
 * This class creates the scene containing the StoragePanel.
 * It can also be used to update the StoragePanel.
 * 
 * @class StorageDialogue
 * @extends DialogueScene
 */
export default class StorageDialogue extends DialogueScene
{
    constructor()
    {
        super('storageDialogue');
    }

    /**
     * creates the scene with the StoragePanel.
     */
    create()
    {
        this.storage = this.data.storage;
        this.sound.setVolume(SOUND_VOLUME);
        this.errorSound = this.sound.add('error');
        this.createDialogue(this.storage.name);
        this.storagePanel = new StoragePanel(
            {
                scene: this,
                x: 0,
                y: -65,
                items: this.mainScene.items
        
            });
            this.panel.headerSize = 15;
        this.panel.add(this.storagePanel);
        this.fadeIn();
        if (this.mainScene.tutorialPhase) this.panel.buttonRound.disableInteractive();
    }

    /**
     * updates the StoragePanel
     */
    update()
    {
        this.storagePanel.entries.map(entry => entry.updateItemDisplay());
    }
}