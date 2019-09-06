/* Variables L1 Autograder
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

class GradeVariablesL1 {

    constructor() {
        this.requirements   = {};
        this.extensions     = {};
        this.help           = {};
    }

    initReqs() {
        this.requirements.calcPerimeter  = 
            {bool: false, str: 'Computer correctly calculates perimeter.'};
        this.requirements.printPerimeter =
            {bool: false, str: 'Computer outputs calculated perimeter.'};

        /*this.extensions.calcVolume      =
            {bool: false, str: 'Uses length, width, and height variables to calculate volume and then outputs it.'};*/
    }

    grade(fileObj, user) {
        this.initReqs(); 
        
        for(var i in fileObj['targets']){
            var sprite = fileObj['targets'][i]
            if(sprite['name'] == 'Ben'){
                var ben = sprite;
                this.checkBen(ben);
                return;
            }
        }
    }

    checkBen(ben){
        var benid = sb3.findBlockIDs(ben['blocks'], 'event_whenkeypressed');
        if(benid != null){
            var benScript = sb3.makeScript(ben['blocks'], benid);
            for(var i in benScript){
                if(benScript[i]['opcode'] == 'data_setvariableto'){
                    if(benScript[i]['fields']['VARIABLE'][0] == 'perimeter'){
                        var opId = benScript[i]['inputs']['VALUE'][1]
                        var opblock = ben['blocks'][opId]
                        //(2*h) + (2*w); (h + h) + (w +w) cases
                        if(opblock['opcode'] == 'operator_add'){
                            this.checkAdd(ben, opblock)
                        }
                        //(h + w) * 2 case
                        else if(opblock['opcode'] == 'operator_multiply'){
                            this.checkMult(ben, opblock)
                        }    
                    }
                }
                if(benScript[i]['opcode'] == 'looks_say' || benScript[i]['opcode'] == 'looks_sayforsecs'){
                    var id = benScript[i]['inputs']['MESSAGE']
                    var say = ben['blocks'][id[1]]
                    if(say != undefined){ 
                        if(say['opcode'] == 'operator_join'){
                            var msgs = [say['inputs']['STRING1'][1][1], say['inputs']['STRING2'][1][1]]
                            if(msgs.includes('perimeter')){
                                this.requirements.printPerimeter.bool = true
                            }
                        }
                    }
                }
            }
        }
    }
    
    
    checkMult(ben, opblock){
        var mult = [opblock['inputs']['NUM1'][1], opblock['inputs']['NUM2'][1]]
        var height = false
        var width = false
        
        if(mult[0][1] != undefined && mult[0][1] == '2'){
            if(ben['blocks'][mult[1]] != undefined && ben['blocks'][mult[1]]['opcode'] == 'operator_add'){
                var num1 = ben['blocks'][mult[1]]['inputs']['NUM1'][1][1]
                var num2 = ben['blocks'][mult[1]]['inputs']['NUM2'][1][1]
                if(num1 != undefined){
                    if(num1 == 'width'){
                        width = true
                    }
                    else if(num1 == 'height'){
                        height = true
                    }
                }
                if(num2 != undefined){
                    if(num2 == 'width'){
                        width = true
                    }
                    else if(num2 == 'height'){
                        height = true
                    }
                }
            }
        }
        else if(mult[1][1] != undefined && mult[1][1] == '2'){
            if(ben['blocks'][mult[0]] != undefined && ben['blocks'][mult[0]]['opcode'] == 'operator_add'){
                var num1 = ben['blocks'][mult[0]]['inputs']['NUM1'][1][1]
                var num2 = ben['blocks'][mult[0]]['inputs']['NUM2'][1][1]
                if(num1 != undefined){
                    if(num1 == 'width'){
                        width = true
                    }
                    else if(num1 == 'height'){
                        height = true
                    }
                }
                if(num2 != undefined){
                    if(num2 == 'width'){
                        width = true
                    }
                    else if(num2 == 'height'){
                        height = true
                    }
                }
            }
        }
        
        if(width && height){
            this.requirements.calcPerimeter.bool = true
        }

    }
    
    checkAdd(ben, opblock){
        var aID = opblock['inputs']['NUM1'][1]
        var a = ben['blocks'][aID]
        var bID = opblock['inputs']['NUM2'][1]
        var b = ben['blocks'][bID]
        
        if(!b || !a){
            return
        }
        
        var height = false;
        var width = false;
        
        if(a['opcode'] == 'operator_multiply'){  
            var amult = [a['inputs']['NUM1'][1][1], a['inputs']['NUM2'][1][1]]
            if(amult.includes('2') && amult.includes('height')){
                height = true
            }
            else if(amult.includes(2) && amult.includes('width')){
                width = true
            }
        }
        if(a['opcode'] == 'operator_add'){  
            var aadd = [a['inputs']['NUM1'][1][1], a['inputs']['NUM2'][1][1]]
            
            if(aadd[0] == 'height' && aadd[1] == 'height'){
                height = true
            }
            else if(aadd[0] == 'width' && aadd[1] == 'width'){
                width = true
            }

        }
        if(b['opcode'] == 'operator_multiply'){
            
            var bmult = [b['inputs']['NUM1'][1][1], b['inputs']['NUM2'][1][1]]
            
            if(bmult.includes('2') && bmult.includes('height')){
                height = true
            }
            else if(bmult.includes('2') && bmult.includes('width')){
                width = true
            }
             
        }
        if(b['opcode'] == 'operator_add'){  
            var badd = [b['inputs']['NUM1'][1][1], b['inputs']['NUM2'][1][1]]
            
            if(badd[0] == 'height' && badd[1] == 'height'){
                height = true
            }
            else if(badd[0] == 'width' && badd[1] == 'width'){
                width = true
            }

        }

        if(width && height){
            this.requirements.calcPerimeter.bool = true
        }

    }
}
        
module.exports = GradeVariablesL1;