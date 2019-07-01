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
        this.requirements.moveStepsBlock = { bool: false, str: 'A "move 50 steps" block is added' }
        this.requirements.turnBlock = { bool: false, str: 'A "turn 90 degrees" block is added' };
        this.requirements.ladybugInBounds = { bool: true, str: 'The ladybug stays on the branch' };
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
            bugLocX = block.inputs.X[1][1];
            bugLocY = block.inputs.Y[1][1];
        }
        if (block.opcode === 'motion_pointindirection') {
            bugDir = block.inputs.DIRECTION[1][1];
        }
        if (block.opcode === 'motion_turnright') {
            bugDir += block.inputs.DEGREES[1][1];
        }
        if (block.opcode === 'motion_turnleft') {
            bugDir -= block.inputs.DEGREES[1][1];
        }
        if (block.opcode === 'motion_movesteps') {
            let radDir = bugDir * Math.PI / 180;
            let steps = block.inputs.STEPS[1][1];
            bugLocX += steps * Math.cos(radDir);
            bugLocY += steps * Math.sin(radDir);
        }
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let moveStepsBlocks = 0;
        let turnBlocks = 0;

        let aphidLocations = [];
        let bugLocX = 0;
        let bugLocY = 0;
        let bugDir = 0;

        for (let target of project.targets) {
            if (target.name === 'Ladybug1') {
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        for (let i=target.blocks[block]; target.blocks[i].next !== null; i = target.blocks[i].next) {//fix this linked list for loop!
                            this.updateBug(i);
                        }
                    }



                    //check if out of bounds or onAphid
                    let onBranch = this.inBounds(bugLocX, bugLocY);
                    console.log(onBranch);
                    if (!onBranch) {
                        this.requirements.ladybugInBounds.bool = false;
                    }
                    let bugLocArr = [bugLocX, bugLocY];
                    let onAphid = aphidLocations.includes(bugLocArr);

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
            } else if ((target.name === 'Aphid') || (target.name === 'Aphid2')) {
                let loc = [];
                loc.push(target.x);
                loc.push(target.y);
                aphidLocations.push(loc);
            }
        }

        if (moveStepsBlocks > 2) {
            this.requirements.moveStepsBlock.bool = true;
        }
        if (turnBlocks > 1) {
            this.requirements.turnBlock.bool = true;
        }

    }

}