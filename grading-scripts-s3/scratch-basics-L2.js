/* Scratch Basics L2 Autograder
Updated Version: Anna Zipp, Summer 2019
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
            addSprite: {bool: false, str: 'Added a new sprite.'},
            greenFlagBlock: {bool: false, str: 'The main sprite has a script with the "when green flag clicked" block.'},
            goToBlock: {bool: false, str: 'The main sprite starts in the same place every time.'},
            sayBlock: {bool: false, str: 'The main sprite says something.'},
            moveBlock: {bool: false, str: 'The main sprite moves.'},
        }
        this.extensions = {
            secondEvent: {bool: false, str: 'Added another script with the "when sprite clicked" or "when key pressed" event.'},
            newBlocks: {bool: false, str: "Project uses new blocks you haven't seen before."},
            //TODO: spreadsheet doesn't have the newBlocks extension???
            secondSprite: {bool: false, str: 'Added a second sprite.'},
            secondSpriteMoves: {bool: false, str: 'Second sprite moves or does tricks.'},
            //TODO: should the second sprite requirements be combined
        }
    }

    // helper function that reports all possible requirements met by a sprite
    gradeSprite(sprite) {
        var knownBlocks = [
            'event_whenflagclicked',
            'motion_gotoxy', 
            'motion_movesteps',
            "looks_say",
            'looks_sayforsecs', 
            'event_whenkeypressed',
            "looks_costume", 
            'looks_switchcostumeto', 
            'control_repeat', 
            'event_whenthisspriteclicked' 
        ];

        var highestScriptStats = {
            flag: false,
            goTo: false,
            move: false,
            say: false  
        }
        var highestScriptScore = 0;
        var newEvent = false; 
        var tricks = false;
        var unknownBlock = false; 

        // iterate through the sprite's scripts that start with an event block 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            var scriptStats = {flag: false, goTo: false, move: false, say: false};
            var eventBlock = script.blocks[0];

            if (eventBlock.opcode.includes('event_whenflagclicked')) {
                if (eventBlock.next !== null) {
                    scriptStats.flag = true; 

                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode; 
        
                        if (opcode.includes("motion_")) {
                            tricks = true; 
                            scriptStats.goTo = scriptStats.goTo || opcode.includes("motion_gotoxy");
                            scriptStats.move = scriptStats.move || opcode.includes("motion_movesteps");
                        }
                        scriptStats.say = scriptStats.say || ["looks_say", "looks_sayforsecs"].includes(opcode);
                        if (!(knownBlocks.includes(opcode))) {
                            unknownBlock = true;
                        }
                    });
                }
            } else {
                if (['event_whenthisspriteclicked', 'event_whenkeypressed'].includes(eventBlock.opcode)) {
                    if (eventBlock.next !== null) {
                        newEvent = true; 
                    }
                }
                if (tricks === false) {    // check remaining event scripts for tricks, if still false 
                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode;
                        if (opcode.includes("motion_"))
                            tricks = true; 
                    });
                }
                if (unknownBlock === false) {    // check for unknown blocks, if still false
                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode;
                        if (!(knownBlocks.includes(opcode))) {
                            unknownBlock = true;
                        }
                    });
                }
            }

            var scriptScore = Object.values(scriptStats).reduce((sum,val) => sum + val, 0);
            // find highest script score
            if (scriptScore >= highestScriptScore) {
                highestScriptStats = scriptStats;
                highestScriptScore = scriptScore; 
            }
        }

        return {
            name: sprite.name,
            stats: highestScriptStats,
            statsScore: highestScriptScore,
            doesTricks: tricks,
            hasSecondEvent: newEvent,
            usedNewBlocks: unknownBlock
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        var numSprites = 0;
        var numMovingSprites = 0;
        var mainSprite = null;

        for(var target of project.targets) {
            if (target.isStage) {
                //TODO: if you paint over the blank backdrop, it doesn't count as a new backdrop
                // if student changed backdrop from the default blank one
                if (target.costumes[0].name !== 'backdrop1' || target.costumes.length > 1) {
                    this.requirements.addBackdrop.bool = true; 
                }
                continue; 
            } else {    // if not a stage, then it's a sprite
                numSprites++; 

                // if they change from using the default cat sprite 
                if (target.name !== 'Sprite1' || target.costumes.length > 2) {  
                    this.requirements.addSprite.bool = true;
                }

                var currSprite = this.gradeSprite(target);
                // find main sprite
                if (!(mainSprite) || (currSprite.statsScore > mainSprite.statsScore)) {
                    mainSprite = currSprite; 
                } 
                if ((currSprite.statsScore === mainSprite.statsScore) && currSprite.hasSecondEvent) {
                    mainSprite = currSprite; 
                }
                // increase counter for every sprite that moves
                if (currSprite.doesTricks) numMovingSprites++;
                
                //TODO: is the Second Event extension only for the main sprite?
                if (currSprite.hasSecondEvent) {
                    this.extensions.secondEvent.bool = true; 
                }
                //TODO: this extension wasnt in the spreadsheet?
                if (currSprite.usedNewBlocks) {
                    this.extensions.newBlocks.bool = true;
                }
            }
        }   

        if (numSprites > 1) {
            this.extensions.secondSprite.bool = true; 
        }
        if (numMovingSprites > 1) {
            this.extensions.secondSpriteMoves.bool = true; 
        }

        this.requirements.greenFlagBlock.bool = mainSprite.stats.flag;
        this.requirements.goToBlock.bool = mainSprite.stats.goTo;
        this.requirements.moveBlock.bool = mainSprite.stats.move;
        this.requirements.sayBlock.bool = mainSprite.stats.say;
    }
}