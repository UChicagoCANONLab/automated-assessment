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

    compare(obj1,obj2){//debugging this - recursion doesn't stop

        for (var p in obj1){
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                console.log('return false');
                return false;
            }
            if(obj1[p]===null && obj2[p]!==null) {
                console.log('return false');
                return false;
            }
            if(obj2[p]===null && obj1[p]!==null) {
                console.log('return false');
                return false;
            }

            switch (typeof (obj1[p])) {
                case 'object':
                    console.log('case object');
                    if (!this.compare(obj1[p],obj2[p])){
                        console.log('return false');
                        return false;}
                    break;
                case 'function':
                    console.log('case function');
                    if (typeof (obj2[p])==='undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) {
                        console.log('return false');
                        return false;
                    }
                    break;
                default:
                    console.log('case default');
                    console.log(obj1[p]);
                    console.log(obj2[p]);
                    if (obj1[p] !== obj2[p]) {
                        console.log('return false');
                        return false;
                    }
            }
        }
        for (var p in obj2) {
            if (typeof (obj1[p])==='undefined') {
                console.log('return false');
                return false;
            }
        }
        console.log('return true');
        return true;
    }

    grade(fileObj, user) {
        console.log('start grade');
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/name-poem-original-test'), null);
        this.initReqs();
        if (!is(fileObj)) return;

        //checks if there's at least one sprite
        if (project.sprites.length > 0) {
            this.requirements.hasOneSprite.bool = true;
        }

        let spritesWithScripts = 0;
        let spritesWithNewDialogue = 0;
        let spritesWithNewCostumes = 0;
        let spritesWithNewMovement = 0;

        let originalCostumes = [];
        let originalBlocks = [];
        let projectBlocks = [];

        let mapOriginal = new Map();
        let mapProject = new Map();


        for (let target of original.targets) {
            if (target.isStage) { continue; }
            for (let costume of target.costumes) {
                originalCostumes.push(costume.assetId);
            }
            mapOriginal.set(target.name, target.blocks);
        }//checking costumes, making map for movement

        //    console.log('mapOriginal:');
        //    console.log(mapOriginal);

        // let blockArray = [];
        // let spr = 0;
        // for (let target of project.targets) {
        //     blockArray[spr] = new Array();
        //     for (let block in target.blocks) {
        //         let opc = target.blocks[block].opcode;
        //         if (opc !== 'looks_sayforsecs') {
        //             blockArray[spr].push(target.blocks[block]);
        //         }
        //     }
        //     spr++;
        // }//checking movement

        let equal = false;
        for (let target of project.targets) {


            let backdropInOriginal = true;
            if (target.isStage) { //check to see if backdrop is changed
                for (let cost of target.costumes) {
                    for (let tOriginal of original.targets) {
                        for (let originalCostume of tOriginal.costumes) {
                            if (cost.assetId === originalCostume.assetId) {
                                equal = true;
                            }
                        }
                    }
                    if (!equal) {
                        backdropInOriginal = false;
                    }
                }
                this.requirements.backdrop.bool = !backdropInOriginal;
            } else {//check all these if target is a sprite

                //checking scripts
                for (let block in target.blocks) {
                    if (!target.blocks[block].parent && target.blocks[block].next) {
                        if (this.eventOpcodes.includes(target.blocks[block].opcode)) {
                            let nextBlock = target.blocks[block].next;
                            if (this.otherOpcodes.includes(target.blocks[nextBlock].opcode)) {
                                spritesWithScripts++;
                            }
                        }
                    }

                    //checking dialogue
                    if (target.blocks[block].opcode === 'looks_sayforsecs') {
                        let blockMessage = target.blocks[block].inputs.MESSAGE[1][1];
                        if ((blockMessage !== 'Daring!!!') &&
                            (blockMessage !== 'Interesting!!!') &&
                            (blockMessage !== 'Artistic!!!') &&
                            (blockMessage !== 'Nice!!!') &&
                            (blockMessage !== 'Exciting!!!')) {
                            spritesWithNewDialogue++;
                        }
                    }
                }

                //checking costumes
                for (let costume of target.costumes) {
                    if (!originalCostumes.includes(costume.assetId)) {
                        spritesWithNewCostumes++;
                        break;
                    }
                }

                mapProject.set(target.name, target.blocks);

                // let map1 = new Map();
                // map1.set(target.name, target.blocks);
                // //checking movement
                // let moved = false;
                // for (let block in target.blocks){
                //     if (target.blocks[block].opcode!=='looks_sayforsecs'){
                //         for (let i = 0; i<blockArray.length;i++){
                //             for (let j = 0; j<blockArray[i].length;j++){
                //             //     if (block===blockArray[i][j]){
                //             //         moved=false;
                //             //     }
                //             }
                //         }
                //     }
                // }
                // if (moved===true){
                //     spritesWithNewMovement++;
                // }
            }
        }


        // console.log('mapProject:');
        //console.log(mapProject);

        let inDIANE = false;
        for (let v of mapProject.values()) {
            for (let w of mapOriginal.values()) {
                // console.log('v:');
                // console.log(v);
                // console.log('w:');
                // console.log(w);
                // console.log('w is finished');

                
                if (this.compare(v, w)) {
                   // console.log('object is');
                    inDIANE = true;
                };
            }
            if (!inDIANE) {
                spritesWithNewMovement++;
            }
        }

        if (spritesWithScripts >= project.sprites.length / 2) {
            this.requirements.scripts.bool = true;
        }
        if (spritesWithNewDialogue >= project.sprites.length / 2) {
            this.requirements.dialogue.bool = true;
        }
        if (spritesWithNewCostumes >= project.sprites.length / 2) {
            this.requirements.costumes.bool = true;
        }
        if (spritesWithNewMovement >= project.sprites.length / 2) {
            this.requirements.movement.bool = true;
        }
        console.log(spritesWithNewDialogue);
    }
}