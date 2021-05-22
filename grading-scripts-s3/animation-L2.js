/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/

require('./scratch3');

const loops = ['control_forever', 'control_repeat', 'control_repeat_until'];

module.exports = class {
    // initializes the requirement objects and a list of event block codes
    // which will be used below
    init() {
        this.requirements = {
            HaveBackdrop: {bool: false, str: "Background has an image."},
            atLeastThreeSprites: {bool: false, str: "There are at least 3 sprites."},
            animatedInPlace1: {bool: false, str: "A sprite is animated in place."},
            animatedInPlace2: {bool: false, str: "A second sprite is animated in place."},
            animatedInMotion: {bool: false, str: "A different sprite is animated while moving."}
        }
        this.extensions = {
            moreAnimations: {bool: false, str: "Additional sprites are animated in place or while moving."},
            moreThanOneAnimation: {bool: false, str: "Student experiments with at least two types of animation."}
        }
        // project-wide variables
        this.animationTypes = [];
    }

    // the main grading function
    grade(json,user) {

        if (!is(json)) 
            return; 

        let project = new Project(json);
        // initializing requirements and extensions
        this.init();
        let sprites = 0
        let spritesAnimatedInPlace = 0;
        let spritesAnimatedInMotion = 0;

        // initializes sprite class for each sprite and adds scripts
        for (let target of project.targets) {
            if (target.isStage){ 
                let len = target.costumes.length
                this.requirements.HaveBackdrop.bool = len > 1 || (len && target.costumes[0] !== 'backdrop1');
            } else {
                let report = this.gradeSprite(target);
                sprites ++;
                if(report.isAnimated) {
                    if(report.isMoving) {
                        spritesAnimatedInMotion += 1;
                    } else {
                        spritesAnimatedInPlace += 1
                    }
                }
            }
        }

        this.requirements.animatedInMotion.bool = spritesAnimatedInMotion >= 1
        this.requirements.animatedInPlace1.bool = spritesAnimatedInPlace >= 1;
        this.requirements.animatedInPlace2.bool = spritesAnimatedInPlace >= 2;
        this.requirements.atLeastThreeSprites.bool = sprites >= 3;

        this.extensions.moreAnimations.bool = spritesAnimatedInMotion > 1 || spritesAnimatedInPlace > 2;

        //counts the number of animation (motion) blocks used
        this.extensions.moreThanOneAnimation.bool = (this.animationTypes.length >= 1)
    }
    // make animation more strict
    // helper function for grading an individual sprite
    gradeSprite(sprite) {

        let isAnimated = false;
        let isMoving = false;


        let loopTracker = {};
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
            script.traverseBlocks((block, level) => {
                if (loops.includes(block.opcode)) {
                    loopTracker[block.id] = {}
                } else if (level > 1) {
                    let loopID = block.isWithin(b => loops.includes(b.opcode)).id;
                    loopTracker[loopID].costume = loopTracker[loopID].costume || block.opcode.includes('costume');
                    loopTracker[loopID].wait = loopTracker[loopID].wait || (block.opcode === 'control_wait');
                    loopTracker[loopID].move = loopTracker[loopID].move || block.opcode.includes('motion_');
                    if (block.opcode.includes("motion_")) {
                        if (!this.animationTypes.includes(block.pcode)) this.animationTypes.push(block.opcode);
                    } 
                }
            }, loops);
        }

        isAnimated = Object.values(loopTracker).some(l => l.wait && (l.costume || l.move));
        isMoving =  Object.values(loopTracker).some(l => l.move);

        return {
            name: sprite.name,
            isAnimated,
            isMoving
        };
    }
}