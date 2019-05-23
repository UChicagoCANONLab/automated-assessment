(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* --- Contains web-crawling functions. --- */
var web = require('./web');
var my = module.exports;
/* Parses out link to studio and initiates crawl. */
function crawlFromStudio(string) {

  /* Variables */
  var id = 0;
  var page = 1;
  var res = string.split("/");

  /* Retrieve studio ID. */
  res.forEach(function(element) {
    if(/^\d+$/.test(element)) {
      id = element;
    }
  });

  /* Check for invalid URL. */
  if (id == 0) {
    linkError();
    return;
  }
  return id;
}

/* || Work In Progress || */
function testCrossOrg(id) {
  var newurl = "https://scratch.mit.edu/site-api/projects/in/" + id + "/1/";
  var request = new XMLHttpRequest();
  request.open('GET', newurl);
  request.send();

  /* Handle response. */
  request.onload = function() {
    if(request.status != 200) {
      cross_org = false;      
      console.log(cross_org);
      return;
    }
    console.log(cross_org);
    console.log(request.response);
  }
}

/* Requests html from a studio page and recursively checks other studio pages. */
function crawl(id, page) {
  
  /* Prepare link and send request. */
  var newurl = "https://scratch.mit.edu/site-api/projects/in/" + id + "/" + page + "/";
  var request = new XMLHttpRequest();
  request.open('GET', newurl);
  request.send();

  /* Handle response. */
  request.onload = function() {
    if(request.status != 200) {
      transferFailed(page);
      return;
    }
    var project = request.response;

    collectLinks(project);
    crawl(id, page + 1);
  }

  /* Handle error. */
  request.onerror = function() {
    clearReport();
    linkError();
  }
}

/*Recursively builds an array of projects.*/
my.crawlS3 = async function(studioID, offset, projects) {

    var studioRequestURL = 'https://chord.cs.uchicago.edu/studios3/' + studioID + '/' + offset + '/';
    var studioRequest = new XMLHttpRequest();
    studioRequest.open('GET', studioRequestURL);
    studioRequest.send();
    studioRequest.onload = 
        function() {
            var studioResponse = JSON.parse(studioRequest.response);
            if (studioResponse.length === 0) {
                return Promise.all(projects);
            }
            else {
                for (var projectOverview of studioResponse) {
                    projects.push(
                        web.promiseResource('https://chord.cs.uchicago.edu/projects3/' + projectOverview.id));
                }
                return my.crawlS3(studioID, offset + 20, projects);
            }}}

/* Logs unsuccessful transfer (generally intentional). */
function transferFailed(page) {
  console.log("XML transfer terminated on page " + page + ".");

  if(page == 1) {
    linkError();
  }
  else{
    crawl_finished = true;
    checkIfComplete();
  }
}

/* Collects links to project pages from studio html and initiates JSON recovery. */
function collectLinks(source) {
  /* Constants. */
  var pre = "https://chord.cs.uchicago.edu/";

  /* Fetches project links and initiates JSON recovery for each. */
  var doc = document.createElement( 'html' );
  doc.innerHTML = source;
  var thumb_items = doc.getElementsByClassName('project thumb item');
  project_count += [...thumb_items].length;
  
  [...thumb_items].forEach(function(item){
    var id = item.getAttribute('data-id');
    var ret_val = pre + id;
    var name;
    try {
      name = item.getElementsByClassName("owner")[0].children[0].innerHTML;
    }
    catch(err) {
      name = '[undefined]';
    }
    getJSON(ret_val,analyze,[name,id]);
  });
}

/* Request project jsons and initiate analysis. */
function getJSON(requestURL,process_function, args){
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
      var project = request.response;
      args.unshift(project)
      process_function.apply(null,args);
    }
}
},{"./web":13}],2:[function(require,module,exports){
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
        // checks for race winner
        this.requirements.BeeReachesFinish = {bool:false, str:'Bee reaches the finish line.'};;
        
    }
    
    initExts() {
        // checks for extra components
        
        this.extensions.HasWinner = {bool: false, str:'There is a true winner to the race.'}
        
        // victory dance, turn block
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
        // for private method
        var that = this;

        
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
                    if (numLoops == 1){
                        //check for wiggly path (turn blocks in first loop)
                        if (beeSpaceScript[i]['opcode'].includes('motion_turn')) {
                            this.extensions.BeeWiggle.bool = true;
                        }
                            //get stats reaching finish and winner
                        if (beeSpaceScript[i]['opcode'] == 'control_repeat') {
                            beeRepeats += Number(beeSpaceScript[i]['inputs']['TIMES'][1][1]);
                        
                        }
                        if (beeSpaceScript[i]['opcode'] == 'motion_movesteps') {
                            beeSteps += Number(beeSpaceScript[i]['inputs']['STEPS'][1][1]);
                          
                        }
                        if (beeSpaceScript[i]['opcode'] == 'control_wait'){
                            beeWait += Number(beeSpaceScript[i]['inputs']['DURATION'][1][1]);
                           
                        }
                        
                    }
                    
                    //check for reaching finish
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
           var snakekeyid = sb3.findKeyPressID(snake['blocks'], 'space');

            if(snakekeyid != null){
                numLoops = 0;
                snakeSpaceScript = sb3.makeScript(snake['blocks'], snakekeyid,true);
                for(var i in snakeSpaceScript){  
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
           var fourthkeyid = sb3.findKeyPressID(fourth['blocks'], 'space');

            if(fourthkeyid != null){
                numLoops = 0;
                fourthSpaceScript = sb3.makeScript(fourth['blocks'], fourthkeyid,true);
                for(var i in fourthSpaceScript){  
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
        
            var events = sb3.typeBlocks(fourth['blocks'], "event_");
            for (var b in events) {
                var script = sb3.makeScript(fourth['blocks'],b,true);
                if (sb3.checkAnimation(script)) {
                    this.extensions.AnimatedFourthSprite.bool = true;
                }
            }
            
                                               
    }
    
    
//FINAL GRADING: ------------------------------   
        if (bee == null || snake == null || kangaroo == null) {
            return;
        }
        
        var beeSpeed = (beeSteps / beeWait)*beeRepeats;
        var snakeSpeed = (snakeSteps / snakeWait)*snakeRepeats;
        var kangarooSpeed = (kangarooSteps / kangarooWait)*snakeRepeats;
        
        
        
        /*
        //find a winner
        if (beeSpeed > snakeSpeed) {
            if (snakeSpeed > kangarooSpeed || beeSpeed > kangarooSpeed) {
                winner = bee;
                winnerSpaceScript = beeSpaceScript;
            } else if (beeSpeed < kangarooSpeed) {
                winner = kangaroo;
                winnerSpaceScript = kangarooSpaceScript;
            }
        } else if (snakeSpeed > beeSpeed) {
            if (beeSpeed > kangarooSpeed || snakeSpeed > kangarooSpeed) {
                winner = snake;
                winnerSpaceScript = snakeSpaceScript;
            } else if (snakeSpeed < kangarooSpeed) {
                winner = kangaroo;
                winnerSpaceScript = kangarooSpaceScript;
            }   
        }
        */
        
        //find a winner
        
        var speeds = [beeSpeed,snakeSpeed,kangarooSpeed];
        speeds.sort();
        speeds.reverse();
        
        
        
        if (speeds[0] != speeds[1]) {
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
                if (numLoops > 1) { //in second part
                    if(winnerSpaceScript[i]['opcode'] == 'looks_switchcostumeto' || winnerSpaceScript[i]['opcode'] == 'looks_nextcostume'){
                        this.extensions.WinnerVictoryDanceCostume.bool = true;
                    }
                    if (winnerSpaceScript[i]['opcode'].includes('motion_turn')){
                        this.extensions.WinnerVictoryDanceTurn.bool = true;
                    }

                }
                
                
            }
            
             
        }
        
        

        
        
        
    
    }


}
module.exports = GradeAnimation;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
        var jaimeid = sb3.findBlockIDs(jaime['blocks'], 'event_whenflagclicked');
        if(jaimeid != null){
            var jaimeScript = sb3.makeScript(jaime['blocks'], jaimeid);
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
        for(i in ballids){
            var ballScript = sb3.makeScript(ball['blocks'], ballids[i]);
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
        for(i in flags){
            var goalScript = sb3.makeScript(goal['blocks'], flags[i]);
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


},{}],7:[function(require,module,exports){
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
        this.requirements.HaveBackdrop = {bool: false, str: "Background has an image."};
        this.requirements.HaveThreeSprites ={bool: false, str: "There are three sprites."};
        this.requirements.SpriteOneTwoEvents = {bool: false, str: "Sprite 1 has at least two events."};
        this.requirements.SpriteTwoTwoEvents = {bool: false, str: "Sprite 2 has at least two events."};
        this.requirements.SpriteThreeTwoEvents = {bool: false, str: "Sprite 3 has at least two events."};
        this.requirements.SpriteOneTwoScripts = {bool: false, str: "Sprite 1 events have actions."};
        this.requirements.SpriteTwoTwoScripts = {bool: false, str: "Sprite 2 events have actions."};
        this.requirements.SpriteThreeTwoScripts = {bool: false, str: "Sprite 3 events have actions."};
        
    }
     
    initExts() {
        this.extensions.SpriteSpins = {bool: false, str: "A sprite spins (uses turn block)"};
        this.extensions.MoreScripts = {bool: false, str: "A sprite reacts to more events."};
        this.extensions.SpriteBlinks = {bool: false, str: "A sprite blinks (use hide, show, and wait blocks)."}
    }
    
    grade(fileObj,user) {
        
        this.initReqs();
        this.initExts();
        
        //count and create sprites
        if (sb3.no(fileObj)) return; //make sure script exists
        
        var Sprites = [];
        
        var projInfo = fileObj['targets'] //extract targets from JSON data
        
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
            } else {
                if (projInfo[i]['costumes'].length > 1) {
                    this.requirements.HaveBackdrop.bool = true;
                }
            }
        }
        
        //check for enough sprites
        if (Sprites.length > 2) {
            this.requirements.HaveThreeSprites.bool = true;
        }
        
        
        for(var s=0; s < Sprites.length; s++) { //iterate sprites
            var sprite = Sprites[s];
            var events = [];
            var valids = [];
            
           
            var scripts = sprite.getScripts();
            
            var keyPressEvents = [];
            for (var p=0; p <scripts.length; p++){ //iterate scripts
                
                var hide = false;
                var show = false;
                var wait = false;
                var turn = false;
                
            
                for(var b in scripts[p]) {//iterate blocks
                    
                    var opcode = scripts[p][b]['opcode'];
        
                    
                    //check for turning
                    if (opcode.includes("motion_turn")) {
                        turn = true;
                    }
                    
                    //check for hide
                    if (opcode == 'looks_hide') {
                        hide = true;
                    }
                    
                    //check for show
                    if (opcode == 'looks_show') {
                        show = true;
                    }
                    
                    //check for wait
                    if (opcode == 'control_wait') {
                        wait = true;
                    }
                    
                    //count unique events
                    if (opcode.includes("event_")) {
                        
                        //count unique key press events
                        if (opcode == "event_whenkeypressed") {
                           if (!events.includes(opcode+scripts[p][b]['fields']['KEY_OPTION'][0])) {
                               events.push(opcode+scripts[p][b]['fields']['KEY_OPTION'][0]);
                               if (Object.keys(scripts[p]).length > 1) {
                                   valids.push(scripts[p][b]);
                               }
                           }
                        } else if (opcode == 'event_whenthisspriteclicked' || opcode == 'event_whenflagclicked') { //count other events
                            if (!events.includes(opcode)) {
                                events.push(opcode);
                                if (Object.keys(scripts[p]).length > 1) {
                                   valids.push(scripts[p][b]);
                                }
                            } 
                
                        }
                        
                    }
                    
                    
                    
                } //end of blocks loop
                
                 //check spins
                if (turn && wait) {
                    this.extensions.SpriteSpins.bool = true;
                }

                //check blinks
                if (hide && show && wait) {
                    this.extensions.SpriteBlinks.bool = true;
                }
            
            
        
            }  //end of scripts loop
            

            //check for enough unique events
            if (events.length > 1){
                switch(s) {
                    case 0: this.requirements.SpriteOneTwoEvents.bool = true; 
                            break;
                    case 1: this.requirements.SpriteTwoTwoEvents.bool = true; 
                            break;
                    case 2: this.requirements.SpriteThreeTwoEvents.bool = true; 
                            break;
                    default: break;
                }  
            }
            
            
            //check for enough valid scripts
            if(valids.length > 1) {
                switch(s) {
                    case 0: this.requirements.SpriteOneTwoScripts.bool = true; 
                            break;
                    case 1: this.requirements.SpriteTwoTwoScripts.bool = true; 
                            break;
                    case 2: this.requirements.SpriteThreeTwoScripts.bool = true; 
                            break;
                    default: break;
                }
            }
            
            if (valids.length > 2) {
                this.extensions.MoreScripts.bool = true;
            }
            
            
            
    
        }
    }

}
    
module.exports = GradeEvents;
    
},{}],8:[function(require,module,exports){
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

class GradeOneWaySyncL1 {

    constructor() {
        this.requirements = {};
        this.extentions = {};
    }

    initReqs() { //initialize all metrics to false
        this.requirements = {
            oneToOne: { bool:false, str:'Djembe passes unique message to Mali child'
            },
            djembePlays: {
                bool: false, str: 'When Djembe is clicked, Djembe plays music'
            },
            djembeToChild: {
                bool: false, str: 'When Djembe is clicked, Mali child dances'
            },
            startButton: {
                bool: false, str: 'Start button sprite created'
            },
            oneToMany: {
                bool: false, str: 'Start button passes the same message to all other sprites'
            },
            startToDjembe: {
                bool: false, str: 'When start button is clicked, Djembe plays music'
            },
            startToFlute: {
                bool: false, str: 'When start button is clicked, Flute plays music'
            },
            startToMaliChild: {
                bool: false, str: 'When start button is clicked, Mali child dances'
            },
            startToNavajoChild: {
                bool: false, str: 'When start button is clicked, Navajo child dances'
            }
        };
    }

    /*
     * Helper function that takes a sprite and a message to determine whether the sprite 
     * has received that message and whether it has caused the sprite to play a sound
     * 
     * Returns an array of two booleans:
     *   whether the sprite received the message
     *   whether it is playing a sound
     */
    receivesMessageAndPlays(sprite, message) {

        var receivesMessage = false;

        const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

        if(whenReceiveBlocks) {
            for(var whenReceiveBlock of whenReceiveBlocks) {
                var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);
                console.log(script[0]);
                if (script[0].fields.BROADCAST_OPTION[0] == message) {
                    receivesMessage = true;
                    for (var block of script) {
                        if (block.opcode == 'sound_play' || block.opcode == 'sound_playuntildone') {
                            return [receivesMessage, true];
                        }
                    }
                }
            }
        }
        return [receivesMessage, false];
    }

    /*
     * Helper function that takes a sprite and a message to determine whether the sprite 
     * has received that message and whether it has caused the sprite to dance
     * 
     * Returns an array of two booleans:
     *   whether the sprite received the message
     *   whether it is dancing
     */
    receivesMessageAndDances(sprite, message) {
        // if costume change and waitblck within a repeat loop, the sprite is dancing
        var changeCostume = false;
        var waitBlock = false;
        var receivesMessage = false;
        console.log(sprite);
        const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

        if (whenReceiveBlocks) {
            for(var whenReceiveBlock of whenReceiveBlocks) {
                var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);

                if (script[0].fields.BROADCAST_OPTION[0] == message) {
                    receivesMessage = true;

                    for (var block of script) {
                        // if repeat block is found, 
                        // look for inner loop for wait block and costume change
                        if (block.opcode == 'control_repeat') {

                            var sblock = block.inputs.SUBSTACK[1];
                            while(sblock != null) {
                                const sblockInfo = sprite.blocks[sblock];
                                switch(sblockInfo.opcode) {
                                    case 'looks_switchcostumeto':
                                    case 'looks_nextcostume': {
                                        changeCostume = true;
                                        break;
                                    }
                                    case 'control_wait': {
                                        waitBlock = true;
                                    }
                                }
                                sblock = sblockInfo.next;
                            }
                        }
                    }
                }
            }
        }
        return [receivesMessage, changeCostume && waitBlock];
    }

    /* Checks first part of lesson, whether djembe broadcasts to child */
    checkDjembeBroadcast({ 'Mali Djembe': djembe, 'Mali child': child}) {
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
            
            const [, djembePlaysBroadcast] = this.receivesMessageAndPlays(djembe, messageName);
            // djembe can be played directly when sprite is clicked, or it can send a message to itself
            this.requirements.djembePlays.bool = djembePlaysDirectly || djembePlaysBroadcast;
        }
        // if message was sent, check if it was received and produced the desired result
        if (messageSent) {
            if (!child) 
                return;

            const [childReceives, childDances] = this.receivesMessageAndDances(child, messageName);
            // checks whether the child receives the message and whether it is unique
            this.requirements.oneToOne.bool = childReceives && (messageName != 'Navajo');
            this.requirements.djembeToChild.bool = childDances;
        }
    }

    /* Checks second part of lesson, the creation and broadcasting of start sprite */
    checkStartBroadcast({ 'Mali Djembe': djembe, 
                          'Mali child': maliChild, 
                          'Navajo Flute': flute, 
                          'Navajo child': navajoChild, // assumes all default sprites exist
                          'Start Button': start = null}) {
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
            const [djembeReceives, djembePlays] = this.receivesMessageAndPlays(djembe, messageName);
            const [fluteReceives, flutePlays] = this.receivesMessageAndPlays(flute, messageName);
            const [maliChildReceives, maliChildDances] = this.receivesMessageAndDances(maliChild, messageName);
            const [navajoChildReceives, navajoChildDances] = this.receivesMessageAndDances(navajoChild, messageName);
            // if all sprites receive the same message, this requirement is satisfied
            this.requirements.oneToMany.bool = djembeReceives && 
                                               fluteReceives && 
                                               maliChildReceives && 
                                               navajoChildReceives;

            this.requirements.startToDjembe.bool = djembePlays;
            this.requirements.startToFlute.bool = flutePlays;
            this.requirements.startToMaliChild.bool = maliChildDances;
            this.requirements.startToNavajoChild.bool = navajoChildDances;
        }
    }

    grade(fileObj, user) { //call to grade project //fileobj is 
        this.initReqs();
        var sprites = {};
        const spriteNames = ['Navajo Flute', 'Navajo child', 'Mali Djembe', 'Mali child'];
        const targets = fileObj.targets;

        var spriteIsButton = true;
        
        // creates object of sprites, first non-default one is marked as the start button
        for (var i = 1; i < targets.length; i++) {
            if (spriteNames.includes(targets[i]['name']))
                sprites[targets[i]['name']] = targets[i];
            else if (spriteIsButton) {
                sprites['Start Button'] = targets[i];
                spriteIsButton = false;
            }
        }
        console.log(sprites);
        this.checkDjembeBroadcast(sprites)
        this.checkStartBroadcast(sprites);
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
                        if(sblock['inputs']['MESSAGE'][1][1]  == 'Have fun!' || sblock['inputs']['MESSAGE'][1][1]  == 'have fun!' || sblock['inputs']['MESSAGE'][1][1]  == 'have fun' || sblock['inputs']['MESSAGE'][1][1]  == 'Have fun'){ //check for have fun message
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
},{}],11:[function(require,module,exports){
/// Requirements (scripts)
var crawler = require('./crawler');
var graders = {
  scratchBasicsL1: { name: 'Scratch Basics L1',      file: require('./grading-scripts-s3/scratch-basics-L1') },
  animationL1:     { name: 'Animation L1',           file: require('./grading-scripts-s3/animation-L1')      },
  animationL2:     { name: 'Animation L2',           file: require('./grading-scripts-s3/animation-L2')      },
  eventsL1:        { name: 'Events L1',              file: require('./grading-scripts-s3/events-L1')         },
  eventsL2:        { name: 'Events L2',              file: require('./grading-scripts-s3/events-L2')         },
  condLoops:       { name: 'Conditional Loops L1',   file: require('./grading-scripts-s3/cond-loops')        },
  decompL1:        { name: 'Decomp. by Sequence L1', file: require('./grading-scripts-s3/decomp-L1')         },
  oneWaySyncL1:    { name: 'One-Way Sync L1',        file: require('./grading-scripts-s3/one-way-sync-L1')   },
  oneWaySyncL2:    { name: 'Two-Way Sync L2',        file: require('./grading-scripts-s3/two-way-sync-L2')   },
};

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

var table = 0;

var IS_LOADING = false;

/*
  SELECTION HTML
*/

/// Helps with form submission.
window.formHelper = function() {
  /// Blocks premature form submissions.
  $("form").submit(function() { return false; });
  /// Maps enter key to grade button.
  $(document).keypress(function(e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fill_unitsHTML = function() {
  var HTMLString = '';
  for (var graderKey in graders) {
    HTMLString += '<input type="radio" value="' + graderKey + '" class = "hidden"/>';
    HTMLString += '<label class = "unitlabel">';
    HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')"> <img src="pictures/' + graderKey + '.png"> </a>';
    HTMLString += graders[graderKey].name;
    HTMLString += '</label>';
  }
  document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/* Initializes html and initiates crawler. */
window.buttonHandler = async function() {
  if(IS_LOADING) {
    return;
  }

  if(!gradeObj) {
    unitError();
    return;
  }

  htmlInit();
  globalInit();
  document.getElementById('wait_time').innerHTML = "loading...";
  IS_LOADING = true;

  var requestURL = document.getElementById('inches_input').value;
  var studioID = parseInt(requestURL.match(/\d+/));
  var projects = [];
  var id = await crawler.crawlS3(studioID, 0, projects);
  console.log(id);
  //crawl(id,1);
}

/* Initializes global variables. */
function globalInit() {
  reports_list = [];
  project_count = 0;
  crawl_finished = false;
  cross_org = true;
  grade_reqs = {};
  passing_projects = 0;
  complete_projects = 0;
}

/* Initializes HTML elements. */
function htmlInit() {
  document.getElementById('process_button').blur();
  clearReport();
  noError();
}

function dropdownHandler() {
  document.getElementById("unit_dropdown").classList.toggle("show");
}

$(document).ready(function(){
  $('.units label').click(function() {
    $(this).addClass('selected').siblings().removeClass('selected');
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

  var droplinks = document.getElementsByClassName("dropdown_menu");
  [...droplinks].forEach(function(element) {
    if(element.classList.contains('show')) {
      element.classList.remove('show');
    }
  });
}

/*
  DISPLAY RESULTS
*/

/* Prints a line of grading text. */
function appendText(string_list) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  string_list.forEach(function(sub_element) {
    var newContent = document.createTextNode(sub_element);
    tbi.appendChild(newContent);
    var br = document.createElement("br");
    tbi.appendChild(br);
  });

  tbi.style.width = 33 + "%";
  tbi.style.fontSize = "15px";
  tbi.style.display= 'inline-block';

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);

  table++;
  if (table > 2) {
    table = 0;
  }
}

/* Prints a blank line. */
function appendNewLine() {
  var tbi = document.createElement("div");
  tbi.className = "lines";
  tbi.style.padding = "15px";

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a
   series of consecutive project reports. */
function printReport() {
  clearReport();
  sortReport();
  appendNewLine();
  appendNewLine();

  printColorKey();
  showProgressBar();

  table = 0;
  reports_list.forEach(function(element) {
    appendText(element);
    if (table == 0){
      appendNewLine();
    }
  });
  appendNewLine();
  appendNewLine();
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
  setProgress(document.getElementById('greenbar'),complete_projects, project_count,0);
  setProgress(document.getElementById('yellowbar'),passing_projects, project_count,1);
  setProgress(document.getElementById('redbar'),project_count-complete_projects-passing_projects, project_count,2);
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
  if (projects != 0 && color == 0) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' done';
  }
  else if (projects != 0 && color == 1) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' almost done';
  }
  else if (projects != 0 && color == 2) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' need time or help';
  }
}

/* 
  ERROR REPORTS 
*/

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
  processObj.innerHTML = "error: no unit selected.";
  IS_LOADING = false;
}

function noError() {
  document.getElementById('process_error').innerHTML = "";
  document.getElementById('process_error').style.visibility = 'hidden';
}

},{"./crawler":1,"./grading-scripts-s3/animation-L1":2,"./grading-scripts-s3/animation-L2":3,"./grading-scripts-s3/cond-loops":4,"./grading-scripts-s3/decomp-L1":5,"./grading-scripts-s3/events-L1":6,"./grading-scripts-s3/events-L2":7,"./grading-scripts-s3/one-way-sync-L1":8,"./grading-scripts-s3/scratch-basics-L1":9,"./grading-scripts-s3/two-way-sync-L2":10}],12:[function(require,module,exports){
module.exports = XMLHttpRequest;

},{}],13:[function(require,module,exports){
var XMLHttpRequest = require('xhr2');

/// Class of objects used to contain the data pulled from the web.
class WebResource {
    constructor() {
        this.data = null;
        this.meta = null;
        this.status = 0;
    }
}

/// Promises a WebResource object carrying the data from a specified URL.
function promiseResource(URL) {

    return new Promise(function(resolve, reject) {

        /// Declare the resource that is being promised.
        var resource = new WebResource();
        resource.meta.URL = URL;

        /// Send the request.
        var request = new XMLHttpRequest();
        request.open('GET', URL);
        request.send();

        /// Set a timeout for failure.
        setTimeout(function() {
            reject(resource);
        }, 10000);

        /// Receive the data and resolve the promise.
        request.onload = function() {
            resource.status = response.status;
            resource.data = request.response;
            resolve(resource);
        }

        /// Handle failed requests.
        request.onerror = function() {
            resource.status = response.status;
            resolve(resource);
        }

    });

}

/// Promises all the WebResources generated by an array of URLs.
function promiseAllResources(URLs) {

    var promisedResourceArray = [];
    for (var URL of URLs) promisedResourceArray.push(promiseResource(URL));
    return Promise.all(promisedResourceArray);
    
}

module.exports = {
    WebResource,
    promiseResource,
    promiseAllResources
}
},{"xhr2":12}]},{},[11]);
