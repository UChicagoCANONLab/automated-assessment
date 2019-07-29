/* Decomposition by Sequence L2 Autograder
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
            addBackdrop: {bool: false, str: 'Added a new backdrop.'},  
            addThreeSprites: {bool: false, str: 'Added at least three sprites.'},
            twoSpritesGoTo: {bool: false, str: 'Two sprites use the "goto x:_ y:_" block.'},
            touchingBlock: {bool: false, str: 'Two sprites use "wait until touching" and/or "repeat until touching".'},
            sequentialAction: {bool: false, str: 'Two sprites have sequential action.'},
            //TODO: do the touching and sequentialaction reqs have to be under the same event block?
        }
        this.extensions = {
            thirdSprite: {bool: false, str: 'The third sprite has a new event with different actions.'},
            soundBlock: {bool: false, str: 'The project uses a sound block.'},
        }
    }

    gradeSprite(sprite) {
        var knownBlocks = [
            'event_whenflagclicked',
            'motion_gotoxy', 
            'motion_movesteps', 
            'looks_costume', 
            'looks_switchcostumeto',  
            'control_wait',
            'control_wait_until',
            'control_repeat',
            'control_repeat_until',
            'sound_play',
            'sound_playuntildone'
        ];

        var goTo = false;
        var touching = false;
        var seqAction = false;
        var diffActions = false; 

        var actionBlocks = [
            'motion_movesteps', 
            'looks_costume', 
            'looks_switchcostumeto',  
            'control_wait',
        ];

        var foundMove = false;
        var foundCostume = false;
        var foundWait = false; 

        // iterate through the sprite's scripts that start with an event block 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            
            var eventBlock = script.blocks[0]; 
            if (eventBlock.next !== null) {
                iterateBlocks(script, (block, level) => {
                    var opcode = block.opcode;
                    var currLevel = level;

                    // if sprite uses goto block
                    goTo = goTo || opcode.includes("motion_gotoxy");

                    // if sprite uses wait until touching or repeat until touching blocks
                    if (["control_wait_until", "control_repeat_until"].includes(opcode)) {
                        var inputCond = conditionBlock();  // the input condition block
                        if (inputCond !== null) {
                            if (["sensing_touchingcolor", "sensing_touchingobject", "sensing_touchingobjectmenu", "sensing_coloristouchingcolor"].includes(inputCond.opcode)) 
                                touching = true;
                        }
                    }

                    // if sprite uses new action blocks
                    if (!(knownBlocks.includes(opcode)) && (opcode.includes("motion_") || opcode.includes("looks_"))) {
                        diffActions = true;
                    }

                    // if sprite uses a sound block 
                    if (["sound_play", "sound_playuntildone"].includes(opcode)) {
                        this.extensions.soundBlock.bool = true;
                    } 

                    // search for sequential action blocks (wait, move, change costume) in any order
                    if (actionBlocks.includes(opcode) && (seqAction === false)) {
                        var currBlock = block;
                        var nextBlock = block.next;
                        if (nextBlock && nextBlock.next) {  // if a group of 3 blocks exist
                            var thirdBlock = nextBlock.next;
                            // only check groups of three sequential blocks that are all potential seqAction blocks 
                            if (actionBlocks.includes(nextBlock.opcode) && actionBlocks.includes(thirdBlock.opcode)) { 
                                if (currBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto'].includes(currBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (currBlock.opcode.includes("control_wait")) { 
                                    foundWait = true; 
                                }

                                if (nextBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto'].includes(nextBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (nextBlock.opcode.includes("control_wait")) { 
                                    foundWait = true; 
                                }

                                if (thirdBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto'].includes(thirdBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (thirdBlock.opcode.includes("control_wait")) {
                                    foundWait = true; 
                                }

                                // if one of each kind of seqAction blocks is found in the sequence of three given blocks
                                if (foundMove && foundCostume && foundWait) {
                                    seqAction = true; 
                                } else {  // if not, reset the flags
                                    foundMove = false;
                                    foundCostume = false;
                                    foundWait = false;
                                }
                            }
                        }                         
                    }
                    
                    
                    
                    
                });
            }
        }        

        return {
            name: sprite.name,
            usesGoTo: goTo,
            usesTouching: touching,
            hasSeqAction: seqAction,
            hasDiffActions: diffActions,
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        var totalSprites = 0;
        var newSprites = 0;
        var numSpritesGoTo = 0;
        var numSpritesTouching = 0;
        var numSpritesSeqAction = 0;
        var numSpritesDiffAction = 0;

        for(var target of project.targets) {
            if (target.isStage) {
                // checks if student changed from default blank backdrop
                // TODO: does not check if the student painted over the white backdrop
                if (target.costumes[0].name !== 'backdrop1' || target.costumes.length > 1) {
                    this.requirements.addBackdrop.bool = true; 
                }
                continue; 
            } else {    // if not a stage, then it's a sprite
                totalSprites++;

                // if they change from using the default cat sprite
                if (target.name !== 'Sprite1' || target.costumes.length > 2) {
                    newSprites++;
                }

                var currSprite = this.gradeSprite(target);

                if (currSprite.usesGoTo) numSpritesGoTo++;
                if (currSprite.usesTouching) numSpritesTouching++;
                if (currSprite.hasSeqAction) numSpritesSeqAction++;
                if (currSprite.hasDiffActions) numSpritesDiffAction++;
            }
        }
        if (newSprites >= 3) this.requirements.addThreeSprites.bool = true;
        if (numSpritesGoTo >= 2) this.requirements.twoSpritesGoTo.bool = true;
        if (numSpritesTouching >= 2) this.requirements.touchingBlock.bool = true;
        if (numSpritesSeqAction >= 2) this.requirements.sequentialAction.bool = true;

        if ((numSpritesDiffAction >= 3) || ((totalSprites >= 3) && (numSpritesDiffAction >= 1))) {
            this.extensions.thirdSprite.bool = true;
            // TODO: test for edge cases, probs doesnt cover everything
            // if sprites w events >=3 and sprites w diff actions >=1
        }

 
    }


}