require('./grader');
require('./scratch3');

module.exports = class GradeCondLoopsL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/events-L1-multicultural'),
            youthCulture:  require('./templates/events-L1-youth-culture'),
            gaming:        require('./templates/events-L1-gaming')
        };
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        if (this.strand === 'multicultural') {
            this.requirements = [
                new Requirement('Choose a different costume for the float.', this.testCostumes(project)),
                new Requirement('Make the float stop at the Stop Sign, the turquoise blue line, or the red line.', this.testStop(project)),
                new Requirement('Make the float say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the float.', this.testSpeed(project)),
            ];
        }
        else if (this.strand === 'youthCulture') {
            this.requirements = [
                new Requirement('Choose a different costume for the car.', this.testCostumes(project)),
                new Requirement('Make the car stop at Libby, the yellow line, or the purple line.', this.testStop(project)),
                new Requirement('Make the car say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the car.', this.testSpeed(project)),
            ];
        }
        else if (this.strand === 'gaming') {
            this.requirements = [
                new Requirement('Make the cat stop at the gem or a different sprite.', this.testStop(project)),
                new Requirement('Have the cat say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the cat.', this.testSpeed(project)),
            ];
        }
        this.extensions = [
            new Extension('Add another sprite and have it stop at another sprite or a color.', this.checkStopExtension()),
            new Extension('Add a sound when a sprite stops moving.', this.checkSoundExtension()),
            new Extension('Have a sprite go back or turn around after it stops moving.', this.testTurnAround(project))
        ];
    }

    testCostumes(project) {
        for (let sprite of project.sprites) {
            for (let costume of sprite.costumes) {
                if (this.strand === 'multicultural' && costume.name === 'Butterfly Float') {
                    return false;
                }
                if (this.strand === 'youthCulture' && costume.name === 'Sedan') {
                    return false;
                }
            }
        }
        return true;
    }

    testStop(project) {
        let spritesPassing = 0;
        let spritesPassingExtension = 0;
        for (let sprite of project.sprites) {
            let scriptsPassing = 0;
            let scriptsPassingExtension = 0;
            for (let script of sprite.validScripts) {
                let blocksPassing = 0;
                let blocksPassingExtension = 0;
                for (let block of script.blocks) {
                    let moves = false;
                    let movesForExtension = false;
                    let stops = false;
                    let stopsForExtension = false;
                    if (block.opcode === 'control_repeat_until') {
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript) {
                                if (subblock.opcode === 'motion_movesteps') {
                                    moves = true;
                                    movesForExtension = true;
                                }
                            }
                        }
                        if (block.conditionBlock) {
                            for (let sensingBlock of block.conditionBlock.inputBlocks) {
                                for (let menuBlock of sensingBlock.inputBlocks) {
                                    if (menuBlock.opcode === 'sensing_touchingobjectmenu') {
                                        let touchingObject = menuBlock.fields.TOUCHINGOBJECTMENU[0];
                                        if (this.strand === 'multicultural' && (touchingObject !== 'King Momo' || sprite.name === 'Toucan')) {
                                            stops = true;
                                        }
                                        if (this.strand === 'youthCulture' && touchingObject !== 'Stop') {
                                            stops = true;
                                        }
                                        if (this.strand === 'gaming' && touchingObject !== 'Bee') {
                                            stops = true;
                                        }
                                        stopsForExtension = true;
                                    }
                                }
                                if (sensingBlock.opcode === 'sensing_touchingcolor') {
                                    stops = true;
                                    stopsForExtension = true;
                                }
                            }
                        }
                    }
                    if (moves && stops) {
                        blocksPassing++;
                    }
                    if (movesForExtension && stopsForExtension) {
                        blocksPassingExtension++;
                    }
                }
                if (blocksPassing) {
                    scriptsPassing++;
                }
                if (blocksPassingExtension) {
                    scriptsPassingExtension++;
                }
            }
            if (scriptsPassing) {
                spritesPassing++;
            }
            if (scriptsPassingExtension) {
                spritesPassingExtension++;
            }
        }
        this.stopExtensionPassing = false;
        if (this.strand === 'multicultural') {
            this.stopExtensionPassing = spritesPassingExtension > 2;
            return spritesPassing > 1; /// To account for the toucan float
        }
        else {
            this.stopExtensionPassing = spritesPassingExtension > 1;
            return spritesPassing > 0;
        }
    }

    testSay(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.validScripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') {
                        hasLooped = true;
                    }
                    if ((block.opcode.includes('looks_say') || block.opcode.includes('looks_think')) && hasLooped) {
                        return true;
                    }
                    if (block.opcode.includes('sound_play') && hasLooped) {
                        this.soundExtensionPassing = true;
                    }
                }
            }
        }
        return false;
    }

    testSpeed(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.validScripts) {
                for (let block of script.blocks) {
                    let steps = 0;
                    let duration = 0;
                    if (block.opcode === 'control_repeat_until') {
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript) {
                                if (subblock.opcode === 'motion_movesteps') {
                                    steps += subblock.inputs.STEPS[1][1];
                                }
                                if (subblock.opcode === 'control_wait') {
                                    duration += subblock.inputs.DURATION[1][1];
                                }
                            }
                        }
                    }
                    if (this.strand === 'multicultural') {
                        if (sprite.name === 'Toucan' && steps && (steps !== 1 || duration !== 1)) {
                            return true;
                        }
                        else if (steps && (steps !== 2 || duration !== 1)) {
                            return true;
                        }
                    }
                    if (this.strand === 'youthCulture' && steps && (steps !== 10 || duration !== 0.1)) {
                        return true;
                    }
                    if (this.strand === 'gaming' && steps && (steps !== 5 || duration !== 1)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkStopExtension() {
        if (this.stopExtensionPassing) {
            return true;
        }
        return false;
    }

    checkSoundExtension() {
        if (this.soundExtensionPassing) {
            return true;
        }
        return false;
    }

    testTurnAround(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.scripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') {
                        hasLooped = true;
                    }
                    if (hasLooped) {
                        if (block.opcode === 'motion_movesteps' && block.floatInput('STEPS') < 0) {
                            return true;
                        }
                        if (block.opcode.includes('motion_goto') || block.opcode.includes('motion_turn')) {
                            return true;
                        }
                        if (block.opcode === 'motion_pointindirection') {
                            return true;
                        }
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps' && subblock.floatInput('STEPS') < 0) {
                                    return true;
                                }
                            }
                        }
                    }

                }
            }
        }
        return false;
    }
}
