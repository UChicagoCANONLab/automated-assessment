/*
Act 1 Ladybug Scramble Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/


require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.bug = {dir: 0, locX: -200, locY: -25}
    }

    initReqs() {
        this.requirements.oneAphid = { bool: false, str: 'Ladybug eats at least one aphid using only blocks specified' };
        this.requirements.bothAphids = { bool: false, str: 'Ladybug eats both aphids using only blocks specified' };
        this.requirements.eatAphidBlock = { bool: false, str: '"Eat Aphid" block is used' };
        this.requirements.ladybugInBounds = { bool: true, str: 'The ladybug stays on the branch' };
        this.requirements.changedProject = {bool: false, str: 'Project has been modified from the original project'};
        this.extensions.music = {bool: false, str: 'Background music added'};
        this.extensions.aphidsMoving = {bool: false, str: 'Aphids move'};
        this.extensions.ladybugRedrawn = {bool: false, str: 'The ladybug has been redrawn in the costumes tab'};
    }
    
    //helper functions
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

    updateBug(block) {

        if (block.opcode === 'motion_gotoxy') {
            this.bug.locX = parseFloat(block.inputs.X[1][1]);
            this.bug.locY = parseFloat(block.inputs.Y[1][1]);
        }
        if (block.opcode === 'motion_pointindirection') {
            this.bug.dir = parseFloat(block.inputs.DIRECTION[1][1]);
        }
        if (block.opcode === 'motion_turnright') {
            this.bug.dir -= parseFloat(block.inputs.DEGREES[1][1]);
        }
        if (block.opcode === 'motion_turnleft') {
            this.bug.dir += parseFloat(block.inputs.DEGREES[1][1]);
        }
        if (block.opcode === 'motion_movesteps') {
            let radDir = (this.bug.dir - 90) * Math.PI / 180;
            let steps = parseFloat(block.inputs.STEPS[1][1]);
            this.bug.locX += Math.round(steps * Math.cos(radDir));
            this.bug.locY += Math.round(steps * Math.sin(radDir));
        }
    }

    isLadybug(target)
    {
        for (let block in target.blocks)
        {
            if (target.blocks[block].opcode === 'procedures_call'){
                if (target.blocks[block].mutation.proccode === 'Eat Aphid'){
                    return true;
                }
            }
        }
        return false;
    }

    grade(fileObj, user) {
        
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalLadybug-test'), null);
        
        this.initReqs();
        if (!is(fileObj)) return;

        var projList = new Array();
        var originalList = new Array();

        // creates a list of the opcodes attached to event when flag clicked from the original project

        // if there is an eat aphid block in the script that means that it is as ladybug
        // set is ladybug boolean to true
        for (let origTarget of original.targets) {
//            var isLadybugBool = this.isLadybug(origTarget);
            if (origTarget.name === 'Ladybug1'  || this.isLadybug(origTarget)) {
                for (let block in origTarget.blocks) {
                    if (origTarget.blocks[block].opcode === 'event_whenflagclicked') {
                        for (let i = block; origTarget.blocks[i].next !== null; i = origTarget.blocks[i].next) {
                            originalList.push(origTarget.blocks[i].opcode);
                        }
                    }
                }
            }
        }
        
        let moveStepsBlocks = 0;
        let turnBlocks = 0;

        let aphidLocations = [];
        let aphidsEaten = 0;
        let failed = false;

        for (let target of project.targets){
            if ((target.name === 'Aphid') || (target.name === 'Aphid2') || !(this.isLadybug(target))) {
                let loc = [];
                loc.push(target.x);
                loc.push(target.y);
                aphidLocations.push(loc);

                for (let block in target.blocks){
                    if (target.blocks[block].opcode.includes('motion_')){
                        this.extensions.aphidsMoving.bool = true;
                        break;
                    }
                }
            }
        }

        for (let target of project.targets) {

            for (let block in target.blocks){
                if ((target.blocks[block].opcode === 'sound_playuntildone')
                ||(target.blocks[block].opcode === 'sound_play')){
                    this.extensions.music.bool = true;
                    break;
                }
            }

            if (target.name === 'Ladybug1' || this.isLadybug(target)) {
                for (let cost in target.costumes){
                    if ((target.costumes[cost].assetId !== 'fb24a06d820171b65efe8e07d2fe4121')
                    && (target.costumes[cost].assetId !== '7a27483bfa7eee92804b16c8e8ba419a')){
                        this.extensions.ladybugRedrawn.bool = true;
                        break;
                    }
                }

                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        for (let i=block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                           
                            projList.push(target.blocks[i].opcode);

                            this.updateBug(target.blocks[i]);
                        
                            let onBranch = this.inBounds(this.bug.locX, this.bug.locY);
                       
                            if (!onBranch) {
                                this.requirements.ladybugInBounds.bool = false;
                                failed = true;
                            }
    
                            let onAphid = false;
                            for (let aphidLoc of aphidLocations){
                                if ((Math.abs(aphidLoc[0]-this.bug.locX)<=40) &&
                                    (Math.abs(aphidLoc[1]-this.bug.locY)<=40)){
                                        onAphid = true;
                                    }
                            }

                            if (onAphid){
                                let nextBlock = target.blocks[i].next;
                                if (target.blocks[nextBlock].opcode === 'procedures_call'){
                                    if (target.blocks[nextBlock].mutation.proccode === 'Eat Aphid'){
                                        if (failed === false){
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
                break;
            }
        }

        // checks to see if original project has been modified
        if (projList.length !== originalList.length) {
            this.requirements.changedProject.bool = true;
        } else {
            for (let i = projList.length; i --;) {
                if (projList[i] !== originalList[i])
                {
                    this.requirements.changedProject.bool = true;
                }
            }
        }

        if (aphidsEaten > 0){
            this.requirements.oneAphid.bool = true;
        }
        if (aphidsEaten > 1){
            this.requirements.bothAphids.bool = true;
        }
    }

}