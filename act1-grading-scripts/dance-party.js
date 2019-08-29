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
        this.requirements.backdrop = { bool: false, str: 'Project has a new backdrop' };
        this.requirements.twoSprites = { bool: false, str: 'Project has two sprites' };
        this.requirements.goToXY = { bool: false, str: 'Both sprites have a "go to xy" block to start them in the same place each time the green flag is clicked' };
        this.requirements.repeat = { bool: false, str: 'There is a repeat loop using one of the four specified blocks' };
        this.requirements.scripts = { bool: false, str: 'Both sprites have at least one script starting with "when green flag clicked" and one starting with a different event block (which must not be the same as the other sprite)' };
        this.extensions.loop = { bool: false, str: '"Sound" or "look" block used inside a loop' };
        this.extensions.sizeOrDirection = { bool: false, str: 'The sprite moves and changes size or direction in the same script' };
        this.eventArr = [];
    }

    checkBackdrop(target) {
        if ((target.costumes.length > 1) ||
            (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
            this.requirements.backdrop.bool = true;
        }
    }

    checkXY(target){
        for (let script of target.scripts){
            if (script.blocks[0].opcode === 'event_whenflagclicked'){
                for (let block of script.blocks){
                    if (block.opcode === 'motion_gotoxy'){
                        this.requirements.goToXY.bool = true;
                    }
                }
            }
        }
    }

    checkLoop(target){
        for (let script of target.scripts){
            if (script.blocks[0].opcode.includes('event_')){
                for (let block of script.blocks){
                    if (block.opcode === 'control_repeat'){
                        for (let i = block.inputs.SUBSTACK[1]; i != null; i = target.blocks[i].next) {
                            let opc = target.blocks[i].opcode;
                            if (opc === 'motion_glidesecstoxy'
                                || opc === 'motion_movesteps'
                                || opc === 'looks_nextcostume'
                                || opc === 'control_wait'){
                                    this.requirements.repeat.bool = true;
                            }
                            else if (opc.includes('sound_')||opc.includes('looks_')){
                                this.extensions.loop.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkScripts(target){
        let greenFlag = false;
        let otherEvent = false;
        let move = false;
        let dirOrSize = false;
        for (let script of target.scripts){
            let opc1 = script.blocks[0].opcode;
            if (opc1.includes('event_')){
                if (opc1==='event_whenflagclicked'){greenFlag=true;}
                else {
                    if (!this.eventArr.includes(opc1)){
                        this.eventArr.push(opc1);
                        otherEvent = true;
                    }
                }
                for (let block of script.blocks){
                    let blopcode = block.opcode;
                    console.log(blopcode);
                    if (blopcode.includes('motion_')&&!(blopcode.includes('turn')||blopcode.includes('direction'))){
                        move = true;
                    } else if (blopcode.includes('size')
                        || blopcode.includes('turn')
                        || blopcode.includes('direction')) {
                            dirOrSize = true;
                        }
                }
            }
        }
        if (move && dirOrSize) {this.extensions.sizeOrDirection.bool=true;}
        return (greenFlag && otherEvent);
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let spriteNumber = 0;
        let scriptedSprites = 0;
        let eventArr = [];

        for (let target of project.targets) {
            if (target.isStage) {
                this.checkBackdrop(target);
            } else {
                spriteNumber++;
                this.checkXY(target);
                this.checkLoop(target);
                if (this.checkScripts(target)) {scriptedSprites++};
            }
        }

        if (spriteNumber >= 2){this.requirements.twoSprites.bool=true;}
        if (scriptedSprites >= 2) {this.requirements.scripts.bool=true;}
    }
}