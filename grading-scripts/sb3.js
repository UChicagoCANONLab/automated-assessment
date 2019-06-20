/// Scratch 3 helper functions

/// Returns true for null, undefined, and zero-length values.
global.isNo = function(x) { 
    return (x == null || x === {} || x === []);
}

/// Opposite of isNo().
global.is = function(x) {
    return !isNo(x);
}

/// Container class for Scratch blocks.
global.Block = class {
    constructor(target, block) {

    /// Object properties.
        Object.assign(this, block);
        this.target = target;

    /// Internal function that converts a block to a Block.
        toBlock = function(x) {
            return new Block(this.target, x);
        }

    /// Returns the next block in the script.
        nextBlock = function() {
            if (isNo(this.next)) return null;
            return this.toBlock(this.target.blocks[this.next]);
        }

    /// Returns the previous block in the script.
        prevBlock = function() {
            if (isNo(this.parent)) return null;
            return this.toBlock(this.target.blocks[this.parent]);
        }

    /// Returns the conditional statement of the block, if it exists.
        conditionBlock = function() {
            if (isNo(this.inputs.CONDITION[1])) return null;
            return this.toBlock(this.target.blocks[this.inputs.CONDITION[1]]);
        }

    /// Returns an array representing the script that contains the block.
        containingScript = function() {

        /// Steps to the beginning of the script.
            var indexer = this;
            var x = null;
            while (x = indexer.prevBlock()) indexer = x;

        /// Steps to the end while pushing the blocks to an array.
            var array = [];
            while (x = indexer.nextBlock()) {
                array.push(indexer);
                indexer = x;
            }
            return array;
        }

    /// Returns an array of arrays representing the subscripts of the block.
        subScript = function() {
            var array = [];
            if (is(this.inputs.SUBSTACK))  array.push(this.target.blocks[this.inputs.SUBSTACK ].containingScript());
            if (is(this.inputs.SUBSTACK2)) array.push(this.target.blocks[this.inputs.SUBSTACK2].containingScript());
            return array;
        }
    }
},

/// Container class for Scratch targets (stages & sprites).
global.Target = class {
    constructor(target) {
        Object.assign(this, target);
        if (isNo(this.blocks)) this.blocks = ['hello'];
        console.log(this.blocks[0]);
    }
}