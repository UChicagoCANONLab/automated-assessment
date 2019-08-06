/* 
Act 1 Name Poem Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/

require('../grading-scripts-s3/scratch3')


module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_gotoxy', 'motion_glidesecstoxy', 'looks_sayforsecs', 'sound_playuntildone', 'looks_setsizeto', 'looks_show', 'looks_hide', 'control_wait', 'control_repeat'];
    }

    initReqs() {
        //this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };//done
        //this.requirements.scripts = { bool: false, str: 'At least half of the sprites have a script using the 11 blocks given (with at least one event block and at least one other block)' };//done
        this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        this.requirements.costumes = { bool: false, str: 'At least half of the sprites have costumes other than the ones originally set' };//done
        this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have dialogue other than that originally given' };//done
        this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        this.requirements.movement = { bool: false, str: 'At least half of the sprites have movement other than that already given' };//to fix
        this.requirements.backdrop = { bool: false, str: 'The background has been changed' };//done
        //     this.extensions.allReqs = { bool: false, str: 'All requirements are fulfilled' };
        //     this.extensions.oneSprite = { bool: false, str: 'At least one sprite has a new costume, dialogue, and movement using 11 blocks given (fulfills spirit)' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/name-poem-original-test'), null);
        this.initReqs();
        if (!is(fileObj)) return;

        //checks if there's at least one sprite
        // if (project.sprites.length > 0) {
        //     this.requirements.hasOneSprite.bool = true;
        // }

        //instantiate counters for requirements
        let spritesWithScripts = 0;
        let spritesWithNewDialogue = 0;
        let spritesWithNewCostumes = 0;
        let spritesWithNewMovement = 0;
        let newBackdrop = false;

        //make list of original costumes
        //make map of original blocks for movement
        let originalCostumes = [];
        let ogMovementBlocks = []; //array of arrays each containing a movement block's opcode, next, and previous
        let mapOriginal = new Map();
        let mapProject = new Map();
        for (let target of original.targets) {
            if (target.isStage) { continue; }
            for (let costume of target.costumes) {
                originalCostumes.push(costume.assetId);
            }

            for (let block in target.blocks) {
                if (target.blocks[block].opcode.includes('motion_') || target.blocks[block].opcode.includes('looks_')) {
                    if ((!target.blocks[block].opcode.includes('say')) && (!target.blocks[block].opcode.includes('think'))) {
                        let blockArray = [];
                        blockArray.push(target.blocks[block].opcode);
                        blockArray.push(target.blocks[block].next);
                        blockArray.push(target.blocks[block].previous);
                        ogMovementBlocks.push(blockArray);
                    }
                }
            }

            mapOriginal.set(target.name, target.blocks);
        }

        for (let target of project.targets) {
            //checking backdrop
            if (target.isStage) {
                for (let cost of target.costumes) {
                    let equal = false;
                    for (let tOriginal of original.targets) {
                        for (let originalCostume of tOriginal.costumes) {
                            if (cost.assetId === originalCostume.assetId) {
                                equal = true;
                            }
                        }
                        if (!equal) {
                            newBackdrop = true;
                        }
                    }
                }
                this.requirements.backdrop.bool = newBackdrop;
            } else {

                let hasMovement = false;

                        // console.log('before');
                for (let script in target.scripts) {
                    for (let block in target.scripts[script].blocks) {
                        let opc = target.scripts[script].blocks[block].opcode;
                        let bool = true;
                        if (this.otherOpcodes.includes(opc) && opc !== 'looks_sayforsecs') {
                            //                  console.log(opc);
                            if (opc === 'sound_playuntildone') {
                                let soundMenu = target.scripts[script].blocks[block].inputs.SOUND_MENU[1];
                                if (target.name === 'D-Glow') {
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'pop'
                                        && target.scripts[script].blocks[block].next === 'yBp{F@0b%qE?_?uRuv=P'
                                        && target.scripts[script].blocks[block].parent === ';7:di3O.oGwRy7Y-Zkyl') {
                                        bool = false;
                                    }
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'pop'
                                        && target.scripts[script].blocks[block].next === null
                                        && target.scripts[script].blocks[block].parent === 'yBp{F@0b%qE?_?uRuv=P') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow2') {
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'Crash Cymbal'
                                        && target.scripts[script].blocks[block].next === 'SKyz]Pt/{=Ot`i6(41E;'
                                        && target.scripts[script].blocks[block].parent === '?LAjCC]|@!Vp6k;A1Zv{') {
                                        bool = false;
                                    }
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'Crash Cymbal'
                                        && target.scripts[script].blocks[block].next === null
                                        && target.scripts[script].blocks[block].parent === 'SKyz]Pt/{=Ot`i6(41E;') {
                                        bool = false;
                                    }
                                }
                            }
                            if (opc === 'looks_changesizeby' && target.name === 'I-Glow') {
                                let param = target.scripts[script].blocks[block].inputs.CHANGE[1][1];
                                if (param === '30'
                                    && target.scripts[script].blocks[block].next === 'Hth-}qjG)rsWgUgOcm@?'
                                    && target.scripts[script].blocks[block].parent === 'ZstZjnd:|xmPpd|aG8zA') {
                                    bool = false;
                                }
                                if (param === '-30'
                                    && target.scripts[script].blocks[block].next === null
                                    && target.scripts[script].blocks[block].parent === 'Hth-}qjG)rsWgUgOcm@?') {
                                    bool = false;
                                }
                            }
                            // if (opc === 'motion_glidesecstoxy' && target.name === 'A-Glow') {
                            //     let paramSecs = target.scripts[script].blocks[block].inputs.SECS[1][1];
                            //     let paramX = target.scripts[script].blocks[block].inputs.X[1][1];
                            //     let paramY = target.scripts[script].blocks[block].inputs.Y[1][1];
                            //     if (paramSecs === '1' && paramX === '55' && paramY === '25'
                            //         && target.scripts[script].blocks[block].next === '^6iWa|d-|jw!SQI#e(Jr'
                            //         && target.scripts[script].blocks[block].parent === 'n]cy4r^o3t_m{{lMaGoY') {
                            //         bool = false;
                            //     }
                            //     if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                            //         && target.scripts[script].blocks[block].next === null
                            //         && target.scripts[script].blocks[block].parent === '^6iWa|d-|jw!SQI#e(Jr') {
                            //         bool = false;
                            //     }
                            //     if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                            //         && target.scripts[script].blocks[block].next === null
                            //         && target.scripts[script].blocks[block].parent === 'i[0P|D4q:tdG3Q{3hR`N') {
                            //         bool = false;
                            //     }
                            // }
                            if (opc === 'motion_glidesecstoxy') {
                                let paramSecs = target.scripts[script].blocks[block].inputs.SECS[1][1];
                                let paramX = target.scripts[script].blocks[block].inputs.X[1][1];
                                let paramY = target.scripts[script].blocks[block].inputs.Y[1][1];
                                let next = target.scripts[script].blocks[block].next;
                                let parent = target.scripts[script].blocks[block].parent;
                                if (target.name === 'D-Glow') {
                                    if (paramSecs === '1' && paramX === '-205' && paramY === '148'
                                        && next === null && parent === 'Fw}ev{0up#68XMVDC]5V') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'I-Glow') {
                                    if (paramSecs === '1' && paramX === '-210' && paramY === '80'
                                        && next === null && parent === 'em!(S`b]+MB2h8((R434') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow') {
                                    if (paramSecs === '1' && paramX === '55' && paramY === '25'
                                        && next === '^6iWa|d-|jw!SQI#e(Jr' && parent === 'n]cy4r^o3t_m{{lMaGoY') {
                                        bool = false;
                                    }
                                    if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                                        && next === null && parent === '^6iWa|d-|jw!SQI#e(Jr') {
                                        bool = false;
                                    }
                                    if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                                        && next === null && parent === 'i[0P|D4q:tdG3Q{3hR`N') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'N-Glow') {
                                    if (paramSecs === '1' && paramX === '-202' && paramY === '-52'
                                        && next === null && parent === '{nR@2|=S?G3-4ukMhO4n') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow2') {
                                    if (paramSecs === '1' && paramX === '-200' && paramY === '-120'
                                        && next === null && parent === 'ojhZT:%|m?wFvLSVqRoH') {
                                        bool = false;
                                    }
                                }
                            }
                            if (opc === 'motion_pointindirection' && target.name === 'N-Glow') {
                                let param = target.scripts[script].blocks[block].inputs.CHANGE[1][1];
                                if (param === '90'
                                    && target.scripts[script].blocks[block].next === 'i4C7qLY,7Dc:@{}d`:nV'
                                    && target.scripts[script].blocks[block].parent === 'GN6a/]#X1pYt~+7OZ{Rc') {
                                    bool = false;
                                }
                                if (param === '-90'
                                    && target.scripts[script].blocks[block].next === null
                                    && target.scripts[script].blocks[block].parent === 'i4C7qLY,7Dc:@{}d`:nV') {
                                    bool = false;
                                }
                            }
                            if (bool) {
                                hasMovement = true;
                                console.log('Sprite with new movement:');
                                console.log(target.name);
                            }
                        }
                    }
                }
                if (hasMovement) { spritesWithNewMovement++; }
                // console.log('after');

                mapProject.set(target.name, target.blocks);
                let hasDialogue = false;
                for (let block in target.blocks) {

                    if (target.blocks[block].opcode.includes('motion_') || target.blocks[block].opcode.includes('looks_')) {
                        if ((!target.blocks[block].opcode.includes('say')) && (!target.blocks[block].opcode.includes('think'))) {

                        }
                    }

                    if (this.eventOpcodes.includes(target.blocks[block].opcode)) {
                        //  console.log('here');
                        let b = new Block(target, block);
                        let childBlocks = b.childBlocks();
                        // console.log('this is child blocks');
                        // console.log(childBlocks);
                        for (let i = 0; i < childBlocks.length; i++) {
                            if (childBlocks[i].opcode === 'looks_sayforsecs') {
                                let blockMessage = childBlocks[i].inputs.MESSAGE[1][1];

                                if ((blockMessage !== 'Daring!!!') &&
                                    (blockMessage !== 'Interesting!!!') &&
                                    (blockMessage !== 'Artistic!!!') &&
                                    (blockMessage !== 'Nice!!!') &&
                                    (blockMessage !== 'Exciting!!!')) {
                                    hasDialogue = true;
                                }
                            }
                        }
                        if (childBlocks.length >= 2) {
                            spritesWithScripts++;
                        }
                    }
                }
                if (hasDialogue) {
                    spritesWithNewDialogue++;
                }
                //checking costumes
                for (let costume of target.costumes) {
                    if (!originalCostumes.includes(costume.assetId)) {
                        spritesWithNewCostumes++;
                        break;
                    }
                }
            }
        }

        //checking movement
        //   let inDIANE = false;
        //   for (let v of mapProject.values()) {
        //       for (let w of mapOriginal.values()) {
        //           var util = require('util');
        //           v = util.inspect(v);
        //           w = util.inspect(w);
        //           if (v === w) {
        //               inDIANE = true;
        //           };
        //       }
        //       if (!inDIANE) {
        //           spritesWithNewMovement++;
        //       }
        //   }

        // > 1/2 of sprites fulfill requirement + TESTING
        //  console.log('sprites with scripts');
        //console.log(spritesWithScripts);
        // if (spritesWithScripts >= project.sprites.length / 2) {
        //     this.requirements.scripts.bool = true;
        // }

        //  console.log('sprites with dialogue');
        //  console.log(spritesWithNewDialogue)
        if (spritesWithNewDialogue) {this.requirements.dialogue1.bool=true;}
        if (spritesWithNewDialogue >= project.sprites.length / 2) {
            this.requirements.dialogue.bool = true;
        }

        //  console.log('sprite with new costumes');
        //  console.log(spritesWithNewCostumes);
        if (spritesWithNewCostumes) {this.requirements.costumes1.bool=true;}
        if (spritesWithNewCostumes >= project.sprites.length / 2) {
            this.requirements.costumes.bool = true;
        }

        // console.log('sprites with new movement');
        // console.log(spritesWithNewMovement);
        if (spritesWithNewMovement) {this.requirements.movement1.bool=true;}
        if (spritesWithNewMovement >= project.sprites.length / 2) {
            this.requirements.movement.bool = true;
        }

        // if (spritesWithNewCostumes && spritesWithNewDialogue && spritesWithNewMovement) {
        //     this.extensions.oneSprite = true;
        // }
        // if (this.requirements.movement.bool &&
        //     this.requirements.dialogue.bool &&
        //     this.requirements.backdrop.bool &&
        //     this.requirements.costumes.bool &&
        //     this.requirements.scripts.bool &&
        //     this.requirements.hasOneSprite.bool) {
        //     this.extensions.allReqs.bool = true;
        // }
    }
}







