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
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let numSprites = 0;
        let scriptLengths = [];

        for (let target of project.targets) {
            if (target.isStage) {
                if ((target.costumes.length > 1) ||
                    (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
                    this.requirements.backdrop.bool = true;
                }
            } else {
                numSprites++;

                for (let block in target.blocks) {
                    if ((this.eventOpcodes.includes(target.blocks[block].opcode)
                        || (this.otherOpcodes.includes(target.blocks[block].opcode)))) {
                        this.requirements.fiveBlocks.bool = true;
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
            }
        }
        if (numSprites >= 2) {
            this.requirements.twoSprites.bool = true;
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

    }
}