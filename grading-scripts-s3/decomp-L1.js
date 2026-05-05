/* General/All-Strand Decomposition By Sequence L1 Autograder
 * Scratch 3 (original) version: Anna Zipp, Summer 2019
 * Updated by Jonathan Li, Spring 2026
 * Refactored to be able to handle conjuror
 */

require('./grader');
require('./scratch3');

const STRAND_CONFIG = {
    multicultural: {
        req: {
            aMoves: 'The Marchers move right towards the Speaker.',
            aStops: 'The Marchers stop when they touch the Speaker.',
            bWaits: 'The Speaker stays still until the Marchers touch them.',
            bMoves: 'The Speaker moves until they touch the Poster Holder.',
        },
        ext: {
            aJumps: 'The Marchers jump up and down after they say "Speech, Speech!".',
            bounce: null,
            extra: 'Added another sprite to the project that walks across the road and says something to match the protest goals (Change, Hope, Sisterhood, etc.).'
        },
        jumpType: 'saySpeech',
        checkBounce: null,
        checkExtra: (res) => res.Extra.name && res.Extra.moves && res.Extra.speaks
    },
    youthCulture: {
        req: {
            aMoves: 'Jaime runs towards the Ball.',
            aStops: 'Jaime stops when they touch the Ball.',
            bWaits: 'The Ball stays still until Jaime touches it.',
            bMoves: 'The Ball rolls until it touches the Goal.',
        },
        ext: {
            bounce: 'The Ball bounces off the Goal (then Jaime kicks it again).',
            aJumps: 'Jaime jumps up and down to celebrate (use a "wait" block).',
            extra: 'Added a goalie sprite to the project. Have the ball bounce off the goalie if it touches.'
        },
        jumpType: 'waitBlock',
        checkBounce: (res) => {
            if (!res.B.movesLeft) return false;
            let numWaitsForA = res.B.waitsFor.filter(x => x === res.A.name).length;
            let numMovesToB = res.A.movesTo.filter(x => x === res.B.name).length;
            let numBounces = res.B.movesTo.filter(x => x === res.C.name).length;
            
            return (((numWaitsForA > 1 && numMovesToB > 1) || res.B.bouncesTowards.includes(res.A.name)) && numBounces > 1);
        },
        checkExtra: (res) => (res.totSprites > 3) && res.B.movesLeft
    },
    gaming: {
        req: {
            aMoves: 'The Player moves towards the Stairs.',
            aStops: 'The Player stops when they touch the Stairs.',
            bWaits: 'The Stairs stay still until the Player touches them.',
            bMoves: 'The Stairs move until they touch the Cliff.',
        },
        ext: {
            sound: 'A sound is played when the Stairs touch the Cliff.',
            bounce: 'The Stairs "bounce" off the Cliff back towards the Player (then when they touch the Player, they move back to the Cliff again).',
            aJumps: 'The Player jumps up and down to celebrate when the Stairs touch the Cliff (use a "wait" block).',
            extra: 'Added another sprite to the project on top of the Stairs. After the Stairs touch the Cliff, this sprite moves right and stops at the blue treasure chest.'
        },
        jumpType: 'waitBlock',
        checkBounce: (res) => {
            if (!res.B.movesLeft) return false;
            let numWaitsForA = res.B.waitsFor.filter(x => x === res.A.name).length;
            let numBounces = res.B.movesTo.filter(x => x === res.C.name).length;
            
            return ((numWaitsForA > 1 || res.B.bouncesTowards.includes(res.A.name)) && numBounces > 1);
        },
        checkExtra: (res) => res.Extra.name && res.Extra.movesTo.length > 0
    },
    stardew: {
        req: {
            aMoves: 'Kent moves towards the Hot Air Balloon.',
            aStops: 'Kent stops moving when Kent touches the Hot Air Balloon.',
            bWaits: 'The Hot Air Balloon stays still until Kent touches it.',
            bMoves: 'The Hot Air Balloon moves until it touches the Cloud.',
        },
        ext: {
            bounce: 'The Hot Air Balloon floats back down after touching the cloud.',
            aJumps: 'Kent jumps up and down to celebrate (use a wait block).',
            extra: 'Added a new sprite to your project. If it touches the Balloon, have it bounce off.'
        },
        jumpType: 'waitBlock',
        checkBounce: (res) => {
            // Checks if the Balloon (B) moves "backward" (down) after hitting the Cloud (C)
            if (!res.B.movesLeft) return false; 
            let numWaitsForA = res.B.waitsFor.filter(x => x === res.A.name).length;
            let numBounces = res.B.movesTo.filter(x => x === res.C.name).length;
            
            return ((numWaitsForA > 1 || res.B.bouncesTowards.includes(res.A.name)) && numBounces > 1);
        },
        checkExtra: (res) => {
            // Checks if an extra sprite exists and if its logic bounces off the Balloon (B)
            return res.Extra.name && (res.Extra.bouncesTowards.includes(res.B.name) || res.Extra.movesTo.includes(res.B.name));
        }
    }
};

module.exports = class GradeDecompL1 extends Grader {

    init(project) {
        let templates = {
            multicultural: require('./templates/decomp-L1-multicultural.json'),
            youthCulture:  require('./templates/decomp-L1-youthculture.json'),
            gaming:        require('./templates/decomp-L1-gaming.json'),
            stardew:       require('./templates/decomp-L1-stardew.json')
        }

        this.strand = detectStrand(project, templates);
        this.config = STRAND_CONFIG[this.strand];

        if (!this.config) {
            console.log("ERROR: unable to match strand.");
            return;
        }

        // Evaluate the project first to identify Sprite A, B, C, and Extra
        this.evaluateProject(project);

        let { A, B, C } = this.evalResults;

        // Map standard requirements generically
        this.requirements = [
            new Requirement(this.config.req.aMoves, A.moves),
            new Requirement(this.config.req.aStops, A.stopsAt.includes(B.name)),
            new Requirement(this.config.req.bWaits, B.waits && B.waitsFor.includes(A.name)),
            new Requirement(this.config.req.bMoves, B.moves && B.movesTo.includes(C.name))
        ];


        // Map Standard Extensions
        let jumpConditionMet = this.config.jumpType === 'saySpeech' ? A.jumpsAfter.saySpeech : A.jumpsAfter.waitBlock;
        
        this.extensions = [
            new Extension(this.config.ext.sound, A.sounds || B.sounds || C.sounds),
            new Extension(this.config.ext.aJumps, jumpConditionMet)
        ];

        // Map Conditional Extensions via generic logic functions in the config
        if (this.config.ext.bounce) {
            this.extensions.push(new Extension(this.config.ext.bounce, this.config.checkBounce(this.evalResults)));
        }

        if (this.config.ext.extra) {
            this.extensions.push(new Extension(this.config.ext.extra, this.config.checkExtra(this.evalResults)));
        }
    }

    // Helper to run the heuristic engine before initializing requirements
    evaluateProject(project) {
        let spriteReports = [];
        let totSprites = 0;

        for (let target of project.targets) {
            if (!target.isStage) {
                totSprites++;
                spriteReports.push(this.gradeSprite(target));
            }
        }

        let sortedSprites = this.sortSprites(spriteReports, project);
        
        // Cache the results so init() can map them to the Requirements arrays
        this.evalResults = {
            A: sortedSprites.A,
            B: sortedSprites.B,
            C: sortedSprites.C,
            Extra: sortedSprites.Extra,
            totSprites: totSprites
        };
    }

    // given a block that has an input conditon, check if it is a Touching condition
    // and return the opcode of what its touching target conditon is
    getTouchTarget(block) {
        let targetCond = null;
        let inputCond = block.conditionBlock;  
        if ((inputCond !== null) && ("sensing_touchingobject" === inputCond.opcode)) {
            let condSelected = inputCond.toBlock(inputCond.inputs.TOUCHINGOBJECTMENU[1]);
            if ((condSelected !== null) && (condSelected.opcode === "sensing_touchingobjectmenu")) {
                targetCond = condSelected.fields.TOUCHINGOBJECTMENU[0];
            }
        }
        return targetCond;
    }

    gradeSprite(sprite) {
        let report = {
            name: sprite.name,
            moves: false,
            movesTo: [],
            stops: false,
            stopsAt: [],
            waits: false,
            waitsFor: [],
            sounds: false,
            changesCostumeToSpeaking: false,
            jumps: false,
            jumpsAfter: { saySpeech: false, waitBlock: false },
            movesLeft: false,
            bouncesTowards: [],
            speaks: false,
            score: 0,
        }

        let pointDir;

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === "event_whenflagclicked")) {
            script.traverseBlocks((block, level) => {

                if (block.opcode === "motion_pointindirection") {
                    if (block.inputs.DIRECTION[1][1] === "90") pointDir = "right";
                    if (block.inputs.DIRECTION[1][1] === "-90") pointDir = "left";
                }

                if (["motion_movesteps", "motion_changexby"].includes(block.opcode)) {
                    let stepNumber;
                    if (block.opcode === "motion_movesteps") stepNumber = block.inputs.STEPS[1][1];
                    if (block.opcode === "motion_changexby") stepNumber = block.inputs.DX[1][1];
                    
                    if (stepNumber > 0) {
                        report.moves = true;

                        let potentialLoop = block.isWithin();
                        if (potentialLoop !== null) {
                            if (potentialLoop.opcode === "control_repeat_until") {
                                let repeatUntilTarget = this.getTouchTarget(potentialLoop);
                                if (repeatUntilTarget != null) {
                                    report.movesTo.push(repeatUntilTarget);
                                    report.score++;

                                    report.stops = true;
                                    report.stopsAt.push(repeatUntilTarget);
                                    report.score++;

                                    let repeatIsWithin = potentialLoop.isWithin();
                                    if ((repeatIsWithin !== null) && (repeatIsWithin.opcode === "control_repeat")) {
                                        report.movesTo.push(repeatUntilTarget);
                                        report.score++;
                                    }

                                    let blockAfterLoop = potentialLoop.nextBlock();
                                    let blockOutsideLoop = potentialLoop.isWithin();

                                    if (blockAfterLoop !== null) {
                                        let scriptAfterLoop = new Script(blockAfterLoop, blockAfterLoop.target);

                                        if (blockOutsideLoop !== null) {
                                            let scriptOutsideLoop = new Script(blockOutsideLoop, blockOutsideLoop.target);
                                            scriptAfterLoop.blocks = scriptAfterLoop.blocks.concat(scriptOutsideLoop.blocks);
                                        }

                                        let waitBlockFound = false;
                                        let speechBlockFound = false;

                                        scriptAfterLoop.traverseBlocks((currBlock, level) => {
                                            if (currBlock.opcode === "looks_switchcostumeto") {
                                                let costumeInput = currBlock.toBlock(currBlock.inputs.COSTUME[1]);
                                                if ((costumeInput != null) && (costumeInput.opcode === "looks_costume")) {
                                                    if (costumeInput.fields.COSTUME[0] === "Speaking") {
                                                        report.changesCostumeToSpeaking = true;
                                                    }
                                                }
                                            }

                                            if (currBlock.opcode.includes("looks_say")) {
                                                let sayMsg = currBlock.inputs.MESSAGE[1][1];
                                                if (sayMsg.includes("eech!")) {
                                                    speechBlockFound = true;
                                                }
                                            }
                                            
                                            if (["motion_sety", "motion_changeyby"].includes(currBlock.opcode) && speechBlockFound) {
                                                report.jumps = true;
                                                report.jumpsAfter.saySpeech = true;
                                            }

                                            if (currBlock.opcode === "control_wait") {
                                                waitBlockFound = true;
                                            }
                                            
                                            if (["motion_sety", "motion_changeyby"].includes(currBlock.opcode) && waitBlockFound) {
                                                report.jumps = true;
                                                report.jumpsAfter.waitBlock = true;
                                            }

                                            if (["sound_play", "sound_playuntildone"].includes(currBlock.opcode)) {
                                                report.sounds = true;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (stepNumber < 0 || pointDir == "left") {
                        report.movesLeft = true;
                        let potentialLoop = block.isWithin();
                        if (potentialLoop !== null) {
                            if (potentialLoop.opcode === "control_repeat_until") {
                                let repeatUntilTarget = this.getTouchTarget(potentialLoop);
                                if (repeatUntilTarget != null) {
                                    report.bouncesTowards.push(repeatUntilTarget);
                                }
                            }
                        }
                    }
                }

                if (block.opcode === "control_wait_until") {
                    let waitUntilTarget = this.getTouchTarget(block);
                    if (waitUntilTarget !== null) {
                        if (!report.moves) {
                            report.waits = true;
                        }
                        report.waitsFor.push(waitUntilTarget);
                        report.score++;

                        let blocksAfterWait = block.childBlocks();
                        for (let currBlock of blocksAfterWait) {
                            if (["sound_play", "sound_playuntildone"].includes(currBlock.opcode)) {
                                report.sounds = true;
                            }
                        }
                    }
                }

                if (["sound_play", "sound_playuntildone"].includes(block.opcode)) {
                    let potentialIf = block.isWithin();
                    if (potentialIf !== null) {
                        if (potentialIf.opcode === "control_if") {
                            let ifTouchingTarget = this.getTouchTarget(potentialIf);
                            if (ifTouchingTarget !== null) {
                                report.sounds = true;
                            }
                        }
                    }
                }

                if (block.opcode.includes("looks_say")) {
                    report.speaks = true;
                    report.score++;
                }
            });
        }
        return report;
    }

    sortSprites(reports, project) {
        let defaultObj = {
            name: null, moves: false, movesTo: [], stops: false, stopsAt: [],
            waits: false, waitsFor: [], sounds: false, changesCostumeToSpeaking: false,
            jumps: false, jumpsAfter: { saySpeech: false, waitBlock: false },
            movesLeft: false, bouncesTowards: [], speaks: false, score: 0,
        }
        
        let sprites = { A: defaultObj, B: defaultObj, C: defaultObj, Extra: defaultObj }

        let maxBScore = -1;
        for (let possibleB of reports) {
            let currBScore = possibleB.score;

            if (possibleB.waits) currBScore++;
            if (possibleB.sounds) currBScore++;
            if (possibleB.changesCostumeToSpeaking) currBScore++;
            currBScore += possibleB.bouncesTowards.length;

            if (currBScore > maxBScore) {
                maxBScore = currBScore;
                sprites.B = possibleB;
            }
        }

        let maxAScore = -1;
        for (let possibleA of reports) {
            if (possibleA.name !== sprites.B.name) {
                let currAScore = 0;

                if (possibleA.jumps) currAScore++;
                if (possibleA.movesTo.includes(sprites.B.name)) currAScore++;
                if (possibleA.stopsAt.includes(sprites.B.name)) currAScore++;

                if (sprites.B.waitsFor.includes(possibleA.name)) {
                    if (currAScore > maxAScore) {
                        maxAScore = currAScore;
                        sprites.A = possibleA;
                    }
                }
            }
        }

        for (let possibleC of reports) {
            if ((possibleC.name !== sprites.B.name) && (possibleC.name !== sprites.A.name)) {
                if (sprites.B.movesTo.includes(possibleC.name)) {
                    sprites.C = possibleC;
                }
            }
        }

        let maxExtraScore = -1;
        if (reports.length > 4) {
            for (let remainingSprite of reports) {
                if ((remainingSprite.name !== sprites.B.name) && (remainingSprite.name !== sprites.A.name) && (remainingSprite.name !== sprites.C.name)) {
                    let currExtraScore = remainingSprite.score;
                    if (remainingSprite.moves) currExtraScore++;
                    if (remainingSprite.speaks) currExtraScore++;
                    if (remainingSprite.movesTo.includes("ChestBlue")) currExtraScore += 10;

                    if (currExtraScore > maxExtraScore) {
                        maxExtraScore = currExtraScore;
                        sprites.Extra = remainingSprite;
                    }
                }
            }
        }
        return sprites;
    }
}