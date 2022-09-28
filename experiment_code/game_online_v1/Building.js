import EventDispatcher from './EventDispatcher.js';
import {ON_LOCAL_MACHINE} from './Constants.js';
/**
 * @classdesc
 * This class implements a superclass for implementing different buildings.
 * It handels renders an image of a building, takes care of the positioning
 * and implements a click listener.
 * 
 * @class Building
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {object} data an object that stores the information needed to build this class. 
 * @param {Phaser.Scene} data.scene the scene where the management building should be built in. See [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 * @param {Number} data.x the x coordinate where the building should be placed. 
 * @param {Number} data.y the y coordinate for the building.
 * @param {String} data.image the image key of the building.
 * @param {String} data.name the name of the building. 
 */
class Building extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, image, x, y, name} = data;
        // We need the camera to scale the gameobjects with the zoom amound of the camera object.
        let camera = scene.cameras.main;
        let buildingSprite = new Phaser.GameObjects.Sprite(scene, 0/camera.zoom, 0/camera.zoom, image);
        buildingSprite.setScale(1.3);
        let tooltip = new Phaser.GameObjects.Sprite(scene,buildingSprite.x,buildingSprite.y-buildingSprite.height,'tooltip').setScale(1.5);
        tooltip.displayWidth = 200;
        tooltip.alpha = 0;
        let tooltipText = new Phaser.GameObjects.Text(scene, tooltip.x,tooltip.y, name,{fontSize:22,color: '#fff'}).setOrigin(0.5,0.5);
        tooltipText.alpha = 0;
        let sign = new Phaser.GameObjects.Sprite(scene,0,0,'');
        sign.alpha = 0;
        super(scene, x / camera.zoom, y / camera.zoom, [sign,tooltip, tooltipText, buildingSprite]);
        /**
         * The name of the Building. This is also the name that is displayed in the [tooltip]{@link Building#tooltip}.
         * @type {String}
         */
        this.name = name;

        /**
         * A sign that can be placed beneath a building
         */
        this.sign = sign;

        /**
         * The sprite that renders the building. See [Phaser.GameObjects.Sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html}.
         * 
         * @type {Phaser.GameObjects.Sprite}
         */
        this.buildingSprite = buildingSprite;

        /**
         * The Scene where the building should be rendered in.
         * In this case this is usually the {@link MainScene}.
         * @see [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * This is the tooltip object that is triggered if the cursor is on the building.
         * 
         * @type {Phaser.GameObjects.Sprite}
         */
        this.tooltip = tooltip;

        /**
         * The text that should be inside the tooltip. 
         * It contains the [name]{@link Building#name} of the building.
         * 
         * @type {Phaser.GameObjects.BitmapText}
         */
        this.tooltipText = tooltipText;

        /**
         * The Emitter is an instance of the EventDispatcher and is used to record the actions
         * performed by the user. In the case of buildings, we always want to record which building 
         * has been opened by the player.
         * @type {EventDispatcher}
         */
        this.emitter = EventDispatcher.getInstance();

        this.setSize(buildingSprite.width, buildingSprite.height);

        /**
         * The image [sprite]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html} of the building
         * @type {Phaser.GameObjects.Sprite}
         */
        this.image = image;
        // Making the building clickable
        this.setInteractive();
        this.addPointerListeners();
        // Ensure that the building moves with the same velocity as the camera.
        this.setScrollFactor(camera.zoom);
        // Add the building to the scene.
        this.scene.add.existing(this);
        if (this.scene.tutorialPhase) this.disableInteractive();

    }


    /**
     * Adds a listener that reacts on a click on the object.
     * This is used for triggering a dialogue if a specific building is clicked.
     * The function to initiate the individual dialogue must be passed by the instance.
     * @param {function} func the function that should be triggered, after the object as been clicked.
     */
    addClickListener(func)
    {
        this.on('pointerdown', function(pointer){
            this.once('pointerup', () =>
            {
                this.emitter.emit('buildingClicked', this.name);
            });
            this.once('pointerup', func);
        });
    }

    /**
     * Adds pointer events to toggle the display of the [tooltip]{@link Building#tooltip} 
     * if the pointer is hovering over a building.
     * It will fade in the tooltip if the cursor is above and fade it out if the cursor leaves the 
     * building.
     * 
     */
    addPointerListeners()
    {
        this.on('pointerover', function()
        {
            
            this.scene.tweens.add({
                targets: [this.tooltip, this.tooltipText],
                alpha: 0.9,
                duration: 200
            });
            
           
        });
        this.on('pointerout', function()
        {
            
            this.scene.tweens.add({
                targets: [this.tooltip, this.tooltipText],
                alpha: 0,
                duration: 500
            });

        });
    }

    /**
     * Add a flash effect to the building to highlight it for the tutorial.
     */
    addFlashEffect()
    {
       
        this.buildingSprite.setTint(0xffff00);
        this.flashEffect = this.scene.tweens.add({
            targets: this.buildingSprite,
            scale: 1.5,
            ease: 'Cubic.easeOut',  
            duration: 300,
            loop: -1,
            yoyo: true
            });
    }

    /**
     * Stop the flash effect.
     */
    stopFlashEffect()
    {
        this.buildingSprite.clearTint();
        this.flashEffect.loop = 0
        this.flashEffect.loopCounter = 0;
    }
}
export default Building;