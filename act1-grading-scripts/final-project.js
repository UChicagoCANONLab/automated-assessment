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
        this.extensions.music = {bool: false, str: 'Background music added'};
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        for (let target of project.targets){

            if (target.isStage){
                if (target.costumes.length>=3){
                    this.extensions.threeBackdrops.bool=true;
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
                ||(opc==='sound_sounds_menu')){
                    this.extensions.music.bool=true;
                }

                if (!target.isStage){
                    this.requirements.sprite.bool=true;
                }

            }
        }

    }

}