/* Custom Events L2 Autograder
 * Scratch 3 (original) version: Anna Zipp, Summer 2019
 *
 * NOTE: This module's art is being redone right now, 
 *       so sprite names may change. 
 *       I created global variables for the sprite names, they can be changed
 *       so the whole code doesn't have to be changed completely. 
 */

require('./scratch3');

// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

// Global variables that hold the sprite names that can be changed
// see note at top
var PLAYER = "Robot";  // "Zombie"
var ANNOUNCER = "Planet";  // "Skull"
var BIG_TARGET = "Big Donut";  // "Big Bat"
var LITTLE_TARGET = "Little Donut";  // "Little Bat"
var EXTRA = "Octopus";  // "Spider"
var START_BUTTON = "Start Button";

module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            timerHalfway: {bool: false, str: 'Added a condition to check when the timer has elapsed halfway (10 seconds).'},  
            timeAnnounced: {bool: false, str: 'An announcement is made when timer is halfway up.'},
            scoreSet: {bool: false, str: 'Score is set to 0 when green flag and/or when start button is clicked.'},
            pointAdded: {bool: false, str: 'Score changes by 1 when Big Donut is touched.'},
            youWin: {bool: false, str: 'An announcement is made and game ends when score is more than a number of points.'},
        }
        this.extensions = {
            instructions: {bool: false, str: 'Planet gives instructions for the number of points needed to win.'},
            littleTarget: {bool: false, str: 'Added second little target that changes score by multiple points when caught.'},
            extraFeatures: {bool: false, str: 'Additional features added (e.g. obstacles or lives).'},
        }
    }

    gradePlayer(sprite) {
        // iterate through each of the sprite's scripts that start with the event 'When I Receive' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenbroadcastreceived"))) {  
            let eventBlock = script.blocks[0];
            if (eventBlock.fields.BROADCAST_OPTION[0] === "start") {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    if (opcode === "control_if") {
                        // check for an "if timer = 10" block
                        let ifCondition = block.conditionBlock();  // the operator block
                        if (ifCondition !== null) {
                            if (ifCondition.opcode === "operator_equals") {
                                let input1 = ifCondition.inputs.OPERAND1[1][1];
                                let input2 = ifCondition.inputs.OPERAND2[1][1];

                                if (((input1 === "timer") && (input2 === "10")) || ((input1 === "1") && (input2 === "timer"))) {
                                    this.requirements.timerHalfway.bool = true;

                                    // create array of the blocks inside the If/Then block
                                    let firstSubBlock = block.toBlock(block.inputs.SUBSTACK[1]);
                                    let firstSubscript = firstSubBlock.childBlocks();

                                    // check for a broadcast block, and store the broadcast message
                                    for (let i=0; i < firstSubscript.length; i++) {
                                        iterateBlocks(firstSubscript, (block, level) => {
                                            let opcode = block.opcode;
                            
                                            if (opcode === "event_broadcast") {
                                                var halftimeBroadcast = block.inputs.BROADCAST_INPUT[1][1];
                                            }
                                        });
                                    }
                                } // else if touching Big Donut  --> check for score change 
                            } else if (ifCondition.opcode === "sensing_touchingobject") {
                                let targetTouching = inputCond.toBlock(inputCond.inputs.TOUCHINGOBJECTMENU[1]);    
                                if ((targetTouching !== null) && (condSelected.opcode === "sensing_touchingobjectmenu")) {
                                    targetCond = condSelected.fields.TOUCHINGOBJECTMENU[0];
                                }

                            }
                        } 
                        
                    } // else if (opcode.includes(""))
                    //TODO: if "set score to 0"

                    // check for scoring code, trying to account for different styles of capitalization/spelling for custom variables 
                    if (((input1.includes("core")) && (input2 >= "1")) || ((input1 >= "1") && (input2.includes("core")))) {
                                
                    }

                });
            }
        }
    }

    gradeAnnouncer(sprite) {
        // iterate through each of the sprite's scripts that start with the event 'When I Receive' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenbroadcastreceived"))) {  
            let eventBlock = script.blocks[0];
            if (eventBlock.fields.BROADCAST_OPTION[0] === "start") {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    if (opcode === "control_if") {
                        
                    }
                });
            } else if ((halftimeBroadcast !== null) && (eventBlock.fields.BROADCAST_OPTION[0] === halftimeBroadcast)) {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    if (opcode.includes("looks_say")) {
                        this.requirements.timeAnnounced.bool = true;
                    }
                });
            } else if ((youWinBroadcast !== null) && (eventBlock.fields.BROADCAST_OPTION[0] === youWinBroadcast)) {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    if (opcode.includes("looks_say")) {
                        this.requirements.youWin.bool = true;
                    }
                });
            }
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        for(var target of project.targets) {
            if (!(target.isStage)) {
                if (target.name === PLAYER) {
                    this.gradePlayer(target);
                } else if (target.name === ANNOUNCER) {
                    this.gradeAnnouncer(target);
                } else {
                    //grade extra features
                }
            }
        }
    }  





}
