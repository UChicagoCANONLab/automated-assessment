/*
Act 1 About Me Grader
Intital version and testing: Saranya Turimella, Summer 2019
Updated to reflect new act 1 
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // sprites - done
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };
        this.requirements.hasTwoSprites = { bool: false, str: 'Project has at least two sprites' };
        this.requirements.hasThreeSprites = { bool: false, str: 'Project has at least three sprites' };
        // interaction - done
        this.requirements.hasOneSpeakingInteractive = { bool: false, str: 'Project has at least one sprite that says or thinks' };
        this.requirements.hasTwoSpeakingInteractive = { bool: false, str: 'Project has at least two sprites that says or thinks' };
        this.requirements.hasThreeSpeakingInteractive = { bool: false, str: 'Project has at least three sprites that says or thinks' };
        // interactive and speaking  - done
        this.requirements.oneInteractive = { bool: false, str: 'Project has one sprite with at least three actions' };
        this.requirements.twoInteractive = { bool: false, str: 'Project has two sprites with at least three actions' };
        this.requirements.threeInteractive = { bool: false, str: 'Project has three sprites with at least three actions' };
        // background - done
        this.requirements.hasBackdrop = { bool: false, str: 'This project has a backdrop' };
        // speaking - done
      

        // check for block usage - done 
        // this.extensions.usesThinkBlock = { bool: false, str: 'Project uses the think block' };
        // this.extensions.changeSize = { bool: false, str: 'Project uses change size block' };
        // this.extensions.playSound = { bool: false, str: 'Project uses play sound until done' };
        // this.extensions.moveSteps = { bool: false, str: 'Project uses a move block' };
        


    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;


        let isInteractiveAndSpeaks = false;
        let numInteractiveAndSpeaks = 0;
        let numInteractive = 0;

        for (let target of project.targets) {
            if (target.isStage) {
                // checks all the backdrops of the project and makes sure that there is more than one and that
                // the asset ID is not equal to the original one
                for (let cost in target.costumes) {
                    if ((target.costumes.length > 1) || (cost.assetID !== "cd21514d0531fdffb22204e0ec5ed84a")) {
                        this.requirements.hasBackdrop.bool = true;
                    }
                }
            }
            else {

                for (let script of target.scripts) {
                    // finds a script that starts when when the sprite is clicked and then makes sure that there is a script attached
                    // increases the number of interactive sprites
                    if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                        if (script.blocks.length > 4) {
                            numInteractive++;
                        }
                        for (let i = 0; i < script.blocks.length; i++) {
                            // finds the blocks in a script that are a say block, once a block is found
                            // boolean that shows that there is an interactive sprite that speaks is marked as true
                            var opcode = script.blocks[i].opcode
                            isInteractiveAndSpeaks = opcode.includes("looks_say") || opcode.includes("looks_think")
                        }
                    }

                    // looks for different blocks to mark the extensions are true
                    // for (let i = 0; i < script.blocks.length; i++) {
                    //     if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                    //         this.extensions.usesThinkBlock.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'looks_changesizeby') {
                    //         this.extensions.changeSize.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'sound_playuntildone') {
                    //         this.extensions.playSound.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'motion_movesteps') {
                    //         this.extensions.moveSteps.bool = true;
                    //     }
                                      
                    // }
                    // everytime there is a sprite that is interactive and speaks, increase the number of the sprites that fall under
                    // this category
                    if (isInteractiveAndSpeaks) {
                        numInteractiveAndSpeaks ++;
                    }
                }
            }
        }

        // number of sprites
        if (project.sprites.length >= 1) {
            this.requirements.hasOneSprite.bool = true;
        } 
        if (project.sprites.length >= 2) {
            this.requirements.hasTwoSprites.bool = true;
        } 
        if (project.sprites.length >= 3) {
            this.requirements.hasThreeSprites.bool = true;
        }

        // number of interactive sprites
        if (numInteractive >= 1) {
            this.requirements.oneInteractive.bool = true;
        } 
        if (numInteractive >= 2) {
            this.requirements.twoInteractive.bool = true;
        } 
        if (numInteractive >= 3) {
            this.requirements.threeInteractive.bool = true;
        }

        // number of interactive and speaking sprites
        if (numInteractiveAndSpeaks >= 1) {
            this.requirements.hasOneSpeakingInteractive.bool = true;
        }
        if (numInteractiveAndSpeaks >= 2) {
            this.requirements.hasTwoSpeakingInteractive.bool = true;
        } 
        if (numInteractiveAndSpeaks >= 3) {
            this.requirements.hasThreeSpeakingInteractive.bool = true;
        }

    }
}
