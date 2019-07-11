(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        this.requirements.BeeReachesFinish = {bool:false, str:'Bee reaches the finish line.'};;
        
    }
    
    initExts() {
        this.extensions.HasWinner = {bool: false, str:'There is a true winner to the race.'}
        
        this.extensions.WinnerVictoryDanceCostume = {bool:false, str:'Winner changes costume during victory dance.'};
        this.extensions.WinnerVictoryDanceTurn = {bool:false, str:'Winner uses turn block during victory dance.'};
        
        this.extensions.BeeWiggle = {bool:false, str:'Made the Bee take a wiggly path.'}
        
        this.extensions.AddedKangaroo = {bool:false, str:'Added Kangaroo.'}
        this.extensions.KangarooHop ={bool:false, str:'Made the Kangaroo hop.'}
        this.extensions.KangarooWiggle = {bool:false, str:'Made the Kangaroo take a wiggly path.'}
        
        this.extensions.AddedFourthSprite = {bool: false, str: 'Added a sprite'};
        this.extensions.AnimatedFourthSprite = {bool: false, str: 'Animated the addded sprite'};
        
        
    }
    
    
    


    grade(fileObj, user) {
        this.initReqs();
        this.initExts();

        
        //sprites
        var bee = null;
        var snake = null;
        var kangaroo = null;
        var fourth = null;
        
        // general metrics
        var validMoves = ['motion_gotoxy', 'motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy'];
        var validLoops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        var validCostumes = ['looks_switchcostumeto', 'looks_nextcostume'];

        var minStartX = -200;
        var beeRepeats = 0;
        var beeWait = 0.001;
        var beeSteps = 0;
        
        var snakeRepeats = 0;
        var snakeWait = 0.001;
        var snakeSteps = 0;
        
        var kangarooRepeats = 0;
        var kangarooWait = 0.001;
        var kangarooSteps = 0;
        
        var fourthRepeats = 0;
        var fourthWait = 0.001;
        var fourthSteps = 0;
        
        //winner
        var winner = null;
        var winnerSpaceScript = null;
        
        //space scripts
        var beeSpaceScript = null;
        var snakeSpaceScript = null;
        var kangarooSpaceScript = null;
        var fourthSpaceScript = null;
        
        
        for(var i in fileObj['targets']){ //find sprites
            var obj = fileObj['targets'][i];
            //POTENTIAL ISSUE: requires names of sprites.
            //However, as per the requirements, the Bee must do these things
            //There's really no way to test if the Bee does something without checking if the name is Bee
            //Another approach would be to just pick highest scoring sprite (as in Animation-L2)
            switch(obj['name']) {
                case('Bee') : bee = obj;
                                break;
                case('Snake') : snake = obj;
                                break;
                case('Kangaroo') : kangaroo = obj;
                                    break;
                default: if (!obj['isStage'] && obj['name'] != 'Monkey ') {
                    fourth = obj; 
                    }
                    
                }
        }
            
        //check for fourth sprite
        if (fourth != null) {
            this.extensions.AddedFourthSprite.bool = true;
        }
        
//GRADING BEE: ---------------------------
        
        if (bee != null){

            //make start script (on green flag)
            var startid = sb3.findBlockID(bee['blocks'], 'event_whenflagclicked');
            if (startid != null) {
                var startScript = sb3.makeScript(bee['blocks'],startid,true);

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
                var numLoops = 0;
                this.requirements.handlesSpaceBar.bool = true;
                beeSpaceScript = sb3.makeScript(bee['blocks'], keyid,true);
                for(var i in beeSpaceScript){
                    //check for loop
                    if(validLoops.includes(beeSpaceScript[i]['opcode'])){
                        this.requirements.spaceBarLoop.bool = true;
                        numLoops++;
                    }  
                    //check for wait block
                    if(beeSpaceScript[i]['opcode'] == 'control_wait'){
                        this.requirements.spaceBarWaitBlock.bool = true;
                    }
                    //check for movement 
                    if(validMoves.includes(beeSpaceScript[i]['opcode'])){
                        this.requirements.spaceBarMovement.bool = true;
                    }
                    //check for costumes
                    if(validCostumes.includes(beeSpaceScript[i]['opcode'])){
                        this.requirements.spaceBarCostumeChange.bool = true;
                    }
                     //POTENTIAL ISSUE:
                    //only checks for reaching end on first loop in space script
                    //this was done to prevent different loops with different steps from disrupting the count
                    //a more robust version would be to create an array with reapeat and steps and wait from each loop
                    //this was not done because of time constraints
                    //this issue has been propagated to all other sprites being graded
                    if (numLoops == 1){
                        //check for wiggly path (turn blocks in first loop)
                        if (beeSpaceScript[i]['opcode'].includes('motion_turn')) {
                            this.extensions.BeeWiggle.bool = true;
                        }
                        //get stats reaching finish and winner
                        if (beeSpaceScript[i]['opcode'] == 'control_repeat') {
                            beeRepeats += Number(beeSpaceScript[i]['inputs']['TIMES'][1][1]);
                        
                        }
                        if (beeSpaceScript[i]['opcode'] == 'control_forever') {
                            beeRepeats += 100000; //arbritary large number to simulate infinity
                        }
                        if (beeSpaceScript[i]['opcode'] == 'motion_movesteps') {
                            beeSteps += Number(beeSpaceScript[i]['inputs']['STEPS'][1][1]);
                          
                        }
                        if (beeSpaceScript[i]['opcode'] == 'control_wait'){
                            beeWait += Number(beeSpaceScript[i]['inputs']['DURATION'][1][1]);
                           
                        }
                        
                    }
                    
                    //check for reaching finish
                    //POTENTIAL ISSUE: if the start position is bad, then this will fail even if the Bee reaches the end
                    //ISSUE: 360 is not small enough in some cases. May need to make it more dynamic (based on start positon)
                    if (beeRepeats * beeSteps >= 360 && this.requirements.goodStartPosition.bool){
                        this.requirements.BeeReachesFinish.bool = true;
                    }

                    
                }
            }


            //make down arrow script
            var arrowid = sb3.findKeyPressID(bee['blocks'], 'down arrow');
            if(arrowid != null){
                this.requirements.handlesDownArrow.bool = true;
                var arrowScript = sb3.makeScript(bee['blocks'], arrowid,true);

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
    
//GRADING SNAKE: ---------------------------
        if (snake != null){
            //find spacebar script
           var snakekeyid = sb3.findKeyPressID(snake['blocks'], 'space');

            if(snakekeyid != null){
                numLoops = 0;
                snakeSpaceScript = sb3.makeScript(snake['blocks'], snakekeyid,true);
                for(var i in snakeSpaceScript){  
                    //count loops
                    if(validLoops.includes(snakeSpaceScript[i]['opcode'])){
                        numLoops++;
                    }  
                    if (numLoops == 1){
                            //get stats reaching finish and winner
                        if (snakeSpaceScript[i]['opcode'] == 'control_repeat') {
                            snakeRepeats += Number(snakeSpaceScript[i]['inputs']['TIMES'][1][1]);
                            
                        }
                        if (snakeSpaceScript[i]['opcode'] == 'motion_movesteps') {
                            snakeSteps += Number(snakeSpaceScript[i]['inputs']['STEPS'][1][1]);
                          
                        }
                        if (snakeSpaceScript[i]['opcode'] == 'control_wait'){
                            snakeWait += Number(snakeSpaceScript[i]['inputs']['DURATION'][1][1]);
                            
                        }
                        
                    }
                }
            }
                                               
        }
    
    
//GRADING KANGAROO: ---------------------------
        if (kangaroo != null){
            
            //check for kangaroo visibility
            if (kangaroo['visible']){
                this.extensions.AddedKangaroo.bool = true;
            } else {
                for(var i in kangaroo['blocks']){
                    if (kangaroo['blocks'][i]['opcode'] == 'looks_show'){
                        this.extensions.AddedKangaroo.bool = true;
                        break;
                    }
                }  
            }
            
            //make kangaroo space script
            var kangarookeyid = sb3.findKeyPressID(kangaroo['blocks'], 'space');

            if(kangarookeyid != null){
                numLoops = 0;
                kangarooSpaceScript = sb3.makeScript(kangaroo['blocks'], kangarookeyid,true);
                for(var i in kangarooSpaceScript){
                    if(validLoops.includes(kangarooSpaceScript[i]['opcode'])){
                        numLoops++;
                    }  
                    if (numLoops == 1){
                            //check for kangaroo wiggly path
                        if (kangarooSpaceScript[i]['opcode'].includes('motion_turn')){
                            this.extensions.KangarooWiggle.bool = true;
                        }
                        //check for kangaroo hop (change costumes)
                        if(validCostumes.includes(kangarooSpaceScript[i]['opcode'])){
                            this.extensions.KangarooHop.bool = true;
                        }
                        //get stats reaching finish and winner
                        if (kangarooSpaceScript[i]['opcode'] == 'control_repeat') {
                            kangarooRepeats += Number(kangarooSpaceScript[i]['inputs']['TIMES'][1][1]);
                            
                        }
                        if (kangarooSpaceScript[i]['opcode'] == 'motion_movesteps') {
                            kangarooSteps += Number(kangarooSpaceScript[i]['inputs']['STEPS'][1][1]);
                            
                        }
                        if (kangarooSpaceScript[i]['opcode'] == 'control_wait'){
                            kangarooWait += Number(kangarooSpaceScript[i]['inputs']['DURATION'][1][1]);
                            
                        }
                        
                    }
                }
            }
        }
        
//GRADING FOURTH: -------------------------
        
    if (fourth != null){
        
            //get the fourth sprite's space block
           var fourthkeyid = sb3.findKeyPressID(fourth['blocks'], 'space');

            if(fourthkeyid != null){
                numLoops = 0;
                fourthSpaceScript = sb3.makeScript(fourth['blocks'], fourthkeyid,true);
                for(var i in fourthSpaceScript){  
                    
                    //count loops
                    if(validLoops.includes(fourthSpaceScript[i]['opcode'])){
                        numLoops++;
                    }  
                    if (numLoops == 1){
                        //get stats reaching finish and winner
                        if (fourthSpaceScript[i]['opcode'] == 'control_repeat') {
                            fourthRepeats += Number(fourthSpaceScript[i]['inputs']['TIMES'][1][1]);
                            
                        }
                        if (fourthSpaceScript[i]['opcode'] == 'motion_movesteps') {
                            fourthSteps += Number(fourthSpaceScript[i]['inputs']['STEPS'][1][1]);
                          
                        }
                        if (fourthSpaceScript[i]['opcode'] == 'control_wait'){
                            fourthWait += Number(fourthSpaceScript[i]['inputs']['DURATION'][1][1]);
                            
                        }
                        
                    }
                }
            }
            //check if the fourth sprite has been animated for some event 
            var events = sb3.typeBlocks(fourth['blocks'], "event_");
            for (var b in events) {
                var script = sb3.makeScript(fourth['blocks'],b,true);
                if (sb3.checkAnimation(script)) {
                    this.extensions.AnimatedFourthSprite.bool = true;
                }
            }
            
                                               
    }
    
    
//FINAL GRADING: ------------------------------   
        //if even one of the original three sprites has been deleted, no grading occurs
        if (bee == null || snake == null || kangaroo == null) {
            return;
        }
        
        var beeSpeed = (beeSteps / beeWait)*beeRepeats;
        var snakeSpeed = (snakeSteps / snakeWait)*snakeRepeats;
        var kangarooSpeed = (kangarooSteps / kangarooWait)*snakeRepeats;
        
        
        //find a winner
        var speeds = [beeSpeed,snakeSpeed,kangarooSpeed];
        speeds.sort();
        speeds.reverse();
        
        if (speeds[0] != speeds[1]) { //prevent a tie
            switch (speeds[0]) {
                case beeSpeed: winner = bee;
                                winnerSpaceScript = beeSpaceScript;
                    break;
                case kangarooSpeed: winner = kangaroo;
                                winnerSpaceScript = kangarooSpaceScript;
                    break;
                case snakeSpeed: winner = snake;
                                winnerSpaceScript = snakeSpaceScript;
                    break;
                default : winner = fourth;
                                winnerSpaceScript = fourthSpaceScript;
                }
        }
                
        //check for winner victory dance
        if (winner != null) {
            this.extensions.HasWinner.bool = true;
            numLoops = 0;
            for(var i in winnerSpaceScript) {
                if (validLoops.includes(winnerSpaceScript[i]['opcode'])){
                    numLoops++;
                }
                if (numLoops > 1) { //in second part of the space event
                    //POTENTIAL ISSUE:
                    //if there is a loop within a loop in the motion portion
                    
                    //check for costume change
                    if(winnerSpaceScript[i]['opcode'] == 'looks_switchcostumeto' || winnerSpaceScript[i]['opcode'] == 'looks_nextcostume'){
                        this.extensions.WinnerVictoryDanceCostume.bool = true;
                    }
                    
                    //check for victory dance that includes a turn block
                    if (winnerSpaceScript[i]['opcode'].includes('motion_turn')){
                        this.extensions.WinnerVictoryDanceTurn.bool = true;
                    }

                }
                
            }
             
        } 
    
    }
    
}
module.exports = GradeAnimation;
},{}],2:[function(require,module,exports){
/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/

require('./scratch3');

// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    
    recursive([script], func, 1);
}

const print = (block, level) => console.log("   ".repeat(level) + block.opcode);

module.exports = class {
    // initializes the requirement objects and a list of event block codes
    // which will be used below
    init() {
        this.requirements = {
            HaveBackdrop: {bool: false, str: "Background has an image."},
            atLeastThreeSprites: {bool: false, str: "There are at least 3 sprites."},
            Loop: {bool: false, str: "The main sprite has a loop."},
            Move: {bool: false, str: "The main sprite moves."},
            Costume: {bool: false, str: "The main sprite changes costume."},
            Wait: {bool: false, str: "The main sprite has a wait block."},
            Dance: {bool: false, str: "The main sprite does a complex dance."},
            SecondAnimated: {bool: false, str: "Another sprite is animated."},
            ThirdAnimated: {bool: false, str: "A third sprite is animated."}
        }
        this.extensions = {
            multipleDancingOnClick: {bool: false, str: "Multiple characters dance on click"},
            moreThanOneAnimation: {bool: false, str: "Student uses more than one motion block to animate their sprites"}
        }
        // project-wide variables
        this.animationTypes = [];
    }
    // helper function for grading an individual sprite
    gradeSprite(sprite) {

        var spriteDanceReqs = {
            loop: false,
            move: false,
            costume: false,
            wait: false
        };
        var spriteDanceScore = 0
        // and the following additional requirements
        var isAnimated = false;
        var danceOnClick = false;
        //iterating through each of the sprite's scripts, ensuring that only those that start with an event block are counted
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) { 

            var reqs = {loop: false, wait: false, costume: false, move: false};
            // search through each block and execute the given callback function
            // that determines what to look for and what to do (through side effects) for each block
            iterateBlocks(script, (block, level) => {
                var opcode = block.opcode;

                reqs.loop = reqs.loop || ['control_forever', 'control_repeat', 'control_repeat_until'].includes(opcode);
                reqs.costume = reqs.costume || ['looks_switchcostumeto', 'looks_nextcostume'].includes(opcode);
                reqs.wait = reqs.wait || (opcode == 'control_wait');
                if (opcode.includes("motion_")) {
                    reqs.move = true;
                    if (!this.animationTypes.includes(opcode)) this.animationTypes.push(opcode);
                } 
            });
            
            isAnimated = isAnimated || (reqs.loop && reqs.wait && (reqs.costume || reqs.move));

            var scriptScore = Object.values(reqs).reduce((sum, val) => sum + val, 0);
            //check dance reqs (find highest scoring script)
            if (scriptScore >= spriteDanceScore) {
                spriteDanceReqs = reqs;
                spriteDanceScore = scriptScore;
                //check for dance (and dance on click)
                if (scriptScore == 4) {
                    if (script.blocks[0].opcode == 'event_whenthisspriteclicked') {
                        danceOnClick = true;
                    }
                }
            }            
        }
        return {
            name: sprite.name,
            danceScore: spriteDanceScore,
            animated: isAnimated,
            reqs: spriteDanceReqs,
            danceOnClick: danceOnClick
        };
    }
    // the main grading function
    grade(fileObj,user) {
        
        var project = new Project(fileObj);
        // initializing requirements and extensions
        this.init();
        // if project does not exist, return early
        if (!is(fileObj)) return; 
     
        var danceOnClick = 0;
        var animatedSprites = 0;
        var bestReport = null;

        // initializes sprite class for each sprite and adds scripts
        for(var target of project.targets){
            if(target.isStage){ 
                if (target.costumes.length > 1) {
                    this.requirements.HaveBackdrop.bool = true;  
                }
                continue;
            }
            var report = this.gradeSprite(target);
            if (!bestReport || report.danceScore > bestReport.danceScore) 
                bestReport = report;
            // for each sprite that is animated, increase counter
            if (report.animated) animatedSprites++;

            // for each sprite that dances on the click event, icnrease counter
            if (report.danceOnClick) danceOnClick++;
        }
        
        // sprite most likely to be the chosen sprite
        var chosen = bestReport;

        // Set lesson requirements to those of "chosen" sprite
        this.requirements.Loop.bool = chosen.reqs.loop;
        this.requirements.Move.bool = chosen.reqs.move;
        this.requirements.Costume.bool = chosen.reqs.costume;
        this.requirements.Wait.bool = chosen.reqs.wait;
        
        // if previous 4 requirements are met, then the "chosen" sprite danced
        this.requirements.Dance.bool = (chosen.danceScore === 4);
        
        // checks if there are more than 1 and 2 animated sprites
        this.requirements.SecondAnimated.bool = (animatedSprites > 1);
        this.requirements.ThirdAnimated.bool = (animatedSprites > 2);

        // Checks if there are "multiple" sprites dancing on click
        this.extensions.multipleDancingOnClick.bool = (danceOnClick > 1);

        //checks if there were at least 3 sprites (the minus 1 accounts for the Stage target, which isn't a sprite)
        this.requirements.atLeastThreeSprites.bool = (project.targets.length - 1 >= 3);

        //counts the number of animation (motion) blocks used
        this.extensions.moreThanOneAnimation.bool = (this.animationTypes.length > 1)
    }
}
},{"./scratch3":10}],3:[function(require,module,exports){
require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            changedCostume: { bool: false, str: 'Car\'s costume has been changed.'                 },
            carStops:       { bool: false, str: 'Car stops at something other than the stop sign.' },
            carTalks:       { bool: false, str: 'Car says something after it stops.'               },
            changedSpeed:   { bool: false, str: 'Changed the speed of the car.'                    }
        };
        this.extensions =   {
            otherSprites:   { bool: false, str: 'Added scripts to other sprites.'                  },
            addedSound:     { bool: false, str: 'Car plays a sound.'                               }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        project.context.scriptCounts = [];
        for (var sprite of project.sprites) {
            project.context.scriptCounts.push(sprite.scripts.filter(
                script => script.blocks.length > 1 && script.blocks[0].opcode.includes('event_when')).length);
            for (var script of sprite.scripts.filter(script => script.blocks[0].opcode.includes('event_when'))) {
                script.context.hasLooped = 0;
                for (var block of script.blocks) {

                    /// Look for the loop
                    if (block.opcode === 'control_repeat_until' && is(block.subScripts())) {

                        /// Check loop body
                        script.context.hasLooped = 1;
                        block.context.includesMove = 0;
                        block.context.includesWait = 0;
                        for (var subBlock of block.subScripts()[0].blocks) {
                            if (subBlock.opcode === 'motion_movesteps') {
                                block.context.includesMove = 1;
                                if (parseFloat(subBlock.inputs.STEPS[1][1]) !== 10) {
                                    script.context.changedSpeed = 1;
                                }
                            }
                            if (subBlock.opcode === 'control_wait') {
                                block.context.includesWait = 1;
                                if (parseFloat(subBlock.inputs.DURATION[1][1]) !== 0.1) {
                                    script.context.changedSpeed = 1;
                                }
                            }
                        }
                        if (block.context.includesMove && !block.context.includesWait) {
                            script.context.changedSpeed = 1;
                        }

                        /// Check stop condition
                        if (is(block.inputs.CONDITION)) {
                            for (var anyBlock_ in sprite.blocks) {
                                if (anyBlock_ === block.inputs.CONDITION[1]) {
                                    var anyBlock = sprite.blocks[anyBlock_];
                                    if (is(anyBlock.inputs.TOUCHINGOBJECTMENU)) {
                                        var touchingObject = sprite.blocks[
                                            anyBlock.inputs.TOUCHINGOBJECTMENU[1]].fields.TOUCHINGOBJECTMENU[0];
                                        for (var anySprite of project.sprites) {
                                            if (anySprite.name === touchingObject && !anySprite.name.includes('Stop')) {
                                                script.context.carStops = 1;
                                            }
                                        }
                                    }
                                    else if (anyBlock.opcode === 'sensing_touchingcolor') {
                                        script.context.carStops = 1;
                                    }
                                }
                            }
                        }
                    }

                    /// Check what happens outside the loop
                    if (script.context.hasLooped &&
                        (block.opcode.includes('looks_say') || block.opcode.includes('looks_think'))) {
                        script.context.carTalks = 1;
                    }
                    if (block.opcode.includes('sound_play')) {
                        script.context.addedSound = 1;
                    }
                }    
            }
            var costumeNames = sprite.costumes.map(costume => costume.name);
            var isCar = false;
            for (var costumeName of costumeNames) {
                if (['SUV', 'Cooper', 'Sedan', 'Bug'].includes(costumeName) || sprite.name === 'Car') {
                    isCar = true;
                }
            }
            if (isCar) {
                var costumeName = sprite.costumes[sprite.currentCostume].name;
                sprite.context.changedCostume = costumeName !== 'Sedan';
            }
            sprite.context.pull(['carStops', 'carTalks', 'changedSpeed', 'addedSound'], 1, false);
        }
        project.context.scriptCounts.sort((a, b) => a - b);
        project.context.otherSprites = (
            project.context.scriptCounts[0] > 0 ||
            project.context.scriptCounts[1] > 1 ||
            project.context.scriptCounts[2] > 1 ||
            project.context.scriptCounts[3] > 2
        )
        project.context.pull(['changedCostume', 'carStops', 'carTalks', 'changedSpeed', 'addedSound'], 1, false);
        project.context.makeGrade(this);
    }
}
},{"./scratch3":10}],4:[function(require,module,exports){
(function (global){
/// Info layer template
global.Context = class {

    constructor(x, keepValues) {
        if (x && x.hasOwnProperty('requirements') && x.hasOwnProperty('extensions')) {
            for (var requirement in x.requirements) this[requirement] = keepValues ? x.requirements[requirement] : 0;
            for (var extension   in x.extensions  ) this[extension  ] = keepValues ? x.extensions  [extension  ] : 0;
        }
        else {
            for (var item in x) this[item] = keepValues ? x[item] : 0;
        }
        this.sublayers = [];
    }

    pull(keys, thresh, sum) {
        for (var key of keys) {
            if (!sum) {
                this[key] = this.sublayers.some(x => x[key] >= thresh);
            }
            else {
                this[key] = this.sublayers.reduce((acc = 0, x) => acc += x[key], 0) >= thresh;
            }
        }
    }

    makeGrade(grader) {
        for (var key in this) {
            if (grader.requirements[key] !== undefined) grader.requirements[key].bool = !!this[key];
            if (grader.extensions  [key] !== undefined) grader.extensions  [key].bool = !!this[key];
        }
    }
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
/* Decomposition By Sequence L1 Autograder
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

class GradeDecompBySeq{
    
    constructor() {
        this.requirements = {}
    }
    
    init() {
        this.requirements = {
      JaimeToBall:
        {bool:false, str:'Jaime uses the "repeat until" block to do an action until it touches the Soccer Ball.'},
      JaimeAnimated:
        {bool:false, str:'Jaime is animated correctly to move towards the Soccer Ball.'},
      ballStayStill:
        {bool:false, str:'Soccer Ball uses the "wait until" to wait until Jaime touches it.'},
      ballToGoal:
        {bool:false, str:'Soccer Ball uses the "repeat until" block to do an action until it touches the Goal.'},
      ballAnimated: 
        {bool:false, str:'Soccer Ball is animated correctly to move towards the Goal.'},
    }
        this.extensions = {
            cheer:
                {bool: false, str: 'Cheer sound when ball enters goal'},
            bounce:
                {bool: false, str: 'Ball bounces off goal'},
            jump:
                {bool: false, str: 'Jaime jumps up and down to celebrate goal'},
            goalie: 
                {bool: false, str: 'Added a goalie sprite.'},
            goaliebounce:
                {bool: false, str: 'Ball bounces off the goalie.'},
            goaliemoves:
                {bool: false, str: 'Goalie can move left and right with the arrow keys.'}
            
        }
    }
    
    
    
    grade(fileObj, user){
        this.init();
        
        for(var i in fileObj['targets']){ //find sprite
            var sprite = fileObj['targets'][i]
            if(sprite['name'] == 'Jaime '){
                var jaime = sprite;
                this.checkJaime(jaime);
            }
            else if(sprite['name'] == 'Soccer Ball'){
                var ball = sprite;
                this.checkBall(ball);
            }
            else if(sprite['name'] == 'Goal'){
                var goal = sprite;
                this.checkGoal(goal);
            }
            else if(goal != undefined && ball != undefined && goal != undefined){ //
                var goalie = sprite;
                this.extensions.goalie.bool = true;
                this.checkGoalie(goalie);
            }
        }
    }
    
    checkJaime(jaime){
        var jaimeids = sb3.findBlockIDs(jaime['blocks'], 'event_whenflagclicked');
        for(var j in jaimeids){
            var jaimeScript = sb3.makeScript(jaime['blocks'], jaimeids[j]);
            for(var i in jaimeScript){
                if(jaimeScript[i]['opcode'] == 'control_repeat_until'){
                    var condblock = jaimeScript[i]['inputs']['CONDITION'][1];
                    var cond = jaime['blocks'][condblock];
                    if(cond['opcode'] == 'sensing_touchingobject'){
                        var objectID = cond['inputs']['TOUCHINGOBJECTMENU'][1];
                        var object = jaime['blocks'][objectID]['fields']['TOUCHINGOBJECTMENU'][0]
                        if(object == 'Soccer Ball'){
                            this.requirements.JaimeToBall.bool = true;
                            var curID = jaimeScript[i]['inputs']['SUBSTACK'][1]
                            while(curID != null){ //check if Jaime is moving towards the ball
                                if(jaime['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                   this.requirements.JaimeAnimated.bool = true;
                                }
                                curID = jaime['blocks'][curID]['next']
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkBall(ball){
        var ballids = sb3.findBlockIDs(ball['blocks'], 'event_whenflagclicked');
        for(var j in ballids){
            var ballScript = sb3.makeScript(ball['blocks'], ballids[j]);
            for(var i in ballScript){
                if(ballScript[i]['opcode'] == 'control_wait_until'){
                    var condid = ballScript[i]['inputs']['CONDITION'][1] //find key of condition block
                    if(condid != null){ //handles case where no condition is nested in the block
                        var cond = ball['blocks'][condid]
                        var nameid = cond['inputs']['TOUCHINGOBJECTMENU'][1] //find key of block with nested object of the condition
                        if(nameid != null){
                            var name = ball['blocks'][nameid]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(name == 'Jaime '){
                                this.requirements.ballStayStill.bool = true;
                            }
                            if(name == 'Goal'){
                            
                                var curID = ballScript[i]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'control_repeat_until'){
                                        var condid = ballScript[i]['inputs']['CONDITION'][1]
                                        var condition = ball['blocks'][condid]['opcode']
                                        if(condition == 'sensing_touchingobject'){
                                            var object = ball['blocks'][condid]['inputs']['TOUCHINGOBJECTMENU'][1] //find key of condition block
                                            if(object != null){
                                                var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0] //find key of block with nested object
                                                if(objname == 'Jaime '){
                                                    this.extensions.bounce.bool = true;
                                                }
                                            }
                                        }
                                    }
                                    curID = ball['blocks'][curID]['next'] //iterate
                                }
                                
                            }
                        }
                    }
                }
                if(ballScript[i]['opcode'] == 'control_repeat_until' ){
                    var condid = ballScript[i]['inputs']['CONDITION'][1]
                    var condition = ball['blocks'][condid]['opcode']
                    if(condition == 'sensing_touchingobject'){
                        var object = ball['blocks'][condid]['inputs']['TOUCHINGOBJECTMENU'][1] //find key of condition block
                        if(object != null){
                            var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0] //find key of block with nested object
                            if(objname == 'Goal'){
                                this.requirements.ballToGoal.bool = true;
                            
                                var curID = ballScript[i]['inputs']['SUBSTACK'][1]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                        this.requirements.ballAnimated.bool = true;
                                    }
                                    curID = ball['blocks'][curID]['next']
                                }
                            }
                            if(objname == 'Jaime '){
                                var curID = ballScript[i]['inputs']['SUBSTACK'][1]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                        this.extensions.bounce.bool = true;
                                    }
                                    curID = ball['blocks'][curID]['next']
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkGoal(goal){
        var flags = sb3.findBlockIDs(goal['blocks'], 'event_whenflagclicked');
        for(var j in flags){
            var goalScript = sb3.makeScript(goal['blocks'], flags[j]);
            for(var i in goalScript){
                if(goalScript[i]['opcode'] == 'control_wait_until'){
                    var condid = goalScript[i]['inputs']['CONDITION'][1] //find key of condition block
                    if(condid != null){ //handles case where no condition is nested in the block
                        var cond = goal['blocks'][condid]
                        var nameid = cond['inputs']['TOUCHINGOBJECTMENU'][1] //find key of block with nested object of the condition
                        if(nameid != null){
                            var name = goal['blocks'][nameid]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(name == 'Soccer Ball'){
                                var curid = goalScript[i]['next']
                                while(curid != null){
                                    if(goal['blocks'][curid]['opcode'] == 'sound_playuntildone' || goal['blocks'][curid]['opcode'] == 'sound_play'){
                                        this.extensions.cheer.bool = true;
                                    }
                                    curid = goal['blocks'][curid]['next'] //iterate
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }
    
    checkGoalie(goalie){
        var movement = ['motion_changexby', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
        
        var arrows = sb3.findBlockIDs(goalie['blocks'], 'event_whenkeypressed');
        var left = false;
        var right = false;
        for(var i in arrows){ 
            var blockid = arrows[i]
            if(goalie['blocks'][arrows[i]]['fields']['KEY_OPTION'][0] == 'left arrow'){
                var leftscript = sb3.makeScript(goalie['blocks'], blockid)
                for(var j in leftscript){
                    if(movement.includes(leftscript[j]['opcode'])){
                        left = true
                    }
                }
                
            }
            if(goalie['blocks'][arrows[i]]['fields']['KEY_OPTION'][0] == 'right arrow'){
                var rightscript = sb3.makeScript(goalie['blocks'], blockid)
                for(var j in rightscript){
                    if(movement.includes(rightscript[j]['opcode'])){
                        right = true
                    }
                }
            }
            if(left == true && right == true){
                this.extensions.goaliemoves.bool = true
            }
        }
    }
    
    
}

module.exports = GradeDecompBySeq;
},{}],6:[function(require,module,exports){
require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            reactToClick: { bool: false, str: 'Three sprites react to being clicked.'                          },
            getBigger:    { bool: false, str: 'Three sprites get bigger when clicked.'                         },
            talkTwice:    { bool: false, str: 'After getting bigger, the sprites talk twice.'                  },
            resetSize:    { bool: false, str: 'After talking twice, the sprites reset to their original size.' }
        };
        this.extensions = {
            changedName:  { bool: false, str: 'At least one sprite\'s name has been changed.'                  },
            addedSpin:    { bool: false, str: 'At least one sprite spins using turn and wait blocks.'          },
            addedEvent:   { bool: false, str: 'At least one sprite reacts to a different event.'               }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        for (var sprite of project.sprites) {
            for (var script of sprite.scripts.filter(script => script.blocks[0].opcode.includes('event_when'))) {
                script.context.spriteSize = script.context.initialSpriteSize = parseFloat(sprite.size);
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) script.context.getBigger = 1;
                        script.context.spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > script.context.initialSpriteSize) script.context.getBigger = 1;
                        script.context.spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    if (block.opcode.includes('looks_say') && script.context.spriteSize > script.context.initialSpriteSize) {
                        script.context.talkTwice++;
                    }
                }
                if (script.context.getBigger && Math.abs(script.context.spriteSize - script.context.initialSpriteSize) < 0.05) {
                    script.context.resetSize = 1;
                }
                if (script.blocks[0].opcode === 'event_whenthisspriteclicked' && script.blocks.length > 1) {
                    script.context.reactToClick = 1;
                }
                else if (script.blocks[0].opcode !== 'event_whenflagclicked' && script.blocks.length > 1) {
                    script.context.addedEvent = 1;
                }
                if (script.blocks.some(block => block.opcode.includes('motion_turn')) &&
                        script.blocks.some(block => block.opcode === 'control_wait')) {
                    script.context.addedSpin = 1;
                }
            }
            sprite.context.changedName = !['Left', 'Middle', 'Right', 'Catrina'].includes(sprite.name);
            sprite.context.pull(['reactToClick', 'getBigger', 'resetSize', 'addedEvent', 'addedSpin'], 1, false);
            sprite.context.pull(['talkTwice'], 2, false);
        }
        project.context.pull(['reactToClick', 'getBigger', 'talkTwice', 'resetSize'], 3, true);
        project.context.pull(['changedName', 'addedSpin', 'addedEvent'], 1, false);
        project.context.makeGrade(this);
    }
}
},{"./scratch3":10}],7:[function(require,module,exports){
/* Events L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and bug fixes: Marco Anaya, Summer 2019
*/
require('./scratch3');
// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

module.exports = class {
    init() {
        this.requirements = {
            choseBackdrop: {bool: false, str: "The backdrop of the project was changed"},
            hasThreeSprites: {bool: false, str: "There are at least three sprites"},
            spriteHasTwoEvents1: {bool: false, str: "A sprite has two required events"},
            spriteHasTwoEvents2: {bool: false, str: "A second sprite has two required events"},
            spriteHasTwoEvents3: {bool: false, str: "A third sprite has two required events"},
            spriteHasTwoScripts1: {bool: false, str: "A sprite has two scripts with unique events"},
            spriteHasTwoScripts2: {bool: false, str: "A second sprite has two scripts with unique events"},
            spriteHasTwoScripts3: {bool: false, str: "A third sprite has two scripts with unique events"},
            usesTheThreeEvents: {bool: false, str: "Uses all event blocks from lesson plan"}
        };
        this.extensions = {
            spriteSpins: {bool: false, str: "A sprite spins (uses turn block)"},
            moreScripts: {bool: false, str: "A sprite reacts to more events."},
            spriteBlinks: {bool: false, str: "A sprite blinks (use hide, show, and wait blocks)."}
        };
    }
    
    gradeSprite(sprite) {
        var reqEvents = [];
        var events = [];
        var validScripts = 0;     
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))){

            //look for extension requirements throughout each block
            var blink = {hide: false, wait: false, show: false};
            var spin = {wait: false, turn: false};
            iterateBlocks(script, (block, level) => {
                var opcode = block.opcode;
                spin.turn = spin.turn || opcode.includes("motion_turn");
                blink.hide = blink.hide || (opcode == 'looks_hide');
                blink.show = blink.show || (opcode == 'looks_show');
                if (opcode == 'control_wait') {
                    spin.wait = true;
                    blink.wait = true;
                }
            });
            // check if all all conditions in a script have been met for spinning or blinking
            if (Object.values(spin).reduce((acc, val) => acc && val, true)) this.extensions.spriteSpins.bool = true;
            if (Object.values(blink).reduce((acc, val) => acc && val, true)) this.extensions.spriteBlinks.bool = true;

            var event = script.blocks[0];
            //records the use of required events
            if (['event_whenflagclicked', 'event_whenthisspriteclicked', 'event_whenkeypressed'].includes(event.opcode) && !reqEvents.includes(event.opcode))
                reqEvents.push(event.opcode);
            // differentiates event key presses that use different keys
            if (event.opcode == "event_whenkeypressed") 
                event.opcode += event.fields.KEY_OPTION[0];
            // adds to list of unique events and scripts
            if (!events.includes(event.opcode)) {
                events.push(event.opcode);
                if (script.blocks.length > 1) 
                    validScripts++;
            }
            // checks if scripts outside of the required were used (only the first key pressed event is counted as required)
            if (!(['event_whenflagclicked', 'event_whenthisspriteclicked'].includes(event.opcode) || event.opcode.includes('event_whenkeypressed')) ||
                    (event.opcode.includes('event_whenkeypressed') && !events.includes(event.opcode))) {
                this.extensions.moreScripts.bool = true;
                console.log(event.opcode);
            }
        } 

        // check off how many sprites have met the requirements
        if (reqEvents.length >= 2 || validScripts >= 2) {
            for (var n of [1, 2, 3]) {
                if (this.requirements['spriteHasTwoEvents' + n].bool && this.requirements['spriteHasTwoScripts' + n].bool) 
                    continue;
                if (n !== 3) {
                    this.requirements['spriteHasTwoEvents' + (n + 1)].bool = this.requirements['spriteHasTwoEvents' + n].bool;
                    this.requirements['spriteHasTwoScripts' + (n + 1)].bool = this.requirements['spriteHasTwoScripts' + n].bool;
                }
                this.requirements['spriteHasTwoEvents' + n].bool = (reqEvents.length >= 2);
                this.requirements['spriteHasTwoScripts' + n].bool = (validScripts >= 2);
                break;
            }
        }
        return reqEvents;
    }

    grade(fileObj,user) {
        if (no(fileObj)) return; //make sure script exists
        this.init();        
        var project = new Project(fileObj);
        var reqEvents = [];
        for(var target of project.targets){
            if(target.isStage ){
                if (target.costumes.length > 1 || target.costumes[0].name !== 'backdrop1') 
                    this.requirements.choseBackdrop.bool = true;
                continue;
            }
            // calls the sprite grader while aggregating the total required events used
            reqEvents = [...new Set([...reqEvents, ...this.gradeSprite(target)])];
        }
        this.requirements.usesTheThreeEvents.bool = (reqEvents.length === 3);
        this.requirements.hasThreeSprites.bool = (project.targets.length - 1 >= 3);
    }
} 
},{"./scratch3":10}],8:[function(require,module,exports){
/* One Way Sync L1 Autograder
 * Marco Anaya, Spring 2019
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
		if(this.no(blocks) || blocks == {}) return null;
		
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

class GradeOneWaySyncL1 {

	constructor() {
		this.requirements = {};
		this.extensions = {};
	}

	initReqs() { //initialize all metrics to false
		this.requirements = {

			oneToOne: 
				{bool:false, str:'Djembe passes unique message to Mali child'},
			djembePlays: 
				{bool: false, str: 'When Djembe is clicked, Djembe plays music'},
			djembeToChild: 
				{bool: false, str: 'When Djembe is clicked, Mali child dances'},
			startButton: 
				{bool: false, str: 'Start button sprite created'},
			oneToMany: 
				{bool: false, str: 'Start button passes the same message to all other sprites'},
			startToDjembe: 
				{bool: false, str: 'When start button is clicked, Djembe plays music'},
			startToFlute: 
				{bool: false, str: 'When start button is clicked, Flute plays music'},
			startToMaliChild: 
				{bool: false, str: 'When start button is clicked, Mali child dances'},
			startToNavajoChild: 
				{bool: false, str: 'When start button is clicked, Navajo child dances'}
		};
	}
	initExts() {
		this.extensions = {
			changeWait: 
				{bool: false, str: 'Changed the duration of a wait block'},
			sayBlock: 
				{bool: false, str: 'Added a say block under another event'}
		}
	}

	grade(fileObj, user) { //call to grade project //fileobj is 
		this.initReqs();
		this.initExts();
		var sprites = {'Navajo Flute': null, 'Navajo child': null, 'Mali Djembe': null, 'Mali child': null};
		const targets = fileObj.targets;
		var spriteIsButton = true;
		
		// creates object of sprites, first non-default one is marked as the start button
		for (var target of targets) {
			if (target.isStage) {
				continue;
			}
			if (target.name in sprites) {
				sprites[target.name] = target;
			} else if (spriteIsButton) {
				sprites['Start Button'] = target;
				spriteIsButton = false;
			}
		}
		this.checkDjembeBroadcast(sprites)
		this.checkStartBroadcast(sprites);
		sprites = Object.values(sprites).filter(sprite => sprite != null);
		this.checkSayOnEvent(sprites);
		this.checkChangeWait(sprites);
	}

	/*
	 * Returns an array of two booleans:
	 *   whether the sprite received the message
	 *   whether it is playing a sound
	 */
	broadcastToPlay(sprite, message) {
		if (sb3.no(sprite)) {
			return;
		}
		var receivesMessage = false;
		const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

		if(whenReceiveBlocks) {
			for(var whenReceiveBlock of whenReceiveBlocks) {
				var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);

				if (script[0].fields.BROADCAST_OPTION[0] == message) {
					receivesMessage = true;
					for (var block of script) {
						if (['sound_play', 'sound_playuntildone'].includes(block.opcode)) {
							return [receivesMessage, true];
						}
					}
				}
			}
		}
		return [receivesMessage, false];
	}

	/* 
	 * Returns an array of two booleans:
	 *   whether the sprite received the message
	 *   whether it is dancing
	 */
	broadcastToDance(sprite, message) {
		if (sb3.no(sprite)) {
			return;
		}
		// if costume change and waitblock within a repeat loop, the sprite is dancing
		var animation = {constume: false, wait: false};
		var receivesMessage = false;

		const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

		if (whenReceiveBlocks) {
			for(var whenReceiveBlock of whenReceiveBlocks) {
				var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);

				if (script[0].fields.BROADCAST_OPTION[0] == message) {
					receivesMessage = true;

					for (var block of script) {
							if (block.opcode == 'control_repeat') {

							var sblock = block.inputs.SUBSTACK[1];
							while(sblock != null) {
								const sblockInfo = sprite.blocks[sblock];
								switch(sblockInfo.opcode) {
									case 'looks_switchcostumeto':
									case 'looks_nextcostume': {
										animation.costume = true;
										break;
									}
									case 'control_wait': {

										animation.wait = true;
									}
								}
								sblock = sblockInfo.next;
							}
						}
					}
				}
			}
		}
		return [receivesMessage, animation.costume && animation.wait];
	}

	/* Checks first part of lesson, whether djembe broadcasts to child */
	checkDjembeBroadcast({ 'Mali Djembe': djembe = null, 'Mali child': child = null}) {
		if (!djembe) return;
		
		var messageSent = false;
		var messageName = "";
		var djembePlaysDirectly = false;

		var whenClickedBlocks = sb3.findBlockIDs(djembe.blocks, 'event_whenthisspriteclicked');

		if(whenClickedBlocks) {
			for(var whenClickedBlock of whenClickedBlocks) {
				var script = sb3.makeScript(djembe.blocks, whenClickedBlock);
				for(var block of script){
					switch(block.opcode) {
						case 'sound_play':
						case 'sound_playuntildone': {
							djembePlaysDirectly = true;
							break;
						}
						case 'event_broadcast':
						case 'event_broadcastandwait': {
							messageSent = true;
							messageName = block.inputs.BROADCAST_INPUT[1][1];
						}
					} 
				}
			}  
			
			const [, djembePlaysBroadcast] = this.broadcastToPlay(djembe, messageName);
			// djembe can be played directly when sprite is clicked, or it can send a message to itself
			this.requirements.djembePlays.bool = djembePlaysDirectly || djembePlaysBroadcast;
		}
		// if message was sent, check if it was received and produced the desired result
		if (messageSent) {
			if (!child) 
				return;

			const [childReceives, childDances] = this.broadcastToDance(child, messageName);
			// checks whether the child receives the message and whether it is unique
			this.requirements.oneToOne.bool = childReceives && (messageName != 'Navajo');
			this.requirements.djembeToChild.bool = childDances;
		}
	}

	/* Checks second part of lesson, the creation and broadcasting of start sprite */
	checkStartBroadcast({ 'Mali Djembe': djembe, 
											  'Mali child': maliChild, 
											  'Navajo Flute': flute, 
											  'Navajo child': navajoChild, 
											  'Start Button': start = null }) {
		if (!start) {
			return;
		}

		this.requirements.startButton.bool = true;

		var messageSent = false;
		var messageName = "";
		var whenClickedBlocks = sb3.findBlockIDs(start.blocks, 'event_whenthisspriteclicked');

		if(whenClickedBlocks) {
			for(var whenClickedBlock of whenClickedBlocks) {
				var script = sb3.makeScript(start.blocks, whenClickedBlock);
				for(var block of script){
					if(['event_broadcast', 'event_broadcastandwait'].includes(block.opcode)) {
						messageSent = true;
						messageName = block.inputs.BROADCAST_INPUT[1][1];
					} 
				}
			}
		}
		// if message was sent, check if it was received and if it produced the desired results
		if(messageSent) {
			var receives = Array(4).fill(false);
			
			if (djembe) 
				[receives[0], this.requirements.startToDjembe.bool] = this.broadcastToPlay(djembe, messageName);
			if (flute)
				[receives[1], this.requirements.startToFlute.bool] = this.broadcastToPlay(flute, messageName);
			if (maliChild) 
				[receives[2], this.requirements.startToMaliChild.bool] = this.broadcastToDance(maliChild, messageName);
			if (navajoChild)
				[receives[3], this.requirements.startToNavajoChild.bool] = this.broadcastToDance(navajoChild, messageName);
				
			// if all sprites receive the same message, this requirement is satisfied
			if (djembe && flute && maliChild && navajoChild) 
				this.requirements.oneToMany.bool = receives.every(received => received === true);
		}
	}
	checkSayOnEvent(sprites) {
		if (sb3.no(sprites)) {
			return;
		}

		const eventOpcodes = [
			'event_whenflagclicked', 'event_whenthisspriteclicked','event_whenkeypressed', 
			'event_whenbackdropswitchesto','event_whengreaterthan'
		];
			
		for (const sprite of sprites) {
			var eventBlocks = [];
			for(const block in sprite.blocks){ 
				const blockInfo = sprite.blocks[block];
				if(eventOpcodes.includes(blockInfo.opcode)){

					eventBlocks.push(block);
				}
			}

			for (const eventBlock of eventBlocks) {
				const script = sb3.makeScript(sprite.blocks, eventBlock);
				for (const block of script) {
					if (['looks_say', 'looks_sayforsecs'].includes(block.opcode)) {
						this.extensions.sayBlock.bool = true;
						return;
					}
				}
			}
		}
	}

	checkChangeWait(sprites) {
		if (sb3.no(sprites)) {
			return;
		}

		for (const sprite of sprites) {
			const whenReceivedBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');
			for (const whenReceivedBlock of whenReceivedBlocks) {
				const script = sb3.makeScript(sprite.blocks, whenReceivedBlock);
				for (const block of script) {

					if (block.opcode == 'control_wait') {

						if (block.inputs.DURATION[1][1] != .5) {
							this.extensions.changeWait.bool = true;
						}
					}
				}
			}
		}
	}
}

module.exports = GradeOneWaySyncL1;
},{}],9:[function(require,module,exports){
/* Scratch Basics L1 Autograder
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
            
            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            
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

class GradeScratchBasicsL1 {

    constructor() {
        this.requirements = {};
    }

    grade(fileObj, user) { //call to grade project //fileobj is 
        this.initMetrics();
        
        var fred  = sb3.jsonToSpriteBlocks(fileObj, 'Fred'); 
        var helen = sb3.jsonToSpriteBlocks(fileObj, 'Helen');
        this.checkFred(fred);
        this.checkHelen(helen);  
    }

    initMetrics() { //initialize all metrics to false
        this.requirements = {
            changedSteps: {
                bool: false, str: 'Fred takes 100 steps each time he talks instead of 50.'
            },
            fredTalks: {
                bool: false, str: 'Fred uses a new block to say "Have fun!" to the user.'
            },
            timeChanged: {
                bool: false, str: 'Changed time between Helen\'s costume changes.'
            }
        };

    }

    checkFred(fred) {
        if (!fred) return;
        
        var stepcount = 0;
        var speakcount = 0;
        var havefun = false;
        var funs = ['Have fun!', 'have fun!', 'have Fun!', 'HAVE FUN', 'HAVE FUN!', 'have fun', 'Have fun', 'have Fun', 'Have Fun', 'Have Fun!']
        
        var blockids = sb3.findBlockIDs(fred, 'event_whenflagclicked');
        
        if(blockids != null){
            for(var block of blockids){
                var script = sb3.makeScript(fred, block)
                for(var sblock of script){
                    if(sblock['opcode'] == 'motion_movesteps' && sblock['inputs']['STEPS'][1][1] == 100){
                        stepcount++;
                        if(stepcount >= 3){
                            this.requirements.changedSteps.bool = true;
                        }
                    }
                    if (sblock['opcode'] == 'looks_sayforsecs'){ 
                        speakcount++;
                        if(funs.includes(sblock['inputs']['MESSAGE'][1][1])){ //check for have fun message
                            havefun = true;
                        }
                        if(havefun && speakcount >= 4){ //check that new block was added
                            this.requirements.fredTalks.bool = true;
                        }
                    }  
                }
            }  
        }
    }

    checkHelen(helen) {
        if (!helen) return;
        
        var blockids = sb3.findBlockIDs(helen, 'event_whenkeypressed');
        
        for(var block of blockids){
            var script = sb3.makeScript(helen, block)

            for(var sblock of script){
                if(sblock['opcode'] == 'control_wait' && sblock['inputs']['DURATION'][1][1] > 1){
                    this.requirements.timeChanged.bool = true
                    return
                }
            }
        }  
    }
}


module.exports = GradeScratchBasicsL1;
},{}],10:[function(require,module,exports){
(function (global){
/// Scratch 3 helper functions
require('./context');

/// Returns false for null, undefined, and zero-length values.
global.is = function(x) { 
    return !(x == null || x === {} || x === []);
}

/// Opposite of is().
global.no = function(x) {
    return !is(x);
}

/// Container class for Scratch blocks.
global.Block = class {
    constructor(target, block) {
        Object.assign(this, target.blocks[block]);
        this.id = block;
        this.context = new Context(target.context, false);
        this.target = target;
    }

/// Internal function that converts a block to a Block.
    toBlock(x) {
        return new Block(this.target, x);
    }

/// Returns the next block in the script.
    nextBlock() {
        if (no(this.next)) return null;
        
        return this.toBlock(this.next);
    }

/// Returns the previous block in the script.
    prevBlock() {
        if (no(this.parent)) return null;

        return this.toBlock(this.parent);
    }

/// Returns the conditional statement of the block, if it exists.
    conditionBlock() {
        if (no(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1]);
    }

/// Returns an array representing the script that contains the block.
    childBlocks() {     
        var array = [];
        var x = this;
        while (x) {
            array.push(x);
            x = x.nextBlock();
        }
        return array;
    }

/// Returns an array of Scripts representing the subscripts of the block.
    subScripts() {
        if (no(this.inputs)) return [];
        var array = [];

        if (is(this.inputs.SUBSTACK) && is(this.inputs.SUBSTACK[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK[1]), this.target));
        }
        if (is(this.inputs.SUBSTACK2) && is(this.inputs.SUBSTACK2[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK2[1]), this.target));
        }
        return array;
    }
}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block, target) {
        this.blocks  = block.childBlocks();
        this.target  = target;
        this.context = new Context(target.context, false);
        for (var block of this.blocks) {
            this.context.sublayers.push(block.context);
        }
    }
}

/// Container class for Scratch targets (stages & sprites).
global.Target = class {
    constructor(target_, project) {
        this.project = project;
        this.context = new Context(project.context, false);
        Object.assign(this, target_);
        if (no(target_.blocks)) this.blocks = {};
        this.scripts = [];
        for (var block_ in this.blocks) {
            var block = new Block(target_, block_);
            this.blocks[block_] = block;
            if (!(block.prevBlock())) this.scripts.push(new Script(block, this));
        }
        for (var script of this.scripts) {
            this.context.sublayers.push(script.context);
        }
    }
}

/// Container class for a whole project.
global.Project = class {
    constructor(json, items) {
        this.context = new Context(items, false);
        this.targets = [];
        this.sprites = [];
        for (var target_ of json.targets) {
            var target = new Target(target_, this);
            this.targets.push(target);
            if (!target_.isStage) this.sprites.push(target); 
        }
        for (var target of this.targets) {
            this.context.sublayers.push(target.context);
        }
    }
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./context":4}],11:[function(require,module,exports){
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

/// Max White
class GradeTwoWaySyncL1 {

    constructor() {
        this.requirements = {};
    }

    grade(fileObj, user) {
        this.initMetrics();
        this.checkSync(fileObj);
    }

    initMetrics() {
        this.requirements = {
            isDialogueSynced: {
                bool: true, str: 'Text messages are correctly synchronized.'
            },
            areMessagesAdded: {
                bool: false, str: 'One additional text message has been added to each sprite.'
            }
        };
        this.extensions = {
            evenMoreMessages: {
                bool: false, str: 'Added more than one additional text message to each sprite.'
            },
            changedSounds: {
                bool: false, str: 'Changed the "boing" or "pop" sound to something else.'
            },
        }
    }

    checkSync(fileObj) {

        /// Find the relevant sprites for this project.
        var basketball = fileObj.targets.find(function(target) {
            return target.name === 'Basketball';
        });
        var rainbow = fileObj.targets.find(function(target) {
            return target.name === 'Rainbow';
        });
        if (basketball === undefined || rainbow === undefined) {
            /// TODO: Signal a mistake
            return;
        }

        /// Iterate through the basketball's scripts and note the times (in seconds) at which it speaks.
        var basketballTime = 0;
        var basketballThinkTimes = [];
        var blockIDs = sb3.findBlockIDs(basketball.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(basketball.blocks, blockID);
                basketballTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        basketballTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        basketballThinkTimes.push(basketballTime);
                        basketballTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// Do the same for the rainbow.
        var rainbowTime = 0;
        var rainbowThinkTimes = [];
        blockIDs = sb3.findBlockIDs(rainbow.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(rainbow.blocks, blockID);
                rainbowTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        rainbowTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        rainbowThinkTimes.push(rainbowTime);
                        rainbowTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// We can check now if enough (or extra) messages have been added.
        var basketballThoughts = basketballThinkTimes.length;
        var rainbowThoughts = rainbowThinkTimes.length;
        this.requirements.areMessagesAdded.bool = (basketballThoughts > 1) && (rainbowThoughts > 1);
        this.extensions.evenMoreMessages.bool = (basketballThoughts > 2) && (rainbowThoughts > 2);

        /// Now we can see if the dialogue is synced by comparing the thinkTime arrays. The basketball goes first.
        if (!basketballThoughts || !rainbowThoughts) this.requirements.isDialogueSynced.bool = false;
        for (var i = 0; i < basketballThoughts && i < rainbowThoughts; i++) {
            if (basketballThinkTimes[i] >= rainbowThinkTimes[i]) {
                this.requirements.isDialogueSynced.bool = false;
            }
        }

        /// Finally, we check if there are any sounds aside from 'boing' or 'pop.'
        var sprites = [basketball, rainbow];
        for (var sprite of sprites) {
            if (sprite.sounds != null) {
                for (var sound of sprite.sounds) {
                    if (sound.name !== 'boing' && sound.name !== 'pop') {
                        this.extensions.changedSounds.bool = true;
                    }
                }
            }
        }
    }
}

module.exports = GradeTwoWaySyncL1;
},{}],12:[function(require,module,exports){
/// Provides necessary scripts for index.html.

/// Requirements (scripts)
var graders = {
  scratchBasicsL1: { name: 'Scratch Basics L1',      file: require('./grading-scripts-s3/scratch-basics-L1') },
  animationL1:     { name: 'Animation L1',           file: require('./grading-scripts-s3/animation-L1')      },
  animationL2:     { name: 'Animation L2',           file: require('./grading-scripts-s3/animation-L2')      },
  eventsL1:        { name: 'Events L1',              file: require('./grading-scripts-s3/events-L1')         },
  eventsL2:        { name: 'Events L2',              file: require('./grading-scripts-s3/events-L2')         },
  condLoopsL1:     { name: 'Conditional Loops L1',   file: require('./grading-scripts-s3/cond-loops-L1')        },
  decompL1:        { name: 'Decomp. by Sequence L1', file: require('./grading-scripts-s3/decomp-L1')         },
  oneWaySyncL1:    { name: 'One-Way Sync L1',        file: require('./grading-scripts-s3/one-way-sync-L1')   },
  oneWaySyncL2:    { name: 'Two-Way Sync L2',        file: require('./grading-scripts-s3/two-way-sync-L2')   },
};

/// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

/* Stores the grade reports. */
var reports_list = [];
/* Number of projects scanned so far. */
var project_count = 0;
/* Number of projects that meet requirements. */
var passing_projects = 0;
/* Number of projects that meet requirements and extensions */
var complete_projects = 0;
/* Grading object. */
var gradeObj = null;

var IS_LOADING = false;

/// HTML helpers
///////////////////////////////////////////////////////////////////////////////////////////////////

/// Helps with form submission.
window.formHelper = function() {
  /// Blocks premature form submissions.
  $("form").submit(function() { return false; });
  /// Maps enter key to grade button.
  $(document).keypress(function(e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fillUnitsHTML = function() {
  var HTMLString = '';
  for (var graderKey in graders) {
    HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>'
    HTMLString += '<label class = "unitlabel">';
    HTMLString += '<img src="pictures/' + graderKey + '.png">';
    HTMLString += graders[graderKey].name;
    HTMLString += '</label> </a>';
  }
  document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/* Initializes html and initiates crawler. */
window.buttonHandler = async function() {
  if (IS_LOADING) return;
  if(!gradeObj) return unitError();
  init();
  document.getElementById('wait_time').innerHTML = "Loading...";
  IS_LOADING = true;
  var requestURL = document.getElementById('inches_input').value;
  var studioID = parseInt(requestURL.match(/\d+/));
  crawl(studioID, 0, []);
}

/* Initializes global variables. */
function init() {

  /// HTML
  document.getElementById('process_button').blur();
  clearReport();
  noError();
  hideProgressBar();

  /// Globals
  reports_list = [];
  project_count = 0;
  crawl_finished = false;
  cross_org = true;
  grade_reqs = {};
  passing_projects = 0;
  complete_projects = 0;
}

$(document).ready(function(){
  $('.unitselector').click(function() {
    $(this).addClass('selected');
    $(this).children().addClass('selected');
    $(this).siblings().removeClass('selected');
    $(this).siblings().children().removeClass('selected');
  });
});

window.drop_handler = function(graderKey) {
  gradeObj = new graders[graderKey].file;
  console.log("Selected " + graders[graderKey].name);
}

window.onclick = function(event) {
  if(event.target.matches('.dropdown_btn')) {
    return;
  }

  if (event.target.matches('#process_button')) {
    $('html, body').animate({
      scrollTop: 750
    }, 800);
  }

  var droplinks = document.getElementsByClassName("dropdown_menu");
  [...droplinks].forEach(function(element) {
    if(element.classList.contains('show')) {
      element.classList.remove('show');
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Project retrieval and grading
///////////////////////////////////////////////////////////////////////////////////////////////////

class ProjectIdentifier {
  constructor(projectOverview) {
    this.id = projectOverview.id;
    this.author = projectOverview.author.id;
  }
}

function get(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = resolve;
    request.onerror = reject;
    request.send();
  });
}

async function crawl(studioID, offset, projectIdentifiers) {
    if (!offset) console.log('Grading studio ' + studioID);
    get('https://chord.cs.uchicago.edu/scratch/studio/' + studioID + '/offset/' + offset)
    .then(function(result) {
        var studioResponse = JSON.parse(result.target.response);
        /// Keep crawling or return?
        if (studioResponse.length === 0) {
            keepGoing = false;
            if (!project_count) {
              document.getElementById('wait_time').innerHTML = 
                'No Scratch 3.0+ projects found. Did you enter a valid Scratch studio URL?';
              IS_LOADING = false;
            }
            for (var projectIdentifier of projectIdentifiers) {
                gradeProject(projectIdentifier);
            }
            return;
        }
        else {
            for (var projectOverview of studioResponse) {
                projectIdentifiers.push(new ProjectIdentifier(projectOverview));
            }
            crawl(studioID, offset + 20, projectIdentifiers);
        }
    });
}

function gradeProject(projectIdentifier) {
    var projectID = projectIdentifier.id;
    var projectAuthor = projectIdentifier.author;
    console.log('Grading project ' + projectID);
    get('https://chord.cs.uchicago.edu/scratch/project/' + projectID)
    .then(function(result) {
        var project = JSON.parse(result.target.response);
        if (project.targets === undefined) {
          console.log('Project ' + projectID + ' could not be found');
          return;
        }
        try {
          analyze(project, projectAuthor, projectID);
        }
        catch (err) {
          console.log('Error grading project ' + projectID);
          /// console.log(err);
        }
        printReportList();
    });
}

function analyze(fileObj, user, id) {
  try {
      gradeObj.grade(fileObj, id);     
  }
  catch (err) {
      console.log('Error grading project ' + id);
  }
  report(id, gradeObj.requirements, gradeObj.extensions, user);
  project_count++;
  console.log(project_count);
  
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Reporting results
///////////////////////////////////////////////////////////////////////////////////////////////////

/* Prints a line of grading text. */
function appendText(string_list) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  var HTMLString = '';
  for (var string of string_list) {
    HTMLString += '<br>';
    HTMLString += string;
  }
  HTMLString += '<br>';

  tbi.style.width = "100%";
  tbi.style.fontSize = "14px";
  tbi.style.fontWeight = "normal";
  tbi.innerHTML = HTMLString;

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a series of consecutive project reports. */
function printReportList() {
  clearReport();
  sortReport();
  printColorKey();
  showProgressBar();
  for (var report of reports_list) {
    appendText(report);
  }
  checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
  var removeables = document.getElementsByClassName('lines');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* Prints progress bar. */
function showProgressBar() {
  document.getElementById('myProgress').style.visibility = "visible";
  setProgress(document.getElementById('greenbar'), complete_projects, project_count, 0);
  setProgress(document.getElementById('yellowbar'), passing_projects, project_count, 1);
  setProgress(document.getElementById('redbar'), project_count - complete_projects - passing_projects, project_count, 2);
}

/* Hides progress bar. */
function hideProgressBar() {
  document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key.*/
function printColorKey() {
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.innerHTML = "results:";
}

/* Update progress bar segment to new proportion. */
function setProgress(bar,projects,total_projects,color) {
  var width_percent = ((projects/total_projects)*100);
  bar.style.width = width_percent + '%';
  if (projects && color === 0) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' done';
  }
  else if (projects && color === 1) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' almost done';
  }
  else if (projects && color === 2) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' need time or help';
  }
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
  return (bool) ? ('✔️') : ('❌');
}

/* Adds results to reports_list and prints. */
function report(pID, reqs, exts, user) {
  var ret_list = [];
  var project_complete = true;
  var passed_reqs_count = 0;

  /* Makes a string list of grading results. */
  ret_list.push('Project ID: <a href="https://scratch.mit.edu/projects/' + pID + '">' + pID + '</a>');
  ret_list.push('Requirements:');
  for (var x in reqs) {
      if (!reqs[x].bool) project_complete = false;
      else passed_reqs_count++;
      ret_list.push(checkbox(reqs[x].bool) + ' - ' + reqs[x].str);
  }
  if (exts) {
      ret_list.push('Extensions:')
      for (var x in exts) {
          ret_list.push(checkbox(exts[x].bool) + ' - ' + exts[x].str);
      }
  }
  ret_list.push('');
  reports_list.push(ret_list);

  /* Adjusts class progress globals. */
  if (project_complete) complete_projects++;
  else if (passed_reqs_count >= (Object.keys(reqs).length / 2)) passing_projects++;        
}

/* Checks if process is done.  */
function checkIfComplete() {
  if (project_count) document.getElementById('wait_time').innerHTML = '';
  else document.getElementById('wait_time').innerHTML = 'No Scratch 3.0+ projects found. Did you enter a valid Scratch studio URL?';
  IS_LOADING = false;
  console.log("Done.");
}

/* Sorts the reports in reports_list alphabetically
 username. */
function sortReport() {
reports_list.sort(function(a,b) {
  return a[0].localeCompare(b[0]);
})
}


///////////////////////////////////////////////////////////////////////////////////////////////////

/// Error reports
///////////////////////////////////////////////////////////////////////////////////////////////////

function linkError() {
  document.getElementById('myProgress').style.visibility = "hidden";
  var processObj = document.getElementById('process_error');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "error: invalid link.";
  document.getElementById('wait_time').innerHTML = "";
  IS_LOADING = false;
}

function unitError() {
  var processObj = document.getElementById('process_error');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "Please select a unit.";
  IS_LOADING = false;
}

function noError() {
  document.getElementById('process_error').innerHTML = "";
  document.getElementById('process_error').style.visibility = 'hidden';
}

///////////////////////////////////////////////////////////////////////////////////////////////////
},{"./grading-scripts-s3/animation-L1":1,"./grading-scripts-s3/animation-L2":2,"./grading-scripts-s3/cond-loops-L1":3,"./grading-scripts-s3/decomp-L1":5,"./grading-scripts-s3/events-L1":6,"./grading-scripts-s3/events-L2":7,"./grading-scripts-s3/one-way-sync-L1":8,"./grading-scripts-s3/scratch-basics-L1":9,"./grading-scripts-s3/two-way-sync-L2":11}]},{},[12]);
