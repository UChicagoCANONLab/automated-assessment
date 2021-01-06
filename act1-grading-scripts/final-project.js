/*
Act 1 Final Project Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        //requirements for classroom use
        this.requirements.event = {bool: false, str: 'Project uses at least one event block'};
        this.requirements.loop = {bool: false, str: 'Project has a functional loop'};
        this.requirements.sprite = {bool: false, str: 'Project has at least one sprite with a script'};
        this.extensions.threeBackdrops = {bool: false, str: 'Uses three different backdrops'};
        this.extensions.sound = {bool: false, str: 'Sounds or dialogue added'};

        //old requirements
        //this.extensions.showHide = {bool: false, str: 'Uses "show" or "hide"'};
        //this.requirements.backdrop = {bool: false, str: 'Scene changes'};
       
        //requirements for research purposes
        /////
        // this.requirements.one = { bool: false, str: 'at least 1 unique block'};
        // this.requirements.two = { bool: false, str: 'at least 2 unique blocks'};
        // this.requirements.three = { bool: false, str: 'at least 3 unique blocks'};
        // this.requirements.four = { bool: false, str: 'at least 4 unique blocks'};
        // this.requirements.five = { bool: false, str: 'at least 5 unique blocks'};
        // this.requirements.six = { bool: false, str: 'at least 6 unique blocks'};
        // this.requirements.seven = { bool: false, str: 'at least 7 unique blocks'};
        // this.requirements.eight = { bool: false, str: 'at least 8 unique blocks'};
        // this.requirements.nine = { bool: false, str: 'at least 9 unique blocks'};
        // this.requirements.ten = { bool: false, str: 'at least 10+ unique blocks'};
        /////
    }

    grade(fileObj, user) {
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        let uniqueBlocksArr = [];
        let uniqueBlocks = 0;

        for (let target of project.targets){

            //checks if three different backdrops are used
            if (target.isStage){
                if (target.costumes.length>=3){
                    this.extensions.threeBackdrops.bool=true;
                }
            }

            //counts how many unique blocks are used
            for (let script in target.scripts) {
                if (target.scripts[script].blocks[0].opcode.includes('event_')){
                    for (let block of target.scripts[script].blocks) {
                        let opc = block.opcode;
                        if (!uniqueBlocksArr.includes(opc)){
                            uniqueBlocksArr.push(opc);
                            uniqueBlocks++;
                        }
                    }
                }
            }

            for (let block in target.blocks){

                //checks if project uses at least one event block
                if (target.blocks[block].opcode.includes('event_')){
                    this.requirements.event.bool=true;

                    //checks if project has at least one non-empty loop
                    for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next){
                        let opc = target.blocks[i].opcode;
                        if ((opc==='control_forever')
                        ||(opc.includes('control_repeat'))){
                            if (target.blocks[i].inputs.SUBSTACK[1]!==null){
                                this.requirements.loop.bool=true;
                            }
                        }
                    }
                }

                //checks if sound or dialogue is added
                let opc = target.blocks[block].opcode;
                if ((opc==='sound_playuntildone')
                || (opc==='sound_play')
                || (opc==='looks_say')
                || (opc==='looks_sayforsecs')){
                    this.extensions.sound.bool=true;
                }
                //old requirements
                // if (opc.includes('backdrop')){
                //     this.requirements.backdrop.bool=true;
                // }
                // if ((opc.includes('show'))
                // ||opc.includes('hide')){
                //     this.extensions.showHide.bool=true;
                // }

                //checks if project has at least one sprite
                if (!target.isStage){
                    this.requirements.sprite.bool=true;
                }
            }
        }

        // if (uniqueBlocks>=1) this.requirements.one.bool=true;
        // if (uniqueBlocks>=2) this.requirements.two.bool=true;
        // if (uniqueBlocks>=3) this.requirements.three.bool=true;
        // if (uniqueBlocks>=4) this.requirements.four.bool=true;
        // if (uniqueBlocks>=5) this.requirements.five.bool=true;
        // if (uniqueBlocks>=6) this.requirements.six.bool=true;
        // if (uniqueBlocks>=7) this.requirements.seven.bool=true;
        // if (uniqueBlocks>=8) this.requirements.eight.bool=true;
        // if (uniqueBlocks>=9) this.requirements.nine.bool=true;
        // if (uniqueBlocks>=10) this.requirements.ten.bool=true;

    }
}