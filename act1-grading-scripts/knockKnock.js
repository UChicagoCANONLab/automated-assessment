/*
Act 1 Knock Knock Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.sheepLaughs = { bool: false, str: 'The sheep laughs after the cow says "Moooooooo"' };
        this.requirements.anotherKnockKnock = { bool: false, str: 'Another knock knock joke is told, starting with then the space bar is pressed' };
    }

    grade(fileObj, user) {
        this.initReqs();
        if (!is(fileObj)) {
            return;
        }


        var project = new Project(fileObj, null);
        
        let soundOptions = ['looks_say', 'looks_sayforsecs', 'sound_playforsecs', 'sound_playuntildone'];
        let sheepJoke = [];
        let cowJoke = [];
        let goodSheep = ['event_whenkeypressed', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs'];
        let goodCow = ['event_whenkeypressed', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_sayforsecs'];

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                // sheep sprite - check that the sheep laughs, needs to add a wait block and then a sound block to laugh
                // after the cow says moo
                if (target.name === 'Sheep') {
                    for (let script of target.scripts) {
                        // starts with when green flag clicked
                        if (script.blocks[0].opcode === 'event_whenflagclicked') {
                            for (let i = 0; i < script.blocks.length; i++) {
                                // finds the block with the opcode that is a think (last block in the script of the original project)
                                if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                                    let nextBlock = script.blocks[i].next;
                                    if (nextBlock !== null) {
                                        // makes sure that the next block added is a wait
                                        if (target.blocks[nextBlock].opcode === 'control_wait') {
                                            let nextNextBlock = target.blocks[nextBlock].next;
                                            if (nextNextBlock !== null) {
                                                // next block added after that should be a sound 
                                                if (soundOptions.includes(target.blocks[nextNextBlock].opcode)) {
                                                    this.requirements.sheepLaughs.bool = true;
                                                }
                                            }
                                        }
                                    }

                                }

                            }

                        }


                        // collects all the blocks that are in the script when space key pressed for sheep
                        if (script.blocks[0].opcode === 'event_whenkeypressed') {
                            if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    sheepJoke.push(script.blocks[i].opcode);

                                }
                            }
                        }
                    }

                }
                // collects all the blocks that are in the script when space key pressed for cow
                if (target.name === 'Cow') {
                    for (let script of target.scripts) {
                        if (script.blocks[0].opcode === 'event_whenkeypressed') {
                            if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    cowJoke.push(script.blocks[i].opcode);

                                }
                            }

                        }
                    }
                }

            }



        }

        var util = require('util');
        let cowOrig = util.inspect(goodCow);
        let sheepOrig = util.inspect(goodSheep);
        let cowUtil = util.inspect(cowJoke);
        let sheepUtil = util.inspect(sheepJoke);

        // checks that the opcodes of the jokes that were collected previously
        // match the correct order of a knock knock joke
        // if this is true the requirement is set to true 
        if (cowOrig === cowUtil && sheepOrig === sheepUtil) {
            this.requirements.anotherKnockKnock.bool = true;
        }

    }
}