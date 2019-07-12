/* Scratch Basics L1 Autograder
Updated Version: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.changeFredSteps = {bool: false, str: 'The number of steps Fred takes is changed to 100.'};
        this.requirements.addSayBlock = {bool: false, str: 'Fred the user tells the user to "Have fun!"'};
        this.requirements.increaseWaitTime = {bool: false, str: 'The wait time between costume changes is increased'};
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../grading-scripts-s3/basicsOriginal'), null);

        this.initReqs();

        let originalTime = 0;
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Helen') {
                for (let block in origTarget.blocks) {
                    if (origTarget.blocks[block].opcode === 'control_wait') {
                        originalTime = origTarget.blocks[block].inputs.DURATION[1][1];
                    }
                }
            }
        }

        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
            else {
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'motion_movesteps') {
                        let steps = target.blocks[block].inputs.STEPS[1][1];
                        if (steps === (100).toString()) {
                            this.requirements.changeFredSteps.bool = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'looks_sayforsecs') {
                        let haveFun = target.blocks[block].inputs.MESSAGE[1][1];
                        if (haveFun.toLowerCase() === 'have fun!') {
                            this.requirements.addSayBlock.bool = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'control_wait') {
                        if (originalTime<target.blocks[block].inputs.DURATION[1][1]) {
                            this.requirements.increaseWaitTime.bool = true;
                        }
                    }
                    
                }
            }
        }
    }
}