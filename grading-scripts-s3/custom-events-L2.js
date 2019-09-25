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
/*
var PLAYER = "Robot";
var ANNOUNCER = "Planet";
var BIG_TARGET = "Big Donut";
var LITTLE_TARGET = "Little Donut";
var EXTRA = "Octopus";
var START_BUTTON = "Start Button";
*/

var PLAYER = "Zombie";
var ANNOUNCER = "Skull";
var BIG_TARGET = "Big Bat";
var LITTLE_TARGET = "Little Bat";
var EXTRA = "Spider";
var START_BUTTON = "Start Button";


module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            timerHalfway: {bool: false, str: 'Added a condition to check when the timer has elapsed halfway (10 seconds).'},
            timeAnnounced: {bool: false, str: 'An announcement is made when timer is halfway up.'},
            pointAdded: {bool: false, str: 'Score changes by 1 when Big Donut is touched.'},
            youWin: {bool: false, str: 'Added a condition to check when the score exceeds a certain number of points.'},
            youWinAnnounced: {bool: false, str: 'An announcement tells the user they win when score is more than a number of points.'},
            scoreInitialized: {bool: false, str: 'Score is set to 0 when green flag and/or when start button is clicked.'},
            // TODO: should scoreInitialized be an extension? It isn't clearly specified on L2 student sheet
        }
        this.extensions = {
            instructions: {bool: false, str: 'Planet gives instructions for the number of points needed to win.'},
            littleTarget: {bool: false, str: 'Added second little target that changes score by multiple points when caught.'},
            extraFeatures: {bool: false, str: 'Additional features added (e.g. different broadcasts between sprites or new variables like "lives").'},
            // TODO: only have implemented checks for extra variables and broadcasts outside of the defaults
            // TODO: could more rigorously look for features like: new ways to score points, obstacles, limit on # of lives, etc
            // Note: in new zombie scratch project, they may have made the Spider an "obstacle", which is not a feature of the old Space Snacker
        }
    }

    // check if block is "set 'score' to 0"
    // user could name the variable "Score" or "score", so only checking for "core"
    checkScoreInit(block) {
        if (block.opcode === "data_setvariableto") {
            let setVar = block.fields.VARIABLE[0];
            let setNum = block.inputs.VALUE[1][1];

            if ((setVar.includes("core")) && (setNum === "0")) {
                this.requirements.scoreInitialized.bool = true;
            }
        }
    }

    gradePlayer(sprite) {
        // object to store potential broadcast messages to be sent out
        let broadcastMessages = {
            halftimeMessage: null,
            youWinMessage: null,
        };

        // iterate through each of the sprite's scripts that start with an event
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            let eventBlock = script.blocks[0];

            // scripts that start with "When Green Flag Clicked"
            if (eventBlock.opcode === "event_whenflagclicked") {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;
                    // check for set score/Score to 0
                    this.checkScoreInit(block);
                });
            }

            // scripts that start with "When I Receive 'start'"
            if ((eventBlock.opcode === "event_whenbroadcastreceived") && (eventBlock.fields.BROADCAST_OPTION[0] === "start")) {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    // check for set score/Score to 0
                    this.checkScoreInit(block);

                    if (opcode === "control_if") {
                        // create array of the blocks inside the If/Then block
                        let firstSubBlock = block.subScripts();
                        let firstSubscript = (firstSubBlock.length) ? firstSubBlock[0] : [];

                        let ifCondition = block.conditionBlock;  // the operator block

                        if (ifCondition !== null) {

                            // "If X = Y, Then..." blocks
                            if (ifCondition.opcode === "operator_equals") {
                                let input1 = ifCondition.inputs.OPERAND1[1][1];
                                let input2 = ifCondition.inputs.OPERAND2[1][1];

                                // check for an "if timer = 10" block
                                if (((input1 === "timer") && (input2 === "10")) || ((input1 === "1") && (input2 === "timer"))) {
                                    this.requirements.timerHalfway.bool = true;

                                    // check for a broadcast block, and store the broadcast message
                                    iterateBlocks(firstSubscript, (block, level) => {
                                        let opcode = block.opcode;

                                        if (opcode === "event_broadcast") {
                                            broadcastMessages.halftimeMessage = block.inputs.BROADCAST_INPUT[1][1];
                                        }
                                    });
                                }

                            // "If X > Y, then..." blocks
                            } else if (ifCondition.opcode === "operator_gt") {
                                let gtVar = ifCondition.inputs.OPERAND1[1][1];
                                let gtNum = ifCondition.inputs.OPERAND2[1][1];

                                // check for an "if score > #" block
                                // user could name the variable "Score" or "score", so only checking for "core"
                                if ((gtVar.includes("core")) && (gtNum > 1)) {
                                    this.requirements.youWin.bool = true;

                                    // check for a broadcast block, and store the broadcast message
                                    iterateBlocks(firstSubscript, (block, level) => {
                                        let opcode = block.opcode;

                                        if (opcode === "event_broadcast") {
                                            broadcastMessages.youWinMessage = block.inputs.BROADCAST_INPUT[1][1];
                                        }
                                    });
                                }

                            // "If X is touching Y, then..." blocks
                            } else if (ifCondition.opcode === "sensing_touchingobject") {
                                let touchMenu = ifCondition.toBlock(ifCondition.inputs.TOUCHINGOBJECTMENU[1]);
                                if ((touchMenu !== null) && (touchMenu.opcode === "sensing_touchingobjectmenu")) {
                                    let touchTarget = touchMenu.fields.TOUCHINGOBJECTMENU[0];

                                    // check for score change when player touches the Big or Little target
                                    // user could name the variable "Score" or "score", so only checking for "core"
                                    if (touchTarget === BIG_TARGET) {
                                        iterateBlocks(firstSubscript, (block, level) => {
                                            let opcode = block.opcode;

                                            // check for a "change 'score' by 1" block
                                            if (opcode === "data_changevariableby") {
                                                let changeNum = block.inputs.VALUE[1][1];
                                                let changeVar = block.fields.VARIABLE[0];

                                                if ((changeNum === "1") && (changeVar.includes("core"))) {
                                                    this.requirements.pointAdded.bool = true;
                                                }
                                            }
                                        });
                                    } else if (touchTarget === LITTLE_TARGET) {
                                        iterateBlocks(firstSubscript, (block, level) => {
                                            let opcode = block.opcode;

                                            // check for a "change 'score' by #>1" block
                                            if (opcode === "data_changevariableby") {
                                                let changeNum = block.inputs.VALUE[1][1];
                                                let changeVar = block.fields.VARIABLE[0];
                                                if ((+changeNum > 1) && (changeVar.includes("core"))) {
                                                    this.extensions.littleTarget.bool = true;
                                                }
                                            }
                                        });
                                    } else if (touchTarget === EXTRA) {
                                        // if there is any code for when Player touches Extra, extraFeature extension fulfilled
                                        // NOTE: in original Space Snacker project, there is no code for when Robot touches Octopus
                                        //       but in new draft of Zombie project, there may be added code where Spider is an "obstacle"
                                        if (firstSubscript.length != 0) {
                                            this.extensions.extraFeatures.bool = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        return broadcastMessages;
    }

    gradeAnnouncer(sprite, broadcastReturns) {
        let halftimeBroadcast = broadcastReturns.halftimeMessage;
        let youWinBroadcast = broadcastReturns.youWinMessage;

        // iterate through each of the sprite's scripts that start with event blocks
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            let eventBlock = script.blocks[0];

            // scripts that start with "When Green Flag Clicked"
            if (eventBlock.opcode === "event_whenflagclicked") {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    // check for set score/Score to 0
                    this.checkScoreInit(block);

                    // check for announcement of instructions for # of points needed to win
                    if (opcode.includes("looks_say")) {
                        let sayMessage = block.inputs.MESSAGE[1][1];
                        if (sayMessage.includes("points") && sayMessage.includes("win")) {
                            this.extensions.instructions.bool = true;
                        }
                    }
                });
            }

            // scripts that start with "When I Receive"
            if ((eventBlock.opcode === "event_whenbroadcastreceived")) {
                // if broadcast message is "start"
                if (eventBlock.fields.BROADCAST_OPTION[0] === "start") {
                    iterateBlocks(script, (block, level) => {
                        let opcode = block.opcode;
                        // check for set score/Score to 0
                        this.checkScoreInit(block);
                    });
                // if broadcast message is for halftime
                } else if ((halftimeBroadcast !== null) && (eventBlock.fields.BROADCAST_OPTION[0] === halftimeBroadcast)) {
                    iterateBlocks(script, (block, level) => {
                        let opcode = block.opcode;

                        if (opcode.includes("looks_say")) {
                            this.requirements.timeAnnounced.bool = true;
                        }
                    });
                // if broadcast message is for winning (when score > #)
                } else if ((youWinBroadcast !== null) && (eventBlock.fields.BROADCAST_OPTION[0] === youWinBroadcast)) {
                    iterateBlocks(script, (block, level) => {
                        let opcode = block.opcode;

                        if (opcode.includes("looks_say")) {
                            this.requirements.youWinAnnounced.bool = true;
                        }
                    });
                }
            }
        }
    }

    // grade sprites other than Player and Announcer
    // primarily to check for score initialization
    gradeOther(sprite) {
        // iterate through each of the sprite's scripts that start with event blocks
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            let eventBlock = script.blocks[0];

            if ((eventBlock.opcode === "event_whenflagclicked")
                || ((eventBlock.opcode === "event_whenbroadcastreceived") && (eventBlock.fields.BROADCAST_OPTION[0] === "start"))
                || ((eventBlock.opcode === "event_whenthisspriteclicked") && (sprite.name === START_BUTTON))) {

                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;
                    // check for set score/Score to 0
                    this.checkScoreInit(block);
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

        let broadcastReturns = {};
        let allStageBroadcasts = [];
        let allStageVariables = [];

        // iterate through json's targets
        for (var target of project.targets) {
            if (!(target.isStage)) {  // if target is a sprite
                if (target.name === PLAYER) {
                    broadcastReturns = this.gradePlayer(target);
                } else if (target.name === ANNOUNCER) {
                    // TODO: may have to store this target and grade it after the for loop,
                    // in case the Announcer is graded before the Player, and broadcast messages aren't stored
                    this.gradeAnnouncer(target, broadcastReturns);
                } else {
                    this.gradeOther(target);
                }
            } else {  // if target is a stage

                // store all variables in an array
                for (let variable in target.variables) {
                    allStageVariables.push(target.variables[variable][0]);
                }

                // store all broadcast messages in an array
                for (let msg in target.broadcasts) {
                    allStageBroadcasts.push(target.broadcasts[msg]);
                }
            }
        }

        // if user adds any additional variables (other than "timer" and "score"/"Score")
        // then the extra features extension is fulfilled
        for (let varIndex in allStageVariables) {
            if (!(["timer", "score", "Score"].includes(allStageVariables[varIndex]))) {
                this.extensions.extraFeatures.bool = true;
            }
        }

        // if user adds any additional broadcast messages (other than "start", "gameover", or their messages for halftime or youwin)
        // then the extra features extension is fulfilled
        let defaultMsgs = ["start", "gameover"];
        if (broadcastReturns.halftimeMessage) defaultMsgs.push(broadcastReturns.halftimeMessage);
        if (broadcastReturns.youWinMessage) defaultMsgs.push(broadcastReturns.youWinMessage);

        for (let msgIndex in allStageBroadcasts) {
            if (!(defaultMsgs.includes(allStageBroadcasts[msgIndex]))) {
                this.extensions.extraFeatures.bool = true;
            }
        }
    }
}
