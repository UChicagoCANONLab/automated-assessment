/*
Act 1 About Me Grader
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };
        this.requirements.interactiveSprite = { bool: false, str: 'Project has at least one interactive sprite with a multi-block script attached' };
        this.requirements.nonInteractiveSprite = { bool: false, str: 'Proejct has at least one non-interactive sprite with a multi-block script attached to it' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;

        let scriptLengthInteractive = 0;
        let scriptLengthNotInteractive = 0;
        let isInteractive = false;
        let numSprites = project.sprites.length;

        for (let target of project.targets) {
            for (let block in target.blocks) {
                console.log(target.blocks[block].opcode)
                if (target.blocks[block].opcode === "event_whenthisspriteclicked") {
                    isInteractive = true;
                    if (isInteractive) {
                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            scriptLengthInteractive++;
                        }
                        if (scriptLengthInteractive > 1) {
                            this.requirements.interactiveSprite.bool = true;
                            break;
                        }
                    }
                    else {
                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            scriptLengthInteractive++;
                        }
                        if (scriptLengthInteractive > 1) {
                            this.requirements.interactiveSprite.bool = true;
                            break;
                        } 
                    }
                }
            }
        }

        if (numSprites >= 1) {
            this.requirements.hasOneSprite.bool = true;
        }

    }
}
