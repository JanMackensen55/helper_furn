/**
 * @classdesc
 * A message that fades into the screen and guides the player through the tutorial
 * @class InformerBanner
 * @extends Phaser.GameObjects.Container
 * @see [Phaser.GameObjects.Container]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}
 * @constructor
 * @param {Phaser.Scene} scene the Phaser scene where the InformerBanner should be displayed. This is usually a {@link MainScene}.
 * @param {Number} x Position of the diagram on the x axis
 * @param {Number} y Position of the diagram on the y axis
 * @param {String} text The text to be displayed in the banner
 */
class InformerBanner extends Phaser.GameObjects.Container
{
    constructor(scene, x, y, text)
    {
        let background = new Phaser.GameObjects.Sprite(scene,0,0, 'banner');
        let textField = new Phaser.GameObjects.Text(scene,0,0,text,{fontSize: 17, color: '#000', wordWrap: {width: 620, useAdvancedWrap: true}}).setOrigin(0.5);
        super(scene,x,y,[background,textField]);
        this.background = background;
        this.textfield = textField;
        this.setScale(1.1);
        this.background.displayWidth = 750;
        this.setSize(background.displayWidth, background.displayHeight);
    }

    set text(text)
    {
        this.textfield.setText(text);
    }

}
export default InformerBanner;
