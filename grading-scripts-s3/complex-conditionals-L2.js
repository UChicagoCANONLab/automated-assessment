/* Complex Conditionals L2 Autograder
 * Scratch 3 (original) version: Anna Zipp, Summer 2019
 */

require('./scratch3');

module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            numColorsSet: { bool: false, str: 'Set the NumColors variable to store the total number of selected colors.' },
            oneCondSet: { bool: false, str: 'Created a conditional statement to determine if only 1 color was selected.' },
            oneCondNested: { bool: false, str: 'Nested the correct conditional statements under the 1-color condition.' },
            twoCondSet: { bool: false, str: 'Created a conditional statement to determine if 2 colors were selected.' },
            twoCondNested: { bool: false, str: 'Nested the correct conditional statements under the 2-color condition.' },
        }
        this.extensions = {
            brownMixed: { bool: false, str: 'Paint Mix switches to "Brown Paint Mix" and broadcasts "brown" if Red & Blue & Yellow selected.' },
            threeCondSet: { bool: false, str: 'Created a conditional statement to determine if 3 colors were selected.' },
            threeCondNested: { bool: false, str: 'Nested the correct conditional statements under the 3-color condition.' },
            paintCostumeChanged: { bool: false, str: 'Changed costumes of the Red, Blue, or Yellow Paint sprites to change the shape of their paint spots.' },
            soundAdded: { bool: false, str: 'A sound effect plays when 2 colors are mixed together.' },
        }
    }

    // given an "operator_equals" block, check that one side is set to "1" and return the other side
    getOneColor(block) {
        if (block.opcode === "operator_equals") {
            let input1 = block.inputs.OPERAND1[1][1];
            let input2 = block.inputs.OPERAND2[1][1];

            if (input1 === "1") {
                return input2;
            } else if (input2 === "1") {
                return input1;
            } else {  // if neither side is set to "1", return null
                return null;
            }
        } else {
            return null;
        }
    }

    // Given a "And" block where one of the sides could be another "And" block, find the colors selected 
    getMultColors(block) {
        let colors = [];

        if (block.opcode === "operator_and") {
            let left = block.toBlock(block.inputs.OPERAND1[1]);
            let right = block.toBlock(block.inputs.OPERAND2[1]);

            if (left.opcode === "operator_equals") {
                colors.push(this.getOneColor(left));
            } else if (left.opcode === "operator_and") {
                let op1 = left.toBlock(left.inputs.OPERAND1[1]);
                let op2 = left.toBlock(left.inputs.OPERAND2[1]);

                if (op1.opcode === "operator_equals") colors.push(this.getOneColor(op1));
                if (op2.opcode === "operator_equals") colors.push(this.getOneColor(op2));
            }

            if (right.opcode === "operator_equals") {
                colors.push(this.getOneColor(right));
            } else if (right.opcode === "operator_and") {
                let op3 = right.toBlock(right.inputs.OPERAND1[1]);
                let op4 = right.toBlock(right.inputs.OPERAND2[1]);

                if (op3.opcode === "operator_equals") colors.push(this.getOneColor(op3));
                if (op4.opcode === "operator_equals") colors.push(this.getOneColor(op4));
            }
        }
        return colors;
    }

    // check if a block correctly sets the varibale NumColors to Red + Yellow + Blue 
    checkNumColors(secondBlock) {
        let initColors = {
            red: false,
            yellow: false,
            blue: false,
        }
        let color1 = null;
        let color2 = null;
        let color3 = null;

        if ((secondBlock.opcode === "data_setvariableto") && (secondBlock.fields.VARIABLE[0] === "NumColors")) {
            let inputVal = secondBlock.toBlock(secondBlock.inputs.VALUE[1]);

            if (inputVal.opcode === "operator_add") {
                if (((typeof inputVal.inputs.NUM1[1]) === "object") && ((typeof inputVal.inputs.NUM2[1]) === "string")) {
                    color1 = inputVal.inputs.NUM1[1][1];

                    let subAddBlock = inputVal.toBlock(inputVal.inputs.NUM2[1]);
                    if (subAddBlock.opcode === "operator_add") {
                        color2 = subAddBlock.inputs.NUM1[1][1];
                        color3 = subAddBlock.inputs.NUM2[1][1];
                    }
                } else if (((typeof inputVal.inputs.NUM1[1]) === "string") && ((typeof inputVal.inputs.NUM2[1]) === "object")) {
                    let subAddBlock = inputVal.toBlock(inputVal.inputs.NUM1[1]);
                    if (subAddBlock.opcode === "operator_add") {
                        color1 = subAddBlock.inputs.NUM1[1][1];
                        color2 = subAddBlock.inputs.NUM2[1][1];
                    }
                    color3 = inputVal.inputs.NUM2[1][1];
                }

                if (color1 === "Red") {
                    initColors.red = true;
                } else if (color1 === "Yellow") {
                    initColors.yellow = true;
                } else if (color1 === "Blue") {
                    initColors.blue = true;
                }

                if (color2 === "Red") {
                    initColors.red = true;
                } else if (color2 === "Yellow") {
                    initColors.yellow = true;
                } else if (color2 === "Blue") {
                    initColors.blue = true;
                }

                if (color3 === "Red") {
                    initColors.red = true;
                } else if (color3 === "Yellow") {
                    initColors.yellow = true;
                } else if (color3 === "Blue") {
                    initColors.blue = true;
                }

                if (initColors.red && initColors.yellow && initColors.blue) {
                    this.requirements.numColorsSet.bool = true;
                }
            }
        }
    }

    getCostume(block) {
        let costume = null;
        if (block.opcode === "looks_switchcostumeto") {
            let costumeBlock = block.toBlock(block.inputs.COSTUME[1]);
            if (costumeBlock && (costumeBlock.opcode === "looks_costume")) {
                costume = costumeBlock.fields.COSTUME[0]; 
            } 
        }
        return costume;
    }

    gradePaintMix(sprite) {
        let yellow = false;
        let red = false;
        let blue = false;

        let orange = false;
        let purple = false;
        let green = false;

        // iterate through each of the sprite's scripts that start with the event 'When I Receive' 
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === "event_whenbroadcastreceived")) {
            let eventBlock = script.blocks[0];

            if (eventBlock.fields.BROADCAST_OPTION[0] === "mix paint") {  // for some reason the Json for L2 capitalizes "mix paint", whereas in L1 it didnt
                // check whether first block after "when I recieve 'mix paint'" initializes NumColors variable correctly 
                let secondBlock = eventBlock.nextBlock();
                this.checkNumColors(secondBlock);

                // check remaining blocks in the script 
                script.traverseBlocks((block, level) => {
                    // find "Switch Costume To" block
                    if (block.opcode === "looks_switchcostumeto") {
                        let costume = this.getCostume(block);
                        let broadcasts = [];
                        let blocksAfterCostume = block.childBlocks();
                        for (let currBlock of blocksAfterCostume) {
                            if (currBlock.opcode === "event_broadcast") {
                                broadcasts.push(currBlock.inputs.BROADCAST_INPUT[1][1]);
                            }
                        }

                        // Find the first "If/Then" block that contains the "switch costume to" block
                        let innerIf = block.isWithin();
                        if ((innerIf !== null) && (innerIf.opcode === "control_if")) {
                            let innerCond = innerIf.conditionBlock();
                            if (innerCond !== null) {
                                // check if brown is mixed, regardless of whether it is nested in another conditional
                                let colors = this.getMultColors(innerCond);
                                if (costume.includes("Brown Paint Mix") && broadcasts.includes("brown")) {
                                    if (colors.includes("Blue") && colors.includes("Yellow") && colors.includes("Red")) {
                                        this.extensions.brownMixed.bool = true;
                                    }
                                }

                                // Find the outer-most "If/Then" block, which the inner "If/Then" should be nested within
                                let outerIf = innerIf.isWithin();
                                if ((outerIf !== null) && (outerIf.opcode === "control_if")) {
                                    let outerCond = outerIf.conditionBlock();
                                    if ((outerCond !== null) && (outerCond.opcode === "operator_equals")) {
                                        let in1 = outerCond.inputs.OPERAND1[1][1];
                                        let in2 = outerCond.inputs.OPERAND2[1][1];

                                        // Condition for if one color is selected
                                        if (((in1 === "NumColors") && (in2 === "1")) || ((in1 === "1") && (in2 === "NumColors"))) {
                                            this.requirements.oneCondSet.bool = true;

                                            let color = this.getOneColor(innerCond);
                                            if (costume.includes("Yellow Paint Mix") && color.includes("Yellow")) {
                                                yellow = true;
                                            } else if (costume.includes("Red Paint Mix") && color.includes("Red")) {
                                                red = true;
                                            } else if (costume.includes("Blue Paint Mix") && color.includes("Blue")) {
                                                blue = true;
                                            }

                                            if (yellow && red && blue) {
                                                this.requirements.oneCondNested.bool = true;
                                            }

                                        // Condition for if two colors are selected
                                        } else if (((in1 === "NumColors") && (in2 === "2")) || ((in1 === "2") && (in2 === "NumColors"))) {
                                            this.requirements.twoCondSet.bool = true;

                                            for (let currBlock of blocksAfterCostume) {
                                                if (currBlock.opcode.includes("sound_play")) {
                                                    this.extensions.soundAdded.bool = true;
                                                }
                                            }

                                            if (costume.includes("Orange Paint Mix") && broadcasts.includes("orange")) {
                                                if (colors.includes("Red") && colors.includes("Yellow")) orange = true;    
                                            } else if (costume.includes("Purple Paint Mix") && broadcasts.includes("purple")) {
                                                if (colors.includes("Blue") && colors.includes("Red")) purple = true;
                                            } else if (costume.includes("Green Paint Mix") && broadcasts.includes("green")) {
                                                if (colors.includes("Blue") && colors.includes("Yellow")) green = true;
                                            }

                                            if (orange && purple && green) {
                                                this.requirements.twoCondNested.bool = true;
                                            }

                                        // Condition for if three colors are selected 
                                        } else if (((in1 === "NumColors") && (in2 === "3")) || ((in1 === "3") && (in2 === "NumColors"))) {
                                            this.extensions.threeCondSet.bool = true;

                                            if (costume.includes("Brown Paint Mix") && broadcasts.includes("brown")) {
                                                if (colors.includes("Blue") && colors.includes("Yellow") && colors.includes("Red")) {
                                                    this.extensions.brownMixed.bool = true;
                                                    this.extensions.threeCondNested.bool = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (block.opcode.includes("sound_play")) {
                        let potentialOuterIf = block.isWithin();
                        if ((potentialOuterIf !== null) && (potentialOuterIf.opcode === "control_if")) {
                            let cond = potentialOuterIf.conditionBlock();
                            if ((cond !== null) && (cond.opcode === "operator_equals")) {
                                let in1 = cond.inputs.OPERAND1[1][1];
                                let in2 = cond.inputs.OPERAND2[1][1];
                                // Condition for if one color is selected
                                if (((in1 === "NumColors") && (in2 === "1")) || ((in1 === "1") && (in2 === "NumColors"))) {
                                    this.extensions.soundAdded.bool = true;
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        for (var target of project.targets) {
            if (!(target.isStage)) {
                if (target.name === "Paint Mix") {
                    this.gradePaintMix(target);
                } else if (["Red Paint", "Blue Paint", "Yellow Paint"].includes(target.name)) {
                    let currCostume = target.currentCostume;
                    let currCostumeName = target.costumes[currCostume].name;
                    if (currCostumeName.includes("Smear")) {
                        this.extensions.paintCostumeChanged.bool = true;
                    }
                }
            }
        }
    }
}