/* One Way Sync L2 Autograder
 * Marco Anaya, Summer 2019
 */

require('./scratch3');

module.exports = class {

	init() { 
		this.requirements = {
			hasBackdrop: {bool: false, str: 'Project has a backdrop'},
			fiveSprites: {bool: false, str: 'Five sprites created'},
			oneToMany: {bool: false, str: 'One sprite sends a broadcast'},
			startToSprite1: {bool: false, str: 'Message received by sprite 1 and sprite does something'},
			startToSprite2: {bool: false, str: 'Message received by sprite 2 and sprite does something'},
			startToSprite3: {bool: false, str: 'Message received by sprite 3 and sprite does something'},
			startToSprite4: {bool: false, str: 'Message received by sprite 4 and sprite does something'}
		};
		this.extensions = {
			animated: {bool: false, str: 'Added animation to sprites'},
			sayBlock: {bool: false, str: 'Added say blocks to sprites'},
			anotherOneToMany: {bool: false, str: 'Used one-to-many synchronization a second time'}
		};
	}

	grade(fileObj, user) { 
		this.init();
		let project = new Project(fileObj);
		
		this.requirements.hasBackdrop.bool = project.targets[0].costumes.length > 1 || project.targets[0].costumes[0].name !== 'backdrop1';
		let reports = project.sprites.map(sprite => this.gradeSprite(sprite));

		let messages = {};

		for (let report of reports) {
			if (report.sent != []) {
				for (let msg of report.sent) {
					if (msg in messages) messages[msg].sent = true;
					else messages[msg] = {sent: true, recipients: []};
				}
			}
			if (report.received != []) {
				for (let msg of report.received) {
					if (msg in messages) messages[msg].recipients.push(report.name);
					else messages[msg] = {sent: false, recipients: [report.name]};
				}
			}
		}

		let oneToFourCount = 0;

		messages = Object.entries(messages).sort((a, b) => b[1].recipients.length - a[1].recipients.length);
		if (messages.length > 0) {
			for (let [msg, {sent, recipients}] of messages) {
				if (sent) {
					for (let sender of reports.filter(r => r.sent.includes(msg))) {
						let count = (recipients.length - recipients.includes(sender));
						for (let i = Math.min(count, 4); i > 0; i--) {
							this.requirements[`startToSprite${i}`].bool = true;
						}
						oneToFourCount += count >= 4;
					}
				}
			}	 
		}

		this.requirements.fiveSprites.bool = (reports.length >= 5);
		this.extensions.anotherOneToMany.bool = (oneToFourCount > 1);
	}
	
	gradeSprite(sprite) {
		let reqs = {
			name: sprite.name,
			sent: [],
			received: []
		}
		for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
			
			if (script.blocks[0].opcode === 'event_whenbroadcastreceived' && script.blocks.length > 1) {
				reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
			}
			let animated = {costume: false, move: false, wait: false};
			script.traverseBlocks((block, level) => {

				if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode)) {
					reqs.sent.push( block.inputs.BROADCAST_INPUT[1][1]);
					this.requirements.oneToMany.bool = true;
				}

				if (['looks_say', 'looks_sayforsecs'].includes(block.opcode))
					this.extensions.sayBlock.bool = true;

				if (level > 1) {
					if (['event_blooks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode)) {
						animated.costume = true;
					} else if (block.opcode === 'control_wait') {
						animated.wait = true;	
					} else if (block.opcode.includes('motion_')) {
						animated.motion = true;
					}
				}
			}, ['control_forever', 'control_repeat', 'control_repeat_until']);

			if (animated.wait && (animated.move || animated.costume)) {
				this.extensions.animated.bool = true;
			}	
		}
		return reqs;
	}
}
