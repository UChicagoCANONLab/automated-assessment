/*
Act 1 Parallel Path Grader
Intital version and testing: Zachary (Zack) Crenshaw, Winter 2020
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // sprites
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };
        this.requirements.hasTwoSprites = { bool: false, str: 'Project has at least two sprites' };
        // click parallelism
        this.requirements.OneSpriteParallelOnClick = { bool: false, str: 'Project has at at least one sprite do two things on click' };
        this.requirements.TwoSpritesParallelOnClick = { bool: false, str: 'Project has at least two sprites do two things on click' };
        // number 9 parallelism
        this.requirements.OneSpriteActOnNine = { bool: false, str: 'Project has one sprite do someting on number 9 key press' };
        this.requirements.TwoSpritesActOnNine = { bool: false, str: 'Project has two sprites do someting on number 9 key press' };
        //this.requirements.TwoSpritesSameActionOnNine = { bool: false, str: 'Project has two sprites do the same thing on number 9 key press' };
        

    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;

        let numParallelOnClick = 0;
        let numActOnNine = 0;
        let OnNineScripts = [];
        let sprite = 0;

        for (let target of project.targets) {
            let numOnClickScripts = 0;

            for (let script of target.scripts) {
                //finds all scripts caused by clicking sprite
                if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                    if (script.blocks.length > 1) {
                        numOnClickScripts++;
                    }
                }

                //check for key press (on #9)
                if (script.blocks[0].opcode === 'event_whenkeypressed') {
                    if (script.blocks[0].fields["KEY_OPTION"][0] === "9"){
                        //if valid script, collect it
                        if (script.blocks.length > 1) {
                            numActOnNine++;
                            if (OnNineScripts[sprite] == null){
                                OnNineScripts.push([script.blocks]);
                            } else {
                                OnNineScripts[sprite].push(script.blocks)
                            }
                        }
                    }
                }
                
            }

            //if there are at least 2 scripts for OnClick, sprite has parallel scripts
            //TODO: check robustness (potential issue: sprite has two scripts that are identical)
            if (numOnClickScripts >= 2) {
                numParallelOnClick++;
            }

            sprite++;
            
        }

        // number of sprites
        if (project.sprites.length >= 1) {
            this.requirements.hasOneSprite.bool = true;

            if (project.sprites.length >= 2) {
                this.requirements.hasTwoSprites.bool = true;
            } 
    
        } 
        
        // click parallelism 
        if (numParallelOnClick >= 1) {
            this.requirements.OneSpriteParallelOnClick.bool = true;

            if (numParallelOnClick >= 2) {
                this.requirements.TwoSpritesParallelOnClick.bool = true;
            }
        }


        // on number 9 parallelism
        if (numActOnNine >= 1){
            this.requirements.OneSpriteActOnNine.bool = true;

            if (numActOnNine >= 2){
                this.requirements.TwoSpritesActOnNine.bool = true;
            }
        }
        

        
        


    }

    
}
