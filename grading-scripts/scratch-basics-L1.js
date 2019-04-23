/// Scratch Basics autograder.


var sb3 = {
    no: function(x) { //null checker
        return (x == null || x.length === 0);
    },

    jsonToSpriteBlocks: function(json, spriteName) { //retrieve a given sprite's blocks from JSON
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
    
    findSprite: function(json, spriteName){ //returns true if sprite with given name found
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
    
    findBlockID: function(blocks, opcode){
        if(this.no(blocks)) return null;
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                return block;
            }
        }
        return ;
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
    
    //given list of blocks, return a script
    makeScript: function(blocks, blockID){
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        
        var curBlockID = blockID;
        var script = {};
    
        while(curBlockID != null){
            var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script[curBlockID]=curBlockInfo; //Add the block itself to the script dictionary DEBUG PUSH SITUATION

            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            //parentInfo = blocks[parentID]
    		var opcode = curBlockInfo['opcode'];

            //If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
            if ((parentID == null) && !(event_opcodes.includes(opcode))){
                return [];
            }

            //Iterate: set parent to curBlock
            curBlockID = parentID

            //Find all blocks that come after
    	    curBlockID = blockID //Initialize with blockID of interest
            while(curBlockID != null){
                curBlockInfo = blocks[curBlockID]; //Pull out info about the block
        		script[curBlockID]=curBlockInfo; //Add the block itself to the script dictionary                
            

                //Get next info out
    		    nextID = curBlockInfo['next']; //Block that comes after has key 'next'
                //nextInfo = blocks[nextID]
                opcode = curBlockInfo['opcode'];
		
                //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
                if((nextID == null) && (event_opcodes.includes(opcode))){
                    return {};
                }
                //Iterate: Set next to curBlock
                curBlockID = nextID;
            }     
        return script;
        }
    }
};

class GradeScratchBasicsL1 {

    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    grade(fileObj, user) { //call to grade project //fileobj is 
        this.initMetrics();
        
        var fred  = sb3.jsonToSpriteBlocks(fileObj, 'Fred'); 
        var helen = sb3.jsonToSpriteBlocks(fileObj, 'Helen');
        this.checkFred(fred);
        this.checkHelen(helen);
        
        this.checkExtensions(fileObj);
    }

    initMetrics() { //initialize all metrics to false
        this.requirements = {
            changedSteps: {
                bool: false, str: 'Fred takes 100 steps each time he talks instead of 50.'
            },
            fredTalks: {
                bool: false, str: 'Fred says "Have fun!" to the user.'
            },
            timeChanged: {
                bool: false, str: 'Changed time between Helen\'s costume changes.'
            }
        };
        this.extensions = {
            newSprite: {
                bool: false, str: 'Added a new sprite.'
            },
            newBlocks: {
                bool: false, str: 'Added new types of blocks to the project.'
            }
        };   
    }

    checkFred(fred) {
        if (!fred) return;
        var moveBlocks = sb3.opcodeBlocks(fred, 'motion_movesteps')
        for(block in moveBlocks){
            if(moveBlocks[block]['inputs']['STEPS'][1][1] == 100){
            this.requirements.changedSteps.bool = true
            }
        }
        for (var block of sb3.opcodeBlocks(fred, 'looks_sayforsecs')) {
            if(block){
                if (block['inputs']['MESSAGE'][1][1]  == 'Have fun!'){ //extract the 'Have fun!' message
                    this.requirements.fredTalks.bool = true;
                    return
                }   
            }
        }
    }

    checkHelen(helen) {
       if (!helen) return;
        for(var block of sb3.opcodeBlocks(helen, 'control_wait')){
            if(block['inputs']['DURATION'][1][1] > 1)
                this.requirements.timeChanged.bool = true
                return
        }   
    }

    checkExtensions(fileObj) {
        if (sb3.countSprites(fileObj) > 2) this.extensions.newSprite.bool = true;
        var defaultOpcodes = [
            'event_whenflagclicked',
            'motion_goto',
            'motion_movesteps', 
            'looks_sayforsecs', 
            'event_whenkeypressed',
            'looks_switchcostumeto', 
            'control_repeat', 
            'event_whenthisspriteclicked'
        ];
        var defaultNames = [
            'Fred',
            'Helen'
        ];
        
        for(i=0; i < fileObj['targets'].length; i++){
            if(!defaultNames.includes(fileObj['targets'][i]['name'])) {
                this.extensions.newSprite.bool = true;
            }
            var spriteBlocks = sb3.jsonToSpriteBlocks(fileObj, fileObj['targets'][i]['name'])
            for(block in spriteBlocks){
                if(!defaultOpcodes.includes(spriteBlocks[block]['opcode'])){
                    this.extensions.newBlocks.bool = true;
                }
            }
        }
    }
}
<<<<<<< HEAD

=======
>>>>>>> 0633196a4b3d2fa9ea2e80c1eac5f26a7c4d43ca
module.exports = GradeScratchBasicsL1;