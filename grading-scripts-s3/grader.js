require('./grader');
require('./scratch3');

const STRAND_CONFIG = {
    multicultural: {
        requiresCostumeChange: true,           
        mainSprite: 'Float', 
        stopTargets: ['King Momo'],
        exceptionSprite: 'Toucan',
        defaultSpeed: { steps: 2, duration: 1 },
        exceptionSpeed: { steps: 1, duration: 1 },
        requiredSpritesPassing: 1 
    },
    youthCulture: {
        requiresCostumeChange: true,           
        mainSprite: 'Car',   
        stopTargets: ['Stop'],
        defaultSpeed: { steps: 10, duration: 0.1 },
        requiredSpritesPassing: 0
    },
    gaming: {
        requiresCostumeChange: false,          
        mainSprite: 'Cat', 
        stopTargets: ['Bee'],
        defaultSpeed: { steps: 5, duration: 1 },
        requiredSpritesPassing: 0
    },
    stardew: {
        requiresCostumeChange: true,           
        mainSprite: 'Bus',     
        stopTargets: ['Stop'],                 
        defaultSpeed: { steps: 10, duration: 0.1 },
        requiredSpritesPassing: 0
    }
};

module.exports = class GradeCondLoopsL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/conditional-loops-L1-multicultural.json'),
            youthCulture:  require('./templates/conditional-loops-L1-youth-culture.json'),
            gaming:        require('./templates/conditional-loops-L1-gaming.json'),
            stardew:       require('./templates/conditional-loops-L1-stardew.json')
        };
        
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        this.config = STRAND_CONFIG[this.strand] || STRAND_CONFIG['youthCulture'];
        
        //Save the template JSON so we can use it for checking
        this.template = strandTemplates[this.strand] || strandTemplates['youthCulture'];

        this.requirements = [];

        if (this.config.requiresCostumeChange) {
            this.requirements.push(
                new Requirement('Choose a different costume for the main sprite.', this.testCostumes(project))
            );
        }

        this.requirements.push(
            new Requirement('Make the sprite stop at the correct target or color.', this.testStop(project)),
            new Requirement('Make the sprite say something after it stops.', this.testSay(project)),
            new Requirement('Change the speed of the sprite.', this.testSpeed(project))
        );

        this.extensions = [
            new Extension('Add another sprite and have it stop at another sprite or a color.', this.checkStopExtension()),
            new Extension('Add a sound when a sprite stops moving.', this.checkSoundExtension()),
            new Extension('Have a sprite go back or turn around after it stops moving.', this.testTurnAround(project))
        ];
    }

    testCostumes(project) {
        for (let sprite of project.sprites) {
            let detectedIdentity = global.detectSprite(sprite, this.template);
            
            if (detectedIdentity === this.config.mainSprite) {
                // If it's the main sprite, check if they moved off the default costume (index 0)
                return sprite.currentCostume > 0;
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

            // Identify the sprite
            let detectedIdentity = global.detectSprite(sprite, this.template);
            
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
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps') moves = true;
                                if (opcodeLists.changeXY.includes(subblock.opcode)) movesForExtension = true;
                            }
                        }
                        
                        if (block.conditionBlock) {
                            for (let menuBlock of block.conditionBlock.inputBlocks) {
                                if (menuBlock.opcode === 'sensing_touchingobjectmenu') {
                                    let touchingObject = menuBlock.fields.TOUCHINGOBJECTMENU[0];
                                    
                                    let isDefaultTarget = this.config.stopTargets.includes(touchingObject);
                                    
                                    let isExceptionSprite = detectedIdentity === this.config.exceptionSprite;
                                    
                                    if (!isDefaultTarget || isExceptionSprite) {
                                        stops = true;
                                    }
                                    stopsForExtension = true;
                                }
                            }
                            if (block.conditionBlock.opcode === 'sensing_touchingcolor') {
                                stops = true;
                                stopsForExtension = true;
                            }
                        }
                    }
                    if (moves && stops) blocksPassing++;
                    if (movesForExtension && stopsForExtension) blocksPassingExtension++;
                }
                if (blocksPassing) scriptsPassing++;
                if (blocksPassingExtension) scriptsPassingExtension++;
            }
            if (scriptsPassing) spritesPassing++;
            if (scriptsPassingExtension) spritesPassingExtension++;
        }
        
        let threshold = this.config.requiredSpritesPassing;
        this.stopExtensionPassing = spritesPassingExtension > (threshold + 1);
        return spritesPassing > threshold;
    }

    testSay(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.validScripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') hasLooped = true;
                    
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
            
            // Identify the sprite so we know which baseline speed to test against
            let detectedIdentity = global.detectSprite(sprite, this.template);
            
            for (let script of sprite.validScripts) {
                for (let block of script.blocks) {
                    let steps = 0;
                    let duration = 0;
                    
                    if (block.opcode === 'control_repeat_until') {
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps') steps += subblock.inputs.STEPS[1][1];
                                if (subblock.opcode === 'control_wait') duration += subblock.inputs.DURATION[1][1];
                            }
                        }
                    }
                    
                    if (steps) {
                        let expected = (detectedIdentity === this.config.exceptionSprite && this.config.exceptionSpeed) 
                            ? this.config.exceptionSpeed 
                            : this.config.defaultSpeed;
                            
                        if (steps !== expected.steps || duration !== expected.duration) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    checkStopExtension() {
        return !!this.stopExtensionPassing;
    }

    checkSoundExtension() {
        return !!this.soundExtensionPassing;
    }

    testTurnAround(project) {
        // Unchanged
        for (let sprite of project.sprites) {
            for (let script of sprite.scripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') hasLooped = true;
                    if (hasLooped) {
                        if (block.opcode === 'motion_movesteps' && block.floatInput('STEPS') < 0) return true;
                        if (block.opcode.includes('motion_goto') || block.opcode.includes('motion_turn')) return true;
                        if (block.opcode === 'motion_pointindirection') return true;
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps' && subblock.floatInput('STEPS') < 0) return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}