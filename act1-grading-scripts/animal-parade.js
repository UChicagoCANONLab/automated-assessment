/*
Act 1 Animal Parade Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3');

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.twoSprites = {bool: false, str: 'Two sprites move across the screen using a loop'};
        this.requirements.threeSprites = {bool: false, str: 'Three sprites move across the screen using a loop'};
        this.requirements.fourSprites = {bool: false, str: 'Four sprites move accross the screen using a loop'};
        this.requirements.sound = {bool: false, str: 'Two sprites make a sound as they move'};
        this.extensions.newSprite = {bool: false, str: 'Add a new sprite (with more than one costume) and have it move across the screen using a loop'};
        this.extensions.changeY = {bool: false, str: 'Have a sprite move up and down the screen'}
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        function procSprite(sprite){
            var out = { movesInLoop : false,
                        soundInLoop : false,
                        changesY: false};
            var validLoops = [].concat.apply([], sprite.scripts.filter(s=> s.blocks[0].opcode.includes("event_")).map(s=>s.blocks.filter(block=> block.opcode.includes("control_forever") || block.opcode.includes("control_repeat"))));
            out.movesInLoop = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("motion_change") || block.opcode.includes("motion_move"))));
            out.soundInLoop = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("sound_play"))));
            out.changesY = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("motion_changeyby"))));
            return out
        }
        var results = project.targets.map(procSprite)
        var numMovingSprites = results.filter(r=>r.movesInLoop).length
        this.requirements.twoSprites.bool = numMovingSprites > 1;
        this.requirements.threeSprites.bool = numMovingSprites > 2;
        this.requirements.fourSprites.bool = numMovingSprites > 3;

        this.requirements.sound.bool = results.filter(r=>r.soundInLoop).length > 1;

        this.extensions.changeY.bool = results.filter(r=> r.changesY).length > 0;
        this.extensions.newSprite.bool = numMovingSprites > 4;


        //runs helper methods
    }
}