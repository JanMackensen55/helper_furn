import * as Constants from './Constants.js';
import { SOSCI_LOG } from './GameProperties.js';
/**
 * @description
 * This module provides function that are used to write variables to SosciSurvey.
 * @module SosciWriter
 */
  
/**
 * Write the Profit into the corresponding intern variable.
 * @param {string} target the target. Could be 'player' or 'model' and specifies if the profit
 * should be added to the player or to the model.
 * @param {int} month the number of the month starting from 0.
 * @param {int} profit the profit of the model or player for the given month.
 */
function writeProfit(target,month,profit){
    let variable = getVariable(getTarget(target)+Constants.SOSCI_PROFIT, month+1);
    writeValue(variable, profit);
}

/**
 * This function is used to write the answers of a user to the corresponding 
 * SosciSurvey variable.
 * The Variable specified at [SOSCI_ANSWER]{@link module:GameProperties#SOSCI_ANSWER} is used as the 
 * variable where the answers are stored. To assign the answers, question numbers are used, corresponding
 * to the items at SosciSurvey.
 * @param {number} questionNumber the question number to specify to which item the user's text should be written.
 * @param {String} answer the answer of the user. 
 */
export function writeAnswer(questionNumber, answer)
{
    let variable = getVariable(Constants.SOSCI_ANSWER, questionNumber);
    writeValue(variable, answer);
}

/**
 * Writes the assessment value to soscisurvey question. The assesment number stands for a question.
 * The likert-scaled answer of the player will be represented by item 01 and the freetext answer will be 
 * represented as item 02. Thus an assessment answer has always 2 items.
 * In sosci survey it can look like: AS01_01 for the likert answer of the first assessment question and AS01_02 for the freetext answer
 * of the same assessment dialogue accordingly.
 * @param {number} assessmentNumber the number of the assesment question at soscisurvey.
 * @param {number} option the likert answer of the user.
 * @param {string} answer the fee-text answer of the user.
 * @param {boolean} mike defines whether this answer is the own assessment or feedback to mike
 */
export function writeAssessment(assessmentNumber, option, answer="", mike=false)
{
    let key;
    // Ensure that the given numbers will be converted with leading zeros 
    // Necessary because sosci survey creates variables like AS01.
    let number = assessmentNumber.toString().padStart(2,'0');
    if (mike)
    {
        key = Constants.SOSCI_FEEDBACK+number;
    } else key = Constants.SOSCI_ASSESSMENT;
    let likert_answer = getVariable(key,assessmentNumber+1);
    writeValue(likert_answer, option);
    if (answer){
        let freetext = getVariable(key,2);
        writeValue(freetext,answer);
    }
}

export function writeQuestion(questionNumber, rightAnswer){
    let key = Constants.SOSCI_CONTROLL_QUESTIONS
    writeValue(getVariable(key, questionNumber), rightAnswer)
}

export function writeOrder(order)
{
    writeValue(getVariable(Constants.SOSCI_ORDER, 1), "["+order.join() +"]")
}


/**
 * Write the production status to SosciSurvey. This is helpful to get an idea
 * if the player has been interrupted during the change of a month, which
 * could serve as an indication that the available time per month should be adjusted.
 * @param {int} month the number of the month starting from 0.
 * @param {boolean} status set true, if the player was producing during the month change,
 *                  false if not.
 */
export function writeProducingStatus(month, status)
{
    let variable = getVariable(Constants.SOSCI_PLAYER_VAR+Constants.SOSCI_WAS_PRODUCING, month+1);
    writeValue(variable, status);
}

/**
 * Write the number of produced item for a given month to the corresponding 
 * SosciSurvey variable.
 * 
 * EXAMPLE: writeProducedItems('player', 0, {
 *                                      beds: 1,
 *                                      bookcases: 30,
 *                                      tables: 20,
 *                                      chairs: 15
 *                                      });
 * Writes the given amount of items to the player variable for the month january.
 * @param {string} target Could be 'player' or 'model' and defines, if the value should be
 * written to a player or to a model variable.
 * @param {int} month the number of the month starting from 0.
 * @param {Object} items an object containing the item numbers.
 * Must contain the keys 'beds', 'bookcases', 'tables', 'chairs'.
 */
export function writeProducedItems(target,month,items){
    let _target = getTarget(target);
    let beds = getVariable(_target+Constants.SOSCI_BEDS,month+1);
    let bookcases = getVariable(_target+Constants.SOSCI_BOOKCASES,month+1);
    let tables = getVariable(_target+Constants.SOSCI_TABLES,month+1);
    let chairs = getVariable(_target+Constants.SOSCI_CHAIRS,month+1);
    writeValue(beds, items.beds);
    writeValue(bookcases, items.bookcases);
    writeValue(tables, items.tables);
    writeValue(chairs, items.chairs);
}

/**
 * Writes the elapsed time to the corresponding SosciSurvey variable.
 * @param {int} month the month to specify the Sosci variable
 * @param {int} time the elapsed time to store in milliseconds
 */
export function writeTime(month, time){
    let variable = getVariable(Constants.SOSCI_PLAYER_TIME_VAR,month+1);
    writeValue(variable, time);
}

/**
 * Write a value to a given SosciSurvey variable
 * @param {object} variable a dom object obtained by getVariable().
 * @param {*} value the value that should be written inside the given variable.
 */
function writeValue(variable, value){
    variable.value = value;
}


/**
 * Returns a DOM object of the given variable. 
 * EXAMPLE: getVariable('PL01',1) returns the intern SosciSurvey variable 'PL01_01'
 * @param {string} varName The name of the intern variable. Must be the same as in SosciSurvey.
 * @param {int} varNumber The number of the item inside the intern variable.
 */
function getVariable(varName, varNumber){
    console.log(varName+'_'+varNumber.toString().padStart(2,'0'))
    return document.getElementById(varName+'_'+varNumber.toString().padStart(2,'0'));
}

/**
 * Get the variable name of a Sosci Survey variable given the intuitive name.
 * @param {sting} target the target that should be converted to the 
 *                SosciSurvey variable. Could be 'player' or 'model'.
 */
function getTarget(target){
    if (target === 'player'){
        return Constants.SOSCI_PLAYER_VAR;
    }else if (target === 'model'){
        return Constants.SOSCI_MODEL_VAR;
    }
}

/**
 * Write the final log to the corresponding SoSci Variable.
 * @param {string} log the log string containing the actions of the Player.
 * @see EventDispatcher
 */
export function writeLog(log)
{
    let variable = document.getElementById(Constants.SOSCI_LOG);
    writeValue(variable,log);
}



/**
 * Disables the 'next' button.
 */
export function disableNextButton(){
    SoSciTools.submitButtonsHide();
}

/**
 * Submits the recorded values to SosciSurvey.
 */
export function submit(){
    SoSciTools.submitPage();
}

export {writeProfit};