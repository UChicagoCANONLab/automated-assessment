/// Variables autograder.

/// .sb2 helpers.
var sb2 = {

    /// Returns true if the input is null, undefined, or empty.
    no: function(x) {
        return (x == null || x.length === 0);
    },

    /// Returns an array of the blocks in a script.
    blocks: function(script) {
        if (this.no(script)) return [];
        return script[2];
    },

    /// Returns the opcode of a block.
    opcode: function(block) {
        if (this.no(block)) return "";
        return block[0];
    },

    /// Returns the first block in a script's opcode.
    hatCode: function(script) {
        return this.opcode(this.blocks(script)[0]);
    },

    /// Returns an array containing the subset of a sprite's scripts with a given event.
    eventScripts: function(sprite, myEvent) {
        if (this.no(sprite)) return [];
        return sprite.scripts.filter(script => this.hatCode(script) === myEvent);
    },

    /// Returns an array containing the subset of a scripts's blocks with a given opcode.
    opcodeBlocks: function(script, myOpcode) {
        if (this.no(this.blocks(script))) return [];
        return this.blocks(script).filter(block => this.opcode(block) === myOpcode);
    },

    /// Returns true if a script contains a certain block, and false otherwise.
    scriptContains: function(script, myOpcode) {
        if (this.no(this.blocks(script))) return false;
        return this.blocks(script).some(block => this.opcode(block) === myOpcode);
    }

};

/// Regex builders.
var rx = {
    create: function(string) {
        return new RegExp(string);
    },

    /// Escapes any special characters typed into a string.
    escape: function(string) {
        var exp = /([.*+?^${}()|\[\]\/\\])/g;
        return string.replace(exp, "\\$1");
    },

    compact: function(string) {
        return this.escape(this.unspace(string));
    },

    ///Removes whitespace.
    unspace: function(string) {
        return string.replace(/\s*/g, '');
    },

    wildcard: '\.*'
};

/// Grader
class GradeVariablesL1 {

    constructor() {
        this.requirements   = {};
        this.extensions     = {};
        this.help           = {};
    }

    initReqs() {
        this.requirements.calcPerimeter  = 
            {bool: false, str: 'Computer correctly calculates perimeter.'};
        this.requirements.printPerimeter =
            {bool: false, str: 'Computer outputs calculated perimeter.'};

        this.extensions.calcVolume      =
            {bool: false, str: 'Uses length, width, and height variables to calculate volume and then outputs it.'};

        this.help.noBen       =
            {bool: false, str: 'Make sure the project has a sprite named "Ben."'};
        this.help.noPerimeter =
            {bool: false, str: 'Make sure the project has a variable named "perimeter."'};
    }

    grade(fileObj, user) {
        this.initReqs();      
        var ben = this.findBen(fileObj);
        if (!ben) return;
        if (this.checkPerimeter(fileObj, ben)) return;
        this.checkVolume(fileObj, ben);
    
    }

    findBen(fileObj, ben) {
        var ben = fileObj.children.find(child => child.objName === 'Ben');
        if (ben == null)
            this.help.noBen.bool = true;
        return ben;
    }

    checkPerimeter(fileObj, ben) {
        var validCalc = [
            'perimeter = height + height + width + width',
            'perimeter = height + width + height + width',
            'perimeter = height + width + width + height',
            'perimeter = width + height + height + width',
            'perimeter = width + height + width + height',
            'perimeter = width + width + height + height'
        ];

        var validPrint = rx.create(
            rx.compact('["say:duration:elapsed:from:",') +
            rx.wildcard +
            rx.compact('["readVariable", "perimeter"]') +
            rx.wildcard +
            rx.compact(']')
        );

        if (!fileObj.variables.some(vari => vari.name === "perimeter")) {
            this.help.noPerimeter.bool = true;
            return 1;
        }
        for (var script of ben.scripts) {
            var isPerimeterCalculated = false;
            for (var block of sb2.blocks(script)) {
                if (sb2.opcode(block) === 'setVar:to:') {
                    if (validCalc.includes(this.parseExp(block)))
                        this.requirements.calcPerimeter.bool = true;
                    if (block[1] === 'perimeter')
                        isPerimeterCalculated = true;
                }

                if (sb2.opcode(block) === 'say:duration:elapsed:from:' && isPerimeterCalculated) {
                    var blockString = JSON.stringify(block);
                    if (blockString.match(validPrint))
                        this.requirements.printPerimeter.bool = true;
                }
            }
        }
        return 0;
    }

    checkVolume(fileObj, ben) {
        var validCalc = [
            'volume = height * width * length', 'volume = height * length * width',
            'volume = width * height * length', 'volume = width * length * height',
            'volume = length * height * width', 'volume = length * width * height'
        ];

        var validPrint = rx.create(
            rx.compact('["say:duration:elapsed:from:",') +
            rx.wildcard +
            rx.compact('["readVariable", "volume"]') +
            rx.wildcard +
            rx.compact(']')
        );

        for (var script of ben.scripts) {
            var isVolumeCalculated = false;
            for (var block of sb2.blocks(script)) {
                if (sb2.opcode(block) === 'setVar:to:') {
                    console.log(this.parseVol(block));
                    if (validCalc.includes(this.parseVol(block)))
                        isVolumeCalculated = true;
                }
                
                if (sb2.opcode(block) === 'say:duration:elapsed:from:' && isVolumeCalculated) {
                    var blockString = JSON.stringify(block);
                    if (blockString.match(validPrint))
                        this.extensions.calcVolume.bool = true;
                }
            }
        }
        return 0;
    }

    parseExp(block) {

        if (sb2.no(block)) return '';

        else if (typeof(block) === 'number') {
            return block.toString();
        }

        else if (block[0] === 'setVar:to:') {
            return block[1] + ' = ' + this.parseExp(block[2]);
        }

        else if (block[0] === 'readVariable') {
            return block[1];
        }

        else if (block[0] === '+') {
            return this.parseExp(block[1]) + ' + ' + this.parseExp(block[2]);
        }

        else if (block[0] === '*') {
            var acc = '';
            for (var i = 0; i < this.parseExp(block[1]); i++) {
                acc += this.parseExp(block[2]);
                if (i < this.parseExp(block[1]) - 1) acc += ' + ';
            }
            return acc;
        }
        
        else return 'invalid symbol';

    }

    parseVol(block) {

        if (sb2.no(block)) return '';

        else if (typeof(block) === 'number') {
            return block.toString();
        }

        else if (block[0] === 'setVar:to:') {
            return block[1] + ' = ' + this.parseVol(block[2]);
        }

        else if (block[0] === 'readVariable') {
            return block[1];
        }

        else if (block[0] === '*') {
            return this.parseVol(block[1]) + ' * ' + this.parseVol(block[2]);
        }
        
        else return 'invalid symbol';

    }
}