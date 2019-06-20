/// Scratch 3 helper functions

/* Hierarchy:

Project project {
    ...
    Array targets [
        ...
        Target target {
            ...
            Script script {
                ...
                Array blocks [
                    ...
                    Block block {
                        Internals
                        Array subscripts [
                            ...
                            Script script {
                                ...
                            }
                        ]

Types required:
Project
Script
Block

*/

/// Returns false for null, undefined, and zero-length values.
global.is = function(x) { 
    return !(x == null || x === {} || x === []);
}

global.isEmpty = function(x) {
    return (x === [] || x === {});
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
        return this.toBlock(this.target.blocks[this.next]);
    }

/// Returns the previous block in the script.
    prevBlock() {
        if (!is(this.parent)) return null;
        return this.toBlock(this.target.blocks[this.parent]);
    }

/// Returns the conditional statement of the block, if it exists.
    conditionBlock() {
        if (!is(this.inputs.CONDITION[1])) return null;
        return this.toBlock(this.target.blocks[this.inputs.CONDITION[1]]);
    }

/// Returns an array representing the script that contains the block.
    containingArray() {

    /// Steps to the beginning of the script.
        var indexer = this, x = this;
        while (x) {
            indexer = x;
            x = indexer.prevBlock();
        }

    /// Steps to the end while pushing the blocks to an array.
        var array = [];
        x = indexer;
        while (x) {
            //console.log(indexer);
            array.push(indexer);
            indexer = x;
            x = indexer.nextBlock();
        }
        return array;
    }

/// Returns an array of arrays representing the subscripts of the block.
    subScripts() {
        if (!is(this.inputs)) return [];
        var array = [];
        if (is(this.inputs.SUBSTACK))  array.push(new Script(this.target.blocks[this.inputs.SUBSTACK ]));
        if (is(this.inputs.SUBSTACK2)) array.push(new Script(this.target.blocks[this.inputs.SUBSTACK2]));
        return array;
    }
}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block) {
        this.blocks = block.containingArray();
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
            var block = new Block(target_, block_)
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