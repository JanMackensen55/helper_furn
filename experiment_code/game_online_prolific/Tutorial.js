import InformerBanner from "./InformerBanner.js";
import Building from './Building.js';
import ManagementDialogue from './ManagementDialogue.js';
import DialogueScene from "./DialogueScene.js";
import WorkshopDialogue from "./WorkshopDialogue.js";
import Ui from './Ui.js';
import {WOOD, METAL, ENABLE_MARKET, PRODUCE_ONE_CLICK, MONTHS, MAX_MONTHS} from './Constants.js';
import EventDispatcher from './EventDispatcher.js';
import MainScene from "./MainScene.js";


/**
 * @classdesc
 * This class handels the infrastructure of the tutorial at the beginning of the game.
 * @constructor
 * @param {MainScene} mainScene the mainscene of the game, used to manipulate the game flow during the tutorial.
 */

class Tutorial extends Phaser.Events.EventEmitter
{

    constructor(mainScene)
    {
        super();
        this.mainScene = mainScene;
        /**
         * Used for resetting the resources afte the tutorial has ended.
         * @type {array}
         */
        this.initMetal = [...METAL];

        /**
         * Used for resetting the resources afte the tutorial has ended.
         * @type {array}
         */
        this.initWood = [...WOOD];

        /**
         * A flag that indicates that the tutorial is still active.
         * This should be set to false if the month is skipped from the tutorial
         * @type {boolean}
         */
        this.active = true;

        /**
         * The eventDispatcher instance. It is used to catch when a dialogue is ready.
         * We need this information to control buttons or other elements but this is only possible when they're loaded properly.
         * @type {EventDispatcher}
         */
        this.emitter = EventDispatcher.getInstance();
        this.sceneManager = mainScene.scene.manager;
        /**
         * Provide the tutorial timeline. Choose text and the condition that needs to be met in order
         * to continue to the next step of the tutorial.
         * @type {object[]}
         */
        this.MESSAGES = {
            welcome:{
                text: "Welcome to the Furniture Company! I'm glad you agreed to take over the production sector. I'm Anna, the department manager, and I'll show you everything you need to know. (Next)",
                action: this.waitForClick.bind(this)
            },
            task:{
                text: "Your task in Furniture Company will be to make the highest possible profit by producing furniture. (Next)",
                action: this.waitForClick.bind(this)
            },
            map:{
                text: "You can look around the map by moving the mouse cursor on a free area while holding down the left mouse button. Try it out and click here to continue.",
                action: this.waitForClick.bind(this)
            },
            prodInfo1:{
                text: "To find out what furniture you can produce, look at management building 1 at the top by clicking on it.",
                action: this.waitForClick.bind(this, this.mainScene.management_one)
            },
            prodInfo2:{
                text: "Great! In the management buildings you get information about furniture you can build. For example, a table needs 2 wood and 5 metal and it takes 4 hours to make in workshop A and 6 in workshop B. (Next)",
                action: this.waitForClick.bind(this)
            },
            prodInfo3:{
                text: "To build a piece of furniture, your task is to make the right parts. You can find out which parts a piece of furniture needs by clicking on the green button. Try it out with the table!",
                action: this.waitForClick.bind(this, this.mainScene.scene.manager.keys.managementDialogue)
            },
            prodInfo4:{
                text: "Very good! So we need 4 table legs for 1 metal each and a table top for 1 metal and 2 wood. For this we will get 5 gold. (Next).",
                action: this.waitForClick.bind(this)
            },
            prodInfo5:{
                text: "The building icons also show you where you can produce these parts. Now close the management window by clicking on the \"X\" in the upper right corner.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.managementDialogue)
            },
            prod1:{
                text: "Now we produce the parts that we need for the table. We start with the table legs. Workshop A is responsible for this. Open it!",
                action: this.waitForClick.bind(this, this.mainScene.workshopA)
            },
            prod2:{
                text: "In this workshop you can produce chair and table legs and follow the progress and the queue. Now produce 4 table legs by clicking once on the corresponding button.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1,1)
            },
            prod3:{
                text: "You do not have to wait until a part has been produced. Your orders are processed one after the other.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1,3)
            },
            prod4:{
                text: "Great! The table legs are now produced. Now close the workshop.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.workshopDialogue)
            },
            storage1:{
                text: "There is also a storage on the premises where you can get useful information. Take a look at it.",
                action: this.waitForClick.bind(this, this.mainScene.storage)
            },
            storage2:{
                text: "In the storage you can see which parts you need and which you already have to make a piece of furniture. This can be very helpful! You can see here the four table legs you have produced so far (Next).",
                action: this.waitForClick.bind(this)
            },
            storage3:{
                text: "So now only the tabletop is missing. Close the storage.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.storageDialogue)
            },
            prodSec1:{
                text: "Now open the workshop B ...",
                action: this.waitForClick.bind(this, this.mainScene.workshopB)
            },
            prodSec2:{
                text: "... and produce a table top.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1, 1)
            },
            prodSec3:{
                text: "As you can see, all workshops have a similar structure, but some parts take longer to produce than others. Keep this in mind when planning. (Next)",
                action: this.waitForClick.bind(this)
            },
            prodSec4:{
                text: "Now close the workshop again. Running productions or queues are not interrupted by this.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.workshopDialogue)
            },
            end1:{
                text: "Once you have produced all the parts for a piece of furniture, you don't need to do anything else. Our assembly team will put the parts together and take care of the delivery. (Next)",
                action: this.waitForClick.bind(this)
            },
            end2:{
                text: "You can see the profit from the produced furniture in the upper left corner. (Next)",
                action: this.waitForClick.bind(this)
            },
            end3:{
                text: "You now know the basic principles of your task. Please note that when it really starts, you have limited time to use up your material. At the top right, the green bar will gradually fill up. (Next)",
                action:this.waitForClick.bind(this)
            },
            end4:{
                text: "When the bar is full, the month ends and working workshops are interrupted. Every month new wood and metal is delivered, but in different quantities. (Next)",
                action: this.waitForClick.bind(this)
            },
            end5:{
                text: "Not used parts and other material will be donated. (Next)",
                action: this.waitForClick.bind(this)
            },
            end6:{
                text: "However, if you finish earlier, you can always jump to the new month by clicking on the white arrow in the upper right corner. (Next)",
                action: this.waitForClick.bind(this)
            },
            end7:{
                text: "Now skip the month to start with the real task. You are now well prepared. I wish you much success!",
                action: this.enableInteraction.bind(this)
            }

        };
        if (PRODUCE_ONE_CLICK){
            this.tutorialOrder = ["welcome", "task", "map", "prodInfo1", "prodInfo2", "prodInfo3", "prodInfo4", "prodInfo5", "prod1", "prod2", "prod4", "storage1", "storage2", "storage3", "prodSec1", "prodSec2", "prodSec3", "prodSec4", "end1", "end2", "end3", "end4", "end5", "end6", "end7"]
        }
        else{
            this.tutorialOrder = ["welcome", "task", "map", "prodInfo1", "prodInfo2", "prodInfo3", "prodInfo4", "prodInfo5", "prod1", "prod2", "prod3","prod4", "storage1", "storage2", "storage3", "prodSec1", "prodSec2", "prodSec3", "prodSec4", "end1", "end2", "end3", "end4", "end5", "end6", "end7"]
        }
        
    }

    /**
     * Initiates the tutorial. It also changes the settings of the
     * game to separate the actual experiment from the tutorial story
     */
    startTutorial()
    {
        this.mainScene.player.availableWood.unshift(10)
        this.mainScene.player.availableMetal.unshift(10)
        this.mainScene.bed.profit.unshift(5)
        this.mainScene.chair.profit.unshift(5)
        this.mainScene.bookcase.profit.unshift(5)
        this.mainScene.table.profit.unshift(5)
        let uiScene = this.mainScene.scene.manager.keys.ui;
        this.deactivateGameflow();
        /**
         * The banner, that is used to place the tutorial text.
         * @type {InformerBanner}
         */
        this.banner = new InformerBanner(uiScene, 400,540,"");
        uiScene.add.existing(this.banner);
        this.banner.setInteractive();
        //initiate the dialogue
        this.step();

        
       
    }

    /**
     * Steps to the next position of the messages field, reloading the text and invoking a new listener.
     */
    step()
    {
        let msg_code = this.tutorialOrder.shift();
        let msg = this.MESSAGES[msg_code]
        this.banner.text = msg.text; // set the new text in the tutorial
        msg.action(); // Perform the action (function) that is stored in the action field.
        // Force the tutorial scene to be above all the other elements.
        this.sceneManager.bringToTop("ui");
    }

    /**
     * Turns off the controls of the ui scene and deactivates the timer.
     */
    deactivateGameflow()
    {
        
        this.mainScene.timer.remove();
        this.emitter.on('uiReady', ui =>
        {
            ui.skipButton.texture.disableInteractive();
        });

    }

    /**
     * Waits until the player has clicked a production button several times. This corresponds to a desired quantity that needs to be produced.
     * a WorkshopDialogue emits 'workshopReady' when opened. We use this event to make sure the elements inside this dialogue are loaded. 
     * @param {WorkshopDialogue} element the dialogue scene to locate the production button in
     * @param {number} position 0 for the left button 1 for the right button of the workshop.
     * @param {number} quantity define how often the button must be clicked in order to continue.
     * @see {@link WorkshopDialogue}
     */
    waitForProduction(element, position, quantity)
    {
        
        // If the dialogue is not active yet, wait for it to complete
        if (!element.buttonLeft || !element.buttonLeft.active)
        {
            this.emitter.once('workshopReady', (workshop) =>
            {
                this.countProduction(element,position,quantity);
            });
        }
        else this.countProduction(element,position,quantity);
    }
    
    /**
     * Invoked if the buttons are successfully loaded and takes care of the productionbutton clicks
     * to count the right amount of parts built.
     * @param {*} element this is usually from the class [WorkshopDialogue]{@link WorkshopDialogue}, where the buttons are located. We will
     *      listen to them and count the clicks.
     * @param {number} position In the workshop dialogue there is a left and a right produciton button. Provide a 0 to listen to the left button and 1 for the right button.
     * @param {number} quantity the quatntity of the item to be built. After the item is built in the provided quantity we will step to the next dialogue point.
     */
    countProduction(element, position, quantity)
    {
        let button;
        if (position === 0)
        {
            button = element.buttonLeft.texture;
        }
        else
        {
            button = element.buttonRight.texture;

        }
        button.setInteractive();
        let clickCounter = 0;
        button.on('pointerup', () =>
        {
            clickCounter++; 
            if (clickCounter===quantity)
            {
                button.off("pointerup");
                this.step();
            }
        });
    }



    /**
     * Waits for a dialogue to be closed.
     * @param {DialogueScene} element the element containing the close button
     */
    waitForClose(element)
    {
        let button = element.panel.buttonRound;
        button.setInteractive();
        button.once('pointerdown', this.step,this);
    }


    /**
     * Implements the functionality to change the text if the element is clicked.
     * This allows to make multiple messages where the subject can click through.
     * If it is clicked once, the next text message is loaded, invoking a different listener.
     * @param {*} element the element that should be clicked to continue.
     */
    waitForClick(element)
    {
        // Default case: if the banner is clicked: continue to next message
        if (!element) 
        {
            this.banner.once('pointerup', () =>
            {
                this.step();
            });
        }
        // Wait for a building to be clicked, and cause the building to blink.
        else if (element instanceof Building)
        {
            element.addFlashEffect();
            element.setInteractive();
            element.once('pointerup', () =>
            {
                element.stopFlashEffect();
                this.step();
                element.disableInteractive();
            });
        }
        // If a Player has looked up the required parts of an item.
        else if (element instanceof ManagementDialogue)
        {
            let button = element.itemPanel.list[1].button.texture;
            button.once('pointerup', () =>
            {
                this.step();
            });
        }   
    }


    /**
     * Ends the tutorial, reactivating the timer and resetting the values. 
     */
    endTutorial()
    {  
        Object.keys(this.mainScene.storage.parts).forEach(key =>
            {
                this.mainScene.storage.parts[key] = 0;
            });
        
        // Resetting player values from tutorial
        let player = this.mainScene.player;
        //player.monthlyProfit = new Array(MONTHS).fill(0);
        this.mainScene.logging = true;
        this.mainScene.tutorialPhase = false;
        this.mainScene.monthIterator = [...this.mainScene.monthLookUP.slice(1)];
        this.mainScene.monthLookUP = this.mainScene.monthLookUP.slice(1)
        player.availableWood = this.initWood;
        player.availableMetal = this.initMetal;
        player.monthlyProfit = new Array(MAX_MONTHS).fill(0);
        player.producedItems = 
        {
            chairs: new Array(MAX_MONTHS).fill(0),
            tables: new Array(MAX_MONTHS).fill(0),
            beds: new Array(MAX_MONTHS).fill(0),
            bookcases: new Array(MAX_MONTHS).fill(0)
        };
        player.money = 0
        this.mainScene.bed.profit.shift()
        this.mainScene.chair.profit.shift()
        this.mainScene.bookcase.profit.shift()
        this.mainScene.table.profit.shift()
        // Reset all the produced Items, the player made during the tutorial.
    }

    /**
     * Enables all functionlaity of the game and get rid of the tutorial dialogue.
     * This allows the player to look around and try the new learned features and controls of the game.
     * Furthermore, the button for skipping the month officially ends the tutorial.
     */
    enableInteraction()
    {
        // Leaving the tutorial phase allows to make sure that the buildings will no longer be disabled after closing.
        this.mainScene.tutorialPhase = false;
        this.mainScene.management_one.setInteractive();
        this.mainScene.management_two.setInteractive();
        if (ENABLE_MARKET) this.mainScene.market.setInteractive();
        this.mainScene.storage.setInteractive();
        this.mainScene.workshops.map(workshop => workshop.setInteractive());
        this.banner.destroy();
        let ui = this.mainScene.scene.manager.keys.ui;
        let button = ui.skipButton.texture;
        button.setInteractive();
    }




    

}
export default Tutorial;
