/*
Act 1 Build-a-Band Project Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // this.requirements.guitar = { bool: false, str: 'Script added for guitar (including event and action block)' }
        // this.requirements.sprite = { bool: false, str: 'Added at least one new sprite' };
        // this.requirements.script = { bool: false, str: 'At least one of the new sprites has a script' };
        this.requirements.changed1 = { bool: false, str: "Either the trumpet or the drum's code has been changed"};
        this.requirements.changed = { bool: false, str: "Both the trumpet and the drum's code have been changed"};
        // this.requirements.cat1 = { bool: false, str: "The cat's code has been changed"};
        // this.requirements.cat = { bool: false, str: 'Cat animated using loop with wait block and motion (including changing costumes and size)' };
    }

    // makeArray(target){
    //     let arr = [];
    //     for (let block in target.blocks){
    //         arr.push(target.blocks[block].opcode);
    //         arr.push(target.blocks[block].next);
    //         arr.push(target.blocks[block].parent);
    //     }
    // }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let ogTrumpetBlocks = null;
        let trumpetBlocks = null;
        let ogDrumBlocks = null;
        let drumBlocks = null;
        let ogSpriteBlocks = null;
        let spriteBlocks = null;

  //      var original = new Project(require('../act1-grading-scripts/real-original-band'), null);

        // for (let target of original.targets){
        //     if (target.name === 'Trumpet'){
        //         ogTrumpetBlocks=target.blocks;
        //     } else if (target.name === 'Drum-Bass'){
        //         ogDrumBlocks=target.blocks;
        //     } else if (target.name === 'Sprite2'){
        //         ogSpriteBlocks=target.blocks;
        //     }
        // }
        // for (let target of project.targets){
        //     if (target.name === 'Trumpet'){
        //         trumpetBlocks = target.blocks;
        //     } else if (target.name === 'Drum-Bass'){
        //         drumBlocks = target.blocks;
        //     } else if (target.name === 'Sprite2'){
        //         spriteBlocks=target.blocks;
        //     }
        // }

        let givenSpritesChanged = 0;
        // var util = require('util');
        // let tB = util.inspect(trumpetBlocks);
        // let ogTB = util.inspect(ogTrumpetBlocks);
        // let dB = util.inspect(drumBlocks);
        // let ogDB = util.inspect(ogDrumBlocks);
        // let sB = util.inspect(spriteBlocks);
        // let ogSB = util.inspect(ogSpriteBlocks);
        // if (tB!==ogTB){givenSpritesChanged++;}
        // if (dB!==ogDB){givenSpritesChanged++;}

        
        // if (givenSpritesChanged){
        //     this.requirements.changed1.bool=true;
        // }
        // if (givenSpritesChanged>1){
        //     this.requirements.changed.bool=true;
        // }
        // if (sB!==ogSB){this.requirements.cat1.bool=true;}

        let trumpetChanged = false;
        let drumChanged = false;
        for (let target of project.targets) {
            if (!target.isStage) {
                if (target.name === 'Trumpet'){
                    if (target.scripts.length!=3) {trumpetChanged = true;}
                    for (let block in target.blocks){
                        if ((target.blocks[block].opcode=='motion_turnright' || target.blocks[block].opcode=='motion_turnleft')
                        && target.blocks[block].inputs.DEGREES[1][1]!=15){
                            trumpetChanged = true;
                        }
                        if (target.blocks[block].opcode=='control_repeat'
                        && target.blocks[block].inputs.TIMES[1][1]!=2){
                            trumpetChanged=true;
                        }
                    }
                    for (let script of target.scripts){
                        if (script.blocks[0].opcode==='event_whenthisspriteclicked'){
                            if (script.blocks.length!=4){
                                trumpetChanged = true;
                            } else if (script.blocks[1].opcode!=='motion_turnright'
                            || script.blocks[2].opcode!=='control_repeat'
                            || script.blocks[3].opcode!=='motion_turnleft'){
                                trumpetChanged = true;
                            } else if (script.blocks[2].subscripts[0].blocks[0].opcode != 'sound_playuntildone'
                            || target.blocks[script.blocks[2].subscripts[0].blocks[0].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='C trumpet'
                            || script.blocks[2].subscripts[0].blocks[1].opcode != 'sound_playuntildone'
                            || target.blocks[script.blocks[2].subscripts[0].blocks[1].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='D trumpet'
                            || script.blocks[2].subscripts[0].blocks[2].opcode != 'sound_playuntildone'
                            || target.blocks[script.blocks[2].subscripts[0].blocks[2].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='E trumpet') {
                                trumpetChanged = true;
                            }
                        } else if (script.blocks[0].opcode==='event_whenkeypressed'
                        && target.blocks[script.blocks[0].id].fields.KEY_OPTION[0]==1){
                            if (script.blocks.length!=9) {
                                trumpetChanged = true;
                            } else if (script.blocks[1].opcode!=='motion_turnright'
                            || script.blocks[2].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[2].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='C trumpet'
                            || script.blocks[3].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[3].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='D trumpet'
                            || script.blocks[4].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[4].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='E trumpet'
                            || script.blocks[5].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[5].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='C trumpet'
                            || script.blocks[6].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[6].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='D trumpet'
                            || script.blocks[7].opcode!=='sound_playuntildone' 
                            || target.blocks[target.blocks[script.blocks[7].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='E trumpet'
                            || script.blocks[8].opcode!=='motion_turnleft'){
                                trumpetChanged = true;
                            }
                        } else if (script.blocks[0].opcode==='event_whenkeypressed'
                        && target.blocks[script.blocks[0].id].fields.KEY_OPTION[0]==2){
                            if (script.blocks.length!=6){
                                trumpetChanged = true;
                            }else if (script.blocks[1].opcode!=='motion_turnright'
                            || script.blocks[2].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[2].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='C trumpet'
                            || script.blocks[3].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[3].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='D trumpet'
                            || script.blocks[4].opcode!=='sound_playuntildone'
                            || target.blocks[target.blocks[script.blocks[4].id].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='E trumpet'
                            || script.blocks[5].opcode!=='motion_turnleft'){
                                trumpetChanged = true;
                            }
                        }
                    }
                }
                if (target.name == 'Drum-Bass'){
                    if (target.scripts.length!=4) {drumChanged=true;}
                    for (let block in target.blocks){
                        if (target.blocks[block].opcode=='motion_turnright' && target.blocks[block].inputs.DEGREES[1][1]!=15){
                            drumChanged=true;
                        }
                        if (target.blocks[block].opcode=='control_repeat' && target.blocks[block].inputs.TIMES[1][1]!=3){
                            drumChanged=true;
                        }
                        if (target.blocks[block].opcode=='sound_playuntildone'
                        && target.blocks[target.blocks[block].inputs.SOUND_MENU[1]].fields.SOUND_MENU[0]!='drum bass3'){
                            drumChanged=true;
                        }
                    }
                    for (let script of target.scripts){
                        if (script.blocks[0].opcode=='event_whenthisspriteclicked'){
                            if (script.blocks.length!=2){
                                drumChanged = true;
                            } else if (script.blocks[1].opcode!='control_repeat'
                            || script.blocks[1].subscripts[0].blocks[0].opcode != 'motion_turnright'
                            || script.blocks[1].subscripts[0].blocks[1].opcode != 'sound_playuntildone'){
                                drumChanged = true;
                            } 
                        } else if (script.blocks[0].opcode == 'event_whenkeypressed'
                        && target.blocks[script.blocks[0].id].fields.KEY_OPTION[0]==3){
                            if (script.blocks.length!=7){
                                drumChanged = true;
                            } else if (script.blocks[1].opcode!='motion_turnright'
                            || script.blocks[2].opcode!='motion_turnright'
                            || script.blocks[3].opcode!='motion_turnright'
                            || script.blocks[4].opcode!='sound_playuntildone'
                            || script.blocks[5].opcode!='sound_playuntildone'
                            || script.blocks[6].opcode!='sound_playuntildone') {
                                drumChanged=true;
                            }
                        } else if (script.blocks[0].opcode=='event_whenkeypressed'
                        && target.blocks[script.blocks[0].id].fields.KEY_OPTION[0]==4){
                            if (script.blocks.length!=7){
                                drumChanged = true;
                            } else if (script.blocks[1].opcode!='motion_turnright'
                            || script.blocks[2].opcode!='sound_playuntildone'
                            || script.blocks[3].opcode!='motion_turnright'
                            || script.blocks[4].opcode!='sound_playuntildone'
                            || script.blocks[5].opcode!='motion_turnright'
                            || script.blocks[6].opcode!='sound_playuntildone') {
                                drumChanged=true;
                            }
                        } else if (script.blocks[0].opcode=='event_whenkeypressed'
                        && target.blocks[script.blocks[0].id].fields.KEY_OPTION[0]==5){
                            if (script.blocks.length!=3){
                                drumChanged = true;
                            } else if (script.blocks[1].opcode!='motion_turnright'
                            || script.blocks[2].opcode!='sound_playuntildone') {
                                drumChanged=true;
                            }
                        }
                    }
                }
              

                if (target.name === 'Sprite2') {
                    for (let block in target.blocks) {
                        let oldCode = false;
                        if (target.blocks[block].opcode==='event_whenflagclicked'){
                            let next = target.blocks[block].next;
                            if (next === '-=c~#;5EEGjK{HrhxCUC'){
                                if (target.blocks[next].inputs.MESSAGE[1][1]==='Click on an instrument to play some music!'){
                                    let secs = target.blocks[next].inputs.SECS[1][1];
                                    if (secs==7){
                                        oldCode = true;
                                    }
                                }
                            }
                        }
                        if (target.blocks[block].opcode==='looks_sayforsecs'){
                            let parent = target.blocks[block].parent;
                            if (parent === 'r5{d*2~:^,9ShD5in?er'){
                                if (target.blocks[block].next === null){
                                    if (target.blocks[block].inputs.MESSAGE[1][1]==='Click on an instrument to play some music!'){
                                        if (target.blocks[block].inputs.SECS[1][1]==7){
                                            oldCode = true;
                                        }
                                    }
                                }
                            }
                        }
   //                     if (!oldCode) {this.requirements.cat1.bool=true;}

                        if (target.blocks[block].opcode.includes('event_')) {
                            for (let i = block; i !== null; i = target.blocks[i].next) {
                                let opc = target.blocks[i].opcode;
                                if ((opc === 'control_forever')
                                    || (opc.includes('control_repeat'))) {
                                    if (target.blocks[i].inputs.SUBSTACK[1] !== null) {
                                        let wait = 0;
                                        let nextCostChangeSize = 0;
                                        let switchCostSize = 0;
                                        let motion = 0;
                                        for (let j = target.blocks[i].inputs.SUBSTACK[1];
                                            j !== null; j = target.blocks[j].next) {
                                                let opc2 = target.blocks[j].opcode;
                                                switch (opc2) {
                                                    case 'control_wait': wait++; break;
                                                    case 'looks_nextcostume': nextCostChangeSize++; break;
                                                    case 'looks_switchcostumeto': switchCostSize++; break;
                                                    case 'looks_setsizeto': switchCostSize++;break;
                                                    case 'looks_changesizeby': nextCostChangeSize++;break;
                                                }
                                                if (opc2.includes('motion_')) { motion++ };

                                            }
                                        if (wait && (nextCostChangeSize || motion || (switchCostSize > 1))) {
                                  //          this.requirements.cat.bool = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // if (target.name === 'Guitar-Electric') {
                //     for (let block in target.blocks) {
                //         if (target.blocks[block].opcode.includes('event_')) {
                //             if (target.blocks[block].next != null) {
                //                 this.requirements.guitar.bool = true;
                //             }
                //         }
                //     }
                // }

                if ((target.name != 'Sprite2') &&
                    (target.name != 'Trumpet') &&
                    (target.name != 'Drum-Bass') &&
                    (target.name != 'Guitar-Electric')) {
      //              this.requirements.sprite.bool = true;
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
   //                             this.requirements.script.bool = true;
                            }
                        }
                    }
                }
            }
        }
        if (trumpetChanged) {givenSpritesChanged++;}
        if (drumChanged) {givenSpritesChanged++;}
        if (givenSpritesChanged) {this.requirements.changed1.bool=true;}
        if (givenSpritesChanged>1) {this.requirements.changed.bool=true;}
    }
}

