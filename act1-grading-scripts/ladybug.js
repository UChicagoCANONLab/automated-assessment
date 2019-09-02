/*
Act 1 Ladybug Scramble Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/


require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.oneAphid = { bool: false, str: 'Ladybug eats at least one aphid using only blocks specified' };
        this.requirements.bothAphids = { bool: false, str: 'Ladybug eats both aphids using only blocks specified' };
        this.requirements.eatAphidBlock = { bool: false, str: '"Eat Aphid" block is used' };
        this.requirements.ladybugInBounds = { bool: true, str: 'The ladybug stays on the branch' };
        this.requirements.changedProject = { bool: false, str: 'Project has been modified from the original project' };
        this.extensions.music = { bool: false, str: 'Background music added' };
        // this.extensions.changeAphidCode = { bool: false, str: 'Aphid code has been changed' };
        this.extensions.ladybugRedrawn = { bool: false, str: 'The ladybug has been redrawn in the costumes tab' };
        this.bug = { dir: 0, locX: -200, locY: -25 };
    }

    //helper functions

    //checks if ladybug stays on the branch (returns true or false)
    inBounds(x, y) {
        if ((x < -130) || ((x > -117) && (x < -31)) || ((x > -18) && (x < 69))) {
            return ((y <= -19) && (y > -32));
        }
        if ((x >= -130) && (x < -117)) {
            return ((y <= -19) && (y > -84));
        }
        if ((x > -31) && (x < -18)) {
            return ((y > -32) && (y < 131));
        }
        if ((x > 69) && (x < 82)) {
            return ((y <= -19) && (y > -133));
        }
        return false;
    }

    blankTo0(input){
        if (input===''){
            return 0;
        }else{
            return input;
        }
    }

    //updates bug direction and locaiton
    updateFromProc(block) {
        if (block.opcode === 'motion_gotoxy') {
            console.log('motion go to xy')
            this.bug.locX = parseFloat(this.blankTo0(block.inputs.X[1][1]));
            this.bug.locY = parseFloat(this.blankTo0(block.inputs.Y[1][1]));
        }
        if (block.opcode === 'motion_pointindirection') {
            console.log('motion point in direction');
            this.bug.dir = parseFloat(this.blankTo0(block.inputs.DIRECTION[1][1]));
        }
        if (block.opcode === 'motion_turnright') {
            console.log('motion turn right');
            this.bug.dir -= parseFloat(this.blankTo0(block.inputs.DEGREES[1][1]));
        }

        if (block.opcode === 'motion_turnleft') {
            console.log('motion turn left');
            this.bug.dir += parseFloat(this.blankTo0(block.inputs.DEGREES[1][1]));
        }
        if (block.opcode === 'motion_movesteps') {
            console.log('motion move steps');
            let radDir = (this.bug.dir - 90) * Math.PI / 180;
            let steps = parseFloat(this.blankTo0(block.inputs.STEPS[1][1]));
            this.bug.locX += Math.round(steps * Math.cos(radDir));
            this.bug.locY += Math.round(steps * Math.sin(radDir));
        }
    }
    
    //updates bug direction and locaiton
    updateBug(block) {
        if (block.opcode === 'procedures_call') {
            // move forward one square
            // turn left
            // turn right
            // forward 2 blocks
            // go to start position
        }
        if (block.opcode === 'motion_gotoxy') {
            console.log('motion go to xy')
            this.bug.locX = parseFloat(this.blankTo0(block.inputs.X[1][1]));
            this.bug.locY = parseFloat(this.blankTo0(block.inputs.Y[1][1]));
        }
        if (block.opcode === 'motion_pointindirection') {
            console.log('motion point in direction');
            this.bug.dir = parseFloat(this.blankTo0(block.inputs.DIRECTION[1][1]));
        }
        if (block.opcode === 'motion_turnright') {
            console.log('motion turn right');
            this.bug.dir -= parseFloat(this.blankTo0(block.inputs.DEGREES[1][1]));
        }

        if (block.opcode === 'motion_turnleft') {
            console.log('motion turn left');
            this.bug.dir += parseFloat(this.blankTo0(block.inputs.DEGREES[1][1]));
        }
        if (block.opcode === 'motion_movesteps') {
            console.log('motion move steps');
            let radDir = (this.bug.dir - 90) * Math.PI / 180;
            let steps = parseFloat(this.blankTo0(block.inputs.STEPS[1][1]));
            this.bug.locX += Math.round(steps * Math.cos(radDir));
            this.bug.locY += Math.round(steps * Math.sin(radDir));
        }
    }

    //checks if sprite is a ladybug
    isLadybug(target) {
        for (let block in target.blocks) {
            if (target.blocks[block].opcode === 'procedures_definition') {
                return true;
            }
        }
        return false;
    }

    grade(fileObj, user) {
        this.initReqs();
        if (!is(fileObj)) return;
        if (is(fileObj.code)) return;
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/original-ladybug'), null);
        if (!is(original)) return;

        let aphidLocations = [];
        let aphidsEaten = 0;
        let failed = false;

        let moveStepsBlocks = 0; //don't delete these you do use them even if vscode says you don't!
        let turnBlocks = 0;

        let aphidBlocks = null;
        let aphid2Blocks = null;
        let ogAphidBlocks = null;
        let ogAphid2Blocks = null;
        let bugBlocks = null;
        let ogBugBlocks = null;

        //stores given blocks for each sprite
        for (let target of original.targets){
            if (target.name === 'Aphid'){
                ogAphidBlocks = target.blocks;
            }else if (target.name === 'Aphid2'){
                ogAphid2Blocks=target.blocks;
            }else if ((target.name === 'Ladybug1')||this.isLadybug(target)){
                ogBugBlocks = target.blocks;
            }
        }

        for (let target of project.targets) {
            //stores starting location of aphid
            if ((target.name === 'Aphid') || (target.name === 'Aphid2')) {
                let loc = [];
                loc.push(target.x);
                loc.push(target.y);
                aphidLocations.push(loc);
            }
            //stores new sprite blocks and location/direction for ladybug
            if (target.name === 'Aphid'){
                aphidBlocks = target.blocks;
            }else if (target.name === 'Aphid2'){
                aphid2Blocks = target.blocks;
            }else if ((target.name === 'Ladybug1')||this.isLadybug(target)){
                bugBlocks=target.blocks;
                this.bug.locX=target.x;
                this.bug.locY=target.y;
                this.bug.dir=target.direction;
            }
        }

        //was checking original vs new blocks
        var util = require('util');
        let a = util.inspect(aphidBlocks);
        let a2 = util.inspect(aphid2Blocks);
        let ogA = util.inspect(ogAphidBlocks);
        let ogA2 = util.inspect(ogAphid2Blocks);
        let bb = util.inspect(bugBlocks);
        let ogBB = util.inspect(ogBugBlocks);
        let len = 0;
        if ((a!==ogA)||(a2!==ogA2)){
            // this.extensions.changeAphidCode.bool=true;
        }
        // if (bb!==ogBB){ this.requirements.changedProject.bool=true;}

        for (let target of project.targets) {
            for (let block in target.blocks) {

                //checks if music is added
                if ((target.blocks[block].opcode === 'sound_playuntildone')
                    || (target.blocks[block].opcode === 'sound_play')) {
                    this.extensions.music.bool = true;
                }
            }
            
            //stores ladybug script length
            if (target.name === 'Ladybug1' || this.isLadybug(target)) {
                for (let script of target.scripts) {
                    if (script.blocks[0].opcode === 'event_whenflagclicked') {
                        if (script.blocks.length <= 1) {
                            continue;
                        }
                        else if (script.blocks[1].opcode === 'control_forever') {
                            continue;
                        } else {
                            len = script.blocks.length;
                        }
                       
                    }
                }
                
                //checks if ladybug has a new costume
                for (let cost in target.costumes) {
                    if ((target.costumes[cost].assetId !== '7501580fb154fde8192a931f6cab472b')
                        && (target.costumes[cost].assetId !== '169c0efa8c094fdedddf8c19c36f0229')) {
                        this.extensions.ladybugRedrawn.bool = true;
                    }
                }
                
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        //updates bug location and checks if it is still on the branch
                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            this.updateBug(target.blocks[i]);
                            let onBranch = this.inBounds(this.bug.locX, this.bug.locY);
                            if (!onBranch) {
                                this.requirements.ladybugInBounds.bool = false;
                                failed = true;
                            }

                            //checks if ladybug is on top of aphid
                            let onAphid = false;
                            for (let aphidLoc of aphidLocations) {
                                if ((Math.abs(aphidLoc[0] - this.bug.locX) <= 40) &&
                                    (Math.abs(aphidLoc[1] - this.bug.locY) <= 40)) {
                                    onAphid = true;
                                }
                            }
                            //checks if ladybug eats aphid
                            if (onAphid) {
                                let nextBlock = target.blocks[i].next;
                                if (target.blocks[nextBlock].opcode === 'procedures_call') {
                                    if (target.blocks[nextBlock].mutation.proccode === 'Eat Aphid') {
                                        if (failed === false) {
                                            aphidsEaten++;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //checks if 'Eat Aphid' block is connected to a script
                    if (target.blocks[block].opcode === 'procedures_call') {
                        if (target.blocks[block].mutation.proccode === 'Eat Aphid') {
                            if (target.blocks[block].parent !== null) {
                                this.requirements.eatAphidBlock.bool = true;
                            }
                        }
                    }

                    //checks if a new "move steps" block has been connected
                    if (target.blocks[block].opcode === 'motion_movesteps') {
                        if (target.blocks[block].parent !== null) {
                            moveStepsBlocks++;
                        }
                    }
                    if ((target.blocks[block].opcode === 'motion_turnright') ||
                        (target.blocks[block].opcode === 'motion_turnleft')) {
                        if (target.blocks[block].parent !== null) {
                            turnBlocks++;
                        }
                    }
                }
            }

        }

        //sets requirements appropriately
        if (aphidsEaten > 0) {
            this.requirements.oneAphid.bool = true;
        }
        if (aphidsEaten > 1) {
            this.requirements.bothAphids.bool = true;
        }
    }

}