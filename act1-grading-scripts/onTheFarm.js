
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
        this.requirements.scriptForBunnyMoves = { bool: false, str: 'When Bunny is clicked it moves' };
        this.requirements.scriptForBunnySounds = { bool: false, str: 'When Bunny is clicked it makes a sound' };
        this.requirements.scriptForBunnySaysOrThinks = { bool: false, str: 'When Bunny is clicked it says or thinks something' };
        this.requirements.scriptInOrderBunny = {bool: false, str: 'When Bunny is clicked the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.scriptForHeddyMoves = { bool: false, str: 'When Heddy is clicked it moves' };
        this.requirements.scriptForHeddySounds = { bool: false, str: 'When Heddy is clicked it makes a sound' };
        this.requirements.scriptForHeddySaysOrThinks = { bool: false, str: 'When Heddy is clicked it says or thinks something' };
        this.requirements.scriptInOrderHeddy = {bool: false, str: 'When Heddy is clicked the blocks are used in the in the order specified: move, make a sound, say/think something'};
        this.requirements.bunnyOrigin = {bool: false, str: 'Set starting place for Bunny'};
        this.requirements.heddyOrigin = {bool: false, str: 'Set starting place for Heddy'};

        this.requirements.rooGlides = { bool: false, str: "Another glide block is added to Roo's script to make it move back to the starting location" };
        this.extensions.heddyMoves = {bool: false, str: "Make Heddy move to another location"}
        this.extensions.bunnyMoves = {bool: false, str: "Make Bunny move to another location"}
        this.extensions.anotherSprite = { bool: false, str: 'Another sprite is added that moves, makes a sound, then does something else when clicked' };
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
                        if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            let motionSatisfied = false;
                            let soundSatisfied = false;
                            for(let block of script.blocks){
                                if(!motionSatisfied){
                                    if(block.opcode.includes('motion_')){
                                        motionSatisfied = true;
                                    }
                                    continue;
                                } else if(!soundSatisfied){
                                    if(block.opcode.includes('sound_')){
                                        soundSatisfied = true;
                                    }
                                    continue;
                                } else{
                                    this.extensions.anotherSprite.bool = true;
                                }
                            }
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

        let extraMinBlocks = 1;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Bunny') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
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
                        if(script.blocks[0].opcode === 'event_whenflagclicked') {
                            this.requirements.bunnyOrigin.bool = script.blocks.map(block => block.opcode).includes('motion_gotoxy')
                        }else if(script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            this.extensions.bunnyMoves.bool = script.blocks.filter(block => block.opcode.includes('motion_')).length > extraMinBlocks;
                        }
                    }
                }
                else if (target.name === 'Heddy') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
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
                        if(script.blocks[0].opcode === 'event_whenflagclicked') {
                            this.requirements.heddyOrigin.bool = script.blocks.map(block => block.opcode).includes('motion_gotoxy')
                        } else if(script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            this.extensions.heddyMoves.bool = script.blocks.filter(block => block.opcode.includes('motion_')).length > extraMinBlocks;
                        }
                    }
                }

                else if (target.name === 'Roo') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if ("event_whenthisspriteclicked" === script.blocks[0].opcode) {
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
