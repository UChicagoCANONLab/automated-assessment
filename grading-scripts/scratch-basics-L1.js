/// Scratch Basics autograder.

var sb2 = {
    no: function(x) {
        return (x == null || x.length === 0);
    },
    blocks: function(script) {
        if (this.no(script)) return [];
        return script[2];
    },
    opcode: function(block) {
        if (this.no(block)) return "";
        return block[0];
    },
    eventScripts: function(sprite, myEvent) {
        if (this.no(sprite)) return [];
        return sprite.scripts.filter(script => this.hatCode(script) === myEvent);
    },
    opcodeBlocks: function(script, myOpcode) {
        if (this.no(this.blocks(script))) return [];
        return this.blocks(script).filter(block => this.opcode(block) === myOpcode);
    },
};

class GradeScratchBasicsL1 {

    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    grade(fileObj, user) { 
        this.initMetrics();
        var fred  = this.findSprite(fileObj, 'Fred');
        var helen = this.findSprite(fileObj, 'Helen');
        this.checkFred(fred);
        this.checkHelen(helen);
        this.checkExtensions(fileObj);
    }

    initMetrics() {
        this.requirements = {
            changedSteps: {
                bool: false, str: 'Fred takes 100 steps each time he talks instead of 50.'
            },
            fredTalks: {
                bool: false, str: 'Fred says "Have fun!" to the user.'
            },
            timeChanged: {
                bool: false, str: 'Changed time between Helen\'s costume changes.'
            }
        };
        this.extensions = {
            newSprite: {
                bool: false, str: 'Added a new sprite.'
            },
            newBlocks: {
                bool: false, str: 'Added new types of blocks to the project.'
            }
        };   
    }

    findSprite(fileObj, name) {
        return fileObj.children.find(child => child.objName === name);
    }

    checkFred(fred) {
        if (!fred) return;
        var stepArr = [];
        for (var script of sb2.eventScripts(fred, 'whenGreenFlag')) {
            for (var block of sb2.opcodeBlocks(script, 'forward:')) {
                stepArr.push(block[1]);
            }
            for (var block of sb2.opcodeBlocks(script, 'say:duration:elapsed:from:')) {
                if (block[1] === 'Have fun!')
                    this.requirements.fredTalks.bool = true;
            }
        }
        if (sb2.no(stepArr)) return;
        this.requirements.changedSteps.bool = stepArr.every(steps => steps === 100);
    }

    checkHelen(helen) {
        if (!helen) return;
        for (var script of sb2.eventScripts(helen, 'whenKeyPressed')) {
            for (var cBlock of sb2.opcodeBlocks(script, 'doRepeat')) {
                for (var block of cBlock[2]) {
                    if (opcode(block) === 'wait:elapsed:from:' && block[1] !== 1)
                        this.requirements.timeChanged.bool = true;
                }
            }
        }
    }

    checkExtensions(fileObj) {
        if (fileObj.info.spriteCount > 2) this.extensions.newSprite.bool = true;
        var defaultOpcodes = [
            'whenGreenFlag',
            'gotoX:y:',
            'forward:',
            'say:duration:elapsed:from:',
            'whenKeyPressed',
            'lookLike:',
            'doRepeat',
            'whenClicked'
        ];
        var defaultNames = [
            'Fred',
            'Helen'
        ];
        for (var sprite of fileObj.children) {
            if (sprite.hasOwnProperty('objName')) {
                if (!defaultNames.includes(sprite.objName))
                    this.extensions.newSprite.bool = true;
                for (var script of sprite.scripts) {
                    for (var block of sb2.blocks(script)) {
                        if (!defaultOpcodes.includes(sb2.opcode(block)))
                            this.extensions.newBlocks.bool = true;
                    }
                }
            }
        }
    }
}