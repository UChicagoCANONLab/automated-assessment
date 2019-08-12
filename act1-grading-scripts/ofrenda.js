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
        // strict completion metrics
        this.requirements.leftChanged = { bool: false, str: 'The left sprite has new dialogue' }; // done
        this.requirements.leftCostume = { bool: false, str: 'The left costume has been changed' }; // done
        this.requirements.rightCostume = { bool: false, str: 'The right costume has been changed' }; // done
        this.requirements.midCostume = {bool: false, str: 'The middle costume has been changed'};
        this.requirements.interactiveRight = { bool: false, str: 'Right sprite uses the "when this sprite clicked" block' };
        this.requirements.interactiveMiddle = { bool: false, str: 'Middle sprite uses the "when this sprite clicked" block'};
        this.requirements.speakingRight = { bool: false, str: 'Right sprite has a script with a say block in it' }; // done
        this.requirements.speakingMiddle = { bool: false, str: 'Middle sprite has a script with a say block in it' }; // done

        // demonstrated understanding metrics under extensions
        this.extensions.newCostumes1 = { bool: false, str: 'At least one sprite has a new costumes' };
        //this.requirements.newCostumes2= {bool: false, str: 'At least two sprites have new costumes'};
        //this.requirements.newCostumes3 = {bool: false, str: 'At least three sprites have new costumes'}; 

        //this.extensions.speaking3 = {bool: false, str: 'All three sprites use the say block'}; 
        //this.extensions.speaking2 = {bool: false, str: 'Two sprites use the say block'}; 
        this.extensions.speaking1 = { bool: false, str: 'A sprite uses the say block' };

        //this.extensions.interactive2 = {bool: false, str: '2/3 sprites are interactive'}; 
        this.extensions.interactive1 = { bool: false, str: '1/3 sprites are interactive' };

        // extensions
        // this.extensions.usesPlaySoundUntilDone = { bool: false, str: 'The project uses the "Play Sound Until" block in a script' }; 
        // this.extensions.usesGotoXY = { bool: false, str: 'The project uses the "Go to XY" block in a script' };
        // this.extensions.keyCommand = { bool: false, str: 'The project uses a "when "key" pressed" block in a script' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let origCostumeLeft = 0;
        let origCostumeRight = 0;
        let origCostumeMiddle = 0;
        let origLeftDialogue = '';

        // gets the costumes from the original project 
        var oldCostumes = [];
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Left') {
                let currCost1 = origTarget.currentCostume;
                origCostumeLeft = origTarget.costumes[currCost1].assetId;
                oldCostumes.push(origCostumeLeft);
                for (let block in origTarget.blocks) {
                    if (origTarget.blocks[block].opcode === 'looks_sayforsecs') {
                        origLeftDialogue = origTarget.blocks[block].inputs.MESSAGE[1][1];
                    }
                }
            }
            if (origTarget.name === 'Right') {
                let currCost2 = origTarget.currentCostume;
                origCostumeRight = origTarget.costumes[currCost2].assetId;
                oldCostumes.push(origCostumeRight);
            }
            if (origTarget.name === 'Middle') {
                let currCost3 = origTarget.currentCostume;
                origCostumeMiddle = origTarget.costumes[currCost3].assetId;
                oldCostumes.push(origCostumeMiddle);
            }
        }

        let leftCost = 0;
        let midCost = 0;
        let rightCost = 0;
        let leftDialogue = '';
        let rightDialogue = '';
        let midDialogue = '';
        let midInteraction = false;
        let rightInteraction = false;
        var soundOptions = ['looks_say', 'looks_sayforsecs'];
        var newCostumes = [];

        // strict requirements
        for (let target of project.targets) {
            if (target.name === 'Left') {
                let cost1 = target.currentCostume;
                leftCost = target.costumes[cost1].assetId;
                newCostumes.push(leftCost);
                for (let block in target.blocks) {
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            leftDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }

                    }
                }
            }
            if (target.name === 'Middle') {
                let cost2 = target.currentCostume;
                midCost = target.costumes[cost2].assetId;
                newCostumes.push(midCost);
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        }
                        else {
                            midInteraction = true;
                        }
                    }
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            midDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }
                    }
                }
            }
            if (target.name === 'Right') {
                let cost3 = target.currentCostume;
                rightCost = target.costumes[cost3].assetId;
                newCostumes.push(rightCost);
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        }
                        else {
                            rightInteraction = true;
                        }
                    }
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            rightDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }
                    }
                }
            }
        }

        if (midInteraction) {
            this.requirements.interactiveMiddle.bool = true;
        } 
        if (rightInteraction) {
            this.requirements.interactiveRight.bool = true;
        }
        if (midDialogue !== '') {
            this.requirements.speakingMiddle.bool = true;
        }
        if (rightDialogue !== '') {
            this.requirements.speakingRight.bool = true;
        }
        
        if (leftDialogue !== origLeftDialogue) {
            this.requirements.leftChanged.bool = true;
        }
        if (leftCost !== origCostumeLeft) {
            this.requirements.leftCostume.bool = true;
        }
        if (rightCost !== origCostumeRight) {
            this.requirements.rightCostume.bool = true;
        }
        if (midCost !== origCostumeMiddle) {
            this.requirements.midCostume.bool = true;
        }
        // --------------------------------------------------------------------------------------------------------- //


        // at least one sprite has a new costume - make an array of the old costumes lmr and then 
        // an array of the new costumes lmr and then if they are not equal then the requirement is fulfilled
        // new cost is left middle right 

        // if the elements are not the same or they are not in the same order
        if (JSON.stringify(oldCostumes) !== JSON.stringify(newCostumes)) {
            this.extensions.newCostumes1.bool = true;
        }

        // if there is a say block in a sprite that is not named catrina, and that say block is not used in the same 
        // context as the original project (same parent and next block)
        for (let target of project.targets) {
            if (target.name === 'Catrina') {
                continue;
            } else {
                for (let script in target.scripts) {
                    for (let block in target.scripts[script].blocks) {
                        if (soundOptions.includes(target.scripts[script].blocks[block].opcode)) {
                            if (target.scripts[script].blocks[block].next === "Q.gGFO#r}[Z@fzClmRq-" && target.scripts[script].blocks[block].parent === "taz8m.4x_rVweL9%J@(3") {
                                continue;
                            } else if (target.scripts[script].blocks[block].next === "sPl?mFlNaaD_l]+QJ.CW" && target.scripts[script].blocks[block].parent === "Y5!LLf.Gqemqe/6!)t=e") {
                                continue;
                            }
                            else {
                                this.extensions.speaking1.bool = true;
                            }
                        }
                        
                        if (target.scripts[script].blocks[block].opcode === 'event_whenthisspriteclicked') {
                            if (target.scripts[script].blocks[block].next === "}VBgCH{K:oDh6pV0h.pi" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else if (target.scripts[script].blocks[block].next === "/f[ltBij)7]5Jtg|W(1%" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else {
                                this.extensions.interactive1.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
} 