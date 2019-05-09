var sb3 = {
    //null checker
    no: function(x) { 
        return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
    },

    //retrieve a given sprite's blocks from JSON
    //note: doesn't check whether or not blocks are properly attached
    jsonToSpriteBlocks: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        var allBlocks={};
        var blocks={};
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i]['blocks'];
            }
        }
        return [];
    }, //done
    
    //retrieve a given sprite's info (not just blocks) from JSON
    jsonToSprite: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return [];
    }, //done
    
    //counts the number of non-background sprites in a project
    countSprites: function(json){
        if (this.no(json)) return false; //make sure script exists
        
        var numSprites = 0;
        var projInfo = json['targets'] //extract targets from JSON data
        
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['isStage'] == false){
                numSprites ++;
            }
        }
        return numSprites
    },
    
    //looks through json to see if a sprite with a given name is present
    //returns sprite
    returnSprite: function(json, spriteName){ 
        if (this.no(json)) return; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return ;
    }, //done
    
    //looks through json to see if a sprite with a given name is present
    //returns true if sprite with given name found
    findSprite: function(json, spriteName){ 
        if (this.no(json)) return false; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return true;
            }
        }
        return false;
    }, //done
    
    //returns list of block ids given a set of blocks
    findBlockIDs: function(blocks, opcode){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                blockids.push(block);
            }
        }
        return blockids;
    },
    
    //given particular key, returns list of block ids of a certain kind of key press given a set of blocks 
    findKeyPressID: function(blocks, key){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == 'event_whenkeypressed'){
                if(blocks[block]['fields']['KEY_OPTION'][0] == key){
                    blockids.push(block);
                }
            }
        }
        return blockids;
    },
    
    opcodeBlocks: function(script, myOpcode) { //retrieve blocks with a certain opcode from a script list of blocks
        if (this.no(script)) return [];
        
        var miniscript = [];

        for(block in script){
            if(script[block]['opcode'] == myOpcode){
                miniscript.push(script[block]);
            }
        }
        return miniscript;
    }, 
    
    opcode: function(block) { //retrives opcode from a block object 
        if (this.no(block)) return "";
        return block['opcode'];
    }, 
    
    countBlocks: function(blocks,opcode){ //counts number of blocks with a given opcode
        var total = 0;
		for(id in blocks){ 
            if([blocks][id]['opcode'] == opcode){
                total = total + 1;
            }
        }
        return total;
    }, //done
    
    //(recursive) helper function to extract blocks inside a given loop
    //works like makeScript except it only goes down the linked list (rather than down & up)
    loopExtract: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];

        //Find all blocks that come after
        curBlockID = blockID //Initialize with blockID of interest
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary                

            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.makeScript(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }     
        return script;        
    },
    
    //given list of blocks and a keyID of a block, return a script
    makeScript: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];
    
        //find all blocks that come before
        while(curBlockID != null){
            var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary 
            
            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            //parentInfo = blocks[parentID]
    		var opcode = curBlockInfo['opcode'];

            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
            if ((parentID == null) && !(event_opcodes.includes(opcode))){
                return [];
            }

            //Iterate: set parent to curBlock
            curBlockID = parentID
        }

        //find all blocks that come after
        curBlockID = blocks[blockID]['next']
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block

            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){                            
                        script.push(nested_blocks[b])
                    }
                }
            }
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            script.push(curBlockInfo); //Add the block itself to the script dictionary                
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }
        return script;
    }
};

/// Max White
class GradeTwoWaySyncL1 {

    constructor() {
        this.requirements = {};
    }

    grade(fileObj, user) {
        this.initMetrics();
        this.checkSync(fileObj);
    }

    initMetrics() {
        this.requirements = {
            isDialogueSynced: {
                bool: true, str: 'Text messages are correctly synchronized.'
            },
            areMessagesAdded: {
                bool: false, str: 'One additional text message has been added to each sprite.'
            }
        };
        this.extensions = {
            evenMoreMessages: {
                bool: false, str: 'Added more than one additional text message to each sprite.'
            },
            changedSounds: {
                bool: false, str: 'Changed the "boing" or "pop" sound to something else.'
            },
        }
    }

    checkSync(fileObj) {

        /// Find the relevant sprites for this project.
        var basketball = fileObj.targets.find(function(target) {
            return target.name === 'Basketball';
        });
        var rainbow = fileObj.targets.find(function(target) {
            return target.name === 'Rainbow';
        });
        if (basketball === undefined || rainbow === undefined) {
            /// TODO: Signal a mistake
            return;
        }

        /// Iterate through the basketball's scripts and note the times (in seconds) at which it speaks.
        var basketballTime = 0;
        var basketballThinkTimes = [];
        var blockIDs = sb3.findBlockIDs(basketball.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(basketball.blocks, blockID);
                basketballTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        basketballTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        basketballThinkTimes.push(basketballTime);
                        basketballTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// Do the same for the rainbow.
        var rainbowTime = 0;
        var rainbowThinkTimes = [];
        blockIDs = sb3.findBlockIDs(rainbow.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(rainbow.blocks, blockID);
                rainbowTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        rainbowTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        rainbowThinkTimes.push(rainbowTime);
                        rainbowTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// We can check now if enough (or extra) messages have been added.
        var basketballThoughts = basketballThinkTimes.length;
        var rainbowThoughts = rainbowThinkTimes.length;
        this.requirements.areMessagesAdded.bool = (basketballThoughts > 1) && (rainbowThoughts > 1);
        this.extensions.evenMoreMessages.bool = (basketballThoughts > 2) && (rainbowThoughts > 2);

        /// Now we can see if the dialogue is synced by comparing the thinkTime arrays. The basketball goes first.
        if (!basketballThoughts || !rainbowThoughts) this.requirements.isDialogueSynced.bool = false;
        for (var i = 0; i < basketballThoughts && i < rainbowThoughts; i++) {
            if (basketballThinkTimes[i] >= rainbowThinkTimes[i]) {
                this.requirements.isDialogueSynced.bool = false;
            }
        }

        /// Finally, we check if there are any sounds aside from 'boing' or 'pop.'
        var sprites = [basketball, rainbow];
        for (var sprite of sprites) {
            if (sprite.sounds != null) {
                for (var sound of sprite.sounds) {
                    if (sound.name !== 'boing' && sound.name !== 'pop') {
                        this.extensions.changedSounds.bool = true;
                    }
                }
            }
        }
    }
}

module.exports = GradeTwoWaySyncL1;