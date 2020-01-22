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
        this.requirements.stop = { bool: false, str: 'Vehicle sprite stops when touching another sprite or another color' }; // done
        this.requirements.speak = { bool: false, str: 'Vehicle sprite says something or makes a sound when it stops' }; // done
        this.requirements.moves = { bool: false, str: 'Vehicle sprite moves across the stage in a looping fashion' }; // done
        this.extensions.addCostume = { bool: false, str: 'Another costume is added to the current mode of transportation' }; // done
        this.extensions.nextCostume = { bool: false, str: 'The sprite is animated with a "next costume" block' }; // done
        this.extensions.touchingNewSprite = { bool: false, str: 'The sprite stops when it touches a new sprite added from the sprite library' };
        this.extensions.repeatBlock = { bool: false, str: 'Repeat blocks added to animate another sprite' }; // done
    
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
        
        // static analysis variables
        var validScripts = 0;
        var events = [];

        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
            else {
                sprites.push(target.name);
                for (let script of target.scripts) {
                    // a script that starts with an event block
                    if (script.blocks[0].opcode.includes('event_')) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            // checking to see if a repeat block is used
                            
                            if (script.blocks[i].opcode.includes('control_repeat')) {
                                //console.log(target.name)
                                numRepeat++;

                                //checks to see if a sound is is made once the loop is over
                                let nextBlock = script.blocks[i].next;
                               
                                // if there is no next block continue
                                if (nextBlock === null) {
                                    continue;
                                }
                                // if the next block is a sound block, set the requirement
                                else if (soundOptions.includes(target.blocks[nextBlock].opcode)) {
                                    this.requirements.speak.bool = true;
                                }
                                
                                
                                let condition = (script.blocks[i]).conditionBlock;
                                if (condition != undefined) {
                                    let condBlock = target.blocks[condition];
                                    if (condBlock) {
                                        if (target.blocks[condition].opcode === 'sensing_touchingobject') {
                                            touching = target.blocks[condition].inputs.TOUCHINGOBJECTMENU[1];
                                            objectTouching = target.blocks[touching].fields.TOUCHINGOBJECTMENU[0];
                                
                                        }
                                        // checks that it stops when touching a color
                                        else if ((target.blocks[condition].opcode === 'sensing_touchingcolor') ||
                                            (target.blocks[condition].opcode === 'sensing_coloristouchingcolor')) {
                                            this.requirements.stop.bool = true;
                                        }   
                                    }
                                }

                                let substack = script.blocks[i].inputs.SUBSTACK[1];
                                
                                if (substack) {
                                // there is only one block in the loop and that is a move block
                                    if (moveOptions.includes(target.blocks[substack].opcode)) {
                                    
                                        this.requirements.moves.bool = true;
                                    } else {
                                        // there are multiple blocks in the loop, iterate through them to see 
                                        while (target.blocks[substack].next !== null) {
                                        
                                            
                                            if (moveOptions.includes(target.blocks[substack].opcode)) {
                                                
                                                this.requirements.moves.bool = true;
                                            }
                                            if ((target.blocks[substack].opcode === 'looks_switchcostumeto') || (target.blocks[substack].opcode === 'looks_nextcostume')) {
                                                this.extensions.nextCostume.bool = true;
                                            }
                                            substack = target.blocks[substack].next;
                                        }
                                    }
                                }


                            }
                     
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
                    if (validScripts >=2) {
                        this.info.spritesWith2Scripts++;
                    } else if (validScripts >= 1) {
                        this.info.spritesWith1Script++;
                    }
                }

            }
        }
        if(sprites.includes(objectTouching)) {
            this.requirements.stop.bool = true;
        }
       
        if (allCostumes > 12) {
            this.extensions.addCostume.bool = true;
        }       
        
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
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool? 1 : 0), 0);
    }
}

                
  