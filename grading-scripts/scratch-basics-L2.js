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
                {bool: false, str: 'Script uses at least 3 "say _ for _ secs" blocks.'},
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
                this.requirements.changedBackdrop.bool = false;
                return;
            }
        }
        this.requirements.changedBackdrop.bool = true;
    }

    checkSprite(fileObj) {
        this.requirements.pickedSprite.bool = (sb3.countSprites(fileObj) > 1);
    }

    checkScripts(fileObj) {
        var defaultOpcodes = [
            'event_whenflagclicked',
            'motion_gotoxy', 
            'motion_movesteps',
            'looks_sayforsecs', 
            'event_whenkeypressed', 
            'looks_switchcostumeto', //update
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
                    var id = sb3.findBlockID(sprite['blocks'], event_opcodes[opcodenum]);
                    if(id != null){ //if opcode found
                        var script = sb3.makeScript(sprite['blocks'], id); //make script
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
                            if('event_whenthisspriteclicked' == script[key]['opcode'] || 'event_whenkeypressed' == script[key]['opcode']){
                                this.extensions.secondEvent.bool = true;                              
                            }
                            for(var opcodeID in defaultOpcodes){
                                if(defaultOpcodes[opcodeID] == script[key]['opcode']){
                                    this.extensions.newBlocks.bool = true;
                                }
                            }
                            if (script[key]['opcode'] === 'looks_sayforsecs'){
                                sayCount++;
                            } 
                            if (sayCount > 2) {
                                this.requirements.say.bool = true;
                            }
                        }
                    }

                }
            }
        this.extensions.secondSprite.bool = (spritesWithScripts > 1);
        }
    }

    /// Helpers
    no(x) {
        return (x == null || x.length === 0);
    }

    containsBlocks(script) {
        if (this.no(script)) return [];
        return script[2];
    }

    opcode(block) {
        if (this.no(block)) return "";
        return block[0];
    }

    eventScripts(sprite, myEvent) {
        if (this.no(sprite)) return [];
        return sprite.scripts.filter(script => this.hatCode(script) === myEvent);
    }

    scriptContains(script, myOpcode) {
        if (!script || script === undefined || !this.containsBlocks(script)) return false;
        for (i in script){
            if(script[i]['opcode'] == myOpcode){
                return script[i];
            }
        }
    }
}
module.exports = GradeScratchBasicsL2;