/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/


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
    
    findBlockIDs: function(blocks, opcode){
        if(this.no(blocks) || blocks == {}) return null;
        
        var IDs = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                IDs.push(block);
            }
        }
        return IDs;
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
                return {};
            }
            
            if (getsub) {
                //if there is script nested inside, add them
                if (curBlockInfo['inputs']['SUBSTACK'] != undefined){
                    var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1]
                    
                    var sub = sb3.addSubScript(blocks,firstChildID,script)
                    if (failedSub){
                        return {};
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
                    var firstChildID = curBlockInfo['inputs']['SUBSTACK'][1];
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
    
    // Adds nested script to the main script.
    // returns true if adding script was unsuccessful
    addSubScript: function(blocks_sub,blockID_sub, script) {
        if (this.no(blocks_sub) || this.no(blockID_sub)) {
            return false;
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
    },
    // for an object of bool values, counts those that are "true"
    computeBoolObjScore: function(obj) {
        var score = 0;
        for (var key in obj) {
            if(obj[key]) {
                score++;
            }
        }
        return score;
    },
    
};

//SPRITE CLASS –––––––––––
/* A sprite class is used to hold all the necessary aspects of the sprite that 
 * we must track for grading purposes
 */
class Sprite {
    constructor(name) {
        this.name = name;
        // list where all the sprite's scritps will be added to
        this.scripts = [];

        // whether a given sprite has met the following block requirements
        this.reqs = {
            loop: false,
            move: false,
            costume: false,
            wait: false
        }
        // and the following additional requirements
        this.animated = false;
        this.danceOnClick = false;
        this.types = []; //types of animation
    }
    //calculate the score (of requirements), in order to find the "chosen" sprite
    getScore() { 
        return sb3.computeBoolObjScore(this.reqs);
    }
    //add a script to the sprite
    addScript(script) { 
        this.scripts.push(script);
    }
    // helper function to grade an individual script
    gradeScript(script) {
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];
  
        // object to check off whether these blocks are present
        // these are for an individual script
        var reqs = {
            loop: false,
            move: false,
            costume: false,
            wait: false
        };
        // records unique types of "motion_" blocks used
        var types = [];

        // check each block in the script and see if it matches required blocks
        // NOTE: since task requirements do not specify that move, wait, and costume change
        //   blocks must occur within a loop, we are not checking that 
        for(var i in script) {
            var opcode = script[i]['opcode'];
            
            //check loop
            if (validLoops.includes(opcode)) {
                reqs.loop = true;
            }
            //check wait
            if (opcode == 'control_wait') {
                reqs.wait = true;
            }
            //check costume
            if (validCostumes.includes(opcode)) {
                reqs.costume = true;
            }
            //check move
            if (opcode.includes("motion_")) {
                reqs.move = true;
                if (!types.includes(opcode)){
                   types.push(opcode);
                }
            }
        }
        //animation: loop and wait and either costume or movement
        var isAnimated = (reqs.loop && reqs.wait && (reqs.costume || reqs.move));
        
        var scriptReport = {
            animated: isAnimated,
            reqs: reqs,
            types: types
        };
        return scriptReport;
    }
    //grades the given sprite, iterating over all of its scripts to:
    // -find the script that meets the most requirements
    // -determine whether the sprite is animated and dances on the click event 
    grade() { 

        for (var script of this.scripts) { 
            
            var scriptReport = this.gradeScript(script);
            
            //check if animated
            if (scriptReport.animated) {
                this.animated = true;
            }
            //check dance reqs (find highest scoring script)
            var scriptScore = sb3.computeBoolObjScore(scriptReport.reqs)
            if (scriptScore >= this.getScore()) {
                this.reqs = scriptReport.reqs;
                
                //check for dance (and dance on click)
                if (scriptScore == 4) {
                    for (var b in script) { //should only get to the first block of script

                        if (script[b]['opcode'] == 'event_whenthisspriteclicked') {
                            this.danceOnClick = true; //ensures dance is on the click
                            break;
                        }
                    }
                }
            }
            //checks for new types of animation blocks
            for (var type of scriptReport.types) {
                if (!this.types.includes(type)) {
                    this.types.push(type);
                }
            }
        }
        var spriteReport = {
            score: this.getScore(),
            animated: this.animated,
            reqs: this.reqs,
            types: this.types,
            danceOnClick: this.danceOnClick
        };
        return spriteReport;
    }
}

// MAIN GRADER CLASS –––––––––––––––
class GradeAnimation{
    // initializes the empty requirement objects and a list of event block codes
    // which will be used below
    constructor() {
        this.requirements = {};
        this.extensions = {};
        
        this.event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
    }
    
    initReqs() {
        this.requirements.HaveBackdrop = {bool: false, str: "Background has an image."};
        this.requirements.EnoughSprites = {bool: false, str: "There are at least 3 sprites."};
        this.requirements.Loop = {bool: false, str: "Chosen sprite has a loop."};
        this.requirements.Move = {bool: false, str: "Chosen sprite moves."};
        this.requirements.Costume = {bool: false, str: "Chosen sprite changes costume."};
        this.requirements.Wait = {bool: false, str: "Chosen sprite has a wait block."};
        this.requirements.Dance = {bool: false, str: "Chosen sprite does a complex dance."};
        this.requirements.SecondAnimated = {bool: false, str: "Another sprite is animated."};
        this.requirements.ThirdAnimated = {bool: false, str: "A third sprite is animated."};
        
    }
    
    initExts() {
        this.extensions.OtherDanceOnClick = {bool: false, str: "At least another character dances when clicked."};
        this.extensions.OtherAnimation = {bool: false, str: "Student uses other block types to animate."};
        
    }
    
    grade(fileObj,user) {
        // initializing requirements
        this.initReqs();
        this.initExts();
        
        // if project does not exist, return early
        if (sb3.no(fileObj)) 
            return; 
        // list for sprite classes to be added
        var Sprites = [];
        // list for report objects to be added
        var Reports = [];
        
        var danceOnClick = 0;
        var animated = 0;
        var animationTypes = [];
        
        var projInfo = fileObj['targets']; //extract targets from JSON data
        
        // initializes sprite class for each sprite and adds scripts
        for(var target of projInfo){
            // if target is the stage
            if(target['isStage']){ 
                if (target['costumes'].length > 1) {
                    this.requirements.HaveBackdrop.bool = true;
                }
            //if target is a spritea sprite
            } else { 
                var sprite = new Sprite(target['name']);
                Sprites.push(sprite);
                for (var event of this.event_opcodes) {
                    var IDs = sb3.findBlockIDs(target['blocks'],event);
                    for (var ID of IDs){
                        console.log(target['name']);
                        var newScript = sb3.makeScript(target['blocks'],ID,true);
                        if (newScript != null) {
                            sprite.addScript(newScript);
                        }
                    }
                }
            }
        }
        //checks for enough sprites
        if (Sprites.length > 2) { 
            this.requirements.EnoughSprites.bool = true;
        }
        
        var highestscoring = 0;
        var highscore = 0;
        
        for (var s in Sprites) {    
            //REPORT: {score,animated,reqs: {loop, move, costume, wait},types,danceOnClick}
            var report = Sprites[s].grade();
            Reports.push(report);
            
            //to determine which sprite was the "chosen" sprite
            if (report.score > highscore) {
                highscore = report.score;
                highestscoring = s;
            }
            //
            if (report.animated) { 
                animated++;
            }
            //increment the number that dance on click if does so
            if (report.danceOnClick) {
                danceOnClick++;
            }
            //count types of animation used throughout project
            for (var type of report.types){ 
                if (!animationTypes.includes(type)){
                    animationTypes.push(type);
                }
            }
        }
        console.log(Sprites.length);
        console.log(Reports.length);
        // sprite most likely to be the chosen sprite
        var chosen = Reports[highestscoring];
        
        // Set lesson requirements to those of "chosen" sprite
        this.requirements.Loop.bool = chosen.reqs.loop;
        this.requirements.Move.bool = chosen.reqs.move;
        this.requirements.Costume.bool = chosen.reqs.costume;
        this.requirements.Wait.bool = chosen.reqs.wait;
        
        // if previous 4 requirements are met, then the "chosen" sprite danced
        this.requirements.Dance.bool = (chosen.score === 4);
        
        // checks if there are more than 1 and 2 animated sprites
        if (animated > 1) {
            this.requirements.SecondAnimated.bool = true;
            if (animated > 2) {
                this.requirements.ThirdAnimated.bool = true;
            }
        }
        // Since lesson is looking for if a non-chosen sprite dances on click,
        // decrement the danceOnClick counter if the chosen sprite danced on click
        if (chosen.danceOnClick) { 
            //this is to ensure the count is accurate for checking the extension "otherDanceOnClick"
            danceOnClick--;
        }
        //counts the sprites that dance on click
        this.extensions.OtherDanceOnClick.bool = danceOnClick > 0;
        
        //counts the number of animation blocks used
        this.extensions.OtherAnimation.bool = (animationTypes.length > 1)
    }    
}
module.exports = GradeAnimation;