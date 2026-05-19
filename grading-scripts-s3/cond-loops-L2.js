/* Conditional Loops L2 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
Scratch 3 updates: Saranya Turimella, Summer 2019
Static analysis code (info object) added for Block Usage CSVs and Graphs: Anna Zipp, Autumn 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.stop = { bool: false, str: 'Sprite stops when touching another sprite or another color' }; // done
        this.requirements.speak = { bool: false, str: 'Sprite says something or makes a sound when it stops' }; // done
        this.requirements.moves = { bool: false, str: 'Sprite moves across the stage in a looping fashion' }; // done
        this.extensions.touchingNewSprite = { bool: false, str: 'The sprite stops when it touches a new sprite added from the sprite library' };
        this.extensions.repeatBlock = { bool: false, str: 'Repeat blocks added to animate another sprite' }; // done
        this.extensions.multipleStops = { bool: false, str: 'Sprite stops in different places when triggered by different events' };

        /*
        //        this.extensions.addCostume = { bool: false, str: 'Another costume is added to the current mode of transportation' }; // done
        //       this.extensions.nextCostume = { bool: false, str: 'The sprite is animated with a "next costume" block' }; // done
        */


        this.info = {
            blocks: 0,
            sprites: 0,
            spritesWith1Script: 0,
            spritesWith2Scripts: 0,
            guidingUser: false,
            blockTypes: new Set([]),
            strings: [],
            score: 0 //requirement score
        }
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        let numRepeat = 0;
        let allCostumes = 0;
        let sprites = [];
        let objectTouching = null;
        let touching = null;
        let moveOptions = ['motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
        let soundOptions = ['sound_playuntildone', 'sound_play', 'looks_say', 'looks_sayforsecs']

        var validScripts = 0;
        var events = [];

        for (let target of project.targets) {
            if (target.isStage) continue;

            sprites.push(target.name);

            let eventStopTargets = [];

            for (let script of target.scripts) {
                if (script.blocks[0].opcode.includes('event_')) {

                    let eventBlock = script.blocks[0];
                    let eventId = eventBlock.opcode;
                    if (eventBlock.fields) {
                        eventId += JSON.stringify(eventBlock.fields);
                    }

                    let scriptStopTarget = null;

                    for (let i = 0; i < script.blocks.length; i++) {
                        let block = script.blocks[i];

                        if (block.opcode.includes('control_repeat')) {
                            numRepeat++;
                            let nextBlock = block.next;
                            let condition = block.conditionBlock;

                            if (condition != undefined) {
                                if (condition.opcode === 'sensing_touchingobject') {
                                    touching = condition.inputs.TOUCHINGOBJECTMENU[1];
                                    objectTouching = target.blocks[touching].fields.TOUCHINGOBJECTMENU[0];

                                    scriptStopTarget = objectTouching;
                                    this.requirements.stop.bool = true;

                                } else if (condition.opcode === 'sensing_touchingcolor' || condition.opcode === 'sensing_coloristouchingcolor') {
                                    scriptStopTarget = 'color_' + JSON.stringify(condition.inputs.COLOR);
                                    this.requirements.stop.bool = true;
                                }
                            }

                            if (nextBlock != null && soundOptions.includes(target.blocks[nextBlock].opcode)) {
                                this.requirements.speak.bool = true;
                            }

                            let substack = block.inputs.SUBSTACK[1];
                            if (substack) {
                                if (moveOptions.includes(target.blocks[substack].opcode)) {
                                    this.requirements.moves.bool = true;
                                } else {
                                    while (target.blocks[substack].next !== null) {
                                        if (moveOptions.includes(target.blocks[substack].opcode)) {
                                            this.requirements.moves.bool = true;
                                        }
                                        substack = target.blocks[substack].next;
                                    }
                                }
                            }
                        }
                    }

                    if (scriptStopTarget !== null) {
                        eventStopTargets.push({ eventId: eventId, target: scriptStopTarget });
                    }
                }
            }

            for (let i = 0; i < eventStopTargets.length; i++) {
                for (let j = i + 1; j < eventStopTargets.length; j++) {
                    let event1 = eventStopTargets[i];
                    let event2 = eventStopTargets[j];

                    if (event1.eventId !== event2.eventId && event1.target !== event2.target) {
                        this.extensions.multipleStops.bool = true;
                    }
                }
            }

            allCostumes += target.costumes.length;

            // Static analysis code
            this.info.sprites++;
            //iterating through each of the sprite's scripts that start with an event block
            for (var script of target.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
                // search through each block and execute the given callback function
                // that determines what to look for and what to do (through side effects) for each block
                script.traverseBlocks((block, level) => {
                    var opcode = block.opcode;

                    if (opcode in this.info.blockTypes) {
                        // do nothing
                    } else {
                        this.info.blockTypes.add(opcode);
                        this.info.blocks++;
                    }

                    if (opcode.includes('say')) {
                        let string = block.inputs.MESSAGE[1][1].toLowerCase();
                        this.info.strings.push(string);
                        if (!this.info.guidingUser) {
                            for (let keyword of ['press', 'click']) {
                                if (string.includes(keyword)) {
                                    this.info.guidingUser = true;
                                    break;
                                }
                            }
                        }
                    }

                });

                var event = script.blocks[0];
                // adds to list of unique events and scripts
                if (!events.includes(event.opcode)) {
                    events.push(event.opcode);
                    if (script.blocks.length > 1) {
                        validScripts++;
                    }
                }
                if (validScripts >= 2) {
                    this.info.spritesWith2Scripts++;
                } else if (validScripts >= 1) {
                    this.info.spritesWith1Script++;
                }
            }

        }
        /*
                if (allCostumes > 12) {
                    this.extensions.addCostume.bool = true;
                }       
        */

        if (numRepeat > 1) {
            this.extensions.repeatBlock.bool = true;
        }

        if (project.sprites.length > 2) {
            if ((objectTouching !== 'Sign') || (objectTouching !== 'Stop')) {
                this.extensions.touchingNewSprite.bool = true;
            }
        }

        // Static analysis code
        delete this.info.strings;
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool ? 1 : 0), 0);
    }
}
