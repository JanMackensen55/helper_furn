/**
 * @classdesc
 * This Class handels the time tracking of the player
 * @class Timer
 */
class Timer{

    /**
     * Starts a timer, storing the time this function is called.
     */
    startTimer(){
        /**
         * The start time, which is used as a starting point to calculate the elapsed time.
         */
        this.startTime = new Date();
    }

    /**
     * Calculate the difference between the time 'startTimer' was called
     * and the actual time
     * @returns the elapsed time in milliseconds as a difference between the {@link Timer#startTime} and the current time.
     */
    getElapsedTime(){
        if (this.startTime == undefined){
            return undefined;
        }
        let currentTime = new Date();
        let timeElapsed = Math.abs(this.startTime - currentTime);
        return timeElapsed;

    }
}

export default Timer;