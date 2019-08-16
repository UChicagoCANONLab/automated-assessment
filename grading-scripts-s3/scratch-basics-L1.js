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
        this.requirements.addSay = { bool: false, str: 'A say block is added after a sprite says “Click the Space Bar.”' }
        this.extensions.addedHelenSpeech = { bool: false, str: 'The sprite that is changing costumes says something else' };
        this.extensions.carlMoves10Steps = { bool: false, str: "A sprite moves 10 steps when it is finished talking" };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();

        var numSayBlocks = 0;
        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                for (let script of target.scripts) {
                    for (let i = 0; i < script.blocks.length; i++) {
                        // checks to see if there is a say block after the one where Carl the Cloud says to click on the sapce bar to see helen
                        // change color
                        if (script.blocks[i].opcode === 'looks_sayforsecs') {
                            if (script.blocks[i].parent === "8K5Ak(+XsZvwjx2V0~D)") {
                                this.requirements.addSay.bool = true;
                            }
                        }
                        
                        // if there is a say block in a script that has a sprite moving 10 steps, the requirement is met
                        if (script.blocks[i].opcode === 'motion_movesteps') {
                            {
                                if (script.blocks[i].inputs.STEPS[1][1] == 10) {
                                    this.extensions.carlMoves10Steps.bool = true;
                                }
                            }
                        }
                        // if the block is not one of the original say blocks, and it is not the say block that has been added after 
                        // carl the cloud says to click to see the changing colors
                        if (script.blocks[i].opcode === 'looks_sayforsecs') {
                            if (script.blocks[i].next === "ahLTJjNBf`+1#.[qNZE4" && script.blocks[i].parent === "`4;L4Q?o6CqFmdbH?:ms") { continue; }
                            else if (script.blocks[i].next === "=n_7]#{Cxj6pf!BUV,OP" && script.blocks[i].parent === "ahLTJjNBf`+1#.[qNZE4") { continue; }
                            else if (script.blocks[i].next === null && script.blocks[i].parent === "=n_7]#{Cxj6pf!BUV,OP") { continue; }
                            else if (script.blocks[i].next === null && script.blocks[i].parent === "3?,1QT}D[0#@^jvT!J*^") { continue; }
                            else if (script.blocks[i].next === null && script.blocks[i].parent === "8K5Ak(+XsZvwjx2V0~D)") { continue; }
                            else {
                                this.extensions.addedHelenSpeech.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
}