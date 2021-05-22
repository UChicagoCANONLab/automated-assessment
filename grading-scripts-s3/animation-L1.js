require('./scratch3');

const loops = ['control_forever', 'control_repeat', 'control_repeat_until'];


module.exports = class {

    init(json) {

        let strandName = detectStrand(json, {
                gaming: require('./templates/animation-L1-gaming.json'),
                multicultural: require('./templates/animation-L1-multicultural.json'),
                youthCulture: require('./templates/animation-L1-youth-culture.json')
        });
        let differences = {
            gaming: {spriteNames: ['Snake', 'Bee', 'Kangaroo'], endPosition: 119},
            multicultural: {spriteNames: ['Red Dragon Boat', 'Blue Dragon Boat', 'Fish'], endPosition: 350},
            youthCulture: {spriteNames: ['Jordyn', 'Miguel', 'Referee'], endPosition: 220},
            generic: {spriteNames: ['Sprite 1', 'Sprite 2', 'Hidden Sprite'], endPosition: 119}
        };
        console.log(strandName);
        this.strand = {name: strandName, ... differences[strandName]};
        let racingSprites = this.strand.spriteNames.slice(0, 2).join(' and ');

        this.requirements = {
            handlesDownArrow: {bool: false, str: 'Both ' + racingSprites + ' have an event block for the down arrow.'},
            downArrowCostumeChange: {bool: false, str: 'Both ' + racingSprites + ' switch costumes on the down arrow.'},
            downArrowWaitBlock: {bool: false, str: 'Both ' + racingSprites + ' have a wait block on down arrow.'},
            bugFixed: {bool: false, str: 'Bug fixed: both ' + racingSprites + ' finish the race when the space bar is pressed.'}
        };
        this.extensions = {
            winnerCelebrates: {bool: false, str: 'The race has a winner and they celebrate.'},
            showFourthSprite: {bool: false, str: this.strand.spriteNames[2] + ' (and the 3 other sprites) are shown and animated.'},
            animateNewSprite: {bool: false, str: 'A 5th sprite is added from the Scratch library and animated.'}
        };

        if (this.strand.name === 'gaming') {
            this.extensions.wigglyPath = {bool: false, str: 'The Bee moves in a wiggly path.'};
        }
    }


    grade(json, user) {
        this.init(json);
        const project = new Project(json);

        // iterate through sprites, compute a report for each, and add that to an array
        // "reports" are objects that show whether a sprite met a set of requirements,
        // as well as a score for a given sprite
        let reports = project.sprites.map(sprite => this.gradeSprite(sprite));
        console.log(reports);
        let racingSprites = reports.filter(r => r.space.handles);

        let finishers = racingSprites.filter(r => r.space.finished).length

        this.requirements.handlesDownArrow.bool = racingSprites.filter(r => r.down.handles).length >= 2;
        this.requirements.downArrowCostumeChange.bool = racingSprites.filter(r => r.down.costume).length >= 2;
        this.requirements.downArrowWaitBlock.bool = racingSprites.filter(r => r.down.wait).length >= 2;
        this.requirements.bugFixed.bool = finishers >= 2;

        // Check how many sprites are animated
        let animatedSprites = reports.filter(r => r.isAnimated).length;
        this.extensions.showFourthSprite.bool = animatedSprites >= 4;
        this.extensions.animateNewSprite.bool = animatedSprites >= 5;

        if (finishers >= 2) {
            console.log(racingSprites);
            let fastestSprite = racingSprites.reduce((min, r) => (r.space.duration < min.space.duration)? r : min, racingSprites[0]);
            let isTie = racingSprites.filter(r => r.space.duration === fastestSprite.space.duration).length > 1;
            this.extensions.winnerCelebrates.bool = !isTie && fastestSprite.space.celebrates;
        }
        if (this.strand.name === 'gaming') {
            this.extensions.wigglyPath.bool = racingSprites.filter(r => r.space.wiggle).length > 0;
        }
    }    
    // helper method for grading each sprite
    gradeSprite(sprite) {
        
        let startPosition = null;
        let down = {handles: false, wait: false, costume: false};
        let space = {handles: false, loops: {}, finished: false, wiggle: false, celebrates: false};

        
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === 'event_whenflagclicked'))
            script.traverseBlocks((block, level) => {
                if (block.opcode === 'motion_gotoxy') 
                    startPosition = block.inputs.X[1][1];
            });
        if (!startPosition) 
            startPosition = sprite.x;
        
        const distanceTravelled = () => Object.values(space.loops).reduce((sum, r) => {
            return (!Object.values(r).some(key => key === 0)) ? sum + (r.move * r.repeats) : sum;
        }, 0);
        const distance = (this.strand.endPosition - startPosition)
        const isFinished = () => {
            return distanceTravelled() >= distance;
        }

        // iterating through each script, checking if the sprite meets the requirements for
        // the down arrow and space key events

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === 'event_whenkeypressed')) {
            let key = script.blocks[0].fields.KEY_OPTION[0];
            
            if (key === 'space') {
                space.handles = true;
                script.traverseBlocks((block, level) => {
                    let isBlockInLoop = block.isWithin(b => Object.keys(space.loops).includes(b.id))
                    if (isBlockInLoop || !(space.finished = isFinished(space.loops))) {
                        
                        if(loops.includes(block.opcode)) {
                            space.loops[block.id] = {
                                repeats: (block.opcode === 'control_repeat') ? Number(block.inputs.TIMES[1][1]) : Number.MAX_VALUE,
                                wait: 0,
                                move: 0
                            };
                        
                        } else if (level > 1) {
                            if (block.opcode == 'control_wait') {
                                space.loops[block.within.id].wait += Number(block.inputs.DURATION[1][1]);
                            } else if (block.opcode.includes('motion_turn')) {
                                space.wiggle = true;
                            } else if (block.opcode == 'motion_movesteps') {
                                space.loops[block.within.id].move += Number(block.inputs.STEPS[1][1]);
                            }
                        // if is likely the gaming strand monkey
                        } else if (block.opcode === 'looks_sayforsecs' && block.inputs.MESSAGE[1][1] === 'Go!') {
                            space.handles = false;
                        }
                    } else if (!isBlockInLoop && !block.opcode.includes('costume')) {
                        space.celebrates = true;
                    }
                }, loops);
            } else if (key === 'down arrow') {
                down.handles = true;
                script.traverseBlocks((block, level) => {
                    if(['looks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode)){
                        down.costume = true;
                    } else if (block.opcode == 'control_wait'){
                        down.wait = true;
                    }
                });
            }
        }
        // calculating speed and whether the sprite crossed the finish line from wait, move, and repeat blocks
        // accounts for multiple loops
        
        const speed = () => Object.values(space.loops).reduce((sum, r) => 
            (!Object.values(r).some(key => key === 0)) ? sum + (r.move / r.wait) : sum, 0);
        space.finished = isFinished();
        
        space.duration = (space.finished)? (((space.wiggle) ? 2 : 1) * distance) / speed() : Number.MAX_VALUE;
        console.log(sprite.name);
        console.log(speed());
        return {
            name: sprite.name, 
            visible: sprite.visible, 
            isAnimated: this.isAnimated(sprite),
            startPosition, space, down
        };
    }

    isAnimated(sprite) {
        let loopTracker = {};
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
            script.traverseBlocks((block, level) => {
                if (loops.includes(block.opcode)) {
                    loopTracker[block.id] = {}
                } else if (level > 1) {
                    let loopID = block.isWithin(b => loops.includes(b.opcode)).id;
                    loopTracker[loopID].costume = loopTracker[loopID].costume || block.opcode.includes('costume');
                    loopTracker[loopID].wait = loopTracker[loopID].wait || (block.opcode === 'control_wait');
                    loopTracker[loopID].move = loopTracker[loopID].move || block.opcode.includes('motion_');
                }
            }, loops);
        }
        return Object.values(loopTracker).some(l => l.wait && (l.costume || l.move));
    }

}
