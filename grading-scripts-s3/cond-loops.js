/* Conditional Loops Autograder
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

class GradeCondLoops {

    constructor() {
        this.requirements = {}
        this.extensions = {}
    }

    initReqs() {
        this.requirements.newCostume    = 
            {bool:false, str:'Chose a different car costume.'};
        this.requirements.carStop       =
            {bool:false, str:'Car stops at Libby, yellow line, white line, or purple line.'};
        this.requirements.saySomething  = 
            {bool:false, str:'Car says something.'};
        this.requirements.changeSpeed   = 
            {bool:false, str:'Changed car speed.'};

        this.extensions.otherSprites    =   
            {bool:false, str:'Other sprites perform actions.'};
        this.extensions.carSound        = 
            {bool:false, str:'Car makes a sound.'};
    }

    grade(fileObj, user) {
        this.initReqs()
        
        var car  = sb3.jsonToSpriteBlocks(fileObj, 'Car'); 
        this.checkCostume(fileObj); 
        this.checkStopandSay(car);
        this.checkSpeed(car);
        
        this.checkSound(car);
        var stop = sb3.jsonToSpriteBlocks(fileObj, 'Stop');
        this.checkSprites(stop);
        var darian = sb3.jsonToSpriteBlocks(fileObj, 'Darian');
        this.checkSprites(darian);
        var libby = sb3.jsonToSpriteBlocks(fileObj, 'Libby');
        this.checkSprites(libby);
        
    }

    /// Checks that a different costume was chosen for the Car sprite.
    checkCostume(fileObj) {
        var carinfo = sb3.returnSprite(fileObj, 'Car'); //find sprite object
        if(!carinfo) return;
        var curindex = carinfo['currentCostume']; //find index of current costume
        if(carinfo['costumes'][curindex]['name'] != 'Sedan'){ //checks to see if current costume was changed
            this.requirements.newCostume.bool = true;
        }
    }

    /// Checks that speed was changed (requirement).
    checkSpeed(car) {
        
        var waits = sb3.findBlockIDs(car, 'control_wait');
        
        for(i in waits){
            var duration = car[waits[i]]['inputs']['DURATION'][1][1]
            if(duration != '0.1'){
                this.requirements.changeSpeed.bool = true;
            }
        }
    }

    /// Checks for car sound (extension).
    checkSound(car) {
        var sound1 = sb3.findBlockIDs(car, 'sound_play')
        var sound2 = sb3.findBlockIDs(car, 'sound_playuntildone')
        
        if(sound1.length != 0 || sound2.length != 0){
            this.extensions.carSound.bool = true;
        }
    }

    /// Checks that other sprites perform actions (extension).
    checkSprites(sprite) {      
        var blocks = sb3.findBlockIDs(sprite, 'event_whenflagclicked');
        for(i in blocks){
            if(sprite[blocks[i]]['next'] != null){
                this.extensions.otherSprites.bool = true;
            }
        }
    }

    /// Check for stop condition (requirement).
    checkStopandSay(car) {
        var events_list = ['control_whenflagclicked', 'event_whenkeypressed','event_whenbroadcastreceived'];
        var speak_list = ['looks_say', 'looks_sayforsecs', 'looks_think', 'looks_thinkforsecs'];
        
        var repeats = sb3.findBlockIDs(car, 'control_repeat_until')
        
        for(i in repeats){
            
            //check stop
            var condition = car[repeats[i]]['inputs']['CONDITION'][1] //extract repeat until condition
            var condop = car[condition]['opcode'];
            if(condop == 'sensing_touchingobject'){
                var objkey = car[condition]['inputs']['TOUCHINGOBJECTMENU'][1] //extract key of object
                var obj = car[obj]['fields']['TOUCHINGOBJECTMENU'][0] //extract name of object
                if(obj == 'Libby'){
                    this.requirements.carStop.bool = true;
                }
            }
            else if(condop == 'sensing_touchingcolor'){
                var color = car[condition]['inputs']['COLOR'][1][1] //extract key of object
                if(color == '#ffd208' || color == '#a52cff' || color == '#ffffff'){ //purple, yellow, white line color
                    this.requirements.carStop.bool = true;
                }          
            }
            
            //check say
            var next = car[repeats[i]]['next'] //find next block after repeat_until block
            if(next != null){
                if(speak_list.includes(car[next]['opcode'])){
                    this.requirements.saySomething.bool = true;
                }
            }
        }

    }

}
module.exports = GradeCondLoops;