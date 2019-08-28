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

    initReqs(){
        this.requirements.event = {bool: false, str: 'Project uses at least one event block'};
        this.requirements.loop = {bool: false, str: 'Project has a functional loop'};
        this.requirements.sprite = {bool: false, str: 'Project has at least one sprite with a script'};
        this.requirements.backdrop = {bool: false, str: 'Scene changes'};
        this.extensions.threeBackdrops = {bool: false, str: 'Uses 3 different backdrops'};
        this.extensions.showHide = {bool: false, str: 'Uses "show" or "hide"'};
        this.extensions.music = {bool: false, str: 'Sounds added'};
        
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

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        let uniqueBlocksArr = [];
        let uniqueBlocks = 0;

        for (let target of project.targets){

            if (target.isStage){
                if (target.costumes.length>=3){
                    // this.extensions.threeBackdrops.bool=true;
                }
            }  


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

                if (target.blocks[block].opcode.includes('event_')){
                    this.requirements.event.bool=true;

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

                let opc = target.blocks[block].opcode;
                if (opc.includes('backdrop')){
                    this.requirements.backdrop.bool=true;
                }
                if ((opc.includes('show'))
                ||opc.includes('hide')){
                    this.extensions.showHide.bool=true;
                }
                if ((opc==='sound_playuntildone')
                ||(opc==='sound_play')){
                    this.extensions.music.bool=true;
                }

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