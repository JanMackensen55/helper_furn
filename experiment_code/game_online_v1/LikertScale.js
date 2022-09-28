/**
 * @classdesc
 * This class implements a labeled Likert scale, displaying
 * radio buttons that can be checked. Depending on the checked button
 * the scales returns a different score.
 * @class LikertScale
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the LikertScale should be displayed.
 * @param {Number} data.x Position of the LikertScale on the x axis
 * @param {Number} data.y Position of the LikertScale on the y axis
 */
class LikertScale extends Phaser.GameObjects.Container
{
    constructor(data)
    {
        let {scene, x, y} = data;
        let value;
        let responses = ['sehr schlecht', 'eher schlecht', 'eher gut', 'sehr gut', 'keine Ahnung'];
        // create five radio buttons and corresponding texts
        let buttons = [];
        let texts = [];
        let initX = -210;
        for (let i=0; i <5; i++)
        {
            if (i != 4){
                value = i+1;
            } else value = -1;
            buttons.push(new RadioButton({scene:scene, x:initX, y:0, value}).setScale(0.8));
            texts.push(new Phaser.GameObjects.Text(scene, initX, -25, responses[i], {fontSize: 12, color: "#000"}).setOrigin(0.5,0.5));
            initX += 110;
        }
        
       super(scene,x,y,buttons.concat(texts));
       this.activeButton;
       this.buttons = buttons;
       this.addCheckedListeners();
    }
    /**
     * Uncheck the other buttons to ensure that only one radioButton is checked at the same time.
     * @param {RadioButton} exception the button that should not be unchecked (which is the button that was
     * recently clicked).
     */
    uncheckButtons(exception)
    {
        this.activeButton = exception;
        this.buttons.map(x => 
            {
                if(x !== exception){
                    x.isChecked = false;
                }
            });
    }

    /**
     * Adds a checked listener for each radio button.
     * This helps to identify which button has been clicked. This information is used to unceck the other buttons
     * that might be active. With this method it is ensured, that only one radio button at a time is checked.
     */
    addCheckedListeners()
    {
        this.buttons.forEach(button =>
            {
                button.on('buttonChecked', this.uncheckButtons,this)
            });
    }

    /**
     * Return the value of the active {@link RadioButton} which corresponds to the response of the subject.
     * @returns {number} the value of the subject's response. 
     */
    getValue()
    {
        if (this.activeButton){
            return this.activeButton.value;
        } else return undefined;

    }
}
export default LikertScale;

/**
 * @classdesc
 * A radio button that behaves like a html radio button: it can be checked or unchecked. If a radio button is 
 * checked it cannot be unchecked again.
 * @class RadioButton
 * @extends Phaser.GameObjects.Sprite
 * @constructor
 * @param {Phaser.Scene} data.scene the Phaser scene where the RadioButton should be displayed.
 * @param {Number} data.x Position of the diagram on the x axis
 * @param {Number} data.y Position of the diagram on the y axis
 * @param {Number} data.value Value of the button
 */
class RadioButton extends Phaser.GameObjects.Sprite
{
    constructor(data)
    {
        let {scene, x,y, value} = data;
        super(scene,x,y,'radio-button');
        this.value = value;
        this._isChecked = false;
        this.setInteractive();
        this.on('pointerdown', () => {

            this.once('pointerup', () =>{
                if (!this.isChecked)
                {
                    this.isChecked = true;
                    this.emit('buttonChecked', this);
                } 
            },this);
        },this)
    }

    /**
     * The setter for the isChecked value. Setting this value to the desired state
     * also changes the texture.
     * @param {boolean} value true if the button is checked, false to uncheck the button.
     */
    set isChecked(value)
    {
        this._isChecked = value;
        if (this._isChecked)
        {
            this.setTexture('radio-button-checked');

        } else this.setTexture('radio-button');
    }

    /**
     * Return the state of the button.
     * @returns {boolean} true if the radio button is checked.
     */
    get isChecked()
    {
        return this._isChecked;
    }
}