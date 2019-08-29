require('./scratch3');

let loops = ['control_forever', 'control_repeat', 'control_repeat_until'];

module.exports = class {

    init() {
        this.requirements = {
            handlesDownArrow: {bool:false, str:'Both racing sprites have an event block for the down arrow.'},
            downArrowCostumeChange: {bool:false, str:'Both racing sprites switch costumes on the down arrow.'},
            downArrowWaitBlock: {bool:false, str:'Both racing sprites have a wait block on down arrow.'},
            bugFixed: {bool:false, str:'Bug fixed: both racing sprites finish the race when the space bar is pressed.'}
        };
        this.extensions = {
            HasWinner: {bool: false, str:'There is a true winner to the race.'},
            wigglyPath: {bool: false, str: 'A sprite moves in a wiggly path.'},
            showFourthSprite: {bool: false, str: 'The fourth sprite is shown and animated'},
            animateNewSprite: {bool: false, str: 'A new sprite animated'}
        };
    }

    strandIdentifier() {
        this.strand = null;





    }

    grade(fileObj, user) {
        this.init();
        const project = new Project(fileObj);

        // iterate through sprites, compute a report for each, and add that to an array
        // "reports" are objects that show whether a sprite met a set of requirements,
        // as well as a score for a given sprite
        let reports = project.sprites.map(sprite => this.gradeSprite(sprite));

        // sort from highest to lowest score
        let racingSprites = reports.filter(r => r.space.handles && r.down.handles);
        console.log(racingSprites);
        this.requirements.handlesDownArrow.bool = racingSprites.length >= 2;
        this.requirements.downArrowCostumeChange.bool = racingSprites.filter(r => r.down.costume).length >= 2;
        this.requirements.downArrowWaitBlock.bool = racingSprites.filter(r => r.down.wait).length >= 2;
        this.requirements.bugFixed.bool = racingSprites.filter(r => r.stats.finished).length >= 2;

        this.extensions.wigglyPath.bool = racingSprites.filter(r => r.stats.wiggle).length > 0
    
        // sort by speed
        reports.sort((a, b) => b.stats.speed - a.stats.speed);
        reports = reports.filter(r => r.stats.finished);

    }    
    // helper method for grading each sprite
    gradeSprite(sprite) {
        let stats = {start: null, loops: {}, wiggle: false};
        let down = {handles: false, wait: false, costume: false};
        let space = {handles: false, loop: false, wait: false, move: false, costume: false};

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === 'event_whenflagclicked'))
            script.traverseBlocks((block, level) => {
                if (block.opcode === 'motion_gotoxy') {
                    stats.start = block.inputs.X[1][1];
                }
            });
        if (!stats.start) {
            stats.start = sprite.x;
        }
        // iterating through each script, checking if the sprite meets the requirements for
        // the down arrow and space key events

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === 'event_whenkeypressed')) {
            let key = script.blocks[0].fields.KEY_OPTION[0];
            
            if (key === 'space') {
                space.handles = true;
                script.traverseBlocks((block, level) => {
                    if(loops.includes(block.opcode)) {
                        space.loop = true;
                        let loopID = block.id;
                        stats.loops[loopID] = {
                            repeats: (block.opcode === 'control_repeat') ? Number(block.inputs.TIMES[1][1]) : 1000000,
                            wait: 0,
                            move: 0
                        };
                    } else if (level > 1) {
                        if (block.opcode == 'control_wait') {
                            space.wait = true;
                            stats.loops[block.within.id].wait = Number(block.inputs.DURATION[1][1]);
                        } else if (block.opcode.includes('motion_turn')) {
                            stats.wiggle = true;
                        } else if (block.opcode == 'motion_movesteps') {
                            space.move = true;
                            stats.loops[block.within.id].move = Number(block.inputs.STEPS[1][1]);
                        } else if (['looks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode)) {
                            space.costume = true;
                        }
                    } else if (block.opcode === 'looks_sayforsecs' && block.inputs.MESSAGE[1][1] === 'Go!') {
                        space.handles = false;
                    }
                    
                });
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
        const calc = (func) => Object.values(stats.loops).reduce((sum, s) => 
            (Object.keys(s).length === 3) ? sum + func(s) : sum, 0);

        stats.finished = calc(s => s.move * s.repeats) > 119 - stats.start;
        stats.speed = calc(s => s.move / s.wait);
        console.log(stats.loops);
        return {name: sprite.name, space, down, stats};
    }
}
