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
        z
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
