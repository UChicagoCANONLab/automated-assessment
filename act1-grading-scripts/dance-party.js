/*
Act 1 Dance Party Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3');

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        // this.requirements.costumes = { bool: false, str: 'At least half of the sprites have new costumes' };//done
        // this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        // this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have new dialogue using blocks specified' };//done
        // this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        // this.requirements.movement = { bool: false, str: 'At least half of the sprites have new movement using blocks specified' };//to fix
        this.requirements.backdrop = { bool: false, str: 'Add a background' };//done
        this.requirements.twoSprites = {bool: false, str: 'Added at least two sprites'}
        this.requirements.twoScriptsEach = {bool: false, str: 'Each sprite has at least two scripts and a "Go to XY" block'}
        this.requirements.repeat = {bool: false, str: 'At least one sprite has a repeat block'}
        this.requirements.twoInteractiveBlocks = {bool: false, str: 'Each sprite has at least two looks, sound, or motion blocks'}
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        console.log(project.targets)
        let stage = project.targets.find(t => t.isStage);
        // Count the number of backdrops that are not the default white
        let uniqueBackDrops = stage.costumes.filter(c => c.assetId != 'cd21514d0531fdffb22204e0ec5ed84a').length;

        this.requirements.backdrop.bool = uniqueBackDrops > 0;
        let sprites = project.targets.filter(t=> !t.isStage);
        this.requirements.twoSprites.bool = sprites.length >= 2;
        function procSprite(sprite){
            var out = {nEvents:0, goToBlock:false, repeatBlock: false, nInteractive: 0}
            out.nEvents = new Set(sprite.scripts.map(s=>s.blocks[0].opcode + JSON.stringify(s.blocks[0].fields)).filter(oc=> oc.includes("event_when"))).size;
            out.goToBlock = sprite.scripts.filter(s=>s.blocks[0].opcode.includes("event_")).some(s=>s.blocks.some(block=>block.opcode==="motion_gotoxy"))
            out.repeat = sprite.scripts.filter(s=>s.blocks[0].opcode.includes("event_")).some(s=>s.blocks.some(block=>block.opcode.includes("control_repeat") || block.opcode.includes("control_forever")))
            out.nInteractive = Object.values(sprite.blocks).filter(b=>!b.topLevel && (b.opcode.includes("looks_") || b.opcode.includes("sound_") || b.opcode.includes("motion_"))).length;
            return out;
        }
        var results = sprites.map(procSprite);
        console.log(results)
        this.requirements.twoScriptsEach.bool = results.every(r=>r.nEvents >= 2 && r.goToBlock);
        this.requirements.repeat.bool = results.some(r=>r.repeat);
        this.requirements.twoInteractiveBlocks.bool = results.every(r=>r.nInteractive >= 2);
   

        return;
    }
}