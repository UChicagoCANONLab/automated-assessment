/* Scratch Basics L2 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
*/

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
    findKeyPressIDs: function(blocks, key){
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
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
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
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
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
class GradeScratchBasicsL2 {

    constructor() {
        this.requirements = {};
        this.extensions   = {};
    }

    init() {
        this.requirements = {
            changedBackdrop:
                {bool: false, str: 'Added a new backdrop.'},
            pickedSprite:
                {bool: false, str: 'Added a new sprite to the project.'},
            greenFlag:
                {bool: false, str: 'Created a script starting with the "when green flag clicked" block.'},
            goTo:
                {bool: false, str: 'Script uses the "go to x:_ y:_" block.'},
            say:
                {bool: false, str: 'Script uses the "say _ for _ secs" blocks.'},
            move:
                {bool: false, str: 'Script uses the "move _ steps" block.'}
        }
        this.extensions = {
            secondEvent:
                {bool: false, str: 'Added another script using the "when sprite clicked" or "when key pressed" event.'},
            newBlocks:
                {bool: false, str: 'Project includes new blocks you haven\'t used before.'},
            secondSprite:
                {bool: false, str: 'Added a second sprite with its own scripts.'}
        }
    }

    grade(fileObj, user) {
        this.init();
        this.checkBackdrop(fileObj); // changedBackdrop
        this.checkSprite(fileObj);   // pickedSprite
        this.checkScripts(fileObj);  // greenFlag, goTo, say, move, secondEvent, newBlocks, secondSprite
    }

    checkBackdrop(fileObj) {
        if(sb3.jsonToSpriteBlocks(fileObj, 'Stage')){ //if backdrop found
            var backdrop = sb3.jsonToSprite(fileObj, 'Stage')
            var currCostumeIndex = backdrop['currentCostume']
            var currCostume = backdrop['costumes'][currCostumeIndex]
            if(currCostume['name'] == 'backdrop1'){
                return;
            }
        }
        this.requirements.changedBackdrop.bool = true;
    }

    checkSprite(fileObj) {
        var num_sprites = 0;
        for(var i in fileObj['targets']){
            var sprite = fileObj['targets'][i];
            if(sprite['isStage'] == false){ //only check sprites if they aren't a backdrop
                num_sprites++
                var curr_costume_index = sprite['currentCostume']
                var curr_costume = sprite['costumes'][curr_costume_index]['name']
                if(curr_costume != 'costume1' && curr_costume != 'backdrop1'){ //if student just added a new costume to the default sprite
                    this.requirements.pickedSprite.bool = true;
                }
                if(num_sprites > 1){
                    this.requirements.pickedSprite.bool = true;
                }
            }
        }                
    }

    checkScripts(fileObj) {
        var defaultOpcodes = [
            'event_whenflagclicked',
            'motion_gotoxy', 
            'motion_movesteps',
            'looks_sayforsecs', 
            'event_whenkeypressed', 
            'looks_switchcostumeto', 
            'control_repeat', 
            'event_whenthisspriteclicked' 
        ];
        
        var event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        
        var spritesWithScripts = 0;
        
        for(var i in fileObj['targets']){ //for each sprite
            var sprite = fileObj['targets'][i]
            
            if((sprite['isStage'] == false)){ //if sprite not a backdrop
                spritesWithScripts ++;
                for(var opcodenum in event_opcodes){ //for each opcode
                    var ids = sb3.findBlockIDs(sprite['blocks'], event_opcodes[opcodenum]);
                    for(var id in ids){
                        if(id != null){ //if opcode found
                            var script = sb3.makeScript(sprite['blocks'], ids[id]); //make script
                            var sayCount = 0;

                            for (var key in script) {

                                if('event_whenflagclicked' == script[key]['opcode']){
                                    this.requirements.greenFlag.bool = true;
                                }
                                if('motion_gotoxy' == script[key]['opcode']){
                                    this.requirements.goTo.bool  = true;
                                }
                                if('motion_movesteps' == script[key]['opcode']){
                                    this.requirements.move.bool  = true;                               
                                }
                                if (script[key]['opcode'] === 'looks_sayforsecs'){
                                    this.requirements.say.bool = true;                                  
                                }
                                if(('event_whenthisspriteclicked' == script[key]['opcode']  || 'event_whenkeypressed' == script[key]['opcode']) && script.length > 1){
                                    this.extensions.secondEvent.bool = true;                              
                                }
                                for(var opcodeID in defaultOpcodes){
                                    if(defaultOpcodes[opcodeID] != script[key]['opcode']){
                                        this.extensions.newBlocks.bool = true;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        this.extensions.secondSprite.bool = (spritesWithScripts > 1);
        }
    }
}
module.exports = GradeScratchBasicsL2;