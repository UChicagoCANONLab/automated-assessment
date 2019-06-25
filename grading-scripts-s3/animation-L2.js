/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/

require('./scratch3')

function score(obj) {
    var score = 0;
    for (var key in obj) {
        if(obj[key]) {
            score++;
        }
    }
    return score;
}

function boolObjOr(a, b) {
    if (typeof a != 'object' || typeof b != 'object') { 
        return -1;
    }
    return Object.keys(a).reduce((acc, key) => {
        acc[key] = a[key] || b[key];
        return acc;
    }, {})
}
// recursive function that searches a script and any subscripts (those within loops)
function scriptSearch(script, func) {
    function recursive(scripts, func, level) {

        if (!is(scripts) || scripts === [[]]) return;
        //console.log(scripts);

        for (var script of scripts) {
            // console.log(script.blocks.map(block => Object.keys(block)));
            for(var block of script.blocks) {
                
                func(block, level);
                recursive(block.subScripts(), func, level + 1);

            }
        }
    }
    
    recursive([script], func, 1);
}

const print = (block, level) => {
    console.log("   ".repeat(level) + block.opcode);
};

// MAIN GRADER CLASS –––––––––––––––
class GradeAnimationL2{
    // initializes the empty requirement objects and a list of event block codes
    // which will be used below
    constructor() {
        this.requirements = {};
        this.extensions = {};
        // useful opcode lists
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        this.loops = ['control_forever', 'control_repeat', 'control_repeat_until'];
        this.costumeChange = ['looks_switchcostumeto', 'looks_nextcostume'];
        // project-wide variables
        this.animationTypes = [];
    }
    
    initMetrics() {
        this.requirements.HaveBackdrop = {bool: false, str: "Background has an image."};
        this.requirements.atLeastThreeSprites = {bool: false, str: "There are at least 3 sprites."};
        this.requirements.Loop = {bool: false, str: "Chosen sprite has a loop."};
        this.requirements.Move = {bool: false, str: "Chosen sprite moves."};
        this.requirements.Costume = {bool: false, str: "Chosen sprite changes costume."};
        this.requirements.Wait = {bool: false, str: "Chosen sprite has a wait block."};
        this.requirements.Dance = {bool: false, str: "Chosen sprite does a complex dance."};
        this.requirements.SecondAnimated = {bool: false, str: "Another sprite is animated."};
        this.requirements.ThirdAnimated = {bool: false, str: "A third sprite is animated."};
     
        this.extensions.multipleDancingOnClick = {bool: false, str: "Multiple characters dance on click"};
        this.extensions.moreThanOneAnimation = {bool: false, str: "Student uses more than one motion block to animate their sprites"};
    }
    

    // helper function for grading an individual sprite
    gradeSprite(sprite) {

        var spriteDanceReqs = {
            loop: false,
            move: false,
            costume: false,
            wait: false
        };
        // and the following additional requirements
        var isAnimated = false;
        var danceOnClick = false;
        //iterating through each of the sprite's scripts, ensuring that only those that start with an event block are counted
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) { 

            var scriptDanceReqs = {loop: false, wait: false, costume: false, move: false};
    
            // callback function to scriptSearch that determines what to look for and what to do (through side effects) for each block
            const gradeBlock = (block, level) => {
                var opcode = block.opcode;
                var reqs = {}
                reqs.loop = this.loops.includes(opcode);
                reqs.wait = (opcode == 'control_wait');
                reqs.costume = this.costumeChange.includes(opcode);
                if (opcode.includes("motion_")) {
                    reqs.move = true;
                    if (!this.animationTypes.includes(opcode)) this.animationTypes.push(opcode);
                } else {
                    reqs.move = false;
                }
    
                scriptDanceReqs = boolObjOr(scriptDanceReqs, reqs);
            }
            //search through each block and execute gradeBlock
            scriptSearch(script, gradeBlock);
            // console.log(sprite.name);
            // scriptSearch(script, print);
        
            isAnimated = isAnimated || (scriptDanceReqs.loop && scriptDanceReqs.wait && (scriptDanceReqs.costume || scriptDanceReqs.move));
            
            //check dance reqs (find highest scoring script)
            var scriptScore = score(scriptDanceReqs);
            if (scriptScore >= score(spriteDanceReqs)) {
                spriteDanceReqs = scriptDanceReqs;
                
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
            danceScore: score(spriteDanceReqs),
            animated: isAnimated,
            reqs: spriteDanceReqs,
            danceOnClick: danceOnClick
        };
    }
    // the main grading function
    grade(fileObj,user) {
        
        var project = new Project(fileObj);
        // initializing requirements and extensions
        this.initMetrics();
        // if project does not exist, return early
        if (!is(fileObj)) return; 
     
        var danceOnClick = 0;
        var animatedSprites = 0;
        var bestReport = null;

        // initializes sprite class for each sprite and adds scripts
        for(var target of project.targets){
            // if target is the stage
            if(target.isStage){ 
                if (target.costumes.length > 1) {
                    this.requirements.HaveBackdrop.bool = true;  
                }
                continue;
            }
            var report = this.gradeSprite(target);
            if (!bestReport || report.danceScore > bestReport.danceScore) {
                bestReport = report;
            }
            // for each sprite that is animated, increase counter
            if (report.animated) animatedSprites++;

            // for each sprite that dances on the click event, icnrease counter
            if (report.danceOnClick) danceOnClick++;
        }
        
        // sprite most likely to be the chosen sprite
        var chosen = bestReport;

        // Set lesson requirements to those of "chosen" sprite
        this.requirements.Loop.bool = chosen.reqs.loop;
        this.requirements.Move.bool = chosen.reqs.move;
        this.requirements.Costume.bool = chosen.reqs.costume;
        this.requirements.Wait.bool = chosen.reqs.wait;
        
        // if previous 4 requirements are met, then the "chosen" sprite danced
        this.requirements.Dance.bool = (chosen.danceScore === 4);
        
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
module.exports = GradeAnimationL2;