/// Scratch 3 helper functions
require('./context');

/// Returns false for null, undefined, and zero-length values.
global.is = function(x) {
    return !(x == null || x === {} || x === []);
}

/// Opposite of is().
global.no = function(x) {
    return !is(x);
}

/// Container class for Scratch blocks.
global.Block = class {
    constructor(target, block, within=null) {
        Object.assign(this, target.blocks[block]);
        this.id = block;
        this.context = new Context(target.context, false);
        this.target = target;
        this.subscripts = this.subScripts();
        this.subscriptsRecursive = this.subscriptsRecursiveHelper();
        this.within = within;
        this.conditionBlock = this.conditionBlockHelper();
        this.inputBlocks = this.inputBlocksHelper();
        this.startTime = 0;
        this.duration = this.durationHelper();
    }

    /// Internal function that converts a block to a Block.
    toBlock(x, within=null) {
        return new Block(this.target, x, within);
    }

    /// Returns the next block in the script.
    nextBlock(within=null) {
        if (no(this.next)) return null;

        return this.toBlock(this.next, within);
    }

    /// Returns the previous block in the script.
    prevBlock() {
        if (no(this.parent)) return null;

        return this.toBlock(this.parent);
    }

    /// Returns the conditional statement of the block, if it exists.
    conditionBlockHelper() {
        if (no(this.inputs) || no(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1], this);
    }

    /// Returns an array of the blocks that are referenced in "fields" and "inputs."
    /// They correspond to menus, conditions, subscript heads, etc.
    inputBlocksHelper() {
        var array = [];
        for (var input in this.inputs) {
            var inputBlock = this.toBlock(this.inputs[input][1]);
            if (inputBlock) {
                array.push(inputBlock);
            }
        }
        for (var field in this.fields) {
            var fieldBlock = this.toBlock(this.fields[field][1]);
            if (fieldBlock && fieldBlock.opcode) {
                array.push(fieldBlock);
            }
        }
        return array;
    }

    /// Returns the number of seconds this block takes to execute.
    durationHelper() {
        if (!this || !this.opcode) {
            return 0;
        }
        if (this.opcode.includes('motion_glide')) {
            return this.floatInput();
        }
        else if (this.opcode === 'looks_thinkforsecs' || this.opcode === 'looks_sayforsecs') {
            return this.floatInput('SECS');
        }
        else if (this.opcode === 'control_wait') {
            return this.floatInput('DURATION');
        }
        else {
            return 0;
        }
    }

    /// Returns an array representing the script that contains the block.
    childBlocks(within=null) {
        var array = [];
        var x = this;
        while (x) {
            array.push(x);
            x = x.nextBlock(within);
        }
        return array;
    }

    /// Returns an array of Scripts representing the subscripts of the block.
    subScripts() {
        if (no(this.inputs)) return [];
        var array = [];

        if (is(this.inputs.SUBSTACK) && is(this.inputs.SUBSTACK[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK[1], this), this.target));
        }
        if (is(this.inputs.SUBSTACK2) && is(this.inputs.SUBSTACK2[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK2[1], this), this.target));
        }
        return array;
    }

    /// Identify all subscripts of a block, recursively.
    subscriptsRecursiveHelper(scriptArray = []) {
        if (this.subscripts.length) {
            for (var subscript of this.subscripts) {
                scriptArray.push(subscript);
                if (subscript.blocks.length) {
                    for (var block of subscript.blocks) {
                        block.subscriptsRecursiveHelper(scriptArray);
                    }
                }
            }
        }
        return scriptArray;
    }

    /// Checks if the block is a subblock of another block
    isWithin(compareBlock=(block => true)) {
        var outerBlock = this.within;
        while(outerBlock) {
            if (compareBlock(outerBlock)) {
                return outerBlock;
            }
            outerBlock = outerBlock.within;
        }
        return null;
    }

    /// Returns a given input of the block as a float if it exists.
    floatInput(name) {
        var input = this.inputs[name];
        if (input && input[1] && input[1][1]) {
            return parseFloat(input[1][1]);
        }
        return 0;
    }

    textInput(name) {
        var input = this.inputs[name];
        if (input && input[1] && input[1][1]) {
            return input[1][1];
        }
        return null;
    }

}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block, target) {
        this.blocks  = block.childBlocks(block.within);
        this.target  = target;
        this.context = new Context(target.context, false);
        for (var block of this.blocks) {

        }
        this.subscripts = [];
        let time = 0;
        for (var block of this.blocks) {
            block.startTime = time;
            time += block.duration;
            for (var subscript of block.subscripts) {
                if (subscript.blocks.length) {
                    this.subscripts.push(subscript);
                }
            }
            this.context.sublayers.push(block.context);
        }
        this.allSubscripts = this.allSubscripts_();
    }

    allSubscripts_() {
        var allSubscripts = [];
        for (var subscript of this.subscripts) {
            allSubscripts.push(subscript);
            allSubscripts = allSubscripts.concat(subscript.allSubscripts_());
        }
        return allSubscripts;
    }

    allBlocks() {
        let allBlocks = [];
        this.traverseBlocks(block => allBlocks.push(block));
        return allBlocks;
    }
    
    /// Recursively visits each block in a scrip and its subscripts,
    ///  noting at which level of nestedness it is in within control blocks of ones choosing.
    traverseBlocks(func, targetBlocks=null) {
        const parentBlocks = ['control_forever', 'control_if', 'control_if_else', 'control_repeat', 'control_repeat_until'];
        const traverse = (scripts, level) => {

            if (!is(scripts) || scripts === [[]]) return;
            for (let script of scripts) {
                for (let block of script.blocks) {
                    func(block, level);
                    if (parentBlocks.includes(block.opcode)) {
                        if (targetBlocks && !targetBlocks.includes(block.opcode)) {
                            traverse(block.subscripts, level);
                        } else {
                            traverse(block.subscripts, level + 1);
                        }
                    }

                }
            }
        }
        traverse([this], 1);
    }
}

/// Container class for Scratch targets (stages & sprites).
global.Target = class {
    constructor(target_, project) {
        this.project = project;
        this.context = new Context(project.context, false);
        Object.assign(this, target_);
        if (no(target_.blocks)) this.blocks = {};
        this.scripts = [];
        for (var block_ in this.blocks) {
            var block = new Block(target_, block_);
            this.blocks[block_] = block;
            if (!(block.prevBlock())) this.scripts.push(new Script(block, this));
        }
        for (var script of this.scripts) {
            this.context.sublayers.push(script.context);
        }
        this.validScripts = this.scripts.filter(script =>
            script.blocks.length > 1 && script.blocks[0].opcode.includes('event_when')
        );
    }
}

/// Container class for a whole project.
global.Project = class {
    constructor(json, items) {
        this.context = new Context(items, false);
        this.targets = [];
        this.sprites = [];
        this.scripts = [];
        for (var target_ of json.targets) {
            var target = new Target(target_, this);
            this.targets.push(target);
            if (!target_.isStage) this.sprites.push(target);
        }
        for (var target of this.targets) {
            this.scripts = this.scripts.concat(target.scripts);
            this.context.sublayers.push(target.context);
        }
    }
}

/// Identify which strand the project belongs to.
global.detectStrand = function(project, templates) {
    var strand = 'generic';
    /// Format for templates:
    /*
    var templates = {
        multicultural: require('./templates/events-L1-multicultural'),
        youthCulture:  require('./templates/events-L1-youth-culture'),
        gaming:        require('./templates/events-L1-gaming')
    };
    */
    try {
        var projectAssetIDs = [];
        for (var target of project.targets) {
            for (var costume of target.costumes) {
                projectAssetIDs.push(costume.assetId);
            }
            for (var sound of target.sounds) {
                projectAssetIDs.push(sound.assetId);
            }
        }
        var highScore = 0;
        for (var template in templates) {
            var templateFile = templates[template];
            var templateAssetIDs = [];
            for (var target of templateFile.targets) {
                for (var costume of target.costumes) {
                    templateAssetIDs.push(costume.assetId);
                }
                for (var sound of target.sounds) {
                    templateAssetIDs.push(sound.assetId);
                }
            }
            var templateScore = 0;
            for (var projectAssetID of projectAssetIDs) {
                if (templateAssetIDs.includes(projectAssetID)) {
                    templateScore++;
                }
                if (templateScore > highScore) {
                    strand = template;
                    highScore = templateScore;
                }
            }
        }
    }
    catch(err) {
        console.log(err);
    }
    return strand;
}

global.opcodeLists = {
    changeXY: [
        'motion_changexby',
        'motion_changeyby',
        'motion_movesteps',
        'motion_glidesecstoxy',
        'motion_glideto',
        'motion_goto',
        'motion_gotoxy',
        'motion_setx',
        'motion_sety'
    ],
    speak: [
        'looks_say',
        'looks_sayforsecs',
        'looks_think',
        'looks_thinkforsecs'
    ]
}
