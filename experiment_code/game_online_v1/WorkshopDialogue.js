import DialogueScene from './DialogueScene.js';
import ProgressBar from './ProgressBar.js';
import WorkshopQueue from './WorkshopQueue.js';
import {getScaling, scalePartsCosts} from './Item.js';
import { PRODUCTION_TIME_SCALING, PRODUCE_ONE_CLICK, SOUND_VOLUME, PRODUCE_IN_MANAGEMENT, PRODUCE_PARTS} from './Constants.js';
import Button from './Button.js';
import EventDispatcher from './EventDispatcher.js'

/**
 * @classdesc
 * This class is the Dialogue that appears if a Workshop has been clicked.
 * The main Responsibility lies in providing information about the production status as well as
 * the production queue.
 * It also provides production functionality if the option [PRODUCE_IN_MANAGEMENT]{@link GameProperties#PRODUCE_IN_MANAGEMENT} is set to `false`.
 * 
 * @class WorkshopDialogue
 * @extends DialogueScene
 * @constructor
 * 
 */

class WorkshopDialogue extends DialogueScene
{
    constructor()
    {
        super('workshopDialogue');
    }


    /**
     * This function is always run after a scene is started.
     * It creates the resources that are needed to display and handel the dialogue.
     */
    create()
    {

        this.emitter = EventDispatcher.getInstance();

        this.sound.setVolume(SOUND_VOLUME);
        /**
         * Adds the clicksound, which was loaded by the {@link Preloader} to the scene.
         * The sound is added using phasers [BaseSoundManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSoundManager.html#add}
         * @type {Phaser.Sound.BaseSound}
         */
        this.clickSound = this.sound.add('click');
        
        /**
         * Adds the errorsound, which was loaded by the {@link Preloader} to the scene.
         * The sound is added using phasers [BaseSoundManager]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Sound.BaseSoundManager.html#add}
         * @type {Phaser.Sound.BaseSound}
         */
        this.errorSound = this.sound.add('error');

        /**
         * A workshop instance, which is the workshop that has been clicked.
         * This makes sure, that all actions taken in this scene affect the right workshop.
         * 
         * @type {Workshop}
         */
        this.workshop = this.data.workshop;
        this.createDialogue(this.workshop.name);
        // The yOffset specifies the starting y- position of the progress display.
        // it is manipulated if addProduceButtons() is called, to provide space
        // for the produce buttons.
        let yOffset = -80; 
        if (!PRODUCE_IN_MANAGEMENT && PRODUCE_PARTS) // if parts should not be selected inside the management buildings
        {
            yOffset += this.addProduceButtons();
            
        }
        /**
         * The text indicating that something is being produced. See [BitmapText]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.BitmapText.html} for more information.
         */
        this.producingText = new Phaser.GameObjects.Text(this,-200, yOffset, '', {fontSize:18,color: '#000'}).setOrigin(0,0.3);
        
        /**
         * Text that describes the [ProgressBar]{@link WorkshopDialogue#workProgress}. 
         */
        this.progressText = new Phaser.GameObjects.Text(this,this.producingText.x, this.producingText.y+45,'Fortschritt:', {fontSize:18,color: '#000'}).setOrigin(0,0.3);
        /**
         * Text that describers the [AvailableTimeBar]{@link WorkshopDialogue#availableBar}.
         */
        this.availableTimeText = new Phaser.GameObjects.Text(this,this.producingText.x, this.progressText.y+45, 'Verfügbare Zeit:',{fontSize:18,color: '#000'}).setOrigin(0,0.3);
        /**
         * Text that describes the [Queue]{@link WorkshopDialogue#workshopQueue}.
         */
        this.nextText = new Phaser.GameObjects.Text(this,this.producingText.x, this.availableTimeText.y+30,'Als nächstes:', {fontSize:18,color: '#000'}).setOrigin(0,0.3);
        /**
         * The image that indicates the item that is currently produced.
         * See [The Phaser Documentation]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html} for informations about sprites.
         * @type {Phaser.GameObjects.Sprite}
         */
        this.itemImage = new Phaser.GameObjects.Sprite(this,-20,this.progressText.y-40,'chair');
        this.panel.add(this.itemImage);
        /**
         * The Progressbar that informs about the time that is left to finish production of the item that is 
         * currently produced.
         * 
         * @type {ProgressBar}
         */
        this.workProgress = new ProgressBar(
            {
                scene: this,
                x: -40,
                y: this.progressText.y+5,
                width:200
            });

        /**
         * The Progressbar that shows how much time is available in the actual month.
         * 
         * @type {ProgressBar}
         */
        this.availableBar = new ProgressBar(
            {
                scene: this,
                x: this.workProgress.x+50,
                y: this.availableTimeText.y+5,
                width: 150
            });
        // We want this progressbar to be blue, so we set the blue texture
        this.availableBar.bar.middle.setTexture('middle-blue');
        this.availableBar.bar.leftCap.setTexture('left-cap-blue');
        this.availableBar.bar.rightCap.setTexture('right-cap-blue');
        
        /**
         * The queue that displays the items that will be produced after the actual item is finished.
         * @type {WorkshopQueue}
         */
        this.workshopQueue = new WorkshopQueue(
            {
                scene: this,
                x: 0,
                y: this.nextText.y+40
            }
        )
        // Adding the elements to the UI frame 'panel'
        this.panel.add(this.availableTimeText);
        this.panel.add(this.availableBar);
        this.panel.add(this.progressText);
        this.panel.add(this.workProgress);
        this.panel.add(this.producingText);
        this.panel.add(this.workshopQueue);
        this.panel.add(this.nextText);
        this.fadeIn();
        if (this.mainScene.tutorialPhase)
        {
            this.panel.buttonRound.disableInteractive();
            this.buttonLeft.texture.disableInteractive();
            this.buttonRight.texture.disableInteractive();
            this.emitter.emit('workshopReady', this);
        }

            
    }

    /**
     * This function is called after every frame, updating the queue status of the workshop and the progressbars
     */
    update()
    {
        
        this.workshopQueue.update();
        // Describing bar indicating the available hours.
        this.availableBar.value = this.workshop.availableHours + ' Stunden';
        this.availableBar.setMeterPercentage(this.workshop.availableHours/this.workshop.initialHours);
        // If the timer is running = the workshop is producing something.
        if (this.workshop.timer && this.workshop.timer.elapsed != this.workshop.timer.delay)
        {
            this.itemImage.setTexture(this.workshop.item.imageCode); // set itemImage texture to the item that is currently produced.
            this.itemImage.setScale(getScaling(this.workshop.item.imageCode)); // Rescale, because the item images have different sizes.
            this.itemImage.alpha = 1; // make the item visible.
            this.producingText.text = 'Produziert: ';
            this.workProgress.setMeterPercentage(this.workshop.timer.elapsed/this.workshop.timer.delay);
            this.workProgress.value = 'Dauer: ' + Math.ceil(((this.workshop.timer.delay - this.workshop.timer.elapsed)/1000)/PRODUCTION_TIME_SCALING);
        }
        else
        {
            // The workshop is not producing at the moment.
            try
            {
                // If there is an image, make it invisible.
                this.itemImage.alpha = 0;
            }
            catch
            {
                // There is no item image to make transparent. Just continue with the program
            }
            this.workProgress.value = '';
            this.workProgress.setMeterPercentage(0); // reset the progressBar to 0.
            this.producingText.text = 'Produziert: Nichts.';
        }
    }


    /**
     * This function adds the produce buttons inside the workshop dialogue 
     * on top of the progess display and the queue.
     * Therefore it changes the size of the dialogue and the position of the 
     * progress display and queue.
     * 
     * @returns {Number} The new offset for the following objects, that
     *                   appear in the dialogue.
     */
    addProduceButtons()
    {
            // The offset to increase the size of the panel.
            // This is used to provide more space as the produce buttons
            // are shown here if not in the management.
            let offset = 100; 
            this.panel.panel.displayHeight += offset;
            this.panel.contents.displayHeight += offset;
            // Height is applied on both sides, hence we need to move up the 
            // Game elements by the half of the given offset
            this.panel.buttonRound.y -= offset/2;
            this.panel.cross.y -= offset/2;
            this.panel.headerText.y -=offset/2;

            // Add textfields to display the costs.
            this.costsLeft = this.addCostsContainer(-this.panel.panel.displayWidth/2.5,-offset*1.3,this.workshop.items[0]);
            this.panel.add(this.costsLeft);
            this.costsRight = this.addCostsContainer(this.panel.panel.displayWidth/5,-offset*1.3,this.workshop.items[1]);
            this.panel.add(this.costsRight);
            

            // Adding buttons to produce the parts of items
            /**
             * If the option [PRODUCE_IN_MANAGEMEN]{@link GameProperties#PRODUCE_IN_MANAGEMENT} is set to `false`, a button is created
             * to initiatie the production of one part of furniture.
             * This button is located on the left. 
             * 
             * @type {Button}
             * 
             */
            this.buttonLeft = new Button(
                this,-this.panel.panel.displayWidth/9,-offset,
                'button-square-unpressed','button-square',this.workshop.items[0].imageCode,function()
            {
                let canAfford = this.workshop.management.canAfford(this.workshop.items[0]);
                let amount = 1;
                if (PRODUCE_ONE_CLICK && PRODUCE_PARTS)
                {
                    let scaledCosts = scalePartsCosts(this.workshop.items[0]);
                    let item = {...this.workshop.items[0]};
                    item.costs = scaledCosts;
                    canAfford = this.workshop.management.canAfford(item);
                    amount = this.workshop.items[0].demand;
                }
                if (canAfford.status == true)
                {
                    for (let i = 0; i < amount; i++)
                    {
                        this.workshop.management.produce(this.workshop.items[0]);
                    }
                    // If the production was successfully initiated:
                    this.buttonLeft.showMessage('Wird gebaut!');
                    this.emitter.emit('itemButtonClicked', this.workshop.items[0].name, undefined);
                    this.clickSound.play();
                }
                else
                {
                    // If not, pass the reason obtained from the canAfford method
                    // from management.
                    this.buttonLeft.showMessage(canAfford.reason, true);
                    this.emitter.emit('itemButtonClicked', this.workshop.items[0].name, canAfford.reason);
                    this.errorSound.play();
                }
            },
            this, this.workshop.items[0].name);
            /**
             * If the option [PRODUCE_IN_MANAGEMENT]{@link GameProperties#PRODUCE_IN_MANAGEMENT} is set to `false`, a button is created
             * to initiatie the production of one part of furniture.
             * 
             * @type {Button}
             */
            this.buttonRight = new Button(
                this,this.panel.panel.displayWidth/9,-offset,
                'button-square-unpressed','button-square',this.workshop.items[1].imageCode,function()
            {
                let canAfford = this.workshop.management.canAfford(this.workshop.items[1]);
                let amount = 1;
                if (PRODUCE_ONE_CLICK && PRODUCE_PARTS)
                {
                    let scaledCosts = scalePartsCosts(this.workshop.items[1]);
                    let item = {...this.workshop.items[1]};
                    item.costs = scaledCosts;
                    canAfford = this.workshop.management.canAfford(item);
                    amount = this.workshop.items[1].demand;
                }
                if (canAfford.status == true)
                {
                    for (let i = 0; i < amount; i++)
                    {
                        this.workshop.management.produce(this.workshop.items[1]);
                    }
                    this.buttonRight.showMessage('Wird gebaut!');
                    this.emitter.emit('itemButtonClicked', this.workshop.items[1].name, undefined);
                    this.clickSound.play();
                }
                else
                {
                    this.buttonRight.showMessage(canAfford.reason, true);
                    this.emitter.emit('itemButtonClicked', this.workshop.items[1].name, canAfford.reason);
                    this.errorSound.play();
                }

            },
            this, this.workshop.items[1].name);
            // We need the button to be a bit larger.
            this.buttonLeft.setButtonScale(1.3);
            this.buttonLeft.messageOffsetX = -50;
            this.buttonRight.setButtonScale(1.3);
            this.buttonRight.messageOffsetX = 50;
            this.panel.add([this.buttonLeft, this.buttonRight]);
            return offset/2;  // Tell the following game objects where to move
    }

    /**
     * Creates a container that adds the required resources for the particular part.
     * It has textfields to indicate the costs of the item (wood, metal and time).
     * See the [Phaser Docs]{@link https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html}.
     * @returns {Phaser.GameObjects.Container} the container that has been created.
     */
    addCostsContainer(x,y, item)
    {
        let costs = item.costs;
        if (PRODUCE_ONE_CLICK)
        {
            costs = scalePartsCosts(item);
        }
        let costHeader = new Phaser.GameObjects.Text(this, 0,0, 'Kosten', {fontSize:18,color: '#000'}).setOrigin(0,0.3);
        let woodText = new Phaser.GameObjects.Text(this, 0,costHeader.y+20, costs.wood,{fontSize:18,color: '#000'}).setOrigin(0,0.3);
        let wood = new Phaser.GameObjects.Sprite(this, woodText.width, woodText.y, 'wood').setScale(0.04).setOrigin(-0.3, 0.4);
        let metalText = new Phaser.GameObjects.Text(this, 0,woodText.y+20, costs.metal,{fontSize:18,color: '#000'}).setOrigin(0,0.3);
        let metal = new Phaser.GameObjects.Sprite(this, woodText.width, metalText.y, 'metal').setScale(0.04).setOrigin(-0.3, 0.4);
        let costHours = Math.max(...Object.values(costs).slice(2)); // Get the maximum value of all costs. We assume that a part is only produced in one workshop!
        let timeText = new Phaser.GameObjects.Text(this, 0,metalText.y+20, costHours+ ' Std.',{fontSize:18,color: '#000'}).setOrigin(0,0.3);
        let container = new Phaser.GameObjects.Container(this, x,y, [costHeader,woodText,wood,metalText,metal,timeText]);
        return container;

    }
}

export default WorkshopDialogue;