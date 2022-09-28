
/**
 * @classdesc
 * This class implements a basic panel that acts as a frame for every dialogue.
 * It is use by the {@link DialogueScene} which gives the functionality to its child classes.
 * These classes then add their elements to this panel, which ensures that all the elements
 * are located relatively to the panel. 
 * 
 * @class Panel
 * 
 * @constructor
 * @param {object} data the data that is used by the constructor to create the panel.
 * @param {Phaser.Scene} data.scene the scene where the panel should be placed. See [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 * @param {Number} data.x the x coordinate where the panel should be displayed. 
 * @param {Number} data.y the y coordinate for the panel.
 * @param {Number} data.width the width of the panel.
 * @paran {Number} data.height defines the height of the panel.
 * @param {String} data.header defines the headline of the dialogue.
 */
class Panel extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x, y, width, height, header} = data;
        let panel = new Phaser.GameObjects.Sprite(scene, 0,0, 'panel');
        let contents = new Phaser.GameObjects.Sprite(scene, -1,-5, 'panel_beige');
        panel.displayWidth = width; 
        panel.displayHeight = height; 
        contents.displayHeight = panel.displayHeight - 50;
        contents.displayWidth = panel.displayWidth - 70;
        let buttonRound = new Phaser.GameObjects.Sprite(scene, panel.x-40+panel.displayWidth/2, panel.y+20-panel.displayHeight/2, 'round-button').setOrigin(0,0.5).setScale(1.5);
        let cross = new Phaser.GameObjects.Sprite(scene, buttonRound.x,buttonRound.y, 'cross').setOrigin(-0.6,0.5).setScale(1.5);
        let headerText = new Phaser.GameObjects.BitmapText(scene, panel.x, contents.y-contents.displayHeight/2, 'pressstart', header, 12, Phaser.GameObjects.BitmapText.ALIGN).setOrigin(0.5, -2);
        super(scene,x,y,[panel, contents, buttonRound, cross, headerText]);
        scene.add.existing(this);
        this.setScrollFactor(0);
        buttonRound.setInteractive();
        buttonRound.once('pointerdown', function(){
            this.scene.close();
        });

        /**
         * This is the main frame of the panel, realized as a brown window. This is later be filled
         * by a [contents]{@link Panel#contents} object, acting as a paper on top of the brown frame.
         * 
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.panel = panel;

        /**
         * This is a round button that can be used to close the panel.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.buttonRound = buttonRound;

        /**
         * The cross is inside the [buttonRound]{@link Panel#buttonRound} and helps the button to look like a typical close button.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.cross = cross;

        /**
         * The contents sprite is on top of the [panel]{@link Panel#panel} and looks like paper.
         * @type {Phaser.GameObjects.Sprite}
         * @see [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}
         */
        this.contents = contents;

        /**
         * The scale of the panel. This value is used to animate its appearance. Initially the scale is 0 hence, the
         * panel is not visible. With the [fadeIn]{@link DialogueScene#fadeIn} function the value is used to create an opening animation.
         * 
         * @type {number}
         */
        this.scale = 0;

        /**
         * The text container that displays the headline on top of the dialogue panel.
         * @type {Phaser.GameObjects.BitmapText}
         * @see [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html}
         */
        this.headerText = headerText;
    }

    /**
     * Adjust the font size of the header
     * @param {Number} size the new fontsize the header should get
     */
    set headerSize(size)
    {
        this.headerText.fontSize = size;
    }

    /**
     * Hides the close button to prevent the player from closing the panel.
     */
    disableCloseButton()
    {
        this.buttonRound.setVisible(false);
        this.cross.setVisible(false);
    }

}

export default Panel;