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
    
    typeBlocks: function(script, type) { //retrieve blocks of a   certain type from a script list of blocks
        if (this.no(script)) return {};
        
        var miniscript = {};

        for(block in script){
            if(script[block]['opcode'].includes(type)){
                miniscript[block] = block
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
            if(blocks[id]['opcode'] == opcode){
                total = total + 1;
            }
        }
        return total;
    }, //done
     
    countBlocksOfType: function(blocks,type){ //counts number of blocks with a given opcode
        var total = 0;
		for(id in blocks){ 
            if(blocks[id] != undefined && blocks[id]['opcode'].includes(type)){
                total = total + 1;
            }
        }
        return total;
    },
    
    //given list of blocks, return a script
    makeScript: function(blocks, blockID,getsub){
        if (this.no(blocks) || this.no(blockID)) return [];
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        
        var curBlockID = blockID;
        var script = {};
    
        //find blocks before
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
            
            if (getsub) {
                //if there is script nested inside, add them
                if (curBlockInfo['inputs']['SUBSTACK'] != undefined){
                    var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1]
                    var sub = sb3.addSubScript(blocks,firstChildID,script)
                    if (failedSub){
                        return{};
                    }

                }
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
            
            if (getsub) {
                //if there is script nested inside, add them
                if (curBlockInfo['inputs']['SUBSTACK'] != undefined){
                    var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1]
                    var failedSub = sb3.addSubScript(blocks,firstChildID,script)
                    if (failedSub){ //on failure to get subScript
                        return {};
                    }

                }
            }
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return {};
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        } 
        
        return script;
    },
    
    //adding nested script to the main script
    addSubScript: function(blocks_sub,blockID_sub, script) {
        if (this.no(blocks_sub) || this.no(blockID_sub)) {
            return true;
        }
        
        
        var curBlockID_sub = blockID_sub;
    
        //Find all blocks that come after
        curBlockID_sub = blockID_sub //Initialize with blockID of interest
        while(curBlockID_sub != null){
            var curBlockInfo_sub = blocks_sub[curBlockID_sub]; //Pull out info about the block
            script[curBlockID_sub]=curBlockInfo_sub; //Add the block itself to the script dictionary                
            //Get next info out
            nextID_sub = curBlockInfo_sub['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode_sub = curBlockInfo_sub['opcode'];
            
            //if there is script nested inside, add them
                if (curBlockInfo_sub['inputs']['SUBSTACK'] != undefined){
                    var firstChildID_sub = curBlockInfo_sub['inputs']['SUBSTACK'][1]
                    var failedSub_sub = sb3.addSubScript(blocks_sub,firstChildID_sub,script)
                    if (failedSub_sub){ //on failure to get subScript
                        return {};
                    }

                }
            
            
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return failure
            if((nextID_sub == null) && (event_opcodes.includes(opcode_sub))){
                return true;
            }
            //Iterate: Set next to curBlock
            curBlockID_sub = nextID_sub;
        }   
        return false;
    },
    
    checkAnimation: function(script) {
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy'];
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];
        
        var loop = false;
        var wait = false;
        var costume = false;
        var move = false;
        
        for(var i in script) {
            
            //check loop
            if (validLoops.includes(script[i]['opcode'])) {
                loop = true;
            }
            
            //check wait
            if ((script[i]['opcode']) == 'control_wait') {
                wait = true;
            }
            
            //check costume
            if (validCostumes.includes(script[i]['opcode'])) {
                costume = true;
            }
            
            //check move
            if (validMoves.includes(script[i]['opcode'])) {
                move = true;
            }
        }
        
        
        return (loop && wait && (costume || move));
        
    },
    
    gradeAnimation: function(script) {
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy'];
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];
        
        var loop = false;
        var wait = false;
        var costume = false;
        var move = false;
        
        var exts = false;
        
        //NEED TO ADD EXTS and MAKE ELIF
        
        for(var i in script) {
            
            //check loop
            if (validLoops.includes(script[i]['opcode'])) {
                loop = true;
            }
            
            //check wait
            if ((script[i]['opcode']) == 'control_wait') {
                wait = true;
            }
            
            //check costume
            if (validCostumes.includes(script[i]['opcode'])) {
                costume = true;
            }
            
            //check move
            if (validMoves.includes(script[i]['opcode'])) {
                move = true;
            }
        }
        
        var reqs = [loop,moveRight,moveLeft,costume,wait];
        
        var isAnimated = (loop && wait && (costume || move))
        
        var report = [isAnimated,reqs,exts];
        
        return report;
        
    }
};

//SPRITE CLASS –––––––––––

class Sprite {
    
    constructor(name) {
        this.name = name; 
        this.scripts = [];
        
        this.animated = false;
        
        //requirements:
        //members of array in this order:
        //costume change, move left, move right, repeat loop, wait blocks
        this.reqs = [false,false,false,false,false]
        
        //extensions:
        //checks for any extension
        this.exts = false;
        
        
        //NOTE: need to add ability for extensions
    }
    
    getScore() {
        var score = 0;
        for (var i = 0; i< 4; i++) {
            if(reqs[i]) {
                score++;
            }
        }
        
        return score;
    }
    
    getScripts() {
        return this.scripts;
    }
    
    getScript(i) {
        return this.scripts[i];
    }
    
    addScript(script) {
        this.scripts.push(script);
    }
    
    
    
}

// MAIN GRADER CLASS –––––––––––––––


class GradeAnimation{
    
    constructor() {
        this.requirements = {};
        this.extensions = {};
        
        this.event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
    }
    
    initReqs() {
        this.requirements.HaveBackdrop = {bool: false, str: "Background has an image."};
        
    }
    
    initExts() {
        
    }
    
    grade(fileObj,user) {
        
        this.initReqs();
        this.initExts();
        
        //count and create sprites
        if (sb3.no(fileObj)) return; //make sure script exists
        
        var Sprites = [];
        
        var projInfo = fileObj['targets'] //extract targets from JSON data
        
        for(var i=0; i <projInfo.length; i++){
            if(!projInfo[i]['isStage']){
                var addMe = new Sprite(projInfo[i]['name']);
                Sprites.push(addMe);
                for (var e = 0; e < this.event_opcodes.length; e++) {
                    var event = this.event_opcodes[e]
                    var ID = sb3.findBlockID(projInfo[i]['blocks'],event);
                    if (ID != null) {
                        var newScript = sb3.makeScript(projInfo[i]['blocks'], ID,true);
                        if (newScript != null) {
                            addMe.addScript(newScript);
                        }
                    }
                }
            } else { //if it is the stage
                if (projInfo[i]['costumes'].length > 1) {
                    this.requirements.HaveBackdrop.bool = true;
                }
            }
        }
        
    
    }
    
    

    
}
module.exports = GradeAnimation;