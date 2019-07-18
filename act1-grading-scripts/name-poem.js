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
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };//done
        this.requirements.scripts = { bool: false, str: 'At least half of the sprites have a script using the 11 blocks given (with at least one event block and at least one other block)' };//done
        this.requirements.costumes = { bool: false, str: 'At least half of the sprites have costumes other than the ones originally set' };//done
        this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have dialogue other than that originally given' };//done
        this.requirements.movement = { bool: false, str: 'At least half of the sprites have movement other than that already given' };//to fix
        this.requirements.backdrop = { bool: false, str: 'The background has been changed' };//done
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/name-poem-original-test'), null);
        this.initReqs();
        if (!is(fileObj)) return;

        //checks if there's at least one sprite
        if (project.sprites.length > 0) {
            this.requirements.hasOneSprite.bool = true;
        }

        //instantiate counters for requirements
        let spritesWithScripts = 0;
        let spritesWithNewDialogue = 0;
        let spritesWithNewCostumes = 0;
        let spritesWithNewMovement = 0;
        let newBackdrop = false;

        //make list of original costumes
        //make map of original blocks for movement
        let originalCostumes = [];
        let mapOriginal = new Map();
        let mapProject = new Map();
        for (let target of original.targets) {
            if (target.isStage) { continue; }

            for (let costume of target.costumes) {
                originalCostumes.push(costume.assetId);
            }
            mapOriginal.set(target.name, target.blocks);
        }

        var allTargetBlocks = [];
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
                
                let hasDialogue = false;
                let movementOrSound = false;
                for (let block in target.blocks) {
                    if (this.eventOpcodes.includes(target.blocks[block].opcode)) {
                        let b = new Block(target, block);
                        let childBlocks = b.childBlocks();

                        mapProject.set(target.name, childBlocks);
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
                            }else{
                              ////////
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
          let inDIANE = false;
          for (let v of mapProject.values()) {
              for (let w of mapOriginal.values()) {
                  var util = require('util');
                  v = util.inspect(v);
                  w = util.inspect(w);
                  if (v === w) {
                      inDIANE = true;
                  };
              }
              if (!inDIANE) {
                  spritesWithNewMovement++;
              }
          }

        // > 1/2 of sprites fulfill requirement?
        console.log('sprites with scripts');
        console.log(spritesWithScripts);
        if (spritesWithScripts >= project.sprites.length / 2) {
            this.requirements.scripts.bool = true;
        }

        console.log('sprites with dialogue');
        console.log(spritesWithNewDialogue)
        if (spritesWithNewDialogue >= project.sprites.length / 2) {
            this.requirements.dialogue.bool = true;
        }

        console.log('sprite with new costumes');
        console.log(spritesWithNewCostumes);
        if (spritesWithNewCostumes >= project.sprites.length / 2) {
            this.requirements.costumes.bool = true;
        }

        console.log('sprites with new movement');
        console.log(spritesWithNewMovement);
        if (spritesWithNewMovement >= project.sprites.length / 2) {
            this.requirements.movement.bool = true;
        }
    }
}







