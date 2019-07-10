/*
Act 1 Build-a-Band Project Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.guitar = { bool: false, str: 'Script added for guitar (including event and action block)' }
        this.requirements.sprite = { bool: false, str: 'Added at least one new sprite' };
        this.requirements.script = { bool: false, str: 'At least one of the new sprites has a script' };
        this.requirements.cat = { bool: false, str: 'Cat animated using loop with wait block and motion (including changing costumes and size)' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        for (let target of project.targets) {
            if (!target.isStage) {
                if (target.name === 'Sprite2') {
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            for (let i = block; i !== null; i = target.blocks[i].next) {
                                let opc = target.blocks[i].opcode;
                                if ((opc === 'control_forever')
                                    || (opc.includes('control_repeat'))) {
                                    if (target.blocks[i].inputs.SUBSTACK[1] !== null) {
                                        let wait = 0;
                                        let nextCostChangeSize = 0;
                                        let switchCostSize = 0;
                                        let motion = 0;
                                        for (let j = target.blocks[i].inputs.SUBSTACK[1];
                                            j !== null; j = target.blocks[j].next) {
                                                let opc2 = target.blocks[j].opcode;
                                                switch (opc2) {
                                                    case 'control_wait': wait++; break;
                                                    case 'looks_nextcostume': nextCostChangeSize++; break;
                                                    case 'looks_switchcostumeto': switchCostSize++; break;
                                                    case 'looks_setsizeto': switchCostSize++;break;
                                                    case 'looks_changesizeby': nextCostChangeSize++;break;
                                                }
                                                if (opc2.includes('motion_')) { motion++ };

                                            }
                                        if (wait && (nextCostChangeSize || motion || (switchCostSize > 1))) {
                                            this.requirements.cat.bool = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (target.name === 'Guitar-Electric') {
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
                                this.requirements.guitar.bool = true;
                            }
                        }
                    }
                }

                if ((target.name != 'Sprite2') &&
                    (target.name != 'Trumpet') &&
                    (target.name != 'Drum-Bass') &&
                    (target.name != 'Guitar-Electric')) {
                    this.requirements.sprite.bool = true;
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
                                this.requirements.script.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
}

