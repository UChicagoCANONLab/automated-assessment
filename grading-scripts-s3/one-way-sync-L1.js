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