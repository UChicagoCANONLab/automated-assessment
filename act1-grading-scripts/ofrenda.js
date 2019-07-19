/*
Act 1 Events Ofrenda Autograder
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.newCostumes1 = {bool: false, str: 'At least one sprite has a new costumes'};
        this.requirements.newCostumes2= {bool: false, str: 'At least two sprites have new costumes'};
        this.requirements.newCostumes3 = {bool: false, str: 'At least three sprites have new costumes'}; // done

        this.requirements.speaking3 = {bool: false, str: 'All three sprites use the say block'}; // done
        this.requirements.speaking2 = {bool: false, str: 'Two sprites use the say block'}; // done
        this.requirements.speaking1 = {bool: false, str: 'A sprite uses the say block'}; // done

        this.requirements.interactive2 = {bool: false, str: '2/3 sprites are interactive'}; // done
        this.requirements.interactive1 = {bool: false, str: '1/3 sprites are interactive'}; // done

        this.extensions.usesPlaySoundUntilDone = { bool: false, str: 'The project uses the "Play Sound Until" block in a script' }; 
        this.extensions.usesGotoXY = { bool: false, str: 'The project uses the "Go to XY" block in a script' };
        this.extensions.keyCommand = { bool: false, str: 'The project uses a "when "key" pressed" block in a script' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let origCostumeLeft = 0;
        let origCostumeRight = 0;
        let origCostumeMiddle = 0;

        // gets the costumes from the original project 
        var oldCostumes = [];
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Left') {
                let currCost1 = origTarget.currentCostume;
                origCostumeLeft = origTarget.costumes[currCost1].assetId;
            }
            if (origTarget.name === 'Right') {
                let currCost2 = origTarget.currentCostume;
                origCostumeRight = origTarget.costumes[currCost2].assetId;
            }
            if (origTarget.name === 'Middle') {
                let currCost3 = origTarget.currentCostume;
                origCostumeMiddle = origTarget.costumes[currCost3].assetId;
            }
        }

        // new
        var newCostumes = [];
        var soundOptions = ['looks_say', 'looks_sayforsecs'];
        
        var spritesWithSound = 0;
        
        var spritesWithInteraction =0;
    
        for (let target of project.targets) {
            if (target.isStage) {continue;}
            else if(target.name === 'Catrina') {
                continue;
            }
            else {
                // pushes the assetid of the new costume to an array
                let currentCostume = target.currentCostume;
                newCostumes.push(target.costumes[currentCostume].assetId);
                var usesPlaySound = false;
                var usesMotion = false;
                var usesKeyPress = false;
                var hasSound= false;
                var hasInteraction = false;
                for (let block in target.blocks) {
                    
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            
                            hasSound = true;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            if (target.blocks[block].next === "}VBgCH{K:oDh6pV0h.pi" && target.blocks[block].parent === null) {
                                console.log('in original');
                                continue;
                            } else {
                                hasInteraction = true;
                            }
                            if (target.blocks[block].next === "/f[ltBij)7]5Jtg|W(1%" && target.blocks[block].parent === null) {
                                console.log('in original');
                                continue;
                            } else {
                                hasInteraction = true;
                            }
                        }
                    }
                    
                    var eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked', 'event_whenkeypressed'];
                    if (eventOpcodes.includes(target.blocks[block].opcode)) {
                        let b = new Block(target, block);
                        let childBlocks = b.childBlocks();
                        for (let i= 0; i < childBlocks.length; i ++) {
                            if (childBlocks[i].opcode === 'sound_playsounduntildone') {
                                usesPlaySound = true;
                            }
                            if (childBlocks[i].opcode === 'motion_gotoxy') {
                                usesMotion = true;
                            }
                            if (childBlocks[i].opcode === 'event_whenkeypressed') {
                                usesKeyPress = true;
                            }
                        }
                    }
                }
                if (hasSound) {
                    spritesWithSound ++;
                }
                if (hasInteraction) {
                    spritesWithInteraction ++;
                }

            }
        }

        // compares the assetid of one of the new costumes to the assetids of all of the old ones
        let numChanged = 0;
        for (let i = 0; i < newCostumes.length; i ++) {
            for (let j = 0; j < oldCostumes.length; j ++) {
                if (newCostumes[i] !== oldCostumes[i]) {
                    numChanged ++;
                }
            }
        }
        if (spritesWithInteraction >= 2) {
            this.requirements.interactive2.bool = true;
        }
        if (spritesWithInteraction === 1) {
            this.requirements.interactive1.bool = true;
        }

        if (numChanged >= 3) {
            this.requirements.newCostumes3.bool = true;
        }
        if (numChanged == 2) {
            this.requirements.newCostumes2.bool = true;
        }
        if (numChanged === 1) {
            this.requirements.newCostumes1.bool = true;
        }
        
        if (spritesWithSound >= 3) {
            this.requirements.speaking3.bool = true;
        }
        if (spritesWithSound === 2) {
            this.requirements.speaking2.bool = true;
        }
        if (spritesWithSound === 1) {
            this.requirements.speaking1.bool = true;
        }


        this.extensions.usesPlaySoundUntilDone.bool = usesPlaySound;
        this.extensions.usesGotoXY.bool = usesMotion;
        this.extensions.keyCommand.bool = usesKeyPress;
    
    }
} 