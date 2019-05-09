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
    
    between: function(x, a, b) {
        if (x == undefined) {
            return false;
        }
        if (x >= a && x <= b) {
            return true;
        }
        return false;
    },
    
    computeBoolArrayScore: function(arr) {
        var score = 0;
        for (var i = 0; i<arr.length; i++) {
            if(arr[i]) {
                score++;
            }
        }
        
        return score;
    },
    
    checkAnimation: function(script) {
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy','motion_pointindirection','motion_turnright','motion_turnleft'];
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
        //TODO: edit valid moves!
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy','motion_pointindirection','motion_turnright','motion_turnleft'];
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];
        
        var loop = false;
        var wait = false;
        var costume = false;
        var move = false;

        
        var types = [];
        
        //NEED TO ADD EXTS and MAKE ELIF –––––– !!!!!
        /*
        thoughts:
            loop: in valid loops
            costume: in valid costumes
            move: req: use motion
                    ext: track motion opcodes
            wait: check opcode
        
        */
        
        for(var i in script) {
            var opcode = script[i]['opcode'];
            
            //check loop
            if (validLoops.includes(opcode)) {
                loop = true;
            }
            
            //check wait
            if (opcode == 'control_wait') {
                wait = true;
            }
            
            //check costume
            if (validCostumes.includes(opcode)) {
                costume = true;
            }
            
            //check move
            if (validMoves.includes(opcode)) {
                if (!types.includes(opcode)){
                   types.push(opcode);
                }
                move = true;
            }
        }
        
        var reqs = [loop,move,costume,wait];
        
        var isAnimated = (loop && wait && (costume || move))
        
        var report = [isAnimated,reqs,types];
        
        return report;
        
    }
};

//SPRITE CLASS –––––––––––

class Sprite {
    
    constructor(name) {
        this.name = name; 
        this.scripts = [];
        
        this.animated = false;
        this.danceOnClick = false;
        
        //requirements:
        //members of array in this order:
        //loop,move,costume change,wait
        this.reqs = [false,false,false,false]
        
        //types of animation
        this.types = [];
        
    }
    
    getScore() { //calculate the score (of requirements)
        var score = 0;
        for (var i = 0; i<this.reqs.length; i++) {
            if(this.reqs[i]) {
                score++;
            }
        }
        
        return score;
    }
    
    
    getScripts() { //get all the scripts
        return this.scripts;
    }
    
    getScript(i) { //get a particular script
        return this.scripts[i];
    }
    
    addScript(script) { //add a script to the sprite
        this.scripts.push(script);
    }
    
    getReport() { //gets a report on what this sprite has been programmed to do
        //score,animated,reqs[4],exts
        var report = [this.getScore(),this.animated,this.reqs,this.types,this.danceOnClick];
    
        return report;
    }
    
    grade() {
        for (var s in this.scripts) {
            
            var scriptGrade = sb3.gradeAnimation(this.scripts[s]);
            
            //check animation
            if (scriptGrade[0]) {
                this.animated = true;
            }
            
            //check dance reqs
            var scriptScore = sb3.computeBoolArrayScore(scriptGrade[1])
            if (scriptScore >= this.getScore()) {
                this.reqs = scriptGrade[1];
                
                
                //check for dance on click
                if (scriptScore == 4) {
                    for (var b in this.scripts[s]) { //should only get to the first block
                        if (this.scripts[s][b]['opcode'] == 'event_whenthisspriteclicked') {
                            this.danceOnClick = true;
                            break;
                        }

                    }
                }
            }
            
            
            //checks for new types of animation blocks
            for (var t = 0; t<scriptGrade[2].length; t++) {
                if (!this.types.includes(scriptGrade[2][t])) {
                    this.types.push(scriptGrade[2][t]);
                }
            }
            
            
        }
        
        return this.getReport();
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
        this.extensions.MultipleDanceOnClick = {bool: false, str: "At least another character dances when clicked."};
        this.extensions.OtherAnimation = {bool: false, str: "Student uses other block types to animate."};
        
    }
    
    scoreReport(report) { //for determining the best sprite
        return report[0];
        
    }
    
    grade(fileObj,user) {
        
        this.initReqs();
        this.initExts();
        
        //count and create sprites
        if (sb3.no(fileObj)) return; //make sure script exists
        
        var Sprites = [];
        var Reports = [];
        
        var danceOnClick = 0;
        var animated = 0;
        var animationTypes = [];
        
        var projInfo = fileObj['targets'] //extract targets from JSON data
        
        
        //generate scripts for each sprite
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
        
        if (Sprites.length > 2) {
            this.requirements.EnoughSprites.bool = true;
        }
        
        var highestscoring = 0;
        var highscore = 0;
        for (var s = 0; s<Sprites.length; s++) {
            //          0   1       2          3    4
            //REPORT: score,animated,reqs[4],types,dance
            var report = Sprites[s].grade();
            Reports.push(report);
            
            //to determine which sprite was the target sprite
            var totalScore = this.scoreReport(report);
            if (totalScore > highscore) {
                highscore = totalScore;
                highestscoring = s;
            }
            
            
            if (report[1]) {
                animated++;
            }
            
            if (report[4]) {
                danceOnClick++;
            }
            
            for (var t = 0; t<report[3].length;t++){
                if (!animationTypes.includes(report[3][t])){
                    animationTypes.push(report[3][t]);
                }
            }
            
            
        }
        
        //sprite most likely to be the chosen sprite
        var chosen = Reports[highestscoring];
        
        
        if (chosen[2][0]) {
            this.requirements.Loop.bool = true;
        }
        
        if (chosen[2][1]) {
            this.requirements.Move.bool = true;
        }
        
        if (chosen[2][2]) {
            this.requirements.Costume.bool = true;
        }
        
        if (chosen[2][3]) {
            this.requirements.Wait.bool = true;
        }
        
        if(chosen[0] == 4) {
            this.requirements.Dance.bool = true;
        }
        
        switch(animated) {
            case 3: this.requirements.ThirdAnimated.bool = true;
            case 2: this.requirements.SecondAnimated.bool = true; 
            default: break;
            
                
        }
        
        
        if (danceOnClick > 1) {
            this.extensions.MultipleDanceOnClick.bool = true;
        }
        
        if (animationTypes.length > 1) {
            this.extensions.OtherAnimation.bool = true;
        }
        
        
    
    }
    
    

    
}
module.exports = GradeAnimation;