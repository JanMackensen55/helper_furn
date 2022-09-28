import ProgressBar from "./ProgressBar.js";
import Button from './Button.js';
import EventDispatcher from "./EventDispatcher.js";
import {WARNINGS_AT_SKIP} from "./Constants.js";

/**
 * This class implements a UI scene as a top bar, that shows available material, the actual month and 
 * the time until the next month.
 * @class Ui
 * @extends Phaser.Scene
 */
class Ui extends Phaser.Scene
{
    constructor()
    {
        super('ui');
    }

    /**
     * The function is called if the scene is launched. The data is passed with the function that starts this scene.
     * @see [Launching a Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scenes.ScenePlugin.html#launch__anchor}
     * @param {object} data the data that is passed to the scene.
     * @param {Player} data.player the player instance that is used to display the available material and money.
     * @param {MainScene} data.mainScene the mainScene. This instance is used to display the time that is left.
     */
    init(data)
    {
        /**
         * The player instance.
         * @type {Player}
         */
        this.player = data.player;

        /**
         * The main scene to get infromation from.
         * @type {MainScene}
         */
        this.mainScene = data.mainScene;

        /**
         * An event dispatcher which is used to record when the player skips a month.
         */
        this.emitter = EventDispatcher.getInstance();
    }
    
    
    /**
     * This function renders the information inside the scene.
     */
    create()
    {
        this.add.image(400,0,'ui-panel').setOrigin(0.5,0.2);

        // Profit
        this.uiProfit = this.add.text(20,0, this.player.money, {fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        this.gold = this.add.image(this.uiProfit.x + this.uiProfit.width, this.uiProfit.y, 'gold').setOrigin(0,0.1).setScale(2);
        // Available Wood
        this.uiWood = this.add.text(150, 0,'',{fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        this.wood = this.add.image(this.uiWood.x+this.uiWood.width, this.uiWood.y, 'wood').setOrigin(-0.3,0).setScale(0.05);
        // Avaiable Metal
        this.uiMetal = this.add.text(270, 0, '', {fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        this.metal = this.add.image(this.uiMetal.x+this.uiMetal.width, this.uiMetal.y, 'metal').setScale(0.05).setOrigin(-0.1,0);
        this.monthText = this.add.text(500, 0, '', {fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        this.monthProgress = new ProgressBar(
            {
                scene: this.mainScene,
                x: this.monthText.x+120,
                y: 12,
                width: 100
            });
        this.monthTextNext = this.add.text(this.monthProgress.x+120, 0,  '', {fontSize:20,color: '#000'}).setOrigin(0,-0.2);
        this.monthProgress.setScale(1,0.5);
        this.setupSkipButton();
        this.audioButton = new Phaser.GameObjects.Sprite(this,770,50,'audio-on').setScale(0.3);
        this.audioButton.setInteractive();
        this.audioOn = true;
        this.audioButton.on('pointerdown', (pointer) =>
        {
            this.audioButton.once('pointerup', () =>
            {
                this.audioOn = !this.audioOn;
                if (this.audioOn)
                {
                    this.audioButton.setTexture('audio-on');
                    this.scene.manager.game.sound.mute = false;
                } else
                {
                    this.audioButton.setTexture('audio-off');
                    this.scene.manager.game.sound.mute = true;
                }
                this.emitter.emit('toggledAudio',this.audioOn);
            },this);
        });
        this.add.existing(this.audioButton);
        
        this.add.existing(this.monthProgress);
        this.emitter.emit('uiReady', this);
        this.emitter.on("clickedYes", this.proceed.bind(this));
    }

    update()
    {
        
        this.uiProfit.text = this.player.money;
        this.gold.x = this.uiProfit.x+this.uiProfit.width;
        this.uiWood.text = this.player.availableWood[this.mainScene.month.value];
        this.wood.x = this.uiWood.x+this.uiWood.width;
        this.uiMetal.text = this.player.availableMetal[this.mainScene.month.value];
        this.metal.x = this.uiMetal.x+this.uiMetal.width;
        this.monthProgress.setMeterPercentage(this.mainScene.timer.elapsed/this.mainScene.timer.delay);
        if (this.mainScene.month.done)
        {
            this.monthText.text = 'Fertig!';
            
        }else
        {
            this.monthText.text = 'Monat: '+ Number(this.mainScene.month.value+1);
        }
        if (this.mainScene.month.value < 11)
        {
            this.monthTextNext.text = Number(this.mainScene.month.value+2);
        }else
        {
            this.monthTextNext.text = '';
        }
       
    }

    /**
     * This function initiates the button that is used to skip the month.
     */
    setupSkipButton()
    {
        this.skipButton = new Button(this, this.monthText.x, this.monthText.y, 'button-square-unpressed', 'button-square', 'right',this.skipMonth, this, 'Zum nächsten\nMonat');
        this.skipButton.texture.displayWidth += 5;
        this.skipButton.texture.setScale(0.45);
        this.skipButton.image.setScale(0.25);
        this.skipButton.x += 280;
        this.skipButton.y += 10;
        this.add.existing(this.skipButton);
    }

    /**
     * This function is invoked, when the skip button is pressed.
     */
    skipMonth()
    {
        let month = this.mainScene.month.value;
        let text;
        if (WARNINGS_AT_SKIP)
        {
            if (this.mainScene.getProductionStatus() == 1)
            {
                text = "Im Moment sind noch Werkstätten aktiv. Wenn du jetzt zum nächsten Monat springst, werden die laufenden Produktionen abgebrochen. Bist du dir sicher?";
                this.mainScene.scene.launch('warningDialogue', {mainScene: this.mainScene, title: 'Achtung!', text: text});
                return false;
            }
            else if (this.player.monthlyProfit[month] == 0)
            {
                text = "Du hast in diesem Monat noch nichts gebaut. Bist du dir sicher, dass du zum nächsten Monat springen willst?";
                this.mainScene.scene.launch('warningDialogue', {mainScene: this.mainScene, title: 'Achtung!', text: text});
                return false
            }

        }
        this.proceed();
        
    }

    /**
     * If the player has agreed on the skip month dialogue or everything is set to skip the month,
     * it will executed, ending the tutorial - if any - and proceeding to the next month.
     */
    proceed()
    {
        this.emitter.emit('monthSkipped');
        if (this.mainScene.tutorial && this.mainScene.tutorial.active)
        {
            this.mainScene.tutorial.endTutorial();
            this.mainScene.tutorial.active = false;
        }
        this.mainScene.timer.remove();
        this.mainScene.nextMonth();
    }
}
export default Ui;