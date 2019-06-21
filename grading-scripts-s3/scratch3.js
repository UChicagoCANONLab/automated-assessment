/// Scratch 3 helper functions

/// Returns false for null, undefined, and zero-length values.
global.is = function(x) { 
    return !(x == null || x === {} || x === []);
}

/// Container class for Scratch blocks.
global.Block = class {
    constructor(target, block) {
        Object.assign(this, target.blocks[block]);
        this.target = target;
    }

/// Internal function that converts a block to a Block.
    toBlock(x) {
        return new Block(this.target, x);
    }

/// Returns the next block in the script.
    nextBlock() {
        if (!is(this.next)) return null;
        
        return this.toBlock(this.next);
    }

/// Returns the previous block in the script.
    prevBlock() {
        if (!is(this.parent)) return null;

        return this.toBlock(this.parent);
    }

/// Returns the conditional statement of the block, if it exists.
    conditionBlock() {
        if (!is(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1]);
    }

/// Returns an array representing the script that contains the block.
    childBlocks() {     
        var array = [];
        var x = this;
        while (x) {
            array.push(x);
            x = x.nextBlock();
        }
        return array;
    }

/// Returns an array of arrays representing the subscripts of the block.
    subScripts() {
        if (!is(this.inputs)) return [];
        var array = [];

        if (is(this.inputs.SUBSTACK))  {

            array.push(new Script(this.toBlock(this.inputs.SUBSTACK[1])));
        }
        if (is(this.inputs.SUBSTACK2)) {

            array.push(new Script(this.toBlock(this.inputs.SUBSTACK2[1])));
        }
        return array;
    }
}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block) {
        this.blocks = block.childBlocks();
        this.target = block.target;
    }
}

/// Container class for Scratch targets (stages & sprites).
global.Target = class {
    constructor(target_) {
        Object.assign(this, target_);
        if (!is(target_.blocks)) this.blocks = {};
        this.scripts = [];
        for (var block_ in this.blocks) {
            var block = new Block(target_, block_);
            this.blocks[block_] = block;
            if (!is(block.prevBlock())) this.scripts.push(new Script(block));
        }
    }
}

/// Container class for a whole project.
global.Project = class {
    constructor(json) {
        this.targets = [];
        for (var target_ of json.targets) {
            this.targets.push(new Target(target_));
        }
    }
}