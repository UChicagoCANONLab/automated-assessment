/* Events L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and bug fixes: Marco Anaya, Summer 2019
*/
require('./scratch3');

const holidays = {
    christmas: ['christmas', 'chrismas', 'xmas', 'santa', 'x-mas', 'december 2'],
    halloween: ['halloween', 'scary', 'trick or treat', 'hollween', 'costumeb'],
    birthday: ['birthday', 'b-day', 'brithday', 'birth day'],
    july: ['july'],
    thanksgiving: ['thanksgiving'],
    ['chinese new years']: ['chinese new'],
    ['new years']: ['new year'],
    valentines: ['valentine'],
    easter: ['easter'],
    ['national _ day']: ['national'],
    other: ['day']
}
const family = ['mom', 'dad', 'father', 'mother', 'sister', 'brother', 'uncle', 'aunt','grandpa', 'grandma', 'cousin', 'famil', 'sibling', 'child'];

module.exports = class {
    init() {
        this.requirements = {
            choseBackdrop: {bool: false, str: "The backdrop of the project was changed"},
            hasThreeSprites: {bool: false, str: "There are at least three sprites"},
            spriteHasTwoEvents1: {bool: false, str: "A sprite has two required events"},
            spriteHasTwoEvents2: {bool: false, str: "A second sprite has two required events"},
            spriteHasTwoEvents3: {bool: false, str: "A third sprite has two required events"},
            spriteHasTwoScripts1: {bool: false, str: "A sprite has two scripts with unique events"},
            spriteHasTwoScripts2: {bool: false, str: "A second sprite has two scripts with unique events"},
            spriteHasTwoScripts3: {bool: false, str: "A third sprite has two scripts with unique events"},
            usesTheThreeEvents: {bool: false, str: "Uses all event blocks from lesson plan"}
        };
        this.extensions = {
            spriteSpins: {bool: false, str: "A sprite spins (uses turn block)"},
            moreScripts: {bool: false, str: "A sprite reacts to more events."},
            spriteBlinks: {bool: false, str: "A sprite blinks (use hide, show, and wait blocks)."}
        };

        this.info = {
            blocks: 0,
            sprites: 0,
            spritesWith1Script: 0,
            spritesWith2Scripts: 0,
            holiday: null,
            guidingUser: false,
            family: false,
            blockTypes: new Set([]),
            strings: [],
            score: 0
        }
    }
    
    gradeSprite(sprite) {
        var reqEvents = [];
        var events = [];
        var validScripts = 0;    

        this.info.sprites++;
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))){
            
            //look for extension requirements throughout each block
            var blink = {hide: false, wait: false, show: false};
            var spin = {wait: false, turn: false};
            script.traverseBlocks((block, level) => {
                var opcode = block.opcode;
                if (opcode in this.info.blockTypes) {
                    
                } else {
                    this.info.blockTypes.add(opcode);
                    this.info.blocks++;
                }
                if (opcode.includes('say')) {
                    let string = block.inputs.MESSAGE[1][1].toLowerCase();


                    this.info.strings.push(string);

                    if (!this.info.holiday || this.info.holiday == 'other') {
                        for (let [holiday, keywords] of Object.entries(holidays)) {
                            
                            if (keywords.some(k => string.includes(k))) {
                                this.info.holiday = holiday;
                                if (holiday != 'other')
                                    break;
                            }
                        }
                    }
                    if (!this.info.guidingUser) {
                        for (let keyword of ['press', 'click']) {
                            if (string.includes(keyword)) {
                                this.info.guidingUser = true;
                                break;
                            }
                        }
                    }
                    if (!this.info.family) {
                        for (let keyword of family) {
                            if (string.includes(keyword)) {
                                this.info.family = true;
                                break
                            }
                        }
                    }
                }
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
            //records the use of required events
            if (['event_whenflagclicked', 'event_whenthisspriteclicked', 'event_whenkeypressed'].includes(event.opcode) && !reqEvents.includes(event.opcode))
                reqEvents.push(event.opcode);
            // differentiates event key presses that use different keys
            if (event.opcode == "event_whenkeypressed") 
                event.opcode += event.fields.KEY_OPTION[0];
            // adds to list of unique events and scripts
            if (!events.includes(event.opcode)) {
                events.push(event.opcode);
                if (script.blocks.length > 1) 
                    validScripts++;
            }
            // checks if scripts outside of the required were used (only the first key pressed event is counted as required)
            if (!(['event_whenflagclicked', 'event_whenthisspriteclicked'].includes(event.opcode) || event.opcode.includes('event_whenkeypressed')) ||
                    (event.opcode.includes('event_whenkeypressed') && !events.includes(event.opcode))) {
                this.extensions.moreScripts.bool = true;
            }
        } 

        // check off how many sprites have met the requirements
        if (reqEvents.length >= 2 || validScripts >= 2) {
            for (var n of [1, 2, 3]) {
                if (this.requirements['spriteHasTwoEvents' + n].bool && this.requirements['spriteHasTwoScripts' + n].bool) 
                    continue;
                if (n !== 3) {
                    this.requirements['spriteHasTwoEvents' + (n + 1)].bool = this.requirements['spriteHasTwoEvents' + n].bool;
                    this.requirements['spriteHasTwoScripts' + (n + 1)].bool = this.requirements['spriteHasTwoScripts' + n].bool;
                }
                this.requirements['spriteHasTwoEvents' + n].bool = (reqEvents.length >= 2);
                this.requirements['spriteHasTwoScripts' + n].bool = (validScripts >= 2);
                break;
            }
        }
        if (validScripts >=2) this.info.spritesWith2Scripts++
        else if (validScripts >= 1) this.info.spritesWith1Script++;
        return reqEvents;
    }

    grade(fileObj,user) {
        if (no(fileObj)) return; //make sure script exists
        this.init();        
        var project = new Project(fileObj);
        var reqEvents = [];
        for(var target of project.targets){
            if(target.isStage ){
                if (target.costumes.length > 1 || target.costumes[0].name !== 'backdrop1') 
                    this.requirements.choseBackdrop.bool = true;
                continue;
            }

            // calls the sprite grader while aggregating the total required events used
            reqEvents = [...new Set([...reqEvents, ...this.gradeSprite(target)])];
        }
        this.requirements.usesTheThreeEvents.bool = (reqEvents.length === 3);
        this.requirements.hasThreeSprites.bool = (project.targets.length - 1 >= 3);
        
        delete this.info.strings;
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool? 1 : 0), 0);
        
    }
} 