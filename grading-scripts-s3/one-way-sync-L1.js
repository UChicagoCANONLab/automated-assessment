/* One Way Sync L1 Autograder
 * Marco Anaya, Summer 2019
 */
require('./scratch3');

module.exports = class {

	init() { //initialize all metrics to false
		this.requirements = {
			oneToOne: {bool:false, str:'Djembe passes unique message to Mali child'},
			djembePlays: {bool: false, str: 'When Djembe is clicked, Djembe plays music'},
			djembeToChild: {bool: false, str: 'When Djembe is clicked, Mali child dances'},
			startButton: {bool: false, str: 'Start button sprite created'},
			oneToMany: {bool: false, str: 'Start button passes the same message to all other sprites'},
			startToSprite1: {bool: false, str: 'A sprite plays or dances when the start button is clicked'},
			startToSprite2:	{bool: false, str: 'Another sprite plays or dances when the start button is clicked'},
			startToSprite3:	{bool: false, str: 'A third sprite plays or dances when the start button is clicked'},
			startToSprite4:	{bool: false, str: 'A fourth sprite plays or dances when the start button is clicked'}
		};
		this.extensions = {
			changeWait: {bool: false, str: 'Changed the duration of a wait block'},
			sayBlock:	{bool: false, str: 'Added a say block under another event'}
		}
	}

	grade(fileObj, user) {
		this.init();
		const project = new Project(fileObj)

		let reports = project.sprites.map(sprite => this.gradeSprite(sprite));
		let messages = {};
		
		for (let report of reports) {
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

		

		reports = reports.reduce((acc, r) => {
			acc.push({
				name: r.name,
				plays: r.plays,
				sent: 
					r.sent.length === 0 ? null : r.sent.reduce((acc, msg) => {
						acc[msg] = messages[msg].recipents;
						return acc;
					}, {}),
				received: r.received,
				dances: r.dances
			});
			return acc;
		}, []);
		const sentCount = (sender) => 
				Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.includes('ali') || sender.name.includes('avajo'));

		let senders = reports.filter(r => r.sent).sort((a, b) => {
				return sentCount(b) - sentCount(a);
		})
		this.requirements.startButton.bool = reports.length >= 5;
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
					this.requirements[`startToSprite${i}`].bool = true;
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
            [this.requirements.oneToOne.bool, this.requirements.djembePlays.bool, this.requirements.djembeToChild.bool] = Object.values(probableDjembe);
        }		
	}
	gradeSprite(sprite) {
		let reqs = {
			name: sprite.name,
			plays: {onClick: false, onBroadcast: false},
			sent: [],
			received: [],
			dances: {costume: false, wait: false}
		}
		for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
			if (script.blocks[0].opcode === 'event_whenthisspriteclicked')
				script.traverseBlocks((block, level) => {
					if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
						reqs.plays.onClick = true;
					else if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode))
						reqs.sent.push( block.inputs.BROADCAST_INPUT[1][1])
				});
			else if (script.blocks[0].opcode === 'event_whenbroadcastreceived') {
				reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
				script.traverseBlocks((block, level) => {
					if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
						reqs.plays.onBroadcast = true;
					else if (['event_blooks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode))
						reqs.dances.costume = true;
					else if (block.opcode === 'control_wait') {
						reqs.dances.wait = true;
						if (block.inputs.DURATION[1][1] != .5) this.extensions.changeWait.bool = true;
					}
				});
			} 
			script.traverseBlocks((block, level) => {
				if (['looks_say', 'looks_sayforsecs'].includes(block.opcode))
					this.extensions.sayBlock.bool = true;
			});
		}
		reqs.dances = reqs.dances.costume && reqs.dances.costume;
		return reqs;
	}
}