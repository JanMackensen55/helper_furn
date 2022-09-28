
/**
 * @classdesc 
 * This class creates a timer that runs according to the actual world time.
 * So the time that the VP really consumes. For this the time variable
 * is read from sosci survey.
 * @class ExperimentTime
 * @constructor
 * @param {Number} data.delayValue maximum time the timer should run
 */
class ExperimentTime{

    /**
     * creates the timer and sets the start value and the time the timer should run
     */
    constructor(data){
        let {delayValue} = data
        let creationTime = document.getElementById('TI01_01').value * 1000
        this.delay = delayValue
        this.startTime =  creationTime
        this.currentTime =  creationTime
        this.lastUpdateTime = creationTime
        this.elapsed = this.currentTime - this.startTime
        this.paused = false
    }

    /**
     * unpauses a paused timer and ensures that the time
     * during the pause does not count as timer time
     */
    unpauseTime(){
        if (!this.paused){
            return
        }
        this.paused = false
        this.lastUpdateTime = document.getElementById('TI01_01').value * 1000
        return 
    }

    /**
     * updates the elapsed time of the timer
     */
    updateTime(){
        if (this.paused){
            return
        }
        let updateT = document.getElementById('TI01_01').value * 1000
        this.currentTime = updateT
        this.elapsed += this.currentTime - this.lastUpdateTime
        if (this.elapsed >= this.delay){
            this.elapsed = this.delay
        }
        this.lastUpdateTime = updateT
        return
    }

    /**
     * pauses the timer
     */
    pauseTime(){
        this.updateTime()
        this.paused = true
    }

    /**
     * end the timer
     */
    remove(){
        this.elapsed = this.delayValue
    }

}
export default ExperimentTime;