import Panel from './Panel.js';

/**
 * @classdesc
 * This class implements a wrapper for dialogues. Such a dialogue usually consists of a frame where contents can be placed and a 
 * close button. This class also handels animations and appearance of the dialogue window and my be extended by 
 * every dialogue.
 * @class DialogueScene
 * @extends Phaser.Scene
 * @see [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 * @constructor
 * @param {String} sceneName The scene name is defined at creation of the scene and is used to find, launch or close the scene by the [SceneManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}.
 * 
 */
class DialogueScene extends Phaser.Scene
{
    constructor(sceneName)
    {
        super(sceneName);
        this.sceneName = sceneName
    }

    /**
     * The init function is as the scene is initialized. It is possible to pass additional data to the function that starts a scene (e.g. [launch]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html#launch__anchor}
     * [start]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html#start__anchor}). In this case the additional data is used to build a basic [panel]{@link DialogueScene#panel} that can be adopted by every class that is extending
     * this class.
     * @param {object} data the data object contains relevant data for this scene as well as additional data that can be used
     *  by the child scenes of this DialogueScene. See {@DialogueScene#data}.
     * @param {MainScene} data.mainScene The main scene of the game. This is useful, because this way a dialogue scene can read game related data directly form the scene.
     * @param {number} data.height The height of the dialogue.
     * @param {number} data.width The width of the dialogue.
     */
    init(data){
        /**
         * The main scene of the game. This is useful, because this way a dialogue scene can read game related data directly form the scene.
         * @type {MainScene}
         */
        this.mainScene = data.mainScene;

        /**
         * The height of the dialogue.
         * @type {number}
         */
        this.height = data.height;

        /**
         * The width of the dialogue.
         * @type {number}
         */
        this.width = data.width;

        /**
         * Additional data that can be used by child scenes. Some dialogueScenes my need more than just the main scene. This way 
         * the scene can be used more flexible. As an example: the {@link WorkshopDialogue} maintains an instance of the workshop,
         * to read the status and schedule building orders. The workshop can be passed as an entry in this data object.
         * @type {object}
         */
        this.data = data;
        
    }

    /**
     * This function creates a closing effect, animating the scale of the [panel]{@link DialogueScene#panel} to zero
     * within 150 milliseconds.
     * This function also stops the scene that is calling the function and enables the inputs of the main scene.
     */
    close()
    {
        this.tweens.add(
            {
                targets: this.panel,
                scale: 0,
                duration: 150,
                onComplete: function(){
                    this.parent.scene.scene.stop(this.sceneName);
                    this.parent.scene.mainScene.input.enabled = true;
                }
            });
        
    }


    /**
     * Creates a [panel]{@link DialogueScene#panel} that can be filled with content by every class inheriting from this class.
     * Note that the panel initially has a scale of zero causing the object to be invisible. The function [fadeIn]{@link DialogueScene#fadeIn}
     * can be used to make it appear. Alternatively the scale of the panel can be set to 1 manually.
     * This function also disables every input for the main scene, which means that the player cannot open new buildings or navigate through the map
     * as long as a dialogue is opened. The [close]{@link DialogueScene#close} function re-enables the inputs of the main scene.
     * @param {string} header the headline which will be displayed on top of the panel.
     */
    createDialogue(header='Header')
    {
        // disabling the inputs of the main scene.
        this.mainScene.input.enabled = false;

        /**
         * The panel which renders the frame and the headline.
         * @type {Panel}
         */
        this.panel = new Panel(
            {
                scene: this,
                x: 400,
                y: 300,
                width: this.width,
                height: this.height,
                header: header
            });
    }

    /**
     * This function is used to animate the appearance of the [panel]{@link DialogueScene#panel}, by animating its scale to 100%
     * within 150 milliseconds.
     * @param {function} [completeCallback] a function that is executed once the animation has finished.
     */
    fadeIn(completeCallback)
    {
        this.tweens.add(
            {
                targets: this.panel,
                scale: 1,
                duration: 150,
                onComplete: completeCallback,
                onCompleteScope: this
            });
    }
}
export default DialogueScene;