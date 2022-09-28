import {ON_LOCAL_MACHINE, ACTION_MAP, MONTHS, SLIDER_STOPPING_TIME} from './Constants.js';
import {readTextFile} from './glpkUtility.js';
let instance = null;

/**
 * @classdesc 
 * This class implements a global event emitter to track the behavior of 
 * a player by recording the clicks that are made along with timestamps.
 * 
 * @class EventDispatcher
 */
 class EventDispatcher extends Phaser.Events.EventEmitter
 {
    constructor()
    {
        super();
        this.activateListeners();
        this.mainScene; 

        /**
         * A list of times where an event happened the function activateListeners listens to.
         * The format is in seconds and should be stored together with the corresponding actions.
         * @type {number[]}
         */
        this.timestamps = [];
        
        /**
         * A list of actions that have been taken. The index is the same as for 
         * [timestamps]{@link EventDispatcher#timestamps}, action as index i has been performed
         * at timestamp i.
         */
        this.actions = [];

        /**
         * Allows to keep track of the month in which action have been performed
         */
        this.months = [];


        /**
         * Allows to track when how much of which piece of furniture should be produced
         */
        this.production = [];

        let actionMap;
        readTextFile(ACTION_MAP, (text) => 
        {
            actionMap = text;
        });

        /**
         * List that assigns a detailed description of the actions performed to the appropriate abbreviation.
         * The abbreviations all consist of two letters.
         * For the exact list see the action_map.xml file.
         */
        this.action_map = JSON.parse(actionMap);
    }

    /**
     * Initiate listeners for the click events that should be recorded.
     * Each listener generates an exact description of the executed action,
     * which is then converted into a two-letter abbreviation. After that the action is logged.
     */
    activateListeners()
    {
        this.on('dialogueClosed', (dialogue) =>
        {
            this.logAction(this.getShortForm('closed '+dialogue));
        });

        this.on('interactiveDialogueClosed', (dialogue, answer) =>
        {
            this.logAction(this.getShortForm('closed ' + dialogue + " - " + answer));
        });

        this.on('explainingDialogue', (start) =>
        {   
            if(start){
                this.logAction(this.getShortForm('start explaining'));
            }
            else{
                this.logAction(this.getShortForm('end explaining'));
            }
        });

        this.on('tutorialDialogueClosed', (start) =>
        {   
            if(start){
                this.logAction(this.getShortForm('start tutorial'));
            }
            else{
                this.logAction(this.getShortForm('end tutorial'));
            }
        });

        this.on('monthDone', () =>
        {
            this.logAction(this.getShortForm("clicked next month button"));
        });

        this.on('arrowButtons', (card, direction, reason) =>
        {   
            if  (!reason){
                this.logAction(this.getShortForm(direction + " " + card + " - success"));
            }
            else if(direction == "decrease"){
                this.logAction(this.getShortForm("failed to " + direction + " " + card));
            }
            else{
                this.logAction(this.getShortForm("failed to " + direction + " " + card + ". Reason: " + reason));
            }
        });

        this.on("sliderActions", (card, correction, reason) =>
        {
            if(!correction){
                this.logAction(this.getShortForm("change value " + card));
            }
            else if(!reason){
                this.logAction(this.getShortForm("change to zero value " + card));
            }
            else{
                this.logAction(this.getShortForm("change to maximum value " + card + ". Reason: " + reason));
            }
        });

        this.on("slidingBreak", (card, breakValue, elapsedTime, numOfLog) =>
        {
            this.logActionbyBreak(this.getShortForm("stays at a value during the dragging - " + card), card, breakValue, elapsedTime, numOfLog)
        });

        this.on("warningBySlide", (card, reason) =>
        {
            this.logAction(this.getShortForm("warning is displayed during dragging (" + card + "). Reason: " + reason))
        });
    }

    /**
     * Log an action. This function will add the message that describes the action that has been recorded 
     * to the [actions list]{@link EventDispatcher#actions}. 
     * If ON_LOCAL_MACHINE is false, the timestamp will also be added.
     * @param {string} action the text that describes what action the player has done. 
     */
    logAction(action)
    {
        if(this.mainScene.tutorialPhase) return;
        this.actions.push(action);
        this.logCurrentProduction()
        if (!ON_LOCAL_MACHINE) this.logCurrentTime();
        if (this.mainScene.month.value != undefined && action!="TY") this.months.push(this.mainScene.month.value+1);
        else if (action=="TY") this.months.push(this.mainScene.month.value);
        else this.months.push(MONTHS);
    }

    /**
     * Logs an action that is associated with a pause. In other words,
     * actions in which the subject has selected a slider, but has not moved it.
     * This function will add the message that describes the action that has been recorded 
     * to the [actions list]{@link EventDispatcher#actions}. 
     * If ON_LOCAL_MACHINE is false, the timestamp will also be added.
     * @param {string} action the text that describes what action the player has done.
     * @param {string} card the card that is now active
     * @param {value} breakValue the value at which a pause was made
     * @param {value} elapsedTime The value describes how long the break has lasted
     * @param {value} numOfLog The value describes how many times the action listener has registered a certain action directly one after the other.
     */
    logActionbyBreak(action, card, breakValue, elapsedTime, numOfLog){
        if(this.mainScene.tutorialPhase) return;
        this.actions.push(action);
        this.logBreakProduction(card, breakValue)
        if (!ON_LOCAL_MACHINE) this.logBreakEndTime(elapsedTime, numOfLog);
        if (this.mainScene.month.value != undefined) this.months.push(this.mainScene.month.value+1);
        else this.months.push(MONTHS);
    }

    /**
     * Logged the time at which the break in slider moving is finished
     * and append it to [timestamps]{@link EventDispatcher#timestamps}.
     * @param {value} elapsedTime The value describes how long the break has lasted
     * @param {value} numOfLog This value describes how often the break was registered
     */
    logBreakEndTime(elapsedTime, numOfLog){
        let timestamp = (document.getElementById('TI01_01').value-elapsedTime)+(SLIDER_STOPPING_TIME*numOfLog);
        timestamp = timestamp.toFixed(1);
        this.timestamps.push(timestamp);
    }

    /**
     * Get the current time and append it to [timestamps]{@link EventDispatcher#timestamps}. 
     */
    logCurrentTime()
    {
        let timestamp = document.getElementById('TI01_01').value;
        this.timestamps.push(timestamp);
    }

    /**
     * Get the currently selected production and append it to [production]{@link EventDispatcher#production}
     * The number of items produced is stored in the following order: chairs, tables, bookcases, beds.
     */
    logCurrentProduction()
    {
        let beds = 0;
        let bookcases = 0;
        let tables = 0;
        let chairs = 0;
        for (let card in this.mainScene.player.stash){
            switch (card) {
                case 'Bett':
                    beds = beds + this.mainScene.player.stash[card].number;
                    break;
                case 'Regal':
                    bookcases = bookcases + this.mainScene.player.stash[card].number;
                    break;
                case 'Tisch':
                    tables = tables + this.mainScene.player.stash[card].number;
                    break;
                case 'Stuhl':
                    chairs = chairs + this.mainScene.player.stash[card].number;
                    break;
            }
        }
        this.production.push(chairs+","+tables+","+bookcases+","+ beds);
    }

    /**
     * Get the currently selected production and append it to [production]{@link EventDispatcher#production}
     * respects the value at which the pause was made
     * The number of items produced is stored in the following order: chairs, tables, bookcases, beds.
     * @param {string} card the card that is now active
     * @param {int} breakValue the value at which a pause was made
     */
    logBreakProduction(cardName, breakValue){
        let beds = 0;
        let bookcases = 0;
        let tables = 0;
        let chairs = 0;
        for (let card in this.mainScene.player.stash){
            if(cardName == card){
                switch (card) {
                    case 'Bett':
                        beds = breakValue;
                        break;
                    case 'Regal':
                        bookcases = breakValue;
                        break;
                    case 'Tisch':
                        tables = breakValue;
                        break;
                    case 'Stuhl':
                        chairs = breakValue;
                        break;
                }
            }
            else{
                switch (card) {
                    case 'Bett':
                        beds = beds + this.mainScene.player.stash[card].number;
                        break;
                    case 'Regal':
                        bookcases = bookcases + this.mainScene.player.stash[card].number;
                        break;
                    case 'Tisch':
                        tables = tables + this.mainScene.player.stash[card].number;
                        break;
                    case 'Stuhl':
                        chairs = chairs + this.mainScene.player.stash[card].number;
                        break;
                }   
            }
        }
        this.production.push(chairs+","+tables+","+bookcases+","+beds);
    }

    /**
     * Returns the instance of the EventDispatcher if any. If not,
     * a new instance will be created. If the EventDispatcher should be used,
     * make sure to call this method like shown in the example.
     * @returns {EventDispatcher} the event dispatcher that handels global events.
     * @example 
     * // at an arbitrary point in the game 
     * this.emitter = EventDispatcher.getInstance();
     * // Then use it, for example by emitting an event:
     * this.emitter.emit("myEvent", data);
     */
    static getInstance()
    {
        if (instance == null)
        {
            instance = new EventDispatcher();
        }
        return instance;
    }

    /**
     * Add the MainScene to the event dispatcher in order to 
     * access the current month.
     * @param {MainScene} mainScene 
     */
    setMainScene(mainScene)
    {
        this.mainScene = mainScene;
    }
 
     /**
      * Returns the key corresponding to the given value of the action map.
      * @param {String} value the value that is used to get the corresponding key.
      * @returns {String} the key, representing the short form of the value.
      */
    getShortForm(value) {
        return Object.keys(this.action_map).find(key => this.action_map[key] === value);
    }

    /**
     * Returns the actions performed by a player along with the timestamps as a list of
     * tuples. (As a String). It can be parsed in python via the ast.literal_eval function.
     * @returns {string} a string in the following fashion '[(action, timestamp, month, production), (acton,timestamp, month, production),...]'.
     */
    getActions()
    {
        // Check if we have recorded timestamps. If not, the project does not run in SoSciSurvey.
        if (this.timestamps.length < this.actions.length)
        {
            throw "No Timestamps available! Make sure to run the project in SoSciSurvey.";
        }
        let str = '[';
        for (let i = 0; i< this.actions.length; i++)
        {
            // Build a tuple by hand and add it to the string
            if (i === this.actions.length-1) str = str.concat("('"+this.actions[i]+"',"+this.timestamps[i]+","+this.months[i]+ ","+this.production[i] +")");
            else str = str.concat("('"+this.actions[i]+"',"+this.timestamps[i]+","+this.months[i]+ ","+this.production[i] +"),");
            
        }
        str = str.concat(']');
        return str;
    }


}
export default EventDispatcher;