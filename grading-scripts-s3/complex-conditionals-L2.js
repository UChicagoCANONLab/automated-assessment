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
            paintCostumeChanged: { bool: false, str: 'Changed costumes to change the shapes of the paint spots.' },
            soundAdded: { bool: false, str: 'A sound effect plays when 2 colors are mixed together.' },
        }
    }

    // given an "operator_equals" block, check that one side is set to "1" and return the other side
    getColor(block) {
        let input1 = block.inputs.OPERAND1[1][1];
        let input2 = block.inputs.OPERAND2[1][1];

        if (input1 === "1") {
            return input2;
        } else if (input2 === "1") {
            return input1;
        } else {  // if neither side is set to "1", return null
            return null;
        }
    }

    gradePaintMix(sprite) {
        // iterate through each of the sprite's scripts that start with the event 'When I Receive' 
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === "event_whenbroadcastreceived")) {
            let eventBlock = script.blocks[0];

            if (eventBlock.fields.BROADCAST_OPTION[0] === "Mix Paint") {  // for some reason the Json for L2 capitalizes "mix paint", whereas in L1 it didnt

                // check whether first block after "when I recieve 'mix paint'" initializes NumColors variable correctly 
                let secondBlock = eventBlock.nextBlock();
                if ((secondBlock.opcode === "data_setvariableto") && (secondBlock.fields.VARIABLE[0] === "NumColors")) {
                    let initColors = {
                        red: false,
                        yellow: false,
                        blue: false,
                    }
                    let color1 = null;
                    let color2 = null;
                    let color3 = null;

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

                // check remaining blocks in the script 
                script.traverseBlocks((block, level) => {
                    if (block.opcode === "control_if") {
                        let ifCondition = block.conditionBlock();
                        if ((ifCondition !== null) && (ifCondition.opcode === "operator_equals")) {
                            let in1 = ifCondition.inputs.OPERAND1[1][1];
                            let in2 = ifCondition.inputs.OPERAND2[1][1];

                            if (((in1 === "NumColors") && (in2 === "1")) || ((in1 === "1") && (in2 === "NumColors"))) {
                                this.requirements.oneCondSet.bool = true;
                            } else if (((in1 === "NumColors") && (in2 === "2")) || ((in1 === "2") && (in2 === "NumColors"))) {
                                this.requirements.twoCondSet.bool = true;
                            } else if (((in1 === "NumColors") && (in2 === "3")) || ((in1 === "3") && (in2 === "NumColors"))) {
                                this.extensions.threeCondSet.bool = true;
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
                }
            }
        }
    }



}