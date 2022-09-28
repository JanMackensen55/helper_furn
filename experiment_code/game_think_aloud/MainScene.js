import Card from './Card.js';
import UI from './UI.js';
import Player from './Player.js';
import *  as Constants from './Constants.js';
import SummaryScene from './SummaryScene.js';
import {loadSolution, parseLP} from './glpkUtility.js';
import ItemPriceTable from './ItemPriceTable.js';
import {disableNextButton,writeTime} from './SosciWriter.js';
import Timer from './Timer.js';
import EventDispatcher from './EventDispatcher.js';
import TextDialogue from './TextDialogue.js';
import NewsScene from './NewsScene.js';
import OkayScene from './OkayScene.js';

/**
 * @classdesc
 * This class implements the main scene that renders all game elements and presents the 
 * interface. It contains the [Cards]{@link Card}, the player can interact with.
 * 
 * @class MainScene
 * @extends Phaser.Scene
 * @see [Phaser.Scene]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html}
 */
class MainScene extends Phaser.Scene 
{
    constructor(){
        // Start the main scene with the main key.
        super({ key: Constants.SCENES.MAIN});
    }

    /**
     * The preloader takes care of loading all necessary game element into the memory, organizing them as keys.
     * @see [Loader Plugin]{@link https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#image__anchor}
     */
    preload()
    {
        this.load.image('background', 'background.png');
        this.load.image('chair', 'chair_combined.png');
        this.load.image('shelf', 'shelf_combined.png');
        this.load.image('bed', 'bed_combined.png');
        this.load.image('table', 'table_combined.png');
        this.load.image('bed_pic','bed.png');
        this.load.image('bookcase_pic', 'shelf.png');
        this.load.image('table_pic', 'table.png');
        this.load.image('chair_pic','chair.png');
        this.load.image('workshop-a', 'workshop-a.png');
        this.load.image('workshop-b', 'workshop-b.png');
        this.load.image('workshop-c', 'workshop-c.png');
        this.load.image('workshop-d', 'workshop-d.png');
        this.load.image('wood_icon', 'wood_item.png');
        this.load.image('iron_icon', 'iron.png');
        this.load.image('gold_icon', 'gold.png');

        // UI components
        this.load.image('border', 'upperBorder.png');
        this.load.image('month_done', 'buttonLong_blue.png');
        this.load.image('month_done_pressed', 'buttonLong_blue_pressed.png');
        this.load.image('itemNumberPanel', 'panel_blue.png');
        this.load.image('panel', 'panel_brown.png');
        this.load.image('panel_beige', 'panel_beigeLight.png');
        this.load.image('panelWhite', 'panelWhite.png');
        this.load.image('green_arrow','green_sliderRight.png');
        this.load.image('arrow_up', 'grey_arrowUpWhite.png');
        this.load.image('arrow_down', 'grey_arrowDownWhite.png');
        this.load.image('no_changes', 'minus.png');
        this.load.image('summaryButton', 'buttonLong_blue.png');
        this.load.image('summaryButtonPressed', 'buttonLong_blue_pressed.png');
        this.load.image('newspaper', 'newspaper.png');
        this.load.image('star', "gold_1.png")
        // Progress Bar
        this.load.image('left-cap', 'barLeftBlue.png');
        this.load.image('middle', 'barMiddleBlue.png');
        this.load.image('right-cap', 'barRightBlue.png');
        this.load.image('left-cap-shadow', 'barShadowLeft.png');
        this.load.image('middle-shadow', 'barShadowMiddle.png');
        this.load.image('right-cap-shadow', 'barShadowRight.png');
        // load slider resources
        this.load.image('slider_background', 'Slider_background.png');
        this.load.image('slide_knob', 'slide_knob.png');
        this.load.image('slide_border', 'slide_border.png');
        this.load.image('slider_plus', 'arrowBlue_right.png')
        this.load.image('slider_minus', 'arrowBlue_left.png')
        // load font
        this.load.bitmapFont('pressstart', 'pressstart.png','pressstart.xml');
        this.load.bitmapFont('pressstart_white', 'pressstart_white.png','pressstart_white.xml');
        this.load.bitmapFont('pressstart_red', 'pressstart_red.png','pressstart_red.xml');
        this.load.bitmapFont('pressstart_green', 'pressstart_green.png','pressstart_green.xml');

        this.load.bitmapFont('courier', 'courier.png','courier.xml');
        this.load.bitmapFont('courier_white', 'courier_white.png','courier_white.xml');
        this.load.bitmapFont('courier_red', 'courier_red.png','courier_red.xml');
        this.load.bitmapFont('courier_green', 'courier_green.png','courier_green.xml');
    }


    /**
     * This function is executed before the create method and is used to apply
     * constants and to solve the linear programm for the game.
     */
    init(){
        this.maxBarWidth = Constants.MAX_BAR_WIDTH;
        this.lp = loadSolution(Constants.SOLUTION_1);
        this.model = parseLP(Constants.MODEL_1)
        this.eventEmitter = EventDispatcher.getInstance();
        this.eventEmitter.setMainScene(this);
        this.tutorialPhase = false;
    }


    /**
     * This function is used for rendering the game relevant components.
     */
    create()
    {
        if (!Constants.ON_LOCAL_MACHINE){
            // hide the next button of the SosciSurvey website.
            disableNextButton();
        }
        this.background = this.add.image((Constants.WIDTH/2)*Constants.SCALING, (Constants.HEIGHT/2)*Constants.SCALING, 'background');
        this.background.scaleX = Constants.SCALINGX;
        this.background.scaleY = Constants.SCALINGY;

        /**
         * The ui, that informs about the available material and the current month.
         * @type {UI}
         */
        this.ui = new UI({
            scene: this,
            x: 0,
            y: 0,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });

        /**
         * A player instance. Here the available materials will be retrieved. It is also used to save
         * the decisions and the profit of the player.
         * 
         * @type {Player}
         */
        this.player = new Player({
            ui: this.ui,
            money: 0,
            wood: this.model.woodAvailable,
            metal: this.model.metalAvailable,
            hoursA: this.model.workshopAAvailable,
            hoursB: this.model.workshopBAvailable,
            hoursC: this.model.workshopCAvailable,
            hoursD: this.model.workshopDAvailable
        });

        /**
         * The card repesenting the bed.
         * @type {Card}
         */
        this.cardBed = new Card({
            scene: this,
            title: 'Bett',
            item: this.model.items.bed,
            x:150*Constants.SCALINGX,
            y:150*Constants.SCALINGY,
            branch: 2,
            image: 'bed',
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });
    
        /**
         * The card repesenting the bookcase.
         * @type {Card}
         */
        this.cardShelf = new Card({
            scene: this,
            title: 'Regal',
            item: this.model.items.bookcase,
            x: 430*Constants.SCALINGX,
            y: 150*Constants.SCALINGY,
            image: 'shelf',
            branch: 2,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });

        /**
         * The card repesenting the table.
         * @type {Card}
         */
        this.cardTable = new Card({
            scene: this,
            title: 'Tisch',
            item: this.model.items.table,
            x: 150*Constants.SCALINGX,
            y: 400*Constants.SCALINGY,
            image: 'table',
            branch: 1,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });

        /**
         * The card repesenting the chair.
         * @type {Card}
         */
        this.cardChair = new Card({
            scene: this,
            x: 430*Constants.SCALINGX,
            y: 400*Constants.SCALINGY,
            title: 'Stuhl',
            item: this.model.items.chair,
            image: 'chair',
            branch: 1,
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });

        /**
         * All cards that are active in this scene. This is used to compare them in other classes.
         * @type {Card[]}
         */
        this.cards = this.children.list.filter(child => child instanceof Card);

        /**
         * An iterator, that handels the changes of months. It is increased when the player continues to the next month
         * and indicates when the year is over.
         */
        this.monthIterator = this.makeMonthIterator(undefined, Constants.MONTHS);
        
        /**
         * A timer that keeps track of the duration the player stays in one month.
         * @type {Timer}
         */
        this.timer = new Timer();
        this.nextMonth();
    }

    /**
     * Starts all processes to finish one month and start the next one
     */
    monthDoneBehavior(){
        this.player.produce(); // produce the items
        this.startSummary();
        this.cards.forEach(card => {
            card.resetProperties(); // reset the sliders and potential values.

        });
        this.player.resetBars(); // set the bars to 0
    }

    /**
     * Starts the new scene, at the end of the month.
     * Here the time the user needed for the descisions is stored.
     */
    startSummary(){
        if (!Constants.ON_LOCAL_MACHINE && !this.month.done) writeTime(this.month.value,this.timer.getElapsedTime());
        this.scene.add(Constants.SCENES.SUMMARY, SummaryScene, false);
        this.scene.launch(Constants.SCENES.SUMMARY, {parent: this, lp: this.lp, player: this.player, model: this.model});
    }

    /**
     * A generator to step to the next month.
     * @param {Number} start The start of time calculation. (default 0)
     * @param {Number} end defines the last month. (default 12)
     */
    * makeMonthIterator(start=0, end=12){
        for (let i = start; i < end; i++){
            yield i;
        }
    }


    /**
     * Steps to the next month, waiting for the summary scene to end,
     * triggering the display of the new prices and starting a new timer for the month.
     */
    nextMonth(){
        this.month = this.monthIterator.next();
        if (this.month.done){
            let delayed = this.time.delayedCall(500, this.onDelayDone, [], this);
        }else{
            this.cards.map(card => card.month = this.month.value);
            this.player.month = this.month.value;
            if (this.month.value > 1){
                this.scene.add(Constants.SCENES.NEWS, NewsScene, false);
                this.scene.launch(Constants.SCENES.NEWS, {parent: this, lp: this.lp, player: this.player, model: this.model});
            }
            if (this.month.value == 0){
                this.scene.add(Constants.SCENES.OKAY, OkayScene, false);
                this.scene.launch(Constants.SCENES.OKAY, {parent: this, start:true, perfect:false});
            }
            if (this.month.value == 1){
                this.scene.add(Constants.SCENES.OKAY, OkayScene, false);
                this.scene.launch(Constants.SCENES.OKAY, {parent: this, start:false, perfect:false});
                this.player.money = 0
            }
            this.timer.startTimer();
            
        }
        
    }


    /**
     * A helper function to enable the waiting of the final summary.
     */
    onDelayDone(){
        this.startSummary();
    }


    /**!currently not used!
     * Shows the new prices to the player
     * @see module:ItemPriceTable~ItemPriceTable
     */
    showPriceChanges(){
        this.priceTable = new ItemPriceTable({
            scene: this,
            x: 740*Constants.SCALINGX,
            y: 300*Constants.SCALINGY,
            pricesOld: [
                this.model.items.bed.profit[this.month.value-1],
                this.model.items.bookcase.profit[this.month.value-1],
                this.model.items.table.profit[this.month.value-1],
                this.model.items.chair.profit[this.month.value-1]
            ],
            pricesNew: [
                this.model.items.bed.profit[this.month.value],
                this.model.items.bookcase.profit[this.month.value],
                this.model.items.table.profit[this.month.value],
                this.model.items.chair.profit[this.month.value]
            ],
            scalingX: Constants.SCALINGX,
            scalingY: Constants.SCALINGY
        });
        this.priceTable.x = 900*Constants.SCALINGX;
        /*
         * In Phaser tweens are used for animation.
         * In this case the x value of the priceTable will be 
         * animate to 740 in 500 milliseconds.
         * After a specified amount of time the price table will disappear.
         */
        this.tweens.add({
            targets: this.priceTable,
            x: 740*Constants.SCALINGX,
            duration: 500,
            ease: Phaser.Math.Easing.Back.Out,
            completeDelay: Constants.ITEM_PRICE_CHANGES_DURATION,
            onComplete: function(){
                this.targets[0].scene.tweens.add({
                    targets: this.targets[0],
                    x: 900*Constants.SCALINGX,
                    duration: 500,
                    ease: Phaser.Math.Easing.Expo.In,
                    completeDelay: 3000,
                    onComplete: function(){
                        this.targets[0].destroy();
                    }
                });
            }

        });

    }
}
export default MainScene;