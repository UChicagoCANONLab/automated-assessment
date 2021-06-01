/* One Way Sync L1 Autograder
 * Marco Anaya, Summer 2019
 */
 require('./scratch3');

 module.exports = class {

	init(project) { //initialize all metrics to false


		let strandTemplates = {
			multicultural: require('./templates/one-way-sync-L1-multicultural'),
			youthCulture:  require('./templates/one-way-sync-L1-youth-culture'),
			gaming:        require('./templates/one-way-sync-L1-gaming')
		};
		this.strand = detectStrand(project, strandTemplates, 'youthCulture');

		let source;
		let target;
		let broadcaster;
		let sourceAction;
		let targetAction;
		this.extraSayRequirements = 1;

		switch(this.strand) {
			case "multicultural":
			source = "Djembe";
			target = "Mali child";
			sourceAction = "plays music";
			targetAction = "dances";
			broadcaster = "Start button";
			break;
			case "gaming":
			source = "Casey";
			target = "yellow car";
			sourceAction = "says something";
			targetAction = "moves to pink ramp";
			broadcaster = "Wizard";
			this.extraSayRequirements = 2;
			break;

			case "youthCulture":
			source = "Rectangle play button";
			target = "cat video";
			sourceAction = "changes costume";
			targetAction = "changes costume";
			broadcaster = "Start button";


		}
		this.requirements = {
			oneToOne: {bool:false, str:`${source} passes unique message to ${target}`},
			sourceAction: {bool: false, str: `When ${source} is clicked, ${source} ${sourceAction}`},
			sourceSound: {bool: false, str: `When ${source} is clicked, ${source} plays a sound`},
			targetAction: {bool: false, str: `When ${source} is clicked, ${target} ${targetAction}`},
			startButton: {bool: false, str: 'Start button sprite created'},
			oneToMany: {bool: false, str: `${broadcaster} passes the same message to all other sprites`},
			broadcastToSprite1: {bool: false, str: `A sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite2:	{bool: false, str: `Another sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite3:	{bool: false, str: `A third sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite4:	{bool: false, str: `A fourth sprite plays or dances when the ${broadcaster} is clicked`}
		};
		this.extensions = {
			changeWait: {bool: false, str: 'Changed the duration of a wait block'},
			sayBlock:	{bool: false, str: 'Added a say block under another event'}
		};
		if(this.strand === 'gaming'){
			delete this.requirements.startButton;
		}
		if(!(this.strand === 'youthCulture')){
			delete this.requirements.sourceSound;
		}
	}


	grade(fileObj, user) {
		const project = new Project(fileObj)
		this.init(project);

		let rawReports = project.sprites.map(sprite => this.gradeSprite(sprite));
		let nSays = rawReports.map(report => report.says).reduce((acc, val) => acc + val);
		if (nSays >= this.extraSayRequirements) {
			this.extensions.sayBlock.bool = true;
		}
		let messages = {};
		
		for (let report of rawReports) {
			if (report.sent != []) {
				for (let msg of report.sent) {
					if (msg in messages) messages[msg].sent = true;
					else messages[msg] = {sent: true, recipents: []};
				}
			}
			if (report.received != []) {
				for (let msg of report.received) {
					if (msg in messages) messages[msg].recipents.push(report.name);
					else messages[msg] = {sent: false, recipents: [report.name]};
				}
			}
		}

		

		let reports = rawReports.reduce((acc, r) => {
			acc.push({
				name: r.name,
				plays: r.plays,
				sent: 
				r.sent.length === 0 ? null : r.sent.reduce((acc, msg) => {
					acc[msg] = messages[msg].recipents;
					return acc;
				}, {}),
				received: r.received,
				dances: r.dances,
				movesTilPink: r.movesTilPink,

			});
			return acc;
		}, []);

		let sentCount;
		if (this.strand === "multicultural" ) {
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.includes('ali') || sender.name.includes('avajo'));
		} else if (this.strand === "gaming") {
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.toLowerCase().includes('go') || sender.name.toLowerCase().includes('truck'));
		} else if (this.strand === "youthCulture"){
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.toLowerCase().includes('play'));
		}

		let senders = reports.filter(r => r.sent).sort((a, b) => {
			return sentCount(b) - sentCount(a);
		})
		if(this.requirements.startButton != null){
			this.requirements.startButton.bool = reports.length >= 5;
		} 
        // Checks the sprite with the most broadcasts, assuming that it must be the start button
        if (senders.length >= 3) {
        	let startButton = senders[0];

        	let totalRecipients = new Set([]);
        	for (let recipients of Object.values(startButton.sent)) {
        		let score = 0;
        		for (let name of recipients) {
        			let recipientReport = reports.find(r => r.name == name);
        			if (recipientReport.plays.onClick || recipientReport.plays.onBroadcast || recipientReport.dances) {
        				score++;
        				totalRecipients.add(name);
        			}
        		}
        		if (score >= 4) this.requirements.oneToMany.bool = true;
        	}

        	if (totalRecipients.size > 0) {
        		for (let i = Math.min(totalRecipients.size, 4); i > 0; i--) 
        			this.requirements[`broadcastToSprite${i}`].bool = true;
				//remove this sprite
				senders = senders.slice(1);
			}
		}
        // Check if at least two of remaining sprites do what is expected from Djembe and Flute sprites
        if (senders.length >= 2) {

        	let visitedFlute = false;
        	let probableDjembe = null;

        	const sumScore = (score) => !score? 0 : Object.values(score).reduce((a, b) => a + b, 0)

        	for (let sender of senders) {    
        		for (let [msg, recipients] of Object.entries(sender.sent)) {
        			let score = {
        				uniqueMessage: msg.toLowerCase() != 'navajo',
        				senderPlays: (sender.plays.onClick || sender.plays.onBroadcast),
        				recipientDances: recipients.some(recipient => reports.find(r => r.name == recipient && r.dances))
        			};

        			if (score.recipientDances && score.senderPlays && !score.uniqueMessage && !visitedFlute) {
        				visitedFlute = true;
        			} else {
        				probableDjembe = sumScore(score) > sumScore(probableDjembe) ? score : probableDjembe;
        			}
        		}
        	}
        	[this.requirements.oneToOne.bool, this.requirements.sourceAction.bool, this.requirements.targetAction.bool] = Object.values(probableDjembe);
        }

        if (this.strand === "gaming") {
        	this.requirements.targetAction.bool = rawReports.find(r => r.name === "Rally Car").movesTilPink;
        } else if (this.strand === "youthCulture"){
        	console.log(rawReports.find(r => r.name === "Rectangle Play Button"))
        	this.requirements.sourceSound.bool = rawReports.find(r => r.name === "Rectangle Play Button").soundOnClick
        }
    }
    gradeSprite(sprite) {
    	let reqs = {
    		name: sprite.name,
    		plays: {onClick: false, onBroadcast: false},
    		sent: [],
    		received: [],
    		dances: {costume: false, wait: false},
    		movesTilPink : false,
    		says: 0,
    		soundOnClick: false
    	}
    	let onClickActions;
    	if (this.strand === "multicultural") {
    		onClickActions = ['sound_play', 'sound_playuntildone'];
    	} else if (this.strand === "gaming") {
    		onClickActions = ['looks_say', 'looks_sayforsecs']
    	} else if (this.strand === "youthCulture"){
            onClickActions = ['looks_switchcostumeto', 'looks_costume', 'looks_nextcostume', 'looks']
        }
    	for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
    		if (script.blocks[0].opcode === 'event_whenthisspriteclicked')
    			script.traverseBlocks((block, level) => {
    				if (onClickActions.includes(block.opcode))
    					reqs.plays.onClick = true;
    				else if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode))
    					reqs.sent.push( block.inputs.BROADCAST_INPUT[1][1])
    				else if(['sound_play', 'sound_playuntildone'].includes(block.opcode)){
    					reqs.soundOnClick = true
    				}
    			});
    		else if (script.blocks[0].opcode === 'event_whenbroadcastreceived') {
    			reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
    			let stopsOnPink = false
    			script.traverseBlocks((block, level) => { 
    				if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
    					reqs.plays.onBroadcast = true;
    				else if (['event_blooks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode))
    					reqs.dances.costume = true;
    				else if (block.opcode === 'control_wait') {
    					reqs.dances.wait = true;
    					if (block.inputs.DURATION[1][1] != .5) this.extensions.changeWait.bool = true;
    				} else if(block.opcode === "motion_movesteps" && block.within != null 
    					&& block.within.opcode === "control_repeat_until" && 
    					block.within.conditionBlock.opcode === "sensing_touchingcolor" &&
    					block.within.conditionBlock.inputs['COLOR'][1][1] === "#ed75ec"){
    						reqs.movesTilPink = true
    				}
    			});
    		} 
    		script.traverseBlocks((block, level) => {
    			if (['looks_say', 'looks_sayforsecs'].includes(block.opcode))
    				reqs.says += 1;
    		});
    	}
    	reqs.dances = reqs.dances.costume && reqs.dances.costume;
    	return reqs;
    }
}