
/*
On the Farm Autograde: Intial Version and testing: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.scriptForBunnyMoves = { bool: false, str: 'Bunny has a script in which it moves' };
        this.requirements.scriptForBunnySounds = { bool: false, str: 'Bunny has a script in which it makes a sound' };
        this.requirements.scriptForBunnySaysOrThinks = { bool: false, str: 'Bunny has a script in which it says or thinks something' };
        this.requirements.scriptInOrderBunny = {bool: false, str: 'Bunny has a script in which the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.scriptForHeddyMoves = { bool: false, str: 'Heddy has a script in which it moves' };
        this.requirements.scriptForHeddySounds = { bool: false, str: 'Heddy has a script in which it makes a sound' };
        this.requirements.scriptForHeddySaysOrThinks = { bool: false, str: 'Heddy has a script in which it says or thinks something' };
        this.requirements.scriptInOrderHeddy = {bool: false, str: 'Heddy has a script in which the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.rooGlides = { bool: false, str: "Another glide block is added to Roo's script to make it move back to the starting location" };
        this.extensions.allMove = { bool: false, str: 'All animals move to a different location' };
        this.extensions.anotherSprite = { bool: false, str: 'Another sprite is added and has a script' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        let sayOpcodes = ['looks_say', 'looks_sayforsecs'];
        let thinkOpcodes = ['looks_think', 'looks_sayforsecs'];
        let numGlides = 0;

        
        if (project.sprites.length > 2) {
            for (let target of project.targets) {
                if ((target.name !== 'Bunny') && (target.name!== 'Heddy') && (target.name !== 'Roo')) {
                    for (let script of target.scripts) {
                        if (script.blocks.length > 1) {
                            this.extensions.anotherSprite.bool = true;
                        }
                    }
                }
            }
        }

        let moveIndexBunny = 0;
        let soundIndexBunny = 0;
        let sayIndexBunny = 0;
        let moveIndexHeddy = 0;
        let soundIndexHeddy = 0;
        let sayIndexHeddy = 0;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Bunny') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    moveIndexBunny = i;
                                    this.requirements.scriptForBunnyMoves.bool = true;
                                }
                                if (script.blocks[i].opcode === 'sound_playuntildone') {
                                    soundIndexBunny = i;
                                    this.requirements.scriptForBunnySounds.bool = true;
                                }
                                if (sayOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexBunny = i;
                                    this.requirements.scriptForBunnySaysOrThinks.bool = true;
                                }
                                if (thinkOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexBunny = i;
                                    this.requirements.scriptForBunnySaysOrThinks.bool = true;
                                }
                            
                                if (moveIndexBunny !== 0 &&
                                    soundIndexBunny !== 0 &&
                                    sayIndexBunny !== 0) {
                                        if (moveIndexBunny < soundIndexBunny && soundIndexBunny < sayIndexBunny) {
                                            this.requirements.scriptInOrderBunny.bool = true;
                                            break;
                                        }
                                    }

                            }
                        }
                    }
                }
                else if (target.name === 'Heddy') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    moveIndexHeddy = i;
                                    this.requirements.scriptForHeddyMoves.bool = true;
                                }
                                if (script.blocks[i].opcode === 'sound_playuntildone') {
                                    soundIndexHeddy = i;
                                    this.requirements.scriptForHeddySounds.bool = true;
                                }
                                if (sayOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexHeddy = i;
                                    this.requirements.scriptForHeddySaysOrThinks.bool = true;
                                }
                                if (thinkOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexHeddy = i;
                                    this.requirements.scriptForHeddySaysOrThinks.bool = true;
                                }

                                if (moveIndexHeddy !== 0 &&
                                    soundIndexHeddy !== 0 &&
                                    sayIndexHeddy !== 0) {
                                        if (moveIndexHeddy < soundIndexHeddy && soundIndexHeddy < sayIndexHeddy) {
                                            this.requirements.scriptInOrderHeddy.bool = true;
                                            break;
                                        }
                                    }
                            }
                        }
                    }
                }

                else if (target.name === 'Roo') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
                                if (script.blocks[i].opcode === 'motion_glidesecstoxy') {
                                    numGlides++;
                                }
                            }
                        }
                    }
                }
                
                // if a glide block is added to the original project
                if (numGlides >= 2) {
                    this.requirements.rooGlides.bool = true;
                }
            }
        }
    }
}
