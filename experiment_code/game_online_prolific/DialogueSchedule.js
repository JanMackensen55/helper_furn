import DialogueScene from './DialogueScene.js'

/**
 * @classdesc
 * This class takes care of the dialogues that appear during the game. 
 * Dialogues inside this structure are displayed after each other to prevent 
 * dialogues from appearing at the same time. 
 * The dialogues that are added to the scheduler are organized as a list, that will be
 * worked off item per item. 
 * @class DialogueScheduler
 * @constructor
 * @param {Phaser.Scenes.ScenePlugin} scenePlugin the plugin that is needed to launch the dialogues.
 */
class DialogueSchedule
{
    constructor(scenePlugin)
    {
        /**
         * The scene plugin that is used to run the dialogues.
         * 
         */
        this.scenePlugin = scenePlugin;

        /**
         * An array of dialogues that are scheduled. They will be launched in its order.
         * @type {object[]}
         */
        this.dialogues = [];
        
        /**
         * The current dialogue that is opened at the moment.
         */
        this.currentDialogue;
    }

    /**
     * Add a dialogue to the scheduler. The dialogue will be added to the end
     * of the list.
     * @param {string} key the key for the sceneManager
     * @param {object} data the data that is needed to create the scene. See {@link DialogueScene}.
     * @param {boolean} [addToFront=false] if set to true, the dialogue will be added to the front of the list
     * instead of the end.
     */
    addDialogue(key, data, addToFront=false)
    {
        
        if (this.scenePlugin.manager.keys[key] instanceof DialogueScene)
        {
            if (addToFront)
            {
                 this.dialogues.unshift({key:key, data:data});
            } else 
            {
                this.dialogues.push({key: key, data:data});
            }
            
        }
        else throw "The given dialogue must inherit from \"DialogueScene\"!";
        
    }

    /**
     * Starts the the next dialogue from the list and removes the element.
     */
    startNextDialogue()
    {
        if (this.dialogues.length > 0)
        {
            let dialogue = this.dialogues.shift();
            this.scenePlugin.launch(dialogue.key, dialogue.data);
            this.currentDialogue = this.scenePlugin.get(dialogue.key);
            this.currentDialogue.events.once('dialogueClosed', () => {
                this.startNextDialogue();
            }, this);
        }
    }

    /**
     * Runs all scheduled dialogues until the [dialogues list]{@link DialogueSchedule#dialogues} is empty.
     */
    run()
    {
        this.startNextDialogue();
    }
}
export default DialogueSchedule;