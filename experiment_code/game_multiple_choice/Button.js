/**
 * @classdesc
 * This class represents a button that can be used in the game.
 * It provides a click animation as well as a text animation to show messages on click.
 * It extends a Phaser container, consider the [Phaser API page]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html} for more information.
 * 
 * @class Button
 * @extends Phaser.GameObjects.Container
 * @constructor
 * 
 * @param {Phaser.Scene} scene The scene to display the button in.
 * @param {Number} x the x coordinate of the button.
 * @param {Number} y the y coordinate of the button.
 * @param {String} buttonTexture the texture of the button.
 * @param {String} buttonTexturePressed The Picture of the button if it is pressed. 
 * @param {String} buttonImage the image key pointing to the image that should be shown inside the button. If no image has been
 *     found under this key, a text element is created instead with the provided from buttonImage.
 * @param {Function} callback the function that should be called if 
 * the button has been clicked.
 * @param {Object} context the context where the callback function should act inside.
 * @param {String} [tooltipText] if a tooltipText is provided it gets displayed in a tooltip above the button, if the pointer 
 *     hovers over it. If not provided, no tooltip will be shown.
 *
 */
 
class Button extends Phaser.GameObjects.Container
{

    constructor(scene, x ,y, buttonTexture, buttonTexturePressed, buttonImage, callback, context ,tooltipText=undefined)
    {
        let texture = new Phaser.GameObjects.Sprite(scene,0 ,0, buttonTexture);
        let image = new Phaser.GameObjects.Sprite(scene,0 ,0, buttonImage);
        if (image.texture.key === '__MISSING')
        {
            // If no image has been found, create a text.
            image = new Phaser.GameObjects.Text(scene,0,0, buttonImage, {fontSize:20*Constants.SCALING,color: '#FFFFFF'}).setOrigin(0.5);
        }
        let initImageY = image.y; // is used for click animation.

        // Pack the resources above inside a container
        super(scene, x, y, [texture,image]);
        
        /**
         * The scene where the button should be placed in.
         * 
         * @type {Phaser.Scene}
         */
        this.scene = scene;
        
        /**
         * The X-Coordinate for the message that is animated after button click.
         * By default the message emerges from the middle of the button.
         * 
         * @type {Number}
         * @default 0
         */
        this.messageOffsetX = 0; 

        /**
         * The callback function, that will be called after button click.
         * 
         * @type {Function}
         */
        this.callback = callback;

        /**
         * The context to run the callback function in.
         * It should contain all elements that the callback function needs.
         * Often the context is just the calling class instance.
         * 
         * @type {Object}
         * @example
         * // callback function
         * button.callback = function()
         * {
         *     console.log('Hello ' + this.str);
         * }
         * // This function can be run and in the context we can specify the str element.
         * // If the context was like this
         * button.context = {str: 'World'};
         * button.callback() // ==> 'Hello World'
         * 
         */
        this.context = context;

        /**
         * The texture of the button.
         * This can be seen as the background image of the button.
         * This is a string, pointing to a key inside the texture manager of the phaser engine.
         * Hence, it is the string that is defined in the {@link Preloader} class from the image path.
         * 
         * @type {String}
         * 
         */
        this.texture = texture;

        /**
         * The image that will be located inside the button.
         * This is a string that can be defined in the {@link Preloader} class.
         * 
         * @type {String}
         */
        this.image = image;
        // We need to set a size to the conatiner in order to ensure the whole button is clickable
        this.setSize(texture.width, texture.height);

        // enabling input options and listeners on the button
        this.texture.setInteractive();
        if (tooltipText) this.setTooltip(tooltipText);

        // If pressing the mouse down on the button
        this.texture.on('pointerdown', function()
        {
            // Make the button appear pressed. 
            // It is accessed via the list of the container, so we must
            // ensure that we are targeting the button texture
            // we use 0, because we have initialized the button above with the 
            // buttonTexture first, so it will be our first element, instead of
            // the image.
            texture.setTexture(buttonTexturePressed);

            // Move the image on the button a bit down to create the illusion
            // that the button has been pressed.
            image.y += 3; 

            // If the mouse button is released over the button
            // This call must be listened only once, otherwise it will stack up its triggers after several clicks.
            this.texture.once('pointerup', this.callback, this.context);

            // If the mouse button is released anywhere.
            // This ensures that the texture is always reset,
            // even if the mouse is no longer over the button.
            this.scene.input.once('pointerup', function()
            {
                // reset the textures and place the image to its original position
                texture.setTexture(buttonTexture);
                image.y = initImageY;
            });
        }, this);
    }

    /**
     * Scale the button texture. 
     * This does not affect the image inside the button.
     * You can call the {@link Button#setImageScale} function for this sake.
     * @param {Number} scale the target scale of the button texture.
     */
    setButtonScale(scale)
    {
        this.texture.setScale(scale);
    }

    /**
     * Scale the image inside the button. Does not affect the button scale.
     * @param {Number} scale the target scale of the image.
     */
    setImageScale(scale)
    {
        this.image.setScale(scale);
    }

    /**
     * This function displays a message at the location of the button.
     * It can be used to inform the player if an item has been built successfully.
     * This function automatically invokes an animation of the text, gliding to the top
     * and triggering the closeMessage function to fade out the text object.
     * @param {String} text The text that should be displayed to the user.
     * @param {boolean} [alert=false] A boolean. By default it is false causing the text to be black.
     *      If set to true, the text is red. In the game this is used to inform the player about an error like
     *      missing material.
     *                      
     */
    showMessage(text, alert=false)
    {
        let message = new Phaser.GameObjects.Text(this.scene, this.messageOffsetX,0, '', {fontSize:19*Constants.SCALING,color: '#FFFFFF'}).setOrigin(0.5,0.5);
        if(alert){message.setColor('#FF0000');}
        message.alpha = 0;
        message.text = text;
        this.add(message);

        this.scene.tweens.add(
            {
                targets: [message],
                alpha: 1,
                y: message.y -30,
                duration: 300,
                ease: Phaser.Math.Easing.Sine.Out,
                onComplete: function()
                    {
                        this.targets[0].parentContainer.closeMessage(this.targets[0]);
                    }

            });
    }

    /**
     * This method closes the given message by animating its fadeout.
     * @param {Object} message the text object to be closed
     */
    closeMessage(message)
    {
     
        this.scene.tweens.add(
            {
                targets: [message],
                alpha: 0,
                y: message.y - 30,
                duration: 1000,
                ease: Phaser.Math.Easing.Linear,
                onComplete: function(){message.destroy();} // delete the message object

            });
    }

    /**
     * Sets the same origin for the button texture and the button image.
     * The origin indicates the offset of the game object from the given position
     * 
     * @param {Number} x The origin value on the x axis.
     * @param {Number} [y=x] The origin value for the y axis
     * @example button.setOrigin(0.5) // Positions the middle of the sprite at its given x-and y coordinate.
     */
    setOrigin(x, y)
    {
        if (!y) y = x;
        this.texture.setOrigin(x,y);
        this.image.setOrigin(x,y);
    }

    /**
     * Specifies the callback function to change it later.
     * @param {function} func the callback function which will be triggered
     *     after a click.
     */
    setCallbackFunction(func)
    {
        this.callback = func;
    }

    /**
     * Specify the context for the callback function
     * @param {Object} context the context as an object containing a scene, a button object and an item (part) see {@link Button#context}.
     */
    setContext(context)
    {
        this.context = context;
    }

    /**
     * This function adds a tooltip to the button, that will be displayed, if the cursor hovers over it.
     * @param {String} text The text that should be displayed inside the tooltip.
     */
    setTooltip(text)
    {
        this.tooltip = new Phaser.GameObjects.Sprite(this.scene, 0, -this.texture.displayHeight, 'tooltip').setOrigin(0.5, 0.7).setScale(1.5);
        this.tooltipText = new Phaser.GameObjects.Text(this.scene, this.tooltip.x, this.tooltip.y, text, {fontSize:18*Constants.SCALING,color: '#FFFFFF'}).setOrigin(0.5,1.7);
        this.tooltip.alpha = 0;
        this.tooltipText.alpha = 0;
        this.add([this.tooltip, this.tooltipText]);
        this.texture.on('pointerover', function()
        {
            this.scene.tweens.add(
                {
                    targets: [this.tooltip, this.tooltipText],
                    alpha: 1,
                    duration: 200
                }
            );
        }, this);
        this.texture.on('pointerout', function()
        {
            this.scene.tweens.add({
                targets: [this.tooltip, this.tooltipText],
                alpha: 0,
                duration: 500
            });
        },this);
    }
}
export default Button;