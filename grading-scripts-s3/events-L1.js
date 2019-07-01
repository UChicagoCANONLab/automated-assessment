require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            reactToClick: { bool: false, str: 'Three sprites react to being clicked.'                          },
            getBigger:    { bool: false, str: 'Three sprites get bigger when clicked.'                         },
            talkTwice:    { bool: false, str: 'After getting bigger, the sprites talk twice.'                  },
            resetSize:    { bool: false, str: 'After talking twice, the sprites reset to their original size.' }
        };
        this.extensions = {
            changedName:  { bool: false, str: 'At least one sprite\'s name has been changed.'                  },
            addedSpin:    { bool: false, str: 'At least one sprite spins using turn and wait blocks.'          },
            addedEvent:   { bool: false, str: 'At least one sprite reacts to a different event.'               }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        for (var sprite of project.sprites) {
            for (var script of sprite.scripts.filter(script => script.blocks[0].opcode.includes('event_when'))) {
                script.context.spriteSize = script.context.initialSpriteSize = parseFloat(sprite.size);
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) script.context.getBigger = 1;
                        script.context.spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > script.context.initialSpriteSize) script.context.getBigger = 1;
                        script.context.spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    if (block.opcode.includes('looks_say') && script.context.spriteSize > script.context.initialSpriteSize) {
                        script.context.talkTwice++;
                    }
                }
                if (script.context.getBigger && Math.abs(script.context.spriteSize - script.context.initialSpriteSize) < 0.05) {
                    script.context.resetSize = 1;
                }
                if (script.blocks[0].opcode === 'event_whenthisspriteclicked' && script.blocks.length > 1) {
                    script.context.reactToClick = 1;
                }
                else if (script.blocks[0].opcode !== 'event_whenflagclicked' && script.blocks.length > 1) {
                    script.context.addedEvent = 1;
                }
                if (script.blocks.some(block => block.opcode.includes('motion_turn')) &&
                        script.blocks.some(block => block.opcode === 'control_wait')) {
                    script.context.addedSpin = 1;
                }
            }
            sprite.context.changedName = !['Left', 'Middle', 'Right', 'Catrina'].includes(sprite.name);
            sprite.context.pull(['reactToClick', 'getBigger', 'resetSize', 'addedEvent', 'addedSpin'], 1, false);
            sprite.context.pull(['talkTwice'], 2, false);
        }
        project.context.pull(['reactToClick', 'getBigger', 'talkTwice', 'resetSize'], 3, true);
        project.context.pull(['changedName', 'addedSpin', 'addedEvent'], 1, false);
        project.context.makeGrade(this);
    }
}