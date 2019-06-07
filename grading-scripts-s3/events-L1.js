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
    
    typeBlocks: function(script, type) { //retrieve blocks of certain type from a script list of blocks
        if (this.no(script)) return [];
        
        var miniscript = [];

        for(block in script){
            if(script[block]['opcode'].includes(type)){
                miniscript.push(script[block]);
            }
        }
        return miniscript;
    },
    
    startBlock: function(blocks){
        if(this.no(blocks) || blocks == {}) return null;
        
        for(block in blocks){ 
            if(blocks[block]['opcode'].includes("event_")){
                return block;
            }
        }
        return null;
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

class Sprite {
    
    constructor(name) {
        this.name = name; 
        this.scripts = [];
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

class GradeEvents {

    constructor() {
        this.requirements = {};
        this.extensions = {};
        
        this.event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        
        this.validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy'];
        this.validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        this.validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];
    }
    
   initReqs() {
        this.requirements.ThreeSpritesReactToClick =
            {bool:false,str:"Three Sprites react to being clicked."}
        this.requirements.ThreeSpritesGetBigger =
            {bool:false,str:"Three Sprites Get Bigger."}
        this.requirements.ThreeSpritesTalkTwice = 
            {bool:false,str:"Three Sprites talk twice."}
        this.requirements.ThreeSpritesResetSize =
            {bool:false,str:"Three Sprites reset size."}

    }
    
    initExts() {
        
        this.extensions.ChangeNames = {bool:false,str:'Sprite names are changed.'}
        
        this.extensions.TurnAndWait = {bool: false, str:'A Sprite spins using turn and wait blocks.'}
        this.extensions.AddEvent = {bool: false, str: 'A Sprite reacts to another event.'}
        
    }
    grade(fileObj,user) {
        
        this.initReqs();
        this.initExts();
        
        //count and create sprites
        if (sb3.no(fileObj)) return; //make sure script exists
        
        var Sprites = [];
        
        var projInfo = fileObj['targets'] //extract targets from JSON data
        
        //make sprite objects, load scripts
        for(var i=0; i <projInfo.length; i++){
            if(projInfo[i]['isStage'] == false){
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
            }
        }
        
        //variables for analysis
        var otherEvents = false;
        var diffNames = 0;
        var reactOnClick = [];
        var grow = [];
        var talkTwice = [];
        var shrink = [];
        var builtInNames = ["Left","Middle","Right","Catrina"]
            
        
        for(var s=0; s < Sprites.length; s++) { //iterate sprites
            var sprite = Sprites[s];
            var scripts = sprite.getScripts();
            var name = sprite.name;
            var clickedOn = false;
            
            if (!builtInNames.includes(name)) {
                diffNames++;
            }
            
            
            if (name != "Catrina") { //IGNORE CATRINA
            
                for (var p=0; p <scripts.length; p++){ //iterate scripts
                    var talks = 0;

                    for(var b in scripts[p]) {//iterate blocks

                        var opcode = scripts[p][b]['opcode'];

                        //check only when sprite is clicked
                        if (clickedOn) {    
                            //check for size change
                            if (opcode == 'looks_changesizeby') {
                                if (scripts[p][b]['inputs']['CHANGE'][1][1] > 0) {
                                    if (!grow.includes(name)){
                                        grow.push(name)
                                    }
                                }
                                if (scripts[p][b]['inputs']['CHANGE'][1][1] < 0) {
                                    if (!shrink.includes(name)){
                                        shrink.push(name)
                                    }
                                }

                            }

                            if (opcode == 'looks_setsizeto') {
                                if (scripts[p][b]['inputs']['CHANGE'][1][1] > 100) {
                                    if (!grow.includes(name)){
                                        grow.push(name)
                                    }
                                }
                                if (scripts[p][b]['inputs']['CHANGE'][1][1] < 100) {
                                    if (!shrink.includes(name)){
                                        shrink.push(name)
                                    }
                                }
                            }
                            
                            if (opcode.includes("looks_say")){
                                talks++;
                            }
                        }
                        
                        if (talks > 1) {
                            if (!talkTwice.includes(name)){
                                talkTwice.push(name)
                            }
                        }
                        
                        

                        
    
                        //event handling
                        if (opcode.includes("event_")) {

                            //turn on grading for other elements if clicked on event
                            if (opcode == "event_whenthisspriteclicked") {
                                clickedOn = true;
                                if (scripts[p][b]["next"] != 'null') {
                                    if (!talkTwice.includes(name)){
                                        talkTwice.push(name)
                                    }
                                }

                            //turn off grading for other elements, count other events
                            } else {
                                clickedOn = false;
                                if (scripts[p][b]["next"] != 'null') {
                                    otherEvents = true;
                                }
                            }

                        }



                    } //end of blocks loop




                }  //end of sprites loop

                //evaluate requirements

                if (reactOnClick.length > 2) {
                    this.requirements.ThreeSpritesReactToClick.bool = true;
                }

                if (grow.length > 2) {
                    this.requirements.ThreeSpritesGetBigger.bool = true;
                }

                if (shrink.length > 2) {
                    this.requirements.ThreeSpritesResetSize.bool = true;
                    //does not check for true reset, just getting smaller again
                }

                if (talkTwice.length > 2) {
                    this.requirements.ThreeSpritesReactToClick.bool = true;
                }
                
                //evaluate extensions
                
                if (diffNames > 2){
                    this.extensions.ChangeNames.bool = true;
                }
                
                this.extensions.AddEvent.bool = otherEvents;
            
            }
            
    
        }
    }

}
    
module.exports = GradeEvents;
    