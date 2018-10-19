/// Variables autograder.

const rx  = require('./regex.js');
const sb2 = require('./sb2lib.js');

class VariablesL1 {

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

        this.extensions.numberSentences =   
            {bool: false, str: 'Computer outputs number sentences.'};
        this.extensions.newStory        = 
            {bool: false, str: 'Made a new number story.'};
        this.extensions.calcVolume      =
            {bool: false, str: 'Uses height variable to calculate volume.'};
        this.extensions.newShape        =
            {bool: false, str: 'Wrote a new script to calculate the area of a \
                different shape.'};

        this.help.noBen       =
            {bool: false, str: 'Make sure the project has a sprite named "Ben."'};
        this.help.noPerimeter =
            {bool: false, str: 'Make sure the project has a variable named "perimeter."'};
    }

    grade(fileObj, user) {
        this.initReqs();
        var ben;
        if ((ben = this.findBen(fileObj)) == null) return;
        if (this.checkPerimeter(fileObj)) return;
    
    }

    findBen(fileObj) {
        var ben = fileObj.children.find(child => child.objName === 'Ben');
        if (ben == null)
            this.help.noBen.bool = true;
    }

    checkPerimeter(fileObj) {
        var regexes = {
            /// Paired adds
            00: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "height"]], ["+", ["readVariable", "width"], ["readVariable", "width"]]]]')
            ),            
            01: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "width"]], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')
            ),
            02: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "height"], ["readVariable", "width"]], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')
            ),
            03: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "height"]], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')
            ),
            04: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "height"]], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')
            ),
            05: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["+", ["readVariable", "width"], ["readVariable", "width"]], ["+", ["readVariable", "height"], ["readVariable", "height"]]]]')
            ),
            /// Adds & mults
            06: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["*", 2, ["+", ["readVariable", "height"], ["readVariable", "width"]]]]')
            ),
            07: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["*", 2, ["+", ["readVariable", "width"], ["readVariable", "height"]]]]')
            ),
            08: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["*", 2, ["readVariable", "height"]], ["*", 2, ["readVariable", "width"]]]]')
            ),
            09: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["*", 2, ["readVariable", "width"]], ["*", 2, ["readVariable", "height"]]]]')
            ),
            /// Sequential adds
            10: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["readVariable", "width"]]]]]')
            ),
            11: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]]')
            ),
            12: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]]')
            ),
            13: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["+", ["readVariable", "height"], ["readVariable", "width"]]]]]')
            ),
            14: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["+", ["readVariable", "width"], ["readVariable", "height"]]]]]')
            ),
            15: rx.create(
                rx.flex('["setVar:to:", "perimeter", ["+", ["readVariable", "width"], ["+", ["readVariable", "width"], ["+", ["readVariable", "height"], ["readVariable", "height"]]]]]')
            ),
        };

        if (!fileObj.variables.some(vari => vari.name === "perimeter")) {
            this.help.noPerimeter.bool = true;
            return 1;
        }
        for (var sprite of ben.sprites) {
            for (var script of sprite.scripts) {
                for (var block of sb2.opcodeBlocks(block, 'setVar:to:')) {
                    console.log(JSON.stringify(block));
                }
            }
        }


        

    }
}