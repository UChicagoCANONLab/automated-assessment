/*
Act 1 Animal Parade Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3');

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.kangaroo = {bool: false, str: 'Kangaroo script has been changed'};
        this.requirements.grasshopper = {bool: false, str: 'Grasshopper script has been changed'};
        this.requirements.bee = {bool: false, str: 'Bee flies in a circle when clicked (using next costume, turn, and move steps)'};
        this.extensions.changeSize = {bool: false, str: 'Uses "change size by"'};
        this.extensions.changeEffect = {bool: false, str: 'Uses "change color effect by"'}
    }

    //helper method to check if kangaroo and grasshopper have new scripts and set requirements accordingly
    checkScripts(target) {
        for (let script of target.scripts){
            if (script.blocks[0].opcode.includes('event_')){
                switch (target.name){
                    case 'Kangaroo':
                        if (script.blocks[0].opcode !== 'event_whenflagclicked'
                            || !(script.blocks[1].opcode === 'motion_gotoxy'
                                && script.blocks[1].inputs.X[1][1] == -180
                                && script.blocks[1].inputs.Y[1][1] == -17)
                            || !(script.blocks[2].opcode === 'looks_switchcostumeto'
                                && target.blocks[script.blocks[2].inputs.COSTUME[1]].fields.COSTUME[0] === 'kangaroo crouching')
                            || script.blocks.length != 3) {
                                    this.requirements.kangaroo.bool = true;
                        }
                        break;
                    case 'Grasshopper':
                        if (script.blocks[0].opcode !== 'event_whenflagclicked' 
                            || !(script.blocks[1].opcode === 'motion_gotoxy'
                                && script.blocks[1].inputs.X[1][1] == -56
                                && script.blocks[1].inputs.Y[1][1] == -80)
                            || !(script.blocks[2].opcode === 'looks_switchcostumeto'
                                && target.blocks[script.blocks[2].inputs.COSTUME[1]].fields.COSTUME[0] === 'Grasshopper-a')
                            || script.blocks.length != 3){
                                    this.requirements.grasshopper.bool = true;
                                }
                        break;
                }
            }
        }
    } 

    //helper method to check if bee flies in a circle and whether the extra suggested blocks are used
    checkBlocks(target) {
        for (let script of target.scripts){
            let costume = false;
            let turn = false;
            let move = false;
            let size = false;
            let effect = false;
            if (script.blocks[0].opcode.includes('event_')){
                for (let block of script.blocks){
                    switch(block.opcode){
                        case 'looks_nextcostume': costume = true; break;
                        case 'motion_turnleft': turn = true; break;
                        case 'motion_turnright': turn = true; break;
                        case 'motion_movesteps': move = true; break;
                        case 'looks_changesizeby': size = true; break;
                        case 'looks_changeeffectby': effect = true; break;
                    }
                }
            }
            if (costume && turn && move && (target.name === 'Bee')){
                this.requirements.bee.bool = true;
            }
            if (size) {this.extensions.changeSize.bool=true;}
            if (effect) {this.extensions.changeEffect.bool=true;}
        }
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        //runs helper methods
        for (let target of project.targets){
            this.checkScripts(target);
            this.checkBlocks(target);
        }
    }
}