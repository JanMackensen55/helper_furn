import MainScene from './MainScene-2.js';
import TextDialogue from './TextDialogue.js';
import {WIDTH, HEIGHT, SCALING, AUTOSCALING} from './Constants.js';
/**
 * This module starts the game by applying the configuration of the game and launching the [preloader]{@link Preloader} scene.
 * To run the game, this module has to be embedded in an html page, like shown in the example. After that the html document can be 
 * hosted on a webserver and launched, if the page is loaded.
 * 
 * IMPORTANT: This is the second version of the game. The only difference between the two versions is which MainScene they call (MainScene, MainScene-2).
 * The only difference between the two MainScenes is that they load different linear problems to create the tasks.
 * 
 * @example  <caption> How to add the game to an HTML-document: </caption> {@lang xml}
 * <html>
 * <head>
 *      <script type="module" src="Game.js"></script> <!-- loads the game into the web page -->
 * </head>
 * <body>   
 *      <!-- inside this div the game is rendered. Hence, the id must match the parent field inside the config object. -->
 *      <div id="can">
 *      </div>
 *      <textarea id="textarea" placeholder="Antwort hier eingeben..." ></textarea> <!-- This is the textarea for user text input -->
 * </body>
 * </html>
 * @module Game
 */

// hide the text area, since it is not needed yet
let textarea = document.getElementById('textarea');
textarea.style.display = 'none';

if (AUTOSCALING){ // If the player can afford the position, permit.
    var scalingMode = Phaser.Scale.FIT;
}
else{
    var scalingMode = Phaser.Scale.NONE;
}
/**
 * The configuration that defines how the game is started.
 * @property {number} type defines if WebGL should be used. The AUTO setting detects if the browser is capable of WebGL and runs it, if possible. See [AUTO]{@link https://photonstorm.github.io/phaser3-docs/Phaser.html#.AUTO__anchor}
 * @property {number} width the width of the game canvas.
 * @property {number} height the height of the game canvas.
 * @property {string} backgroundColor the standard background color of the canvas.
 * @property {boolean} pixelArt automatically applies a linear filter to the game to prevent blurry scaling effects. See [pixelArt]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Core.Config.html#pixelArt__anchor}
 * @property {string} parent the canvas where the game should be rendered. It can be the id of an HTML div as shown in the example above.
 * @property {object} physics sets the physics for the game. These values are not critical in this context.
 * @property {array} scene in this field all scenes are stored. As the game runs, all scenes are initialized and the key of the scenes gets stored inside
 * @property {object} scale determines on a global level how all elmenete of the game are scaled and thus enables an automatic scaling of the game
 * the global [SceneManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.SceneManager.html}. The first element in this list is the [Preloader]{@link Preloader} scene that loads
 * all required assets for the game.
 */
const config = {
    type: Phaser.AUTO,
    width: WIDTH*SCALING,
    height: HEIGHT*SCALING,
    backgroundColor: '#333333',
    pixelArt: true,
    parent: 'can',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        parent: 'can',
        mode: scalingMode,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH*SCALING,
        height: HEIGHT*SCALING
    },
    
    scene: [MainScene, TextDialogue]
};

/**
 * The game instance. We do not need to do much with it since the constructor takes care of starting the game.
 */
var game = new Phaser.Game(config);


