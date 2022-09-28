import DialogueScene from './DialogueScene.js';
/**
 * @classdesc
 * This class extends the classical DialogueScene to an interaction scene
 * that can be used for the story of the game. It is designed for questions or notifications 
 * of the experiment.
 * If an InteractionScene is started, the game time will be stopped and also the 
 * inputs of the {@link Ui}-scene will be blocked.
 * @class InteractionScene
 * @extends DialogueScene
 * @constructor
 * @param {String} sceneName The scene name is defined at creation of the scene and is used to find, launch or close the scene by the [SceneManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}.
 * 
 */
class InteractionScene extends DialogueScene
{
    constructor(sceneName)
    {
        super(sceneName);
    }

    /**
     * Creates the dialogue like and behaves like a normal {@link DialogueScene} but additionally stops the 
     * gametime and disables the input of the {@link Ui}.
     * @param {String} header  the headline of the scene.
     */
    createDialogue(header="Header")
    {
        // behave like a normal DialogueScene
        super.createDialogue(header);
        // disable inputs for the ui scene
        this.scene.manager.keys.ui.input.enabled = false;
        this.mainScene.timer.paused = true;
    }

    /**
     * Override the close function from the [DialogueScene]{@link DialogueScene#close} to 
     * resume the game time
     */
    close()
    {
        super.close()
        this.mainScene.timer.paused = false;
    }
}

export default InteractionScene;