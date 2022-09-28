import InformerBanner from "./InformerBanner.js";
import Building from './Building.js';
import ManagementDialogue from './ManagementDialogue.js';
import DialogueScene from "./DialogueScene.js";
import WorkshopDialogue from "./WorkshopDialogue.js";
import Ui from './Ui.js';
import {WOOD, METAL, ENABLE_MARKET} from './Constants.js';
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
        this.MESSAGES = [
            {
                text: "Willkommen bei der Furniture Company! Schön, dass du dich bereit erklärt hast, den Produktionssektor zu übernehmen. Ich bin Anna, die Abteilungsleiterin, und ich werde dir alles zeigen was du wissen musst. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Deine Aufgabe in der Furniture Company wird es sein, einen möglichst hohen Gewinn zu erzielen, indem du Möbel produzierst. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Du kannst dich auf der Karte umsehen, indem du den Mauszeiger auf einer freien Fläche bewegst, während du die linke Maustaste gedrückt hältst. Probiere es aus und klicke hier, um fortzufahren.",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Um zu erfahren, welche Möbel du produzieren kannst, sieh dir Managementgebäude 1 am oberen Rand an, indem du darauf klickst.",
                action: this.waitForClick.bind(this, this.mainScene.management_one)
            },
            {
                text: "Super! In den Managementgebäuden erhältst du Informationen über Möbel, die du bauen kannst. Zum Beispiel benötigt ein Tisch 2 Holz und 5 Metall und die Herstellung dauert 4 Stunden in Werkstatt A und 6 in Werkstatt B. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Um ein Möbelstück zu bauen, ist es deine Aufgabe, die richtigen Einzelteile herzustellen. Du kannst herausfinden welche Einzelteile ein Möbelstück braucht, indem du auf den grünen Knopf klickst. Probiere es beim Tisch aus!",
                action: this.waitForClick.bind(this, this.mainScene.scene.manager.keys.managementDialogue)
            },
            {
                text: "Sehr gut! Wir brauchen also 4 Tischbeine für jeweils 1 Metall und eine Tischplatte für 1 Metall und 2 Holz. Dafür erhalten wir dann 4 Gold. (Weiter).",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Die Gebäudesymbole zeigen dir außerdem, wo du diese Teile produzieren kannst. Schließe nun das Management Fenster, indem du auf das \"X\" oben rechts klickst.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.managementDialogue)
            },
            {
                text: "Nun produzieren wir die Teile, die wir für den Tisch brauchen. Wir beginnen mit den Tischbeinen. Dafür ist die Werkstatt A zuständig. Öffne sie!",
                action: this.waitForClick.bind(this, this.mainScene.workshopA)
            },
             {
                text: "In dieser Werkstatt kannst du Stuhl-und Tischbeine produzieren und den Fortschritt sowie die Warteschlange verfolgen. Produziere nun 4 Tischbeine, indem du vier mal auf den entsprechenden Knopf klickst.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1,1)
            },
            {
                text: "Du musst dabei nicht warten, bis ein Teil fertig produziert wurde. Deine Aufträge werden nacheinander abgearbeitet.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1,3)
            },
            {
                text: "Super! Die Tischbeine werden nun produziert. Schließe nun die Werkstatt.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.workshopDialogue)
            },
            {
                text: "Auf dem Gelände gibt es auch ein Lager, wo du nützliche Informationen bekommst. Sieh es dir einmal an.",
                action: this.waitForClick.bind(this, this.mainScene.storage)
            },
            {
                text: "Im Lager siehst du welche Teile du brauchst und welche du bereits hast, um ein Möbelstück herzustellen. Das kann sehr hilfreich sein! Du siehst hier die vier Tischbeine die du bisher produziert hast (Weiter).",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Jetzt fehlt also nur noch die Tischplatte. Schließe das Lager.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.storageDialogue)
            },
            {
                text: "Öffne nun die Werkstatt B ...",
                action: this.waitForClick.bind(this, this.mainScene.workshopB)
            },
            {
                text: "... und produziere eine Tischplatte.",
                action: this.waitForProduction.bind(this, this.mainScene.scene.manager.keys.workshopDialogue, 1, 1)
            },
            {
                text: "Du siehst, alle Werkstätten haben eine ähnlichen Aufbau, manche Teile brauchen aber länger in der Produktion als andere. Beachte das bei deiner Planung. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Schließe nun die Werkstatt wieder. Laufende Produktionen oder Warteschlangen werden dadurch nicht unterbrochen.",
                action: this.waitForClose.bind(this, this.mainScene.scene.manager.keys.workshopDialogue)
            },
            {
                text: "Sobald du alle Teile für ein Möbelstück produziert hast, brauchst du nichts weiter zu tun. Unser Montageteam fügt die Einzelteile zusammen und kümmert sich um die Auslieferung. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Den Gewinn von den produzierten Möbeln kannst du oben links sehen. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Du kennst nun die Grundprinzipien deiner Aufgabe. Beachte bitte, dass du wenn es richtig losgeht, nur begrenzte Zeit hast, dein Material aufzubrauchen. Oben rechts wird sich der grüne Balken nach und nach füllen. (Weiter)",
                action:this.waitForClick.bind(this)
            },
            {
                text: "Ist der Balken voll, endet der Monat und arbeitende Werkstätten werden unterbrochen. Jeden Monat wird neues Holz und Metall geliefert, allerdings in unterschiedlichen Mengen. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: " Nicht verbaute Einzelteile und übriges Material spenden wir. Versuche also in jedem Monat möglichst alles aufzubrauchen.  (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Solltest du jedoch früher mit der Produktion fertig sein, kannst du jederzeit zum neuen Monat springen, indem du auf den weißen Pfeil in der rechten oberen Ecke klickst. (Weiter)",
                action: this.waitForClick.bind(this)
            },
            {
                text: "Überspringe nun den Monat, um mit der richtigen Aufgabe zu beginnen. Du bist nun bestens vorbereitet. Ich wünsche dir viel Erfolg!",
                action: this.enableInteraction.bind(this)
            }

        ];
        
    }

    /**
     * Initiates the tutorial. It also changes the settings of the
     * game to separate the actual experiment from the tutorial story
     */
    startTutorial()
    {
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
        let msg = this.MESSAGES.shift();
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
        player.monthlyProfit = [];
        this.mainScene.tutorialPhase = false;
        this.mainScene.monthIterator = this.mainScene.createMonthIterator(undefined,12);
        player.availableWood = this.initWood;
        player.availableMetal = this.initMetal;
        // Reset all the produced Items, the player made during the tutorial.
        Object.keys(player.producedItems).forEach(key =>
            {
                player.producedItems[key][0] = 0;
            });
        player.money = 0;
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