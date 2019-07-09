require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.avgScriptLength = 0;
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_glidesecstoxy', 'looks_sayforsecs', 'control_wait'];
    }

    initReqs() {
        this.requirements.fiveBlocks = { bool: false, str: 'Used (only) 5 blocks specified' };
        this.requirements.backdrop = { bool: false, str: 'Backdrop added' };
        this.requirements.twoSprites = { bool: false, str: 'At least two sprites chosen' };
        this.extensions.moreSprites = {bool: false, str: 'More sprites added'};
        this.extensions.convo = {bool: false, str: 'Sprites have a conversation (at least two sprites say something)'};
        this.extensions.three = {bool: false, str: 'Average script length is at least three'};
        this.extensions.four = {bool: false, str: 'Average script length is at least four'};
        this.extensions.five = {bool: false, str: 'Average script length is at least five'};
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let numSprites = 0;
        let scriptLengths = [];
        let spritesTalking = 0;

        for (let target of project.targets) {
            if (target.isStage) {
                if ((target.costumes.length > 1) ||
                    (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
                    this.requirements.backdrop.bool = true;
                }
            } else {
                numSprites++;
                let spriteTalks = false;

                for (let block in target.blocks) {
                    if ((this.eventOpcodes.includes(target.blocks[block].opcode)
                        || (this.otherOpcodes.includes(target.blocks[block].opcode)))) {
                        this.requirements.fiveBlocks.bool = true;
                    }

                    if (target.blocks[block].opcode==='looks_sayforsecs'){
                        spriteTalks = true;
                    }

                    if ((target.blocks[block].opcode==='event_whenflagclicked')
                        || (target.blocks[block].opcode==='event_whenthisspriteclicked')){
                            let scriptLength = 1;
                            for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next){
                                scriptLength++;
                            }
                            scriptLengths.push(scriptLength);
                        }
                }

                if (spriteTalks) {spritesTalking++};
            }
        }
        if (numSprites >= 2) {
            this.requirements.twoSprites.bool = true;
        }
        if (numSprites >= 3){
            this.extensions.moreSprites.bool = true;
        }
        if (spritesTalking>=2){
            this.extensions.convo.bool = true;
        }

        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = scriptLengths.reduce(reducer,0);
        if (scriptLengths.length === 0){
            this.avgScriptLength = 0;
        }else{
            this.avgScriptLength=total/scriptLengths.length;
        }
        console.log('Average Script Length (including event block):');
        console.log(this.avgScriptLength);

        if (this.avgScriptLength>=3){
            this.extensions.three.bool=true;
        }
        if (this.avgScriptLength>=4){
            this.extensions.four.bool=true;
        }
        if (this.avgScriptLength>=5){
            this.extensions.five.bool=true;
        }

        let longestLength = scriptLengths[0];
        for (let i = 1; i < scriptLengths.length; i++){
            if (scriptLengths[i]>longestLength){
                longestLength=scriptLengths[i];
            }
        }

        console.log('Longest Script Length (including event block):');
        console.log(longestLength);

    }
}