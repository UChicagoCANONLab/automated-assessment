/* Scratch Events Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Zachary Crenshaw Spring 2019

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

class GradeEvents {

    constructor() {
        this.requirements = {};
    }

    initReqs() {

        this.requirements.containsThreeSprites =    /// contains >= 3 sprites
            {bool:false, str:'Project has at least three sprites.'};
        /// Sprite 1 aka Left
        this.requirements.leftWhenClicked   =    /// sprite handles click
            {bool:false, str:'Sprite 1 handles click.'};
        this.requirements.leftGetsBigger    =    /// sprite grows...
            {bool:false, str:'Sprite 1 gets bigger.'};
        this.requirements.leftTalksTwice    =    /// then >= 2 say blocks...
            {bool:false, str:'Then Sprite 1 has at least two say blocks.'};
        this.requirements.leftResetsSize    =    /// then resets size
            {bool:false, str:'The Sprite 1 resets size.'};
        /// Sprite 2 aka middle
        this.requirements.middleWhenClicked   =    /// ditto
            {bool:false, str:'Sprite 2 handles click.'};
        this.requirements.middleGetsBigger    =
            {bool:false, str:'Sprite 2 gets bigger.'};
        this.requirements.middleTalksTwice    =
            {bool:false, str:'Then Sprite 2 has at least two say blocks.'};
        this.requirements.middleResetsSize    =
            {bool:false, str:'The Sprite 2 resets size.'};
        /// Sprite 3 aka right
        this.requirements.rightWhenClicked   =
            {bool:false, str:'Sprite 3 handles click.'};
        this.requirements.rightGetsBigger    =
            {bool:false, str:'Sprite 3 gets bigger.'};
        this.requirements.rightTalksTwice    =
        {bool:false, str:'Then Sprite 3 has at least two say blocks.'};
        this.requirements.rightResetsSize    = 
            {bool:false, str:'The Sprite 3 resets size.'};

    }

    grade(fileObj, user) {

        this.initReqs();
        
        //check number of sprites
        if(sb3.countSprites(fileObj) > 2){
            this.requirements.containsThreeSprites.bool = true; 
        }
        
        for(var i in fileObj['targets']){ //find sprite
            var sprite = fileObj['targets'][i]
            if(sprite['name'] == 'Right'){
                var right = sprite;
            }
            if(sprite['name'] == 'Middle'){
                var middle = sprite;
            }
            if(sprite['name'] == 'Left'){
                var left = sprite;
            }
        }
        
        //check Left sprite
        var leftid = sb3.findBlockID(left['blocks'], 'event_whenthisspriteclicked');
        if(leftid != null){
            this.requirements.leftWhenClicked.bool = true;
            var lefttalkcount = 0;
            var leftScript = sb3.makeScript(left['blocks'], leftid);
            for(var i in leftScript){
                //change size, case 1
                if(leftScript[i]['opcode'] == 'looks_changesizeby'){
                    console.log(leftScript[i]['inputs'])
                    if(leftScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.leftGetsBigger.bool = true;
                        var leftchange = leftScript[i]['inputs']['CHANGE'][1][1]
                       }
                }  
                //change size, case 2
                if(leftScript[i]['opcode'] == 'looks_setsizeto' && leftScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.leftGetsBigger.bool = true
                    var leftset = leftScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(leftScript[i]['opcode'] == 'looks_sayforsecs'){
                    lefttalkcount ++;
                    if(lefttalkcount >= 2){
                        this.requirements.leftTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(leftScript[i]['opcode'] == 'looks_changesizeby' && leftset != undefined && (leftset - leftScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.leftResetsSize.bool = true;
                }  
                //size reset, case 2
                if(leftScript[i]['opcode'] == 'looks_setsizeto' && leftchange != undefined && (leftchange - leftScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.leftResetsSize.bool = true
                } 
            }
        }
        
        //check Middle sprite
        var middleid = sb3.findBlockID(middle['blocks'], 'event_whenthisspriteclicked');
        if(middleid != null ){
            this.requirements.middleWhenClicked.bool = true;
            var middletalkcount = 0;
            var middleScript = sb3.makeScript(middle['blocks'], middleid);
            for(var i in middleScript){
                //change size, case 1
                if(middleScript[i]['opcode'] == 'looks_changesizeby'){
                    console.log(middleScript[i]['inputs'])
                    if(middleScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.middleGetsBigger.bool = true;
                        var middlechange = middleScript[i]['inputs']['CHANGE'][1][1]
                       }
                }  
                //change size, case 2
                if(middleScript[i]['opcode'] == 'looks_setsizeto' && middleScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.middleGetsBigger.bool = true
                    var middleset = middleScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(middleScript[i]['opcode'] == 'looks_sayforsecs'){
                    middletalkcount ++;
                    if(middletalkcount >= 2){
                        this.requirements.middleTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(middleScript[i]['opcode'] == 'looks_changesizeby' && middleset != undefined && (middleset - middleScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.middleResetsSize.bool = true;
                }  
                //size reset, case 2
                if(middleScript[i]['opcode'] == 'looks_setsizeto' && middlechange != undefined && (middlechange - middleScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.middleResetsSize.bool = true
                } 
            }
        }  
        
        //check Right sprite
        var rightid = sb3.findBlockID(right['blocks'], 'event_whenthisspriteclicked');
        if(rightid != null){
            this.requirements.rightWhenClicked.bool = true;
            var righttalkcount = 0;
            var rightScript = sb3.makeScript(right['blocks'], rightid);
            for(var i in rightScript){
                //change size, case 1
                if(rightScript[i]['opcode'] == 'looks_changesizeby'){
                    if(rightScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.rightGetsBigger.bool = true;
                        var rightchange = rightScript[i]['inputs']['CHANGE'][1][1]
                       }
                }  
                //change size, case 2
                if(rightScript[i]['opcode'] == 'looks_setsizeto' && rightScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.rightGetsBigger.bool = true
                    var rightset = rightScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(rightScript[i]['opcode'] == 'looks_sayforsecs'){
                    righttalkcount ++;
                    if(righttalkcount >= 2){
                        this.requirements.rightTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(rightScript[i]['opcode'] == 'looks_changesizeby' && rightset != undefined && (rightset - rightScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.rightResetsSize.bool = true;
                }  
                //size reset, case 2
                if(rightScript[i]['opcode'] == 'looks_setsizeto' && rightchange != undefined && (rightchange - rightScript[i]['inputs']['CHANGE'][1][1]) == 0){
                    this.requirements.rightResetsSize.bool = true
                } 
            }
        } 
    }
}

module.exports = GradeEvents;