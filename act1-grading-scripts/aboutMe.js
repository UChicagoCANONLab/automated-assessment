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
        this.extensions.multipleSprites = { bool: false, str: 'This project uses more than one sprite' }; // done
        this.extensions.additionalBackdrop = { bool: false, str: 'This project has an additional backdrop' };
        this.extensions.movingSprites = { bool: false, str: 'This project has a moving sprite' };
        this.extensions.hasBackgroundMusic = { bool: false, str: 'This project has background music' };
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
            if (target.isStage) {
                for (let cost in target.costumes) {
                    if ((target.costumes.length > 1) || (cost.assetID !== "cd21514d0531fdffb22204e0ec5ed84a")) {
                        this.extensions.additionalBackdrop.bool = true;
                    }
                }
            }
            else {
                for (let block in target.blocks) {
                    
                    if (target.blocks[block].opcode === "event_whenthisspriteclicked") {

                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            scriptLengthInteractive++;
                        }
                        if (scriptLengthInteractive > 1) {
                            this.requirements.interactiveSprite.bool = true;
                            
                        }
                    }

                    else if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            scriptLengthNotInteractive++;
                        }
                        if (scriptLengthNotInteractive > 1) {
                            this.requirements.nonInteractiveSprite.bool = true;
                            
                        }
                    }

                    else if ((target.blocks[block].opcode === 'motion_gotoxy') ||
                    target.blocks[block].opcode === 'motion_glidesecstoxy' ||
                    target.blocks[block].opcode === 'motion_movesteps') {
                        this.extensions.movingSprites.bool = true;
                    }

                    else if ((target.blocks[block].opcode === 'sound_playuntildone') ||
                    (target.blocks[block].opcode === 'sound_play')) {
                        this.extensions.hasBackgroundMusic.bool = true;
                    }
                }
            }
        }

        if (numSprites >= 1) {
            this.requirements.hasOneSprite.bool = true;
        }

        if (numSprites > 1) {
            this.extensions.multipleSprites.bool = true;
        }

    }
}
