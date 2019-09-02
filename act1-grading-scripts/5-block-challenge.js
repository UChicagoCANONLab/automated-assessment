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
        this.requirements.oneBlock = { bool: false, str: 'Used at least one of the five blocks specified' };
        this.requirements.twoBlocks = { bool: false, str: 'Used at least two of the five blocks specified' };
        this.requirements.threeBlocks = { bool: false, str: 'Used at least three of the five blocks specified' };
        this.requirements.fourBlocks = { bool: false, str: 'Used at least four of the five blocks specified' };
        this.requirements.allFiveBlocks = { bool: false, str: 'Used all five blocks specified' }
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

            //checks if the backdrop has been altered from the default
            if (target.isStage) {
                if ((target.costumes.length > 1) ||
                    (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
                    this.requirements.backdrop.bool = true;
                }
            } else {

                //counts the number of sprites in the project
                numSprites++;

                //stores whether this sprite talks
                let spriteTalks = false;

                for (let script in target.scripts) {

                    //checks if the script has an event block and at least one other block
                    if (target.scripts[script].blocks[0].opcode.includes('event_')
                        && target.scripts[script].blocks.length > 1) {


                        //checks whether each block is used (to be tallied later)
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

                            //measures script length for research purposes
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

                //counts the number of sprites that talk
                if (spriteTalks) { spritesTalking++ };
            }
        }
        
        //sets the requirements/extensions accordingly
        if (numSprites >= 1) {this.requirements.oneSprite.bool = true;}
        if (numSprites >= 2) {this.requirements.twoSprites.bool = true;}
        if (numSprites >= 3) {this.extensions.moreSprites.bool = true;}
        if (spritesTalking >= 2) {this.extensions.convo.bool = true;}

        //measures average script length in a project
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = scriptLengths.reduce(reducer, 0);
        if (scriptLengths.length === 0) {this.avgScriptLength = 0;
        } else {this.avgScriptLength = total / scriptLengths.length;}
        // console.log('Average Script Length (including event block):');
        // console.log(this.avgScriptLength);

        //and sets extensions accordingly
        if (this.avgScriptLength >= 3) {this.extensions.three.bool = true;}
        if (this.avgScriptLength >= 4) {this.extensions.four.bool = true;}
        if (this.avgScriptLength >= 5) {this.extensions.five.bool = true;}

        //finds longest script length in project
        let longestLength = scriptLengths[0];
        for (let i = 1; i < scriptLengths.length; i++) {
            if (scriptLengths[i] > longestLength) {
                longestLength = scriptLengths[i];
            }
        }
        // console.log('Longest Script Length (including event block):');
        // console.log(longestLength);

        //counts how many of the five specified blocks are used and sets requirements accordingly
        let blocksUsed = usesFlagClicked + usesGlide + usesSays + usesSpriteClicked + usesWait;
        if (blocksUsed >= 1) { this.requirements.oneBlock.bool = true; }
        if (blocksUsed >= 2) { this.requirements.twoBlocks.bool = true; }
        if (blocksUsed >= 3) { this.requirements.threeBlocks.bool = true; }
        if (blocksUsed >= 4) { this.requirements.fourBlocks.bool = true; }
        if (blocksUsed >= 5) { this.requirements.allFiveBlocks.bool = true; }

    }
}