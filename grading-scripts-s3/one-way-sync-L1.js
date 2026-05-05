/* One Way Sync L1 Autograder
 * Jonathan Li, Spring 2026
 * Refactored to be able to handle conjuror
 */
require('./grader');
require('./scratch3');

const STRAND_CONFIG = {
    multicultural: {
        source: "Djembe", target: "Mali child", sourceAction: "plays music", targetAction: "dances", broadcaster: "Start button",
        extraSayReq: 1,
        hasStartButton: true,
        hasSourceSound: false,
        onClickActions: ['sound_play', 'sound_playuntildone'],
        ignoreSenders: ['ali', 'avajo'],
        checkTargetAction: (rawReports, sourceStats) => sourceStats.targetAction
    },
    gaming: {
        source: "Casey", target: "yellow car", sourceAction: "says something", targetAction: "moves to pink ramp", broadcaster: "Wizard",
        extraSayReq: 2,
        hasStartButton: false,
        hasSourceSound: false,
        onClickActions: ['looks_say', 'looks_sayforsecs'],
        ignoreSenders: ['go', 'truck'],
        checkTargetAction: (rawReports, sourceStats) => rawReports.some(r => r.movesTilPink)
    },
    youthCulture: {
        source: "Rectangle play button", target: "cat video", sourceAction: "changes costume", targetAction: "changes costume", broadcaster: "Start button",
        extraSayReq: 1,
        hasStartButton: true,
        hasSourceSound: true,
        onClickActions: ['looks_switchcostumeto', 'looks_costume', 'looks_nextcostume', 'looks'],
        ignoreSenders: ['play'],
        checkTargetAction: (rawReports, sourceStats) => rawReports.some(r => r.soundOnClick)
    },
	stardew: {
        source: "Flute box", 
        target: "Abigael", 
        sourceAction: "plays music", 
        targetAction: "dances", 
        broadcaster: "Start button",
        extraSayReq: 2,
        hasStartButton: true,
        hasSourceSound: false,
        onClickActions: ['sound_play', 'sound_playuntildone'], 
        ignoreSenders: ['flute', 'box'],
        checkTargetAction: (rawReports, sourceStats) => sourceStats.targetAction
    }
};

module.exports = class GradeOneWaySyncL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/one-way-sync-L1-multicultural'),
            youthCulture:  require('./templates/one-way-sync-L1-youth-culture'),
            gaming:        require('./templates/one-way-sync-L1-gaming'),
			stardew:       require('./templates/one-way-sync-L1-stardew.json')
        };
        
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        this.config = STRAND_CONFIG[this.strand] || STRAND_CONFIG['youthCulture'];
        this.template = strandTemplates[this.strand] || strandTemplates['youthCulture'];

        this.evaluateProject(project);

        let res = this.evalResults;
        let c = this.config;

        // Map standard requirements generically
        this.requirements = [
            new Requirement(`${c.source} passes unique message to ${c.target}`, res.oneToOne),
            new Requirement(`When ${c.source} is clicked, ${c.source} ${c.sourceAction}`, res.sourceAction),
            new Requirement(`When ${c.source} is clicked, ${c.target} ${c.targetAction}`, res.targetAction),
            new Requirement(`${c.broadcaster} passes the same message to all other sprites`, res.oneToMany),
            new Requirement(`A sprite plays or dances when the ${c.broadcaster} is clicked`, res.broadcastTo[0]),
            new Requirement(`Another sprite plays or dances when the ${c.broadcaster} is clicked`, res.broadcastTo[1]),
            new Requirement(`A third sprite plays or dances when the ${c.broadcaster} is clicked`, res.broadcastTo[2]),
            new Requirement(`A fourth sprite plays or dances when the ${c.broadcaster} is clicked`, res.broadcastTo[3])
        ];

        // Map conditional requirements
        if (c.hasStartButton) {
            this.requirements.push(new Requirement('Start button sprite created', res.startButton));
        }
        if (c.hasSourceSound) {
            this.requirements.push(new Requirement(`When ${c.source} is clicked, ${c.source} plays a sound`, res.sourceSound));
        }

        // Map extensions
        this.extensions = [
            new Extension('Changed the duration of a wait block', res.changeWait),
            new Extension('Added a say block under another event', res.sayBlock)
        ];
    }

    evaluateProject(project) {
        this.evalResults = {
            sayBlock: false, changeWait: false, startButton: false, sourceSound: false,
            oneToOne: false, sourceAction: false, targetAction: false,
            oneToMany: false, broadcastTo: [false, false, false, false]
        };

        let rawReports = project.sprites.map(sprite => this.gradeSprite(sprite));
        
        // Extension: Say Blocks
        let nSays = rawReports.reduce((acc, report) => acc + report.says, 0);
        if (nSays >= this.config.extraSayReq) {
            this.evalResults.sayBlock = true;
        }

        // Extension: Change Wait
        if (rawReports.some(r => r.changedWait)) {
            this.evalResults.changeWait = true;
        }

        // Evaluate graph of messages sent/received
        let messages = {};
        for (let report of rawReports) {
            if (report.sent.length > 0) {
                for (let msg of report.sent) {
                    if (messages[msg]) messages[msg].sent = true;
                    else messages[msg] = { sent: true, recipients: [] };
                }
            }
            if (report.received.length > 0) {
                for (let msg of report.received) {
                    if (messages[msg]) messages[msg].recipients.push(report.name);
                    else messages[msg] = { sent: false, recipients: [report.name] };
                }
            }
        }

        let reports = rawReports.map(r => ({
            name: r.name,
            plays: r.plays,
            sent: r.sent.length === 0 ? null : r.sent.reduce((acc, msg) => {
                acc[msg] = messages[msg] ? messages[msg].recipients : [];
                return acc;
            }, {}),
            received: r.received,
            dances: r.dances,
            movesTilPink: r.movesTilPink
        }));

        let sentCount = (sender) => {
            let numSent = Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0);
            
            // Find the sprite to analyze its DNA
            let actualSprite = project.sprites.find(s => s.name === sender.name);
            let dnaName = actualSprite ? global.detectSprite(actualSprite, this.template).toLowerCase() : "";
            
            let isIgnored = this.config.ignoreSenders.some(ign => dnaName.includes(ign));
            return numSent + (isIgnored ? 0 : 1);
        };

        let senders = reports.filter(r => r.sent).sort((a, b) => sentCount(b) - sentCount(a));

        if (this.config.hasStartButton) {
            this.evalResults.startButton = reports.length >= 5;
        }

        // Extract Start Button logic (largest broadcaster)
        if (senders.length >= 3) {
            let startButton = senders[0];
            let totalRecipients = new Set([]);

            for (let recipients of Object.values(startButton.sent)) {
                let score = 0;
                for (let name of recipients) {
                    let recipientReport = reports.find(r => r.name === name);
                    if (recipientReport && (recipientReport.plays.onClick || recipientReport.plays.onBroadcast || recipientReport.dances)) {
                        score++;
                        totalRecipients.add(name);
                    }
                }
                if (score >= 4) this.evalResults.oneToMany = true;
            }

            if (totalRecipients.size > 0) {
                let numBroadcasts = Math.min(totalRecipients.size, 4);
                for (let i = 0; i < numBroadcasts; i++) {
                    this.evalResults.broadcastTo[i] = true;
                }
                senders = senders.slice(1);
            }
        }

        // Extract Source and Target logic
        if (senders.length >= 2) {
            let visitedFlute = false;
            let probableSourceStats = { oneToOne: false, sourceAction: false, targetAction: false };

            const sumScore = (scoreObj) => !scoreObj ? 0 : Object.values(scoreObj).filter(Boolean).length;

            for (let sender of senders) {
                for (let [msg, recipients] of Object.entries(sender.sent)) {
                    let score = {
                        oneToOne: msg.toLowerCase() !== 'navajo',
                        sourceAction: (sender.plays.onClick || sender.plays.onBroadcast),
                        targetAction: recipients.some(recipient => reports.find(r => r.name === recipient && r.dances))
                    };

                    if (score.targetAction && score.sourceAction && !score.oneToOne && !visitedFlute) {
                        visitedFlute = true;
                    } else {
                        if (sumScore(score) > sumScore(probableSourceStats)) {
                            probableSourceStats = score;
                        }
                    }
                }
            }

            this.evalResults.oneToOne = probableSourceStats.oneToOne;
            this.evalResults.sourceAction = probableSourceStats.sourceAction;
            
            // Delegate strand-specific target checks to the config helper
            this.evalResults.targetAction = this.config.checkTargetAction(rawReports, probableSourceStats);
        }

        // Set the legacy youthCulture sound requirement safely
        this.evalResults.sourceSound = rawReports.some(r => r.soundOnClick);
    }

    gradeSprite(sprite) {
        let reqs = {
            name: sprite.name,
            plays: { onClick: false, onBroadcast: false },
            sent: [],
            received: [],
            dances: false,
            dancesData: { costume: false, wait: false },
            movesTilPink: false,
            says: 0,
            soundOnClick: false,
            changedWait: false // Extracted from global side-effects
        };

        let onClickActions = this.config.onClickActions;

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
            
            if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                script.traverseBlocks((block, level) => {
                    if (onClickActions.includes(block.opcode)) {
                        reqs.plays.onClick = true;
                    } else if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode)) {
                        reqs.sent.push(block.inputs.BROADCAST_INPUT[1][1]);
                    } else if (['sound_play', 'sound_playuntildone'].includes(block.opcode)) {
                        reqs.soundOnClick = true;
                    }
                });
            } 
            else if (script.blocks[0].opcode === 'event_whenbroadcastreceived') {
                reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
                
                script.traverseBlocks((block, level) => {
                    if (['sound_play', 'sound_playuntildone'].includes(block.opcode)) {
                        reqs.plays.onBroadcast = true;
                    } else if (['looks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode)) {
                        reqs.dancesData.costume = true;
                    } else if (block.opcode === 'control_wait') {
                        reqs.dancesData.wait = true;
                        if (block.inputs.DURATION[1][1] != 0.5) reqs.changedWait = true;
                    } else if (
                        block.opcode === "motion_movesteps" && block.within != null &&
                        block.within.opcode === "control_repeat_until" &&
                        block.within.conditionBlock.opcode === "sensing_touchingcolor" &&
                        block.within.conditionBlock.inputs['COLOR'][1][1] === "#ed75ec"
                    ) {
                        reqs.movesTilPink = true;
                    }
                });
            }

            script.traverseBlocks((block, level) => {
                if (['looks_say', 'looks_sayforsecs'].includes(block.opcode)) {
                    reqs.says += 1;
                }
            });
        }
        
        // Fixed original bug where it checked costume && costume
        reqs.dances = reqs.dancesData.costume && reqs.dancesData.wait;
        return reqs;
    }
}