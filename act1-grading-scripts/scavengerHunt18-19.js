/* 
Scavenger Hunt Autograder
Initial Version and testing: Saranya Turimella
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.fredSaysHaveFun = { bool: false, str: 'Fred the fish says "Have fun!"' };
        this.requirements.fredChangeSteps = { bool: false, str: 'Change the number of steps that Fred the Fish takes each time he talks, to 100 rather than 50.' };
        this.requirements.helenChangesColorSlower = { bool: false, str: 'Increase the wait time between costume changesy' };
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        if (!is(fileObj)) return;

        let haveFunFred = false;
        let haveFunMisc = false;
        let fredMoves = false;
        let miscMoves = false;
        let helenColor = false;
        let miscColor = false;
        let helenSpeed = false;
        let miscSpeed = false;
        let numMoveFred = 0;
        let distanceMoveFred = 0;
        let distanceMoveMisc = 0;

        let requiredSteps = 300;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                // looks in sprite names fred for a say block, move block
                if (target.name === 'Fred') {
                    for (let script of target.scripts) {
                        for (let block of script.allBlocks()) {
                            if ((block.opcode === 'looks_sayforsecs')) {
                                let dialogue = (block.textInput('MESSAGE')).toLowerCase();
                                let punctuationless = dialogue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString = punctuationless.replace(/\s{2,}/g, " ");
                                finalString = finalString.replace(/\s+/g, '');
                                if (finalString === 'havefun') {
                                    haveFunFred = true; 
                                }
                            }

                            if (block.opcode === 'motion_movesteps') {
                                numMoveFred++;
                                distanceMoveFred += block.floatInput('STEPS');
                            }
                        }
                    }
                    // if a move block is added, the boolean of fred moving is set to true
                    if (distanceMoveFred > requiredSteps) {
                        fredMoves = true;
                    }
                }

                // looks through helen to find the  speed that she changes costuems at, if it is less than one
                // boolean that means she changes costumes faster is set to true
                else if (target.name === 'Helen') {
                    for (let script of target.scripts) {
                        for (let block of script.allBlocks()) {
                            if (block.opcode === 'control_repeat') {
                                let subscript = block.subscripts[0];
                                if(!subscript)
                                {
                                    continue;
                                }
                                for (let block of subscript.blocks) {
                                    if (block.opcode = 'control_wait') {
                                        if (block.floatInput('DURATION') > 2) {
                                            helenSpeed = true;
                                        }
                                    }
                                }
                            }
                            // when helen is clicked, she changes to a different color
                            if (script.blocks[0].opcode === "event_whenthisspriteclicked") {
                                for (let block of script.blocks) {
                                    if (['looks_nextcostume'].includes(block.opcode)) {
                                        helenColor = true;
                                    }
                                }

                            }
                        }
                    }
                }
                // deals with the cases if the sprite names are changed from fred and helen
                else {
                    for (let script of target.scripts)
                    {
                        for (let block of script.allBlocks()) {
                            if ((block.opcode === 'looks_sayforsecs')) {
                                let dialogue1 = block.textInput('MESSAGE').toLowerCase()
                                let punctuationless1 = dialogue1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString1 = punctuationless1.replace(/\s{2,}/g, " ");
                                finalString1 = finalString1.replace(/\s+/g, '');
                                // checks that have fun is said
                                if (finalString1 === 'havefun') {
                                    haveFunMisc = true;
                                }
                            }

                            // motion block is used
                            if (block.opcode === 'motion_movesteps') {
                                distanceMoveMisc += block.floatInput('STEPS');
                            }

                            // speed at which the sprite changes costumes is changed
                            if (block.opcode === 'control_repeat') {
                                let subscript = block.subscripts[0];
                                for (let block of subscript.blocks) {
                                    if (block.opcode === 'control_wait') {
                                        if (block.floatInput('DURATION') > 2) {
                                            miscSpeed = true;
                                        }
                                    }
                                }
                            }

                            // Guide instructs students to add a next costume block
                            if (block.opcode === 'looks_nextcostume') {
                                miscColor = true;
                            }
                        }

                    }
                }
                if (distanceMoveMisc > requiredSteps) {
                    miscMoves = true;
                }
            }
        }
        // for all requirements, if the specific sprite does it or ANY sprite does it, the requirement is set to true
        if (haveFunFred || haveFunMisc) {
            this.requirements.fredSaysHaveFun.bool = true;
        }

        if (fredMoves || miscMoves) {
            this.requirements.fredChangeSteps.bool = true;
        }

        if (helenSpeed || miscSpeed) {
            this.requirements.helenChangesColorSlower.bool = true;
        }
    }
}