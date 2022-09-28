import {ON_LOCAL_MACHINE, ACTION_MAP} from './Constants.js';
import {readTextFile} from './glpkUtility.js';
let instance = null;

/**
 * @classdesc 
 * This class implements a global event emitter to track the behavior of 
 * a player by recording the clicks that are made along with timestamps.
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

        let actionMap;
        readTextFile(ACTION_MAP, (text) => 
        {
            actionMap = text;
        });
        this.action_map = JSON.parse(actionMap);
    }

    /**
     * Initiate listeners for the click events that
     * should be recorded.
     */
    activateListeners()
    {
        this.on('buildingClicked', (building) => 
        {
            this.logAction(this.getShortForm('opened '+building));
        });

        this.on('dialogueClosed', (dialogue) =>
        {
            this.logAction(this.getShortForm('closed '+dialogue));
        });
        
        this.on('monthSkipped', () => 
        {
            this.logAction(this.getShortForm('skipped to next month'));
        });

        // Record when player tries to produce an item. If it can be afforded, just
        // record what has been produced. Else also provide the reason why this can't be produced.
        this.on('itemButtonClicked', (itemName, reason) =>
        {
            if (!reason)
            {
                this.logAction(this.getShortForm('clicked on produce button: '+ itemName+' - success.'));
            }
            else this.logAction(this.getShortForm('failed to produce '+ itemName + '. Reason: '+reason));
        });

        this.on('openedPartsDisplay', (itemName) =>
        {
            this.logAction(this.getShortForm('looked up parts for '+ itemName + '.'));
        });

        this.on('toggledAudio', (audioSetting) =>
        {
            if(!audioSetting) 
            {
                this.logAction(this.getShortForm("sound muted"));
            }else this.logAction(this.getShortForm("sound activated"));
        });
        
        this.on('inactivePlayer',() =>
        {
            this.logAction(this.getShortForm("player is inactive"))
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
        if(!this.mainScene.logging) return;
        this.actions.push(action);
        if (!ON_LOCAL_MACHINE) this.logCurrentTime();
        if (this.mainScene.num_month != undefined) this.months.push(this.mainScene.num_month);
        else this.months.push(12);
        
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
     * Returns the actions performed by a player along with the timestamps as a list of
     * tuples. (As a String). It can be parsed in python via the ast.literal_eval function.
     * @returns {string} a string in the following fashion '[(action, timestamp, month), (acton,timestamp, month),...]'.
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
            if (i === this.actions.length-1) str = str.concat("('"+this.actions[i]+"',"+this.timestamps[i]+","+this.months[i]+")");
            else str = str.concat("('"+this.actions[i]+"',"+this.timestamps[i]+","+this.months[i]+"),");
            
        }
        str = str.concat(']');
        return str;
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
}


export default EventDispatcher;