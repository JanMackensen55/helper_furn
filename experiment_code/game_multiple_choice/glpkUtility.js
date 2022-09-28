import {MONTHS} from './Constants.js';
/**
 * @description
 * This module is used to parse linear problems and its solution.
 * It also provides tools to solve linear problems. In this case the glpk.js file must be 
 * loaded before the game inside the website.
 * @see [glpk.js]{@link https://github.com/hgourvest/glpk.js}
 * @module glpkUtility
 */

/**
 * Read a textfile and process it with a callback function.
 * @function readTextFile
 * @memberof module:glpkUtility
 * @param {String} file the path to the file containing the linear problem
 * @param {function} callback a function that should be executed, if the file has been read.
 *    A callback function usually writes the contents inside a variable as seen in [getLP]{@link module:glpkUtility#getLP}.
 */
function readTextFile(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}


/**
 * Reads a linear problem from a file. Taken from {@link https://github.com/hgourvest/glpk.js/blob/master/test/test.js} and modified.
 * @function readCplexFromFile
 * @author [Henri Gourvest]{@link https://github.com/hgourvest}
 * @license GNU General Public License v2.0
 * @param {object} lp the linear problem
 * @param {string} filename the name of the 
 */
function readCplexFromFile(lp, filename){
    var str = filename.toString();
    var pos = 0;
    glp_read_lp(lp, null,
        function(){
            if (pos < str.length){
                return str[pos++];
            } else
                return -1;
        }
    )
}


/**
 * Solves the linear problem and converts the result. Taken from {@link https://github.com/hgourvest/glpk.js/blob/master/test/test.js} and modified.
 * @function cplex
 * @author [Henri Gourvest]{@link https://github.com/hgourvest}
 * @license GNU General Public License v2.0
 * @param {*} file a file in cplex format.
 * @returns {string} the results that are converted by [convertResult]{@link module:glpkUtility#convertResult}.
 */
function cplex(file){
    var lp = glp_create_prob();
    readCplexFromFile(lp,file);
    var smcp = new SMCP({presolve: GLP_ON});
    glp_simplex(lp, smcp);

    var iocp = new IOCP({presolve: GLP_ON});
    glp_intopt(lp, iocp);
    let result = convertResult(lp);
    return result;
};



/**
* Reads a text file and returns a linear Problem as string. It reads the model that is specified under
* [MODEL]{@link module:Constants#MODEL}.
* @function getLP 
* 
*/
function getLP(model_file){
    let linearProblem;
    readTextFile(model_file, function(text){
        linearProblem = text;
    });
    return linearProblem;
}

/**
 * This function loads the underlying linear problem and uses the [cplex]{@link module:glpkUtility#cplex} function to solve it.
 * @function solveLP
 * @returns {object} the solution of the linear problem.
 */
function solveLP(model_file){
    let linearProblem = getLP(model_file);
    return cplex(linearProblem);
}

/**
 * This function loads a solution from file specified by the [SOLUTION]{@link module:Constants#SOLUTION} field.
 * @function loadSolution
 * @returns {object} the solution of the linear problem.
 */
function loadSolution(solution_file){
    let solution;
    readTextFile(solution_file,  function(text){
        solution = text;
    });
    solution = JSON.parse(solution);
    return solution;

}


/**
 * This function reads a linear problem and extracts the relevant data to run the 
 * game. 
 * It contains the value for every month for every item, available resources,
 * and costs. The structure of the linear problem object is the following:
 * @property {number} workshopAAvailable available hours in workshop A.
 * @property {number} workshopBAvailable available hours in workshop B.
 * @property {number} workshopCAvailable available hours in workshop C.
 * @property {number} workshopDAvailable available hours in workshop D.
 * @property {array} metalAvailable available metal for every month.
 * @property {array} woodAvailable available wood for every month.
 * @property {object} items information about the available items of the game. The keys are the names of
 *     the different items 'bed', 'bookcase', 'chair', and 'table'. Each of these keys yields another object
 *     with the fields:
 * @property {array} items.profit the profit of the item for every month.
 * @property {object} items.costs the costs of the specific item. See [costs]{@link module:Item~Item#costs}
 * @function parseLP
 * @memberof module:glpkUtility
 * 
 */
function parseLP(model_file){

    let lpFile = getLP(model_file).split('\n').map(element => element.trim()); //Last part is important, otherwise indexOf will not find s.t.

    let st_position = lpFile.indexOf('s.t.');


    // Parsing profit values
    let filteredVarsProfit = lpFile.slice(0, st_position).filter(element => {
        return element.startsWith('+');
    }).map(element => element.split(' '));
    filteredVarsProfit.sort((a,b) => {
        return Number(a[1].split('x')[1]) - Number(b[1].split('x')[1]);
    });
    let profitNumbers = filteredVarsProfit.map(e => Number(e[0]));

    let bedArrProfit = profitNumbers.slice(0, MONTHS);
    let bookcaseArrProfit = profitNumbers.slice(MONTHS, 2*MONTHS);
    let tableArrProfit = profitNumbers.slice(2*MONTHS, 3*MONTHS);
    let chairArrProfit = profitNumbers.slice(3*MONTHS, 4*MONTHS);

    // Parsing cost value

    let filteredVarsCosts = lpFile.slice(st_position, lpFile.length).filter(element => {
        return element.startsWith('+');
    }).map(element => element.split(' '));
    let bedArrCosts = filteredVarsCosts.filter(e => e[1] == 'x1' ).map(e => Number(e[0]));
    let bookcaseArrCosts = filteredVarsCosts.filter(e => e[1] == 'x'+Number(MONTHS+1)).map(e => Number(e[0]));
    let tableArrCosts = filteredVarsCosts.filter(e => e[1] == 'x'+Number(MONTHS*2+1)).map(e => Number(e[0]));
    let chairArrCosts = filteredVarsCosts.filter(e => e[1] == 'x'+Number(MONTHS*3+1)).map(e => Number(e[0]));
    // Parsing initial values
    let filteredConstraints = lpFile.filter(e => e.startsWith('<='));
    let materials = filteredConstraints.slice(0, MONTHS*2).map(e => Number(e.split(' ')[1]));
    let wood = [];
    let metal = [];
    for (const [x, _] of materials.entries()){
        if (x % 2 == 0){
            wood.push(materials[x]);
        }else{
            metal.push(materials[x]);
        }

    }
    let hours = filteredConstraints.slice(MONTHS*2,MONTHS*2+4).map(e => Number(e.split(' ')[1]));
    let lp = {
        workshopAAvailable: hours.shift(),
        workshopBAvailable: hours.shift(),
        workshopCAvailable: hours.shift(),
        workshopDAvailable: hours.shift(),
        metalAvailable: metal,
        woodAvailable: wood,
        items: {
            bed: {
                profit: bedArrProfit,
                costs: {
                    wood: bedArrCosts.shift(),
                    metal: bedArrCosts.shift(),
                    hoursA: 0,
                    hoursB: 0,
                    hoursC: bedArrCosts.shift(),
                    hoursD: bedArrCosts.shift()
                }
            },
            bookcase: {
                profit: bookcaseArrProfit,
                costs: {
                    wood: bookcaseArrCosts.shift(),
                    metal: bookcaseArrCosts.shift(),
                    hoursA: 0,
                    hoursB: 0,
                    hoursC: bookcaseArrCosts.shift(),
                    hoursD: bookcaseArrCosts.shift()
                }
            },
            table: {
                profit: tableArrProfit,
                costs: {
                    wood: tableArrCosts.shift(),
                    metal: tableArrCosts.shift(),
                    hoursA: tableArrCosts.shift(),
                    hoursB: tableArrCosts.shift(),
                    hoursC: 0,
                    hoursD: 0
                }
            },
            chair: {
                profit: chairArrProfit,
                costs: {
                    wood: chairArrCosts.shift(),
                    metal: chairArrCosts.shift(),
                    hoursA: chairArrCosts.shift(),
                    hoursB: chairArrCosts.shift(),
                    hoursC: 0,
                    hoursD: 0
                }
            }
        }
    }
    return lp;
}



/**
 * Converts the result of the lp to enable the reading of the optimal solution
 * and the amount of built items for every month.
 * @param {*} lp 
 */
function convertResult(lp){
    let resultList = [];
    for( var i = 1; i <= glp_get_num_cols(lp); i++){
        resultList.push(glp_get_col_name(lp, i)  + " = " + glp_mip_col_val(lp, i));
    }
    resultList.sort((a, b) => Number(a.slice(1, a.length).split(' ')[0]) -  Number(b.slice(1, b.length).split(' ')[0]))
    resultList = resultList.map(e => Number(e.split(' ')[2]));
    resultList = resultList.slice(0, resultList.length-1);

    let bedsBuilt = [];
    let bookcasesBuilt = [];
    let tablesBuilt = [];
    let chairsBuilt = [];
    let furniture = [bedsBuilt, bookcasesBuilt, tablesBuilt, chairsBuilt];
    let itemIndex = 0;
    for (const [x, value] of resultList.entries()){
        if (x % 12 == 0 && x != 0){
            itemIndex ++;
        }
        furniture[itemIndex].push(value);
    };

    let result = {
        objective: glp_mip_obj_val(lp),
        numberOfBeds: bedsBuilt,
        numberOfBookCases: bookcasesBuilt,
        numberOfTables: tablesBuilt,
        numberOfChairs: chairsBuilt
    };

    return result;
}
export {getLP, solveLP, loadSolution, parseLP, readTextFile};