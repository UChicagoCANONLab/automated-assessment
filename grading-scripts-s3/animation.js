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
            
            //if there is script nested inside, add them
            if (curBlockInfo['inputs']['SUBSTACK'] != undefined){
                var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1]
                var sub = sb3.addSubScript(blocks,firstChildID,script)
                if (sub == 0){
                    return [];
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
            
            //if there is script nested inside, add them
            if (curBlockInfo['inputs']['SUBSTACK'] != undefined){
                var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1]
                var sub = sb3.addSubScript(blocks,firstChildID,script)
                if (sub == 0){
                    return [];
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
    addSubScript: function(blocks,blockID, script) {
        if (this.no(blocks) || this.no(blockID)) return 0;
        
        
        var curBlockID = blockID;
    
        //Find all blocks that come after
        curBlockID = blockID //Initialize with blockID of interest
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script[curBlockID]=curBlockInfo; //Add the block itself to the script dictionary                
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return failure
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return 0;
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }   
        return 1;
    } 
};

class GradeAnimation {

    constructor() {
        this.requirements = {};
        this.extensions = {}
    }

    initReqs() {
        //checks for initial position
        this.requirements.goodStartPosition = {bool: false, str: 'Bee starts at the beginning of the track.'};
        // checks for non-moving animation
        this.requirements.handlesDownArrow = {bool:false, str:'Bee handles down arrow.'};
        this.requirements.downArrowCostumeChange = {bool:false, str:'Bee changes costume on down arrow.'};
        this.requirements.downArrowWaitBlock = {bool:false, str:'Bee wait block on down arrow.'};
        // checks for moving animation
        this.requirements.handlesSpaceBar = {bool:false, str:'Bee handles space bar.'};;
        this.requirements.spaceBarLoop = {bool:false, str:'Bee loop on space bar.'};;
        this.requirements.spaceBarMovement = {bool:false, str:'Bee moves on space bar.'};;
        this.requirements.spaceBarCostumeChange = {bool:false, str:'Bee uses costume change on space bar.'};;
        this.requirements.spaceBarWaitBlock = {bool:false, str:'Bee has wait block on space bar.'};;
        // checks for race winner
        this.requirements.BeeReachesFinish = {bool:false, str:'Bee reaches the finish line.'};;
        // checks for extra components
        // victory dance, turn block
    /*    this.extensions.extraPostFinishAnimation = {bool:false, str:'Bee changes costume during       victory dance.'};;
        this.extensions.extraTurnBlock = {bool:false, str:'Bee uses turn block during victory dance.'};;
        */
    }
    


    grade(fileObj, user) {
        this.initReqs();
        // for private method
        var that = this;

        // general metrics
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy'];
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];

        var minStartX = -200;
        var repeats = 0;
        var steps = 0;
        
        
        for(var i in fileObj['targets']){ //find bee
            var bee = fileObj['targets'][i]
            if(bee['name'] == 'Bee'){
                break;
            }
        }
        
        
        //make start script (on green flag)
        var startid = sb3.findBlockID(bee['blocks'], 'event_whenflagclicked');
        if (startid != null) {
            var startScript = sb3.makeScript(bee['blocks'],startid);

            for (var i in startScript){
                //check for valid start position
                if (startScript[i]['opcode'] == 'motion_gotoxy') {
                    if (startScript[i]['inputs']['X'][1][1] > minStartX){
                        this.requirements.goodStartPosition.bool = true;
                    }
                }
            }
        }
        
        
        //make space key script
        var keyid = sb3.findKeyPressID(bee['blocks'], 'space');
        
        if(keyid != null){
            
            this.requirements.handlesSpaceBar.bool = true;
            var spaceScript = sb3.makeScript(bee['blocks'], keyid);
            for(var i in spaceScript){
                //check for loop
                if(validLoops.includes(spaceScript[i]['opcode'])){
                    this.requirements.spaceBarLoop.bool = true;
                }  
                //check for wait block
                if(spaceScript[i]['opcode'] == 'control_wait'){
                    this.requirements.spaceBarWaitBlock.bool = true;
                }
                //check for movement 
                if(validMoves.includes(spaceScript[i]['opcode'])){
                    this.requirements.spaceBarMovement.bool = true;
                }
                //check for costumes
                if(validCostumes.includes(spaceScript[i]['opcode'])){
                    this.requirements.spaceBarCostumeChange.bool = true;
                }
                //check for reaching finish
                if (spaceScript[i]['opcode'] == 'control_repeat') {
                    repeats = spaceScript[i]['inputs']['TIMES'][1][1];
                }
                if (spaceScript[i]['opcode'] == 'motion_movesteps') {
                    steps = spaceScript[i]['inputs']['STEPS'][1][1];
                }
                if (repeats * steps >= 360){
                    this.requirements.BeeReachesFinish.bool = true;
                }
                
            }
        }
        
        
        //make down arrow script
        var arrowid = sb3.findKeyPressID(bee['blocks'], 'down arrow');
        if(arrowid != null){
            this.requirements.handlesDownArrow.bool = true;
            var arrowScript = sb3.makeScript(bee['blocks'], arrowid);
        
            for(var i in arrowScript){
                //check for costume change
                if(arrowScript[i]['opcode'] == 'looks_switchcostumeto' || arrowScript[i]['opcode'] == 'looks_nextcostume'){
                    this.requirements.downArrowCostumeChange.bool = true;
                }  
                //check for wait block
                if(arrowScript[i]['opcode'] == 'control_wait'){
                    this.requirements.downArrowWaitBlock.bool = true;
                }
            }
        }

    }
    
    
    


}
module.exports = GradeAnimation;