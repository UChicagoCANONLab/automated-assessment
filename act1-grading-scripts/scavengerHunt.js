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
        this.requirements.fredMoves = { bool: false, str: 'Fred the fish moves all the way across the stage' };
        this.requirements.helenChangesColorFaster = { bool: false, str: 'Helen the crab changes colors fasters' };
        this.requirements.helenDifferentColor = { bool: false, str: 'Helen changes to a different color when clicked' };
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
        let numMoveMisc = 0;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Fred') {
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            if ((script.blocks[i].opcode === 'looks_say') || (script.blocks[i].opcode === 'looks_sayforsecs')) {
                                let dialogue = (script.blocks[i].inputs.MESSAGE[1][1]).toLowerCase();
                                let punctuationless = dialogue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString = punctuationless.replace(/\s{2,}/g, " ");
                                finalString = finalString.replace(/\s+/g, '');
                                if (finalString === 'havefun') {
                                    haveFunFred = true;
                                    //this.requirements.fredSaysHaveFun.bool = true;
                                }
                            }

                            if (script.blocks[i].opcode === 'motion_movesteps') {
                                numMoveFred++;
                            }
                        }
                    }
                    if (numMoveFred > 3) {
                        fredMoves = true;
                        //this.requirements.fredMoves.bool = true;
                    }
                }

                else if (target.name === 'Helen') {
                    let origWait = 1;
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[i].opcode === 'control_repeat') {
                                let substack = script.blocks[i].inputs.SUBSTACK[1];
                                if (target.blocks[substack].inputs.DURATION[1][1] < 1) {
                                    //this.requirements.helenChangesColor.bool = true;
                                    helenSpeed = true;
                                }
                            }
                            if (script.blocks[0].opcode === "event_whenthisspriteclicked") {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    if (script.blocks[i].opcode === 'looks_switchcostumeto') {
                                        //this.requirements.helenDifferentColor.bool = true;
                                        helenColor = true;
                                    }
                                }

                            }
                        }
                    }
                }
                else {
                    for (let block in target.blocks) {
                        if ((target.blocks[block].opcode === 'looks_say') || (target.blocks[block].opcode === 'looks_sayforsecs')) {
                            let dialogue1 = (target.blocks[block].inputs.MESSAGE[1][1]).toLowerCase()
                            let punctuationless1 = dialogue1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                            let finalString1 = punctuationless1.replace(/\s{2,}/g, " ");
                            finalString1 = finalString1.replace(/\s+/g, '');
                            if (finalString1 === 'havefun') {
                                haveFunMisc = true;
                            }
                        }

                        if (target.blocks[block].opcode === 'motion_movesteps') {
                            numMoveMisc++;
                        }

                        if (target.blocks[block].opcode === 'control_repeat') {
                            let substack1 = target.blocks[block].inputs.SUBSTACK[1];
                            if (target.blocks[substack1].inputs.DURATION[1][1] < 1) {
                                miscSpeed = true;
                            }
                        }

                        if (target.blocks[block].opcode === 'looks_switchcostumeto') {
                            if (target.blocks[block].next === "ohLm|%[frcYkDCD02Izs" && target.blocks[block].parent === "N_^HGxU/.EOLU(;~p]Hp") {
                                continue;
                            } else {
                                miscColor = true;
                            }
                        }
                    }
                }
                if (numMoveMisc > 3) {
                    miscMoves = true;
                }
            }
        }
        if (haveFunFred || haveFunMisc) {
            this.requirements.fredSaysHaveFun.bool = true;
        }

        if (fredMoves || miscMoves) {
            this.requirements.fredMoves.bool = true;
        }

        if (helenColor || miscColor) {
            this.requirements.helenDifferentColor.bool = true;
        }

        if (helenSpeed || miscSpeed) {
            this.requirements.helenChangesColorFaster.bool = true;
        }
    }
}


