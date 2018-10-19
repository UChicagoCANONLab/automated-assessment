var sb2 = {

    /// Returns true if the input is null, undefined, or empty.
    no: function(x) {
        return (x == null || x.length === 0);
    },

    /// Returns an array of the blocks in a script.
    blocks: function(script) {
        if (this.no(script)) return [];
        return script[2];
    },

    /// Returns the opcode of a block.
    opcode: function(block) {
        if (this.no(block)) return "";
        return block[0];
    },

    /// Returns the first block in a script's opcode.
    hatCode: function(script) {
        return this.opcode(this.blocks(script)[0]);
    },

    /// Returns an array containing the subset of a sprite's scripts with a given event.
    eventScripts: function(sprite, myEvent) {
        if (this.no(sprite)) return [];
        return sprite.scripts.filter(script => this.hatCode(script) === myEvent);
    },

    /// Returns an array containing the subset of a scripts's blocks with a given opcode.
    opcodeBlocks: function(script, myOpcode) {
        if (this.no(this.blocks(script))) return [];
        return this.blocks(script).filter(block => this.opcode(block) === myOpcode);
    },

    /// Returns true if a script contains a certain block, and false otherwise.
    scriptContains: function(script, myOpcode) {
        if (this.no(this.blocks(script))) return false;
        return this.blocks(script).some(block => this.opcode(block) === myOpcode);
    },

}

exports = sb2;