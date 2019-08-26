require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.avgScriptLength = 0;
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_glidesecstoxy', 'looks_sayforsecs', 'control_wait'];
        this.blocksUsed = 0;
    }

    initReqs() {
        // this.requirements.fiveBlocksOld = { bool: false, str: 'Used 5 blocks specified - OLD REQ' };
        this.requirements.oneBlock = { bool: false, str: 'Used at least one of the five blocks specified' };
        this.extensions.twoBlocks = { bool: false, str: 'Used at least two of the five blocks specified' };
        this.extensions.threeBlocks = { bool: false, str: 'Used at least three of the five blocks specified' };
        this.extensions.fourBlocks = { bool: false, str: 'Used at least four of the five blocks specified' };
        this.extensions.allFiveBlocks = { bool: false, str: 'Used all five blocks specified' }
        this.requirements.backdrop = { bool: false, str: 'Backdrop added' };
        this.requirements.oneSprite = { bool: false, str: 'At least one sprite is added' }
        this.requirements.twoSprites = { bool: false, str: 'At least two sprites chosen' };
        this.extensions.moreSprites = { bool: false, str: 'More sprites added' };
        this.extensions.convo = { bool: false, str: 'Sprites have a conversation (at least two sprites say something)' };
        this.extensions.three = { bool: false, str: 'Average script length is at least three' };
        this.extensions.four = { bool: false, str: 'Average script length is at least four' };
        this.extensions.five = { bool: false, str: 'Average script length is at least five' };
        this.avgScriptLength = 0;
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let numSprites = 0;
        let scriptLengths = [];
        let spritesTalking = 0;

        let usesFlagClicked = 0;
        let usesSpriteClicked = 0;
        let usesGlide = 0;
        let usesSays = 0;
        let usesWait = 0;

        for (let target of project.targets) {
            if (target.isStage) {
                if ((target.costumes.length > 1) ||
                    (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
                    this.requirements.backdrop.bool = true;
                }
            } else {
                
                numSprites++;
                let spriteTalks = false;

                for (let script in target.scripts) {
                    if (target.scripts[script].blocks[0].opcode.includes('event_')
                    &&target.scripts[script].blocks.length>1){

                    for (let block in target.scripts[script].blocks) {
                        let opc = target.scripts[script].blocks[block].opcode;
                        switch (opc) {
                            case 'event_whenflagclicked':
                                usesFlagClicked = 1;
                                break;
                            case 'event_whenthisspriteclicked':
                                usesSpriteClicked = 1;
                                break;
                            case 'motion_glidesecstoxy':
                                usesGlide = 1;
                                break;
                            case 'looks_sayforsecs':
                                usesSays = 1;
                                spriteTalks = true;
                                break;
                            case 'control_wait':
                                usesWait = 1;
                                break;
                        }

                        if ((this.eventOpcodes.includes(opc)
                            || (this.otherOpcodes.includes(opc)))) {
                         //   this.requirements.fiveBlocksOld.bool = true;
                        }

                        if ((opc === 'event_whenflagclicked')
                            || (opc === 'event_whenthisspriteclicked')) {
                            let scriptLength = 1;
                            for (let i = target.scripts[script].blocks[block].id; target.blocks[i].next !== null; i = target.blocks[i].next) {
                                scriptLength++;
                            }
                            scriptLengths.push(scriptLength);
                        } 
                    }
                    }
                }

                if (spriteTalks) { spritesTalking++ };
            }
        }
        if (numSprites >= 1) {
            this.requirements.oneSprite.bool = true;
        }
        if (numSprites >= 2) {
            this.requirements.twoSprites.bool = true;
        }
        if (numSprites >= 3) {
           this.extensions.moreSprites.bool = true;
        }
        if (spritesTalking >= 2) {
           this.extensions.convo.bool = true;
        }

        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = scriptLengths.reduce(reducer, 0);
        if (scriptLengths.length === 0) {
            this.avgScriptLength = 0;
        } else {
            this.avgScriptLength = total / scriptLengths.length;
        }
        // console.log('Average Script Length (including event block):');
        // console.log(this.avgScriptLength);

        if (this.avgScriptLength >= 3) {
            this.extensions.three.bool = true;
        }
        if (this.avgScriptLength >= 4) {
            this.extensions.four.bool = true;
        }
        if (this.avgScriptLength >= 5) {
            this.extensions.five.bool = true;
        }

        let longestLength = scriptLengths[0];
        for (let i = 1; i < scriptLengths.length; i++) {
            if (scriptLengths[i] > longestLength) {
                longestLength = scriptLengths[i];
            }
        }

        // console.log('Longest Script Length (including event block):');
        // console.log(longestLength);

        let blocksUsed = usesFlagClicked + usesGlide + usesSays + usesSpriteClicked + usesWait;
        if (blocksUsed >= 1) {this.requirements.oneBlock.bool=true;}
        if (blocksUsed >= 2) {this.requirements.twoBlocks.bool=true;}
        if (blocksUsed >= 3) {this.requirements.threeBlocks.bool=true;}
        if (blocksUsed >= 4) {this.requirements.fourBlocks.bool=true;}
        if (blocksUsed >= 5) {this.requirements.allFiveBlocks.bool=true;}

    }
}