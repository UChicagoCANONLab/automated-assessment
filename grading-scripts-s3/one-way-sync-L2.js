/* One Way Sync L2 Autograder
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

class GradeOneWaySyncL2 {

	constructor() {
		this.requirements = {};
		this.extensions = {};
	}

	initReqs() { //initialize all metrics to false
		this.requirements = {
			hasBackdrop: {bool: false, str: 'Project has a backdrop'},
			fiveSprites: {bool: false, str: 'Five sprites created'},
			startButton: {bool: false, str: 'One sprite sends a broadcast'},
			startToSprite0: {bool: false, str: 'Message received by sprite 1 and sprite does something'},
			startToSprite1: {bool: false, str: 'Message received by sprite 2 and sprite does something'},
			startToSprite2: {bool: false, str: 'Message received by sprite 3 and sprite does something'},
			startToSprite3: {bool: false, str: 'Message received by sprite 4 and sprite does something'}
		};
	}

	initExts() {
		this.extensions = {
			animated: {bool: false, str: 'Added animation to sprites'},
			sayBlock: {bool: false, str: 'Added say blocks to sprites'}
		};
	}

	checkSayBlock(sprites) {
		for(var sprite of sprites) {
			const sayBlocks = sb3.findBlockIDs(sprite.blocks, 'looks_say');
			sayBlocks.concat(sb3.findBlockIDs(sprite.blocks, 'look_sayforsecs'));
			if(sayBlocks.length > 0) {
				this.extensions.sayBlock.bool = true;;
				return;
			}
		}
	}

	checkAnimation(sprites) {
		for(var sprite of sprites) {
			var changeCostume = false;
			var waitBlock = false;
			const repeatBlocks = sb3.findBlockIDs(sprite.blocks, 'control_repeat');
			if (repeatBlocks) {
				for(var repeatBlock of repeatBlocks) {
					const script = sb3.makeScript(sprite.blocks, repeatBlock);
					for (var block of script) {
						switch(block.opcode) {
							case 'looks_switchcostumeto':
							case 'looks_nextcostume': {
								changeCostume = true;
								break;
							}
							case 'control_wait': {
								waitBlock = true;
							}
						}
					}
				}
			}
			if (changeCostume && waitBlock) {
				this.extensions.animated.bool = true;
				return;
			}
		}
	}

	checkOneToFive(sprites) {
		// makes sure there are sprites to check for
		if (sb3.no(sprites)) {
			return;
		}
		// object to record what messages have been sent and received
		var messages = {};

		for(var sprite of sprites) {
			// iterate through "when sprite clicked" events in search of message
			const whenClickedBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenthisspriteclicked');
			if(whenClickedBlocks) {
				for(var whenClickedBlock of whenClickedBlocks) {
					const script = sb3.makeScript(sprite.blocks, whenClickedBlock);
					for(var block of script){
						if(['event_broadcast', 'event_broadcastandwait'].includes(block.opcode)) {
							this.requirements.startButton.bool = true;
							const msg = block.inputs.BROADCAST_INPUT[1][1];
							if(msg in messages)
								messages[msg][0] = true;
							else
								messages[msg] = [true, []];
						} 
					}
				}
			}
			// iterate through "when received" blocks in search of a message
			const whenReceivedBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');
			if(whenReceivedBlocks) {
				for(var whenReceivedBlock of whenReceivedBlocks) {
					const script = sb3.makeScript(sprite.blocks, whenReceivedBlock);
					const msg = script[0].fields.BROADCAST_OPTION[0]
					if (msg in messages)
						messages[msg][1].push(sprite.name);
					else
						messages[msg] = [false, [sprite.name]];
				}
			}
		}
		// complicated way of finding the most received message.
		// this could be simplifed if it is extraneous who received the message
		//   and what it was
		return Object.keys(messages).reduce((prev, msg) => {
			if(messages[msg][0] && (messages[msg][1].length > prev.receivedBy.length))
				return {message: msg, receivedBy: messages[msg][1]};
			else 
				return prev;
		}, {message: '', receivedBy: []});
	}

	grade(fileObj, user) { 
		this.initReqs();
		this.initExts();
		var sprites = [];
		const targets = fileObj.targets;
		
		// creates array of sprites, checks whether the backdrop has been set
		for (var target of targets) {
			if (target.isStage) {
				this.requirements.hasBackdrop.bool = (target.costumes.length > 0)
			} else {
				sprites.push(target);
			}
		}
		// if more 5 or more sprites
		this.requirements.fiveSprites.bool = (sprites.length >= 5);
		// find the message with the most successful receives
		var {message, receivedBy} = this.checkOneToFive(sprites);
		
		// for every successful message received, set requriement to true
		receivedBy = receivedBy > 4 ? 4 : receivedBy;
		for(var i in receivedBy) {
			this.requirements['startToSprite' + i].bool = true;
		}
		// check for animation and say block. Does not check if these blocks
		//  are a result of the broadcast
		this.checkAnimation(sprites);
		this.checkSayBlock(sprites);
	}
}

module.exports = GradeOneWaySyncL2;