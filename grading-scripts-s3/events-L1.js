/// Grader for Events.Multicultural.L1
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
    
    countScripts: function(blocks,type){ //counts valid scripts of a certain type
        var count = 0;
        for (i in blocks){
            if(blocks[i]['opcode'].includes(type) && !this.no(blocks[i]['next'])){
                    count = count + 1;
            }
        }
        return count;
        
    },
    
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
    },
    
    between: function(x, a, b) {
        if (x == undefined) {
            return false;
        }
        if (x >= a && x <= b) {
            return true;
        }
        return false;
    }
};

class GradeEvents {

    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {

        this.requirements.containsThreeSprites =    /// contains >= 3 sprites
            {bool:false, str:'Project has at least three sprites.'};
        /// Sprite 1 aka Left
        this.requirements.leftWhenClicked   =    /// sprite handles click
            {bool:false, str:'Left Sprite handles click.'};
        this.requirements.leftGetsBigger    =    /// sprite grows...
            {bool:false, str:'Left Sprite gets bigger.'};
        this.requirements.leftTalksTwice    =    /// then >= 2 say blocks...
            {bool:false, str:'Then Left Sprite has at least two say blocks.'};
        this.requirements.leftResetsSize    =    /// then resets size
            {bool:false, str:'The Left Sprite resets size.'};
        /// Sprite 2 aka middle
        this.requirements.middleWhenClicked   =    /// ditto
            {bool:false, str:'Middle Sprite handles click.'};
        this.requirements.middleGetsBigger    =
            {bool:false, str:'Middle Sprite gets bigger.'};
        this.requirements.middleTalksTwice    =
            {bool:false, str:'Then Middle Sprite has at least two say blocks.'};
        this.requirements.middleResetsSize    =
            {bool:false, str:'The Middle Sprite resets size.'};
        /// Sprite 3 aka right
        this.requirements.rightWhenClicked   =
            {bool:false, str:'Right Sprite handles click.'};
        this.requirements.rightGetsBigger    =
            {bool:false, str:'Right Sprite gets bigger.'};
        this.requirements.rightTalksTwice    =
        {bool:false, str:'Then Right Sprite has at least two say blocks.'};
        this.requirements.rightResetsSize    = 
            {bool:false, str:'The Right Sprite resets size.'};

    }
    
    initExts() {
        
        this.extensions.LeftNameDiff = {bool: false, str:'Left sprite has new name.'};
        this.extensions.MiddleNameDiff = {bool: false, str:'Middle sprite has new name.'};
        this.extensions.RightNameDiff = {bool: false, str:'Right sprite has new name.'};
        
        this.extensions.TurnAndWait = {bool: false, str:'Left Sprite spins using turn and wait blocks.'}
        this.extensions.AddEvent = {bool: false, str: 'A Sprite reacts to another event.'}
    }
    
    grade(fileObj, user) {

        this.initReqs();
        
        this.initExts();
      
        
        var left = null;
        var middle = null;
        var right = null;
        
        var turn = false;
        var wait = false;
    
        
        //check number of sprites
        if(sb3.countSprites(fileObj) > 2){
            this.requirements.containsThreeSprites.bool = true; 
        }
    
        //left in for debugging (and the log statements in the next loop)
       /*for(var i in fileObj['targets']){
            var sprite = fileObj['targets'][i];
           console.log(sprite['name'] + "  " + sprite['x'])
       } */
        
        //find sprite by position
        for(var i in fileObj['targets']){
            var sprite = fileObj['targets'][i];
            if (sb3.between(sprite['x'],60,80)){
                right = sprite;
                //console.log("Found right " + right['name'] + " x: " + sprite['x'])
            }
            else if (sb3.between(sprite['x'],-80,-60)){
                left = sprite;
                //console.log("Found left " + left['name'] + " x: " + sprite['x'])
            }
            else if (sb3.between(sprite['x'],-5,25)){
                middle = sprite;
                //console.log("Found middle " + middle['name'] + " x: " + sprite['x'])
            }
        }
        
        /* find sprite by name
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
        */
        
        //check Left sprite
        var leftid = sb3.findBlockID(left['blocks'], 'event_whenthisspriteclicked');
        if(leftid != null){
            var leftchange = null
            this.requirements.leftWhenClicked.bool = true;
            var lefttalkcount = 0;
            var leftScript = sb3.makeScript(left['blocks'], leftid);
            for(var i in leftScript){
                //change size, case 1
                if(leftScript[i]['opcode'] == 'looks_changesizeby'){
                    if(leftScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.leftGetsBigger.bool = true;
                        leftchange = leftScript[i]['inputs']['CHANGE'][1][1]
                    }
                }  
                //change size, case 2
                if(leftScript[i]['opcode'] == 'looks_setsizeto' && leftScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.leftGetsBigger.bool = true
                    leftchange = leftScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(leftScript[i]['opcode'] == 'looks_sayforsecs'){
                    lefttalkcount ++;
                    if(lefttalkcount >= 2){
                        this.requirements.leftTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(leftScript[i]['opcode'] == 'looks_changesizeby' && leftchange != null && (leftScript[i]['inputs']['CHANGE'][1][1]) == -leftchange){
                    this.requirements.leftResetsSize.bool = true;
                
                }
                //check for turn block
                if(leftScript[i]['opcode'].includes('motion_turn')){
                    turn = true;
                }
                //check for wait block
                if(leftScript[i]['opcode'] == 'control_wait'){
                    wait = true;
                }   
            }
            
            //check extensions –––––––––
            
            //check for turn and wait blocks
            if (turn && wait) {
                this.extensions.TurnAndWait.bool = true;
            }
            
            
            //check name different
            if (left['name'] != "Left") {
                this.extensions.LeftNameDiff.bool = true;
            }
         
            //check if add event
            if (sb3.countScripts(left['blocks'],'event') > 2) {
                this.extensions.AddEvent.bool = true;
            }
            
        }
        
        
        //check Middle sprite
        var middleid = sb3.findBlockID(middle['blocks'], 'event_whenthisspriteclicked');
        if(middleid != null){
            var middlechange = null
            this.requirements.middleWhenClicked.bool = true;
            var middletalkcount = 0;
            var middleScript = sb3.makeScript(middle['blocks'], middleid);
            for(var i in middleScript){
                //change size, case 1
                if(middleScript[i]['opcode'] == 'looks_changesizeby'){
                    if(middleScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.middleGetsBigger.bool = true;
                        middlechange = middleScript[i]['inputs']['CHANGE'][1][1]
                    }
                }  
                //change size, case 2
                if(middleScript[i]['opcode'] == 'looks_setsizeto' && middleScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.middleGetsBigger.bool = true
                    middlechange = middleScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(middleScript[i]['opcode'] == 'looks_sayforsecs'){
                    middletalkcount ++;
                    if(middletalkcount >= 2){
                        this.requirements.middleTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(middleScript[i]['opcode'] == 'looks_changesizeby' && middlechange != null && (middleScript[i]['inputs']['CHANGE'][1][1]) == -middlechange){
                    this.requirements.middleResetsSize.bool = true;
                
                }
            }
            //check extensions -------
            
            //check name different
            if (middle['name'] != "Middle") {
                this.extensions.MiddleNameDiff.bool = true;
            }
            
            //check if add event
            if (sb3.countScripts(middle['blocks'],'event') > 2) {
                this.extensions.AddEvent.bool = true;
            }
        }
        
        
        //check Right sprite
        var rightid = sb3.findBlockID(right['blocks'], 'event_whenthisspriteclicked');
        if(rightid != null){
            var rightchange = null
            this.requirements.rightWhenClicked.bool = true;
            var righttalkcount = 0;
            var rightScript = sb3.makeScript(right['blocks'], rightid);
            for(var i in rightScript){
                //change size, case 1
                if(rightScript[i]['opcode'] == 'looks_changesizeby'){
                    if(rightScript[i]['inputs']['CHANGE'][1][1] >= 1 ){
                        this.requirements.rightGetsBigger.bool = true;
                        rightchange = rightScript[i]['inputs']['CHANGE'][1][1]
                    }
                }  
                //change size, case 2
                if(rightScript[i]['opcode'] == 'looks_setsizeto' && rightScript[i]['inputs']['CHANGE'][1][1] >= 100 ){
                    this.requirements.rightGetsBigger.bool = true
                    rightchange = rightScript[i]['inputs']['CHANGE'][1][1]
                } 
                //talks twice
                if(rightScript[i]['opcode'] == 'looks_sayforsecs'){
                    righttalkcount ++;
                    if(righttalkcount >= 2){
                        this.requirements.rightTalksTwice.bool = true;
                    }
                }
                //size reset, case 1
                if(rightScript[i]['opcode'] == 'looks_changesizeby' && rightchange != null && (rightScript[i]['inputs']['CHANGE'][1][1]) == -rightchange){
                    this.requirements.rightResetsSize.bool = true;
                
                }
            }
            //check extensions –––––
            
        
            //check name different
            if (right['name'] != "Right") {
                this.extensions.RightNameDiff.bool = true;
            }
            
            //check if add event    
            if (sb3.countScripts(right['blocks'],'event') > 2) {
                this.extensions.AddEvent.bool = true;
            }
        }
  
    }
}

module.exports = GradeEvents;

