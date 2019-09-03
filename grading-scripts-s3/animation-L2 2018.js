/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/

require('./scratch3');

module.exports = class {
    // initializes the requirement objects and a list of event block codes
    // which will be used below
    init() {
        this.requirements = {
            HaveBackdrop: {bool: false, str: "Background has an image."},
            atLeastThreeSprites: {bool: false, str: "There are at least 3 sprites."},
            Loop: {bool: false, str: "The main sprite has a loop."},
            Move: {bool: false, str: "The main sprite moves."},
            Costume: {bool: false, str: "The main sprite changes costume."},
            Wait: {bool: false, str: "The main sprite has a wait block."},
            Dance: {bool: false, str: "The main sprite does a complex dance."},
            SecondAnimated: {bool: false, str: "Another sprite is animated."},
            ThirdAnimated: {bool: false, str: "A third sprite is animated."}
        }
        this.extensions = {
            multipleDancingOnClick: {bool: false, str: "Multiple characters dance on click"},
            moreThanOneAnimation: {bool: false, str: "Student uses more than one motion block to animate their sprites"}
        }
        // project-wide variables
        this.animationTypes = [];
    }
    // helper function for grading an individual sprite
    gradeSprite(sprite) {

        var spriteDanceReqs = {
            loop: false,
            move: false,
            costume: false,
            wait: false
        };
        var spriteDanceScore = 0
        // and the following additional requirements
        var isAnimated = false;
        var danceOnClick = false;
        //iterating through each of the sprite's scripts, ensuring that only those that start with an event block are counted
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) { 

            var reqs = {loop: false, wait: false, costume: false, move: false};
            // search through each block and execute the given callback function
            // that determines what to look for and what to do (through side effects) for each block
            script.traverseBlocks((block, level) => {
                var opcode = block.opcode;

                reqs.loop = reqs.loop || ['control_forever', 'control_repeat', 'control_repeat_until'].includes(opcode);
                reqs.costume = reqs.costume || ['looks_switchcostumeto', 'looks_nextcostume'].includes(opcode);
                reqs.wait = reqs.wait || (opcode == 'control_wait');
                if (opcode.includes("motion_")) {
                    reqs.move = true;
                    if (!this.animationTypes.includes(opcode)) this.animationTypes.push(opcode);
                } 
            });
            
            isAnimated = isAnimated || (reqs.loop && reqs.wait && (reqs.costume || reqs.move));

            var scriptScore = Object.values(reqs).reduce((sum, val) => sum + val, 0);
            //check dance reqs (find highest scoring script)
            if (scriptScore >= spriteDanceScore) {
                spriteDanceReqs = reqs;
                spriteDanceScore = scriptScore;
                //check for dance (and dance on click)
                if (scriptScore == 4) {
                    if (script.blocks[0].opcode == 'event_whenthisspriteclicked') {
                        danceOnClick = true;
                    }
                }
            }            
        }
        return {
            name: sprite.name,
            danceScore: spriteDanceScore,
            animated: isAnimated,
            reqs: spriteDanceReqs,
            danceOnClick: danceOnClick
        };
    }
    // the main grading function
    grade(fileObj,user) {
        
        var project = new Project(fileObj);
        // initializing requirements and extensions
        this.init();
        // if project does not exist, return early
        if (!is(fileObj)) return; 
     
        var danceOnClick = 0;
        var animatedSprites = 0;
        var bestReport = null;

        // initializes sprite class for each sprite and adds scripts
        for(var target of project.targets){
            if(target.isStage){ 
                if (target.costumes.length > 1) {
                    this.requirements.HaveBackdrop.bool = true;  
                }
                continue;
            }
            var report = this.gradeSprite(target);
            if (!bestReport || report.danceScore > bestReport.danceScore) 
                bestReport = report;
            // for each sprite that is animated, increase counter
            if (report.animated) animatedSprites++;

            // for each sprite that dances on the click event, icnrease counter
            if (report.danceOnClick) danceOnClick++;
        }
        
        // sprite most likely to be the chosen sprite
        var chosen = bestReport;

        
        if (chosen) {
            // Set lesson requirements to those of "chosen" sprite
            this.requirements.Loop.bool = chosen.reqs.loop;
            this.requirements.Move.bool = chosen.reqs.move;
            this.requirements.Costume.bool = chosen.reqs.costume;
            this.requirements.Wait.bool = chosen.reqs.wait;
            // if previous 4 requirements are met, then the "chosen" sprite danced
            this.requirements.Dance.bool = (chosen.danceScore === 4);
        }
        
        
        // checks if there are more than 1 and 2 animated sprites
        this.requirements.SecondAnimated.bool = (animatedSprites > 1);
        this.requirements.ThirdAnimated.bool = (animatedSprites > 2);

        // Checks if there are "multiple" sprites dancing on click
        this.extensions.multipleDancingOnClick.bool = (danceOnClick > 1);

        //checks if there were at least 3 sprites (the minus 1 accounts for the Stage target, which isn't a sprite)
        this.requirements.atLeastThreeSprites.bool = (project.targets.length - 1 >= 3);

        //counts the number of animation (motion) blocks used
        this.extensions.moreThanOneAnimation.bool = (this.animationTypes.length > 1)
    }
}