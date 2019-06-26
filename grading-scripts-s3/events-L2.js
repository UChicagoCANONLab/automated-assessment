/* Events L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and bug fixes: Marco Anaya, Summer 2019
*/
require('./scratch3');
// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

module.exports = class {
    init() {
        this.requirements = {
            hasBackdrop: {bool: false, str: "Background has an image."},
            hasThreeSprites: {bool: false, str: "There are at least three sprites."},
            spriteHasTwoEvents1: {bool: false, str: "A sprite has at least two events."},
            spriteHasTwoEvents2: {bool: false, str: "A second sprite has at least two events."},
            spriteHasTwoEvents3: {bool: false, str: "A third sprite has at least two events."},
            spriteHasTwoScripts1: {bool: false, str: "A sprite events have actions."},
            spriteHasTwoScripts2: {bool: false, str: "A second sprite events have actions."},
            spriteHasTwoScripts3: {bool: false, str: "A third sprite events have actions."}
        };
        this.extensions = {
            spriteSpins: {bool: false, str: "A sprite spins (uses turn block)"},
            moreScripts: {bool: false, str: "A sprite reacts to more events."},
            spriteBlinks: {bool: false, str: "A sprite blinks (use hide, show, and wait blocks)."}
        };
    }
    
    gradeSprite(sprite) {
        var events = [];
        var validScripts = 0;
        
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))){

            //look for extension requirements throughout each block
            var blink = {hide: false, wait: false, show: false};
            var spin = {wait: false, turn: false};
            iterateBlocks(script, (block, level) => {
                var opcode = block.opcode;
                spin.turn = spin.turn || opcode.includes("motion_turn");
                blink.hide = blink.hide || (opcode == 'looks_hide');
                blink.show = blink.show || (opcode == 'looks_show');
                if (opcode == 'control_wait') {
                    spin.wait = true;
                    blink.wait = true;
                }
            });
            // check if all all conditions in a script have been met for spinning or blinking
            if (Object.values(spin).reduce((acc, val) => acc && val, true)) this.extensions.spriteSpins.bool = true;
            if (Object.values(blink).reduce((acc, val) => acc && val, true)) this.extensions.spriteBlinks.bool = true;

            var event = script.blocks[0];
            if (event.opcode == "event_whenkeypressed") 
                event.opcode = event.opcode + event.fields.KEY_OPTION[0];
                
            if (!events.includes(event.opcode)) {
                events.push(event.opcode);
                if (script.blocks.length > 1) 
                    validScripts++;
            } 
        } 
        // check off how many sprites have met the requirements
        if (events.length < 2 && validScripts < 2) return;
        for (var n of ['1', '2', '3']) {
            if (this.requirements['spriteHasTwoEvents' + n].bool && this.requirements['spriteHasTwoScripts' + n].bool) 
                continue;
            this.requirements['spriteHasTwoEvents' + n].bool = (events.length >= 2);
            this.requirements['spriteHasTwoScripts' + n].bool = (validScripts >= 2);
            break;
        }
        this.extensions.moreScripts.bool = (validScripts > 2);
    }

    grade(fileObj,user) {
        if (no(fileObj)) return; //make sure script exists
        this.init();        
        var project = new Project(fileObj);
        for(var target of project.targets){
            if(target.isStage ){
                if (target.costumes.length)
                    this.requirements.hasBackdrop.bool = true;
                continue;
            }
            this.gradeSprite(target);
        }
        //check for enough sprites
        this.requirements.hasThreeSprites.bool = (project.targets.length - 1 >= 3);
    }
} 