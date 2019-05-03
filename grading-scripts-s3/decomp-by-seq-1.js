var sb3 = {
    no: function(x) { //null checker
        return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
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
    
    jsonToSprite: function(json, spriteName) { //retrieve a given sprite's blocks from JSON
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
        if(this.no(blocks) || blocks == {}) return null;
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                return block;
            }
        }
        return null;
    },
    
    findKeyPressID: function(blocks, key){
        if(this.no(blocks) || blocks == {}) return null;
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == 'event_whenkeypressed'){
                if(blocks[block]['fields']['KEY_OPTION'][0] == key){
                    return block;
                }
            }
        }
        return null;
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
        if (this.no(blocks) || this.no(blockID)) return [];
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
        }
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
};
class GradeDecompBySeq {
  /*
  this.strings includes short one sentence descriptions of each of the requirements in order.
  Here are longer descriptions for each requirement and what the specifically do:

  1. JaimeToBall
    -There is a "repeat until touching Soccer Ball" loop block.

  2. JaimeAnimated
    -Inside the "repeat until" block, Jaime uses "move" blocks to animate movement.
    -Jaime is pointing towards the Soccer Ball when he moves
    -Jaime doesn't make any direct movements using "go to x: y:", "go to mouse",
    or "glide" blocks

  3. ballStayStill
    -A "wait until touching Jaime" block exists before the balls starts moving
    towards the goal.

  4. ballToGoal
    -There is a "repeat until touching Goal" loop block.

  5. ballAnimated
    -Inside the "repeat until" block, the ball uses "move" blocks to move.
    -The ball is pointing towards the goal when he moves.
    -The ball doesn't make any direct movements using "go to x: y:", "go to
    mouse", or "glide" blocks.
  */

    constructor() {
      this.requirements = {};
    }

    initReqs() {
      this.requirements.JaimeToBall = 
        {bool:false, str:'Jaime uses the "repeat until" block to do an action until it touches the Soccer Ball.'};
      this.requirements.JaimeAnimated =
        {bool:false, str:'Jaime is animated correctly to move towards the Soccer Ball.'};
      this.requirements.ballStayStill =
        {bool:false, str:'Soccer Ball uses the "wait until" to wait until Jaime touches it.'};
      this.requirements.ballToGoal =
        {bool:false, str:'Soccer Ball uses the "repeat until" block to do an action until it touches the Goal.'};
      this.requirements.ballAnimated = 
        {bool:false, str:'Soccer Ball is animated correctly to move towards the Goal.'};
    }


    grade(fileObj, user){
      this.initReqs();

        //Check that project has at least one sprite/variable to check
        var jaime = null;
        var ball = null;
        var goal = null;
        for(var i in fileObj['targets']){ //find sprite
            var sprite = fileObj['targets'][i]
            if(sprite['name'] === 'Jaime '){
                jaime = sprite;
            }
            if(sprite['name'] === 'Soccer Ball'){
                ball = sprite;
            }
            if(sprite['name'] === 'Goal'){
                goal = sprite;
            }
        }
        
        //check jaime
        if (jaime) {
            var jaimeid = sb3.findBlockID(jaime['blocks'], 'event_whenflagclicked');
            if(jaimeid != null){
                var jaimeScript = sb3.makeScript(jaime['blocks'], jaimeid);
                for(var i in jaimeScript){
                    if(jaimeScript[i]['opcode'] == 'control_repeat_until'){
                        this.requirements.JaimeToBall.bool = true;
                    }
                }
            }
        }

            
        //check ball
        if (ball) {
            var ballid = sb3.findBlockID(ball['blocks'], 'event_whenflagclicked');
            if(ballid != null){
                var ballScript = sb3.makeScript(ball['blocks'], ballid);
                for(var i in ballScript){
                    if(ballScript[i]['opcode'] == 'control_wait_until'){
                        var condition = ballScript[i]['inputs']['CONDITION'][1]
                        if(ball['blocks'][condition]['opcode'] == 'sensing_touchingobject'){
                            var object = ball['blocks'][condition]['inputs']['TOUCHINGOBJECTMENU'][1]
                            var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(objname == 'Jaime '){
                                this.requirements.ballStayStill.bool = true;
                            }
                        }
                    }
                    if(ballScript[i]['opcode'] == 'control_repeat_until' ){
                        var condition = ballScript[i]['inputs']['CONDITION'][1]
                        if(ball['blocks'][condition]['opcode'] == 'sensing_touchingobject'){
                            var object = ball['blocks'][condition]['inputs']['TOUCHINGOBJECTMENU'][1]
                            var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(objname == 'Goal'){
                                this.requirements.ballToGoal.bool = true;
                            }
                        }
                    }
                }
            }
        }

        console.log(this.requirements)
    }
    
}
module.exports = GradeDecompBySeq;