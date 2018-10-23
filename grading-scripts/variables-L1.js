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

/// Grader —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
class GradeVariablesL1 {

    constructor() {
        this.requirements   = {};
        this.extensions     = {};
        this.help           = {};
    }

    initReqs() {
        this.requirements.calcPerimeter  = 
            {bool: false, str: 'Computer calculates perimeter.'};
        this.requirements.printPerimeter =
            {bool: false, str: 'Computer outputs calculated perimeter.'};

        this.extensions.calcVolume      =
            {bool: false, str: 'Uses height variable to calculate volume.'};

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
            /// Paired adds
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "height"]], ["+", ["readVariable", "width"], ["readVariable", "width"]]]]')),            
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "width"]], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "width"]], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "height"]], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "height"]], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "width"]], ["+", ["readVariable", "height"], ["readVariable", "height"]]]]')),
            /// Adds & mults
            rx.create(rx.compact('["setVar:to:", "perimeter", ["*", 2, ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["*", 2, ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["*", 2, ["readVariable", "height"]], ["*", 2, ["readVariable", "width"]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["*", 2, ["readVariable", "width"]], ["*", 2, ["readVariable", "height"]]]]')),
            /// Sequential adds
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["readVariable", "width"]]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]]')),
            rx.create(rx.compact('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["readVariable", "height"]]]]]'))
        ];

        var validPrint = [
            rx.create(
                rx.compact('["say:duration:elapsed:from:",') +
                rx.wildcard +
                rx.compact('["readVariable", "perimeter"]') +
                rx.wildcard +
                rx.compact(']')
            )
        ];

        if (!fileObj.variables.some(vari => vari.name === "perimeter")) {
            this.help.noPerimeter.bool = true;
            return 1;
        }
        for (var script of ben.scripts) {
            for (var block of sb2.opcodeBlocks(script, 'setVar:to:')) {
                var blockString = JSON.stringify(block);
                for (var x of validCalc) {
                    if (rx.unspace(blockString).match(x)) this.requirements.calcPerimeter.bool = true;
                }
            }
            for (var block of sb2.opcodeBlocks(script, 'say:duration:elapsed:from:')) {
                var blockString = JSON.stringify(block);
                for (var x of validPrint) {
                    if (rx.unspace(blockString).match(x)) this.requirements.printPerimeter.bool = true;
                }
            }
        }
        return 0;
    }

    checkVolume(fileObj, ben) {
        var validCalc = [
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "height"], ["readVariable", "width"]], ["readVariable", "length"]]]')),
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "height"], ["readVariable", "length"]], ["readVariable", "width"]]]')),
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "width"], ["readVariable", "height"]], ["readVariable", "length"]]]')),
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "width"], ["readVariable", "length"]], ["readVariable", "height"]]]')),
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "length"], ["readVariable", "width"]], ["readVariable", "height"]]]')),
            rx.create(rx.compact('["setVar:to:", "volume", ["*", ["*", ["readVariable", "length"], ["readVariable", "height"]], ["readVariable", "width"]]]'))
        ];

        var validPrint = [
            rx.create(
                rx.compact('["say:duration:elapsed:from:",') +
                rx.wildcard +
                rx.compact('["readVariable", "volume"]') +
                rx.wildcard +
                rx.compact(']')
            )
        ];

        var calc = false;
        var say  = false;
        for (var script of ben.scripts) {
            for (var block of sb2.opcodeBlocks(script, 'setVar:to:')) {
                var blockString = JSON.stringify(block);
                for (var x of validCalc) {
                    if (rx.unspace(blockString).match(x)) calc = true;
                }
            }
            for (var block of sb2.opcodeBlocks(script, 'say:duration:elapsed:from:')) {
                var blockString = JSON.stringify(block);
                for (var x of validPrint) {
                    if (rx.unspace(blockString).match(x)) say = true;
                }
            }
        }
        this.extensions.calcVolume.bool = (calc && say);
        return;
    }
}