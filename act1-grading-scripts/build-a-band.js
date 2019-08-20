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
        this.requirements.sprite = { bool: false, str: 'Added at least one new sprite' };
        this.requirements.script = { bool: false, str: 'At least one of the new sprites has a script' };
        this.requirements.changed1 = { bool: false, str: "Either the trumpet or the drum's code has been changed"};
        this.requirements.changed = { bool: false, str: "Both the trumpet and the drum's code have been changed"};
        this.requirements.cat1 = { bool: false, str: "The cat's code has been changed"};
        this.requirements.cat = { bool: false, str: 'Cat animated using loop with wait block and motion (including changing costumes and size)' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let ogTrumpetBlocks = null;
        let trumpetBlocks = null;
        let ogDrumBlocks = null;
        let drumBlocks = null;

        var original = new Project(require('../act1-grading-scripts/original-band1'), null);

        for (let target of original.targets){
            if (target.name === 'Trumpet'){
                ogTrumpetBlocks=target.blocks;
            } else if (target.name === 'Drum-Bass'){
                ogDrumBlocks=target.blocks;
            }
        }
        for (let target of project.targets){
            if (target.name === 'Trumpet'){
                trumpetBlocks = target.blocks;
            } else if (target.name === 'Drum-Bass'){
                drumBlocks = target.blocks;
            }
        }
        let givenSpritesChanged = 0;
        var util = require('util');
        let tB = util.inspect(trumpetBlocks);
        let ogTB = util.inspect(ogTrumpetBlocks);
        let dB = util.inspect(drumBlocks);
        let ogDB = util.inspect(ogDrumBlocks);
        if (tB!==ogTB){givenSpritesChanged++;}
        if (dB!==ogDB){givenSpritesChanged++;}
        if (givenSpritesChanged){
            this.requirements.changed1.bool=true;
        }
        if (givenSpritesChanged>1){
            this.requirements.changed.bool=true;
        }

        for (let target of project.targets) {
            if (!target.isStage) {
                if (target.name === 'Trumpet'){
                    // for (let script in target.scripts){
                    //     if (script.blocks[0].opcode === 'event_whenthisspriteclicked'){
                    //         if ((script.blocks[1].opcode==='motion_turnright' &&
                    //                 script.blocks[1].inputs.DEGREES[1][1]===15)
                    //             && (script.blocks[2].opcode==='control_repeat' &&
                    //                 script.blocks[2].inputs.TIMES[1][1])
                    //             && ()
                    //     }
                    // }
                }
                if (target.name === 'Sprite2') {
                    for (let block in target.blocks) {

                        let oldCode = false;
                        if (target.blocks[block].opcode==='event_whenflagclicked'){
                            let next = target.blocks[block].next;
                            if (next === 'i`x:QN,(K}4VXexrv2s1'){
                                if (target.blocks[next].inputs.MESSAGE[1][1]==='Click on an instrument to play some music!'){
                                    if (target.blocks[next].inputs.SECS[1][1]===7){
                                        oldCode = true;
                                    }
                                }
                            }
                        }
                        if (target.blocks[block].opcode==='looks_sayforsecs'){
                            let parent = target.blocks[block].parent;
                            if (parent === '35NjOT;ABdxt.yY%0)4F'){
                                if (target.blocks[block].next === null){
                                    if (target.blocks[block].inputs.MESSAGE[1][1]==='Click on an instrument to play some music!'){
                                        if (target.blocks[block].inputs.SECS[1][1]===7){
                                            oldCode = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (!oldCode) {this.requirements.cat1.bool=true;}

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
                                            this.requirements.cat.bool = true;
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
                    this.requirements.sprite.bool = true;
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
                                this.requirements.script.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
}

