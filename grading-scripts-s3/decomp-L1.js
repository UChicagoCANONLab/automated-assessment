/* Decomposition By Sequence L1 Autograder
 * Scratch 2 (original) version: Max White, Summer 2018
 * Scratch 3 updates: Elizabeth Crowdus, Spring 2019
 * Reformatting, bug fixes, and updates: Anna Zipp, Summer 2019
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

module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            jaimeRepeats: {bool: false, str: 'Jaime has a "Repeat Until Touching Soccer Ball" script under "When Green Flag Clicked".'},
            jaimeMoves: {bool: false, str: 'Jaime has a "Move" block within his "Repeat Until" loop.'},
            ballWaitsUntil: {bool: false, str: 'Soccer Ball has a "Wait Until Touching Jaime" block under "When Green Flag Clicked".'},
            ballRepeats: {bool: false, str: 'Soccer Ball has a "Repeat Until Touching Goal" script under "When Green Flag Clicked".'},
            ballMoves: {bool: false, str: 'Soccer Ball has a "Move" block within its "Repeat Until" loop.'},
        }

        this.extensions = {
            cheerSounds: {bool: false, str: 'Cheer sound plays when ball is touching the goal.'},
            ballBounces: {bool: false, str: 'Ball bounces off the goal.'},
            //kickAgain: {bool: false, str: 'Jaime kicks the ball again if it bounces off the goal.'},
            //TODO: should bounce and kick again be combined? Is kickAgain too complicated to look for?
            jaimeJumps: {bool: false, str: 'Jaime jumps up and down to celebrate a goal.'},
            goalieAdded: {bool: false, str: 'Added a goalie sprite.'},
            goalieBlocks: {bool: false, str: 'Ball bounces away if it hits the goalie.'},
            goalieMovesLeft: {bool: false, str: 'Goalie moves to the left when Left Arrow Key is pressed.'},
            goalieMovesRight: {bool: false, str: 'Goalie moves to the right when Right Arrow Key is pressed.'},
            jaimeWaitBlock: {bool: false, str: 'Jaime uses a "Wait" block in his "Repeat Until" loop.'},
            jaimeNextCostume: {bool: false, str: 'Jaime is animated by a "Next Costume" block in the "Repeat Until" loop.'},
            ballWaitBlock: {bool: false, str: 'Soccer Ball uses a "Wait" block in its "Repeat Until" loop.'},
        }
    }

    // given a block that has an input conditon, check if it is a Touching condition
    // and return the opcode of what its touching target conditon is
    getCondOpcode(block) {
        let targetCond;
        let inputCond = block.conditionBlock();  // the input condition block       
        if ((inputCond !== null) && ("sensing_touchingobject" === inputCond.opcode)) {
            // find the specific field entered into the input condition block
            let condSelected = inputCond.toBlock(inputCond.inputs.TOUCHINGOBJECTMENU[1]);                          
            if ((condSelected !== null) && (condSelected.opcode === "sensing_touchingobjectmenu")) {
                targetCond = condSelected.fields.TOUCHINGOBJECTMENU[0];
            }
        }
        return targetCond;
    }

    // Check the blocks/scripts only inside a conditional loop 
    gradeCondLoop(block, targetCondition) {
        let condLoopReqs = {
            repeatLoop: false,
            moveBlock: false,
            waitBlock: false,
            costumeBlock: false,
        };

        // check block's condition input
        let blockCond = this.getCondOpcode(block);            

        // if the correct targetCondition is selected ("Soccer Ball" if sprite is Jaime, or vice versa)
        if (blockCond === targetCondition) {
            condLoopReqs.repeatLoop = true;

            // check for other required blocks inside the Repeat Until loop
            var repeatUntilSubs = block.subScripts();
            for (var subScript of repeatUntilSubs) {
                iterateBlocks(subScript, (block, level) => {
                    let subop = block.opcode; 

                    if (subop === 'motion_movesteps') {
                        condLoopReqs.moveBlock = true; 
                    }
                    if (subop === 'control_wait') {
                        condLoopReqs.waitBlock = true;
                    }
                    if (['looks_nextcostume', 'looks_switchcostumeto'].includes(subop)) {
                        condLoopReqs.costumeBlock = true;
                    }
                });
            }                                   
        }
        return condLoopReqs;
    }

    // Check remaining blocks outside of/after a condition (either after loops or inside ifs) for sound and movement
    // must be given a Wait Until, Repeat Until, If, or If/Then block
    // here, any sound counts as a cheer, but code to restrict the sound to cheers only is there, but commented out
    checkAfter(block) {
        let extns = {
            soundPlays: false,
            movement: false,
            repeatedMovement: false,
        };
        let opcode = block.opcode;
        let remainingBlocks;

        if ((opcode === "control_wait_until") || (opcode === "control_repeat_until")) {
            remainingBlocks = block.childBlocks();
        } else if (opcode.includes("control_if")) { 
            // restrict remainingBlocks to the blocks within the If
            let nextIf = block.toBlock(block.inputs.SUBSTACK[1]);
            remainingBlocks = nextIf.childBlocks();
        }
        
        for (let rBlock of remainingBlocks) {
            let rCode = rBlock.opcode;

            // check for sound block
            if (["sound_playuntildone","sound_play"].includes(rCode)) {             
                // check if sound block plays a sound
                let soundBlock = rBlock.toBlock(rBlock.inputs.SOUND_MENU[1]);
                if (soundBlock !== null) {
                    let soundSelected = soundBlock.fields.SOUND_MENU[0];
                    if (soundSelected !== null) {
                        extns.soundPlays = true;
                        /* if you want to restrict the sound to only "cheer", "Cheer", or "Goal Cheer"
                        commented out for now, bc some students may want to use different sounds   
                        if ((soundSelected.includes("cheer")) || soundSelected.includes("Cheer")) {
                            cheerSelected = true;
                        }
                        */
                    }
                }
            // check for movement after condition is met    
            } else if (rCode.includes("motion_move") || rCode.includes("motion_goto") || rCode.includes("motion_glide")) {
                extns.movement = true;
            }
        }
        return extns;
    }

    gradeJaime(sprite) {
        let condLoopReqs;
        // iterating through each of the sprite's scripts that start with the event 'When Green Flag Clicked' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenflagclicked"))) {  
            iterateBlocks(script, (block, level) => {
                let opcode = block.opcode;
                
                if (opcode.includes("control_repeat_until")) {
                    condLoopReqs = this.gradeCondLoop(block, "Soccer Ball");
                    if (condLoopReqs.repeatLoop) this.requirements.jaimeRepeats.bool = true;
                    if (condLoopReqs.moveBlock) this.requirements.jaimeMoves.bool = true;
                    if (condLoopReqs.waitBlock) this.extensions.jaimeWaitBlock.bool = true;
                    if (condLoopReqs.costumeBlock) this.extensions.jaimeNextCostume.bool = true;
                }

                // TODO: this just checks if Jaime has a "change/set y" block in his scripts
                // more rigorous evaluation should check WHEN he uses those blocks, and also check other types of motion
                // however, most kids didn't seem to implement this extension anyways
                if (["motion_changeyby", "motion_sety"].includes(opcode)) {
                    this.extensions.jaimeJumps.bool = true;
                }
            });
        }
    }

    gradeBall(sprite) {
        let condLoopReqs;
        let afterCondReqs;

        // iterating through each of the sprite's scripts that start with the event 'When Green Flag Clicked' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenflagclicked"))) { 
            iterateBlocks(script, (block, level) => {
                let opcode = block.opcode;
                let targetCond = this.getCondOpcode(block);
                
                if (opcode.includes("control_wait_until")) {
                    // If Ball has "Wait Until Touching _" block
                    if (targetCond === "Jaime ") {
                        this.requirements.ballWaitsUntil.bool = true;
                    } else if (targetCond === "Goal") {
                        afterCondReqs = this.checkAfter(block); 
                        if (afterCondReqs.soundPlays) this.extensions.cheerSounds.bool = true;
                    }
                } else if (opcode.includes("control_repeat_until")) {
                    condLoopReqs = this.gradeCondLoop(block, "Goal");
                    if (condLoopReqs.repeatLoop) this.requirements.ballRepeats.bool = true;
                    if (condLoopReqs.moveBlock) this.requirements.ballMoves.bool = true;
                    if (condLoopReqs.waitBlock) this.extensions.ballWaitBlock.bool = true;

                    afterCondReqs = this.checkAfter(block);
                    if (afterCondReqs.movement) this.extensions.ballBounces.bool = true;
                    if (afterCondReqs.soundPlays) this.extensions.cheerSounds.bool = true;
                } else if (opcode.includes("control_if")) {
                    afterCondReqs = this.checkAfter(block);

                    if (targetCond === "Goal") {
                        if (afterCondReqs.soundPlays) this.extensions.cheerSounds.bool = true;
                    } else if (!(["Goal", "Jaime "].includes(targetCond))) {//&& totnumSprites > 3? ) {
                        // if ball moves after "If touching goalie", goalieBlocks req fulfilled
                        // TODO: probably need to check this req more rigorously 
                        if (afterCondReqs.movement) this.extensions.goalieBlocks.bool = true; 
                    } 
                }
            });
        }
    }

    gradeGoal(sprite) {
        // iterating through each of the sprite's scripts that start with the event 'When Green Flag Clicked' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenflagclicked"))) {  
            iterateBlocks(script, (block, level) => {
                let opcode = block.opcode;
                
                if (["control_wait_until","control_if"].includes(opcode)) {
                    let targetCond = this.getCondOpcode(block);
                    if (targetCond === "Soccer Ball") {
                        let afterCond = this.checkAfter(block);
                        if (afterCondReqs.soundPlays) this.extensions.cheerSounds.bool = true;
                    }
                }
            });
        } 
    }

    gradeGoalie(sprite) {
        // iterating through each of the sprite's scripts that start with the event 'When _ Key Pressed' 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenkeypressed"))) { 
            let eventBlock = script.blocks[0];
            let keyOption = eventBlock.fields.KEY_OPTION[0];
 
            if (keyOption === "left arrow") {
                let pointedLeft = false;
                let negSteps = false;
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode; 
                    if (opcode.includes("motion_pointindirection")) {
                        if (block.inputs.DIRECTION[1][1][0] === "-") {  // if first character is - (negative)
                            pointedLeft = true;
                        }
                    }
                    if (["motion_movesteps", "motion_glide"].includes(opcode)) {
                        if (block.inputs.STEPS[1][1][0] === "-") {  // if first character is - (negative)
                            negSteps = true;
                        }
                    }
                });

                if ((pointedLeft && !negSteps) || (!pointedLeft && negSteps)) {
                    this.extensions.goalieMovesLeft.bool = true;
                }
            } else if (keyOption === "right arrow") {
                let pointedRight = true;
                let negSteps = false;
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode; 
                    if (opcode.includes("motion_pointindirection")) {
                        if (block.inputs.DIRECTION[1][1][0] === "-") {  // if first character is - (negative)
                            pointedRight = false;
                        }
                    }
                    if (["motion_movesteps", "motion_glide"].includes(opcode)) {
                        if (block.inputs.STEPS[1][1][0] === "-") {  // if first character is - (negative)
                            negSteps = true;
                        }
                    }
                });  
                
                if ((pointedRight && !negSteps) || (!pointedRight && negSteps)){
                    this.extensions.goalieMovesRight.bool = true; 
                }
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

                if (target.name === "Jaime ") {
                    this.gradeJaime(target);
                } else if (target.name === "Soccer Ball") {
                    this.gradeBall(target);
                } else if (target.name === "Goal") {
                    if (!(this.extensions.cheerSounds.bool)) {
                        this.gradeGoal(target);
                    } 
                } else {   // if not Jaime, Ball, or Goal, sprite must be added goalie
                    this.extensions.goalieAdded.bool = true;
                    this.gradeGoalie(target);
                }
            }
        }
    }    
}