/*
Act 1 Events Ofrenda Autograder
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.newCostumes = {bool: false, str: 'All three sprites have new costumes'};
        this.requirements.speaking = {bool: false, str: 'All three sprites use the say block'};
        this.requirements.interactive = {bool: false, str: '2/3 sprites are interactive'};
        this.extensions.usesPlaySoundUntilDone = { bool: false, str: 'The project uses the "Play Sound Until" block in a script' };
        this.extensions.usesGotoXY = { bool: false, str: 'The project uses the "Go to XY" block in a script' };
        this.extensions.keyCommand = { bool: false, str: 'The project uses a "when "key" pressed" block in a script' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let origCostumeLeft = 0;
        let newCostumeLeft = 0;
        let origCostumeRight = 0;
        let origCostumeMiddle = 0;
        let newCostumeRight = 0;
        let newCostumeMiddle = 0;
        let oldWordsLeft = '';
        let newWordsLeft = '';
        let rightUsesSay = false;
        let middleUsesSay = false;
        let rightUsesClick = false;
        let middleUsesClick = false;
        let leftSizeChanges = false;
        let rightSizeChanges = false;
        let middleSizeChanges = false;

        // gets the costumes from the original project 
        var oldCostumes = [];
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Left') {
                
                origCostumeLeft = origTarget.currentCostume;
             
               
            }
            if (origTarget.name === 'Right') {
                origCostumeRight = origTarget.currentCostume;
            }
            if (origTarget.name === 'Middle') {
                origCostumeMiddle = origTarget.currentCostume;
            }
        }

        // new
        for (let target of project.targets) {
            if (target.isStage) {continue;}
            else {

            }
            if (target.name === 'Left') {

                newCostumeLeft = target.currentCostume;
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'looks_sayforsecs') {
                        newWordsLeft = target.blocks[block].inputs.MESSAGE[1][1];
                    }
                    if (target.blocks[block].opcode === 'looks_changesizeby') {

                        // make sure that it is not the same as the original
                        let nextTemp = target.blocks[block].next;
                        if (nextTemp !== null) {
                            if (target.blocks[nextTemp].inputs.MESSAGE[1][1] !== 'I am Grandpa John.') {
                                leftSizeChanges = true;
                            }
                        }
                    }

                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                        else {
                            this.extensions.usesPlaySoundUntilDone.bool = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;

                        }
                    }
                }
            }
            if (target.name === 'Right') {
                newCostumeRight = target.currentCostume;
                for (let block in target.blocks) {

                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next !== null) {
                            rightUsesClick = true;
                        }
                    }
                    if ((target.blocks[block].opcode === 'looks_sayforsecs') ||
                        (target.blocks[block].opcode === 'looks_say')) {
                        if (target.blocks[block].parent !== null) {
                            rightUsesSay = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'looks_changesizeby') {
                        rightSizeChanges = true;
                    }
                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                        else {
                            this.extensions.usesPlaySoundUntilDone.bool = true;

                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;

                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;

                        }
                    }

                }
            }

            if (target.name === 'Middle') {
                newCostumeMiddle = target.currentCostume;
                for (let block in target.blocks) {

                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        let nextBlock = target.blocks[block].next;

                        if (target.blocks[block].next !== null) {
                            if (target.blocks[nextBlock].opcode !== "looks_gotofrontback") {
                                let nextnextBlock = target.blocks[nextBlock].next;
                                if (target.blocks[nextnextBlock].next !== null) {
                                    middleUsesClick = true;
                                }
                            }
                            if (target.blocks[nextBlock].next !== null) {
                                middleUsesClick = true;
                            }

                        }
                    }
                    if ((target.blocks[block].opcode === 'looks_sayforsecs') ||
                        (target.blocks[block].opcode === 'looks_say')) {
                        if (target.blocks[block].parents !== null) {
                            middleUsesSay = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'looks_changesizeby') {
                        middleSizeChanges = true;
                    }
                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                        else {
                            this.extensions.usesPlaySoundUntilDone.bool = true;

                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                        else {
                            this.extensions.usesGotoXY.bool = true;

                        }
                    }
                }
            }
        }

        if (rightUsesClick) {
            this.requirements.usesClickRight.bool = true;
        }

        if (middleUsesClick) {
            this.requirements.usesClickMiddle.bool = true;
        }

        if (rightUsesSay) {
            this.requirements.usesSayRight.bool = true;
        }

        if (middleUsesSay) {
            this.requirements.usesSayMiddle.bool = true;
        }

        if (origCostumeLeft !== newCostumeLeft || leftSizeChanges) {
            this.requirements.leftSpriteCostume.bool = true;
        }

        if (origCostumeRight !== newCostumeRight || rightSizeChanges) {
            this.requirements.rightChanged.bool = true;
        }

        if (origCostumeMiddle !== newCostumeMiddle || middleSizeChanges) {
            this.requirements.middleChanged.bool = true;
        }

        if (oldWordsLeft !== newWordsLeft) {
            this.requirements.leftSpriteSpeak.bool = true;
        }
    }
}