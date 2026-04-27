require('./scratch3');

module.exports = class GradeEventsL1 {

    /// Identify all subscripts of a block, recursively.
    subscriptsRecursive(block, array = []) {
        if (block.subscripts.length) {
            for (var subscript of block.subscripts) {
                array.push(subscript);
                if (subscript.blocks.length) {
                    for (var block_ of subscript.blocks) {
                        this.subscriptsRecursive(block_, array);
                    }
                }
            }
        }
        return array;
    }

    /// Counts the number of sprites that get larger, speak, and reset size when clicked.
    clickPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenthisspriteclicked' && script.blocks.length > 1
            )) {
                var spriteSize = parseFloat(sprite.size);
                var initialSpriteSize = spriteSize;
                var gotBigger = false;
                var spoke = false;
                var reset = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) gotBigger = true;
                        spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > initialSpriteSize) gotBigger = true;
                        spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    else if (block.opcode.includes('looks_say') && spriteSize > initialSpriteSize) spoke = true;
                }
                if (gotBigger && Math.abs(spriteSize - initialSpriteSize) < 0.05) reset = true;
                if (gotBigger && spoke && reset) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with a correctly modeled green flag script.
    greenFlagPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenflagclicked' && script.blocks.length > 1
            )) {
                var containsGoTo = false;
                var containsSetSize = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'motion_gotoxy' || this.strand === 'multicultural')  containsGoTo = true;
                    if (block.opcode === 'looks_setsizeto') containsSetSize = true;
                }
                if (containsGoTo && containsSetSize) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with a correct right or left arrow script.
    keyPassing(project, directionString) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenkeypressed' && script.blocks.length > 1
            )) {
                var containsMove = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'motion_movesteps') {
                        var key = script.blocks[0].fields.KEY_OPTION[0];
                        var steps = block.inputs.STEPS[1][1];
                        if (directionString === 'left' && key === 'left arrow' && steps < 0) containsMove = true;
                        else if (directionString === 'right' && key === 'right arrow' && steps > 0) containsMove = true;
                    }
                    if (directionString === 'any' && block.opcode.includes('motion_')) containsMove = true;
                }
                if (containsMove) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with a correct shrink on space script.
    spacePassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            var spriteSize = parseFloat(sprite.size);
            var initialSpriteSize = spriteSize;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenkeypressed' && script.blocks.length > 1
            )) {
                var key = script.blocks[0].fields.KEY_OPTION[0];
                if (key === "space"){
                    var containsShrink = false;
                    for (var block of script.blocks) {
                        if (block.opcode === 'looks_changesizeby') {
                            if (block.inputs.CHANGE[1][1] < 0) containsShrink = true;
                        }
                        else if (block.opcode === 'looks_setsizeto') {
                            if (block.inputs.SIZE[1][1] < initialSpriteSize) containsShrink = true;
                        }
                    }
                    if (containsShrink) scriptsPassing++;
                }
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites that spin around using turn and wait blocks in a loop.
    spinPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter (
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1
            )) {
                var containsSpin = false;
                for (var block of script.blocks) {
                    if (['control_repeat', 'control_repeat_until', 'control_forever'].includes(block.opcode)) {
                        var subscripts = [];
                        subscripts = this.subscriptsRecursive(block, subscripts);
                        var containsTurn = false;
                        var containsWait = false;
                        for (var subscript of subscripts) {
                            for (var block of subscript.blocks) {
                                if (block.opcode.includes('motion_turn')) containsTurn = true;
                                else if (block.opcode === 'control_wait') containsWait = true;
                            }
                        }
                        if (containsTurn && containsWait) containsSpin = true;
                    }
                }
                if (containsSpin) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    addEvent(project, theme) {
        var spritesPassing = 0;
        const baselineKeys = {
            "youthCulture": ['left arrow'],
            "gaming": ['left arrow', 'right arrow'],
            "multicultural": [], // 'none in baseline'
            "stardew": ['left arrow', 'space']
        };

        const existingKeys = new Set(
            (baselineKeys[theme] || []).map(key => key.toLowerCase())
        );

        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenkeypressed' && script.blocks.length > 1
            )) {
                var key = script.blocks[0].fields.KEY_OPTION[0];
                if (key) {                  
                    if (!existingKeys.has(key)) {
                        scriptsPassing++;
                    }
                }
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }


    /// Evaluate the completion of the requirements and extensions for a given JSON representation of a project.
    grade(json, user) {
        if (no(json)) {
            this.requirements = {
                noFile: {
                    bool: false,
                    str: 'File not valid.'
                }
            }
            return;
        };
        var project = new Project(json, this);
        this.requirements = {};
        this.extensions = {};
        var templates = {
            multicultural: require('./templates/events-L1-multicultural'),
            youthCulture:  require('./templates/events-L1-youth-culture'),
            gaming:        require('./templates/events-L1-gaming'),
            stardew:       require('./templates/events-L1-stardew.json')
        };
        this.strand = detectStrand(project, templates);
        this.requirements.click1 = {
            bool: this.clickPassing(project) >= 1,
            str: 'One sprite gets larger, speaks, and goes back to its original size when clicked.'
        };
        this.requirements.click2 = {
            bool: this.clickPassing(project) >= 2,
            str: 'Two sprites get larger, speak, and go back to their original sizes when clicked.'
        };
        this.requirements.click3 = {
            bool: this.clickPassing(project) >= 3,
            str: 'Three sprites get larger, speak, and go back to their original sizes when clicked.'
        };
        this.requirements.greenFlag = {
            bool: this.greenFlagPassing(project) >= 3,
            str: 'These three sprites all reset their sizes when the green flag is clicked.'
        };
        this.extensions.spin = {
            bool: this.spinPassing(project) >= 1,
            str: 'At least one sprite spins around using turn and wait blocks in a loop.'
        };
        this.extensions.addEvent = {
            bool : this.addEvent(project) >= 1,
            str: 'At least one sprite reacts to a new event/key press'
        }
        if (this.strand === 'youthCulture') {
            this.extensions.key = {
                bool: this.keyPassing(project, 'left') >= 1,
                str: 'Sprite moves to the left when the left arrow key is pressed.'
            };
        }
        else if (this.strand === 'gaming') {
            this.requirements.key = {
                bool: this.keyPassing(project, 'right') >= 1,
                str: 'Sprite moves to the right when the right arrow key is pressed.'
            };
            this.extensions.key = {
                bool: this.keyPassing(project, 'left') >= 1,
                str: 'Sprite moves to the left when the left arrow key is pressed.'
            };
        }
        else if (this.strand === 'stardew') {
            this.requirements.key = {
                bool: this.spacePassing(project) >= 1,
                str: 'Sprite becomes smaller when space key is pressed'
            }
            this.extensions.key = {
                bool: this.keyPassing(project, 'left') >= 1,
                str: 'Sprite moves to the left when the left arrow key is pressed.'
            };
        }
        return;
    }
}
