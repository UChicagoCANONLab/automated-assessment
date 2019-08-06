/* Conditional Loops L2 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
Scratch 3 updates: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.stop = {bool: false, str: 'Vehicle sprite stops when touching another sprite or another color'}; // check condition in repeat until
        this.requirements.speak = {bool: false, str: 'Vehicle sprite says something or makes a sound when it stops'}; // check block after repeat until 
        this.requirements.moves = {bool: false, str: 'Vehicle sprite moves across the stage in a looping fashion'}; // check contents of the loop
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
            else {        
                for (let block in target.blocks) {
                    
                    // script starting with the when green flag clicked block
                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        
                        let b = new Block(target,block);
                        let childBlocks = b.childBlocks();
                        for (let i = 0; i < childBlocks.length; i ++) {
                            if (childBlocks[i].opcode === 'control_repeat_until') {
                                // checks if a sound is made once the loop is over
                                var soundOptions = ['sound_playuntildone', 'sound_play', 'looks_say', 'looks_sayforsecs']
                                let nextBlock = childBlocks[i].next;
                                if (nextBlock === null) {
                                    this.requirements.speak.bool = false;
                                } else if (soundOptions.includes(target.blocks[nextBlock].opcode)) {
                                    this.requirements.speak.bool = true;
                                }

                                let condition = childBlocks[i].inputs.CONDITION[1];

                                if (target.blocks[condition].opcode === 'sensing_touchingobject') {
                                    let touching = target.blocks[condition].inputs.TOUCHINGOBJECTMENU[1];
                                    var objectTouching = target.blocks[touching].fields.TOUCHINGOBJECTMENU[0];
                                }
                                
                                // checks to see if it stops when it is touching a color
                                console.log(target.blocks[condition].opcode);
                                if ((target.blocks[condition].opcode === 'sensing_touchingcolor') ||
                                (target.blocks[condition].opcode === 'sensing_coloristouchingcolor')) {
                                    console.log('here');
                                    this.requirements.stop.bool = true;
                                }
                                
                                let substack = childBlocks[i].inputs.SUBSTACK[1];
                                var moveOptions = ['motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
                                if (moveOptions.includes(target.blocks[substack].opcode)) {
                                    this.requirements.moves.bool = true;
                                }
                            }
                        }
                    }  
                }
            }
            // checks to see if it stops when it is touching another sprite
            if (target.name === objectTouching) {
                this.requirements.stop.bool = true;
            }
        }
    }
}

