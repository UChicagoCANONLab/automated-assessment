/*
Scratch 3 Variables L1 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
Scratch 3 updates and fixes: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.spaceKeyScript = { bool: false, str: 'Perimeter is calculated when the space key is pressed' };
        this.requirements.correctCalc = { bool: false, str: 'Perimeter is correctly calculated' };
        this.requirements.printsPerimeterWithJoin = { bool: false, str: 'Perimeter is correctly outputted with a join block' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;
       
        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                for (let script of target.scripts) {
                    // in the script of when the space bar is pressed
                    if (script.blocks[0].opcode === 'event_whenkeypressed') {
                        if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                            // has a script built on to the event block when space key is pressed
                            if (script.blocks.length > 0) {
                                this.requirements.spaceKeyScript.bool = true;
                            }
                            for (let i = 0; i < script.blocks.length; i ++) {
                                if (script.blocks[i].opcode === 'data_setvariableto') {
                                    if (script.blocks[i].fields.VARIABLE[0] === 'perimeter') {
                                        let operatorBlockID = script.blocks[i].inputs.VALUE[1];
                                        let operatorBlock = target.blocks[operatorBlockID];
                                        
                                        if (operatorBlock.opcode === 'operator_add') {
                                            var aID = operatorBlock.inputs.NUM1[1];
                                            var a = target.blocks[aID];
                                            var bID = operatorBlock.inputs.NUM2[1];
                                            var b = target.blocks[bID];

                                            var height1 = false;
                                            var width1 = false;

                                            if (!b || !a) { return ;}

                                            if (a.opcode === 'operator_multiply') {
                                                var amult = [a.inputs.NUM1[1][1], a.inputs.NUM2[1][1]];
                                                if (amult.includes('2') && amult.includes('height')) {
                                                    height1 = true;
                                                } else if (amult.includes('2') && amult.includes('width')) {
                                                    width1 = true;
                                                }
                                            }
                                            if (a.opcode === 'operator_add') {
                                                var aadd = [a.inputs.NUM1[1][1], a.inputs.NUM2[1][1]];
                                                if (aadd[0] === 'height' && aadd[0] === 'height') {
                                                    height1 = true;
                                                } else if (aadd[0] === 'width' && aadd[1] === 'width') {
                                                    width1 = true;
                                                }
                                            }

                                            if (b.opcode === 'operator_multiply') {
                                                var bmult = [b.inputs.NUM1[1][1], b.inputs.NUM2[1][1]];
                                                if (bmult.includes('2') && bmult.includes('height')) {
                                                    height1 = true;
                                                } else if (bmult.includes('2') && bmult.includes('width')) {
                                                    width1 = true;
                                                }
                                            }

                                            if (b.opcode === 'operator_add') {
                                                var badd = [b.inputs.NUM1[1][1], b.inputs.NUM2[1][1]];
                                                if (badd[0] === 'height' && badd[1] === 'height') {
                                                    height1 = true;
                                                } else if (badd[0] === 'width' && badd[1] === 'width') {
                                                    width1 = true;
                                                }
                                            }

                                            if (width1 && height1) {
                                                this.requirements.correctCalc.bool = true;
                                            }


                                        }
                                        else if (operatorBlock.opcode === 'operator_multiply') {
                                            var mult = [operatorBlock.inputs.NUM1[1], operatorBlock.inputs.NUM2[1]];
                                            var height2 = false;
                                            var width2 = false;

                                            if (mult[0][1] != undefined && mult[0][1] == '2') {
                                                if (target.blocks[mult[1]] != undefined && target.blocks[mult[1]].opcode === 'operator_add') {
                                                    var num1 = target.blocks[mult[1]].inputs.NUM1[1][1];
                                                    var num2 = target.blocks[mult[1]].inputs.NUM2[1][1];
                                                    if (num1 != undefined) {
                                                        if (num1 === 'width') {
                                                            width2 = true;
                                                        }
                                                        else if (num1 === 'height') {
                                                            height2 = true;
                                                        }
                                                    }
                                                    if (num2 != undefined) {
                                                        if (num2 === 'width') {
                                                            width2 = true;
                                                        } 
                                                        else if (num2 === 'height') {
                                                            height2 = true;
                                                        }
                                                    }
                                                }
                                            }
                                            else if (mult[1][1] != undefined && mult[1][1] === '2') {
                                                if (target.blocks[mult[0]] != undefined && target.blocks[mult[1]].opcode === 'operator_add') {
                                                    var num1 = target.blocks[mult[0]].inputs.NUM1[1][1];
                                                    var num2 = target.blocks[mult[0]].inputs.NUM2[1][1];
                                                    if (num1 !== undefined) {
                                                        if (num1 === 'width') {
                                                            width2 = true;
                                                        } else if (num1 === 'height') {
                                                            height2 = true;
                                                        }
                                                    }
                                                    if (num2 !== undefined) {
                                                        if (num2 === 'width') {
                                                            width2 = true;
                                                        } else if (num2 === 'height') {
                                                            height2 = true;
                                                        }
                                                    }
                                                }
                                            }

                                            if (width2 && height2) {
                                                this.requirements.correctCalc.bool = true;
                                            }
                                        }
                                    }
                                }
                                if (script.blocks[i].opcode === "looks_sayforsecs" || script.blocks[i].opcode === 'looks_say') {
                                    //console.log('there is a say block');
                                    var sayID  = script.blocks[i].inputs.MESSAGE[1];
                                    var sayBlock = target.blocks[sayID];
                                    if (sayBlock.opcode === 'operator_join') {
                                        var messages = [sayBlock.inputs.STRING1[1][1], sayBlock.inputs.STRING2[1][1]];
                                        if (messages.includes('perimeter')) {
                                            this.requirements.printsPerimeterWithJoin.bool = true;
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
    }
}