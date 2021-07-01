/* 
Act 1 Name Poem Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/

require('../grading-scripts-s3/scratch3')


module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_gotoxy', 'motion_glidesecstoxy', 'looks_sayforsecs', 'sound_playuntildone', 'looks_setsizeto', 'looks_show', 'looks_hide', 'control_wait', 'control_repeat'];
    }

    initReqs() {
        // this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        // this.requirements.costumes = { bool: false, str: 'At least half of the sprites have new costumes' };//done
        // this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        // this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have new dialogue using blocks specified' };//done
        // this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        // this.requirements.movement = { bool: false, str: 'At least half of the sprites have new movement using blocks specified' };//to fix
        this.requirements.backdrop = { bool: false, str: 'Add a background' };//done
        this.requirements.newSprite = { bool: false, str: 'Added at least one letter sprite' };//done
        this.requirements.allSpritesSayThink = { bool: false, str: 'Each sprite says or thinks one adjective about me' };//done
        this.requirements.allSpritesThreeActions = { bool: false, str: 'Each sprite performs three different actions' };//done
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

        let sprites = project.targets.filter(t => !t.isStage);

        this.requirements.newSprite.bool = sprites.length > 0;

        function checkSpriteSaysOrThinks(sprite){
            function checkBlocksForTargets(block) { return ['looks_say', 'looks_think'].some(target => block.opcode.includes(target));};
            return sprite.scripts.some(script=> script.blocks[0].opcode.includes('event_') && script.blocks.some(checkBlocksForTargets));
        }

        function checkThreeActions(sprite){
            return sprite.scripts.some(script => script.blocks[0].opcode.includes('event_') && script.blocks.length > 3)
        }
        this.requirements.allSpritesSayThink.bool = sprites.every(checkSpriteSaysOrThinks);
        this.requirements.allSpritesThreeActions.bool = sprites.every(checkThreeActions);

        return;
    }
}







