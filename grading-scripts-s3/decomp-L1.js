/* General/All-Strand Decomposition By Sequence L1 Autograder
 * Scratch 3 (original) version: Anna Zipp, Summer 2019
 */

require('./scratch3');

module.exports = class {

    // identify the correct strand, then initialize the appropriate requirement and extension objects to be graded
    init(project) {
        let templates = {
            multicultural: require('./templates/decomp-L1-multicultural.json'),
            youthCulture: require('./templates/decomp-L1-youthculture.json'),
            gaming: require('./templates/decomp-L1-gaming.json'),
        }

        this.strand = detectStrand(project, templates);

        switch (this.strand) {
            case "multicultural":
                this.requirements = {
                    marchersMove: { bool: false, str: 'The Marchers move right towards the Speaker.' },
                    marchersStop: { bool: false, str: 'The Marchers stop when they touch the Speaker.' },
                    speakerWaits: { bool: false, str: 'The Speaker stays still until the Marchers touch them.' },
                    speakerMoves: { bool: false, str: 'The Speaker moves until they touch the Poster Holder.' },
                    speakerChanges: { bool: false, str: 'The Speaker changes costume to "Speaking" so she is facing the podium.' },
                }
                this.extensions = {
                    soundAdded: { bool: false, str: 'A sound is played when the Speaker touches the Poster Holder and arrives at the Podium.' },
                    marchersJump: { bool: false, str: 'The Marchers jump up and down after they say "Speech, Speech!".' },
                    newSpriteAdded: { bool: false, str: 'Added another sprite to the project that walks across the road and says something to match the protest goals (Change, Hope, Sisterhood, etc.).' },
                }
                break;
            case "youthCulture":
                this.requirements = {
                    jaimeMoves: { bool: false, str: 'Jaime runs towards the Ball.' },
                    jaimeStops: { bool: false, str: 'Jaime stops when they touch the Ball.' },
                    ballWaits: { bool: false, str: 'The Ball stays still until Jaime touches it.' },
                    ballMoves: { bool: false, str: 'The Ball rolls until it touches the Goal.' },
                }
                this.extensions = {
                    soundAdded: { bool: false, str: 'A "cheer" sound is played when the Ball goes in the Goal.' },
                    ballBounces: { bool: false, str: 'The Ball bounces off the Goal (then Jaime kicks it again).' },
                    jaimeJumps: { bool: false, str: 'Jaime jumps up and down to celebrate (use a "wait" block).' },
                    goalieAdded: { bool: false, str: 'Added a goalie sprite to the project. Have the ball bounce off the goalie if it touches.' },
                }
                break;
            case "gaming":
                this.requirements = {
                    playerMoves: { bool: false, str: 'The Player moves towards the Stairs.' },
                    playerStops: { bool: false, str: 'The Player stops when they touch the Stairs.' },
                    stairsWait: { bool: false, str: 'The Stairs stay still until the Player touches them.' },
                    stairsMove: { bool: false, str: 'The Stairs move until they touch the Cliff.' },
                }
                this.extensions = {
                    soundAdded: { bool: false, str: 'A sound is played when the Stairs touch the Cliff.' },
                    stairsBounce: { bool: false, str: 'The Stairs "bounce" off the Cliff back towards the Player (then when they touch the Player, they move back to the Cliff again).' },
                    playerJumps: { bool: false, str: 'The Player jumps up and down to celebrate when the Stairs touch the Cliff (use a "wait" block).' },
                    newSpriteAdded: { bool: false, str: 'Added another sprite to the project on top of the Stairs. After the Stairs touch the Cliff, this sprite moves right and stops at the blue treasure chest.' },
                }
                break;
            default:
                // if no strand found, error
                console.log("ERROR: unable to match strand.");
                return;
        }
    }

    // given a block that has an input conditon, check if it is a Touching condition
    // and return the opcode of what its touching target conditon is
    getTouchTarget(block) {
        let targetCond = null;
        let inputCond = block.conditionBlock();  // the input condition block       
        if ((inputCond !== null) && ("sensing_touchingobject" === inputCond.opcode)) {
            // find the specific field entered into the input condition block
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

        // iterate through each of the sprite's scripts that start with 'When Green Flag Clicked' 
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === "event_whenflagclicked")) {
            script.traverseBlocks((block, level) => {
                // check for movement to the right
                if (["motion_movesteps", "motion_changexby"].includes(block.opcode)) {
                    let stepNumber;
                    if (block.opcode === "motion_movesteps") stepNumber = block.inputs.STEPS[1][1];
                    if (block.opcode === "motion_changexby") stepNumber = block.inputs.DX[1][1];
                    if (stepNumber > 0) {
                        report.moves = true;

                        // check if the move block is within a loop 
                        let potentialLoop = block.isWithin();
                        if (potentialLoop !== null) {
                            // if the move block is within a "repeat until touching" loop
                            if (potentialLoop.opcode === "control_repeat_until") {
                                let repeatUntilTarget = this.getTouchTarget(potentialLoop);
                                if (repeatUntilTarget != null) {
                                    // if student puts motion block inside a repeat until touching loop, then Sprite both moves to the target, and stops when they touch it
                                    report.movesTo.push(repeatUntilTarget);
                                    report.score++;

                                    report.stops = true;
                                    report.stopsAt.push(repeatUntilTarget);
                                    report.score++;

                                    // if "repeat until touching" block is within a repeat loop, add repeatUntilTarget again (for "bounce" extension)
                                    let repeatIsWithin = potentialLoop.isWithin();
                                    if ((repeatIsWithin !== null) && (repeatIsWithin.opcode === "control_repeat")) {
                                        report.movesTo.push(repeatUntilTarget);
                                        report.score++;
                                    }

                                    // Create a script of all the blocks immediately after the repeatUntilTouching loop 
                                    let blockAfterLoop = potentialLoop.nextBlock();
                                    // if the repeatUntilTouching loop is within another loop, create another script of the blocks following that outer loop 
                                    let blockOutsideLoop = potentialLoop.isWithin();
                            
                                    if (blockAfterLoop !== null) {
                                        let scriptAfterLoop = new Script(blockAfterLoop, blockAfterLoop.target);

                                        // if the repeatUntilTouching loop is within another loop, concatenate the two scripts created above
                                        if (blockOutsideLoop !== null) {
                                            let scriptOutsideLoop = new Script(blockOutsideLoop, blockOutsideLoop.target);
                                            scriptAfterLoop.blocks = scriptAfterLoop.blocks.concat(scriptOutsideLoop.blocks);
                                        }

                                        let waitBlockFound = false;
                                        let speechBlockFound = false;

                                        // iterate through the script representing all blocks after the repeatUntilTouching loop
                                        scriptAfterLoop.traverseBlocks((currBlock, level) => {
                                            // check for costume change to "Speaking", for unique req in Mulicultural strand
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
                                            // if sprite "jumps" after saying "Speech! Speech!", or some variant spelling/capitalization as long as it includes "eech!"
                                            // unique req for Multicultural strand
                                            // TODO: this just checks for a "change/set y" block
                                            // more rigorous evaluation should check for other types of vertical motion (like multiple gotoXY blocks, checking up/down differences in the y-coordinate)
                                            if (["motion_sety", "motion_changeyby"].includes(currBlock.opcode) && speechBlockFound) {
                                                report.jumps = true;
                                                report.jumpsAfter.saySpeech = true;
                                            }

                                            if (currBlock.opcode === "control_wait") {
                                                waitBlockFound = true;
                                            }
                                            // if sprite "jumps" after a wait block has already been used 
                                            // TODO: this just checks for a "change/set y" block
                                            // more rigorous evaluation should check for other types of vertical motion (like multiple gotoXY blocks, checking up/down differences in the y-coordinate)
                                            if (["motion_sety", "motion_changeyby"].includes(currBlock.opcode) && waitBlockFound) {
                                                report.jumps = true;
                                                report.jumpsAfter.waitBlock = true;
                                            }

                                            // check for sound block
                                            if (["sound_play", "sound_playuntildone"].includes(currBlock.opcode)) {
                                                report.sounds = true;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    // check for negative steps/movement to the left, inside a repeat until touching block (for "Bounce" extension)
                    if (stepNumber < 0) {
                        report.movesLeft = true;
                        // check if the move block is within a loop 
                        let potentialLoop = block.isWithin();
                        if (potentialLoop !== null) {
                            // if the move block is within a "repeat until touching" loop
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
                        // If no horizontal move blocks have been found before the "wait until touching" block, i.e. report.moves is false up to this point
                        if (!report.moves) {
                            report.waits = true;
                        }
                        report.waitsFor.push(waitUntilTarget);
                        report.score++;

                        // check remaining blocks for sound
                        let blocksAfterWait = block.childBlocks();
                        for (let currBlock of blocksAfterWait) {
                            if (["sound_play", "sound_playuntildone"].includes(currBlock.opcode)) {
                                report.sounds = true;
                            }
                        }
                    }
                }

                // check for any sound blocks within an "if 'touching X' then..." block
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

                // check for any Say blocks
                if (block.opcode.includes("looks_say")) {
                    report.speaks = true;
                    report.score++;
                }
            });
        }
        return report;
    }

    // given all Sprite reports, identify the best candidate for Sprite A, B, C, and Extra
    // Examples for each strand (Multicultural, Youth Culture, Gaming)
    // A: Marchers, Jaime, Player
    // B: Speaker, Ball, Stairs
    // C: Poster Holder, Goal, Cliff
    // Extra: Sprite that Walks across the road and says something, Goalie, sprite that goes to Blue Treasure Chest
    sortSprites(reports) {
        let sprites = {
            A: null,
            B: null,
            C: null,
            Extra: null,
        }

        // Identify Sprite B first
        let maxBScore = 0;
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

        // after Sprite B, find Sprite A
        let maxAScore = 0;
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

        // Once B and A have been found, C is easily identifiable
        for (let possibleC of reports) {
            if ((possibleC.name !== sprites.B.name) && (possibleC.name !== sprites.A.name)) {
                if (sprites.B.movesTo.includes(possibleC.name)) {
                    sprites.C = possibleC;
                }
            }
        }

        // find Extra sprite, if any. (Checks requirements for Multicultural and Gaming strand. In Youth Culture strand, any new sprite will be accepted)
        let maxExtraScore = 0;
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

    // main grading function
    grade(fileObj, user) {
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        var project = new Project(fileObj);
        this.init(project);

        let spriteReports = [];
        let totSprites = 0;

        for (let target of project.targets) {
            if (!target.isStage) {
                totSprites++;
                spriteReports.push(this.gradeSprite(target));
            }
        }

        let sortedSprites = this.sortSprites(spriteReports);
        let spriteA = sortedSprites.A;
        let spriteB = sortedSprites.B;
        let spriteC = sortedSprites.C;
        let spriteExtra = sortedSprites.Extra;

        if (this.strand === "multicultural") {
            if (spriteA.moves) this.requirements.marchersMove.bool = true;
            if (spriteA.stopsAt.includes(spriteB.name)) this.requirements.marchersStop.bool = true;
            if (spriteB.waits && spriteB.waitsFor.includes(spriteA.name))
                this.requirements.speakerWaits.bool = true;
            if (spriteB.moves && spriteB.movesTo.includes(spriteC.name))
                this.requirements.speakerMoves.bool = true;
            if (spriteB.changesCostumeToSpeaking) this.requirements.speakerChanges.bool = true;

            if (spriteA.sounds || spriteB.sounds || spriteC.sounds)
                this.extensions.soundAdded.bool = true;
            if (spriteA.jumpsAfter.saySpeech) this.extensions.marchersJump.bool = true;
            if (spriteExtra) {
                if (spriteExtra.moves && spriteExtra.speaks) this.extensions.newSpriteAdded.bool = true;
            }
        } else if (this.strand === "youthCulture") {
            if (spriteA.moves) this.requirements.jaimeMoves.bool = true;
            if (spriteA.stopsAt.includes(spriteB.name)) this.requirements.jaimeStops.bool = true;
            if (spriteB.waits && spriteB.waitsFor.includes(spriteA.name))
                this.requirements.ballWaits.bool = true;
            if (spriteB.moves && spriteB.movesTo.includes(spriteC.name))
                this.requirements.ballMoves.bool = true;

            if (spriteA.sounds || spriteB.sounds || spriteC.sounds)
                this.extensions.soundAdded.bool = true;
            if (spriteA.jumpsAfter.waitBlock) this.extensions.jaimeJumps.bool = true;
            if ((totSprites > 3) && spriteB.movesLeft) this.extensions.goalieAdded.bool = true;
            // bouncing extension
            if (spriteB.movesLeft) {
                // checks that after SpriteB waits for SpriteA and moves right to SpriteC the first time, it then moves left any distance, and then waits for SpriteA before moving right again
                // or that SpriteB moves Right to SpriteC, Left to SpriteA, and Right to SpriteC again, all using repeatUntilTouching Loops
                // i.e. checks that SpriteB movesTo SpriteC at least twice, AND (spriteB bouncesTo spriteA OR (spriteB waitsFor SpriteA twice AND spriteA movesTo spriteB twice))
                let numWaitsForA = 0;
                for (let i = 0; i < spriteB.waitsFor.length; i++) {
                    if (spriteB.waitsFor[i] === spriteA.name) {
                        numWaitsForA++;
                    }
                }
                // also check that SpriteA movesTo SpriteB at least twice (for "Jaime kicks the ball again" part of the extension)
                let numMovesToB = 0;
                for (let k = 0; k < spriteA.movesTo.length; k++) {
                    if (spriteA.movesTo[k] === spriteB.name) {
                        numMovesToB++;
                    }
                }

                let numBounces = 0;
                for (let j = 0; j < spriteB.movesTo.length; j++) {
                    if (spriteB.movesTo[j] === spriteC.name) {
                        numBounces++;
                    }
                }

                if (((numWaitsForA > 1) && (numMovesToB > 1)) || spriteB.bouncesTowards.includes(spriteA.name)) {
                    if (numBounces > 1) this.extensions.ballBounces.bool = true;
                }
            }

        } else if (this.strand === "gaming") {
            if (spriteA.moves) this.requirements.playerMoves.bool = true;
            if (spriteA.stopsAt.includes(spriteB.name)) this.requirements.playerStops.bool = true;
            if (spriteB.waits && spriteB.waitsFor.includes(spriteA.name))
                this.requirements.stairsWait.bool = true;
            if (spriteB.moves && spriteB.movesTo.includes(spriteC.name))
                this.requirements.stairsMove.bool = true;

            if (spriteA.sounds || spriteB.sounds || spriteC.sounds)
                this.extensions.soundAdded.bool = true;
            if (spriteA.jumpsAfter.waitBlock) this.extensions.playerJumps.bool = true;
            if (spriteExtra) {
                if (spriteExtra.movesTo.length) this.extensions.newSpriteAdded.bool = true;
            }
            // bouncing extension
            if (spriteB.movesLeft) {
                // checks that after SpriteB waits for SpriteA and moves right to SpriteC the first time, it then moves left any distance, and then waits for SpriteA before moving right again
                // or that SpriteB moves Right to SpriteC, Left to SpriteA, and Right to SpriteC again, all using repeatUntilTouching Loops
                // i.e. checks that SpriteB movesTo SpriteC at least twice, AND spriteB waitsFor SpriteA twice, or bouncesTowards SpriteA once
                let numWaitsForA = 0;
                for (let i = 0; i < spriteB.waitsFor.length; i++) {
                    if (spriteB.waitsFor[i] === spriteA.name) {
                        numWaitsForA++;
                    }
                }

                let numBounces = 0;
                    for (let j = 0; j < spriteB.movesTo.length; j++) {
                        if (spriteB.movesTo[j] === spriteC.name) {
                            numBounces++;
                        }
                    }

                if ((numWaitsForA > 1) || spriteB.bouncesTowards.includes(spriteA.name)) {  
                    if (numBounces > 1) this.extensions.stairsBounce.bool = true;
                }
            }
        } else {
            // if no strand found, error
            console.log("ERROR: unable to match strand.");
            return;
        }
    }
}