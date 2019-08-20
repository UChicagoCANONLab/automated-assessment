require('./scratch3');

let loops = ['control_forever', 'control_repeat', 'control_repeat_until'];

let within = (x, range) => x >= range[0] && x <= range[1];

module.exports = class {

    init() {
        this.requirements = {
            goodStartPosition: {bool: false, str: 'Bee starts at the beginning of the track.'},
            handlesDownArrow: {bool:false, str:'Bee has an event block for the down arrow.'},
            downArrowCostumeChange: {bool:false, str:'Bee changes costume on the down arrow.'},
            downArrowWaitBlock: {bool:false, str:'Bee wait block on down arrow.'},
            handlesSpaceBar: {bool:false, str:'Bee has an event block for the space bar.'},
            spaceBarLoop: {bool:false, str:'Bee loops on the space bar event.'},
            spaceBarMovement: {bool:false, str:'Bee moves within the loop.'},
            spaceBarCostumeChange: {bool:false, str:'Bee changes costume within the loop.'},
            spaceBarWaitBlock: {bool:false, str:'Bee has a wait block within the loop.'},
            beeFinishes: {bool:false, str:'Bee reaches the finish line through animation.'}
        };
        // this.extensions = {
        //     HasWinner: {bool: false, str:'There is a true winner to the race.'},
        //     WinnerVictoryDanceCostume: {bool:false, str:'Winner changes costume during victory dance.'},
        //     WinnerVictoryDanceTurn: {bool:false, str:'Winner uses turn block during victory dance.'},
        //     BeeWiggle: {bool:false, str:'Made the Bee take a wiggly path.'},
        //     AddedKangaroo: {bool:false, str:'Added Kangaroo.'},
        //     KangarooHop: {bool:false, str:'Made the Kangaroo hop.'},       
        //     AddedFourthSprite: {bool: false, str: 'Added a sprite'},
        //     AnimatedFourthSprite: {bool: false, str: 'Animated the addded sprite'}
        // };
    }

    grade(fileObj, user) {
        this.init()
        const project = new Project(fileObj);

        // iterate through sprites, compute a report for each, and add that to an array
        // "reports" are objects that show whether a sprite met a set of requirements,
        // as well as a score for a given sprite
        let reports = project.sprites.map(sprite => this.gradeSprite(sprite));

        // sort from highest to lowest score
        reports = reports.sort((a, b) => b.score - a.score);
        
        // filter to those that were identified as a bee
        let beeishReports = reports.filter(report => report.likelyName === 'bee')
        
        // if for some reason they have sprites that can do all of the things required, 
        // but are visibly unlike the default ones
        for (let n in [2, 3])
            if (reports.length >= n && !['bee', 'monkey', 'snake'].includes(reports[n].likelyName)) {
                beeishReports.push(reports[n]);
                break;
            }
        // re-sort
        beeishReports.sort((a, b) => b.score - a.score);

        // scores sprite most likely to be a bee, or the best bee, if there are multiple
        if (beeishReports.length >= 1) {
            const bee = beeishReports[0];
            this.requirements.goodStartPosition.bool = is(bee.stats.start);
            this.requirements.handlesDownArrow.bool = bee.down.handles;
            this.requirements.downArrowCostumeChange.bool = bee.down.costume;
            this.requirements.downArrowWaitBlock.bool = bee.down.wait;
            this.requirements.handlesSpaceBar.bool = bee.space.handles;
            this.requirements.spaceBarLoop.bool = bee.space.loop;
            this.requirements.spaceBarMovement.bool = bee.space.move;
            this.requirements.spaceBarCostumeChange.bool = bee.space.costume;
            this.requirements.spaceBarWaitBlock.bool = bee.space.wait;
            this.requirements.beeFinishes.bool = bee.stats.finished;
        }
        // sort by speed
        reports.sort((a, b) => b.stats.speed - a.stats.speed);
        reports = reports.filter(r => r.stats.finished);

    }    
    // helper method for grading each sprite
    gradeSprite(sprite) {
        
        // checks if sprites name or costume names allude to any of the default sprites
        let nameScores = {bee: 0, snake: 0, monkey: 0, kangaroo: 0};

        for (let givenSprite of Object.keys(nameScores)) {
            if (sprite.costumes.map(c => c.name).some(name => name.toLowerCase().includes(givenSprite)))
                nameScores[givenSprite]++;
            if (sprite.name.toLowerCase().includes(givenSprite))
                nameScores[givenSprite]++;
        }
        // start checking off requirements. firstly, what the start position was
        // additionally, check if the default positions are met
        let stats = {start: null, speed: {}, finished: {}, wiggle: false};
        
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === 'event_whenflagclicked'))
            script.traverseBlocks((block, level) => {
                if (block.opcode === 'motion_gotoxy') {
                    // checks if sprite starts before finish line
                    if (within(block.inputs.X[1][1], [-271, 115]))
                        stats.start = block.inputs.X[1][1];
                    // checks default start positions
                    const defaultPositions = {bee: [-174, -10], snake: [-211, -133], monkey: [-12, 83]}
                    for (const [name, pos] of Object.entries(defaultPositions)) {
                        if (block.inputs.X[1][1] === pos[0]) nameScores[name]++;
                        if (block.inputs.Y[1][1] === pos[1]) nameScores[name]++;
                    }
                }
            });
        // iterating through each script, checking if the sprite meets the requirements for
        // the down arrow and space key events
        let space = {handles: false, loop: false, wait: false, move: false, costume: false};
        let down = {handles: false, wait: false, costume: false};

        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode=== 'event_whenkeypressed')) {
            let event = script.blocks[0];
            let eventID = event.id;
            let key = event.fields.KEY_OPTION[0];
            stats.speed[eventID] = stats.finished[eventID] = {};
            
            if (key === 'space') {
                space.handles = true;
                script.traverseBlocks((block, level) => {
                    //check for loop
                    if(loops.includes(block.opcode)) {
                        space.loop = true;
                        stats.speed[eventID].repeats = (block.opcode === 'control_repeat') ? Number(block.inputs.TIMES[1][1]) : 1000000;
                    } else if (level > 1) {
                        if (block.opcode == 'control_wait') {
                            space.wait = true;
                            stats.speed[eventID].wait = Number(block.inputs.DURATION[1][1]);
                        } else if (block.opcode.includes('motion_turn')) {
                            stats.wiggle = true;
                        } else if (block.opcode == 'motion_movesteps') {
                            space.move = true;
                            stats.speed[eventID].move = Number(block.inputs.STEPS[1][1]);
                        } else if (['looks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode)) {
                            space.costume = true;
                        }
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
        const calc = (func) => Object.values(stats.speed).reduce((sum, s) => 
            (Object.keys(s).length === 3) ? sum + func(s) : sum, 0);
        
        stats.finished = calc(s => s.move * s.repeats) > 119 - stats.start;
        stats.speed = calc(s => s.move / s.wait);

        // summing all true values in the report
        let score = Number(is(stats.start));
        score += Object.values(space).concat(Object.values(down)).reduce((sum, val) => sum + Number(val), 0);
        score += Number(is(stats.finished));
        
        let likelyName = Object.entries(nameScores).reduce((ret, nameScore) => (ret[1] > nameScore[1]) ? ret : nameScore, [null, 0])[0];

        return {score, likelyName, space, down, stats};
    }
}
