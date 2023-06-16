(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
Act 1 About Me Grader
Intital version and testing: Saranya Turimella, Summer 2019
Updated to reflect new act 1 
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // sprites - done
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };
        this.requirements.hasTwoSprites = { bool: false, str: 'Project has at least two sprites' };
        this.requirements.hasThreeSprites = { bool: false, str: 'Project has at least three sprites' };
        // interaction - done
        this.requirements.hasOneSpeakingInteractive = { bool: false, str: 'Project has at least one sprite that says or thinks' };
        this.requirements.hasTwoSpeakingInteractive = { bool: false, str: 'Project has at least two sprites that says or thinks' };
        this.requirements.hasThreeSpeakingInteractive = { bool: false, str: 'Project has at least three sprites that says or thinks' };
        // interactive and speaking  - done
        this.requirements.oneInteractive = { bool: false, str: 'Project has one sprite with at least three actions' };
        this.requirements.twoInteractive = { bool: false, str: 'Project has two sprites with at least three actions' };
        this.requirements.threeInteractive = { bool: false, str: 'Project has three sprites with at least three actions' };
        // background - done
        this.requirements.hasBackdrop = { bool: false, str: 'This project has a backdrop' };
        // speaking - done
      

        // check for block usage - done 
        // this.extensions.usesThinkBlock = { bool: false, str: 'Project uses the think block' };
        // this.extensions.changeSize = { bool: false, str: 'Project uses change size block' };
        // this.extensions.playSound = { bool: false, str: 'Project uses play sound until done' };
        // this.extensions.moveSteps = { bool: false, str: 'Project uses a move block' };
        


    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;


        let isInteractiveAndSpeaks = false;
        let numInteractiveAndSpeaks = 0;
        let numInteractive = 0;

        for (let target of project.targets) {
            if (target.isStage) {
                // checks all the backdrops of the project and makes sure that there is more than one and that
                // the asset ID is not equal to the original one
                for (let cost in target.costumes) {
                    if ((target.costumes.length > 1) || (cost.assetID !== "cd21514d0531fdffb22204e0ec5ed84a")) {
                        this.requirements.hasBackdrop.bool = true;
                    }
                }
            }
            else {

                for (let script of target.scripts) {
                    // finds a script that starts when when the sprite is clicked and then makes sure that there is a script attached
                    // increases the number of interactive sprites
                    if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                        if (script.blocks.length > 4) {
                            numInteractive++;
                        }
                        for (let i = 0; i < script.blocks.length; i++) {
                            // finds the blocks in a script that are a say block, once a block is found
                            // boolean that shows that there is an interactive sprite that speaks is marked as true
                            var opcode = script.blocks[i].opcode
                            isInteractiveAndSpeaks = opcode.includes("looks_say") || opcode.includes("looks_think")
                        }
                    }

                    // looks for different blocks to mark the extensions are true
                    // for (let i = 0; i < script.blocks.length; i++) {
                    //     if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                    //         this.extensions.usesThinkBlock.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'looks_changesizeby') {
                    //         this.extensions.changeSize.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'sound_playuntildone') {
                    //         this.extensions.playSound.bool = true;
                    //     }
                    //     if (script.blocks[i].opcode === 'motion_movesteps') {
                    //         this.extensions.moveSteps.bool = true;
                    //     }
                                      
                    // }
                    // everytime there is a sprite that is interactive and speaks, increase the number of the sprites that fall under
                    // this category
                    if (isInteractiveAndSpeaks) {
                        numInteractiveAndSpeaks ++;
                    }
                }
            }
        }

        // number of sprites
        if (project.sprites.length >= 1) {
            this.requirements.hasOneSprite.bool = true;
        } 
        if (project.sprites.length >= 2) {
            this.requirements.hasTwoSprites.bool = true;
        } 
        if (project.sprites.length >= 3) {
            this.requirements.hasThreeSprites.bool = true;
        }

        // number of interactive sprites
        if (numInteractive >= 1) {
            this.requirements.oneInteractive.bool = true;
        } 
        if (numInteractive >= 2) {
            this.requirements.twoInteractive.bool = true;
        } 
        if (numInteractive >= 3) {
            this.requirements.threeInteractive.bool = true;
        }

        // number of interactive and speaking sprites
        if (numInteractiveAndSpeaks >= 1) {
            this.requirements.hasOneSpeakingInteractive.bool = true;
        }
        if (numInteractiveAndSpeaks >= 2) {
            this.requirements.hasTwoSpeakingInteractive.bool = true;
        } 
        if (numInteractiveAndSpeaks >= 3) {
            this.requirements.hasThreeSpeakingInteractive.bool = true;
        }

    }
}

},{"../grading-scripts-s3/scratch3":26}],2:[function(require,module,exports){
/*
Act 1 Animal Parade Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3');

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.twoSprites = {bool: false, str: 'Two sprites move across the screen using a loop'};
        this.requirements.threeSprites = {bool: false, str: 'Three sprites move across the screen using a loop'};
        this.requirements.fourSprites = {bool: false, str: 'Four sprites move accross the screen using a loop'};
        this.requirements.sound = {bool: false, str: 'Two sprites make a sound as they move'};
        this.extensions.newSprite = {bool: false, str: 'Add a new sprite (with more than one costume) and have it move across the screen using a loop'};
        this.extensions.changeY = {bool: false, str: 'Have a sprite move up and down the screen'}
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        function procSprite(sprite){
            var out = { movesInLoop : false,
                        soundInLoop : false,
                        changesY: false};
            var validLoops = [].concat.apply([], sprite.scripts.filter(s=> s.blocks[0].opcode.includes("event_")).map(s=>s.blocks.filter(block=> block.opcode.includes("control_forever") || block.opcode.includes("control_repeat"))));
            out.movesInLoop = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("motion_change") || block.opcode.includes("motion_move"))));
            out.soundInLoop = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("sound_play"))));
            out.changesY = validLoops.some(loop=>loop.subscripts.some(s=> s.blocks.some(block=>block.opcode.includes("motion_changeyby"))));
            return out
        }
        var results = project.targets.map(procSprite)
        var numMovingSprites = results.filter(r=>r.movesInLoop).length
        this.requirements.twoSprites.bool = numMovingSprites > 1;
        this.requirements.threeSprites.bool = numMovingSprites > 2;
        this.requirements.fourSprites.bool = numMovingSprites > 3;

        this.requirements.sound.bool = results.filter(r=>r.soundInLoop).length > 1;

        this.extensions.changeY.bool = results.filter(r=> r.changesY).length > 0;
        this.extensions.newSprite.bool = numMovingSprites > 4;


        //runs helper methods
    }
}
},{"../grading-scripts-s3/scratch3":26}],3:[function(require,module,exports){
/*
Act 1 Dance Party Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3');

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        // this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        // this.requirements.costumes = { bool: false, str: 'At least half of the sprites have new costumes' };//done
        // this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        // this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have new dialogue using blocks specified' };//done
        // this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        // this.requirements.movement = { bool: false, str: 'At least half of the sprites have new movement using blocks specified' };//to fix
        this.requirements.backdrop = { bool: false, str: 'Add a background' };//done
        this.requirements.twoSprites = {bool: false, str: 'Added at least two sprites'}
        this.requirements.twoScriptsEach = {bool: false, str: 'Each sprite has at least two scripts and a "Go to XY" block'}
        this.requirements.repeat = {bool: false, str: 'At least one sprite has a repeat block'}
        this.requirements.twoInteractiveBlocks = {bool: false, str: 'Each sprite has at least two looks, sound, or motion blocks'}
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        console.log(project.targets)
        let stage = project.targets.find(t => t.isStage);
        // Count the number of backdrops that are not the default white
        let uniqueBackDrops = stage.costumes.filter(c => c.assetId != 'cd21514d0531fdffb22204e0ec5ed84a').length;

        this.requirements.backdrop.bool = uniqueBackDrops > 0;
        let sprites = project.targets.filter(t=> !t.isStage);
        this.requirements.twoSprites.bool = sprites.length >= 2;
        function procSprite(sprite){
            var out = {nEvents:0, goToBlock:false, repeatBlock: false, nInteractive: 0}
            out.nEvents = new Set(sprite.scripts.map(s=>s.blocks[0].opcode + JSON.stringify(s.blocks[0].fields)).filter(oc=> oc.includes("event_when"))).size;
            out.goToBlock = sprite.scripts.filter(s=>s.blocks[0].opcode.includes("event_")).some(s=>s.blocks.some(block=>block.opcode==="motion_gotoxy"))
            out.repeat = sprite.scripts.filter(s=>s.blocks[0].opcode.includes("event_")).some(s=>s.blocks.some(block=>block.opcode.includes("control_repeat") || block.opcode.includes("control_forever")))
            out.nInteractive = Object.values(sprite.blocks).filter(b=>!b.topLevel && (b.opcode.includes("looks_") || b.opcode.includes("sound_") || b.opcode.includes("motion_"))).length;
            return out;
        }
        var results = sprites.map(procSprite);
        console.log(results)
        this.requirements.twoScriptsEach.bool = results.every(r=>r.nEvents >= 2 && r.goToBlock);
        this.requirements.repeat.bool = results.some(r=>r.repeat);
        this.requirements.twoInteractiveBlocks.bool = results.every(r=>r.nInteractive >= 2);
   

        return;
    }
}
},{"../grading-scripts-s3/scratch3":26}],4:[function(require,module,exports){
/*
Act 1 Final Project Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

     initReqs() {
    
        this.requirements.longScript = { bool: false, str: 'At least one script with 4 blocks' };//done
        this.requirements.events = { bool: false, str: 'At least one sprite with three different event blocks.' };//done
        this.requirements.loop = { bool: false, str: 'At least one sprite uses a repeat block to move smoothly.' };//done
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let stage = project.targets.find(t => t.isStage);
     
       let sprites = project.targets.filter(t=> !t.isStage);

        function procSprite(sprite){
            var out = {maxScriptLength:0, nEvents:0, hasLoop:false}
            out.maxScriptLength = Math.max(...sprite.scripts.filter(s=> s.blocks[0].opcode.includes("event_")).map(s=>s.blocks.length));
            out.nEvents = new Set(sprite.scripts.filter(s=> s.blocks[0].opcode.includes("event_")).filter(s=>s.blocks.length > 1).map(s=>s.blocks[0].opcode + JSON.stringify(s.blocks[0].fields))).size;
            var loops = sprite.scripts.filter(s=> s.blocks[0].opcode.includes("event_")).map(s=>s.blocks.filter(b=>b.opcode.includes("control_repeat"))).flat();
            out.hasLoop = loops.some(loop=>loop.subscripts.some(s=>s.blocks.some(block=>block.opcode.includes("motion_") && s.blocks.some(block=>block.opcode.includes("control_wait")))));
            return out;
        }
        var results = sprites.map(procSprite);
        this.requirements.longScript.bool = Math.max(...results.map(r=>r.maxScriptLength)) >= 4;
        this.requirements.events.bool = results.filter(r=>r.nEvents >= 3).length > 0;
        this.requirements.loop.bool = results.some(r=>r.hasLoop);
        // this.reqiuirements.loop.bool = results.some(r=>r.hasLoop);
        console.log(results);
        console.log(results.some(r=>r.hasLoop));
        console.log(sprites);
   

        return;
    }
}
},{"../grading-scripts-s3/scratch3":26}],5:[function(require,module,exports){
/*
Act 1 Knock Knock Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.sheepLaughs = { bool: false, str: 'The sheep laughs after the cow says "Moooooooo"' };
        this.requirements.anotherKnockKnock = { bool: false, str: 'Another knock knock joke is told, starting when the space bar is pressed' };
    }

    grade(fileObj, user) {
        this.initReqs();
        if (!is(fileObj)) {
            return;
        }

        var project = new Project(fileObj, null);
        
        let soundOptions = ['looks_say', 'looks_sayforsecs', 'sound_playforsecs', 'sound_playuntildone'];
        let sheepJoke = [];
        let cowJoke = [];
        let goodSheep = ['event_whenkeypressed', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs'];
        let goodCow = ['event_whenkeypressed', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_sayforsecs'];

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                // sheep sprite - check that the sheep laughs, needs to add a wait block and then a sound block to laugh
                // after the cow says moo
                if (target.name === 'Sheep') {
                    for (let script of target.scripts) {
                        // starts with when green flag clicked
                        if (script.blocks[0].opcode === 'event_whenflagclicked') {
                            for (let i = 0; i < script.blocks.length; i++) {
                                // finds the block with the opcode that is a think (last block in the script of the original project)
                                if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                                    let nextBlock = script.blocks[i].next;
                                    if (nextBlock !== null) {
                                        // makes sure that the next block added is a wait
                                        if (target.blocks[nextBlock].opcode === 'control_wait') {
                                            let nextNextBlock = target.blocks[nextBlock].next;
                                            if (nextNextBlock !== null) {
                                                // next block added after that should be a sound 
                                                if (soundOptions.includes(target.blocks[nextNextBlock].opcode)) {
                                                    this.requirements.sheepLaughs.bool = true;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // collects all the blocks that are in the script when space key pressed for sheep
                        if (script.blocks[0].opcode === 'event_whenkeypressed') {
                            if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    sheepJoke.push(script.blocks[i].opcode);
                                }
                            }
                        }
                    }
                }
                // collects all the blocks that are in the script when space key pressed for cow
                if (target.name === 'Cow') {
                    for (let script of target.scripts) {
                        if (script.blocks[0].opcode === 'event_whenkeypressed') {
                            if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    cowJoke.push(script.blocks[i].opcode);
                                }
                            }
                        }
                    }
                }
            }
        }

        var util = require('util');
        let cowOrig = util.inspect(goodCow);
        let sheepOrig = util.inspect(goodSheep);
        let cowUtil = util.inspect(cowJoke);
        let sheepUtil = util.inspect(sheepJoke);

        // checks that the opcodes of the jokes that were collected previously
        // match the correct order of a knock knock joke
        // if this is true the requirement is set to true 
        if (cowOrig === cowUtil && sheepOrig === sheepUtil) {
            this.requirements.anotherKnockKnock.bool = true;
        }
    }
}
},{"../grading-scripts-s3/scratch3":26,"util":71}],6:[function(require,module,exports){
/* 
Act 1 Name Poem Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/

require('../grading-scripts-s3/scratch3')


module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_gotoxy', 'motion_glidesecstoxy', 'looks_sayforsecs', 'sound_playuntildone', 'looks_setsizeto', 'looks_show', 'looks_hide', 'control_wait', 'control_repeat'];
    }

    initReqs() {
        // this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        // this.requirements.costumes = { bool: false, str: 'At least half of the sprites have new costumes' };//done
        // this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        // this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have new dialogue using blocks specified' };//done
        // this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        // this.requirements.movement = { bool: false, str: 'At least half of the sprites have new movement using blocks specified' };//to fix
        this.requirements.backdrop = { bool: false, str: 'Add a background' };//done
        this.requirements.newSprite = { bool: false, str: 'Added at least one letter sprite' };//done
        this.requirements.allSpritesSayThink = { bool: false, str: 'Each sprite says or thinks one adjective about me' };//done
        this.requirements.allSpritesThreeActions = { bool: false, str: 'Each sprite performs three different actions' };//done
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        console.log(project.targets)
        let stage = project.targets.find(t => t.isStage);
        // Count the number of backdrops that are not the default white
        let uniqueBackDrops = stage.costumes.filter(c => c.assetId != 'cd21514d0531fdffb22204e0ec5ed84a').length;

        this.requirements.backdrop.bool = uniqueBackDrops > 0;

        let sprites = project.targets.filter(t => !t.isStage);

        this.requirements.newSprite.bool = sprites.length > 0;

        function checkSpriteSaysOrThinks(sprite){
            function checkBlocksForTargets(block) { return ['looks_say', 'looks_think'].some(target => block.opcode.includes(target));};
            return sprite.scripts.some(script=> script.blocks[0].opcode.includes('event_') && script.blocks.some(checkBlocksForTargets));
        }

        function checkThreeActions(sprite){
            return sprite.scripts.some(script => script.blocks[0].opcode.includes('event_') && script.blocks.length > 3)
        }
        this.requirements.allSpritesSayThink.bool = sprites.every(checkSpriteSaysOrThinks);
        this.requirements.allSpritesThreeActions.bool = sprites.every(checkThreeActions);

        return;
    }
}








},{"../grading-scripts-s3/scratch3":26}],7:[function(require,module,exports){
/*
Act 1 Events Ofrenda Autograder
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.leftCostume = { bool: false, str: 'The left costume has been changed' }; // done
        this.requirements.leftChanged = { bool: false, str: 'The left sprite has new dialogue' }; // done
        this.requirements.middleSay = { bool: false, str: 'The middle sprite says something when clicked' }; // done
        this.requirements.rightSay = { bool: false, str: 'The right sprite says something when clicked' }; // done

        // done
        /*
        this.requirements.speaking1 = { bool: false, str: '1 sprite uses the say block' };
        this.requirements.speaking2 = {bool: false, str: '2 sprites use the say block'};
        this.requirements.speaking3 = {bool: false, str: '3 sprites use the say block'};
        this.requirements.interactive1 = { bool: false, str: '1 sprite is interactive' };
        this.requirements.interactive2 = {bool: false, str: '2 sprites are interactie'};
        this.requirements.costume1 = {bool: false, str: '1 sprite has a new costume'};
        this.requirements.costume2 = {bool: false, str: '2 sprites have a new costume'};
        this.requirements.costume3 = {bool: false, str: '3 sprites have a new costume'};
        */
        
       
        // // extensions
        this.extensions.leftSpaceSay = { bool: false, str: 'The left sprite says something when the space key is pressed' };
        this.extensions.catrinaTurn = { bool: false, str: 'Catrina turns when an arrow key is pressed' };
        this.extensions.middleSound = { bool: false, str: 'The middle sprite makes a sound when a letter key is pressed' };
        this.extensions.rightAnyKey = { bool: false, str: 'The right sprite does something when any key is pressed' };
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        console.log(project.sprites.find(s => s.name ==='Left'));

        var allSprites = project.sprites;

        var leftSprite;
        var middleSprite;
        var rightSprite;

        var candidates = allSprites.filter(s => s.name.toLowerCase().includes('left'));


        function euclideanDistance(x1, y1, x2, y2) {
            return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
        }
        if(candidates.length == 1){
            leftSprite = candidates[0];
        } else {
            // function distToLeft(s) {return Math.pow(Math.pow(s.x - -71, 2) + Math.pow(s.y - 56, 2), 0.5) }
            function distToLeft(s) {return euclideanDistance(s.x, s.y, -71, 56)};

            allSprites.sort((a, b) => distToLeft(a) - distToLeft(b));
            leftSprite = allSprites[0];
        }
        allSprites = allSprites.filter(s => s.name != leftSprite.name);

        candidates = allSprites.filter(s => s.name.toLowerCase().includes('middle'));

        if(candidates.length == 1){
            middleSprite = candidates[0];
        } else {
            function distToMiddle(s) {return euclideanDistance(s.x, s.y, 6, 53)};

            allSprites.sort((a, b) => distToMiddle(a) - distToMiddle(b));
            middleSprite = allSprites[0];
        }

        allSprites = allSprites.filter(s => s.name != middleSprite.name);

        candidates = allSprites.filter(s => s.name.toLowerCase().includes('right'));

        if(candidates.length == 1){
            rightSprite = candidates[0];
        } else {
            function distToRight(s) {return euclideanDistance(s.x, s.y, 71, 54)};

            allSprites.sort((a, b) => distToRight(a) - distToRight(b));
            rightSprite = allSprites[0];
        }

        allSprites = allSprites.filter(s => s.name != rightSprite.name);

        this.requirements.leftCostume.bool = leftSprite.costumes[leftSprite.currentCostume].assetId != '8900e1f586f49453f2e7501e3fe4cfdd';
        var leftScriptSayContents = leftSprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenthisspriteclicked")).map(s => s.blocks.filter(b => b.opcode.includes('looks_say')).map(b=>b.inputs['MESSAGE'][1][1]) ).filter(arr => arr.length > 0);
        var originalMessages = ["Hi There!", "I loved to cook with my granchildren."];
        this.requirements.leftChanged.bool = !leftScriptSayContents.some(script=>script.some(message=> originalMessages.includes(message)));

        var onClickMiddleScripts = middleSprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenthisspriteclicked"));
        if(onClickMiddleScripts.length > 0){
            this.requirements.middleSay.bool = onClickMiddleScripts.some(s => s.blocks.some(block => block.opcode.includes("looks_say")));

        }

        var onClickRightScripts = rightSprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenthisspriteclicked"));
        if(onClickRightScripts.length > 0){
            this.requirements.rightSay.bool = onClickRightScripts.some(s => s.blocks.some(block => block.opcode.includes("looks_say")));
        }

        var leftWhenSpacePressedScripts = leftSprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenkeypressed") && s.blocks[0].fields.KEY_OPTION[0] ==="space");
        if(leftWhenSpacePressedScripts.length > 0){
            this.extensions.leftSpaceSay.bool = leftWhenSpacePressedScripts.some(s => s.blocks.some(block => block.opcode.includes("looks_say")));
        }

        // We check all remaning sprites to see if any have event_whenkeypressed blocks set to listen to an arrow
        var catrinaCandidates = allSprites;
        var catrinasArrowScripts = catrinaCandidates.map(catrina => catrina.scripts.filter(s => s.blocks[0].opcode.includes("event_whenkeypressed") && s.blocks[0].fields.KEY_OPTION[0].includes("arrow")));
        // For each sprite with a event when arrow pressed block, we check if any also contain a motion turn block
        this.extensions.catrinaTurn.bool = catrinasArrowScripts.some(catrinaScripts => catrinaScripts.some(script=> script.blocks.filter(block => block.opcode.includes("motion_turn")).length > 0));


        var middleLetterPressedScripts = middleSprite.scripts.filter(s=> s.blocks[0].opcode === "event_whenkeypressed" && "abcdefghijklmnopqrstuvwxyz".includes(s.blocks[0].fields.KEY_OPTION[0]));
        this.extensions.middleSound.bool = middleLetterPressedScripts.some(s => s.blocks.some(block => block.opcode.includes("sound_play")));

        var rightAnyPressedScripts = rightSprite.scripts.filter(s=> s.blocks[0].opcode === "event_whenkeypressed" && s.blocks[0].fields.KEY_OPTION[0] === "any");
        this.extensions.rightAnyKey.bool = rightAnyPressedScripts.some(s=> s.blocks.length > 1);
        console.log([leftSprite, middleSprite, rightSprite])
    }
} 
},{"../act1-grading-scripts/originalOfrenda-test":9,"../grading-scripts-s3/scratch3":26}],8:[function(require,module,exports){

/*
On the Farm Autograde: Intial Version and testing: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.scriptForBunnyMoves = { bool: false, str: 'When Bunny is clicked it moves' };
        this.requirements.scriptForBunnySounds = { bool: false, str: 'When Bunny is clicked it makes a sound' };
        this.requirements.scriptForBunnySaysOrThinks = { bool: false, str: 'When Bunny is clicked it says or thinks something' };
        this.requirements.scriptInOrderBunny = {bool: false, str: 'When Bunny is clicked the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.scriptForHeddyMoves = { bool: false, str: 'When Heddy is clicked it moves' };
        this.requirements.scriptForHeddySounds = { bool: false, str: 'When Heddy is clicked it makes a sound' };
        this.requirements.scriptForHeddySaysOrThinks = { bool: false, str: 'When Heddy is clicked it says or thinks something' };
        this.requirements.scriptInOrderHeddy = {bool: false, str: 'When Heddy is clicked the blocks are used in the in the order specified: move, make a sound, say/think something'};
        this.requirements.bunnyOrigin = {bool: false, str: 'Set starting place for Bunny'};
        this.requirements.heddyOrigin = {bool: false, str: 'Set starting place for Heddy'};

        this.requirements.rooGlides = { bool: false, str: "Another glide block is added to Roo's script to make it move back to the starting location" };
        this.extensions.heddyMoves = {bool: false, str: "Make Heddy move to another location"}
        this.extensions.bunnyMoves = {bool: false, str: "Make Bunny move to another location"}
        this.extensions.anotherSprite = { bool: false, str: 'Another sprite is added that moves, makes a sound, then does something else when clicked' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        let sayOpcodes = ['looks_say', 'looks_sayforsecs'];
        let thinkOpcodes = ['looks_think', 'looks_sayforsecs'];
        let numGlides = 0;

        
        if (project.sprites.length > 2) {
            for (let target of project.targets) {
                if ((target.name !== 'Bunny') && (target.name!== 'Heddy') && (target.name !== 'Roo')) {
                    for (let script of target.scripts) {
                        if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            let motionSatisfied = false;
                            let soundSatisfied = false;
                            for(let block of script.blocks){
                                if(!motionSatisfied){
                                    if(block.opcode.includes('motion_')){
                                        motionSatisfied = true;
                                    }
                                    continue;
                                } else if(!soundSatisfied){
                                    if(block.opcode.includes('sound_')){
                                        soundSatisfied = true;
                                    }
                                    continue;
                                } else{
                                    this.extensions.anotherSprite.bool = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        let moveIndexBunny = 0;
        let soundIndexBunny = 0;
        let sayIndexBunny = 0;
        let moveIndexHeddy = 0;
        let soundIndexHeddy = 0;
        let sayIndexHeddy = 0;

        let extraMinBlocks = 1;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Bunny') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    moveIndexBunny = i;
                                    this.requirements.scriptForBunnyMoves.bool = true;
                                }
                                if (script.blocks[i].opcode === 'sound_playuntildone') {
                                    soundIndexBunny = i;
                                    this.requirements.scriptForBunnySounds.bool = true;
                                }
                                if (sayOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexBunny = i;
                                    this.requirements.scriptForBunnySaysOrThinks.bool = true;
                                }
                                if (thinkOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexBunny = i;
                                    this.requirements.scriptForBunnySaysOrThinks.bool = true;
                                }
                            
                                if (moveIndexBunny !== 0 &&
                                    soundIndexBunny !== 0 &&
                                    sayIndexBunny !== 0) {
                                        if (moveIndexBunny < soundIndexBunny && soundIndexBunny < sayIndexBunny) {
                                            this.requirements.scriptInOrderBunny.bool = true;
                                            break;
                                        }
                                    }
                            }
                        }
                        if(script.blocks[0].opcode === 'event_whenflagclicked') {
                            this.requirements.bunnyOrigin.bool = script.blocks.map(block => block.opcode).includes('motion_gotoxy')
                        }else if(script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            this.extensions.bunnyMoves.bool = script.blocks.filter(block => block.opcode.includes('motion_')).length > extraMinBlocks;
                        }
                    }
                }
                else if (target.name === 'Heddy') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    moveIndexHeddy = i;
                                    this.requirements.scriptForHeddyMoves.bool = true;
                                }
                                if (script.blocks[i].opcode === 'sound_playuntildone') {
                                    soundIndexHeddy = i;
                                    this.requirements.scriptForHeddySounds.bool = true;
                                }
                                if (sayOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexHeddy = i;
                                    this.requirements.scriptForHeddySaysOrThinks.bool = true;
                                }
                                if (thinkOpcodes.includes(script.blocks[i].opcode)) {
                                    sayIndexHeddy = i;
                                    this.requirements.scriptForHeddySaysOrThinks.bool = true;
                                }

                                if (moveIndexHeddy !== 0 &&
                                    soundIndexHeddy !== 0 &&
                                    sayIndexHeddy !== 0) {
                                        if (moveIndexHeddy < soundIndexHeddy && soundIndexHeddy < sayIndexHeddy) {
                                            this.requirements.scriptInOrderHeddy.bool = true;
                                            break;
                                        }
                                    }
                            }
                        }
                        if(script.blocks[0].opcode === 'event_whenflagclicked') {
                            this.requirements.heddyOrigin.bool = script.blocks.map(block => block.opcode).includes('motion_gotoxy')
                        } else if(script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                            this.extensions.heddyMoves.bool = script.blocks.filter(block => block.opcode.includes('motion_')).length > extraMinBlocks;
                        }
                    }
                }

                else if (target.name === 'Roo') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if ("event_whenthisspriteclicked" === script.blocks[0].opcode) {
                                if (script.blocks[i].opcode === 'motion_glidesecstoxy') {
                                    numGlides++;
                                }
                            }
                        }
                    }
                }
                
                // if a glide block is added to the original project
                if (numGlides >= 2) {
                    this.requirements.rooGlides.bool = true;
                }
            }
        }
    }
}

},{"../grading-scripts-s3/scratch3":26}],9:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "0fdc016498ad18ef64083324fc555e07",
                    "name": "Ofrenda",
                    "bitmapResolution": 2,
                    "md5ext": "0fdc016498ad18ef64083324fc555e07.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Catrina",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "hhI-UM#;XV/}FN!T75=O": {
                    "opcode": "event_whenflagclicked",
                    "next": "n.v*p~!1x;LzrE#aVJn=",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 16,
                    "y": 18
                },
                "n.v*p~!1x;LzrE#aVJn=": {
                    "opcode": "looks_sayforsecs",
                    "next": "_JN(d|ySH,Mh2muwwiu;",
                    "parent": "hhI-UM#;XV/}FN!T75=O",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "This is an Ofrenda. It is a traditional ritual for the Mexican Día de los Muertos celebration. "
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                6
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "_JN(d|ySH,Mh2muwwiu;": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "n.v*p~!1x;LzrE#aVJn=",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on the space bar key to learn more about Día de los Muertos."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                5
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "jyoFe@W21fl/YG4-K0HV": {
                    "opcode": "event_whenkeypressed",
                    "next": "0Tpp4fyP/cwt]Xci4%c}",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space"
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 16,
                    "y": 271
                },
                "0Tpp4fyP/cwt]Xci4%c}": {
                    "opcode": "looks_sayforsecs",
                    "next": "!Q|p9#+:C8i8N^IuIr?h",
                    "parent": "jyoFe@W21fl/YG4-K0HV",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Día de los Muertos is celebrated on November 1st and 2nd. It is a time to celebrate our ancestors and be with our families."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                7
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "!Q|p9#+:C8i8N^IuIr?h": {
                    "opcode": "looks_sayforsecs",
                    "next": "BYR*l6tNynN^zR?hlMCo",
                    "parent": "0Tpp4fyP/cwt]Xci4%c}",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Photos of loved ones who have died as well as their favorite foods are left out to welcome them home for the night.  "
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                7
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "BYR*l6tNynN^zR?hlMCo": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "!Q|p9#+:C8i8N^IuIr?h",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on one of the pictures of my family members to learn about them."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                6
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "647ed8ab0fc6dcbc70e9aa3eda75edbb",
                    "name": "Catrina",
                    "bitmapResolution": 2,
                    "md5ext": "647ed8ab0fc6dcbc70e9aa3eda75edbb.png",
                    "dataFormat": "png",
                    "rotationCenterX": 192,
                    "rotationCenterY": 228
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": -181.3,
            "y": -28.80000000000001,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Left",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "kM%BH#W(*9LZtQa]U(V.": {
                    "opcode": "event_whenflagclicked",
                    "next": "cg=pg0XvI1*3~}~TY*;%",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "cg=pg0XvI1*3~}~TY*;%": {
                    "opcode": "looks_setsizeto",
                    "next": null,
                    "parent": "kM%BH#W(*9LZtQa]U(V.",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "8+onh*iCmBn~5GY(sy;p": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "}VBgCH{K:oDh6pV0h.pi",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 275
                },
                "}VBgCH{K:oDh6pV0h.pi": {
                    "opcode": "looks_gotofrontback",
                    "next": "taz8m.4x_rVweL9%J@(3",
                    "parent": "8+onh*iCmBn~5GY(sy;p",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front"
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                },
                "taz8m.4x_rVweL9%J@(3": {
                    "opcode": "looks_changesizeby",
                    "next": "Y5!LLf.Gqemqe/6!)t=e",
                    "parent": "}VBgCH{K:oDh6pV0h.pi",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Y5!LLf.Gqemqe/6!)t=e": {
                    "opcode": "looks_sayforsecs",
                    "next": "Q.gGFO#r}[Z@fzClmRq-",
                    "parent": "taz8m.4x_rVweL9%J@(3",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I am Grandpa John."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Q.gGFO#r}[Z@fzClmRq-": {
                    "opcode": "looks_sayforsecs",
                    "next": "sPl?mFlNaaD_l]+QJ.CW",
                    "parent": "Y5!LLf.Gqemqe/6!)t=e",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I loved to cook with my granchildren."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                4
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "sPl?mFlNaaD_l]+QJ.CW": {
                    "opcode": "looks_changesizeby",
                    "next": null,
                    "parent": "Q.gGFO#r}[Z@fzClmRq-",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                -100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 3,
            "costumes": [
                {
                    "assetId": "7f24161f04680291faeb630df4dd5085",
                    "name": "person1",
                    "bitmapResolution": 2,
                    "md5ext": "7f24161f04680291faeb630df4dd5085.png",
                    "dataFormat": "png",
                    "rotationCenterX": 66,
                    "rotationCenterY": 86
                },
                {
                    "assetId": "5eb6486c7167f691023e24b52a1b88f9",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "5eb6486c7167f691023e24b52a1b88f9.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "d09a00414b05cee69c76d00585b8d66b",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "d09a00414b05cee69c76d00585b8d66b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 33,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "8900e1f586f49453f2e7501e3fe4cfdd",
                    "name": "person4",
                    "bitmapResolution": 2,
                    "md5ext": "8900e1f586f49453f2e7501e3fe4cfdd.png",
                    "dataFormat": "png",
                    "rotationCenterX": 64,
                    "rotationCenterY": 86
                },
                {
                    "assetId": "08ab2e17ccc33f08537f0c83fcc7fb94",
                    "name": "person5",
                    "bitmapResolution": 2,
                    "md5ext": "08ab2e17ccc33f08537f0c83fcc7fb94.png",
                    "dataFormat": "png",
                    "rotationCenterX": 60,
                    "rotationCenterY": 90
                },
                {
                    "assetId": "c15dd7c24b82019df099416b5bea68d6",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "c15dd7c24b82019df099416b5bea68d6.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "a815e04689a83e14ccf2422c600cfe4c",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "a815e04689a83e14ccf2422c600cfe4c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "09c1ba15733f0c6377ef36cff5e6a0e5",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "09c1ba15733f0c6377ef36cff5e6a0e5.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "b26fdbf0cbee8d0b2766f3cd2ea7a490",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "b26fdbf0cbee8d0b2766f3cd2ea7a490.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "11fba26009af8c1b36cdb07527d37f1c",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "11fba26009af8c1b36cdb07527d37f1c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 40
                },
                {
                    "assetId": "3bab46e52650e819aae5e5c57edb3b0e",
                    "name": "pet3",
                    "bitmapResolution": 1,
                    "md5ext": "3bab46e52650e819aae5e5c57edb3b0e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 19,
                    "rotationCenterY": 37
                },
                {
                    "assetId": "25daceea601ed530456bc6fa24a26c15",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "25daceea601ed530456bc6fa24a26c15.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 20,
                    "rotationCenterY": 37
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -71,
            "y": 56,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Middle",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "6vO}g1Tn]HuzZYGP8=y2": {
                    "opcode": "event_whenflagclicked",
                    "next": "4G]%`kG5j!MdWz97Y1}e",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "4G]%`kG5j!MdWz97Y1}e": {
                    "opcode": "looks_setsizeto",
                    "next": null,
                    "parent": "6vO}g1Tn]HuzZYGP8=y2",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "e?qr@5tmZQxY(E0,M{59": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "/f[ltBij)7]5Jtg|W(1%",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 18,
                    "y": 241
                },
                "/f[ltBij)7]5Jtg|W(1%": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "e?qr@5tmZQxY(E0,M{59",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front"
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "4ba11d5f6d1ed2d208d17715d130cb9e",
                    "name": "pet3",
                    "bitmapResolution": 2,
                    "md5ext": "4ba11d5f6d1ed2d208d17715d130cb9e.png",
                    "dataFormat": "png",
                    "rotationCenterX": 50,
                    "rotationCenterY": 84
                },
                {
                    "assetId": "087dd33db6c7d5eeaad4150ab881d9d1",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "087dd33db6c7d5eeaad4150ab881d9d1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 24,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "0c5b40f70385fcc1f8f53954f818f2ed",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "0c5b40f70385fcc1f8f53954f818f2ed.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "6b6d55f95a4d13f6c132b29d96e1a11e",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "6b6d55f95a4d13f6c132b29d96e1a11e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "42f79997429705f763eb27b9b05ba5bb",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "42f79997429705f763eb27b9b05ba5bb.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "44cf3ec60b8282766ae03dc5565889f2",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "44cf3ec60b8282766ae03dc5565889f2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 47
                },
                {
                    "assetId": "d3c271339a5e31d67571a6fc2f16daba",
                    "name": "person5",
                    "bitmapResolution": 1,
                    "md5ext": "d3c271339a5e31d67571a6fc2f16daba.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "e2df341a1cb5a6c47b74ba64d6f84d57",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "e2df341a1cb5a6c47b74ba64d6f84d57.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "e162f14bec31f175c2064fb245159c7c",
                    "name": "person1",
                    "bitmapResolution": 1,
                    "md5ext": "e162f14bec31f175c2064fb245159c7c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "d9bd6a50ef48f3b0ebd402c8d75f4cb1",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "d9bd6a50ef48f3b0ebd402c8d75f4cb1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 44
                },
                {
                    "assetId": "67de18ea5831da13fba2dd9a7e07827c",
                    "name": "person4",
                    "bitmapResolution": 1,
                    "md5ext": "67de18ea5831da13fba2dd9a7e07827c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 38,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "b7862ddeff16907801331ec1598b835e",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "b7862ddeff16907801331ec1598b835e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 44
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 4,
            "visible": true,
            "x": 6,
            "y": 53,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Right",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 2,
            "costumes": [
                {
                    "assetId": "49c12ffb44165bb3f3fda8d202a046b8",
                    "name": "person5",
                    "bitmapResolution": 2,
                    "md5ext": "49c12ffb44165bb3f3fda8d202a046b8.png",
                    "dataFormat": "png",
                    "rotationCenterX": 60,
                    "rotationCenterY": 90
                },
                {
                    "assetId": "f2483e067cdfd2c35b613fea24980a30",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "f2483e067cdfd2c35b613fea24980a30.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "d8a943604322f0f5f2f435d3cd940b85",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "d8a943604322f0f5f2f435d3cd940b85.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "04adcf04fb8d1026d62f5ee9c3ad7d42",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "04adcf04fb8d1026d62f5ee9c3ad7d42.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 47
                },
                {
                    "assetId": "1356d2e5866dc1daff05814408c1167c",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "1356d2e5866dc1daff05814408c1167c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "6a108c4dbd2c2265c2bb5908f9a79398",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "6a108c4dbd2c2265c2bb5908f9a79398.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 44
                },
                {
                    "assetId": "07166695718b3712d36435cef0bfa346",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "07166695718b3712d36435cef0bfa346.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 17,
                    "rotationCenterY": 40
                },
                {
                    "assetId": "71b02eaaab47f60b1bc94579213d1d18",
                    "name": "pet3",
                    "bitmapResolution": 1,
                    "md5ext": "71b02eaaab47f60b1bc94579213d1d18.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 18,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "bc2691b6a5df3c506d69a4966dfb3628",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "bc2691b6a5df3c506d69a4966dfb3628.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "721091c90a3ea19d1c8bd85f7fdf4824",
                    "name": "person1",
                    "bitmapResolution": 1,
                    "md5ext": "721091c90a3ea19d1c8bd85f7fdf4824.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "60425642ecdb9faed9feb69e178dcdd2",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "60425642ecdb9faed9feb69e178dcdd2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "07c3da9d5c02aaee8092d19642f94e3c",
                    "name": "person4",
                    "bitmapResolution": 1,
                    "md5ext": "07c3da9d5c02aaee8092d19642f94e3c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 45
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 71,
            "y": 54,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190619042313",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
    }
}
},{}],10:[function(require,module,exports){
/* 
Scavenger Hunt Autograder
Initial Version and testing: Saranya Turimella
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.fredSaysHaveFun = { bool: false, str: 'Fred the fish says "Have fun!"' };
        this.requirements.fredMoves = { bool: false, str: 'Fred the fish moves all the way across the stage' };
        this.requirements.helenChangesColorFaster = { bool: false, str: 'Helen the crab changes colors more quickly' };
        this.requirements.helenDifferentColor = { bool: false, str: 'Helen changes to a different color when clicked' };
    }


    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        if (!is(fileObj)) return;

        let haveFunFred = false;
        let haveFunMisc = false;
        let fredMoves = false;
        let miscMoves = false;
        let helenColor = false;
        let miscColor = false;
        let helenSpeed = false;
        let miscSpeed = false;
        let numMoveFred = 0;
        let distanceMoveFred = 0;
        let distanceMoveMisc = 0;

        let requiredSteps = 150;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                // looks in sprite names fred for a say block, move block
                if (target.name === 'Fred') {
                    for (let script of target.scripts) {
                        for (let block of script.allBlocks()) {
                            if ((block.opcode === 'looks_sayforsecs')) {
                                let dialogue = (block.textInput('MESSAGE')).toLowerCase();
                                let punctuationless = dialogue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString = punctuationless.replace(/\s{2,}/g, " ");
                                finalString = finalString.replace(/\s+/g, '');
                                if (finalString === 'havefun') {
                                    haveFunFred = true; 
                                }
                            }

                            if (block.opcode === 'motion_movesteps') {
                                numMoveFred++;
                                distanceMoveFred += block.floatInput('STEPS');
                            }
                        }
                    }
                    // if a move block is added, the boolean of fred moving is set to true
                    if (distanceMoveFred > requiredSteps) {
                        fredMoves = true;
                    }
                }

                // looks through helen to find the  speed that she changes costuems at, if it is less than one
                // boolean that means she changes costumes faster is set to true
                else if (target.name === 'Helen') {
                    for (let script of target.scripts) {
                        for (let block of script.allBlocks()) {
                            if (block.opcode === 'control_repeat') {
                                let subscript = block.subscripts[0];
                                for (let block of subscript.blocks) {
                                    if (block.opcode = 'control_wait') {
                                        if (block.floatInput('DURATION') < 1) {
                                            helenSpeed = true;
                                        }
                                    }
                                }
                            }
                            // when helen is clicked, she changes to a different color
                            if (script.blocks[0].opcode === "event_whenthisspriteclicked") {
                                for (let block of script.blocks) {
                                    if (['looks_nextcostume'].includes(block.opcode)) {
                                        helenColor = true;
                                    }
                                }

                            }
                        }
                    }
                }
                // deals with the cases if the sprite names are changed from fred and helen
                else {
                    for (let script of target.scripts)
                    {
                        for (let block of script.allBlocks()) {
                            if ((block.opcode === 'looks_sayforsecs')) {
                                let dialogue1 = block.textInput('MESSAGE').toLowerCase()
                                let punctuationless1 = dialogue1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString1 = punctuationless1.replace(/\s{2,}/g, " ");
                                finalString1 = finalString1.replace(/\s+/g, '');
                                // checks that have fun is said
                                if (finalString1 === 'havefun') {
                                    haveFunMisc = true;
                                }
                            }

                            // motion block is used
                            if (block.opcode === 'motion_movesteps') {
                                distanceMoveMisc += block.floatInput('STEPS');
                            }

                            // speed at which the sprite changes costumes is changed
                            if (block.opcode === 'control_repeat') {
                                let subscript = block.subscripts[0];
                                for (let block of subscript.blocks) {
                                    if (block.opcode === 'control_wait') {
                                        if (block.floatInput('DURATION') < 1) {
                                            miscSpeed = true;
                                        }
                                    }
                                }
                            }

                            // Guide instructs students to add a next costume block
                            if (block.opcode === 'looks_nextcostume') {
                                miscColor = true;
                            }
                        }

                    }
                }
                if (distanceMoveMisc > requiredSteps) {
                    miscMoves = true;
                }
            }
        }
        // for all requirements, if the specific sprite does it or ANY sprite does it, the requirement is set to true
        if (haveFunFred || haveFunMisc) {
            this.requirements.fredSaysHaveFun.bool = true;
        }

        if (fredMoves || miscMoves) {
            this.requirements.fredMoves.bool = true;
        }

        if (helenColor || miscColor) {
            this.requirements.helenDifferentColor.bool = true;
        }



        if (helenSpeed || miscSpeed) {
            this.requirements.helenChangesColorFaster.bool = true;
        }
    }
}
},{"../grading-scripts-s3/scratch3":26}],11:[function(require,module,exports){
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

},{"./scratch3":26,"./templates/animation-L1-gaming.json":27,"./templates/animation-L1-multicultural.json":28,"./templates/animation-L1-youth-culture.json":29}],12:[function(require,module,exports){
/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
*/

require('./scratch3');

const loops = ['control_forever', 'control_repeat', 'control_repeat_until'];

module.exports = class {
    // initializes the requirement objects and a list of event block codes
    // which will be used below
    init() {
        this.requirements = {
            HaveBackdrop: {bool: false, str: "Background has an image."},
            atLeastThreeSprites: {bool: false, str: "There are at least 3 sprites."},
            animatedInPlace1: {bool: false, str: "A sprite is animated in place."},
            animatedInPlace2: {bool: false, str: "A second sprite is animated in place."},
            animatedInMotion: {bool: false, str: "A different sprite is animated while moving."}
        }
        this.extensions = {
            moreAnimations: {bool: false, str: "Additional sprites are animated in place or while moving."},
            moreThanOneAnimation: {bool: false, str: "Student experiments with at least two types of animation."}
        }
        // project-wide variables
        this.animationTypes = [];
    }

    // the main grading function
    grade(json,user) {

        if (!is(json)) 
            return; 

        let project = new Project(json);
        // initializing requirements and extensions
        this.init();
        let sprites = 0
        let spritesAnimatedInPlace = 0;
        let spritesAnimatedInMotion = 0;

        // initializes sprite class for each sprite and adds scripts
        for (let target of project.targets) {
            if (target.isStage){ 
                let len = target.costumes.length
                this.requirements.HaveBackdrop.bool = len > 1 || (len && target.costumes[0] !== 'backdrop1');
            } else {
                let report = this.gradeSprite(target);
                sprites ++;
                if(report.isAnimated) {
                    if(report.isMoving) {
                        spritesAnimatedInMotion += 1;
                    } else {
                        spritesAnimatedInPlace += 1
                    }
                }
            }
        }

        this.requirements.animatedInMotion.bool = spritesAnimatedInMotion >= 1
        this.requirements.animatedInPlace1.bool = spritesAnimatedInPlace >= 1;
        this.requirements.animatedInPlace2.bool = spritesAnimatedInPlace >= 2;
        this.requirements.atLeastThreeSprites.bool = sprites >= 3;

        this.extensions.moreAnimations.bool = spritesAnimatedInMotion > 1 || spritesAnimatedInPlace > 2;

        //counts the number of animation (motion) blocks used
        this.extensions.moreThanOneAnimation.bool = (this.animationTypes.length >= 1)
    }
    // make animation more strict
    // helper function for grading an individual sprite
    gradeSprite(sprite) {

        let isAnimated = false;
        let isMoving = false;


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
                    if (block.opcode.includes("motion_")) {
                        if (!this.animationTypes.includes(block.pcode)) this.animationTypes.push(block.opcode);
                    } 
                }
            }, loops);
        }

        isAnimated = Object.values(loopTracker).some(l => l.wait && (l.costume || l.move));
        isMoving =  Object.values(loopTracker).some(l => l.move);

        return {
            name: sprite.name,
            isAnimated,
            isMoving
        };
    }
}
},{"./scratch3":26}],13:[function(require,module,exports){
/* Complex Conditionals L1(TIPP&SEE Modify) Autograder
 * Scratch 3 (original) version: Anna Zipp, Summer 2019
 */

require('./scratch3');

// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            bluePainted: {bool: false, str: 'Switches Paint Mix costume to "Blue Paint Mix" when Blue is selected.'},
            yellowPainted: {bool: false, str: 'Switches Paint Mix sprite to "Yellow Paint Mix" when Yellow is selected.'},
            purpleMixed: {bool: false, str: 'Paint Mix switches to "Purple Paint Mix" and broadcasts "purple" if Blue & Red selected.'},
            greenMixed: {bool: false, str: 'Paint Mix switches to "Green Paint Mix" and broadcasts "green" if Blue & Yellow selected.'},
        }
        this.extensions = {
            brownMixed: {bool: false, str: 'Paint Mix switches to "Brown Paint Mix" and broadcasts "brown" if Red & Blue & Yellow selected.'},
            spriteCustomized: {bool: false, str: 'The Sprite is customized with different hair and skin color.'},
            soundAdded: {bool: false, str: 'A sound effect plays when a painting is completed.'},
        }
    }

    // given an "operator_equals" block, check that one side is set to "1" and return the other side
    getColor(block) {
        let input1 = block.inputs.OPERAND1[1][1];
        let input2 = block.inputs.OPERAND2[1][1];

        if (input1 === "1") {
            return input2;
        } else if (input2 === "1") {
            return input1;
        } else {  // if neither side is set to "1", return null
            return null;
        }
    }

    // given an "If/Then" block that has an input conditon, find colors selected (color = 1)
    checkColors(block) {
        let colorReqs = {
            red: false,
            yellow: false,
            blue: false,
        };

        let ifCondition = block.conditionBlock;  // the operator block
        if (ifCondition !== null) {
            if ("operator_equals" === ifCondition.opcode) {
                let colorSelected = this.getColor(ifCondition);
                if (colorSelected === "Red") {
                    colorReqs.red = true;
                } else if (colorSelected === "Yellow") {
                    colorReqs.yellow = true;
                } else if (colorSelected === "Blue") {
                    colorReqs.blue = true;
                }
            } else if ("operator_and" === ifCondition.opcode) {
                let operand1 = ifCondition.toBlock(ifCondition.inputs.OPERAND1[1]);
                let operand2 = ifCondition.toBlock(ifCondition.inputs.OPERAND2[1]);
                let color1 = null;
                let color2 = null;
                let color3 = null;

                // check first side of "and"
                if (operand1.opcode === "operator_and") {  // if left side of "and" is also an "and" block
                    color1 = this.getColor(operand1.toBlock(operand1.inputs.OPERAND1[1]));
                    color2 = this.getColor(operand1.toBlock(operand1.inputs.OPERAND2[1]));
                    // if left side of "and" is also an "and", then right side will have the third color
                    color3 = this.getColor(operand2);
                } else {  // if left side of "and" is NOT also an "and" block
                    color1 = this.getColor(operand1);
                }

                // check second side of "and"
                if (operand2.opcode === "operator_and") {  // if right side of "and" is also an "and" block
                    color2 = this.getColor(operand2.toBlock(operand2.inputs.OPERAND1[1]));
                    color3 = this.getColor(operand2.toBlock(operand2.inputs.OPERAND2[1]));
                    // color 1 will have already been set above
                } else {  // if right side of "and" is NOT also an "and" block
                    color2 = this.getColor(operand2);
                }

                if (color1 === "Red") {
                    colorReqs.red = true;
                } else if (color1 === "Yellow") {
                    colorReqs.yellow = true;
                } else if (color1 === "Blue") {
                    colorReqs.blue = true;
                }

                if (color2 === "Red") {
                    colorReqs.red = true;
                } else if (color2 === "Yellow") {
                    colorReqs.yellow = true;
                } else if (color2 === "Blue") {
                    colorReqs.blue = true;
                }

                if (color3 === "Red") {
                    colorReqs.red = true;
                } else if (color3 === "Yellow") {
                    colorReqs.yellow = true;
                } else if (color3 === "Blue") {
                    colorReqs.blue = true;
                }
            }
        }
        return colorReqs;
    }

    // given an array of subscripts, check for existence of "switch costume to" and broadcast block
    checkSubscript(array) {
        let subScriptReqs = {
            costumeTo: "",
            broadcastStr: "",
        };

        let i = 0;

        // iterate through the blocks in each subscript in the array
        for (i; i < array.length; i++) {
            iterateBlocks(array[i], (block, level) => {
                let opcode = block.opcode;

                if (opcode === "looks_switchcostumeto") {
                    let costumeBlock = block.toBlock(block.inputs.COSTUME[1]);
                    if ((costumeBlock != null) && (costumeBlock.opcode === "looks_costume")) {
                        subScriptReqs.costumeTo = costumeBlock.fields.COSTUME[0];
                    }
                } else if (opcode === "event_broadcast") {
                    subScriptReqs.broadcastStr = block.inputs.BROADCAST_INPUT[1][1];
                }
            });
        }
        return subScriptReqs;
    }

    gradePaintMix(sprite) {
        // iterate through each of the sprite's scripts that start with the event 'When I Receive'
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenbroadcastreceived"))) {
            let eventBlock = script.blocks[0];
            if (eventBlock.fields.BROADCAST_OPTION[0] === "mix paint") {
                iterateBlocks(script, (block, level) => {
                    let opcode = block.opcode;

                    if (opcode === "control_if") {
                        let colors = this.checkColors(block);
                        let subBlocks = block.subScripts();
                        let subReqs = this.checkSubscript(subBlocks);

                        // if only one color is selected
                        if (!colors.red && !colors.yellow && colors.blue) {
                            if (subReqs.costumeTo === "Blue Paint Mix") {
                                this.requirements.bluePainted.bool = true;
                            }
                        } else if (!colors.red && colors.yellow && !colors.blue) {
                            if (subReqs.costumeTo === "Yellow Paint Mix") {
                                this.requirements.yellowPainted.bool = true;
                            }
                        }
                        // if two colors are selected
                        if (colors.red && !colors.yellow && colors.blue) {
                            if ((subReqs.costumeTo === "Purple Paint Mix") && (subReqs.broadcastStr === "purple")) {
                                this.requirements.purpleMixed.bool = true;
                            }
                        } else if (!colors.red && colors.yellow && colors.blue) {
                            if ((subReqs.costumeTo === "Green Paint Mix") && (subReqs.broadcastStr === "green")) {
                                this.requirements.greenMixed.bool = true;
                            }
                        }
                        // if all three colors are selected
                        if (colors.red && colors.yellow && colors.blue) {
                            if ((subReqs.costumeTo === "Brown Paint Mix") && (subReqs.broadcastStr === "brown")) {
                                this.extensions.brownMixed.bool = true;
                            }
                        }
                    }
                });
            }
        }
    }

    // check Artist Sprite's "When I Receive" scripts for a sound block
    checkSound(sprite) {
        let sound = false;
        // iterate through each of the sprite's scripts that start with the event 'When I Receive'
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_whenbroadcastreceived"))) {
            iterateBlocks(script, (block, level) => {
                let opcode = block.opcode;
                if (["sound_playuntildone","sound_play"].includes(opcode)) {
                    sound = true;
                }
            });
        }
        return sound;
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        for(var target of project.targets) {
            if (!(target.isStage)) {
                if (target.name.includes("Artist")) {
                    // check if sprite has been changed or customized
                    // default sprite is at index 4, "Artist 3", assetId: 7896f4313a525c551b95b745024b1b17
                    let costumeIndex = target.currentCostume;
                    let currAssetID = target.costumes[costumeIndex].assetId;
                    if (currAssetID != "7896f4313a525c551b95b745024b1b17") {
                        this.extensions.spriteCustomized.bool = true;
                    }

                    // check if sound blocks were added after a broadcast is received
                    let sound = this.checkSound(target);
                    if (sound) {
                        this.extensions.soundAdded.bool = true;
                    }
                } else if (target.name === "Paint Mix") {
                    this.gradePaintMix(target);
                }
            }
        }
    }
}

},{"./scratch3":26}],14:[function(require,module,exports){
require('./grader');
require('./scratch3');

module.exports = class GradeCondLoopsL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/conditional-loops-L1-multicultural'),
            youthCulture:  require('./templates/conditional-loops-L1-youth-culture'),
            gaming:        require('./templates/conditional-loops-L1-gaming')
        };
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        if (this.strand === 'multicultural') {
            this.requirements = [
                new Requirement('Choose a different costume for the float.', this.testCostumes(project)),
                new Requirement('Make the float stop at the Stop Sign, the turquoise blue line, or the red line.', this.testStop(project)),
                new Requirement('Make the float say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the float.', this.testSpeed(project)),
            ];
        }
        else if (this.strand === 'youthCulture') {
            this.requirements = [
                new Requirement('Choose a different costume for the car.', this.testCostumes(project)),
                new Requirement('Make the car stop at Libby, the yellow line, or the purple line.', this.testStop(project)),
                new Requirement('Make the car say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the car.', this.testSpeed(project)),
            ];
        }
        else if (this.strand === 'gaming') {
            this.requirements = [
                new Requirement('Make the cat stop at the gem or a different sprite.', this.testStop(project)),
                new Requirement('Have the cat say something after it stops.', this.testSay(project)),
                new Requirement('Change the speed of the cat.', this.testSpeed(project)),
            ];
        }
        this.extensions = [
            new Extension('Add another sprite and have it stop at another sprite or a color.', this.checkStopExtension()),
            new Extension('Add a sound when a sprite stops moving.', this.checkSoundExtension()),
            new Extension('Have a sprite go back or turn around after it stops moving.', this.testTurnAround(project))
        ];
    }

    testCostumes(project) {
        for (let sprite of project.sprites) {
            let costumeName = sprite.costumes[sprite.currentCostume].name;
            if (this.strand === 'multicultural' && costumeName === 'Butterfly Float') {
                return false;
            }
            if (this.strand === 'youthCulture' && costumeName === 'Sedan') {
                return false;
            }
        }
        return true;
    }

    testStop(project) {
        let spritesPassing = 0;
        let spritesPassingExtension = 0;
        for (let sprite of project.sprites) {
            let scriptsPassing = 0;
            let scriptsPassingExtension = 0;
            for (let script of sprite.validScripts) {
                let blocksPassing = 0;
                let blocksPassingExtension = 0;
                for (let block of script.blocks) {
                    let moves = false;
                    let movesForExtension = false;
                    let stops = false;
                    let stopsForExtension = false;
                    if (block.opcode === 'control_repeat_until') {
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps') {
                                    moves = true;
                                }
                                if (opcodeLists.changeXY.includes(subblock.opcode)) {
                                    movesForExtension = true;
                                }
                            }
                        }
                        if (block.conditionBlock) {
                            for (let menuBlock of block.conditionBlock.inputBlocks) {
                                if (menuBlock.opcode === 'sensing_touchingobjectmenu') {
                                    let touchingObject = menuBlock.fields.TOUCHINGOBJECTMENU[0];
                                    if (this.strand === 'multicultural' && (touchingObject !== 'King Momo' || sprite.name === 'Toucan')) {
                                        stops = true;
                                    }
                                    if (this.strand === 'youthCulture' && touchingObject !== 'Stop') {
                                        stops = true;
                                    }
                                    if (this.strand === 'gaming' && touchingObject !== 'Bee') {
                                        stops = true;
                                    }
                                    stopsForExtension = true;
                                }
                            }
                            if (block.conditionBlock.opcode === 'sensing_touchingcolor') {
                                stops = true;
                                stopsForExtension = true;
                            }
                        }
                    }
                    if (moves && stops) {
                        blocksPassing++;
                    }
                    if (movesForExtension && stopsForExtension) {
                        blocksPassingExtension++;
                    }
                }
                if (blocksPassing) {
                    scriptsPassing++;
                }
                if (blocksPassingExtension) {
                    scriptsPassingExtension++;
                }
            }
            if (scriptsPassing) {
                spritesPassing++;
            }
            if (scriptsPassingExtension) {
                spritesPassingExtension++;
            }
        }
        this.stopExtensionPassing = false;
        if (this.strand === 'multicultural') {
            this.stopExtensionPassing = spritesPassingExtension > 2;
            return spritesPassing > 1; /// To account for the toucan float
        }
        else {
            this.stopExtensionPassing = spritesPassingExtension > 1;
            return spritesPassing > 0;
        }
    }

    testSay(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.validScripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') {
                        hasLooped = true;
                    }
                    if ((block.opcode.includes('looks_say') || block.opcode.includes('looks_think')) && hasLooped) {
                        return true;
                    }
                    if (block.opcode.includes('sound_play') && hasLooped) {
                        this.soundExtensionPassing = true;
                    }
                }
            }
        }
        return false;
    }

    testSpeed(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.validScripts) {
                for (let block of script.blocks) {
                    let steps = 0;
                    let duration = 0;
                    if (block.opcode === 'control_repeat_until') {
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps') {
                                    steps += subblock.inputs.STEPS[1][1];
                                }
                                if (subblock.opcode === 'control_wait') {
                                    duration += subblock.inputs.DURATION[1][1];
                                }
                            }
                        }
                    }
                    if (this.strand === 'multicultural') {
                        if (sprite.name === 'Toucan' && steps && (steps !== 1 || duration !== 1)) {
                            return true;
                        }
                        else if (steps && (steps !== 2 || duration !== 1)) {
                            return true;
                        }
                    }
                    if (this.strand === 'youthCulture' && steps && (steps !== 10 || duration !== 0.1)) {
                        return true;
                    }
                    if (this.strand === 'gaming' && steps && (steps !== 5 || duration !== 1)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkStopExtension() {
        if (this.stopExtensionPassing) {
            return true;
        }
        return false;
    }

    checkSoundExtension() {
        if (this.soundExtensionPassing) {
            return true;
        }
        return false;
    }

    testTurnAround(project) {
        for (let sprite of project.sprites) {
            for (let script of sprite.scripts) {
                let hasLooped = false;
                for (let block of script.blocks) {
                    if (block.opcode === 'control_repeat_until') {
                        hasLooped = true;
                    }
                    if (hasLooped) {
                        if (block.opcode === 'motion_movesteps' && block.floatInput('STEPS') < 0) {
                            return true;
                        }
                        if (block.opcode.includes('motion_goto') || block.opcode.includes('motion_turn')) {
                            return true;
                        }
                        if (block.opcode === 'motion_pointindirection') {
                            return true;
                        }
                        for (let subscript of block.subscriptsRecursive) {
                            for (let subblock of subscript.blocks) {
                                if (subblock.opcode === 'motion_movesteps' && subblock.floatInput('STEPS') < 0) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}

},{"./grader":21,"./scratch3":26,"./templates/conditional-loops-L1-gaming":30,"./templates/conditional-loops-L1-multicultural":31,"./templates/conditional-loops-L1-youth-culture":32}],15:[function(require,module,exports){
/* Conditional Loops L2 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
Scratch 3 updates: Saranya Turimella, Summer 2019
Static analysis code (info object) added for Block Usage CSVs and Graphs: Anna Zipp, Autumn 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.stop = { bool: false, str: 'Sprite stops when touching another sprite or another color' }; // done
        this.requirements.speak = { bool: false, str: 'Sprite says something or makes a sound when it stops' }; // done
        this.requirements.moves = { bool: false, str: 'Sprite moves across the stage in a looping fashion' }; // done
        this.extensions.touchingNewSprite = { bool: false, str: 'The sprite stops when it touches a new sprite added from the sprite library' };
        this.extensions.repeatBlock = { bool: false, str: 'Repeat blocks added to animate another sprite' }; // done

/*
//        this.extensions.addCostume = { bool: false, str: 'Another costume is added to the current mode of transportation' }; // done
//       this.extensions.nextCostume = { bool: false, str: 'The sprite is animated with a "next costume" block' }; // done
*/

    
        this.info = {
            blocks: 0,
            sprites: 0,
            spritesWith1Script: 0,
            spritesWith2Scripts: 0,
            guidingUser: false,
            blockTypes: new Set([]),
            strings: [],
            score: 0 //requirement score
        }
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        let numRepeat = 0;
         
        let allCostumes = 0;
        let sprites = [];
        let objectTouching = null;
        let touching = null;
        let moveOptions = ['motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
        let soundOptions = ['sound_playuntildone', 'sound_play', 'looks_say', 'looks_sayforsecs']
        
        // static analysis variables
        var validScripts = 0;
        var events = [];

        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
            else {
                sprites.push(target.name);
                for (let script of target.scripts) {
                    // a script that starts with an event block
                    if (script.blocks[0].opcode.includes('event_')) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            // checking to see if a repeat block is used
                            
                            if (script.blocks[i].opcode.includes('control_repeat')) {
                                //console.log(target.name)
                                numRepeat++;

                                //checks to see if a sound is is made once the loop is over
                                let nextBlock = script.blocks[i].next;
                               
                                let condition = (script.blocks[i]).conditionBlock;
                                if (condition != undefined) {
                                        if (condition.opcode === 'sensing_touchingobject') {
                                            touching = condition.inputs.TOUCHINGOBJECTMENU[1];
                                            objectTouching = target.blocks[touching].fields.TOUCHINGOBJECTMENU[0];
                        // Diana added this, which disables another check.
                                            this.requirements.stop.bool = true;
                                
                                        }
                                        // checks that it stops when touching a color
                                        else if ((condition.opcode === 'sensing_touchingcolor') ||
                                            (condition.opcode === 'sensing_coloristouchingcolor')) {
                                            this.requirements.stop.bool = true;
                                        }   
                                }
                                
                                // if the next block is a sound block, set the requirement
                                if (nextBlock != null && soundOptions.includes(target.blocks[nextBlock].opcode)) {
                                    this.requirements.speak.bool = true;
                                }

                                let substack = script.blocks[i].inputs.SUBSTACK[1];
                                
                                if (substack) {
                                // there is only one block in the loop and that is a move block
                                    if (moveOptions.includes(target.blocks[substack].opcode)) {
                                    
                                        this.requirements.moves.bool = true;
                                    } else {
                                        // there are multiple blocks in the loop, iterate through them to see 
                                        while (target.blocks[substack].next !== null) {
                                        
                                            
                                            if (moveOptions.includes(target.blocks[substack].opcode)) {
                                                
                                                this.requirements.moves.bool = true;
                                            }
/*
                                            if ((target.blocks[substack].opcode === 'looks_switchcostumeto') || (target.blocks[substack].opcode === 'looks_nextcostume')) {
                                                this.extensions.nextCostume.bool = true;
                                            }
*/
                                            substack = target.blocks[substack].next;
                                        }
                                    }
                                }


                            }
                     
                        }
                    }
                }
                allCostumes += target.costumes.length;

                // Static analysis code
                this.info.sprites++; 
                //iterating through each of the sprite's scripts that start with an event block
                for (var script of target.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) { 
                    // search through each block and execute the given callback function
                    // that determines what to look for and what to do (through side effects) for each block
                    script.traverseBlocks((block, level) => {
                        var opcode = block.opcode;

                        if (opcode in this.info.blockTypes) {
                            // do nothing
                        } else {
                            this.info.blockTypes.add(opcode);
                            this.info.blocks++;
                        }

                        if (opcode.includes('say')) {
                            let string = block.inputs.MESSAGE[1][1].toLowerCase();
                            this.info.strings.push(string);
                            if (!this.info.guidingUser) {
                                for (let keyword of ['press', 'click']) {
                                    if (string.includes(keyword)) {
                                        this.info.guidingUser = true;
                                        break;
                                    }
                                }
                            }
                        }
                        
                    });

                    var event = script.blocks[0];
                    // adds to list of unique events and scripts
                    if (!events.includes(event.opcode)) {
                        events.push(event.opcode);
                        if (script.blocks.length > 1) {
                            validScripts++;
                        }
                    }
                    if (validScripts >=2) {
                        this.info.spritesWith2Scripts++;
                    } else if (validScripts >= 1) {
                        this.info.spritesWith1Script++;
                    }
                }

            }
        }

        if(sprites.includes(objectTouching)) {
            this.requirements.stop.bool = true;
        }
       
/*
        if (allCostumes > 12) {
            this.extensions.addCostume.bool = true;
        }       
*/
        
        if (numRepeat > 1) {
            this.extensions.repeatBlock.bool = true;
        }
        
        if (project.sprites.length > 2) {
            if ((objectTouching !== 'Sign') || (objectTouching !== 'Stop')) {
                this.extensions.touchingNewSprite.bool = true;
            }
        }

        // Static analysis code
        delete this.info.strings;
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool? 1 : 0), 0);
    }
}

},{"../grading-scripts-s3/scratch3":26}],16:[function(require,module,exports){
(function (global){(function (){
/// Info layer template
global.Context = class {

    constructor(x, keepValues) {
        if (x && x.hasOwnProperty('requirements') && x.hasOwnProperty('extensions')) {
            for (var requirement in x.requirements) this[requirement] = keepValues ? x.requirements[requirement] : 0;
            for (var extension   in x.extensions  ) this[extension  ] = keepValues ? x.extensions  [extension  ] : 0;
        }
        else {
            for (var item in x) this[item] = keepValues ? x[item] : 0;
        }
        this.sublayers = [];
    }

    pull(keys, thresh, sum) {
        for (var key of keys) {
            if (!sum) {
                this[key] = this.sublayers.some(x => x[key] >= thresh);
            }
            else {
                this[key] = this.sublayers.reduce((acc = 0, x) => acc += x[key], 0) >= thresh;
            }
        }
    }

    makeGrade(grader) {
        for (var key in this) {
            if (grader.requirements[key] !== undefined) grader.requirements[key].bool = !!this[key];
            if (grader.extensions  [key] !== undefined) grader.extensions  [key].bool = !!this[key];
        }
    }
}
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
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
        let inputCond = block.conditionBlock;  // the input condition block
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

        let pointDir;

        // iterate through each of the sprite's scripts that start with 'When Green Flag Clicked'
        for (let script of sprite.scripts.filter(s => s.blocks[0].opcode === "event_whenflagclicked")) {
            script.traverseBlocks((block, level) => {

                if (block.opcode === "motion_pointindirection") {
                    if (block.inputs.DIRECTION[1][1] === "90") pointDir = "right";
                    if (block.inputs.DIRECTION[1][1] === "-90") pointDir = "left";
                }

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
                    if (stepNumber < 0 || pointDir == "left") {
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
    sortSprites(reports, project) {
        let defaultObj = {
            name: null,
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
        let sprites = {
            A: defaultObj,
            B: defaultObj,
            C: defaultObj,
            Extra: defaultObj,
        }

        // Identify Sprite B first
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

        // after Sprite B, find Sprite A
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

        // Once B and A have been found, C is easily identifiable
        for (let possibleC of reports) {
            if ((possibleC.name !== sprites.B.name) && (possibleC.name !== sprites.A.name)) {
                if (sprites.B.movesTo.includes(possibleC.name)) {
                    sprites.C = possibleC;
                }
            }
        }

        // find Extra sprite, if any. (Checks requirements for Multicultural and Gaming strand. In Youth Culture strand, any new sprite will be accepted)
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

        let sortedSprites = this.sortSprites(spriteReports, project);
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

},{"./scratch3":26,"./templates/decomp-L1-gaming.json":33,"./templates/decomp-L1-multicultural.json":34,"./templates/decomp-L1-youthculture.json":35}],18:[function(require,module,exports){
/* Decomposition by Sequence L2 Autograder
 * Scratch 2 (original) version: Max White, Summer 2018
 * Scratch 3 updates: Elizabeth Crowdus, Spring 2019
 * Reformatting, bug fixes, and updates: Anna Zipp, Summer 2019
*/

require('./scratch3');

// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

module.exports = class {
    // initialize the requirement and extension objects to be graded
    init() {
        this.requirements = {
            addBackdrop: {bool: false, str: 'Added a new backdrop.'},
            addThreeSprites: {bool: false, str: 'Added at least three sprites.'},
            twoSpritesGoTo: {bool: false, str: 'Two sprites use the "goto x:_ y:_" block.'},
            sequentialAction: {bool: false, str: 'Two sprites have sequential action in a loop that animates them.'},
            touchingBlock: {bool: false, str: 'Has Two sprites (A and B) where A uses "wait (or repeat) until touching B" and B uses "repeat (or wait) until touching A".'},
            //TODO: the L2 Student sheet does not specify the "wait/repeat until touching" requirement very well
        }
        this.extensions = {
            thirdSprite: {bool: false, str: 'The third sprite has a new event with different actions.'},
            soundBlock: {bool: false, str: 'The project uses a sound block.'},
        }
    }

    // given a block that has an input conditon, check if it is a Touching condition
    // and return the opcode of what its touching target conditon is
    getCondOpcode(block) {
        let targetCond = null;
        let inputCond = block.conditionBlock;  // the input condition block
        if ((inputCond !== null) && ("sensing_touchingobject" === inputCond.opcode)) {
            // find the specific field entered into the input condition block
            let condSelected = inputCond.toBlock(inputCond.inputs.TOUCHINGOBJECTMENU[1]);
            if ((condSelected !== null) && (condSelected.opcode === "sensing_touchingobjectmenu")) {
                targetCond = condSelected.fields.TOUCHINGOBJECTMENU[0];
            }
        }
        return targetCond;
    }

    // given a loop block, look for a move, wait, and costume block for sequential action/animation
    findSequentialAction(block) {
        let foundMove = false;
        let foundWait = false;
        let foundCostume = false;

        let subBlocks = block.subScripts();

        for (var subScript of subBlocks) {
            iterateBlocks(subScript, (block, level) => {
                let subop = block.opcode;

                if (subop === 'motion_movesteps') {
                    foundMove = true;
                }
                if (subop === 'control_wait') {
                    foundWait = true;
                }
                if (['looks_nextcostume', 'looks_switchcostumeto'].includes(subop)) {
                    foundCostume = true;
                }
            });
        }
        return (foundMove && foundCostume && foundWait);
    }

    gradeSprite(sprite) {
        var knownBlocks = [
            'event_whenflagclicked',
            'motion_gotoxy',
            'motion_movesteps',
            'looks_costume',
            'looks_switchcostumeto',
            'control_wait',
            'control_wait_until',
            'control_repeat',
            'control_repeat_until',
            'sound_play',
            'sound_playuntildone',
            "motion_pointtowards",
            "motion_pointtowards_menu",
        ];

        var goTo = false;
        var waitingUntil = [];
        var repeatingUntil = [];
        var seqAction = false;
        var diffActions = false;

        // iterate through the sprite's scripts that start with an event block
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {

            var eventBlock = script.blocks[0];
            if (eventBlock.next !== null) {
                iterateBlocks(script, (block, level) => {
                    var opcode = block.opcode;
                    var currLevel = level;

                    // if sprite uses goto block
                    goTo = goTo || opcode.includes("motion_gotoxy");

                    // if sprite uses wait until touching or repeat until touching blocks
                    // create an array of the targets it uses in these blocks
                    if (opcode.includes("control_wait_until")) {
                        let targetSprite = this.getCondOpcode(block);
                        if (targetSprite != null) {
                            waitingUntil.push(targetSprite);
                        }
                    } else if (opcode.includes("control_repeat_until")) {
                        let targetSprite = this.getCondOpcode(block);
                        if (targetSprite != null) {
                            repeatingUntil.push(targetSprite);
                        }
                    }

                    // if sprite uses new action blocks
                    if (!(knownBlocks.includes(opcode)) && (opcode.includes("motion_") || opcode.includes("looks_"))) {
                        diffActions = true;
                    }

                    // if sprite uses a sound block
                    if (["sound_play", "sound_playuntildone"].includes(opcode)) {
                        this.extensions.soundBlock.bool = true;
                    }

                    // search a loop for sequential action blocks (wait, move, costume)
                    if (opcode.includes("control_repeat")) {
                        seqAction = seqAction || this.findSequentialAction(block);
                    }
                });
            }
        }

        return {
            name: sprite.name,
            usesGoTo: goTo,
            hasSeqAction: seqAction,
            hasDiffActions: diffActions,
            isWaitingUntil: waitingUntil,
            isRepeatingUntil: repeatingUntil,
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        var totalSprites = 0;
        var newSprites = 0;
        var numSpritesGoTo = 0;
        var numSpritesSeqAction = 0;
        var numSpritesDiffAction = 0;
        var numSpritesTouching = 0;
        let waitUntilTargets = {};
        let repeatUntilTargets = {};

        for(var target of project.targets) {
            if (target.isStage) {
                // checks if student changed from default blank backdrop
                // TODO: does not check if the student painted over the white backdrop
                if (target.costumes[0].name !== 'backdrop1' || target.costumes.length > 1) {
                    this.requirements.addBackdrop.bool = true;
                }
                continue;
            } else {    // if not a stage, then it's a sprite
                totalSprites++;

                // if they change from using the default cat sprite
                if (target.name !== 'Sprite1' || target.costumes.length > 2) {
                    newSprites++;
                }

                var currSprite = this.gradeSprite(target);

                if (currSprite.usesGoTo) numSpritesGoTo++;
                if (currSprite.hasSeqAction) numSpritesSeqAction++;
                if (currSprite.hasDiffActions) numSpritesDiffAction++;
                if ((currSprite.isWaitingUntil.length >= 1) || (currSprite.isRepeatingUntil.length >= 1)) {  // if target arrays are nonempty
                    numSpritesTouching++;
                    // add sprite's target arrays to a repeat or wait object
                    if (currSprite.isWaitingUntil.length >= 1) {
                        waitUntilTargets[currSprite.name] = currSprite.isWaitingUntil;
                        console.log(currSprite.name + " is waiting until touching: [" + waitUntilTargets[currSprite.name] + "]");
                    }
                    if (currSprite.isRepeatingUntil.length >= 1) {
                        repeatUntilTargets[currSprite.name] = currSprite.isRepeatingUntil;
                        console.log(currSprite.name + " is repeating until touching: [" + repeatUntilTargets[currSprite.name] + "]");
                    }
                }
            }
        }

        if (newSprites >= 3) this.requirements.addThreeSprites.bool = true;
        if (numSpritesGoTo >= 2) this.requirements.twoSpritesGoTo.bool = true;
        if (numSpritesSeqAction >= 2) this.requirements.sequentialAction.bool = true;

        // if at least 2 sprites use conditional blocks
        if (numSpritesTouching >= 2) {
            // if at least one sprite uses "wait until" and at least one sprite uses "repeat until"
            if ((Object.keys(waitUntilTargets).length >= 1) && (Object.keys(repeatUntilTargets).length >= 1)) {
                // check to see if Sprites A and B have wait/repeat until blocks that target each other
                for (let currKey in waitUntilTargets) {
                    for (var i = 0; i < waitUntilTargets[currKey].length; i++) {
                        let currTarget = waitUntilTargets[currKey][i];

                        if (currTarget in repeatUntilTargets) {
                            for (var j = 0; j < repeatUntilTargets[currTarget].length; j++) {
                                if (repeatUntilTargets[currTarget][j] === currKey) {
                                    this.requirements.touchingBlock.bool = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if ((numSpritesDiffAction >= 3) || ((totalSprites >= 3) && (numSpritesDiffAction >= 1))) {
            this.extensions.thirdSprite.bool = true;
            // TODO: test for edge cases, probs doesnt cover everything
            // if sprites w events >=3 and sprites w diff actions >=1
        }
    }
}

},{"./scratch3":26}],19:[function(require,module,exports){
require('./scratch3');

module.exports = class GradeEventsL1 {

    /// Identify all subscripts of a block, recursively.
    subscriptsRecursive(block, array = []) {
        if (block.subscripts.length) {
            for (var subscript of block.subscripts) {
                array.push(subscript);
                if (subscript.blocks.length) {
                    for (var block_ of subscript.blocks) {
                        this.subscriptsRecursive(block_, array);
                    }
                }
            }
        }
        return array;
    }

    /// Counts the number of sprites that get larger, speak, and reset size when clicked.
    clickPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenthisspriteclicked' && script.blocks.length > 1
            )) {
                var spriteSize = parseFloat(sprite.size);
                var initialSpriteSize = spriteSize;
                var gotBigger = false;
                var spoke = false;
                var reset = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) gotBigger = true;
                        spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > initialSpriteSize) gotBigger = true;
                        spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    else if (block.opcode.includes('looks_say') && spriteSize > initialSpriteSize) spoke = true;
                }
                if (gotBigger && Math.abs(spriteSize - initialSpriteSize) < 0.05) reset = true;
                if (gotBigger && spoke && reset) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with a correctly modeled green flag script.
    greenFlagPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenflagclicked' && script.blocks.length > 1
            )) {
                var containsGoTo = false;
                var containsSetSize = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'motion_gotoxy' || this.strand === 'multicultural')  containsGoTo = true;
                    if (block.opcode === 'looks_setsizeto') containsSetSize = true;
                }
                if (containsGoTo && containsSetSize) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with a correct right or left arrow script.
    keyPassing(project, directionString) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode === 'event_whenkeypressed' && script.blocks.length > 1
            )) {
                var containsMove = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'motion_movesteps') {
                        var key = script.blocks[0].fields.KEY_OPTION[0];
                        var steps = block.inputs.STEPS[1][1];
                        if (directionString === 'left' && key === 'left arrow' && steps < 0) containsMove = true;
                        else if (directionString === 'right' && key === 'right arrow' && steps > 0) containsMove = true;
                    }
                    if (directionString === 'any' && block.opcode.includes('motion_')) containsMove = true;
                }
                if (containsMove) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites that spin around using turn and wait blocks in a loop.
    spinPassing(project) {
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            var scriptsPassing = 0;
            for (var script of sprite.scripts.filter (
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1
            )) {
                var containsSpin = false;
                for (var block of script.blocks) {
                    if (['control_repeat', 'control_repeat_until', 'control_forever'].includes(block.opcode)) {
                        var subscripts = [];
                        subscripts = this.subscriptsRecursive(block, subscripts);
                        var containsTurn = false;
                        var containsWait = false;
                        for (var subscript of subscripts) {
                            for (var block of subscript.blocks) {
                                if (block.opcode.includes('motion_turn')) containsTurn = true;
                                else if (block.opcode === 'control_wait') containsWait = true;
                            }
                        }
                        if (containsTurn && containsWait) containsSpin = true;
                    }
                }
                if (containsSpin) scriptsPassing++;
            }
            if (scriptsPassing > 0) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Counts the number of sprites with changed names.
    namePassing(project) {
        var defaultNames = [];
        if (this.strand === 'multicultural') defaultNames = ['Catrina', 'Left', 'Middle', 'Right'];
        else if (this.strand === 'youthCulture') defaultNames = ['Jamal', 'Monster', 'Cat'];
        else if (this.strand === 'gaming') defaultNames = ['Beep', 'Bop', 'Planet X', 'Bork'];
        var spritesPassing = 0;
        for (var sprite of project.sprites) {
            if (!defaultNames.includes(sprite.name)) spritesPassing++;
        }
        return spritesPassing;
    }

    /// Evaluate the completion of the requirements and extensions for a given JSON representation of a project.
    grade(json, user) {
        if (no(json)) {
            this.requirements = {
                noFile: {
                    bool: false,
                    str: 'File not valid.'
                }
            }
            return;
        };
        var project = new Project(json, this);
        this.requirements = {};
        this.extensions = {};
        var templates = {
            multicultural: require('./templates/events-L1-multicultural'),
            youthCulture:  require('./templates/events-L1-youth-culture'),
            gaming:        require('./templates/events-L1-gaming')
        };
        this.strand = detectStrand(project, templates);
        this.requirements.click1 = {
            bool: this.clickPassing(project) >= 1,
            str: 'One sprite gets larger, speaks, and goes back to its original size when clicked.'
        };
        this.requirements.click2 = {
            bool: this.clickPassing(project) >= 2,
            str: 'Two sprites get larger, speak, and go back to their original sizes when clicked.'
        };
        this.requirements.click3 = {
            bool: this.clickPassing(project) >= 3,
            str: 'Three sprites get larger, speak, and go back to their original sizes when clicked.'
        };
        this.requirements.greenFlag = {
            bool: this.greenFlagPassing(project) >= 3,
            str: 'These three sprites all reset their sizes when the green flag is clicked.'
        };
        this.extensions.spin = {
            bool: this.spinPassing(project) >= 1,
            str: 'At least one sprite spins around using turn and wait blocks in a loop.'
        };
        if (this.strand === 'multicultural') {
            this.extensions.name = {
                bool: this.namePassing(project) >= 1,
                str: 'At least one sprite\'s name has been customized.'
            };
        }
        else if (this.strand === 'youthCulture') {
            this.extensions.key = {
                bool: this.keyPassing(project, 'left') >= 1,
                str: 'The cat moves to the left when the left arrow key is pressed.'
            };
        }
        else if (this.strand === 'gaming') {
            this.requirements.key = {
                bool: this.keyPassing(project, 'right') >= 1,
                str: 'Bop moves to the right when the right arrow key is pressed.'
            };
            this.extensions.key = {
                bool: this.keyPassing(project, 'left') >= 1,
                str: 'Bork moves to the left when the left arrow key is pressed.'
            }
        }
        return;
    }
}

},{"./scratch3":26,"./templates/events-L1-gaming":36,"./templates/events-L1-multicultural":37,"./templates/events-L1-youth-culture":38}],20:[function(require,module,exports){
/* Events L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and bug fixes: Marco Anaya, Summer 2019
*/
require('./scratch3');

const holidays = {
    christmas: ['christmas', 'chrismas', 'xmas', 'santa', 'x-mas', 'december 2'],
    halloween: ['halloween', 'scary', 'trick or treat', 'hollween', 'costumeb'],
    birthday: ['birthday', 'b-day', 'brithday', 'birth day'],
    july: ['july'],
    thanksgiving: ['thanksgiving'],
    ['chinese new years']: ['chinese new'],
    ['new years']: ['new year'],
    valentines: ['valentine'],
    easter: ['easter'],
    ['national _ day']: ['national'],
    other: ['day']
}
const family = ['mom', 'dad', 'father', 'mother', 'sister', 'brother', 'uncle', 'aunt','grandpa', 'grandma', 'cousin', 'famil', 'sibling', 'child'];

module.exports = class {
    init() {
        this.requirements = {
            choseBackdrop: {bool: false, str: "The backdrop of the project was changed"},
            hasThreeSprites: {bool: false, str: "There are at least three sprites"},
            spriteHasTwoEvents1: {bool: false, str: "A sprite has two required events"},
            spriteHasTwoEvents2: {bool: false, str: "A second sprite has two required events"},
            spriteHasTwoEvents3: {bool: false, str: "A third sprite has two required events"},
            spriteHasTwoScripts1: {bool: false, str: "A sprite has two scripts with unique events"},
            spriteHasTwoScripts2: {bool: false, str: "A second sprite has two scripts with unique events"},
            spriteHasTwoScripts3: {bool: false, str: "A third sprite has two scripts with unique events"},
            usesTheThreeEvents: {bool: false, str: "Uses all event blocks from lesson plan"}
        };
        this.extensions = {
            spriteSpins: {bool: false, str: "A sprite spins (uses turn block)"},
            moreScripts: {bool: false, str: "A sprite reacts to more events."},
            spriteBlinks: {bool: false, str: "A sprite blinks (use hide, show, and wait blocks)."}
        };

        this.info = {
            blocks: 0,
            sprites: 0,
            spritesWith1Script: 0,
            spritesWith2Scripts: 0,
            spritesWith2Events: 0,
            holiday: null,
            guidingUser: false,
            family: false,
            blockTypes: new Set([]),
            strings: [],
            score: 0
        }
    }
    
    gradeSprite(sprite) {
        var reqEvents = [];
        var events = [];
        let keysPressed = [];
        var validScripts = 0;    

        this.info.sprites++;
        for (var script of sprite.scripts.filter(s => is(s.blocks[0].opcode) && s.blocks[0].opcode.includes('event_when'))){
            
            //look for extension requirements throughout each block
            var blink = {hide: false, wait: false, show: false};
            var spin = {wait: false, turn: false};
            script.traverseBlocks((block, level) => {
                var opcode = block.opcode;
                if (opcode in this.info.blockTypes) {
                    
                } else {
                    this.info.blockTypes.add(opcode);
                    this.info.blocks++;
                }
                if (opcode.includes('say')) {
                    let string = block.inputs.MESSAGE[1][1].toLowerCase();


                    this.info.strings.push(string);

                    if (!this.info.holiday || this.info.holiday == 'other') {
                        for (let [holiday, keywords] of Object.entries(holidays)) {
                            
                            if (keywords.some(k => string.includes(k))) {
                                this.info.holiday = holiday;
                                if (holiday != 'other')
                                    break;
                            }
                        }
                    }
                    if (!this.info.guidingUser) {
                        for (let keyword of ['press', 'click']) {
                            if (string.includes(keyword)) {
                                this.info.guidingUser = true;
                                break;
                            }
                        }
                    }
                    if (!this.info.family) {
                        for (let keyword of family) {
                            if (string.includes(keyword)) {
                                this.info.family = true;
                                break
                            }
                        }
                    }
                }
                spin.turn = spin.turn || opcode.includes("motion_turn");
                blink.hide = blink.hide || (opcode == 'looks_hide');
                blink.show = blink.show || (opcode == 'looks_show');
                if (opcode == 'control_wait') {
                    spin.wait = true;
                    blink.wait = true;
                }
            });
            // check if all all conditions in a script have been met for spinning or blinking
            if (Object.values(spin).reduce((acc, val) => acc && val, true)) this.extensions.spriteSpins.bool = true;
            if (Object.values(blink).reduce((acc, val) => acc && val, true)) this.extensions.spriteBlinks.bool = true;

            var event = script.blocks[0];
            //records the use of required events
            if (['event_whenflagclicked', 'event_whenthisspriteclicked', 'event_whenkeypressed'].includes(event.opcode) && !reqEvents.includes(event.opcode))
                reqEvents.push(event.opcode);
            // differentiates event key presses that use different keys
            if (event.opcode === "event_whenkeypressed" && !keysPressed.includes(event.fields.KEY_OPTION[0]) && script.blocks.length > 1) {
                keysPressed.push(event.fields.KEY_OPTION[0]);
                console.log(keysPressed)
            }
            // adds to list of unique events and scripts
            if (!events.includes(event.opcode)) {
                events.push(event.opcode);
                if (script.blocks.length > 1) {
                    validScripts++;
                }
            }
            // checks if scripts outside of the required were used (only the first key pressed event is counted as required)
            if (!(['event_whenflagclicked', 'event_whenthisspriteclicked'].includes(event.opcode) || event.opcode.includes('event_whenkeypressed')) || (keysPressed.length > 1)) {
                this.extensions.moreScripts.bool = true;
            }
        }

        // check off how many sprites have met the requirements
        /*
        if (reqEvents.length >= 2 || validScripts >= 2) {
            for (var n of [1, 2, 3]) {
                if (this.requirements['spriteHasTwoEvents' + n].bool && this.requirements['spriteHasTwoScripts' + n].bool) 
                    continue;
                if (n !== 3) {
                    this.requirements['spriteHasTwoEvents' + (n + 1)].bool = this.requirements['spriteHasTwoEvents' + n].bool;
                    this.requirements['spriteHasTwoScripts' + (n + 1)].bool = this.requirements['spriteHasTwoScripts' + n].bool;
                }
                this.requirements['spriteHasTwoEvents' + n].bool = (reqEvents.length >= 2);
                this.requirements['spriteHasTwoScripts' + n].bool = (validScripts >= 2);
                break;
            }
        }
        */
        if (validScripts >=2) this.info.spritesWith2Scripts++
        else if (validScripts >= 1) this.info.spritesWith1Script++;
        if (reqEvents.length >= 2) this.info.spritesWith2Events++;
        return reqEvents;
    }

    grade(fileObj,user) {
        if (no(fileObj)) return; //make sure script exists
        this.init();        
        var project = new Project(fileObj);
        var reqEvents = [];
        for(var target of project.targets){
            if(target.isStage ){
                if (target.costumes.length > 1 || target.costumes[0].name !== 'backdrop1') 
                    this.requirements.choseBackdrop.bool = true;
                continue;
            }

            // calls the sprite grader while aggregating the total required events used
            reqEvents = [...new Set([...reqEvents, ...this.gradeSprite(target)])];
        }
        
        this.requirements.hasThreeSprites.bool = (project.targets.length >= 3);
        this.requirements.spriteHasTwoEvents1.bool = this.info.spritesWith2Events >= 1;
        this.requirements.spriteHasTwoEvents2.bool = this.info.spritesWith2Events >= 2;
        this.requirements.spriteHasTwoEvents3.bool = this.info.spritesWith2Events >= 3;
        this.requirements.spriteHasTwoScripts1.bool = this.info.spritesWith2Scripts >= 1;
        this.requirements.spriteHasTwoScripts2.bool = this.info.spritesWith2Scripts >= 2;
        this.requirements.spriteHasTwoScripts3.bool = this.info.spritesWith2Scripts >= 3;
        this.requirements.usesTheThreeEvents.bool = (reqEvents.length >= 3);
        
        delete this.info.strings;
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool? 1 : 0), 0);
        
    }
} 
},{"./scratch3":26}],21:[function(require,module,exports){
(function (global){(function (){
require('./scratch3');

global.allOf = function(tests) {
    var result = true;
    for (var test of tests) {
        if (!test) {
            result = false;
        }
    }
    return result;
}

global.anyOf = function(tests) {
    var result = false;
    for (var test of tests) {
        if (test) {
            result = true;
        }
    }
    return result;
}

global.detectStrand = function(project, templates, defaultStrand = 'generic') {
   var strand = defaultStrand;
    var projectAssetIDs = [];
    for (var target of project.targets) {
        for (var costume of target.costumes) {
            projectAssetIDs.push(costume.assetId);
        }
        for (var sound of target.sounds) {
            projectAssetIDs.push(sound.assetId);
        }
    }
    var highScore = 0;
    for (var template in templates) {
        var templateFile = templates[template];
        var templateAssetIDs = [];
        for (var target of templateFile.targets) {
            for (var costume of target.costumes) {
                templateAssetIDs.push(costume.assetId);
            }
            for (var sound of target.sounds) {
                templateAssetIDs.push(sound.assetId);
            }
        }
        var templateScore = 0;
        for (var projectAssetID of projectAssetIDs) {
            if (templateAssetIDs.includes(projectAssetID)) {
                templateScore++;
            }
            if (templateScore > highScore) {
                strand = template;
                highScore = templateScore;
            }
        }
    }
    return strand;
}

global.Requirement = class {

    constructor(description, evaluator) {
        this.str = description;
        this.bool = evaluator;
    }
}

global.Extension = class extends Requirement {

    constructor(description, evaluator) {
        super(description, evaluator);
    }
}

global.Grader = class {

    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.strand = 'generic';
    }

    init(project) {
        return;
    }

    grade(json) {
        var project = new Project(json, {});
        this.requirements = [];
        this.extensions = [];
        this.init(project);
    }
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./scratch3":26}],22:[function(require,module,exports){
/* One Way Sync L1 Autograder
 * Marco Anaya, Summer 2019
 */
 require('./scratch3');

 module.exports = class {

	init(project) { //initialize all metrics to false


		let strandTemplates = {
			multicultural: require('./templates/one-way-sync-L1-multicultural'),
			youthCulture:  require('./templates/one-way-sync-L1-youth-culture'),
			gaming:        require('./templates/one-way-sync-L1-gaming')
		};
		this.strand = detectStrand(project, strandTemplates, 'youthCulture');

		let source;
		let target;
		let broadcaster;
		let sourceAction;
		let targetAction;
		this.extraSayRequirements = 1;

		switch(this.strand) {
			case "multicultural":
			source = "Djembe";
			target = "Mali child";
			sourceAction = "plays music";
			targetAction = "dances";
			broadcaster = "Start button";
			break;
			case "gaming":
			source = "Casey";
			target = "yellow car";
			sourceAction = "says something";
			targetAction = "moves to pink ramp";
			broadcaster = "Wizard";
			this.extraSayRequirements = 2;
			break;

			case "youthCulture":
			source = "Rectangle play button";
			target = "cat video";
			sourceAction = "changes costume";
			targetAction = "changes costume";
			broadcaster = "Start button";


		}
		this.requirements = {
			oneToOne: {bool:false, str:`${source} passes unique message to ${target}`},
			sourceAction: {bool: false, str: `When ${source} is clicked, ${source} ${sourceAction}`},
			sourceSound: {bool: false, str: `When ${source} is clicked, ${source} plays a sound`},
			targetAction: {bool: false, str: `When ${source} is clicked, ${target} ${targetAction}`},
			startButton: {bool: false, str: 'Start button sprite created'},
			oneToMany: {bool: false, str: `${broadcaster} passes the same message to all other sprites`},
			broadcastToSprite1: {bool: false, str: `A sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite2:	{bool: false, str: `Another sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite3:	{bool: false, str: `A third sprite plays or dances when the ${broadcaster} is clicked`},
			broadcastToSprite4:	{bool: false, str: `A fourth sprite plays or dances when the ${broadcaster} is clicked`}
		};
		this.extensions = {
			changeWait: {bool: false, str: 'Changed the duration of a wait block'},
			sayBlock:	{bool: false, str: 'Added a say block under another event'}
		};
		if(this.strand === 'gaming'){
			delete this.requirements.startButton;
		}
		if(!(this.strand === 'youthCulture')){
			delete this.requirements.sourceSound;
		}
	}


	grade(fileObj, user) {
		const project = new Project(fileObj)
		this.init(project);

		let rawReports = project.sprites.map(sprite => this.gradeSprite(sprite));
		let nSays = rawReports.map(report => report.says).reduce((acc, val) => acc + val);
		if (nSays >= this.extraSayRequirements) {
			this.extensions.sayBlock.bool = true;
		}
		let messages = {};
		
		for (let report of rawReports) {
			if (report.sent != []) {
				for (let msg of report.sent) {
					if (msg in messages) messages[msg].sent = true;
					else messages[msg] = {sent: true, recipents: []};
				}
			}
			if (report.received != []) {
				for (let msg of report.received) {
					if (msg in messages) messages[msg].recipents.push(report.name);
					else messages[msg] = {sent: false, recipents: [report.name]};
				}
			}
		}

		

		let reports = rawReports.reduce((acc, r) => {
			acc.push({
				name: r.name,
				plays: r.plays,
				sent: 
				r.sent.length === 0 ? null : r.sent.reduce((acc, msg) => {
					acc[msg] = messages[msg].recipents;
					return acc;
				}, {}),
				received: r.received,
				dances: r.dances,
				movesTilPink: r.movesTilPink,

			});
			return acc;
		}, []);

		let sentCount;
		if (this.strand === "multicultural" ) {
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.includes('ali') || sender.name.includes('avajo'));
		} else if (this.strand === "gaming") {
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.toLowerCase().includes('go') || sender.name.toLowerCase().includes('truck'));
		} else if (this.strand === "youthCulture"){
			sentCount = (sender) => 
			Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.toLowerCase().includes('play'));
		}

		let senders = reports.filter(r => r.sent).sort((a, b) => {
			return sentCount(b) - sentCount(a);
		})
		if(this.requirements.startButton != null){
			this.requirements.startButton.bool = reports.length >= 5;
		} 
        // Checks the sprite with the most broadcasts, assuming that it must be the start button
        if (senders.length >= 3) {
        	let startButton = senders[0];

        	let totalRecipients = new Set([]);
        	for (let recipients of Object.values(startButton.sent)) {
        		let score = 0;
        		for (let name of recipients) {
        			let recipientReport = reports.find(r => r.name == name);
        			if (recipientReport.plays.onClick || recipientReport.plays.onBroadcast || recipientReport.dances) {
        				score++;
        				totalRecipients.add(name);
        			}
        		}
        		if (score >= 4) this.requirements.oneToMany.bool = true;
        	}

        	if (totalRecipients.size > 0) {
        		for (let i = Math.min(totalRecipients.size, 4); i > 0; i--) 
        			this.requirements[`broadcastToSprite${i}`].bool = true;
				//remove this sprite
				senders = senders.slice(1);
			}
		}
        // Check if at least two of remaining sprites do what is expected from Djembe and Flute sprites
        if (senders.length >= 2) {

        	let visitedFlute = false;
        	let probableDjembe = null;

        	const sumScore = (score) => !score? 0 : Object.values(score).reduce((a, b) => a + b, 0)

        	for (let sender of senders) {    
        		for (let [msg, recipients] of Object.entries(sender.sent)) {
        			let score = {
        				uniqueMessage: msg.toLowerCase() != 'navajo',
        				senderPlays: (sender.plays.onClick || sender.plays.onBroadcast),
        				recipientDances: recipients.some(recipient => reports.find(r => r.name == recipient && r.dances))
        			};

        			if (score.recipientDances && score.senderPlays && !score.uniqueMessage && !visitedFlute) {
        				visitedFlute = true;
        			} else {
        				probableDjembe = sumScore(score) > sumScore(probableDjembe) ? score : probableDjembe;
        			}
        		}
        	}
        	[this.requirements.oneToOne.bool, this.requirements.sourceAction.bool, this.requirements.targetAction.bool] = Object.values(probableDjembe);
        }

        if (this.strand === "gaming") {
        	this.requirements.targetAction.bool = rawReports.filter(r => r.movesTilPink).length >= 1;
        } else if (this.strand === "youthCulture"){
        	this.requirements.targetAction.bool = rawReports.filter(r => r.soundOnClick).length >= 1;
        }
    }
    gradeSprite(sprite) {
    	let reqs = {
    		name: sprite.name,
    		plays: {onClick: false, onBroadcast: false},
    		sent: [],
    		received: [],
    		dances: {costume: false, wait: false},
    		movesTilPink : false,
    		says: 0,
    		soundOnClick: false
    	}
    	let onClickActions;
    	if (this.strand === "multicultural") {
    		onClickActions = ['sound_play', 'sound_playuntildone'];
    	} else if (this.strand === "gaming") {
    		onClickActions = ['looks_say', 'looks_sayforsecs']
    	} else if (this.strand === "youthCulture"){
            onClickActions = ['looks_switchcostumeto', 'looks_costume', 'looks_nextcostume', 'looks']
        }
    	for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
    		if (script.blocks[0].opcode === 'event_whenthisspriteclicked')
    			script.traverseBlocks((block, level) => {
    				if (onClickActions.includes(block.opcode))
    					reqs.plays.onClick = true;
    				else if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode))
    					reqs.sent.push( block.inputs.BROADCAST_INPUT[1][1])
    				else if(['sound_play', 'sound_playuntildone'].includes(block.opcode)){
    					reqs.soundOnClick = true
    				}
    			});
    		else if (script.blocks[0].opcode === 'event_whenbroadcastreceived') {
    			reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
    			let stopsOnPink = false
    			script.traverseBlocks((block, level) => { 
    				if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
    					reqs.plays.onBroadcast = true;
    				else if (['event_blooks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode))
    					reqs.dances.costume = true;
    				else if (block.opcode === 'control_wait') {
    					reqs.dances.wait = true;
    					if (block.inputs.DURATION[1][1] != .5) this.extensions.changeWait.bool = true;
    				} else if(block.opcode === "motion_movesteps" && block.within != null 
    					&& block.within.opcode === "control_repeat_until" && 
    					block.within.conditionBlock.opcode === "sensing_touchingcolor" &&
    					block.within.conditionBlock.inputs['COLOR'][1][1] === "#ed75ec"){
    						reqs.movesTilPink = true
    				}
    			});
    		} 
    		script.traverseBlocks((block, level) => {
    			if (['looks_say', 'looks_sayforsecs'].includes(block.opcode))
    				reqs.says += 1;
    		});
    	}
    	reqs.dances = reqs.dances.costume && reqs.dances.costume;
    	return reqs;
    }
}
},{"./scratch3":26,"./templates/one-way-sync-L1-gaming":39,"./templates/one-way-sync-L1-multicultural":40,"./templates/one-way-sync-L1-youth-culture":41}],23:[function(require,module,exports){
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

},{"./scratch3":26}],24:[function(require,module,exports){
/* Scratch Basics L1 Autograder
Updated Version: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {


    initReqsGaming() {
        this.requirements = {};
        this.extensions = {};
        this.requirements.addSayCarl = { bool: false, str: 'A say block is added after Carl says "Click the Space Bar to see Helen the Amazing Color Changing Hedgehog' }; // done
        this.extensions.helenSpeaks = { bool: false, str: 'Helen says something else' }; // done
        this.extensions.carlMoves = { bool: false, str: 'Carl the Cloud moves 10 steps when he is finished talking' }; // done
    }

    initReqsMulticultural() {
        this.requirements = {};
        this.extensions = {};
        this.requirements.addSayNeha = { bool: false, str: 'A say block is added after Neha says "Happy Holi!"' }; // done
        this.extensions.bradSpeaks = { bool: false, str: 'Brad says something else' }; // done
        this.extensions.nehaMoves = { bool: false, str: 'Neha moves 10 steps when she is finished jumping and talking' }; // done
    }

    initReqsYouthCulture() {
        this.requirements = {};
        this.extensions = {};
        this.requirements.addSayIndia = { bool: false, str: 'A say block is added after India says "Click the Space Bar to see some of the things I like' }; // done
        this.extensions.easelSaysSomethingElse = { bool: false, str: 'The easel sprite says something else' }; // done
        this.extensions.indiaMoves = { bool: false, str: 'India moves 10 steps when she is finished talking' }; // done
        this.extensions.changeCostumeEasel = { bool: false, str: "The easel sprite's costume is changed to show something about the student's community" }; // done
    }

   

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        // call function that takes in the project, decides what strand it is in, that function returns a string

        let projBackdrops = [];
        for (let target of project.targets) {
            for (let costume of target.costumes) {
                projBackdrops.push(costume.assetId);
            }
        }

        var templates = {
            multicultural: require('./templates/scratch-basics-L1-multicultural'),
            youthCulture: require('./templates/scratch-basics-L1-youthculture'),
            gaming: require('./templates/scratch-basics-L1-gaming')
        };
        
        let strand = detectStrand(project, templates);

        let sayBlocks = ['looks_say', 'looks_sayforsecs'];

        // gaming strand 
        if (strand === 'gaming') {
            this.initReqsGaming();
            let sayCarl = false;
            let sayBlocksGaming = 0;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            // makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode.includes('looks_say')) {
                                    // finds the block with specified message
                                    if (script.blocks[i].inputs.MESSAGE[1][1] === 'Click the Space Bar to see Helen the Amazing Color Changing Hedgehog.') {
                                        let next = i + 1;
                                        // checks the next block to make sure it is not undefined, if it is not, checks to see if it is a say block
                                        if (script.blocks[next] !== undefined) {
                                            if (sayBlocks.includes(script.blocks[next].opcode)) {
                                                this.requirements.addSayCarl.bool = true;
                                                sayCarl = true;
                                            }
                                        }
                                    }
                                }
                                // checks to see if there is any block that moves 10 steps
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    if (script.blocks[i].inputs.STEPS[1][1] === '10') {
                                        this.extensions.carlMoves.bool = true;
                                    }
                                }
                                if (sayBlocks.includes(script.blocks[i].opcode) && target.name.includes('elen')) {
                                    sayBlocksGaming++;
                                }
                            }
                        }
                    }
                }
            }
            // requirement not fulfilled
            // if (sayCarl === false) {
            //     if (sayBlocksGaming > 4) {
            //         this.extensions.helenSpeaks.bool = true;
            //     }
            // } else {
            //     if (sayBlocksGaming > 5) {
            //         this.extensions.helenSpeaks.bool = true;
            //     }   
            // }
            if (sayBlocksGaming > 1) {
                this.extensions.helenSpeaks.bool = true;
            }
        }

        if (strand === 'multicultural') {
            this.initReqsMulticultural();
            let sayBlocksMulticultural = 0;
            let sayNeha = false;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            // makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode.includes('looks_say')) {
                                    // finds the block with the specified message
                                    if (script.blocks[i].inputs.MESSAGE[1][1] === 'Happy Holi!') {
                                        let next = i + 1;
                                        // checks the next block to make sure it is not undefined, if it not, checks to see if it is a say block
                                        if (script.blocks[next] !== undefined) {
                                            if (sayBlocks.includes(script.blocks[next].opcode)) {
                                                this.requirements.addSayNeha.bool = true;
                                                sayNeha = true;
                                            }
                                        }
                                    }
                                }
                                // checks to see if there is a block that moves 10 steps
                                if (script.blocks[i].opcode === 'motion_movesteps') {
                                    if (script.blocks[i].inputs.STEPS[1][1] === '10') {
                                        this.extensions.nehaMoves.bool = true;
                                    }
                                }
                                // if there is a say block in the sprite that is brad and the message is different from what he says
                                if (sayBlocks.includes(script.blocks[i].opcode) && target.name.includes('rad')) {
                                    sayBlocksMulticultural++;
                                }
                            }
                        }
                    }
                }
            }
            // if (sayNeha === false) {
            //     if (sayBlocksMulticultural > 14) {
            //         this.extensions.bradSpeaks.bool = true;
            //     }
            // }
            // // checks to see if there is one more than the original say block count, exlcuding the say block needed for the requirement
            // if (sayBlocksMulticultural > 15) {
            //     this.extensions.bradSpeaks.bool = true;
            // }
            if (sayBlocksMulticultural > 2) {
                this.extensions.bradSpeaks.bool = true;
            }
        }

        if (strand === 'youthCulture') {
            // make an array of the original costumes from the original project
            this.initReqsYouthCulture();
            let origCostumes = [];
            let newCostumes = [];
            var originalYouth = new Project(require('../grading-scripts-s3/youthOriginal'), null);
            for (let target of originalYouth.targets) {
                if (target.name === 'easel') {
                    for (let costume of target.costumes) {
                        origCostumes.push(costume.assetId);
                    }
                }
            }

            for (let target of project.targets) {
                if (target.name === 'easel') {
                    for (let costume of target.costumes) {
                        newCostumes.push(costume.assetId);
                    }
                }
            }

            if (origCostumes.length !== newCostumes.length) {
                this.extensions.changeCostumeEasel.bool = true;
            } else {
                for (let i = 0; i < origCostumes.length; i++) {
                    if (origCostumes[i] !== newCostumes[i]) {
                        this.extensions.changeCostumeEasel.bool = true;
                        break;
                    }
                }
            }

            let sayBlocksYouthCulture = 0;
            let sayIndia = false;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            //makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode.includes('looks_say')) {
                                    // find the block with the specified message
                                    if (script.blocks[i].inputs.MESSAGE[1][1] === 'Click the Space Bar to see some of the things I like.') {
                                        let next = i + 1;
                                        // checks the next block to make sure it is not undefined, if it is not, checks to see that the block after that is a say block
                                        if (script.blocks[next] !== undefined) {
                                            if (sayBlocks.includes(script.blocks[next].opcode)) {
                                                this.requirements.addSayIndia.bool = true;
                                                sayIndia = true;
                                            }
                                        }
                                    }
                                }
                            }

                            // checks to see if there is a block that moves 10 steps
                            if (script.blocks[i].opcode === 'motion_movesteps') {
                                if (script.blocks[i].inputs.STEPS[1][1] === '10') {
                                    this.extensions.indiaMoves.bool = true;
                                }
                            }

                            // counts the number of say blocks
                            if (sayBlocks.includes(script.blocks[i].opcode) && target.name.includes('asel')) {
                                sayBlocksYouthCulture++;
                            }
                        }
                    }
                }
            }
            
            // if (sayIndia === false) {
            //     if (sayBlocksYouthCulture > 4) {
            //         this.extensions.easelSaysSomethingElse.bool = true;
            //     }
            // }
            // if (sayBlocksYouthCulture > 5) {
            //     this.extensions.easelSaysSomethingElse.bool = true;
            // }  
            if (sayBlocksYouthCulture > 1) {
                this.extensions.easelSaysSomethingElse.bool = true;
            }
        }
    }
}
},{"../grading-scripts-s3/scratch3":26,"../grading-scripts-s3/youthOriginal":49,"./templates/scratch-basics-L1-gaming":42,"./templates/scratch-basics-L1-multicultural":43,"./templates/scratch-basics-L1-youthculture":44}],25:[function(require,module,exports){
/* Scratch Basics L2 Autograder
 * Scratch 2 (original) version: Max White, Summer 2018
 * Scratch 3 updates: Elizabeth Crowdus, Spring 2019
 * Reformatting, bug fixes, and updates: Anna Zipp, Summer 2019
*/

require('./scratch3');

// recursive function that searches a script and any subscripts (those within loops)
function iterateBlocks(script, func) {
    function recursive(scripts, func, level) {
        if (!is(scripts) || scripts === [[]]) return;
        for (var script of scripts) {
            for(var block of script.blocks) {
                func(block, level);
                recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

module.exports = class {
    // initialize the requirement and extension objects to be graded 
    init() {
        this.requirements = {
            addBackdrop: {bool: false, str: 'Added a new backdrop.'},  
            addSprite: {bool: false, str: 'Added a new sprite.'},
            greenFlagBlock: {bool: false, str: 'The main sprite has a script with the "when green flag clicked" block.'},
            goToBlock: {bool: false, str: 'The main sprite starts in the same place every time.'},
            sayBlock: {bool: false, str: 'The main sprite says something.'},
            moveBlock: {bool: false, str: 'The main sprite moves.'},
        }
        this.extensions = {
            secondEvent: {bool: false, str: 'Added another script with the "when sprite clicked" or "when key pressed" event.'},
            newBlocks: {bool: false, str: "Project uses new blocks you haven't seen before."},
            //TODO: spreadsheet doesn't have the newBlocks extension???
            secondSprite: {bool: false, str: 'Added a second sprite.'},
            secondSpriteMoves: {bool: false, str: 'Second sprite moves or does tricks.'},
            //TODO: should the second sprite requirements be combined
        }
    }

    // helper function that reports all possible requirements met by a sprite
    gradeSprite(sprite) {
        var knownBlocks = [
            'event_whenflagclicked',
            'motion_gotoxy', 
            'motion_movesteps',
            "looks_say",
            'looks_sayforsecs', 
            'event_whenkeypressed',
            "looks_nextcostume", 
            'looks_switchcostumeto', 
            'control_repeat', 
            'event_whenthisspriteclicked' 
        ];

        var highestScriptStats = {
            flag: false,
            goTo: false,
            move: false,
            say: false  
        }
        var highestScriptScore = 0;
        var newEvent = false; 
        var tricks = false;
        var unknownBlock = false; 

        // iterate through the sprite's scripts that start with an event block 
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes("event_when"))) {
            var scriptStats = {flag: false, goTo: false, move: false, say: false};
            var eventBlock = script.blocks[0];

            if (eventBlock.opcode.includes('event_whenflagclicked')) {
                if (eventBlock.next !== null) {
                    scriptStats.flag = true; 

                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode; 
        
                        if (opcode.includes("motion_")) {
                            tricks = true; 
                            scriptStats.goTo = scriptStats.goTo || opcode.includes("motion_gotoxy");
                            scriptStats.move = scriptStats.move || opcode.includes("motion_movesteps");
                        }
                        scriptStats.say = scriptStats.say || ["looks_say", "looks_sayforsecs"].includes(opcode);
                        if (!(knownBlocks.includes(opcode))) {
                            unknownBlock = true;
                        }
                    });
                }
            } else {
                if (['event_whenthisspriteclicked', 'event_whenkeypressed'].includes(eventBlock.opcode)) {
                    if (eventBlock.next !== null) {
                        newEvent = true; 
                    }
                }
                if (tricks === false) {    // check remaining event scripts for tricks, if still false 
                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode;
                        if (opcode.includes("motion_"))
                            tricks = true; 
                    });
                }
                if (unknownBlock === false) {    // check for unknown blocks, if still false
                    iterateBlocks(script, (block, level) => {
                        var opcode = block.opcode;
                        if (!(knownBlocks.includes(opcode))) {
                            unknownBlock = true;
                        }
                    });
                }
            }

            var scriptScore = Object.values(scriptStats).reduce((sum,val) => sum + val, 0);
            // find highest script score
            if (scriptScore >= highestScriptScore) {
                highestScriptStats = scriptStats;
                highestScriptScore = scriptScore; 
            }
        }

        return {
            name: sprite.name,
            stats: highestScriptStats,
            statsScore: highestScriptScore,
            doesTricks: tricks,
            hasSecondEvent: newEvent,
            usedNewBlocks: unknownBlock
        }
    }

    // main grading function
    grade(fileObj, user) {
        var project = new Project(fileObj);

        this.init();
        // if project doesn't exist, return
        if (!is(fileObj)) return;

        var numSprites = 0;
        var numMovingSprites = 0;
        var mainSprite = null;

        for(var target of project.targets) {
            if (target.isStage) {
                //TODO: if you paint over the blank backdrop, it doesn't count as a new backdrop
                // if student changed backdrop from the default blank one
                if (target.costumes[0].name !== 'backdrop1' || target.costumes.length > 1) {
                    this.requirements.addBackdrop.bool = true; 
                }
                continue; 
            } else {    // if not a stage, then it's a sprite
                numSprites++; 

                // if they change from using the default cat sprite 
                if (target.name !== 'Sprite1' || target.costumes.length > 2) {  
                    this.requirements.addSprite.bool = true;
                }

                var currSprite = this.gradeSprite(target);
                // find main sprite
                if (!(mainSprite) || (currSprite.statsScore > mainSprite.statsScore)) {
                    mainSprite = currSprite; 
                } 
                if ((currSprite.statsScore === mainSprite.statsScore) && currSprite.hasSecondEvent) {
                    mainSprite = currSprite; 
                }
                // increase counter for every sprite that moves
                if (currSprite.doesTricks) numMovingSprites++;
                
                //TODO: is the Second Event extension only for the main sprite?
                if (currSprite.hasSecondEvent) {
                    this.extensions.secondEvent.bool = true; 
                }
                //TODO: this extension wasnt in the spreadsheet?
                if (currSprite.usedNewBlocks) {
                    this.extensions.newBlocks.bool = true;
                }
            }
        }   

        if (numSprites > 1) {
            this.extensions.secondSprite.bool = true; 
        }
        if (numMovingSprites > 1) {
            this.extensions.secondSpriteMoves.bool = true; 
        }
        if (mainSprite) {
            this.requirements.greenFlagBlock.bool = mainSprite.stats.flag;
            this.requirements.goToBlock.bool = mainSprite.stats.goTo;
            this.requirements.moveBlock.bool = mainSprite.stats.move;
            this.requirements.sayBlock.bool = mainSprite.stats.say;
        }
        
    }
}
},{"./scratch3":26}],26:[function(require,module,exports){
(function (global){(function (){
/// Scratch 3 helper functions
require('./context');

/// Returns false for null, undefined, and zero-length values.
global.is = function(x) {
    return !(x == null || x === {} || x === []);
}

/// Opposite of is().
global.no = function(x) {
    return !is(x);
}

/// Container class for Scratch blocks.
global.Block = class {
    constructor(target, block, within=null) {
        Object.assign(this, target.blocks[block]);
        this.id = block;
        this.context = new Context(target.context, false);
        this.target = target;
        this.subscripts = this.subScripts();
        this.subscriptsRecursive = this.subscriptsRecursiveHelper();
        this.within = within;
        this.conditionBlock = this.conditionBlockHelper();
        this.inputBlocks = this.inputBlocksHelper();
        this.startTime = 0;
        this.duration = this.durationHelper();
    }

    /// Internal function that converts a block to a Block.
    toBlock(x, within=null) {
        return new Block(this.target, x, within);
    }

    /// Returns the next block in the script.
    nextBlock(within=null) {
        if (no(this.next)) return null;

        return this.toBlock(this.next, within);
    }

    /// Returns the previous block in the script.
    prevBlock() {
        if (no(this.parent)) return null;

        return this.toBlock(this.parent);
    }

    /// Returns the conditional statement of the block, if it exists.
    conditionBlockHelper() {
        if (no(this.inputs) || no(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1], this);
    }

    /// Returns an array of the blocks that are referenced in "fields" and "inputs."
    /// They correspond to menus, conditions, subscript heads, etc.
    inputBlocksHelper() {
        var array = [];
        for (var input in this.inputs) {
            var inputBlock = this.toBlock(this.inputs[input][1]);
            if (inputBlock) {
                array.push(inputBlock);
            }
        }
        for (var field in this.fields) {
            var fieldBlock = this.toBlock(this.fields[field][1]);
            if (fieldBlock && fieldBlock.opcode) {
                array.push(fieldBlock);
            }
        }
        return array;
    }

    /// Returns the number of seconds this block takes to execute.
    durationHelper() {
        if (!this || !this.opcode) {
            return 0;
        }
        if (this.opcode.includes('motion_glide')) {
            return this.floatInput();
        }
        else if (this.opcode === 'looks_thinkforsecs' || this.opcode === 'looks_sayforsecs') {
            return this.floatInput('SECS');
        }
        else if (this.opcode === 'control_wait') {
            return this.floatInput('DURATION');
        }
        else {
            return 0;
        }
    }

    /// Returns an array representing the script that contains the block.
    childBlocks(within=null) {
        var array = [];
        var x = this;
        while (x) {
            array.push(x);
            x = x.nextBlock(within);
        }
        return array;
    }

    /// Returns an array of Scripts representing the subscripts of the block.
    subScripts() {
        if (no(this.inputs)) return [];
        var array = [];

        if (is(this.inputs.SUBSTACK) && is(this.inputs.SUBSTACK[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK[1], this), this.target));
        }
        if (is(this.inputs.SUBSTACK2) && is(this.inputs.SUBSTACK2[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK2[1], this), this.target));
        }
        return array;
    }

    /// Identify all subscripts of a block, recursively.
    subscriptsRecursiveHelper(scriptArray = []) {
        if (this.subscripts.length) {
            for (var subscript of this.subscripts) {
                scriptArray.push(subscript);
                if (subscript.blocks.length) {
                    for (var block of subscript.blocks) {
                        block.subscriptsRecursiveHelper(scriptArray);
                    }
                }
            }
        }
        return scriptArray;
    }

    /// Checks if the block is a subblock of another block
    isWithin(compareBlock=(block => true)) {
        var outerBlock = this.within;
        while(outerBlock) {
            if (compareBlock(outerBlock)) {
                return outerBlock;
            }
            outerBlock = outerBlock.within;
        }
        return null;
    }

    /// Returns a given input of the block as a float if it exists.
    floatInput(name) {
        var input = this.inputs[name];
        if (input && input[1] && input[1][1]) {
            return parseFloat(input[1][1]);
        }
        return 0;
    }

    textInput(name) {
        var input = this.inputs[name];
        if (input && input[1] && input[1][1]) {
            return input[1][1];
        }
        return null;
    }

}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block, target) {
        this.blocks  = block.childBlocks(block.within);
        this.target  = target;
        this.context = new Context(target.context, false);
        for (var block of this.blocks) {

        }
        this.subscripts = [];
        let time = 0;
        for (var block of this.blocks) {
            block.startTime = time;
            time += block.duration;
            for (var subscript of block.subscripts) {
                if (subscript.blocks.length) {
                    this.subscripts.push(subscript);
                }
            }
            this.context.sublayers.push(block.context);
        }
        this.allSubscripts = this.allSubscripts_();
    }

    allSubscripts_() {
        var allSubscripts = [];
        for (var subscript of this.subscripts) {
            allSubscripts.push(subscript);
            allSubscripts = allSubscripts.concat(subscript.allSubscripts_());
        }
        return allSubscripts;
    }

    allBlocks() {
        let allBlocks = [];
        this.traverseBlocks(block => allBlocks.push(block));
        return allBlocks;
    }
    
    /// Recursively visits each block in a scrip and its subscripts,
    ///  noting at which level of nestedness it is in within control blocks of ones choosing.
    traverseBlocks(func, targetBlocks=null) {
        const parentBlocks = ['control_forever', 'control_if', 'control_if_else', 'control_repeat', 'control_repeat_until'];
        const traverse = (scripts, level) => {

            if (!is(scripts) || scripts === [[]]) return;
            for (let script of scripts) {
                for (let block of script.blocks) {
                    func(block, level);
                    if (parentBlocks.includes(block.opcode)) {
                        if (targetBlocks && !targetBlocks.includes(block.opcode)) {
                            traverse(block.subscripts, level);
                        } else {
                            traverse(block.subscripts, level + 1);
                        }
                    }

                }
            }
        }
        traverse([this], 1);
    }
}

/// Container class for Scratch targets (stages & sprites).
global.Target = class {
    constructor(target_, project) {
        this.project = project;
        this.context = new Context(project.context, false);
        Object.assign(this, target_);
        if (no(target_.blocks)) this.blocks = {};
        this.scripts = [];
        for (var block_ in this.blocks) {
            var block = new Block(target_, block_);
            this.blocks[block_] = block;
            if (!(block.prevBlock())) this.scripts.push(new Script(block, this));
        }
        for (var script of this.scripts) {
            this.context.sublayers.push(script.context);
        }
        this.validScripts = this.scripts.filter(script =>
            script.blocks.length > 1 && script.blocks[0].opcode.includes('event_when')
        );
    }
}

/// Container class for a whole project.
global.Project = class {
    constructor(json, items) {
        this.context = new Context(items, false);
        this.targets = [];
        this.sprites = [];
        this.scripts = [];
        for (var target_ of json.targets) {
            var target = new Target(target_, this);
            this.targets.push(target);
            if (!target_.isStage) this.sprites.push(target);
        }
        for (var target of this.targets) {
            this.scripts = this.scripts.concat(target.scripts);
            this.context.sublayers.push(target.context);
        }
    }
}

/// Identify which strand the project belongs to.
global.detectStrand = function(project, templates) {
    var strand = 'generic';
    /// Format for templates:
    /*
    var templates = {
        multicultural: require('./templates/events-L1-multicultural'),
        youthCulture:  require('./templates/events-L1-youth-culture'),
        gaming:        require('./templates/events-L1-gaming')
    };
    */
    try {
        var projectAssetIDs = [];
        for (var target of project.targets) {
            for (var costume of target.costumes) {
                projectAssetIDs.push(costume.assetId);
            }
            for (var sound of target.sounds) {
                projectAssetIDs.push(sound.assetId);
            }
        }
        var highScore = 0;
        for (var template in templates) {
            var templateFile = templates[template];
            var templateAssetIDs = [];
            for (var target of templateFile.targets) {
                for (var costume of target.costumes) {
                    templateAssetIDs.push(costume.assetId);
                }
                for (var sound of target.sounds) {
                    templateAssetIDs.push(sound.assetId);
                }
            }
            var templateScore = 0;
            for (var projectAssetID of projectAssetIDs) {
                if (templateAssetIDs.includes(projectAssetID)) {
                    templateScore++;
                }
                if (templateScore > highScore) {
                    strand = template;
                    highScore = templateScore;
                }
            }
        }
    }
    catch(err) {
        console.log(err);
    }
    return strand;
}

global.opcodeLists = {
    changeXY: [
        'motion_changexby',
        'motion_changeyby',
        'motion_movesteps',
        'motion_glidesecstoxy',
        'motion_glideto',
        'motion_goto',
        'motion_gotoxy',
        'motion_setx',
        'motion_sety'
    ],
    speak: [
        'looks_say',
        'looks_sayforsecs',
        'looks_think',
        'looks_thinkforsecs'
    ]
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./context":16}],27:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"c371efaccecb338cfbf99e3a526a8b42","name":"Racetrack","bitmapResolution":1,"md5ext":"c371efaccecb338cfbf99e3a526a8b42.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Bee","variables":{},"lists":{},"broadcasts":{},"blocks":{"_L+5lb=xE}1*|GpP}mAI":{"opcode":"event_whenflagclicked","next":"A=y9Z+^Mr6h6M~3h-o6%","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"A=y9Z+^Mr6h6M~3h-o6%":{"opcode":"motion_gotoxy","next":"4).rhTF;UVKCM]d8rD.F","parent":"_L+5lb=xE}1*|GpP}mAI","inputs":{"X":[1,[4,-174]],"Y":[1,[4,-10]]},"fields":{},"shadow":false,"topLevel":false},"4).rhTF;UVKCM]d8rD.F":{"opcode":"looks_switchcostumeto","next":null,"parent":"A=y9Z+^Mr6h6M~3h-o6%","inputs":{"COSTUME":[1,"iun}SZ7i%MY).{G{[c_,"]},"fields":{},"shadow":false,"topLevel":false},"iun}SZ7i%MY).{G{[c_,":{"opcode":"looks_costume","next":null,"parent":"4).rhTF;UVKCM]d8rD.F","inputs":{},"fields":{"COSTUME":["bumblebee1"]},"shadow":true,"topLevel":false},"[1EB1ggj@?fkz+qox^e0":{"opcode":"event_whenkeypressed","next":"PU-1R8}:x1|Xn%sBZ0NR","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":68,"y":267},"PU-1R8}:x1|Xn%sBZ0NR":{"opcode":"control_repeat","next":null,"parent":"[1EB1ggj@?fkz+qox^e0","inputs":{"TIMES":[1,[6,"16"]],"SUBSTACK":[2,",.@BOSQ2(?9IjIQ}S^QB"]},"fields":{},"shadow":false,"topLevel":false},",.@BOSQ2(?9IjIQ}S^QB":{"opcode":"control_wait","next":"dilrm{0V=Q9kge;PNPcm","parent":"PU-1R8}:x1|Xn%sBZ0NR","inputs":{"DURATION":[1,[5,".2"]]},"fields":{},"shadow":false,"topLevel":false},"dilrm{0V=Q9kge;PNPcm":{"opcode":"looks_nextcostume","next":"0]7B3.!ySNfSxa!_RaBQ","parent":",.@BOSQ2(?9IjIQ}S^QB","inputs":{},"fields":{},"shadow":false,"topLevel":false},"0]7B3.!ySNfSxa!_RaBQ":{"opcode":"motion_movesteps","next":null,"parent":"dilrm{0V=Q9kge;PNPcm","inputs":{"STEPS":[1,[4,"10"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{"?iY(@IzAm~D[`rt4~ljS":{"blockId":null,"x":399.96296296296293,"y":694.8518518518518,"width":241,"height":299,"minimized":false,"text":"Build one script here. It should have the Bee flap its wings, while it stays in one location, when the down arrow key is pressed. Look at the script on the Monkey sprite."},"DuZTdlVF?Fg`(DmygOj,":{"blockId":null,"x":407.4074074074074,"y":281.5185185185186,"width":241.5,"height":297,"minimized":false,"text":"This script should have the Bee flap its wings and move across the stage to the finish line when the space key is pressed. Modify it to fix it, so it does that correctly. Look at the script on the Snake sprite."}},"currentCostume":0,"costumes":[{"assetId":"0d3069bd24c5ad7d45c85d7a751e3071","name":"bumblebee1","bitmapResolution":1,"md5ext":"0d3069bd24c5ad7d45c85d7a751e3071.svg","dataFormat":"svg","rotationCenterX":169,"rotationCenterY":90},{"assetId":"d4d66fe1d56f697d6967767e0524c4bd","name":"bumblebee2","bitmapResolution":1,"md5ext":"d4d66fe1d56f697d6967767e0524c4bd.svg","dataFormat":"svg","rotationCenterX":181,"rotationCenterY":72},{"assetId":"e575ce0d29f553050cea2507e476ef1c","name":"bumblebee3","bitmapResolution":1,"md5ext":"e575ce0d29f553050cea2507e476ef1c.svg","dataFormat":"svg","rotationCenterX":181,"rotationCenterY":88},{"assetId":"9a5999064f8028ec122670466bc49f9f","name":"bumblebee4","bitmapResolution":1,"md5ext":"9a5999064f8028ec122670466bc49f9f.svg","dataFormat":"svg","rotationCenterX":232,"rotationCenterY":72}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":146,"y":-10,"size":45.000000000000014,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Snake","variables":{},"lists":{},"broadcasts":{},"blocks":{"84[FWdbziUjC)luCL1Y]":{"opcode":"event_whenflagclicked","next":"bYip[+tH+352-wNYyiLY","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"bYip[+tH+352-wNYyiLY":{"opcode":"motion_gotoxy","next":"A]K(VWrWlD8/(4Yx(Q{;","parent":"84[FWdbziUjC)luCL1Y]","inputs":{"X":[1,[4,-211]],"Y":[1,[4,-133]]},"fields":{},"shadow":false,"topLevel":false},"A]K(VWrWlD8/(4Yx(Q{;":{"opcode":"looks_switchcostumeto","next":"!?Oznz(loP2ZL!tM,x[7","parent":"bYip[+tH+352-wNYyiLY","inputs":{"COSTUME":[1,"a+vc/w%OiJz+B+!8SH@@"]},"fields":{},"shadow":false,"topLevel":false},"a+vc/w%OiJz+B+!8SH@@":{"opcode":"looks_costume","next":null,"parent":"A]K(VWrWlD8/(4Yx(Q{;","inputs":{},"fields":{"COSTUME":["snake1"]},"shadow":true,"topLevel":false},"!?Oznz(loP2ZL!tM,x[7":{"opcode":"looks_sayforsecs","next":null,"parent":"A]K(VWrWlD8/(4Yx(Q{;","inputs":{"MESSAGE":[1,[10,"Hsss..."]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"|lKC;U3+J9Xb,Ip75%B+":{"opcode":"event_whenkeypressed","next":"Z-n76N9kiz}(b3Kxi}_T","parent":null,"inputs":{},"fields":{"KEY_OPTION":["down arrow"]},"shadow":false,"topLevel":true,"x":22,"y":360},"Z-n76N9kiz}(b3Kxi}_T":{"opcode":"control_wait","next":"9,|Bj?*t}Oo:G1uG=J^W","parent":"|lKC;U3+J9Xb,Ip75%B+","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"9,|Bj?*t}Oo:G1uG=J^W":{"opcode":"looks_switchcostumeto","next":"Q*cRSp^MT+{87D1uhHV!","parent":"Z-n76N9kiz}(b3Kxi}_T","inputs":{"COSTUME":[1,"lK%my9X4{4ogMM|^.^fQ"]},"fields":{},"shadow":false,"topLevel":false},"lK%my9X4{4ogMM|^.^fQ":{"opcode":"looks_costume","next":null,"parent":"9,|Bj?*t}Oo:G1uG=J^W","inputs":{},"fields":{"COSTUME":["snake2"]},"shadow":true,"topLevel":false},"Q*cRSp^MT+{87D1uhHV!":{"opcode":"control_wait","next":"JdO}Gxnlp0S0QF[=r6%;","parent":"9,|Bj?*t}Oo:G1uG=J^W","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"JdO}Gxnlp0S0QF[=r6%;":{"opcode":"looks_switchcostumeto","next":"rX+~p5H/,%^cr8~YMp.b","parent":"Q*cRSp^MT+{87D1uhHV!","inputs":{"COSTUME":[1,"fL*KUW)npuDtWARYc)bo"]},"fields":{},"shadow":false,"topLevel":false},"fL*KUW)npuDtWARYc)bo":{"opcode":"looks_costume","next":null,"parent":"JdO}Gxnlp0S0QF[=r6%;","inputs":{},"fields":{"COSTUME":["snake3"]},"shadow":true,"topLevel":false},"rX+~p5H/,%^cr8~YMp.b":{"opcode":"control_wait","next":"Pc4vS7,-R+A!zHDGSb?`","parent":"JdO}Gxnlp0S0QF[=r6%;","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"Pc4vS7,-R+A!zHDGSb?`":{"opcode":"looks_switchcostumeto","next":".LNyz,=q-|3U2KYUyNG9","parent":"rX+~p5H/,%^cr8~YMp.b","inputs":{"COSTUME":[1,")]T}mdED3iq+8C=-%=e{"]},"fields":{},"shadow":false,"topLevel":false},")]T}mdED3iq+8C=-%=e{":{"opcode":"looks_costume","next":null,"parent":"Pc4vS7,-R+A!zHDGSb?`","inputs":{},"fields":{"COSTUME":["snake4"]},"shadow":true,"topLevel":false},".LNyz,=q-|3U2KYUyNG9":{"opcode":"control_wait","next":null,"parent":"Pc4vS7,-R+A!zHDGSb?`","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"[1EB1ggj@?fkz+qox^e0":{"opcode":"event_whenkeypressed","next":"PU-1R8}:x1|Xn%sBZ0NR","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":24,"y":836},"PU-1R8}:x1|Xn%sBZ0NR":{"opcode":"control_repeat","next":null,"parent":"[1EB1ggj@?fkz+qox^e0","inputs":{"TIMES":[1,[6,"36"]],"SUBSTACK":[2,",.@BOSQ2(?9IjIQ}S^QB"]},"fields":{},"shadow":false,"topLevel":false},",.@BOSQ2(?9IjIQ}S^QB":{"opcode":"control_wait","next":"dilrm{0V=Q9kge;PNPcm","parent":"PU-1R8}:x1|Xn%sBZ0NR","inputs":{"DURATION":[1,[5,"0.2"]]},"fields":{},"shadow":false,"topLevel":false},"dilrm{0V=Q9kge;PNPcm":{"opcode":"looks_nextcostume","next":"0]7B3.!ySNfSxa!_RaBQ","parent":",.@BOSQ2(?9IjIQ}S^QB","inputs":{},"fields":{},"shadow":false,"topLevel":false},"0]7B3.!ySNfSxa!_RaBQ":{"opcode":"motion_movesteps","next":null,"parent":"dilrm{0V=Q9kge;PNPcm","inputs":{"STEPS":[1,[4,"10"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":3,"costumes":[{"assetId":"c068cd85966ad9721f4204d2726e38de","name":"snake1","bitmapResolution":1,"md5ext":"c068cd85966ad9721f4204d2726e38de.svg","dataFormat":"svg","rotationCenterX":117,"rotationCenterY":50},{"assetId":"a6457d860f2c98e5b34cb1b586579921","name":"snake2","bitmapResolution":1,"md5ext":"a6457d860f2c98e5b34cb1b586579921.svg","dataFormat":"svg","rotationCenterX":146,"rotationCenterY":58},{"assetId":"78d3c4f23c7062cf6d3bb4734de91e36","name":"snake3","bitmapResolution":1,"md5ext":"78d3c4f23c7062cf6d3bb4734de91e36.svg","dataFormat":"svg","rotationCenterX":171,"rotationCenterY":61},{"assetId":"a386b7d046bcc19fa6a45961f9eb474c","name":"snake4","bitmapResolution":1,"md5ext":"a386b7d046bcc19fa6a45961f9eb474c.svg","dataFormat":"svg","rotationCenterX":156,"rotationCenterY":57}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":149,"y":-133,"size":85,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Monkey ","variables":{},"lists":{},"broadcasts":{},"blocks":{"?K4D^S*bY*ym?y|lOQ(]":{"opcode":"event_whenflagclicked","next":"uB:@HVlzJ5]pau%QfhSs","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":38,"y":33},"uB:@HVlzJ5]pau%QfhSs":{"opcode":"looks_switchcostumeto","next":"Rf(SqwLDLJ2`eIA(id#0","parent":"?K4D^S*bY*ym?y|lOQ(]","inputs":{"COSTUME":[1,"Kh*oWNN+TaOEk@YQ[!S^"]},"fields":{},"shadow":false,"topLevel":false},"Kh*oWNN+TaOEk@YQ[!S^":{"opcode":"looks_costume","next":null,"parent":"uB:@HVlzJ5]pau%QfhSs","inputs":{},"fields":{"COSTUME":["monkey top right"]},"shadow":true,"topLevel":false},"Rf(SqwLDLJ2`eIA(id#0":{"opcode":"motion_gotoxy","next":"RFT7OOdOGndf|Q;PqI!a","parent":"uB:@HVlzJ5]pau%QfhSs","inputs":{"X":[1,[4,-12]],"Y":[1,[4,83]]},"fields":{},"shadow":false,"topLevel":false},"RFT7OOdOGndf|Q;PqI!a":{"opcode":"looks_sayforsecs","next":"Y5y.Oo7tq%RxTOhgd_kJ","parent":"Rf(SqwLDLJ2`eIA(id#0","inputs":{"MESSAGE":[1,[10,"We're having a race today!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"Y5y.Oo7tq%RxTOhgd_kJ":{"opcode":"looks_sayforsecs","next":"Fl80G8,nR:w6dt2qM1,z","parent":"RFT7OOdOGndf|Q;PqI!a","inputs":{"MESSAGE":[1,[10,"Press the down arrow to watch me wave my flag."]],"SECS":[1,[4,4]]},"fields":{},"shadow":false,"topLevel":false},"Fl80G8,nR:w6dt2qM1,z":{"opcode":"looks_sayforsecs","next":null,"parent":"Y5y.Oo7tq%RxTOhgd_kJ","inputs":{"MESSAGE":[1,[10,"Then, press the spacebar to start the race!"]],"SECS":[1,[4,3]]},"fields":{},"shadow":false,"topLevel":false},"vJogFI|*a1Oe*QbYto[o":{"opcode":"event_whenkeypressed","next":"uv+9+@dt=B:2@;OT5-ci","parent":null,"inputs":{},"fields":{"KEY_OPTION":["down arrow"]},"shadow":false,"topLevel":true,"x":41,"y":414},"uv+9+@dt=B:2@;OT5-ci":{"opcode":"control_wait","next":";]h6RB)y0d7Jk-`6%hbJ","parent":"vJogFI|*a1Oe*QbYto[o","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},";]h6RB)y0d7Jk-`6%hbJ":{"opcode":"looks_switchcostumeto","next":"_0F}rJd)Ax2=UgxOU5nr","parent":"uv+9+@dt=B:2@;OT5-ci","inputs":{"COSTUME":[1,"nv9guutkNs7%9Y?As8N["]},"fields":{},"shadow":false,"topLevel":false},"nv9guutkNs7%9Y?As8N[":{"opcode":"looks_costume","next":null,"parent":";]h6RB)y0d7Jk-`6%hbJ","inputs":{},"fields":{"COSTUME":["monkey bottom right"]},"shadow":true,"topLevel":false},"_0F}rJd)Ax2=UgxOU5nr":{"opcode":"control_wait","next":"XB1[V6^cgIX/)pg;N5F}","parent":";]h6RB)y0d7Jk-`6%hbJ","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"XB1[V6^cgIX/)pg;N5F}":{"opcode":"looks_switchcostumeto","next":"o7lPH##L;6P(Jq^-QfaJ","parent":"_0F}rJd)Ax2=UgxOU5nr","inputs":{"COSTUME":[1,"_YEH?jyur|4S8#W1x9dK"]},"fields":{},"shadow":false,"topLevel":false},"_YEH?jyur|4S8#W1x9dK":{"opcode":"looks_costume","next":null,"parent":"XB1[V6^cgIX/)pg;N5F}","inputs":{},"fields":{"COSTUME":["monkey bottom left"]},"shadow":true,"topLevel":false},"o7lPH##L;6P(Jq^-QfaJ":{"opcode":"control_wait","next":"oD9^XbKY*`]WB;|.JP8c","parent":"XB1[V6^cgIX/)pg;N5F}","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"oD9^XbKY*`]WB;|.JP8c":{"opcode":"looks_switchcostumeto","next":"e5%5@H#gkZb?g_LlZxBE","parent":"o7lPH##L;6P(Jq^-QfaJ","inputs":{"COSTUME":[1,"htYDR#q=j%MlVXxEUpr-"]},"fields":{},"shadow":false,"topLevel":false},"htYDR#q=j%MlVXxEUpr-":{"opcode":"looks_costume","next":null,"parent":"oD9^XbKY*`]WB;|.JP8c","inputs":{},"fields":{"COSTUME":["monkey top left"]},"shadow":true,"topLevel":false},"e5%5@H#gkZb?g_LlZxBE":{"opcode":"control_wait","next":"m=b^FuAAI-bbRY{*z-Pg","parent":"oD9^XbKY*`]WB;|.JP8c","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"m=b^FuAAI-bbRY{*z-Pg":{"opcode":"looks_switchcostumeto","next":null,"parent":"e5%5@H#gkZb?g_LlZxBE","inputs":{"COSTUME":[1,"HSP.2[-f,|V`S,KlBB0o"]},"fields":{},"shadow":false,"topLevel":false},"HSP.2[-f,|V`S,KlBB0o":{"opcode":"looks_costume","next":null,"parent":"m=b^FuAAI-bbRY{*z-Pg","inputs":{},"fields":{"COSTUME":["monkey top right"]},"shadow":true,"topLevel":false},"}vG;i*1dT#_OS@YU:=aD":{"opcode":"event_whenkeypressed","next":"G{X7710sg5@1Sd1y@G[o","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space"]},"shadow":false,"topLevel":true,"x":45,"y":937},"G{X7710sg5@1Sd1y@G[o":{"opcode":"looks_sayforsecs","next":";Od2fUM[Pm4OZ}+13:Ab","parent":"}vG;i*1dT#_OS@YU:=aD","inputs":{"MESSAGE":[1,[10,"Go!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},";Od2fUM[Pm4OZ}+13:Ab":{"opcode":"control_repeat","next":"k_R1*AYxT)5ixNyk/Mjy","parent":"G{X7710sg5@1Sd1y@G[o","inputs":{"TIMES":[1,[6,36]],"SUBSTACK":[2,"K#]My7K1F`{7fO|]yv4Y"]},"fields":{},"shadow":false,"topLevel":false},"K#]My7K1F`{7fO|]yv4Y":{"opcode":"control_wait","next":"/5y3J._OxlEW6!^_GdJ[","parent":";Od2fUM[Pm4OZ}+13:Ab","inputs":{"DURATION":[1,[5,0.2]]},"fields":{},"shadow":false,"topLevel":false},"/5y3J._OxlEW6!^_GdJ[":{"opcode":"looks_nextcostume","next":null,"parent":"K#]My7K1F`{7fO|]yv4Y","inputs":{},"fields":{},"shadow":false,"topLevel":false},"k_R1*AYxT)5ixNyk/Mjy":{"opcode":"looks_sayforsecs","next":null,"parent":";Od2fUM[Pm4OZ}+13:Ab","inputs":{"MESSAGE":[1,[10,"Yay!!!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"107d47ecc7377b5b3192d8ba832ef2ef","name":"monkey top right","bitmapResolution":1,"md5ext":"107d47ecc7377b5b3192d8ba832ef2ef.svg","dataFormat":"svg","rotationCenterX":139,"rotationCenterY":130},{"assetId":"c759fe2dfc5a76191f8b70bbc852337c","name":"monkey bottom right","bitmapResolution":2,"md5ext":"c759fe2dfc5a76191f8b70bbc852337c.png","dataFormat":"png","rotationCenterX":285,"rotationCenterY":248},{"assetId":"3d705748231f2e1351f78397b486a472","name":"monkey bottom left","bitmapResolution":2,"md5ext":"3d705748231f2e1351f78397b486a472.png","dataFormat":"png","rotationCenterX":275,"rotationCenterY":255},{"assetId":"1fc6c2c6386367da5a2e94a29310dd4a","name":"monkey top left","bitmapResolution":2,"md5ext":"1fc6c2c6386367da5a2e94a29310dd4a.png","dataFormat":"png","rotationCenterX":376,"rotationCenterY":276}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":-12,"y":83,"size":35.000000000000014,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Kangaroo","variables":{},"lists":{},"broadcasts":{},"blocks":{"5EUiK3P1Whz.zi1RK-4S":{"opcode":"event_whenflagclicked","next":"6WDN|[yq[!y.o=*Z)y%x","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":23,"y":62},"6WDN|[yq[!y.o=*Z)y%x":{"opcode":"motion_gotoxy","next":"lj~`f0h*5^!Lf.VC[DN[","parent":"5EUiK3P1Whz.zi1RK-4S","inputs":{"X":[1,[4,-205]],"Y":[1,[4,72]]},"fields":{},"shadow":false,"topLevel":false},"lj~`f0h*5^!Lf.VC[DN[":{"opcode":"looks_switchcostumeto","next":null,"parent":"6WDN|[yq[!y.o=*Z)y%x","inputs":{"COSTUME":[1,"K%:i2?Ak*WiQvh]~p(d@"]},"fields":{},"shadow":false,"topLevel":false},"K%:i2?Ak*WiQvh]~p(d@":{"opcode":"looks_costume","next":null,"parent":"lj~`f0h*5^!Lf.VC[DN[","inputs":{},"fields":{"COSTUME":["kangaroo crouching"]},"shadow":true,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"1a3d749ac7648e42aa4a188defadd7e5","name":"kangaroo crouching","bitmapResolution":1,"md5ext":"1a3d749ac7648e42aa4a188defadd7e5.svg","dataFormat":"svg","rotationCenterX":83,"rotationCenterY":100},{"assetId":"b302b866bc09cc452e4afd9bf02b3889","name":"kangaroo half jump","bitmapResolution":1,"md5ext":"b302b866bc09cc452e4afd9bf02b3889.svg","dataFormat":"svg","rotationCenterX":83,"rotationCenterY":113},{"assetId":"59b44f7b77f8dca039e2c5ab5b25ec6e","name":"kangaroo jump","bitmapResolution":1,"md5ext":"59b44f7b77f8dca039e2c5ab5b25ec6e.svg","dataFormat":"svg","rotationCenterX":61,"rotationCenterY":92},{"assetId":"b302b866bc09cc452e4afd9bf02b3889","name":"kangaroo half jump2","bitmapResolution":1,"md5ext":"b302b866bc09cc452e4afd9bf02b3889.svg","dataFormat":"svg","rotationCenterX":83,"rotationCenterY":113}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":false,"x":-205,"y":72,"size":60,"direction":90,"draggable":false,"rotationStyle":"left-right"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190822194548","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"}}
},{}],28:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":1,"costumes":[{"assetId":"4953b97814c20b8a3dab049695d509c7","name":"073018DragonBoat_bg","bitmapResolution":2,"md5ext":"4953b97814c20b8a3dab049695d509c7.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"b9c928707e817780fe6e373ab7251e2b","name":"081018DragonBoat_bg","bitmapResolution":2,"md5ext":"b9c928707e817780fe6e373ab7251e2b.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"blue dragon boat","variables":{},"lists":{},"broadcasts":{},"blocks":{"FFR95}}V~GN]}7X5j;9K":{"opcode":"event_whenkeypressed","next":".O#5Xx[CR_kMrHY[i|Dx","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":-935,"y":-1220},".O#5Xx[CR_kMrHY[i|Dx":{"opcode":"control_repeat","next":null,"parent":"FFR95}}V~GN]}7X5j;9K","inputs":{"TIMES":[1,[6,"35"]],"SUBSTACK":[2,"jNFbKFq}IuK(c[9(`oWr"]},"fields":{},"shadow":false,"topLevel":false},"jNFbKFq}IuK(c[9(`oWr":{"opcode":"looks_switchcostumeto","next":"XEW(Z076Z#9yHvZ|ZDL5","parent":".O#5Xx[CR_kMrHY[i|Dx","inputs":{"COSTUME":[1,"TP!8h)[T(:vpYEJo+3~v"]},"fields":{},"shadow":false,"topLevel":false},"TP!8h)[T(:vpYEJo+3~v":{"opcode":"looks_costume","next":null,"parent":"jNFbKFq}IuK(c[9(`oWr","inputs":{},"fields":{"COSTUME":["down_blue",null]},"shadow":true,"topLevel":false},"XEW(Z076Z#9yHvZ|ZDL5":{"opcode":"control_wait","next":"l:C@C=2n]Y;]QJPkGpGY","parent":"jNFbKFq}IuK(c[9(`oWr","inputs":{"DURATION":[1,[5,".2"]]},"fields":{},"shadow":false,"topLevel":false},"l:C@C=2n]Y;]QJPkGpGY":{"opcode":"motion_movesteps","next":"Gz6/Hi}oZ.0Kz[B(I[N@","parent":"XEW(Z076Z#9yHvZ|ZDL5","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"Gz6/Hi}oZ.0Kz[B(I[N@":{"opcode":"looks_nextcostume","next":"Tm(ekBMU.|y#[:tiuIxX","parent":"l:C@C=2n]Y;]QJPkGpGY","inputs":{},"fields":{},"shadow":false,"topLevel":false},"Tm(ekBMU.|y#[:tiuIxX":{"opcode":"control_wait","next":"/1p=po};l=p2wBFg.+KX","parent":"Gz6/Hi}oZ.0Kz[B(I[N@","inputs":{"DURATION":[1,[5,".2"]]},"fields":{},"shadow":false,"topLevel":false},"/1p=po};l=p2wBFg.+KX":{"opcode":"motion_movesteps","next":"%xgSU|a%n6?6B^:p#79W","parent":"Tm(ekBMU.|y#[:tiuIxX","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"%xgSU|a%n6?6B^:p#79W":{"opcode":"looks_nextcostume","next":"SxL%_l}47U7X-A1Gf#xQ","parent":"/1p=po};l=p2wBFg.+KX","inputs":{},"fields":{},"shadow":false,"topLevel":false},"SxL%_l}47U7X-A1Gf#xQ":{"opcode":"control_wait","next":".O92:D-$N=O;#2Jb2%TU","parent":"%xgSU|a%n6?6B^:p#79W","inputs":{"DURATION":[1,[5,".2"]]},"fields":{},"shadow":false,"topLevel":false},".O92:D-$N=O;#2Jb2%TU":{"opcode":"motion_movesteps","next":"++}8Ln3qt-1T4|DOUy,r","parent":"SxL%_l}47U7X-A1Gf#xQ","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"++}8Ln3qt-1T4|DOUy,r":{"opcode":"looks_nextcostume","next":null,"parent":".O92:D-$N=O;#2Jb2%TU","inputs":{},"fields":{},"shadow":false,"topLevel":false},"c+:6O#=EJUR.aX!#*%.M":{"opcode":"event_whenflagclicked","next":"{5ZSJ=*@5/!=NTcWjXa(","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-1265,"y":-1517},"{5ZSJ=*@5/!=NTcWjXa(":{"opcode":"motion_gotoxy","next":"tik2?JnJviBGw^rjm`1]","parent":"c+:6O#=EJUR.aX!#*%.M","inputs":{"X":[1,[4,"-22"]],"Y":[1,[4,"123"]]},"fields":{},"shadow":false,"topLevel":false},"tik2?JnJviBGw^rjm`1]":{"opcode":"looks_switchcostumeto","next":null,"parent":"{5ZSJ=*@5/!=NTcWjXa(","inputs":{"COSTUME":[1,"c;;U)E!O()YxY;tE]I8L"]},"fields":{},"shadow":false,"topLevel":false},"c;;U)E!O()YxY;tE]I8L":{"opcode":"looks_costume","next":null,"parent":"tik2?JnJviBGw^rjm`1]","inputs":{},"fields":{"COSTUME":["down_blue",null]},"shadow":true,"topLevel":false},"m4d,Ry=}Y^jA%8TKE#d{":{"opcode":"event_whenkeypressed","next":"c=qhD{:.l#[]rRuA{Jh%","parent":null,"inputs":{},"fields":{"KEY_OPTION":["down arrow",null]},"shadow":false,"topLevel":true,"x":-607,"y":-1201},"c=qhD{:.l#[]rRuA{Jh%":{"opcode":"looks_switchcostumeto","next":"keG~!evr$UsJ}hvFIznM","parent":"m4d,Ry=}Y^jA%8TKE#d{","inputs":{"COSTUME":[1,";rROHx/$=g5D:aq4/;G|"]},"fields":{},"shadow":false,"topLevel":false},";rROHx/$=g5D:aq4/;G|":{"opcode":"looks_costume","next":null,"parent":"c=qhD{:.l#[]rRuA{Jh%","inputs":{},"fields":{"COSTUME":["cheer1_blue",null]},"shadow":true,"topLevel":false},"keG~!evr$UsJ}hvFIznM":{"opcode":"control_repeat","next":"+Hh%#l`Z[Qu1mLfh-H*`","parent":"c=qhD{:.l#[]rRuA{Jh%","inputs":{"TIMES":[1,[6,"2"]],"SUBSTACK":[2,"4*Iefk1%;[oeL@hQ.=ex"]},"fields":{},"shadow":false,"topLevel":false},"4*Iefk1%;[oeL@hQ.=ex":{"opcode":"control_wait","next":"=JY(;_7IgkC{d^kL+8oJ","parent":"keG~!evr$UsJ}hvFIznM","inputs":{"DURATION":[1,[5,".5"]]},"fields":{},"shadow":false,"topLevel":false},"=JY(;_7IgkC{d^kL+8oJ":{"opcode":"looks_nextcostume","next":null,"parent":"4*Iefk1%;[oeL@hQ.=ex","inputs":{},"fields":{},"shadow":false,"topLevel":false},"+Hh%#l`Z[Qu1mLfh-H*`":{"opcode":"looks_sayforsecs","next":null,"parent":"keG~!evr$UsJ}hvFIznM","inputs":{"MESSAGE":[1,[10,"Yay!"]],"SECS":[1,[4,"1"]]},"fields":{},"shadow":false,"topLevel":false},"0S:gt:l:0NN+W@{MR@Wm":{"opcode":"event_whenthisspriteclicked","next":"}oR.w?fGtTlORUz04YEe","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-841,"y":-1518},"}oR.w?fGtTlORUz04YEe":{"opcode":"looks_sayforsecs","next":"j/Q/{X@F3rCo{@kcyUBY","parent":"0S:gt:l:0NN+W@{MR@Wm","inputs":{"MESSAGE":[1,[10,"Press the down arrow key to see a cheer."]],"SECS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"j/Q/{X@F3rCo{@kcyUBY":{"opcode":"looks_sayforsecs","next":null,"parent":"}oR.w?fGtTlORUz04YEe","inputs":{"MESSAGE":[1,[10,"Click on the space bar to see us race!"]],"SECS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":3,"costumes":[{"assetId":"4159218d9f72e802fca2e93e61aee2c8","name":"down_blue","bitmapResolution":2,"md5ext":"4159218d9f72e802fca2e93e61aee2c8.png","dataFormat":"png","rotationCenterX":454,"rotationCenterY":50},{"assetId":"18c6aa8bb365e84a338ee0edc16e7bd0","name":"middle_blue","bitmapResolution":2,"md5ext":"18c6aa8bb365e84a338ee0edc16e7bd0.png","dataFormat":"png","rotationCenterX":452,"rotationCenterY":50},{"assetId":"47db3f356c44fe4e0e0733ac250f295e","name":"up_blue","bitmapResolution":2,"md5ext":"47db3f356c44fe4e0e0733ac250f295e.png","dataFormat":"png","rotationCenterX":457,"rotationCenterY":51},{"assetId":"f380430253f8e8da013d4b6777d55786","name":"cheer1_blue","bitmapResolution":2,"md5ext":"f380430253f8e8da013d4b6777d55786.png","dataFormat":"png","rotationCenterX":453,"rotationCenterY":51},{"assetId":"174eff4f9464966cbc03baef7b87f397","name":"cheer2_blue","bitmapResolution":2,"md5ext":"174eff4f9464966cbc03baef7b87f397.png","dataFormat":"png","rotationCenterX":453,"rotationCenterY":51}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":453,"y":123,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"red dragon boat2","variables":{},"lists":{},"broadcasts":{},"blocks":{"6}O]aJN^jh=FRZ4B%_Ck":{"opcode":"event_whenflagclicked","next":"mdXB=)t5:KSqG_Jbnm7I","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-1431,"y":-995},"mdXB=)t5:KSqG_Jbnm7I":{"opcode":"motion_gotoxy","next":"Y.?XbYRER/KJ~F[QBP54","parent":"6}O]aJN^jh=FRZ4B%_Ck","inputs":{"X":[1,[4,"-22"]],"Y":[1,[4,"-43"]]},"fields":{},"shadow":false,"topLevel":false},"Y.?XbYRER/KJ~F[QBP54":{"opcode":"looks_switchcostumeto","next":"7=(OQT~_tljhP^Pc~Cgi","parent":"mdXB=)t5:KSqG_Jbnm7I","inputs":{"COSTUME":[1,"]EUK-sDeGZ.CN9)5}Vkl"]},"fields":{},"shadow":false,"topLevel":false},"]EUK-sDeGZ.CN9)5}Vkl":{"opcode":"looks_costume","next":null,"parent":"Y.?XbYRER/KJ~F[QBP54","inputs":{},"fields":{"COSTUME":["down",null]},"shadow":true,"topLevel":false},"7=(OQT~_tljhP^Pc~Cgi":{"opcode":"looks_sayforsecs","next":"H@ytYjcf=bI;xcsnM1gW","parent":"Y.?XbYRER/KJ~F[QBP54","inputs":{"MESSAGE":[1,[10,"We are dragon boat racing!"]],"SECS":[1,[4,"5"]]},"fields":{},"shadow":false,"topLevel":false},"H@ytYjcf=bI;xcsnM1gW":{"opcode":"looks_sayforsecs","next":"o9y-gE8P!s6PTuL!.h=/","parent":"7=(OQT~_tljhP^Pc~Cgi","inputs":{"MESSAGE":[1,[10,"This is a tradition that originated in China."]],"SECS":[1,[4,"7"]]},"fields":{},"shadow":false,"topLevel":false},"o9y-gE8P!s6PTuL!.h=/":{"opcode":"looks_sayforsecs","next":"IF~s%DYs(N!f-$H@!0Sy","parent":"H@ytYjcf=bI;xcsnM1gW","inputs":{"MESSAGE":[1,[10,"But now, it is celebrated all around the world!"]],"SECS":[1,[4,"7"]]},"fields":{},"shadow":false,"topLevel":false},"IF~s%DYs(N!f-$H@!0Sy":{"opcode":"looks_sayforsecs","next":null,"parent":"o9y-gE8P!s6PTuL!.h=/","inputs":{"MESSAGE":[1,[10,"Click on the Blue Dragon Boat to learn how to race!"]],"SECS":[1,[4,"8"]]},"fields":{},"shadow":false,"topLevel":false},"~vzV,)k9Smog*S=2Vxnl":{"opcode":"event_whenkeypressed","next":"wC/mHJR,(y))HXD?`r]Y","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":-1439,"y":-586},"wC/mHJR,(y))HXD?`r]Y":{"opcode":"control_repeat","next":null,"parent":"~vzV,)k9Smog*S=2Vxnl","inputs":{"TIMES":[1,[6,"7"]],"SUBSTACK":[2,"RO$%71YtoH;`U(5Ow0sr"]},"fields":{},"shadow":false,"topLevel":false},"RO$%71YtoH;`U(5Ow0sr":{"opcode":"looks_switchcostumeto","next":"}Q`=g?o=6yi?Jz]/|4g{","parent":"wC/mHJR,(y))HXD?`r]Y","inputs":{"COSTUME":[1,"^yq!VUNAkeHHvfe$xbmQ"]},"fields":{},"shadow":false,"topLevel":false},"^yq!VUNAkeHHvfe$xbmQ":{"opcode":"looks_costume","next":null,"parent":"RO$%71YtoH;`U(5Ow0sr","inputs":{},"fields":{"COSTUME":["down",null]},"shadow":true,"topLevel":false},"}Q`=g?o=6yi?Jz]/|4g{":{"opcode":"control_wait","next":"|NWa,`~hMAAZse]zo}Kq","parent":"RO$%71YtoH;`U(5Ow0sr","inputs":{"DURATION":[1,[5,".6"]]},"fields":{},"shadow":false,"topLevel":false},"|NWa,`~hMAAZse]zo}Kq":{"opcode":"motion_movesteps","next":"x#U4xVOG?)DPyx)7Y~(r","parent":"}Q`=g?o=6yi?Jz]/|4g{","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"x#U4xVOG?)DPyx)7Y~(r":{"opcode":"looks_nextcostume","next":";QpVzrsk@Zk_{d}4I[kW","parent":"|NWa,`~hMAAZse]zo}Kq","inputs":{},"fields":{},"shadow":false,"topLevel":false},";QpVzrsk@Zk_{d}4I[kW":{"opcode":"control_wait","next":"h#G`QEI1CVFPW6iP*oo?","parent":"x#U4xVOG?)DPyx)7Y~(r","inputs":{"DURATION":[1,[5,".6"]]},"fields":{},"shadow":false,"topLevel":false},"h#G`QEI1CVFPW6iP*oo?":{"opcode":"motion_movesteps","next":"zCHOB*;ri@)7UZm6:^+T","parent":";QpVzrsk@Zk_{d}4I[kW","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"zCHOB*;ri@)7UZm6:^+T":{"opcode":"looks_nextcostume","next":"YPD_9gC5TvEmog2hb{Dv","parent":"h#G`QEI1CVFPW6iP*oo?","inputs":{},"fields":{},"shadow":false,"topLevel":false},"YPD_9gC5TvEmog2hb{Dv":{"opcode":"control_wait","next":"oYoK@Tr+-o=t[rnocZ*Q","parent":"zCHOB*;ri@)7UZm6:^+T","inputs":{"DURATION":[1,[5,".6"]]},"fields":{},"shadow":false,"topLevel":false},"oYoK@Tr+-o=t[rnocZ*Q":{"opcode":"motion_movesteps","next":null,"parent":"YPD_9gC5TvEmog2hb{Dv","inputs":{"STEPS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":2,"costumes":[{"assetId":"8fb24626392ea7d7ea291be86e455a87","name":"down","bitmapResolution":2,"md5ext":"8fb24626392ea7d7ea291be86e455a87.png","dataFormat":"png","rotationCenterX":470,"rotationCenterY":38},{"assetId":"5ef07742224cb206714eacc0b1a6f4a1","name":"middle","bitmapResolution":2,"md5ext":"5ef07742224cb206714eacc0b1a6f4a1.png","dataFormat":"png","rotationCenterX":470,"rotationCenterY":38},{"assetId":"416a83dcf33fab5c6a199d166738a97f","name":"up","bitmapResolution":2,"md5ext":"416a83dcf33fab5c6a199d166738a97f.png","dataFormat":"png","rotationCenterX":474,"rotationCenterY":38},{"assetId":"0379a7ff77676213e2e5b04adbf112ee","name":"cheer1","bitmapResolution":2,"md5ext":"0379a7ff77676213e2e5b04adbf112ee.png","dataFormat":"png","rotationCenterX":471,"rotationCenterY":38},{"assetId":"0fe20e56960b05a3000acb870655556d","name":"cheer2","bitmapResolution":2,"md5ext":"0fe20e56960b05a3000acb870655556d.png","dataFormat":"png","rotationCenterX":470,"rotationCenterY":38}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":104,"y":-43,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"flags","variables":{},"lists":{},"broadcasts":{},"blocks":{"Sc~32M@N)m;,^#R_`aSK":{"opcode":"event_whenflagclicked","next":"5qphS/+N)swh5kuR}ii1","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-1064,"y":-2361},"5qphS/+N)swh5kuR}ii1":{"opcode":"motion_gotoxy","next":"/8WJ}hHpXETjsV2A*[|G","parent":"Sc~32M@N)m;,^#R_`aSK","inputs":{"X":[1,[4,-2]],"Y":[1,[4,3]]},"fields":{},"shadow":false,"topLevel":false},"/8WJ}hHpXETjsV2A*[|G":{"opcode":"looks_switchcostumeto","next":"F~NIU+f.7qr*x~eQ+PpZ","parent":"5qphS/+N)swh5kuR}ii1","inputs":{"COSTUME":[1,"TP//JCgrUD]8R-M0Rdm-"]},"fields":{},"shadow":false,"topLevel":false},"TP//JCgrUD]8R-M0Rdm-":{"opcode":"looks_costume","next":null,"parent":"/8WJ}hHpXETjsV2A*[|G","inputs":{},"fields":{"COSTUME":["center"]},"shadow":true,"topLevel":false},"F~NIU+f.7qr*x~eQ+PpZ":{"opcode":"control_forever","next":null,"parent":"/8WJ}hHpXETjsV2A*[|G","inputs":{"SUBSTACK":[2,"J5Wbr[%[%YMJAgoO2BN-"]},"fields":{},"shadow":false,"topLevel":false},"J5Wbr[%[%YMJAgoO2BN-":{"opcode":"looks_nextcostume","next":"LQRSAf.0d2mv:eYbuaC)","parent":"F~NIU+f.7qr*x~eQ+PpZ","inputs":{},"fields":{},"shadow":false,"topLevel":false},"LQRSAf.0d2mv:eYbuaC)":{"opcode":"control_wait","next":null,"parent":"J5Wbr[%[%YMJAgoO2BN-","inputs":{"DURATION":[1,[5,1]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":2,"costumes":[{"assetId":"b1b2a43f5f87da9f5adf53eda1c886ba","name":"left","bitmapResolution":2,"md5ext":"b1b2a43f5f87da9f5adf53eda1c886ba.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"97de43aed81c81e3f3df1a4bcf21ff64","name":"center","bitmapResolution":2,"md5ext":"97de43aed81c81e3f3df1a4bcf21ff64.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"1c3bc9cc59d4178b7cde5e064d2557d6","name":"right","bitmapResolution":2,"md5ext":"1c3bc9cc59d4178b7cde5e064d2557d6.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"97de43aed81c81e3f3df1a4bcf21ff64","name":"center2","bitmapResolution":2,"md5ext":"97de43aed81c81e3f3df1a4bcf21ff64.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":-2,"y":3,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Fish","variables":{},"lists":{},"broadcasts":{},"blocks":{"ez!h95irNu^6pqSdAR;[":{"opcode":"event_whenflagclicked","next":"@_5[:En|ymE[nBlD$2p:","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-953,"y":-1170},"@_5[:En|ymE[nBlD$2p:":{"opcode":"motion_gotoxy","next":"^8DsG#kGCoEFy0ilnK[l","parent":"ez!h95irNu^6pqSdAR;[","inputs":{"X":[1,[4,"149"]],"Y":[1,[4,"-45"]]},"fields":{},"shadow":false,"topLevel":false},"^8DsG#kGCoEFy0ilnK[l":{"opcode":"looks_switchcostumeto","next":null,"parent":"@_5[:En|ymE[nBlD$2p:","inputs":{"COSTUME":[1,"UcfBrOE?mW,]0_Ljhy0g"]},"fields":{},"shadow":false,"topLevel":false},"UcfBrOE?mW,]0_Ljhy0g":{"opcode":"looks_costume","next":null,"parent":"^8DsG#kGCoEFy0ilnK[l","inputs":{},"fields":{"COSTUME":["fish1",null]},"shadow":true,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"0109d8d6c0f4f14efd79b91923bab2fa","name":"fish1","bitmapResolution":2,"md5ext":"0109d8d6c0f4f14efd79b91923bab2fa.png","dataFormat":"png","rotationCenterX":278,"rotationCenterY":330},{"assetId":"56c27e51403099cfab2aeb7f33ebcc9a","name":"fish2","bitmapResolution":2,"md5ext":"56c27e51403099cfab2aeb7f33ebcc9a.png","dataFormat":"png","rotationCenterX":357,"rotationCenterY":347},{"assetId":"a58a5ab92ed526cf6379ce86dfec4af9","name":"fish3","bitmapResolution":2,"md5ext":"a58a5ab92ed526cf6379ce86dfec4af9.png","dataFormat":"png","rotationCenterX":328,"rotationCenterY":309},{"assetId":"7bb9688c3518ddb08c0048266b1bfd2d","name":"fish4","bitmapResolution":2,"md5ext":"7bb9688c3518ddb08c0048266b1bfd2d.png","dataFormat":"png","rotationCenterX":278,"rotationCenterY":257}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":false,"x":149,"y":-45,"size":30,"direction":92.35553230387865,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190813192748","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"}}
},{}],29:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":4,"costumes":[{"assetId":"4953b97814c20b8a3dab049695d509c7","name":"073018DragonBoat_bg","bitmapResolution":2,"md5ext":"4953b97814c20b8a3dab049695d509c7.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"b9c928707e817780fe6e373ab7251e2b","name":"081018DragonBoat_bg","bitmapResolution":2,"md5ext":"b9c928707e817780fe6e373ab7251e2b.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"b3892fe075aa7a88b2c7e3aba4d4b790","name":"backdrop1","bitmapResolution":1,"md5ext":"b3892fe075aa7a88b2c7e3aba4d4b790.svg","dataFormat":"svg","rotationCenterX":255.964835,"rotationCenterY":146.36328125},{"assetId":"1d75c9a6202e2415391335f5fb495c99","name":"e79fd28fe8789ff55fd9b6220037ecf5_royalty-free-gym-floor-clip-art-vector-images-illustrations-_612-612","bitmapResolution":2,"md5ext":"1d75c9a6202e2415391335f5fb495c99.png","dataFormat":"png","rotationCenterX":306,"rotationCenterY":306},{"assetId":"6e3ef0083d5bce20e2c964363514c826","name":"Basketball 1","bitmapResolution":1,"md5ext":"6e3ef0083d5bce20e2c964363514c826.svg","dataFormat":"svg","rotationCenterX":364,"rotationCenterY":212}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Andie","variables":{},"lists":{},"broadcasts":{},"blocks":{"6}O]aJN^jh=FRZ4B%_Ck":{"opcode":"event_whenflagclicked","next":"S%{DxI8Q7NR(J:EQBX~q","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-1400,"y":-705},":pQz?p*Z/HkU!m^@k?b.":{"opcode":"looks_switchcostumeto","next":"N|+K}Y@sie[^.VR,-]]f","parent":"S%{DxI8Q7NR(J:EQBX~q","inputs":{"COSTUME":[1,"5geX;Qg:+ztVfv~/6TOR"]},"fields":{},"shadow":false,"topLevel":false},"5geX;Qg:+ztVfv~/6TOR":{"opcode":"looks_costume","next":null,"parent":":pQz?p*Z/HkU!m^@k?b.","inputs":{},"fields":{"COSTUME":["Andie1",null]},"shadow":true,"topLevel":false},"~vzV,)k9Smog*S=2Vxnl":{"opcode":"event_whenkeypressed","next":"RO$%71YtoH;`U(5Ow0sr","parent":null,"inputs":{},"fields":{"KEY_OPTION":["down arrow",null]},"shadow":false,"topLevel":true,"x":-1394,"y":-381},"RO$%71YtoH;`U(5Ow0sr":{"opcode":"looks_switchcostumeto","next":"wC/mHJR,(y))HXD?`r]Y","parent":"~vzV,)k9Smog*S=2Vxnl","inputs":{"COSTUME":[1,"^yq!VUNAkeHHvfe$xbmQ"]},"fields":{},"shadow":false,"topLevel":false},"^yq!VUNAkeHHvfe$xbmQ":{"opcode":"looks_costume","next":null,"parent":"RO$%71YtoH;`U(5Ow0sr","inputs":{},"fields":{"COSTUME":["Andie1",null]},"shadow":true,"topLevel":false},"wC/mHJR,(y))HXD?`r]Y":{"opcode":"control_repeat","next":null,"parent":"RO$%71YtoH;`U(5Ow0sr","inputs":{"TIMES":[1,[6,"20"]],"SUBSTACK":[2,"}Q`=g?o=6yi?Jz]/|4g{"]},"fields":{},"shadow":false,"topLevel":false},"}Q`=g?o=6yi?Jz]/|4g{":{"opcode":"control_wait","next":"x#U4xVOG?)DPyx)7Y~(r","parent":"wC/mHJR,(y))HXD?`r]Y","inputs":{"DURATION":[1,[5,".3"]]},"fields":{},"shadow":false,"topLevel":false},"x#U4xVOG?)DPyx)7Y~(r":{"opcode":"looks_nextcostume","next":null,"parent":"}Q`=g?o=6yi?Jz]/|4g{","inputs":{},"fields":{},"shadow":false,"topLevel":false},"{`iq@=gYKl2;GBWAK/*]":{"opcode":"looks_sayforsecs","next":null,"parent":"N|+K}Y@sie[^.VR,-]]f","inputs":{"MESSAGE":[1,[10,"Press the down arrow key to see us dribble."]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"N|+K}Y@sie[^.VR,-]]f":{"opcode":"looks_gotofrontback","next":"{`iq@=gYKl2;GBWAK/*]","parent":":pQz?p*Z/HkU!m^@k?b.","inputs":{},"fields":{"FRONT_BACK":["back",null]},"shadow":false,"topLevel":false},"S%{DxI8Q7NR(J:EQBX~q":{"opcode":"motion_gotoxy","next":":pQz?p*Z/HkU!m^@k?b.","parent":"6}O]aJN^jh=FRZ4B%_Ck","inputs":{"X":[1,[4,"131"]],"Y":[1,[4,"30"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"428d26cd7db0965f3cdc695f4bf7c187","name":"Andie1","bitmapResolution":1,"md5ext":"428d26cd7db0965f3cdc695f4bf7c187.svg","dataFormat":"svg","rotationCenterX":88.15144525307196,"rotationCenterY":81.55357252089803},{"assetId":"2c987528236f67bf8df4cefe21da0bd2","name":"Andie2","bitmapResolution":1,"md5ext":"2c987528236f67bf8df4cefe21da0bd2.svg","dataFormat":"svg","rotationCenterX":89.43607148025549,"rotationCenterY":64.15005150322513},{"assetId":"35297645747defb06da8fc1b43dd4366","name":"Andie3","bitmapResolution":1,"md5ext":"35297645747defb06da8fc1b43dd4366.svg","dataFormat":"svg","rotationCenterX":85.49156767224497,"rotationCenterY":64.15005493877038},{"assetId":"656df76d07ad799eb115dd96091005e0","name":"Andie4","bitmapResolution":1,"md5ext":"656df76d07ad799eb115dd96091005e0.svg","dataFormat":"svg","rotationCenterX":89.43607148025549,"rotationCenterY":64.15005150322513}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":131,"y":30,"size":80,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Jordyn","variables":{},"lists":{},"broadcasts":{},"blocks":{"FFR95}}V~GN]}7X5j;9K":{"opcode":"event_whenkeypressed","next":"RN6(fwI%ap{?|dYR4@sK","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":-1559,"y":-989},"RN6(fwI%ap{?|dYR4@sK":{"opcode":"control_repeat","next":"V-V:T9r%tgtP,,9F]Lb|","parent":"FFR95}}V~GN]}7X5j;9K","inputs":{"TIMES":[1,[6,"22"]],"SUBSTACK":[2,"y3A-jV0d+}7Ka#dor(mr"]},"fields":{},"shadow":false,"topLevel":false},"y3A-jV0d+}7Ka#dor(mr":{"opcode":"control_wait","next":"Mulix|]{S}[c)MYzRS[{","parent":"RN6(fwI%ap{?|dYR4@sK","inputs":{"DURATION":[1,[5,".15"]]},"fields":{},"shadow":false,"topLevel":false},"Mulix|]{S}[c)MYzRS[{":{"opcode":"looks_nextcostume","next":"FkBPY%cvJx6;4x%Nmzj)","parent":"y3A-jV0d+}7Ka#dor(mr","inputs":{},"fields":{},"shadow":false,"topLevel":false},"FkBPY%cvJx6;4x%Nmzj)":{"opcode":"motion_movesteps","next":null,"parent":"Mulix|]{S}[c)MYzRS[{","inputs":{"STEPS":[1,[4,"20"]]},"fields":{},"shadow":false,"topLevel":false},"V-V:T9r%tgtP,,9F]Lb|":{"opcode":"looks_switchcostumeto","next":null,"parent":"RN6(fwI%ap{?|dYR4@sK","inputs":{"COSTUME":[1,"GU@U^b|Z!g*swSK+:ZM%"]},"fields":{},"shadow":false,"topLevel":false},"GU@U^b|Z!g*swSK+:ZM%":{"opcode":"looks_costume","next":null,"parent":"V-V:T9r%tgtP,,9F]Lb|","inputs":{},"fields":{"COSTUME":["Jordyn1",null]},"shadow":true,"topLevel":false},"c+:6O#=EJUR.aX!#*%.M":{"opcode":"event_whenflagclicked","next":"{5ZSJ=*@5/!=NTcWjXa(","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-1579,"y":-1243},"{5ZSJ=*@5/!=NTcWjXa(":{"opcode":"motion_gotoxy","next":"tik2?JnJviBGw^rjm`1]","parent":"c+:6O#=EJUR.aX!#*%.M","inputs":{"X":[1,[4,"-200"]],"Y":[1,[4,"-40"]]},"fields":{},"shadow":false,"topLevel":false},"tik2?JnJviBGw^rjm`1]":{"opcode":"looks_switchcostumeto","next":null,"parent":"{5ZSJ=*@5/!=NTcWjXa(","inputs":{"COSTUME":[1,"c;;U)E!O()YxY;tE]I8L"]},"fields":{},"shadow":false,"topLevel":false},"c;;U)E!O()YxY;tE]I8L":{"opcode":"looks_costume","next":null,"parent":"tik2?JnJviBGw^rjm`1]","inputs":{},"fields":{"COSTUME":["Jordyn1",null]},"shadow":true,"topLevel":false},"?s;CncrOM,T4}DtB=vst":{"opcode":"event_whenkeypressed","next":"Z6Ks5#h9lz(7Qb_,-[-f","parent":null,"inputs":{},"fields":{"KEY_OPTION":["down arrow",null]},"shadow":false,"topLevel":true,"x":-1207,"y":-1233},"Z6Ks5#h9lz(7Qb_,-[-f":{"opcode":"control_repeat","next":"FcANosyL39HlORt?O8eS","parent":"?s;CncrOM,T4}DtB=vst","inputs":{"TIMES":[1,[6,"12"]],"SUBSTACK":[2,"f!pt@]c$J^U1[CS:C|e,"]},"fields":{},"shadow":false,"topLevel":false},"f!pt@]c$J^U1[CS:C|e,":{"opcode":"control_wait","next":"{OtG{Yv)zo!ia%}n]H95","parent":"Z6Ks5#h9lz(7Qb_,-[-f","inputs":{"DURATION":[1,[5,".3"]]},"fields":{},"shadow":false,"topLevel":false},"{OtG{Yv)zo!ia%}n]H95":{"opcode":"looks_nextcostume","next":null,"parent":"f!pt@]c$J^U1[CS:C|e,","inputs":{},"fields":{},"shadow":false,"topLevel":false},"FcANosyL39HlORt?O8eS":{"opcode":"looks_sayforsecs","next":null,"parent":"Z6Ks5#h9lz(7Qb_,-[-f","inputs":{"MESSAGE":[1,[10,"Press the space bar to watch Miguel and me dribble across the court!"]],"SECS":[1,[4,"4"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{"?g,x?Jb[1{AQl75%XcjG":{"blockId":".O#5Xx[CR_kMrHY[i|Dx","x":178,"y":-1048,"width":200,"height":200,"minimized":false,"text":"This longer code would prevent the standing dribble animation to overlap with the run/dribble animation"}},"currentCostume":0,"costumes":[{"assetId":"ec0c260d2321b33a7bcbffb93f1970d2","name":"Jordyn1","bitmapResolution":1,"md5ext":"ec0c260d2321b33a7bcbffb93f1970d2.svg","dataFormat":"svg","rotationCenterX":33.74546494910098,"rotationCenterY":62.69436263827484},{"assetId":"1b5edf25437124002136418e99d02dfe","name":"Jordyn2","bitmapResolution":1,"md5ext":"1b5edf25437124002136418e99d02dfe.svg","dataFormat":"svg","rotationCenterX":48.9517821174727,"rotationCenterY":62.694377914824486},{"assetId":"bf13eddeef9d2da3c0cfce155869eb88","name":"Jordyn3","bitmapResolution":1,"md5ext":"bf13eddeef9d2da3c0cfce155869eb88.svg","dataFormat":"svg","rotationCenterX":33.74546986498308,"rotationCenterY":62.69436527654966},{"assetId":"d710e71614edaf1d86e5f8c741fe3d1e","name":"Jordyn4","bitmapResolution":1,"md5ext":"d710e71614edaf1d86e5f8c741fe3d1e.svg","dataFormat":"svg","rotationCenterX":51.145432069474,"rotationCenterY":62.69435447870612}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":-200,"y":-40,"size":90,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Miguel","variables":{},"lists":{},"broadcasts":{},"blocks":{"4Z3i{QKZROpJnOe,b_DN":{"opcode":"event_whenflagclicked","next":"CWto!?+oXxrv`e~-;le[","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-2342,"y":-1454},"CWto!?+oXxrv`e~-;le[":{"opcode":"motion_gotoxy","next":"%q@JG_HRK|QtS~v/L0%h","parent":"4Z3i{QKZROpJnOe,b_DN","inputs":{"X":[1,[4,"-203"]],"Y":[1,[4,"-110"]]},"fields":{},"shadow":false,"topLevel":false},"%q@JG_HRK|QtS~v/L0%h":{"opcode":"looks_switchcostumeto","next":null,"parent":"CWto!?+oXxrv`e~-;le[","inputs":{"COSTUME":[1,"9cKXdQ14:c7[Ye~!`1/~"]},"fields":{},"shadow":false,"topLevel":false},"9cKXdQ14:c7[Ye~!`1/~":{"opcode":"looks_costume","next":null,"parent":"%q@JG_HRK|QtS~v/L0%h","inputs":{},"fields":{"COSTUME":["Miguel1",null]},"shadow":true,"topLevel":false},"[GqfrGN]^`tQ4q:Q3#JJ":{"opcode":"event_whenkeypressed","next":"QHe#Vkys)Rh+@UXqxB2{","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":-2347,"y":-1175},"QHe#Vkys)Rh+@UXqxB2{":{"opcode":"control_repeat","next":null,"parent":"[GqfrGN]^`tQ4q:Q3#JJ","inputs":{"TIMES":[1,[6,"8"]],"SUBSTACK":[2,"6tV]3_1VT=^NmAx%q!g4"]},"fields":{},"shadow":false,"topLevel":false},"6tV]3_1VT=^NmAx%q!g4":{"opcode":"control_wait","next":"Qk/o|;QFt+F4$=UuayAJ","parent":"QHe#Vkys)Rh+@UXqxB2{","inputs":{"DURATION":[1,[5,".2"]]},"fields":{},"shadow":false,"topLevel":false},"Qk/o|;QFt+F4$=UuayAJ":{"opcode":"looks_nextcostume","next":".DjF9o3KoHe=8Yd(7:LW","parent":"6tV]3_1VT=^NmAx%q!g4","inputs":{},"fields":{},"shadow":false,"topLevel":false},".DjF9o3KoHe=8Yd(7:LW":{"opcode":"motion_movesteps","next":null,"parent":"Qk/o|;QFt+F4$=UuayAJ","inputs":{"STEPS":[1,[4,"20"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{"K_1eCG@}Jr2SIUQs-r#h":{"blockId":null,"x":-1948.7407407407406,"y":-1317.9259259259259,"width":200,"height":200,"minimized":false,"text":"Build 1 script and modify a script..."},"6JV9Goq|XG$}U$mDQsYS":{"blockId":null,"x":-1952.481323521161,"y":-1102.7219852817411,"width":200,"height":200,"minimized":false,"text":"One will have Miguel dribble in place, when the down arrow key is pressed. Look at the script for Jordyn."},"w)]!x]e.9?/[4GH|+[O:":{"blockId":null,"x":-1957.481323521161,"y":-879.3301575353256,"width":200,"height":200,"minimized":false,"text":"The other will have Miguel dribble ALL the way across the basketball court when the space key is pressed. Look at Jordyn's script"}},"currentCostume":0,"costumes":[{"assetId":"8a00295a8d657ea087cc88010c3a844c","name":"Miguel1","bitmapResolution":1,"md5ext":"8a00295a8d657ea087cc88010c3a844c.svg","dataFormat":"svg","rotationCenterX":26.37499494910105,"rotationCenterY":62.69436185272684},{"assetId":"80e8002553b2cac9c3e4887a7583a65c","name":"Miguel2","bitmapResolution":1,"md5ext":"80e8002553b2cac9c3e4887a7583a65c.svg","dataFormat":"svg","rotationCenterX":49.74051742656934,"rotationCenterY":62.69436162506062},{"assetId":"5dba01afa32235f7f91a4132f3d448cd","name":"Miguel3","bitmapResolution":1,"md5ext":"5dba01afa32235f7f91a4132f3d448cd.svg","dataFormat":"svg","rotationCenterX":26.374997377707814,"rotationCenterY":62.69436159568707},{"assetId":"14904cc6bbad4a87b6f924707730dd0f","name":"Miguel4","bitmapResolution":1,"md5ext":"14904cc6bbad4a87b6f924707730dd0f.svg","dataFormat":"svg","rotationCenterX":50.926268599392586,"rotationCenterY":62.69436185272684}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":-203,"y":-110,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Referee","variables":{},"lists":{},"broadcasts":{},"blocks":{"Uw:zXlolx).J/|3Vv}.(":{"opcode":"event_whenflagclicked","next":"2`:.Ap!-R]l#bQyC^ho2","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":71,"y":55},"2`:.Ap!-R]l#bQyC^ho2":{"opcode":"motion_gotoxy","next":null,"parent":"Uw:zXlolx).J/|3Vv}.(","inputs":{"X":[1,[4,"-131"]],"Y":[1,[4,"44"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":3,"costumes":[{"assetId":"7eeca5313c2e7d455482badff3079f64","name":"referee-b","bitmapResolution":1,"md5ext":"7eeca5313c2e7d455482badff3079f64.svg","dataFormat":"svg","rotationCenterX":44,"rotationCenterY":63},{"assetId":"1cd641a48499db84636d983916b62a83","name":"referee-d","bitmapResolution":1,"md5ext":"1cd641a48499db84636d983916b62a83.svg","dataFormat":"svg","rotationCenterX":50,"rotationCenterY":63},{"assetId":"5948c4160089fcc0975a867221ff2256","name":"referee-c","bitmapResolution":1,"md5ext":"5948c4160089fcc0975a867221ff2256.svg","dataFormat":"svg","rotationCenterX":55,"rotationCenterY":62},{"assetId":"46dde2baba61a7e48463ae8e58441470","name":"referee-a","bitmapResolution":1,"md5ext":"46dde2baba61a7e48463ae8e58441470.svg","dataFormat":"svg","rotationCenterX":44,"rotationCenterY":63}],"sounds":[{"assetId":"8468b9b3f11a665ee4d215afd8463b97","name":"referee whistle","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":14225,"md5ext":"8468b9b3f11a665ee4d215afd8463b97.wav"}],"volume":100,"layerOrder":2,"visible":false,"x":-131.00000000000003,"y":44,"size":80,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190822194548","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"}}
},{}],30:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{"`jEk@4|i[#Fk?(8x)AV.-my variable":["my variable",0]},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"6579c565f60733c4d4b6bfa84dcb2ffa","name":"backdrop3","bitmapResolution":2,"md5ext":"6579c565f60733c4d4b6bfa84dcb2ffa.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":null},{"isStage":false,"name":"Ninja Cat","variables":{},"lists":{},"broadcasts":{},"blocks":{"|etjt+q79~RJiBzX6}^e":{"opcode":"event_whenflagclicked","next":"tE;G95v,1|}a4mmB7}A)","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":7,"y":205},"tE;G95v,1|}a4mmB7}A)":{"opcode":"motion_gotoxy","next":"0og]NcATQdOy/U@IY^E*","parent":"|etjt+q79~RJiBzX6}^e","inputs":{"X":[1,[4,"-189"]],"Y":[1,[4,"-43"]]},"fields":{},"shadow":false,"topLevel":false},"0og]NcATQdOy/U@IY^E*":{"opcode":"looks_sayforsecs","next":"(q!*oSyO?PG-bfs5=;BM","parent":"tE;G95v,1|}a4mmB7}A)","inputs":{"MESSAGE":[1,[10,"Help me reach the gem!"]],"SECS":[1,[4,"5"]]},"fields":{},"shadow":false,"topLevel":false},"(q!*oSyO?PG-bfs5=;BM":{"opcode":"control_repeat_until","next":null,"parent":"0og]NcATQdOy/U@IY^E*","inputs":{"CONDITION":[2,"o.iU%bahu);Xt,2%/G%|"],"SUBSTACK":[2,"cxWFIP6b~(|7UneIBU7b"]},"fields":{},"shadow":false,"topLevel":false},"-fiMoRkw6qWeIhleb:KF":{"opcode":"sensing_touchingcolor","next":null,"parent":null,"inputs":{"COLOR":[1,[9,"#337f6e"]]},"fields":{},"shadow":false,"topLevel":true,"x":455,"y":427},"cxWFIP6b~(|7UneIBU7b":{"opcode":"motion_movesteps","next":"06`-+_|52.|#S{D`ry^s","parent":"(q!*oSyO?PG-bfs5=;BM","inputs":{"STEPS":[1,[4,"5"]]},"fields":{},"shadow":false,"topLevel":false},"06`-+_|52.|#S{D`ry^s":{"opcode":"looks_nextcostume","next":"LCdrJz0P~{cA~)_bv4ix","parent":"cxWFIP6b~(|7UneIBU7b","inputs":{},"fields":{},"shadow":false,"topLevel":false},"LCdrJz0P~{cA~)_bv4ix":{"opcode":"control_wait","next":null,"parent":"06`-+_|52.|#S{D`ry^s","inputs":{"DURATION":[1,[5,".1"]]},"fields":{},"shadow":false,"topLevel":false},"YwhEuJhA+!.A`{Gg`/[Y":{"opcode":"sensing_touchingobject","next":null,"parent":null,"inputs":{"TOUCHINGOBJECTMENU":[1,"L}|yA:ge@8N3I;V]@bNi"]},"fields":{},"shadow":false,"topLevel":true,"x":457,"y":341},"L}|yA:ge@8N3I;V]@bNi":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":"YwhEuJhA+!.A`{Gg`/[Y","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["Gem",null]},"shadow":true,"topLevel":false},"o.iU%bahu);Xt,2%/G%|":{"opcode":"sensing_touchingobject","next":null,"parent":"(q!*oSyO?PG-bfs5=;BM","inputs":{"TOUCHINGOBJECTMENU":[1,"{:X)27L[p8uEpJO(-%MI"]},"fields":{},"shadow":false,"topLevel":false},"{:X)27L[p8uEpJO(-%MI":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":"o.iU%bahu);Xt,2%/G%|","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["Bee",null]},"shadow":true,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"d96aa54542a76f2a0dab1f974257faec","name":"costume2","bitmapResolution":1,"md5ext":"d96aa54542a76f2a0dab1f974257faec.svg","dataFormat":"svg","rotationCenterX":42.399999999999864,"rotationCenterY":55.375},{"assetId":"ad0bfbf4f9c7f4c41220044e058f4fde","name":"costume1","bitmapResolution":1,"md5ext":"ad0bfbf4f9c7f4c41220044e058f4fde.svg","dataFormat":"svg","rotationCenterX":41.863566856754716,"rotationCenterY":54.46991940038589}],"sounds":[{"assetId":"83c36d806dc92327b9e7049a565c6bff","name":"Meow","dataFormat":"wav","format":"","rate":44100,"sampleCount":37376,"md5ext":"83c36d806dc92327b9e7049a565c6bff.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":-19.024425943795386,"y":-45.881705096581854,"size":100,"direction":90.97127910616189,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Gem","variables":{},"lists":{},"broadcasts":{},"blocks":{"1BtqzcG0(#T0/$Pb0n5I":{"opcode":"event_whenflagclicked","next":"al[eLo~-(_2GmOMw*(2T","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-13,"y":177},"al[eLo~-(_2GmOMw*(2T":{"opcode":"motion_gotoxy","next":null,"parent":"1BtqzcG0(#T0/$Pb0n5I","inputs":{"X":[1,[4,"185"]],"Y":[1,[4,"-40"]]},"fields":{},"shadow":false,"topLevel":false},"!-R!cTxqq#1SsX}H76)V":{"opcode":"event_whenkeypressed","next":"|dI~VFgaZ_-B}Er{-=D:","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":427,"y":202},"|dI~VFgaZ_-B}Er{-=D:":{"opcode":"motion_movesteps","next":null,"parent":"!-R!cTxqq#1SsX}H76)V","inputs":{"STEPS":[1,[4,"30"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"b411e48862aa61ce892721e258f19240","name":"Gem_Red","bitmapResolution":2,"md5ext":"b411e48862aa61ce892721e258f19240.png","dataFormat":"png","rotationCenterX":53,"rotationCenterY":47}],"sounds":[],"volume":100,"layerOrder":1,"visible":true,"x":215,"y":-40,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Bee","variables":{},"lists":{},"broadcasts":{},"blocks":{"[SGBumU#}c=?46fEWQUF":{"opcode":"event_whenthisspriteclicked","next":"xbZNiPJHW=N%a#2f}AsS","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":204,"y":163},"xbZNiPJHW=N%a#2f}AsS":{"opcode":"looks_sayforsecs","next":null,"parent":"[SGBumU#}c=?46fEWQUF","inputs":{"MESSAGE":[1,[10,"Hello!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"7955018306bb03b5444bed8306569041","name":"bee","bitmapResolution":2,"md5ext":"7955018306bb03b5444bed8306569041.png","dataFormat":"png","rotationCenterX":48,"rotationCenterY":34}],"sounds":[],"volume":100,"layerOrder":2,"visible":true,"x":13.999999999999993,"y":-10.000000000000014,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190904154449","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}}
},{}],31:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"bd72cb5f3bded42480516a718001b528","name":"Sambadrome","bitmapResolution":1,"md5ext":"bd72cb5f3bded42480516a718001b528.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Butterfly","variables":{},"lists":{},"broadcasts":{},"blocks":{"?3Zl.6nOK{[BWe^7a5{B":{"opcode":"event_whenflagclicked","next":"+Cfb89be^mtRZV7]^7*?","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-483,"y":-531},"+Cfb89be^mtRZV7]^7*?":{"opcode":"motion_gotoxy","next":"oUQPz4^X*Pf3SaNm.|%o","parent":"?3Zl.6nOK{[BWe^7a5{B","inputs":{"X":[1,[4,"-325"]],"Y":[1,[4,-65]]},"fields":{},"shadow":false,"topLevel":false},"/(%U[W6DY.cdTnp,78:O":{"opcode":"control_repeat_until","next":null,"parent":"oUQPz4^X*Pf3SaNm.|%o","inputs":{"CONDITION":[2,"N^bw~_OboaqS;e/oA5;["],"SUBSTACK":[2,"ZY6yg~jw,+5zy^(_?Cqw"]},"fields":{},"shadow":false,"topLevel":false},"N^bw~_OboaqS;e/oA5;[":{"opcode":"sensing_touchingobject","next":null,"parent":"/(%U[W6DY.cdTnp,78:O","inputs":{"TOUCHINGOBJECTMENU":[1,"bVZa^Cr6s}-L+{PzN;D?"]},"fields":{},"shadow":false,"topLevel":false},"bVZa^Cr6s}-L+{PzN;D?":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":"N^bw~_OboaqS;e/oA5;[","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["King Momo"]},"shadow":true,"topLevel":false},"ZY6yg~jw,+5zy^(_?Cqw":{"opcode":"motion_movesteps","next":",T!=6NSo1Z.0]:-+dZNR","parent":"/(%U[W6DY.cdTnp,78:O","inputs":{"STEPS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"~(EB0p9Iqeo{}{;fTUW:":{"opcode":"sensing_touchingcolor","next":null,"parent":null,"inputs":{"COLOR":[1,[9,"#e64e3e"]]},"fields":{},"shadow":false,"topLevel":true,"x":-140,"y":-508,"comment":"k)L~z*+b|rNaAP57;rUd"},"oUQPz4^X*Pf3SaNm.|%o":{"opcode":"control_wait","next":"/(%U[W6DY.cdTnp,78:O","parent":"+Cfb89be^mtRZV7]^7*?","inputs":{"DURATION":[1,[5,"1"]]},"fields":{},"shadow":false,"topLevel":false},",T!=6NSo1Z.0]:-+dZNR":{"opcode":"control_wait","next":null,"parent":"ZY6yg~jw,+5zy^(_?Cqw","inputs":{"DURATION":[1,[5,".1"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{"k)L~z*+b|rNaAP57;rUd":{"blockId":"~(EB0p9Iqeo{}{;fTUW:","x":236.70706958089977,"y":-558.9639699541087,"width":200,"height":200,"minimized":false,"text":"Use this block instead of the touching \"King Momo\" or \"Stop Sign\" block to have the float stop at one of the color lines on the street."}},"currentCostume":0,"costumes":[{"assetId":"15a80dcb99ac6bef9a4fd2934aa78d8c","name":"Butterfly Float","bitmapResolution":1,"md5ext":"15a80dcb99ac6bef9a4fd2934aa78d8c.svg","dataFormat":"svg","rotationCenterX":65,"rotationCenterY":100},{"assetId":"024464c850fe008b3e5396d88551643c","name":"Foosball Float","bitmapResolution":1,"md5ext":"024464c850fe008b3e5396d88551643c.svg","dataFormat":"svg","rotationCenterX":127.06507873535156,"rotationCenterY":53.921165466308594},{"assetId":"13a3c3af1928ac189e0d0110ea53f23d","name":"Eagle Float","bitmapResolution":1,"md5ext":"13a3c3af1928ac189e0d0110ea53f23d.svg","dataFormat":"svg","rotationCenterX":65,"rotationCenterY":97.91893005371094},{"assetId":"e45952b060ab2f647e22b9aea178e517","name":"Rio de Janeiro Float","bitmapResolution":1,"md5ext":"e45952b060ab2f647e22b9aea178e517.svg","dataFormat":"svg","rotationCenterX":85.998291015625,"rotationCenterY":89.5671157836914}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":118,"y":-65,"size":100,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Toucan","variables":{},"lists":{},"broadcasts":{},"blocks":{"H:Xg0b8eLJGUFImS2XEz":{"opcode":"event_whenflagclicked","next":"{[+Bm@*U6u34j+LAHBaJ","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-452,"y":-524},"{[+Bm@*U6u34j+LAHBaJ":{"opcode":"motion_gotoxy","next":"N8=B3J]u%dz!tW,W9p?~","parent":"H:Xg0b8eLJGUFImS2XEz","inputs":{"X":[1,[4,"-300"]],"Y":[1,[4,-100]]},"fields":{},"shadow":false,"topLevel":false},"j:^NE1OmeFqVs0D3m,u@":{"opcode":"control_repeat_until","next":null,"parent":"N8=B3J]u%dz!tW,W9p?~","inputs":{"CONDITION":[2,"NhrN2N2B+q9P4VwsFrdN"],"SUBSTACK":[2,"_TwkKO(Og;|o1$X)fL9o"]},"fields":{},"shadow":false,"topLevel":false},"NhrN2N2B+q9P4VwsFrdN":{"opcode":"sensing_touchingcolor","next":null,"parent":"j:^NE1OmeFqVs0D3m,u@","inputs":{"COLOR":[1,[9,"#e64e3e"]]},"fields":{},"shadow":false,"topLevel":false},"_TwkKO(Og;|o1$X)fL9o":{"opcode":"motion_movesteps","next":"CF]M}%#3Adrz#EBd5;jW","parent":"j:^NE1OmeFqVs0D3m,u@","inputs":{"STEPS":[1,[4,"1"]]},"fields":{},"shadow":false,"topLevel":false},"N8=B3J]u%dz!tW,W9p?~":{"opcode":"control_wait","next":"j:^NE1OmeFqVs0D3m,u@","parent":"{[+Bm@*U6u34j+LAHBaJ","inputs":{"DURATION":[1,[5,"1"]]},"fields":{},"shadow":false,"topLevel":false},"CF]M}%#3Adrz#EBd5;jW":{"opcode":"control_wait","next":null,"parent":"_TwkKO(Og;|o1$X)fL9o","inputs":{"DURATION":[1,[5,".1"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"358389ede568bd95a5d6fcd80eb2119e","name":"Toucan Float","bitmapResolution":1,"md5ext":"358389ede568bd95a5d6fcd80eb2119e.svg","dataFormat":"svg","rotationCenterX":135,"rotationCenterY":65}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":-96,"y":-100,"size":100,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"King Momo","variables":{},"lists":{},"broadcasts":{},"blocks":{"`J;(Yr!NHe]WM]r[Kj*z":{"opcode":"event_whenthisspriteclicked","next":"l*zItNS.eFtvx|R@:pP-","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":10,"y":-486},"l*zItNS.eFtvx|R@:pP-":{"opcode":"looks_sayforsecs","next":"h4=*nG}?2Pc(kgBJWJ(-","parent":"`J;(Yr!NHe]WM]r[Kj*z","inputs":{"MESSAGE":[1,[10,"Welcome to Rio de Janeiro! Welcome to Carnival!"]],"SECS":[1,[4,"6"]]},"fields":{},"shadow":false,"topLevel":false},"h4=*nG}?2Pc(kgBJWJ(-":{"opcode":"looks_sayforsecs","next":"/R}YB*tU*u6mQ1eBRJ/x","parent":"l*zItNS.eFtvx|R@:pP-","inputs":{"MESSAGE":[1,[10,"For a few days of each year, Carnival transforms the streets of Rio into a festival of music and parades."]],"SECS":[1,[4,"10"]]},"fields":{},"shadow":false,"topLevel":false},"/R}YB*tU*u6mQ1eBRJ/x":{"opcode":"looks_sayforsecs","next":"~@FQV3dKt?uB(t#xrYS`","parent":"h4=*nG}?2Pc(kgBJWJ(-","inputs":{"MESSAGE":[1,[10,"I am this year's King Momo, the leader of the celebrations!"]],"SECS":[1,[4,"8"]]},"fields":{},"shadow":false,"topLevel":false},"~@FQV3dKt?uB(t#xrYS`":{"opcode":"looks_sayforsecs","next":"HP##IfnbgaQ9V0|BCKCy","parent":"/R}YB*tU*u6mQ1eBRJ/x","inputs":{"MESSAGE":[1,[10,"Every year, a different Momo is chosen to get the parades and dances of Carnival started."]],"SECS":[1,[4,"8"]]},"fields":{},"shadow":false,"topLevel":false},"HP##IfnbgaQ9V0|BCKCy":{"opcode":"looks_sayforsecs","next":"5wPxwkyx-{){MN^Xk9OX","parent":"~@FQV3dKt?uB(t#xrYS`","inputs":{"MESSAGE":[1,[10,"Right now, we're lining up the parade floats in the right order for our big entrance."]],"SECS":[1,[4,"8"]]},"fields":{},"shadow":false,"topLevel":false},"5wPxwkyx-{){MN^Xk9OX":{"opcode":"looks_sayforsecs","next":null,"parent":"HP##IfnbgaQ9V0|BCKCy","inputs":{"MESSAGE":[1,[10,"Now let the celebrations begin!"]],"SECS":[1,[4,"4"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"c6f00b3573465cc1f2a9bf9aad924709","name":"King Momo","bitmapResolution":1,"md5ext":"c6f00b3573465cc1f2a9bf9aad924709.svg","dataFormat":"svg","rotationCenterX":30,"rotationCenterY":35}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":true,"x":204,"y":-130,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Stop Sign","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"21d9b38330c08514704103d67968951e","name":"Stop Sign","bitmapResolution":1,"md5ext":"21d9b38330c08514704103d67968951e.svg","dataFormat":"svg","rotationCenterX":25,"rotationCenterY":50}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":217,"y":-74,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190904154449","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}}
},{}],32:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"234e03560170e77d1cc9e8aa40eb80d7","name":"Lincoln Park Zoo","bitmapResolution":2,"md5ext":"234e03560170e77d1cc9e8aa40eb80d7.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Car","variables":{},"lists":{},"broadcasts":{},"blocks":{",b,MB{-tz,CPMdx6uPSI":{"opcode":"event_whenflagclicked","next":"PjfkJWvwcXuiXl4iYCYe","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":21,"y":30},"PjfkJWvwcXuiXl4iYCYe":{"opcode":"motion_gotoxy","next":"G#U%Yd+G]Rnzbke8IBq,","parent":",b,MB{-tz,CPMdx6uPSI","inputs":{"X":[1,[4,-304]],"Y":[1,[4,-118]]},"fields":{},"shadow":false,"topLevel":false},"G#U%Yd+G]Rnzbke8IBq,":{"opcode":"control_repeat_until","next":null,"parent":"PjfkJWvwcXuiXl4iYCYe","inputs":{"CONDITION":[2,"7!dxCwjGz5XkG%.T^7uR"],"SUBSTACK":[2,"{t,HO=FEj-72!S_B1kj8"]},"fields":{},"shadow":false,"topLevel":false},"7!dxCwjGz5XkG%.T^7uR":{"opcode":"sensing_touchingobject","next":null,"parent":"G#U%Yd+G]Rnzbke8IBq,","inputs":{"TOUCHINGOBJECTMENU":[1,"zs9|Qt-p|v-Vfk{3/|}}"]},"fields":{},"shadow":false,"topLevel":false},"zs9|Qt-p|v-Vfk{3/|}}":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":"7!dxCwjGz5XkG%.T^7uR","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["Stop"]},"shadow":true,"topLevel":false},"{t,HO=FEj-72!S_B1kj8":{"opcode":"motion_movesteps","next":"A87.jAop_(6WuREWEFaR","parent":"G#U%Yd+G]Rnzbke8IBq,","inputs":{"STEPS":[1,[4,10]]},"fields":{},"shadow":false,"topLevel":false},"A87.jAop_(6WuREWEFaR":{"opcode":"control_wait","next":null,"parent":"{t,HO=FEj-72!S_B1kj8","inputs":{"DURATION":[1,[5,0.1]]},"fields":{},"shadow":false,"topLevel":false},"p.DF;UyeX~O?;Fa3lY8t":{"opcode":"sensing_touchingcolor","next":null,"parent":null,"inputs":{"COLOR":[1,[9,"#a42cff"]]},"fields":{},"shadow":false,"topLevel":true,"x":379,"y":143}},"comments":{"7T?P)4;Rd*r`ZA]E-#Cd":{"blockId":null,"x":597,"y":204.60000000000002,"width":231,"height":233.20000000000002,"minimized":false,"text":"Use this block, instead of the touching stop block, to have the car stop at one of the lines on the street."}},"currentCostume":2,"costumes":[{"assetId":"411a94a9e26a243dcde0022835361f8e","name":"SUV","bitmapResolution":1,"md5ext":"411a94a9e26a243dcde0022835361f8e.svg","dataFormat":"svg","rotationCenterX":225,"rotationCenterY":106},{"assetId":"ce4f296c7b3d84fb9856b53594d5b142","name":"Cooper","bitmapResolution":1,"md5ext":"ce4f296c7b3d84fb9856b53594d5b142.svg","dataFormat":"svg","rotationCenterX":222,"rotationCenterY":120},{"assetId":"fd4ccc5303ec2fe6c48656639bddc2c5","name":"Sedan","bitmapResolution":1,"md5ext":"fd4ccc5303ec2fe6c48656639bddc2c5.svg","dataFormat":"svg","rotationCenterX":223,"rotationCenterY":75},{"assetId":"4571b4541799b45c93282a7c6ff397cb","name":"Bug","bitmapResolution":1,"md5ext":"4571b4541799b45c93282a7c6ff397cb.svg","dataFormat":"svg","rotationCenterX":221,"rotationCenterY":83}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":46,"y":-118,"size":75,"direction":90,"draggable":false,"rotationStyle":"left-right"},{"isStage":false,"name":"Stop","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"fdc509ac5555a3290d253f03e9fa2e32","name":"Stop Sign","bitmapResolution":1,"md5ext":"fdc509ac5555a3290d253f03e9fa2e32.svg","dataFormat":"svg","rotationCenterX":-39,"rotationCenterY":5}],"sounds":[],"volume":100,"layerOrder":3,"visible":true,"x":134,"y":4,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Darian","variables":{},"lists":{},"broadcasts":{},"blocks":{"eczJ*.rhXdIlS29#1ozS":{"opcode":"event_whenflagclicked","next":"26oEd1S]izX-dGAQ9WfC","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":38,"y":44},"26oEd1S]izX-dGAQ9WfC":{"opcode":"motion_gotoxy","next":null,"parent":"eczJ*.rhXdIlS29#1ozS","inputs":{"X":[1,[4,-105]],"Y":[1,[4,-86]]},"fields":{},"shadow":false,"topLevel":false},"*1Lq8[3RB-Gj)C]3cpt7":{"opcode":"event_whenkeypressed","next":"L|!P#V6xL|HSXnO%B,(A","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space"]},"shadow":false,"topLevel":true,"x":45,"y":266},"L|!P#V6xL|HSXnO%B,(A":{"opcode":"motion_movesteps","next":null,"parent":"*1Lq8[3RB-Gj)C]3cpt7","inputs":{"STEPS":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"810e9e425ba07fa15b1e4536de573b4c","name":"dm stance","bitmapResolution":1,"md5ext":"810e9e425ba07fa15b1e4536de573b4c.svg","dataFormat":"svg","rotationCenterX":55,"rotationCenterY":119},{"assetId":"cbf035d39d0a0bb070d2eb998cebd60d","name":"dm top stand","bitmapResolution":2,"md5ext":"cbf035d39d0a0bb070d2eb998cebd60d.png","dataFormat":"png","rotationCenterX":82,"rotationCenterY":244},{"assetId":"fcb8c2b6cf9b7e6ce9df521b2486deb3","name":"dm top R leg","bitmapResolution":2,"md5ext":"fcb8c2b6cf9b7e6ce9df521b2486deb3.png","dataFormat":"png","rotationCenterX":218,"rotationCenterY":232},{"assetId":"fd8bb9665fe078d2d95dbc35bccf4046","name":"dm top L leg","bitmapResolution":2,"md5ext":"fd8bb9665fe078d2d95dbc35bccf4046.png","dataFormat":"png","rotationCenterX":230,"rotationCenterY":240},{"assetId":"31e687f186b19ea120cd5cfc9dea2a3f","name":"dm freeze","bitmapResolution":2,"md5ext":"31e687f186b19ea120cd5cfc9dea2a3f.png","dataFormat":"png","rotationCenterX":220,"rotationCenterY":234},{"assetId":"0b2fb609d6d10decfdd5a1c3b58369b4","name":"dm pop front","bitmapResolution":2,"md5ext":"0b2fb609d6d10decfdd5a1c3b58369b4.png","dataFormat":"png","rotationCenterX":92,"rotationCenterY":234},{"assetId":"3b65ce3551f9c111794f7f1fb8f325be","name":"dm pop down","bitmapResolution":2,"md5ext":"3b65ce3551f9c111794f7f1fb8f325be.png","dataFormat":"png","rotationCenterX":64,"rotationCenterY":74},{"assetId":"f636510e8ef231d7c0e72a572ce91c99","name":"dm pop left","bitmapResolution":2,"md5ext":"f636510e8ef231d7c0e72a572ce91c99.png","dataFormat":"png","rotationCenterX":204,"rotationCenterY":250},{"assetId":"36b32430e45e071071052ef33c637f48","name":"dm pop right","bitmapResolution":2,"md5ext":"36b32430e45e071071052ef33c637f48.png","dataFormat":"png","rotationCenterX":78,"rotationCenterY":238},{"assetId":"426e1520efc34fef45be0596fd5f7120","name":"dm pop L arm","bitmapResolution":2,"md5ext":"426e1520efc34fef45be0596fd5f7120.png","dataFormat":"png","rotationCenterX":90,"rotationCenterY":238},{"assetId":"370cc57b40f1f1d6e52d6330b73d207f","name":"dm pop stand","bitmapResolution":2,"md5ext":"370cc57b40f1f1d6e52d6330b73d207f.png","dataFormat":"png","rotationCenterX":100,"rotationCenterY":244},{"assetId":"56fe91d2cf3ecb9d1b94006aee9eff79","name":"dm pop R arm","bitmapResolution":2,"md5ext":"56fe91d2cf3ecb9d1b94006aee9eff79.png","dataFormat":"png","rotationCenterX":80,"rotationCenterY":240},{"assetId":"fcb8c2b6cf9b7e6ce9df521b2486deb3","name":"dm top R leg2","bitmapResolution":2,"md5ext":"fcb8c2b6cf9b7e6ce9df521b2486deb3.png","dataFormat":"png","rotationCenterX":218,"rotationCenterY":232}],"sounds":[{"assetId":"0edb8fb88af19e6e17d0f8cf64c1d136","name":"dance celebrate","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":176785,"md5ext":"0edb8fb88af19e6e17d0f8cf64c1d136.wav"}],"volume":100,"layerOrder":2,"visible":true,"x":-105,"y":-86,"size":40.000000000000014,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Libby","variables":{},"lists":{},"broadcasts":{},"blocks":{"a1O~Zmdj}W!Z91feosSZ":{"opcode":"event_whenthisspriteclicked","next":"[{Ip)|.l@A@MmymOVnkn","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":62,"y":90},"[{Ip)|.l@A@MmymOVnkn":{"opcode":"looks_sayforsecs","next":null,"parent":"a1O~Zmdj}W!Z91feosSZ","inputs":{"MESSAGE":[1,[10,"Oh, hi!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"008b80a80c4188acc72f7893fb10ac75","name":"lb stance","bitmapResolution":2,"md5ext":"008b80a80c4188acc72f7893fb10ac75.png","dataFormat":"png","rotationCenterX":54,"rotationCenterY":244},{"assetId":"dfe3628ddf46a67dcc21c63be65a8e40","name":"lb top stand","bitmapResolution":2,"md5ext":"dfe3628ddf46a67dcc21c63be65a8e40.png","dataFormat":"png","rotationCenterX":70,"rotationCenterY":248},{"assetId":"e824768a109691b5a3c577d3506ed70c","name":"lb top R leg","bitmapResolution":2,"md5ext":"e824768a109691b5a3c577d3506ed70c.png","dataFormat":"png","rotationCenterX":244,"rotationCenterY":250},{"assetId":"350472368e2310efe6fa734b79f0ff41","name":"lb top L leg","bitmapResolution":2,"md5ext":"350472368e2310efe6fa734b79f0ff41.png","dataFormat":"png","rotationCenterX":234,"rotationCenterY":286},{"assetId":"5a151c4d4e2e2f870d9096d5fce6ed48","name":"lb top L cross","bitmapResolution":2,"md5ext":"5a151c4d4e2e2f870d9096d5fce6ed48.png","dataFormat":"png","rotationCenterX":148,"rotationCenterY":258},{"assetId":"99acf468000c6fcbaf344e4531725efc","name":"lb top R cross","bitmapResolution":2,"md5ext":"99acf468000c6fcbaf344e4531725efc.png","dataFormat":"png","rotationCenterX":174,"rotationCenterY":256},{"assetId":"e34a166807a3ffbf8d147b12aa49dd19","name":"lb pop front","bitmapResolution":2,"md5ext":"e34a166807a3ffbf8d147b12aa49dd19.png","dataFormat":"png","rotationCenterX":66,"rotationCenterY":272},{"assetId":"8e41de92cb932a6898782a39a0d7d300","name":"lb pop down","bitmapResolution":2,"md5ext":"8e41de92cb932a6898782a39a0d7d300.png","dataFormat":"png","rotationCenterX":56,"rotationCenterY":90},{"assetId":"ff1b96d1047d4be459a4614ce7c7c94c","name":"lb pop left","bitmapResolution":2,"md5ext":"ff1b96d1047d4be459a4614ce7c7c94c.png","dataFormat":"png","rotationCenterX":198,"rotationCenterY":266},{"assetId":"d6d5534c628ac5d5fe3cbf1b76b71252","name":"lb pop right","bitmapResolution":2,"md5ext":"d6d5534c628ac5d5fe3cbf1b76b71252.png","dataFormat":"png","rotationCenterX":76,"rotationCenterY":264},{"assetId":"c1fd31607619b8c98a286a650f248511","name":"lb pop L arm","bitmapResolution":2,"md5ext":"c1fd31607619b8c98a286a650f248511.png","dataFormat":"png","rotationCenterX":100,"rotationCenterY":262},{"assetId":"51fe5962fe4d2af7f6fad7abaa692069","name":"lb pop stand","bitmapResolution":2,"md5ext":"51fe5962fe4d2af7f6fad7abaa692069.png","dataFormat":"png","rotationCenterX":66,"rotationCenterY":268},{"assetId":"aa57575fde5ff8b13041e3a7b1499fe0","name":"lb pop R arm","bitmapResolution":2,"md5ext":"aa57575fde5ff8b13041e3a7b1499fe0.png","dataFormat":"png","rotationCenterX":78,"rotationCenterY":258}],"sounds":[{"assetId":"0edb8fb88af19e6e17d0f8cf64c1d136","name":"dance celebrate","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":176785,"md5ext":"0edb8fb88af19e6e17d0f8cf64c1d136.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":100,"y":-87,"size":40.000000000000014,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190904154449","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}}
},{}],33:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {
                "`jEk@4|i[#Fk?(8x)AV.-my variable": [
                    "my variable",
                    0
                ]
            },
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "a19648192ac39ed57e0e3835745dc370",
                    "name": "backdrop2",
                    "bitmapResolution": 1,
                    "md5ext": "a19648192ac39ed57e0e3835745dc370.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 245.151245,
                    "rotationCenterY": 235.946635
                },
                {
                    "assetId": "9b44b53e66aa74487097c1c0b6d24e4c",
                    "name": "backdrop3",
                    "bitmapResolution": 2,
                    "md5ext": "9b44b53e66aa74487097c1c0b6d24e4c.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "on",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Player",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "??Y2sHF$rPk*x{wRV4uz": {
                    "opcode": "event_whenflagclicked",
                    "next": "MIqc5O97Sb)Xq%?nrMFY",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 13,
                    "y": 196
                },
                "MIqc5O97Sb)Xq%?nrMFY": {
                    "opcode": "motion_gotoxy",
                    "next": "Bz1FJY1{9(0Xxx9mSW$o",
                    "parent": "??Y2sHF$rPk*x{wRV4uz",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-219"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-110"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Bz1FJY1{9(0Xxx9mSW$o": {
                    "opcode": "looks_switchcostumeto",
                    "next": null,
                    "parent": "MIqc5O97Sb)Xq%?nrMFY",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "d$L_?]Ne@wC}k9`~=wf#"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "d$L_?]Ne@wC}k9`~=wf#": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "Bz1FJY1{9(0Xxx9mSW$o",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "costume1",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 4,
            "costumes": [
                {
                    "assetId": "029a5ed327a5770ca13897bd252175ee",
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "md5ext": "029a5ed327a5770ca13897bd252175ee.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 26.401670067900056,
                    "rotationCenterY": 27.05121623249994
                },
                {
                    "assetId": "f56b477e7468ad24c5c233e5109b5210",
                    "name": "costume2",
                    "bitmapResolution": 1,
                    "md5ext": "f56b477e7468ad24c5c233e5109b5210.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 24.752929946900053,
                    "rotationCenterY": 28.550438922174266
                },
                {
                    "assetId": "0499ff4de3b9f0719333e63610b5807f",
                    "name": "costume3",
                    "bitmapResolution": 1,
                    "md5ext": "0499ff4de3b9f0719333e63610b5807f.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 16.916918703466706,
                    "rotationCenterY": 25.348646007484916
                },
                {
                    "assetId": "fcaa5250202f94d86a86e64d8546e76f",
                    "name": "costume4",
                    "bitmapResolution": 1,
                    "md5ext": "fcaa5250202f94d86a86e64d8546e76f.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 21.49995243030017,
                    "rotationCenterY": 26.72410214783457
                },
                {
                    "assetId": "1eaab5c72f31017214373559fb5dea4a",
                    "name": "costume5",
                    "bitmapResolution": 1,
                    "md5ext": "1eaab5c72f31017214373559fb5dea4a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 19.99850360330001,
                    "rotationCenterY": 24.04521801639646
                }
            ],
            "sounds": [
                {
                    "assetId": "10eed5b6b49ec7baf1d4b3b3fad0ac99",
                    "name": "Tada",
                    "dataFormat": "wav",
                    "format": "adpcm",
                    "rate": 44100,
                    "sampleCount": 111870,
                    "md5ext": "10eed5b6b49ec7baf1d4b3b3fad0ac99.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": -135,
            "y": -110,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Stairs",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "k4Y/i*iNn]`~.Iy`pJoS": {
                    "opcode": "event_whenflagclicked",
                    "next": "ShZ;IIgbUKY^tp:yn{_#",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": -30,
                    "y": 185
                },
                "ShZ;IIgbUKY^tp:yn{_#": {
                    "opcode": "motion_gotoxy",
                    "next": "6CqMz:(%pMS7$YXD/8gG",
                    "parent": "k4Y/i*iNn]`~.Iy`pJoS",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-10"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-84"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "6CqMz:(%pMS7$YXD/8gG": {
                    "opcode": "control_wait_until",
                    "next": null,
                    "parent": "ShZ;IIgbUKY^tp:yn{_#",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "c1a2905a9c95e70463cc9e04d09c72f9",
                    "name": "Stairs",
                    "bitmapResolution": 1,
                    "md5ext": "c1a2905a9c95e70463cc9e04d09c72f9.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 118.8915662650603,
                    "rotationCenterY": 46.00000000000017
                }
            ],
            "sounds": [
                {
                    "assetId": "10eed5b6b49ec7baf1d4b3b3fad0ac99",
                    "name": "Tada",
                    "dataFormat": "wav",
                    "format": "adpcm",
                    "rate": 44100,
                    "sampleCount": 111870,
                    "md5ext": "10eed5b6b49ec7baf1d4b3b3fad0ac99.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 110,
            "y": -84,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Cliff",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "|j=QVB9V]pSK6b296}S]": {
                    "opcode": "event_whenflagclicked",
                    "next": "uX-r9s9Xmoqou[RJkY!F",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 126,
                    "y": 113
                },
                "uX-r9s9Xmoqou[RJkY!F": {
                    "opcode": "motion_gotoxy",
                    "next": null,
                    "parent": "|j=QVB9V]pSK6b296}S]",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "208"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-76"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "cff81df6d15c74786363b3440aaa05d4",
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "md5ext": "cff81df6d15c74786363b3440aaa05d4.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 81.498795,
                    "rotationCenterY": 110.62501
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 4,
            "visible": true,
            "x": 208,
            "y": -76,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "ChestBlue",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "2c73986a4d0181001f8d887b405f0267",
                    "name": "ChestBlue",
                    "bitmapResolution": 2,
                    "md5ext": "2c73986a4d0181001f8d887b405f0267.png",
                    "dataFormat": "png",
                    "rotationCenterX": 34,
                    "rotationCenterY": 23
                }
            ],
            "sounds": [],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": 174.99999999999997,
            "y": -25,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190822194548",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15"
    }
}
},{}],34:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {
                "`jEk@4|i[#Fk?(8x)AV.-my variable": [
                    "my variable",
                    0
                ]
            },
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "5b9526271796822e9c0b5c5df5f84aa7",
                    "name": "Philadelphia",
                    "bitmapResolution": 2,
                    "md5ext": "5b9526271796822e9c0b5c5df5f84aa7.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 358
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "on",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Marchers",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "P3/@mVJG*Qzh*D[#Z;WP": {
                    "opcode": "event_whenflagclicked",
                    "next": "ZC!W8ll;A72/[xp2~o1x",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 64,
                    "y": 98
                },
                "ZC!W8ll;A72/[xp2~o1x": {
                    "opcode": "motion_gotoxy",
                    "next": null,
                    "parent": "P3/@mVJG*Qzh*D[#Z;WP",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-210"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-88"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "b172d63c30c13a7f4534d3aff1e5121f",
                    "name": "Marching",
                    "bitmapResolution": 1,
                    "md5ext": "b172d63c30c13a7f4534d3aff1e5121f.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 311.6818209605366,
                    "rotationCenterY": 124.82613
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -210,
            "y": -88,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Speaker",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "o.2V2xVQZi9Tj[_lzA}c": {
                    "opcode": "event_whenflagclicked",
                    "next": "4$Kbnqgs@`W0t,h:fnYP",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 69,
                    "y": 76
                },
                "4$Kbnqgs@`W0t,h:fnYP": {
                    "opcode": "motion_gotoxy",
                    "next": "HIC5Xv%R(MS84aIWNez8",
                    "parent": "o.2V2xVQZi9Tj[_lzA}c",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "19"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-69"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "HIC5Xv%R(MS84aIWNez8": {
                    "opcode": "control_wait_until",
                    "next": null,
                    "parent": "4$Kbnqgs@`W0t,h:fnYP",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 4,
            "costumes": [
                {
                    "assetId": "1abe1fe2be27d5d2013223c2fe94245b",
                    "name": "Sideways",
                    "bitmapResolution": 1,
                    "md5ext": "1abe1fe2be27d5d2013223c2fe94245b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 123.0827225184876,
                    "rotationCenterY": 77.64271440353008
                },
                {
                    "assetId": "c3a8bc66575a22249130ee46800e1457",
                    "name": "Walking1",
                    "bitmapResolution": 1,
                    "md5ext": "c3a8bc66575a22249130ee46800e1457.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 90.95484663969467,
                    "rotationCenterY": 75.56834843601908
                },
                {
                    "assetId": "c3a8bc66575a22249130ee46800e1457",
                    "name": "Walking4",
                    "bitmapResolution": 1,
                    "md5ext": "c3a8bc66575a22249130ee46800e1457.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 90.95484663969467,
                    "rotationCenterY": 75.56834843601908
                },
                {
                    "assetId": "4ef5927ef6f16aca401b904f393378e3",
                    "name": "Walking2",
                    "bitmapResolution": 1,
                    "md5ext": "4ef5927ef6f16aca401b904f393378e3.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 90.95484663969467,
                    "rotationCenterY": 75.56834843601908
                },
                {
                    "assetId": "4d1028c2076d480971bdfe2739bd8d33",
                    "name": "Speaking",
                    "bitmapResolution": 1,
                    "md5ext": "4d1028c2076d480971bdfe2739bd8d33.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 115.33703224900373,
                    "rotationCenterY": 83.56885228653631
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                },
                {
                    "assetId": "684ffae7bc3a65e35e9f0aaf7a579dd5",
                    "name": "Clapping",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 168320,
                    "md5ext": "684ffae7bc3a65e35e9f0aaf7a579dd5.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 19,
            "y": -69,
            "size": 60,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Podium",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "7vWA0r(r|[s,JPRy4xmS": {
                    "opcode": "event_whenflagclicked",
                    "next": "=Tz)E4nE=v?~f=+Y.(AL",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 201,
                    "y": 109
                },
                "=Tz)E4nE=v?~f=+Y.(AL": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "7vWA0r(r|[s,JPRy4xmS",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "a8b17ce836f928538e2388d5139ba3f5",
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "md5ext": "a8b17ce836f928538e2388d5139ba3f5.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": -29.423219892494387,
                    "rotationCenterY": 43.04309027915377
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 4,
            "visible": true,
            "x": 72.00000000000003,
            "y": -81,
            "size": 70,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Poster-Holder",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "de63edc84352c8150d58fff6fb2b2e72",
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "md5ext": "de63edc84352c8150d58fff6fb2b2e72.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 119,
                    "rotationCenterY": 104
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 222,
            "y": -22.000000000000014,
            "size": 60,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190822194548",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15"
    }
}
},{}],35:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {
                "9[N1%n{g*z~#XXcW(=Nm-set score-": [
                    "set score",
                    0
                ],
                "9[N1%n{g*z~#XXcW(=Nm-set-": [
                    "set",
                    0
                ],
                "9[N1%n{g*z~#XXcW(=Nm-score-": [
                    "score",
                    3
                ]
            },
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 1,
            "costumes": [
                {
                    "assetId": "5c3298ae33014a6eb91686cd1cda041e",
                    "name": "Field",
                    "bitmapResolution": 1,
                    "md5ext": "5c3298ae33014a6eb91686cd1cda041e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 240,
                    "rotationCenterY": 180
                },
                {
                    "assetId": "76ec17562f05dfa42f80ee5842cdf862",
                    "name": "Field & Bleachers",
                    "bitmapResolution": 1,
                    "md5ext": "76ec17562f05dfa42f80ee5842cdf862.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 240,
                    "rotationCenterY": 180
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Jaime ",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "dil)YZ{H0})IuwHAwS%C": {
                    "opcode": "event_whenflagclicked",
                    "next": "Ax?tNQzDgE?2:BrDnzJ2",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 33,
                    "y": 59
                },
                "Ax?tNQzDgE?2:BrDnzJ2": {
                    "opcode": "motion_gotoxy",
                    "next": ".Pb?svcZ*[O+MYgWr;o7",
                    "parent": "dil)YZ{H0})IuwHAwS%C",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-210"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-90"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ".Pb?svcZ*[O+MYgWr;o7": {
                    "opcode": "control_wait",
                    "next": null,
                    "parent": "Ax?tNQzDgE?2:BrDnzJ2",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                ".01"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {
                "AWlo:7:weqt;e=rdrhDb": {
                    "blockId": "z=ft#ukk{%ud|P~YyngQ",
                    "x": 426.6666666666667,
                    "y": 164.4814814814815,
                    "width": 298.5,
                    "height": 574.2,
                    "minimized": false,
                    "text": "This short wait block is here to make sure Jaime and the Soccer Ball are both at the correct starting location before Jaime points in the direction of the ball. \r\rWithout this wait block, Jaime sometimes starts running to where the ball used to be. If that happens, they never touch and the ball never gets kicked to the goal! "
                }
            },
            "currentCostume": 7,
            "costumes": [
                {
                    "assetId": "9be3e09f29ce023f14139f35b272b6ba",
                    "name": "Frame 1",
                    "bitmapResolution": 2,
                    "md5ext": "9be3e09f29ce023f14139f35b272b6ba.png",
                    "dataFormat": "png",
                    "rotationCenterX": 34,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "87334428f6134349d715ead14ef2db66",
                    "name": "Frame 2",
                    "bitmapResolution": 2,
                    "md5ext": "87334428f6134349d715ead14ef2db66.png",
                    "dataFormat": "png",
                    "rotationCenterX": 30,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "8b8a5cc5729cdc75ab017f2c4a359f63",
                    "name": "Frame 3",
                    "bitmapResolution": 2,
                    "md5ext": "8b8a5cc5729cdc75ab017f2c4a359f63.png",
                    "dataFormat": "png",
                    "rotationCenterX": 28,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "d0d840cb399a9854d3be9c8302f8176f",
                    "name": "Frame 4",
                    "bitmapResolution": 2,
                    "md5ext": "d0d840cb399a9854d3be9c8302f8176f.png",
                    "dataFormat": "png",
                    "rotationCenterX": 28,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "3fbbb48583b515619c8fc36c013a6028",
                    "name": "Frame 5",
                    "bitmapResolution": 2,
                    "md5ext": "3fbbb48583b515619c8fc36c013a6028.png",
                    "dataFormat": "png",
                    "rotationCenterX": 30,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "7996b885bf9aafdfb35986ee63eb5b0d",
                    "name": "Frame 6",
                    "bitmapResolution": 2,
                    "md5ext": "7996b885bf9aafdfb35986ee63eb5b0d.png",
                    "dataFormat": "png",
                    "rotationCenterX": 28,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "f382c08216827cbd77bb622ffd10e4b2",
                    "name": "Frame 7",
                    "bitmapResolution": 2,
                    "md5ext": "f382c08216827cbd77bb622ffd10e4b2.png",
                    "dataFormat": "png",
                    "rotationCenterX": 28,
                    "rotationCenterY": 66
                },
                {
                    "assetId": "d2441984420dc12e4c6c7fd212aea60f",
                    "name": "Frame 8",
                    "bitmapResolution": 2,
                    "md5ext": "d2441984420dc12e4c6c7fd212aea60f.png",
                    "dataFormat": "png",
                    "rotationCenterX": 30,
                    "rotationCenterY": 66
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": -35.000103043560046,
            "y": -90.18990849223357,
            "size": 85,
            "direction": 90.06217689848177,
            "draggable": false,
            "rotationStyle": "left-right"
        },
        {
            "isStage": false,
            "name": "Soccer Ball",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "W9IY!IPYXclx:rLq,5mA": {
                    "opcode": "event_whenflagclicked",
                    "next": "F,[mZXKyFmp9`JB-45R%",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 38,
                    "y": 110
                },
                "arz%}0!yQ3+83Sy`Xv(+": {
                    "opcode": "control_wait_until",
                    "next": null,
                    "parent": ":YKUti-f_hdztd/oSD93",
                    "inputs": {
                        "CONDITION": [
                            1,
                            null
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "F,[mZXKyFmp9`JB-45R%": {
                    "opcode": "motion_gotoxy",
                    "next": ":YKUti-f_hdztd/oSD93",
                    "parent": "W9IY!IPYXclx:rLq,5mA",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-13"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-105"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ":YKUti-f_hdztd/oSD93": {
                    "opcode": "control_wait",
                    "next": "arz%}0!yQ3+83Sy`Xv(+",
                    "parent": "F,[mZXKyFmp9`JB-45R%",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                ".01"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "b0e4c224f58b27443a98847d1b0c31d8",
                    "name": "Soccer Ball",
                    "bitmapResolution": 1,
                    "md5ext": "b0e4c224f58b27443a98847d1b0c31d8.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 6,
                    "rotationCenterY": 7
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                },
                {
                    "assetId": "4b36eebf22be4667fc2f15b78c805b4c",
                    "name": "cheer",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 125056,
                    "md5ext": "4b36eebf22be4667fc2f15b78c805b4c.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 176.3261695126244,
            "y": -89.01245679671165,
            "size": 200,
            "direction": 85.17314121887702,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Goal",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "c5d41b3ccd53838595eb021b1cf1fd62",
                    "name": "Goal",
                    "bitmapResolution": 1,
                    "md5ext": "c5d41b3ccd53838595eb021b1cf1fd62.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 34.5,
                    "rotationCenterY": 49.5
                }
            ],
            "sounds": [
                {
                    "assetId": "53a3c2e27d1fb5fdb14aaf0cb41e7889",
                    "name": "boing",
                    "dataFormat": "wav",
                    "format": "adpcm",
                    "rate": 44100,
                    "sampleCount": 14238,
                    "md5ext": "53a3c2e27d1fb5fdb14aaf0cb41e7889.wav"
                },
                {
                    "assetId": "4b36eebf22be4667fc2f15b78c805b4c",
                    "name": "cheer",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 125056,
                    "md5ext": "4b36eebf22be4667fc2f15b78c805b4c.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": 211,
            "y": -77,
            "size": 85.000000000001,
            "direction": -90,
            "draggable": false,
            "rotationStyle": "don't rotate"
        }
    ],
    "monitors": [
        {
            "id": "9[N1%n{g*z~#XXcW(=Nm-set score-",
            "mode": "default",
            "opcode": "data_variable",
            "params": {
                "VARIABLE": "set score"
            },
            "spriteName": null,
            "value": "",
            "width": 0,
            "height": 0,
            "x": 5,
            "y": 5,
            "visible": false,
            "sliderMin": 0,
            "sliderMax": 100,
            "isDiscrete": true
        },
        {
            "id": "9[N1%n{g*z~#XXcW(=Nm-set-",
            "mode": "default",
            "opcode": "data_variable",
            "params": {
                "VARIABLE": "set"
            },
            "spriteName": null,
            "value": "",
            "width": 0,
            "height": 0,
            "x": 5,
            "y": 32,
            "visible": false,
            "sliderMin": 0,
            "sliderMax": 100,
            "isDiscrete": true
        },
        {
            "id": "9[N1%n{g*z~#XXcW(=Nm-score-",
            "mode": "default",
            "opcode": "data_variable",
            "params": {
                "VARIABLE": "score"
            },
            "spriteName": null,
            "value": "",
            "width": 0,
            "height": 0,
            "x": 4,
            "y": 9,
            "visible": false,
            "sliderMin": 0,
            "sliderMax": 100,
            "isDiscrete": true
        }
    ],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190822194548",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15"
    }
}
},{}],36:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {
                "`jEk@4|i[#Fk?(8x)AV.-my variable": [
                    "my variable",
                    0
                ]
            },
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 1,
            "costumes": [
                {
                    "assetId": "47282ff0f7047c6fab9c94b531abf721",
                    "name": "Stars",
                    "bitmapResolution": 2,
                    "md5ext": "47282ff0f7047c6fab9c94b531abf721.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                },
                {
                    "assetId": "dba17f2fe831a28e41afd2f16b3993bd",
                    "name": "backdrop1",
                    "bitmapResolution": 1,
                    "md5ext": "dba17f2fe831a28e41afd2f16b3993bd.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 265.064915,
                    "rotationCenterY": 190.96325000000002
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "on",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Beep",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                ")Hw|G=u4#L%Zd-93?klR": {
                    "opcode": "event_whenflagclicked",
                    "next": "?u,_biB+AH,,#qg:~vqd",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 107,
                    "y": 62
                },
                "?u,_biB+AH,,#qg:~vqd": {
                    "opcode": "looks_setsizeto",
                    "next": "jy`M@`#/cIa[J^J,VT=1",
                    "parent": ")Hw|G=u4#L%Zd-93?klR",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "jy`M@`#/cIa[J^J,VT=1": {
                    "opcode": "motion_gotoxy",
                    "next": null,
                    "parent": "?u,_biB+AH,,#qg:~vqd",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-186"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "18"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "t|bmz5;Q}:rNy[co)*O2": {
                    "opcode": "event_whenkeypressed",
                    "next": "n,Jx3PAt=U)^.LI%r*:0",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 339,
                    "y": 456
                },
                "n,Jx3PAt=U)^.LI%r*:0": {
                    "opcode": "motion_movesteps",
                    "next": "Y{ZPTfuuH$48xsUu:gm.",
                    "parent": "t|bmz5;Q}:rNy[co)*O2",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "10"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Y{ZPTfuuH$48xsUu:gm.": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "n,Jx3PAt=U)^.LI%r*:0",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                },
                "LS]=|K@nurX.X+[H[Zp.": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "K!ln[rllBL6TJO,Rl@(t",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 353,
                    "y": 68
                },
                "K!ln[rllBL6TJO,Rl@(t": {
                    "opcode": "looks_changesizeby",
                    "next": "vnjYUZ`7:zZdj)Rur0bj",
                    "parent": "LS]=|K@nurX.X+[H[Zp.",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                "30"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "vnjYUZ`7:zZdj)Rur0bj": {
                    "opcode": "looks_gotofrontback",
                    "next": "w?z$I6Xd^b{Oi}r|[eGk",
                    "parent": "K!ln[rllBL6TJO,Rl@(t",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                },
                "w?z$I6Xd^b{Oi}r|[eGk": {
                    "opcode": "looks_sayforsecs",
                    "next": "9z*ZOpKlm~n~tlIZmPOD",
                    "parent": "vnjYUZ`7:zZdj)Rur0bj",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I'm Beep!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "9z*ZOpKlm~n~tlIZmPOD": {
                    "opcode": "looks_sayforsecs",
                    "next": "4u|V)g0~q^SQG=Zv_0+$",
                    "parent": "w?z$I6Xd^b{Oi}r|[eGk",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Press the space bar so that I'll win!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "4u|V)g0~q^SQG=Zv_0+$": {
                    "opcode": "looks_changesizeby",
                    "next": null,
                    "parent": "9z*ZOpKlm~n~tlIZmPOD",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                "-30"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "1fe9913ae93d928a15df521a051d7eea",
                    "name": "ship1",
                    "bitmapResolution": 1,
                    "md5ext": "1fe9913ae93d928a15df521a051d7eea.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 171,
                    "rotationCenterY": 62.89999999999988
                },
                {
                    "assetId": "c032dfbd8bbcd1123cf9c8c9c42c0645",
                    "name": "ship2",
                    "bitmapResolution": 1,
                    "md5ext": "c032dfbd8bbcd1123cf9c8c9c42c0645.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 171,
                    "rotationCenterY": 129.33301078616773
                },
                {
                    "assetId": "9dde9bb4f9ecbe50edadc7fcda466b58",
                    "name": "beep1",
                    "bitmapResolution": 1,
                    "md5ext": "9dde9bb4f9ecbe50edadc7fcda466b58.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 45.56039300326347,
                    "rotationCenterY": 69.33720008723701
                },
                {
                    "assetId": "c85a3e6d7729cda3f818e8fc7570eb8f",
                    "name": "beep2",
                    "bitmapResolution": 1,
                    "md5ext": "c85a3e6d7729cda3f818e8fc7570eb8f.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 56.01039300326346,
                    "rotationCenterY": 69.77782508723702
                },
                {
                    "assetId": "518be59a39827d405a5cd0da55d9e875",
                    "name": "sled1",
                    "bitmapResolution": 1,
                    "md5ext": "518be59a39827d405a5cd0da55d9e875.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 88.98236,
                    "rotationCenterY": 82.19345008723701
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -186,
            "y": 18,
            "size": 50,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Bop",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "IK9aK;Oy{S~RKlL@`/?v": {
                    "opcode": "event_whenflagclicked",
                    "next": "AR:)++|{,CX=MXlPW7A@",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 119,
                    "y": 26
                },
                "AR:)++|{,CX=MXlPW7A@": {
                    "opcode": "motion_gotoxy",
                    "next": "qs?R^0_~bvbVh+vA6Rk;",
                    "parent": "IK9aK;Oy{S~RKlL@`/?v",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-191"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-25"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "qs?R^0_~bvbVh+vA6Rk;": {
                    "opcode": "looks_setsizeto",
                    "next": "G7ctbN^~.TcWF!904;bQ",
                    "parent": "AR:)++|{,CX=MXlPW7A@",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "G7ctbN^~.TcWF!904;bQ": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "qs?R^0_~bvbVh+vA6Rk;",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "bab12501f87e1c00e953379a18307c56",
                    "name": "ship1",
                    "bitmapResolution": 1,
                    "md5ext": "bab12501f87e1c00e953379a18307c56.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 176,
                    "rotationCenterY": 24.5
                },
                {
                    "assetId": "eb33c13405d8ece7d42825eb37e381e3",
                    "name": "ship2",
                    "bitmapResolution": 1,
                    "md5ext": "eb33c13405d8ece7d42825eb37e381e3.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 175.804685,
                    "rotationCenterY": 81.357469606723
                },
                {
                    "assetId": "d04e62a14da7cd53c6b23e0bd7003c78",
                    "name": "bop1",
                    "bitmapResolution": 1,
                    "md5ext": "d04e62a14da7cd53c6b23e0bd7003c78.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 76.59364512826346,
                    "rotationCenterY": 46.51863602473705
                },
                {
                    "assetId": "504e016eed3bff1bbe8a227f3df53f09",
                    "name": "bop2",
                    "bitmapResolution": 1,
                    "md5ext": "504e016eed3bff1bbe8a227f3df53f09.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 76.59364300326348,
                    "rotationCenterY": 46.518635087237016
                },
                {
                    "assetId": "18a46c151425df3ce265da8cfa406489",
                    "name": "sled1",
                    "bitmapResolution": 1,
                    "md5ext": "18a46c151425df3ce265da8cfa406489.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 119.28115943750001,
                    "rotationCenterY": 79.377367337237
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 4,
            "visible": true,
            "x": -191,
            "y": -25,
            "size": 50,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Planet X",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "cmh7xhE`E:+upjW4lIm[": {
                    "opcode": "event_whenflagclicked",
                    "next": "wUiTg*%taA~OmVyHl.Y~",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 108,
                    "y": 115
                },
                "wUiTg*%taA~OmVyHl.Y~": {
                    "opcode": "looks_sayforsecs",
                    "next": "_usXI:FR8i8usSlD,/{)",
                    "parent": "cmh7xhE`E:+upjW4lIm[",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Who can rescue Bork first?"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "_usXI:FR8i8usSlD,/{)": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "wUiTg*%taA~OmVyHl.Y~",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on the purple spaceship for instructions."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 7,
            "costumes": [
                {
                    "assetId": "3b79be8b6ef90f241ce0df0de5687e38",
                    "name": "costume1 ",
                    "bitmapResolution": 1,
                    "md5ext": "3b79be8b6ef90f241ce0df0de5687e38.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71355034962338,
                    "rotationCenterY": 131.1600067607962
                },
                {
                    "assetId": "9a35721ea22d7866ce7e2424bec55dec",
                    "name": "costume2",
                    "bitmapResolution": 1,
                    "md5ext": "9a35721ea22d7866ce7e2424bec55dec.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71354821113795,
                    "rotationCenterY": 131.1600091352506
                },
                {
                    "assetId": "dd8dd572064baacfd4c997287b471ae5",
                    "name": "costume3",
                    "bitmapResolution": 1,
                    "md5ext": "dd8dd572064baacfd4c997287b471ae5.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71354607265252,
                    "rotationCenterY": 131.160011509705
                },
                {
                    "assetId": "1bf472a6abe923dcfef3f24fdcbdfe31",
                    "name": "costume4",
                    "bitmapResolution": 1,
                    "md5ext": "1bf472a6abe923dcfef3f24fdcbdfe31.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71354286151458,
                    "rotationCenterY": 131.1600123744544
                },
                {
                    "assetId": "ac482dc9abd0d65f08e3eae8e177565a",
                    "name": "costume5",
                    "bitmapResolution": 1,
                    "md5ext": "ac482dc9abd0d65f08e3eae8e177565a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71354072302915,
                    "rotationCenterY": 131.1600147489088
                },
                {
                    "assetId": "c31201968e2a3fa435610cb91aea3888",
                    "name": "costume6",
                    "bitmapResolution": 1,
                    "md5ext": "c31201968e2a3fa435610cb91aea3888.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71353858454376,
                    "rotationCenterY": 131.1600171233632
                },
                {
                    "assetId": "8f89a526a1dfad2baaf46ed3a2d7a748",
                    "name": "costume7",
                    "bitmapResolution": 1,
                    "md5ext": "8f89a526a1dfad2baaf46ed3a2d7a748.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 138.71353644605836,
                    "rotationCenterY": 131.16000949781758
                },
                {
                    "assetId": "653079912256ec68d2b130232d172e04",
                    "name": "costume8",
                    "bitmapResolution": 1,
                    "md5ext": "653079912256ec68d2b130232d172e04.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 112,
                    "rotationCenterY": 126
                },
                {
                    "assetId": "a5cbfd13c5efaaed99a9253eac258bb1",
                    "name": "costume9",
                    "bitmapResolution": 1,
                    "md5ext": "a5cbfd13c5efaaed99a9253eac258bb1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 134,
                    "rotationCenterY": 125
                },
                {
                    "assetId": "a53f10e8da56d38de783ce4d2750d7bf",
                    "name": "costume10",
                    "bitmapResolution": 1,
                    "md5ext": "a53f10e8da56d38de783ce4d2750d7bf.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 127,
                    "rotationCenterY": 130
                },
                {
                    "assetId": "6930e1a6307b5c9ed9bbef3bde266b54",
                    "name": "costume11",
                    "bitmapResolution": 1,
                    "md5ext": "6930e1a6307b5c9ed9bbef3bde266b54.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 129,
                    "rotationCenterY": 127
                },
                {
                    "assetId": "a6a297e536e0ee8bdc64eab8ac12d2aa",
                    "name": "costume12",
                    "bitmapResolution": 1,
                    "md5ext": "a6a297e536e0ee8bdc64eab8ac12d2aa.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 145.86591931239406,
                    "rotationCenterY": 157.6903320812774
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 174.00000000000003,
            "y": 8,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Bork",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 5,
            "costumes": [
                {
                    "assetId": "a355064d89d776d706ce73ea63768d53",
                    "name": "ship1",
                    "bitmapResolution": 1,
                    "md5ext": "a355064d89d776d706ce73ea63768d53.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 146.3331508280487,
                    "rotationCenterY": 145.765020900729
                },
                {
                    "assetId": "29861b82c8949aca5afa5d36b6feaae8",
                    "name": "ship2",
                    "bitmapResolution": 1,
                    "md5ext": "29861b82c8949aca5afa5d36b6feaae8.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 127.18394470641091,
                    "rotationCenterY": 182.09893330507907
                },
                {
                    "assetId": "f291559ece9109053d03a62fcbf9af33",
                    "name": "ship3",
                    "bitmapResolution": 1,
                    "md5ext": "f291559ece9109053d03a62fcbf9af33.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 126.7879248948387,
                    "rotationCenterY": 140
                },
                {
                    "assetId": "7614d9b95b24d012d72ed6d4f1ad6e3f",
                    "name": "bork1",
                    "bitmapResolution": 1,
                    "md5ext": "7614d9b95b24d012d72ed6d4f1ad6e3f.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 66.59362797680515,
                    "rotationCenterY": 38.51862212869321
                },
                {
                    "assetId": "90b27333efdd829b010fc36f94a068b2",
                    "name": "bork2",
                    "bitmapResolution": 1,
                    "md5ext": "90b27333efdd829b010fc36f94a068b2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 66.5936334271878,
                    "rotationCenterY": 41.71125196320858
                },
                {
                    "assetId": "d71c685913a2a2e1bd1c0a561e169a35",
                    "name": "bork3",
                    "bitmapResolution": 1,
                    "md5ext": "d71c685913a2a2e1bd1c0a561e169a35.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 77.89664936195814,
                    "rotationCenterY": 45.51862270055594
                },
                {
                    "assetId": "2e801a9b114912e0050e9b52ef923379",
                    "name": "sled1",
                    "bitmapResolution": 1,
                    "md5ext": "2e801a9b114912e0050e9b52ef923379.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 119.28116,
                    "rotationCenterY": 91.51862135027797
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 131,
            "y": 17.999999999999986,
            "size": 60.00000000000001,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}

},{}],37:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "0fdc016498ad18ef64083324fc555e07",
                    "name": "Ofrenda",
                    "bitmapResolution": 2,
                    "md5ext": "0fdc016498ad18ef64083324fc555e07.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Catrina",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "hhI-UM#;XV/}FN!T75=O": {
                    "opcode": "event_whenflagclicked",
                    "next": "n.v*p~!1x;LzrE#aVJn=",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 16,
                    "y": 18
                },
                "n.v*p~!1x;LzrE#aVJn=": {
                    "opcode": "looks_sayforsecs",
                    "next": "_JN(d|ySH,Mh2muwwiu;",
                    "parent": "hhI-UM#;XV/}FN!T75=O",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "This is an Ofrenda. It is a traditional ritual for the Mexican Día de los Muertos celebration. "
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                6
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "_JN(d|ySH,Mh2muwwiu;": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "n.v*p~!1x;LzrE#aVJn=",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on the space bar key to learn more about Día de los Muertos."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                5
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "jyoFe@W21fl/YG4-K0HV": {
                    "opcode": "event_whenkeypressed",
                    "next": "0Tpp4fyP/cwt]Xci4%c}",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space"
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 16,
                    "y": 271
                },
                "0Tpp4fyP/cwt]Xci4%c}": {
                    "opcode": "looks_sayforsecs",
                    "next": "!Q|p9#+:C8i8N^IuIr?h",
                    "parent": "jyoFe@W21fl/YG4-K0HV",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Día de los Muertos is celebrated on November 1st and 2nd. It is a time to celebrate our ancestors and be with our families."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                7
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "!Q|p9#+:C8i8N^IuIr?h": {
                    "opcode": "looks_sayforsecs",
                    "next": "BYR*l6tNynN^zR?hlMCo",
                    "parent": "0Tpp4fyP/cwt]Xci4%c}",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Photos of loved ones who have died as well as their favorite foods are left out to welcome them home for the night.  "
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                7
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "BYR*l6tNynN^zR?hlMCo": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "!Q|p9#+:C8i8N^IuIr?h",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on one of the pictures of my family members to learn about them."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                6
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "647ed8ab0fc6dcbc70e9aa3eda75edbb",
                    "name": "Catrina",
                    "bitmapResolution": 2,
                    "md5ext": "647ed8ab0fc6dcbc70e9aa3eda75edbb.png",
                    "dataFormat": "png",
                    "rotationCenterX": 192,
                    "rotationCenterY": 228
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": -181.3,
            "y": -28.80000000000001,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Left",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "kM%BH#W(*9LZtQa]U(V.": {
                    "opcode": "event_whenflagclicked",
                    "next": "cg=pg0XvI1*3~}~TY*;%",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "cg=pg0XvI1*3~}~TY*;%": {
                    "opcode": "looks_setsizeto",
                    "next": null,
                    "parent": "kM%BH#W(*9LZtQa]U(V.",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "8+onh*iCmBn~5GY(sy;p": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "}VBgCH{K:oDh6pV0h.pi",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 275
                },
                "}VBgCH{K:oDh6pV0h.pi": {
                    "opcode": "looks_gotofrontback",
                    "next": "taz8m.4x_rVweL9%J@(3",
                    "parent": "8+onh*iCmBn~5GY(sy;p",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front"
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                },
                "taz8m.4x_rVweL9%J@(3": {
                    "opcode": "looks_changesizeby",
                    "next": "Y5!LLf.Gqemqe/6!)t=e",
                    "parent": "}VBgCH{K:oDh6pV0h.pi",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Y5!LLf.Gqemqe/6!)t=e": {
                    "opcode": "looks_sayforsecs",
                    "next": "Q.gGFO#r}[Z@fzClmRq-",
                    "parent": "taz8m.4x_rVweL9%J@(3",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I am Grandpa John."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Q.gGFO#r}[Z@fzClmRq-": {
                    "opcode": "looks_sayforsecs",
                    "next": "sPl?mFlNaaD_l]+QJ.CW",
                    "parent": "Y5!LLf.Gqemqe/6!)t=e",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I loved to cook with my grandchildren."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                4
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "sPl?mFlNaaD_l]+QJ.CW": {
                    "opcode": "looks_changesizeby",
                    "next": null,
                    "parent": "Q.gGFO#r}[Z@fzClmRq-",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                -100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 3,
            "costumes": [
                {
                    "assetId": "7f24161f04680291faeb630df4dd5085",
                    "name": "person1",
                    "bitmapResolution": 2,
                    "md5ext": "7f24161f04680291faeb630df4dd5085.png",
                    "dataFormat": "png",
                    "rotationCenterX": 66,
                    "rotationCenterY": 86
                },
                {
                    "assetId": "5eb6486c7167f691023e24b52a1b88f9",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "5eb6486c7167f691023e24b52a1b88f9.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "d09a00414b05cee69c76d00585b8d66b",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "d09a00414b05cee69c76d00585b8d66b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 33,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "8900e1f586f49453f2e7501e3fe4cfdd",
                    "name": "person4",
                    "bitmapResolution": 2,
                    "md5ext": "8900e1f586f49453f2e7501e3fe4cfdd.png",
                    "dataFormat": "png",
                    "rotationCenterX": 64,
                    "rotationCenterY": 86
                },
                {
                    "assetId": "08ab2e17ccc33f08537f0c83fcc7fb94",
                    "name": "person5",
                    "bitmapResolution": 2,
                    "md5ext": "08ab2e17ccc33f08537f0c83fcc7fb94.png",
                    "dataFormat": "png",
                    "rotationCenterX": 60,
                    "rotationCenterY": 90
                },
                {
                    "assetId": "c15dd7c24b82019df099416b5bea68d6",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "c15dd7c24b82019df099416b5bea68d6.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "a815e04689a83e14ccf2422c600cfe4c",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "a815e04689a83e14ccf2422c600cfe4c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "09c1ba15733f0c6377ef36cff5e6a0e5",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "09c1ba15733f0c6377ef36cff5e6a0e5.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "b26fdbf0cbee8d0b2766f3cd2ea7a490",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "b26fdbf0cbee8d0b2766f3cd2ea7a490.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "11fba26009af8c1b36cdb07527d37f1c",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "11fba26009af8c1b36cdb07527d37f1c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 40
                },
                {
                    "assetId": "3bab46e52650e819aae5e5c57edb3b0e",
                    "name": "pet3",
                    "bitmapResolution": 1,
                    "md5ext": "3bab46e52650e819aae5e5c57edb3b0e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 19,
                    "rotationCenterY": 37
                },
                {
                    "assetId": "25daceea601ed530456bc6fa24a26c15",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "25daceea601ed530456bc6fa24a26c15.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 20,
                    "rotationCenterY": 37
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -71,
            "y": 56,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Middle",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "6vO}g1Tn]HuzZYGP8=y2": {
                    "opcode": "event_whenflagclicked",
                    "next": "4G]%`kG5j!MdWz97Y1}e",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "4G]%`kG5j!MdWz97Y1}e": {
                    "opcode": "looks_setsizeto",
                    "next": null,
                    "parent": "6vO}g1Tn]HuzZYGP8=y2",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                100
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "e?qr@5tmZQxY(E0,M{59": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "/f[ltBij)7]5Jtg|W(1%",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 18,
                    "y": 241
                },
                "/f[ltBij)7]5Jtg|W(1%": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "e?qr@5tmZQxY(E0,M{59",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front"
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "4ba11d5f6d1ed2d208d17715d130cb9e",
                    "name": "pet3",
                    "bitmapResolution": 2,
                    "md5ext": "4ba11d5f6d1ed2d208d17715d130cb9e.png",
                    "dataFormat": "png",
                    "rotationCenterX": 50,
                    "rotationCenterY": 84
                },
                {
                    "assetId": "087dd33db6c7d5eeaad4150ab881d9d1",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "087dd33db6c7d5eeaad4150ab881d9d1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 24,
                    "rotationCenterY": 43
                },
                {
                    "assetId": "0c5b40f70385fcc1f8f53954f818f2ed",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "0c5b40f70385fcc1f8f53954f818f2ed.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "6b6d55f95a4d13f6c132b29d96e1a11e",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "6b6d55f95a4d13f6c132b29d96e1a11e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "42f79997429705f763eb27b9b05ba5bb",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "42f79997429705f763eb27b9b05ba5bb.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "44cf3ec60b8282766ae03dc5565889f2",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "44cf3ec60b8282766ae03dc5565889f2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 47
                },
                {
                    "assetId": "d3c271339a5e31d67571a6fc2f16daba",
                    "name": "person5",
                    "bitmapResolution": 1,
                    "md5ext": "d3c271339a5e31d67571a6fc2f16daba.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "e2df341a1cb5a6c47b74ba64d6f84d57",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "e2df341a1cb5a6c47b74ba64d6f84d57.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "e162f14bec31f175c2064fb245159c7c",
                    "name": "person1",
                    "bitmapResolution": 1,
                    "md5ext": "e162f14bec31f175c2064fb245159c7c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "d9bd6a50ef48f3b0ebd402c8d75f4cb1",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "d9bd6a50ef48f3b0ebd402c8d75f4cb1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": 44
                },
                {
                    "assetId": "67de18ea5831da13fba2dd9a7e07827c",
                    "name": "person4",
                    "bitmapResolution": 1,
                    "md5ext": "67de18ea5831da13fba2dd9a7e07827c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 38,
                    "rotationCenterY": 46
                },
                {
                    "assetId": "b7862ddeff16907801331ec1598b835e",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "b7862ddeff16907801331ec1598b835e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 44
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 4,
            "visible": true,
            "x": 6,
            "y": 53,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Right",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 2,
            "costumes": [
                {
                    "assetId": "49c12ffb44165bb3f3fda8d202a046b8",
                    "name": "person5",
                    "bitmapResolution": 2,
                    "md5ext": "49c12ffb44165bb3f3fda8d202a046b8.png",
                    "dataFormat": "png",
                    "rotationCenterX": 60,
                    "rotationCenterY": 90
                },
                {
                    "assetId": "f2483e067cdfd2c35b613fea24980a30",
                    "name": "person6",
                    "bitmapResolution": 1,
                    "md5ext": "f2483e067cdfd2c35b613fea24980a30.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "d8a943604322f0f5f2f435d3cd940b85",
                    "name": "person8",
                    "bitmapResolution": 1,
                    "md5ext": "d8a943604322f0f5f2f435d3cd940b85.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "04adcf04fb8d1026d62f5ee9c3ad7d42",
                    "name": "person7",
                    "bitmapResolution": 1,
                    "md5ext": "04adcf04fb8d1026d62f5ee9c3ad7d42.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 47
                },
                {
                    "assetId": "1356d2e5866dc1daff05814408c1167c",
                    "name": "pet2",
                    "bitmapResolution": 1,
                    "md5ext": "1356d2e5866dc1daff05814408c1167c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 42
                },
                {
                    "assetId": "6a108c4dbd2c2265c2bb5908f9a79398",
                    "name": "pet1",
                    "bitmapResolution": 1,
                    "md5ext": "6a108c4dbd2c2265c2bb5908f9a79398.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 29,
                    "rotationCenterY": 44
                },
                {
                    "assetId": "07166695718b3712d36435cef0bfa346",
                    "name": "pet4",
                    "bitmapResolution": 1,
                    "md5ext": "07166695718b3712d36435cef0bfa346.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 17,
                    "rotationCenterY": 40
                },
                {
                    "assetId": "71b02eaaab47f60b1bc94579213d1d18",
                    "name": "pet3",
                    "bitmapResolution": 1,
                    "md5ext": "71b02eaaab47f60b1bc94579213d1d18.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 18,
                    "rotationCenterY": 41
                },
                {
                    "assetId": "bc2691b6a5df3c506d69a4966dfb3628",
                    "name": "person2",
                    "bitmapResolution": 1,
                    "md5ext": "bc2691b6a5df3c506d69a4966dfb3628.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 32,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "721091c90a3ea19d1c8bd85f7fdf4824",
                    "name": "person1",
                    "bitmapResolution": 1,
                    "md5ext": "721091c90a3ea19d1c8bd85f7fdf4824.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "60425642ecdb9faed9feb69e178dcdd2",
                    "name": "person3",
                    "bitmapResolution": 1,
                    "md5ext": "60425642ecdb9faed9feb69e178dcdd2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 30,
                    "rotationCenterY": 45
                },
                {
                    "assetId": "07c3da9d5c02aaee8092d19642f94e3c",
                    "name": "person4",
                    "bitmapResolution": 1,
                    "md5ext": "07c3da9d5c02aaee8092d19642f94e3c.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 31,
                    "rotationCenterY": 45
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 71,
            "y": 54,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}

},{}],38:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "a362161676714e6cd5c6d720547817d5",
                    "name": "courtyard",
                    "bitmapResolution": 2,
                    "md5ext": "a362161676714e6cd5c6d720547817d5.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Jamal",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "73/K=FP)GVQLI-wUsnJ|": {
                    "opcode": "event_whenflagclicked",
                    "next": "}%6,]+;TseI8:@asB9eH",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 46,
                    "y": 74
                },
                "0z1!lZDenX,SZ:4QWkF:": {
                    "opcode": "looks_setsizeto",
                    "next": "(5[hu{1=uH.J?E^4r(~)",
                    "parent": "}%6,]+;TseI8:@asB9eH",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                "60"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "i`x-8yLimj(13c3dzjIw": {
                    "opcode": "event_whenkeypressed",
                    "next": "!aXre*as=;7wZ4l-jAC_",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 91,
                    "y": 340
                },
                "!aXre*as=;7wZ4l-jAC_": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "i`x-8yLimj(13c3dzjIw",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Minimo!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "KDzF~kf,]OocH8gZN2IE": {
                    "opcode": "looks_gotofrontback",
                    "next": "=~@BIdz=vjjZL/Di~o(*",
                    "parent": "xf21f|F9gQ2s=s%FzM)P",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                },
                "cyB#IOz:/lCBZdFq27nJ": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "xf21f|F9gQ2s=s%FzM)P",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 538,
                    "y": 122
                },
                "xf21f|F9gQ2s=s%FzM)P": {
                    "opcode": "looks_changesizeby",
                    "next": "KDzF~kf,]OocH8gZN2IE",
                    "parent": "cyB#IOz:/lCBZdFq27nJ",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "QCnmWw~%2`su?71YfD)r": {
                    "opcode": "looks_changesizeby",
                    "next": null,
                    "parent": "=~@BIdz=vjjZL/Di~o(*",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                "-50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "=~@BIdz=vjjZL/Di~o(*": {
                    "opcode": "looks_sayforsecs",
                    "next": "QCnmWw~%2`su?71YfD)r",
                    "parent": "KDzF~kf,]OocH8gZN2IE",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Press the space bar to do some magic. "
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "(5[hu{1=uH.J?E^4r(~)": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "0z1!lZDenX,SZ:4QWkF:",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on me for instructions."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "}%6,]+;TseI8:@asB9eH": {
                    "opcode": "motion_gotoxy",
                    "next": "0z1!lZDenX,SZ:4QWkF:",
                    "parent": "73/K=FP)GVQLI-wUsnJ|",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-25"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-41"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 8,
            "costumes": [
                {
                    "assetId": "693c376e737af6eb9be6cd7115c893e1",
                    "name": "Witch 1",
                    "bitmapResolution": 2,
                    "md5ext": "693c376e737af6eb9be6cd7115c893e1.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 346
                },
                {
                    "assetId": "82f3df3a42627bc33fcea826e26f9ff4",
                    "name": "Witch 2",
                    "bitmapResolution": 2,
                    "md5ext": "82f3df3a42627bc33fcea826e26f9ff4.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 346
                },
                {
                    "assetId": "bf2788e393d35ca53bac9d40efc38911",
                    "name": "Witch 3",
                    "bitmapResolution": 2,
                    "md5ext": "bf2788e393d35ca53bac9d40efc38911.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 346
                },
                {
                    "assetId": "cca489e9caf72e68e2cb1fc5c40f902f",
                    "name": "Witch 4",
                    "bitmapResolution": 2,
                    "md5ext": "cca489e9caf72e68e2cb1fc5c40f902f.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 346
                },
                {
                    "assetId": "6d7091094236416678775c44ff64dfcd",
                    "name": "Witch 5",
                    "bitmapResolution": 2,
                    "md5ext": "6d7091094236416678775c44ff64dfcd.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 346
                },
                {
                    "assetId": "1e4ce6f6412036d8dfaf2e543ee4975d",
                    "name": "Wizard 1",
                    "bitmapResolution": 2,
                    "md5ext": "1e4ce6f6412036d8dfaf2e543ee4975d.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 356
                },
                {
                    "assetId": "a17f08c55acf5ebf9f789d95c44d578e",
                    "name": "Wizard 2",
                    "bitmapResolution": 2,
                    "md5ext": "a17f08c55acf5ebf9f789d95c44d578e.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 356
                },
                {
                    "assetId": "396814cd71c312f27de864cc3f248a0d",
                    "name": "Wizard 3",
                    "bitmapResolution": 2,
                    "md5ext": "396814cd71c312f27de864cc3f248a0d.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 356
                },
                {
                    "assetId": "be247e831fea557a43d0bbe85d685ed1",
                    "name": "Wizard 4",
                    "bitmapResolution": 2,
                    "md5ext": "be247e831fea557a43d0bbe85d685ed1.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 356
                },
                {
                    "assetId": "6d655cb61af1444a9569ce280d6d3383",
                    "name": "Wizard 5",
                    "bitmapResolution": 2,
                    "md5ext": "6d655cb61af1444a9569ce280d6d3383.png",
                    "dataFormat": "png",
                    "rotationCenterX": 338,
                    "rotationCenterY": 356
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -60,
            "y": -41,
            "size": 60.00000000000001,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Monster",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "VPKLazkV}Ih(~ceuerQ!": {
                    "opcode": "event_whenflagclicked",
                    "next": "JY$I_;vD}Njo;gdoLQ;*",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 77,
                    "y": 68
                },
                "JY$I_;vD}Njo;gdoLQ;*": {
                    "opcode": "motion_gotoxy",
                    "next": "XGxvNer$A%#I1sQLS3~D",
                    "parent": "VPKLazkV}Ih(~ceuerQ!",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "40"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-29"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "XGxvNer$A%#I1sQLS3~D": {
                    "opcode": "looks_setsizeto",
                    "next": "heI|`ne,I%7yKaK@uy*T",
                    "parent": "JY$I_;vD}Njo;gdoLQ;*",
                    "inputs": {
                        "SIZE": [
                            1,
                            [
                                4,
                                "45"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "~Ta~h%{oyzDJkNgB0Ar*": {
                    "opcode": "event_whenkeypressed",
                    "next": "1K)/uYKqz?SyP7XP*^H;",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 84,
                    "y": 326
                },
                "1K)/uYKqz?SyP7XP*^H;": {
                    "opcode": "control_wait",
                    "next": "uR_ri`oBD|rjMgU?FM6[",
                    "parent": "~Ta~h%{oyzDJkNgB0Ar*",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                ".3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "uR_ri`oBD|rjMgU?FM6[": {
                    "opcode": "looks_changesizeby",
                    "next": "qeL@)l};UkUk/5=yMJfJ",
                    "parent": "1K)/uYKqz?SyP7XP*^H;",
                    "inputs": {
                        "CHANGE": [
                            1,
                            [
                                4,
                                "-10"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "qeL@)l};UkUk/5=yMJfJ": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "uR_ri`oBD|rjMgU?FM6[",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Help! I'm shrinking..."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "heI|`ne,I%7yKaK@uy*T": {
                    "opcode": "looks_gotofrontback",
                    "next": null,
                    "parent": "XGxvNer$A%#I1sQLS3~D",
                    "inputs": {},
                    "fields": {
                        "FRONT_BACK": [
                            "front",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "21aaff40f8741327cb79b49765b936d2",
                    "name": "ghost",
                    "bitmapResolution": 1,
                    "md5ext": "21aaff40f8741327cb79b49765b936d2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 327.76250964222845,
                    "rotationCenterY": 257.5494098687525
                },
                {
                    "assetId": "40678a7b7c9856c50d9d2469a646f75d",
                    "name": "cerberus",
                    "bitmapResolution": 1,
                    "md5ext": "40678a7b7c9856c50d9d2469a646f75d.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 238.00040007170497,
                    "rotationCenterY": 179.94064073824006
                },
                {
                    "assetId": "6e9595a213b8a6f999b255442e6f3936",
                    "name": "owl",
                    "bitmapResolution": 1,
                    "md5ext": "6e9595a213b8a6f999b255442e6f3936.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 237.86389223861505,
                    "rotationCenterY": 182.60606156491636
                },
                {
                    "assetId": "e87005524ef37b2492b7d3ef4c60a74b",
                    "name": "Minotaur",
                    "bitmapResolution": 1,
                    "md5ext": "e87005524ef37b2492b7d3ef4c60a74b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 261.80950927734375,
                    "rotationCenterY": 311.7650451660156
                },
                {
                    "assetId": "84f57cc303311897ec158533620ef80a",
                    "name": "Pink-Monster",
                    "bitmapResolution": 1,
                    "md5ext": "84f57cc303311897ec158533620ef80a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 208.5,
                    "rotationCenterY": 238
                },
                {
                    "assetId": "8a92d14193f4f21669e849a9d9ed0534",
                    "name": "Dragon",
                    "bitmapResolution": 1,
                    "md5ext": "8a92d14193f4f21669e849a9d9ed0534.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 1608.5065134277343,
                    "rotationCenterY": 911.3315122070312
                }
            ],
            "sounds": [],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 40,
            "y": -29,
            "size": 40,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Cat",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "5fd638b2ff36d311493830ebf35b893b",
                    "name": "cat1",
                    "bitmapResolution": 1,
                    "md5ext": "5fd638b2ff36d311493830ebf35b893b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 88.00446848131384,
                    "rotationCenterY": 70.56565467089568
                },
                {
                    "assetId": "49c6e3be85f53eb0611478e2b42fec2b",
                    "name": "cat2",
                    "bitmapResolution": 1,
                    "md5ext": "49c6e3be85f53eb0611478e2b42fec2b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 66.7904327804867,
                    "rotationCenterY": 27.065782158774567
                },
                {
                    "assetId": "ac20e1f89530205acfffd7be4591e138",
                    "name": "cat3",
                    "bitmapResolution": 1,
                    "md5ext": "ac20e1f89530205acfffd7be4591e138.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 883.0755004882812,
                    "rotationCenterY": 833.4295043945312
                },
                {
                    "assetId": "a827a07ddea183ca618a10d9563ce9b0",
                    "name": "cat4",
                    "bitmapResolution": 1,
                    "md5ext": "a827a07ddea183ca618a10d9563ce9b0.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 570.0643920898438,
                    "rotationCenterY": 358.7921142578125
                },
                {
                    "assetId": "2fc2371b446dc9d3826e20d9a68e8ef2",
                    "name": "cat5",
                    "bitmapResolution": 1,
                    "md5ext": "2fc2371b446dc9d3826e20d9a68e8ef2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 372.0450134277344,
                    "rotationCenterY": 526.2000122070312
                },
                {
                    "assetId": "1b277f5ef9cbfd6f30efe6f98721392d",
                    "name": "cat6",
                    "bitmapResolution": 1,
                    "md5ext": "1b277f5ef9cbfd6f30efe6f98721392d.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 715,
                    "rotationCenterY": 1028.5
                }
            ],
            "sounds": [],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 164.99999999999997,
            "y": -67,
            "size": 50,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}

},{}],39:[function(require,module,exports){
module.exports={"targets":[{"costumes":[{"assetId":"cd21514d0531fdffb22204e0ec5ed84a","name":"backdrop1","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180},{"assetId":"e494c4f44897d94e0541f7036a302449","name":"Basketball 1","bitmapResolution":1,"md5ext":"e494c4f44897d94e0541f7036a302449.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180},{"assetId":"63b6a69594a0a87888b56244bfa2ac1b","name":"Slopes","bitmapResolution":2,"md5ext":"63b6a69594a0a87888b56244bfa2ac1b.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"dcc98dd9fca1c6307a657c3f9b8f7536","name":"Ramps","bitmapResolution":2,"md5ext":"dcc98dd9fca1c6307a657c3f9b8f7536.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"f86c511b2706df7fc11e57ab854917d0","name":"Hat_man1","bitmapResolution":2,"md5ext":"f86c511b2706df7fc11e57ab854917d0.png","dataFormat":"png","rotationCenterX":100,"rotationCenterY":100}],"sounds":[{"assetId":"a434069c58e79d42f5d21abb1c318919","name":"Goal Cheer","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":84329,"md5ext":"a434069c58e79d42f5d21abb1c318919.wav"},{"assetId":"e675f311addd23d450ff60e36d83fb96","name":"Referee Whistle","dataFormat":"wav","format":"","rate":48000,"sampleCount":14267,"md5ext":"e675f311addd23d450ff60e36d83fb96.wav"}]},{"costumes":[{"assetId":"12df676719756c4d0050bc8123b7f9ad","name":"soph-default","bitmapResolution":2,"md5ext":"12df676719756c4d0050bc8123b7f9ad.png","dataFormat":"png","rotationCenterX":36,"rotationCenterY":100}],"sounds":[{"assetId":"1727f65b5f22d151685b8e5917456a60","name":"basketball bounce","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":8129,"md5ext":"1727f65b5f22d151685b8e5917456a60.wav"}]},{"costumes":[{"assetId":"ef5c17601d7d173495c7de6cc757a596","name":"Wizard1","bitmapResolution":2,"md5ext":"ef5c17601d7d173495c7de6cc757a596.png","dataFormat":"png","rotationCenterX":72,"rotationCenterY":72},{"assetId":"121f6941e1d9ceac168960e7b43ad4b1","name":"Wizard2","bitmapResolution":2,"md5ext":"121f6941e1d9ceac168960e7b43ad4b1.png","dataFormat":"png","rotationCenterX":80,"rotationCenterY":84}],"sounds":[{"assetId":"1727f65b5f22d151685b8e5917456a60","name":"basketball bounce","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":8129,"md5ext":"1727f65b5f22d151685b8e5917456a60.wav"}]},{"costumes":[{"assetId":"fff498b6add705de0cf11dc176b87219","name":"Truck-a","bitmapResolution":1,"md5ext":"fff498b6add705de0cf11dc176b87219.svg","dataFormat":"svg","rotationCenterX":174,"rotationCenterY":49},{"assetId":"a4a757dff6c5dc72b154d439b8403041","name":"Truck-b","bitmapResolution":1,"md5ext":"a4a757dff6c5dc72b154d439b8403041.svg","dataFormat":"svg","rotationCenterX":174,"rotationCenterY":58},{"assetId":"ce077e6db3573062017f94c2e4a8caea","name":"Truck-c","bitmapResolution":1,"md5ext":"ce077e6db3573062017f94c2e4a8caea.svg","dataFormat":"svg","rotationCenterX":173.67363114754104,"rotationCenterY":57.74000000000001},{"assetId":"10a62bacf94cef5ef4ea7372fc719589","name":"sprite6_0","bitmapResolution":2,"md5ext":"10a62bacf94cef5ef4ea7372fc719589.png","dataFormat":"png","rotationCenterX":258,"rotationCenterY":159}],"sounds":[{"assetId":"67aadcd28620ecdcdee2ad8eeebefa20","name":"toy honk","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":11177,"md5ext":"67aadcd28620ecdcdee2ad8eeebefa20.wav"},{"assetId":"f166adeb1ae3213f3951b267e5b7de22","name":"Engine","dataFormat":"wav","format":"","rate":48000,"sampleCount":97608,"md5ext":"f166adeb1ae3213f3951b267e5b7de22.wav"}]},{"costumes":[{"assetId":"814fd8eae9751c0fa3eb0efca47ef78c","name":"spr_rally_0","bitmapResolution":2,"md5ext":"814fd8eae9751c0fa3eb0efca47ef78c.png","dataFormat":"png","rotationCenterX":252,"rotationCenterY":81}],"sounds":[{"assetId":"ead1da4a87ff6cb53441142f7ac37b8f","name":"Car Vroom","dataFormat":"wav","rate":22050,"sampleCount":43689,"md5ext":"ead1da4a87ff6cb53441142f7ac37b8f.wav"},{"assetId":"1da43f6d52d0615da8a250e28100a80d","name":"computer beeps1","dataFormat":"wav","format":"","rate":48000,"sampleCount":83591,"md5ext":"1da43f6d52d0615da8a250e28100a80d.wav"},{"assetId":"28c76b6bebd04be1383fe9ba4933d263","name":"computer beeps2","dataFormat":"wav","format":"","rate":48000,"sampleCount":41517,"md5ext":"28c76b6bebd04be1383fe9ba4933d263.wav"}]}]}
},{}],40:[function(require,module,exports){
module.exports={"targets":[{"costumes":[{"assetId":"531a943ae6e8b7d9ea34641277495d6e","name":"Navajo and Mali Landscape","bitmapResolution":1,"md5ext":"531a943ae6e8b7d9ea34641277495d6e.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180},{"assetId":"bce115696f675f33f294c1a3a046999d","name":"stage1","bitmapResolution":1,"md5ext":"bce115696f675f33f294c1a3a046999d.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180},{"assetId":"6aa914e018b22b80afeb554e00605371","name":"stage2","bitmapResolution":2,"md5ext":"6aa914e018b22b80afeb554e00605371.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"5c82649ac57f9afee84c2000bca488d3","name":"nativeAmericanFlute","bitmapResolution":2,"md5ext":"5c82649ac57f9afee84c2000bca488d3.png","dataFormat":"png","rotationCenterX":183,"rotationCenterY":82}],"sounds":[{"assetId":"0f0f24fc2b4e03758aa90109b7e3e305","name":"Navajo Flute","dataFormat":"wav","format":"","rate":48000,"sampleCount":525792,"md5ext":"0f0f24fc2b4e03758aa90109b7e3e305.wav"}]},{"costumes":[{"assetId":"be468a30068ed2d20eba3b7c846e01f9","name":"center","bitmapResolution":1,"md5ext":"be468a30068ed2d20eba3b7c846e01f9.svg","dataFormat":"svg","rotationCenterX":38,"rotationCenterY":89},{"assetId":"e3dbd1ca8d3930596eebdb085f39cda0","name":"left","bitmapResolution":1,"md5ext":"e3dbd1ca8d3930596eebdb085f39cda0.svg","dataFormat":"svg","rotationCenterX":38,"rotationCenterY":88},{"assetId":"74e08f63bab1c64492bfa74fb0623151","name":"center2","bitmapResolution":1,"md5ext":"74e08f63bab1c64492bfa74fb0623151.svg","dataFormat":"svg","rotationCenterX":37,"rotationCenterY":88},{"assetId":"93f5413f632b3c468399cd6a079465d2","name":"right","bitmapResolution":1,"md5ext":"93f5413f632b3c468399cd6a079465d2.svg","dataFormat":"svg","rotationCenterX":38,"rotationCenterY":89}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"4002dacaac89b9c133d9510b966b55e3","name":"AfricanDrum","bitmapResolution":2,"md5ext":"4002dacaac89b9c133d9510b966b55e3.png","dataFormat":"png","rotationCenterX":95,"rotationCenterY":133}],"sounds":[{"assetId":"b6e43d1f6ac8d8f082c171f20c2612cb","name":"djembe","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":176785,"md5ext":"b6e43d1f6ac8d8f082c171f20c2612cb.wav"}]},{"costumes":[{"assetId":"7aed63bae8d366377e1b1ac7c534763c","name":"center","bitmapResolution":1,"md5ext":"7aed63bae8d366377e1b1ac7c534763c.svg","dataFormat":"svg","rotationCenterX":34,"rotationCenterY":84},{"assetId":"980d68ab932bfd08a77d6d1966d90539","name":"left","bitmapResolution":1,"md5ext":"980d68ab932bfd08a77d6d1966d90539.svg","dataFormat":"svg","rotationCenterX":59,"rotationCenterY":86},{"assetId":"f93976ee08897d366808878ac5b442b7","name":"center2","bitmapResolution":1,"md5ext":"f93976ee08897d366808878ac5b442b7.svg","dataFormat":"svg","rotationCenterX":37,"rotationCenterY":80},{"assetId":"de518bbf2bb8fbab0337e28ae0458c62","name":"right","bitmapResolution":1,"md5ext":"de518bbf2bb8fbab0337e28ae0458c62.svg","dataFormat":"svg","rotationCenterX":38,"rotationCenterY":86}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"c2a9db148ab274e928edb961922d1604","name":"costume1","bitmapResolution":1,"md5ext":"c2a9db148ab274e928edb961922d1604.svg","dataFormat":"svg","rotationCenterX":79.5,"rotationCenterY":13.505882352941114}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]}]}
},{}],41:[function(require,module,exports){
module.exports={"targets":[{"costumes":[{"assetId":"4c2de8d082841594436e381c5212ae04","name":"webpage","bitmapResolution":1,"md5ext":"4c2de8d082841594436e381c5212ae04.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"af1c69446ae4d5463dd5855204b69c33","name":"Button1","bitmapResolution":1,"md5ext":"af1c69446ae4d5463dd5855204b69c33.svg","dataFormat":"svg","rotationCenterX":42.625,"rotationCenterY":43.367999999999995},{"assetId":"20d1b7cfb8af836a54fb4ba0519eff3a","name":"Button2","bitmapResolution":1,"md5ext":"20d1b7cfb8af836a54fb4ba0519eff3a.svg","dataFormat":"svg","rotationCenterX":42.625,"rotationCenterY":43.367999999999995}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"da8898468494ef7bf814d1f33bf28894","name":"ezgif-4-eedd4165d67b (3)3","bitmapResolution":2,"md5ext":"da8898468494ef7bf814d1f33bf28894.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"f617c46dc6b7863309ca1cf2c823c8f9","name":"ezgif-4-eedd4165d67b (3)2","bitmapResolution":2,"md5ext":"f617c46dc6b7863309ca1cf2c823c8f9.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"0ae671ea903b6ce592a37d5857950be6","name":"ezgif-4-eedd4165d67b (3)","bitmapResolution":2,"md5ext":"0ae671ea903b6ce592a37d5857950be6.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"848328445ad15fc023fa840585c6f52c","name":"ezgif-4-eedd4165d67b (3)4","bitmapResolution":2,"md5ext":"848328445ad15fc023fa840585c6f52c.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"acebd72c92c2fe47e55443cd0c2fb247","name":"ezgif-4-eedd4165d67b (3)6","bitmapResolution":2,"md5ext":"acebd72c92c2fe47e55443cd0c2fb247.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"10f5dcd0e150f52617e603d105b76b84","name":"ezgif-4-eedd4165d67b (3)7","bitmapResolution":2,"md5ext":"10f5dcd0e150f52617e603d105b76b84.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"bc1e776fb0765c9ce53dd909c04f60e4","name":"ezgif-4-eedd4165d67b (3)9","bitmapResolution":2,"md5ext":"bc1e776fb0765c9ce53dd909c04f60e4.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"792ee6cd74b591468f185197470d96a4","name":"ezgif-4-eedd4165d67b (3)10","bitmapResolution":2,"md5ext":"792ee6cd74b591468f185197470d96a4.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"2dbb6dbe05239634b1ba2c3a36fcf030","name":"ezgif-4-eedd4165d67b (3)11","bitmapResolution":2,"md5ext":"2dbb6dbe05239634b1ba2c3a36fcf030.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"f4769059acd3731124a66139434e6156","name":"ezgif-4-eedd4165d67b (3)12","bitmapResolution":2,"md5ext":"f4769059acd3731124a66139434e6156.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"3071c1c1cfe62f6a2a70d8eb919df44e","name":"ezgif-4-eedd4165d67b (3)14","bitmapResolution":2,"md5ext":"3071c1c1cfe62f6a2a70d8eb919df44e.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"373c46272176649ce96d2bd60ffdbac9","name":"ezgif-4-eedd4165d67b (3)16","bitmapResolution":2,"md5ext":"373c46272176649ce96d2bd60ffdbac9.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"712ff6d6ec4e6120565b18e761f8bdc6","name":"ezgif-4-eedd4165d67b (3)18","bitmapResolution":2,"md5ext":"712ff6d6ec4e6120565b18e761f8bdc6.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"e31f67f6d28a44d830f8ff5d92c7c333","name":"ezgif-4-eedd4165d67b (3)17","bitmapResolution":2,"md5ext":"e31f67f6d28a44d830f8ff5d92c7c333.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270},{"assetId":"6f86ba931b5ac778433439daedba7921","name":"ezgif-4-eedd4165d67b (3)19","bitmapResolution":2,"md5ext":"6f86ba931b5ac778433439daedba7921.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":270}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"b701e707a7fd85c62bd7910248fac43e","name":"Button3-b","bitmapResolution":1,"md5ext":"b701e707a7fd85c62bd7910248fac43e.svg","dataFormat":"svg","rotationCenterX":44.83099999999999,"rotationCenterY":31.180000000000007},{"assetId":"bdd57f79a31e0fff73a3454f743b4d83","name":"Button3-a","bitmapResolution":1,"md5ext":"bdd57f79a31e0fff73a3454f743b4d83.svg","dataFormat":"svg","rotationCenterX":44.83099999999999,"rotationCenterY":31.180000000000007}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]},{"costumes":[{"assetId":"0e1694bca8368b04a7ce59035a101351","name":"PBClara","bitmapResolution":2,"md5ext":"0e1694bca8368b04a7ce59035a101351.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"565873fc0a4bfacf81ea7135a0ebc082","name":"PBClara2","bitmapResolution":2,"md5ext":"565873fc0a4bfacf81ea7135a0ebc082.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"dc6f8a6bad1013723661ddb1a45c6b77","name":"PBClara3","bitmapResolution":2,"md5ext":"dc6f8a6bad1013723661ddb1a45c6b77.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"4e59346116d7ec85693391bcfef3612f","name":"PBClara4","bitmapResolution":2,"md5ext":"4e59346116d7ec85693391bcfef3612f.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"ad0a38597ba77b920093b899ad2b2481","name":"PBClara5","bitmapResolution":2,"md5ext":"ad0a38597ba77b920093b899ad2b2481.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"6a86db9adc2cbbff20e0d3460ad22fbe","name":"PBClara6","bitmapResolution":2,"md5ext":"6a86db9adc2cbbff20e0d3460ad22fbe.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"ffe2dc1d63d2719b07a3569a9758674a","name":"PBClara7","bitmapResolution":2,"md5ext":"ffe2dc1d63d2719b07a3569a9758674a.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"78f2c8cf19e87de3a3ffafc6562e321b","name":"PBClara8","bitmapResolution":2,"md5ext":"78f2c8cf19e87de3a3ffafc6562e321b.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"da92e68486039420ab2df96aacd19240","name":"PBClara9","bitmapResolution":2,"md5ext":"da92e68486039420ab2df96aacd19240.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"ab407e1649fec8bd3a6cbabda0016b37","name":"PBClara10","bitmapResolution":2,"md5ext":"ab407e1649fec8bd3a6cbabda0016b37.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"6260795eff075efce011bb2a3520069d","name":"PBClara11","bitmapResolution":2,"md5ext":"6260795eff075efce011bb2a3520069d.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"505f00d755f332a792d168f0a239039d","name":"PBClara12","bitmapResolution":2,"md5ext":"505f00d755f332a792d168f0a239039d.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"4c6727151d3755fe528586e8c10ce8ad","name":"PBClara13","bitmapResolution":2,"md5ext":"4c6727151d3755fe528586e8c10ce8ad.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"90e54fdd2d93c05d46a2eee959e47d18","name":"PBClara15","bitmapResolution":2,"md5ext":"90e54fdd2d93c05d46a2eee959e47d18.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"ba7710ce6d0cc85edda0cd1bbcc672a1","name":"PBClara14","bitmapResolution":2,"md5ext":"ba7710ce6d0cc85edda0cd1bbcc672a1.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"f26356e62fdedf65ac180b9bd3a29b05","name":"PBClara16","bitmapResolution":2,"md5ext":"f26356e62fdedf65ac180b9bd3a29b05.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"66daae8144492bb4bd86268e56c99a43","name":"PBClara17","bitmapResolution":2,"md5ext":"66daae8144492bb4bd86268e56c99a43.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"8629610701b24b9b0e04385c51d9b481","name":"PBClara18","bitmapResolution":2,"md5ext":"8629610701b24b9b0e04385c51d9b481.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"46af59e48f2e6925f3adb3db2c541dc6","name":"PBClara19","bitmapResolution":2,"md5ext":"46af59e48f2e6925f3adb3db2c541dc6.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180},{"assetId":"d52f16bf1cb1119708c7a1b5e460fda4","name":"PBClara20","bitmapResolution":2,"md5ext":"d52f16bf1cb1119708c7a1b5e460fda4.png","dataFormat":"png","rotationCenterX":320,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}]}]}
},{}],42:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "2b0bddaf727e6bb95131290ae2549ac4",
                    "name": "background3",
                    "bitmapResolution": 2,
                    "md5ext": "2b0bddaf727e6bb95131290ae2549ac4.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Carl the Cloud",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "*bF;3|^5/zs4N0xR-o)Z": {
                    "opcode": "event_whenflagclicked",
                    "next": "0*OA)5OE]%a]*%IA%B{6",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 18,
                    "y": 46
                },
                "0*OA)5OE]%a]*%IA%B{6": {
                    "opcode": "motion_gotoxy",
                    "next": "`4;L4Q?o6CqFmdbH?:ms",
                    "parent": "*bF;3|^5/zs4N0xR-o)Z",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-200"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "80"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "`4;L4Q?o6CqFmdbH?:ms": {
                    "opcode": "motion_movesteps",
                    "next": "ksrg)n@E2SyN{;oWEX7E",
                    "parent": "0*OA)5OE]%a]*%IA%B{6",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "ksrg)n@E2SyN{;oWEX7E": {
                    "opcode": "looks_sayforsecs",
                    "next": "ahLTJjNBf`+1#.[qNZE4",
                    "parent": "`4;L4Q?o6CqFmdbH?:ms",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hello!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "ahLTJjNBf`+1#.[qNZE4": {
                    "opcode": "motion_movesteps",
                    "next": "d7d]Z%r*QDEp-ajssm0T",
                    "parent": "ksrg)n@E2SyN{;oWEX7E",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "d7d]Z%r*QDEp-ajssm0T": {
                    "opcode": "looks_sayforsecs",
                    "next": "=n_7]#{Cxj6pf!BUV,OP",
                    "parent": "ahLTJjNBf`+1#.[qNZE4",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Welcome to Scratch!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "=n_7]#{Cxj6pf!BUV,OP": {
                    "opcode": "motion_movesteps",
                    "next": "8K5Ak(+XsZvwjx2V0~D)",
                    "parent": "d7d]Z%r*QDEp-ajssm0T",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "8K5Ak(+XsZvwjx2V0~D)": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "=n_7]#{Cxj6pf!BUV,OP",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click the Space Bar to see Helen the Amazing Color Changing Hedgehog."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "5"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "be898107fe99d3c8a66152520abfcc9b",
                    "name": "costume1",
                    "bitmapResolution": 2,
                    "md5ext": "be898107fe99d3c8a66152520abfcc9b.png",
                    "dataFormat": "png",
                    "rotationCenterX": 80,
                    "rotationCenterY": 57
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": -50,
            "y": 80,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Helen the Hedgehog",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "XYmoOsQpwwb~bRU[WtDb": {
                    "opcode": "event_whenkeypressed",
                    "next": "NX*(%@1qK}o{lJ)1dp(L",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 56,
                    "y": 66
                },
                "NX*(%@1qK}o{lJ)1dp(L": {
                    "opcode": "looks_switchcostumeto",
                    "next": "A*?(6=CMw!5NQvy3GoJz",
                    "parent": "XYmoOsQpwwb~bRU[WtDb",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "uxs{_T(3Fk%RETANj%^X"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "uxs{_T(3Fk%RETANj%^X": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "NX*(%@1qK}o{lJ)1dp(L",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "hedgehog_red",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "A*?(6=CMw!5NQvy3GoJz": {
                    "opcode": "control_repeat",
                    "next": null,
                    "parent": "NX*(%@1qK}o{lJ)1dp(L",
                    "inputs": {
                        "TIMES": [
                            1,
                            [
                                6,
                                "6"
                            ]
                        ],
                        "SUBSTACK": [
                            2,
                            "*i@~ROBKeTP[#l_7v/_-"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "*i@~ROBKeTP[#l_7v/_-": {
                    "opcode": "control_wait",
                    "next": "MkZ9YIg7M,WuN@FR]l:o",
                    "parent": "A*?(6=CMw!5NQvy3GoJz",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "MkZ9YIg7M,WuN@FR]l:o": {
                    "opcode": "looks_nextcostume",
                    "next": null,
                    "parent": "*i@~ROBKeTP[#l_7v/_-",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "3?,1QT}D[0#@^jvT!J*^": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "gPD.*ilWONI2U7F-SE[}",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 51,
                    "y": 455
                },
                "gPD.*ilWONI2U7F-SE[}": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "3?,1QT}D[0#@^jvT!J*^",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Ouch!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "6a7187ad3551e84cd59e1afc3def9e33",
                    "name": "hedgehog_red",
                    "bitmapResolution": 2,
                    "md5ext": "6a7187ad3551e84cd59e1afc3def9e33.png",
                    "dataFormat": "png",
                    "rotationCenterX": 11,
                    "rotationCenterY": 128
                },
                {
                    "assetId": "7aa13cc8e70535af7ce3eb7e2c837ac9",
                    "name": "hedgehog_orange",
                    "bitmapResolution": 2,
                    "md5ext": "7aa13cc8e70535af7ce3eb7e2c837ac9.png",
                    "dataFormat": "png",
                    "rotationCenterX": 13,
                    "rotationCenterY": 129
                },
                {
                    "assetId": "26cd02f23af4877b70065edd86d0654a",
                    "name": "hedgehog_yellow",
                    "bitmapResolution": 2,
                    "md5ext": "26cd02f23af4877b70065edd86d0654a.png",
                    "dataFormat": "png",
                    "rotationCenterX": 12,
                    "rotationCenterY": 130
                },
                {
                    "assetId": "6d13e86dd79531c19d03c25cdee8bee5",
                    "name": "hedgehog_green",
                    "bitmapResolution": 2,
                    "md5ext": "6d13e86dd79531c19d03c25cdee8bee5.png",
                    "dataFormat": "png",
                    "rotationCenterX": 13,
                    "rotationCenterY": 128
                },
                {
                    "assetId": "4047bdbf75d8b7076268f7779b833d18",
                    "name": "hedgehog_blue",
                    "bitmapResolution": 2,
                    "md5ext": "4047bdbf75d8b7076268f7779b833d18.png",
                    "dataFormat": "png",
                    "rotationCenterX": 12,
                    "rotationCenterY": 128
                },
                {
                    "assetId": "7b435be3a639d4d937c9653fbb72382d",
                    "name": "hedgehog_purple",
                    "bitmapResolution": 2,
                    "md5ext": "7b435be3a639d4d937c9653fbb72382d.png",
                    "dataFormat": "png",
                    "rotationCenterX": 13,
                    "rotationCenterY": 129
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 99,
            "y": -50.99999999999998,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [
        {
            "id": "undefined_costumenumbername_number",
            "mode": "default",
            "opcode": "looks_costumenumbername",
            "params": {
                "NUMBER_NAME": "number"
            },
            "spriteName": "Helen",
            "value": "",
            "width": 0,
            "height": 0,
            "x": 5,
            "y": 5,
            "visible": false,
            "sliderMin": 0,
            "sliderMax": 100,
            "isDiscrete": true
        }
    ],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}
},{}],43:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "e6bf56f64eb4e7e6c97ec6c97e90d023",
                    "name": "Holi Background",
                    "bitmapResolution": 1,
                    "md5ext": "e6bf56f64eb4e7e6c97ec6c97e90d023.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 240,
                    "rotationCenterY": 180
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Neha",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "6*c`Xv=UPZ2te:JB2+U*": {
                    "opcode": "event_whenflagclicked",
                    "next": "1,sGaB#:WD/!fp4ecgw=",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": -67,
                    "y": -587
                },
                "1,sGaB#:WD/!fp4ecgw=": {
                    "opcode": "motion_gotoxy",
                    "next": "0*gfG!}+dNBRamr1EdBt",
                    "parent": "6*c`Xv=UPZ2te:JB2+U*",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "28"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-51"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "0*gfG!}+dNBRamr1EdBt": {
                    "opcode": "looks_switchcostumeto",
                    "next": "y;SD_2:1H=d-=o]rf3Nq",
                    "parent": "1,sGaB#:WD/!fp4ecgw=",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "-XUo5ONrDRD76UyvwKL?"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "-XUo5ONrDRD76UyvwKL?": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "0*gfG!}+dNBRamr1EdBt",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "Neha1",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "y;SD_2:1H=d-=o]rf3Nq": {
                    "opcode": "control_wait",
                    "next": "#;GgQ}*l)tV4E{1NPadV",
                    "parent": "0*gfG!}+dNBRamr1EdBt",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "#;GgQ}*l)tV4E{1NPadV": {
                    "opcode": "looks_sayforsecs",
                    "next": "GBVU3I7+QD=TSfHx]bhU",
                    "parent": "y;SD_2:1H=d-=o]rf3Nq",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hi, I'm Neha!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "GBVU3I7+QD=TSfHx]bhU": {
                    "opcode": "looks_sayforsecs",
                    "next": "lTPM~|:Xs,_if#cv*}5O",
                    "parent": "#;GgQ}*l)tV4E{1NPadV",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "We are celebrating Holi, a traditional Hindu festival from India!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "4"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "lTPM~|:Xs,_if#cv*}5O": {
                    "opcode": "looks_sayforsecs",
                    "next": "n%]__?|Z8]rI5Nb?gViq",
                    "parent": "GBVU3I7+QD=TSfHx]bhU",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "We use colorful powders and pastes to celebrate the beginning of Spring!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "4"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "n%]__?|Z8]rI5Nb?gViq": {
                    "opcode": "looks_sayforsecs",
                    "next": ",M3195%JsXVXc(d1Zg:L",
                    "parent": "lTPM~|:Xs,_if#cv*}5O",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I'm holding some gulal!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ",M3195%JsXVXc(d1Zg:L": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "n%]__?|Z8]rI5Nb?gViq",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Press the space bar to meet my friends!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "|0_-JyE+)[h*:1fdtiA4": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "^oA(iul1kHd(0wr^6Bw{",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": -69,
                    "y": -82
                },
                "^oA(iul1kHd(0wr^6Bw{": {
                    "opcode": "looks_switchcostumeto",
                    "next": "|7PoJdXk{ra2Uw|t`GbT",
                    "parent": "|0_-JyE+)[h*:1fdtiA4",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "N9bZPF:pJOq6u.zxph*s"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "N9bZPF:pJOq6u.zxph*s": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "^oA(iul1kHd(0wr^6Bw{",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "Neha1",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "|7PoJdXk{ra2Uw|t`GbT": {
                    "opcode": "looks_sayforsecs",
                    "next": "Om]!9q+lw!s+4zF:/CG!",
                    "parent": "^oA(iul1kHd(0wr^6Bw{",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "3..."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Om]!9q+lw!s+4zF:/CG!": {
                    "opcode": "looks_sayforsecs",
                    "next": "J6bm|w{z^q-RA%hf)afc",
                    "parent": "|7PoJdXk{ra2Uw|t`GbT",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "2..."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "J6bm|w{z^q-RA%hf)afc": {
                    "opcode": "looks_sayforsecs",
                    "next": "dBNdJtA%:m:n8TAUuL^K",
                    "parent": "Om]!9q+lw!s+4zF:/CG!",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "1!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "dBNdJtA%:m:n8TAUuL^K": {
                    "opcode": "control_repeat",
                    "next": "GV:wKN`D#AUVaKS?5jmD",
                    "parent": "J6bm|w{z^q-RA%hf)afc",
                    "inputs": {
                        "TIMES": [
                            1,
                            [
                                6,
                                "4"
                            ]
                        ],
                        "SUBSTACK": [
                            2,
                            "x@m(|CWR`%*`#b~;!2OT"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "x@m(|CWR`%*`#b~;!2OT": {
                    "opcode": "control_wait",
                    "next": ".Z=GpTw~p|F,B38JSn^t",
                    "parent": "dBNdJtA%:m:n8TAUuL^K",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                "0.7"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ".Z=GpTw~p|F,B38JSn^t": {
                    "opcode": "looks_nextcostume",
                    "next": null,
                    "parent": "x@m(|CWR`%*`#b~;!2OT",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "GV:wKN`D#AUVaKS?5jmD": {
                    "opcode": "looks_say",
                    "next": null,
                    "parent": "dBNdJtA%:m:n8TAUuL^K",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Happy Holi!"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "588e1905e5323f75328276def2ac0116",
                    "name": "Neha1",
                    "bitmapResolution": 1,
                    "md5ext": "588e1905e5323f75328276def2ac0116.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 45.99999113010236,
                    "rotationCenterY": 87
                },
                {
                    "assetId": "8a174573e7d4a7885954acd2afad19ea",
                    "name": "Neha2",
                    "bitmapResolution": 1,
                    "md5ext": "8a174573e7d4a7885954acd2afad19ea.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 123.41460248739168,
                    "rotationCenterY": 114.40293820688679
                },
                {
                    "assetId": "500b791f9f077dd2377bc56033912b9a",
                    "name": "Neha3",
                    "bitmapResolution": 1,
                    "md5ext": "500b791f9f077dd2377bc56033912b9a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 133.59915850034727,
                    "rotationCenterY": 174.0481588381853
                },
                {
                    "assetId": "c53eeb50bcdf509cb1522d378c9e380b",
                    "name": "Neha4",
                    "bitmapResolution": 1,
                    "md5ext": "c53eeb50bcdf509cb1522d378c9e380b.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 128.6803772733968,
                    "rotationCenterY": 116.40943091603478
                },
                {
                    "assetId": "9d660677a26fe0b657bc3e43da838c8e",
                    "name": "Neha5",
                    "bitmapResolution": 1,
                    "md5ext": "9d660677a26fe0b657bc3e43da838c8e.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 90.9947,
                    "rotationCenterY": 85.4763088644717
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": 28,
            "y": -51,
            "size": 139.99999999999997,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Brad",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "CBEwU.S^!3v*m}+l(2:*": {
                    "opcode": "event_whenflagclicked",
                    "next": "R|3)LWe?;VLJtzxlX@8}",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "R|3)LWe?;VLJtzxlX@8}": {
                    "opcode": "motion_gotoxy",
                    "next": "9sO:y?e(89=wDBQEX*84",
                    "parent": "CBEwU.S^!3v*m}+l(2:*",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                220
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                -13
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "9sO:y?e(89=wDBQEX*84": {
                    "opcode": "looks_switchcostumeto",
                    "next": null,
                    "parent": "R|3)LWe?;VLJtzxlX@8}",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "4!H7s8i9Lh.C(?SHMT_O"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "4!H7s8i9Lh.C(?SHMT_O": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "9sO:y?e(89=wDBQEX*84",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "Brad1"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "7rU;-waLK?7n!U94pB].": {
                    "opcode": "event_whenkeypressed",
                    "next": "BYyQeX2S2e2l[UHn#0bq",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space"
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 32,
                    "y": 304
                },
                "BYyQeX2S2e2l[UHn#0bq": {
                    "opcode": "motion_movesteps",
                    "next": "SpljqntHJxfGDV;.4%#M",
                    "parent": "7rU;-waLK?7n!U94pB].",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                -64
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "SpljqntHJxfGDV;.4%#M": {
                    "opcode": "looks_sayforsecs",
                    "next": "m+[^4mRsSN%SjOXJ}+_t",
                    "parent": "BYyQeX2S2e2l[UHn#0bq",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hello, I'm Brad!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                3
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "m+[^4mRsSN%SjOXJ}+_t": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "SpljqntHJxfGDV;.4%#M",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I'm holding a pichkari, a water squirter filled with colored water!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                6
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "dae278db1e4c65e9b70d966aa9a40429",
                    "name": "Brad1",
                    "bitmapResolution": 1,
                    "md5ext": "dae278db1e4c65e9b70d966aa9a40429.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37.99999373388661,
                    "rotationCenterY": 86.99998370205938
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 220,
            "y": -13,
            "size": 135.00000000000003,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Kristen",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "[M~hMK`q/NYs#*-;ZiuH": {
                    "opcode": "event_whenflagclicked",
                    "next": "H~_UJ8~bO+^zXvT^^^le",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "H~_UJ8~bO+^zXvT^^^le": {
                    "opcode": "motion_gotoxy",
                    "next": "@DsqwPSbeqW_?Pi{uYT]",
                    "parent": "[M~hMK`q/NYs#*-;ZiuH",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                -215
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                -13
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "@DsqwPSbeqW_?Pi{uYT]": {
                    "opcode": "looks_switchcostumeto",
                    "next": null,
                    "parent": "H~_UJ8~bO+^zXvT^^^le",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "?+RpBU3RL5~YKwsi/rIw"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "?+RpBU3RL5~YKwsi/rIw": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "@DsqwPSbeqW_?Pi{uYT]",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "Kristen1"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "Jf4;4?`|e1udP=94]ErE": {
                    "opcode": "event_whenkeypressed",
                    "next": "9aY%RY8/M5ayiAqP@a7U",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space"
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 27,
                    "y": 261
                },
                "9aY%RY8/M5ayiAqP@a7U": {
                    "opcode": "control_wait",
                    "next": "Pz:xDRpqyDJNLlR5?;,0",
                    "parent": "Jf4;4?`|e1udP=94]ErE",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                "10"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "Pz:xDRpqyDJNLlR5?;,0": {
                    "opcode": "motion_movesteps",
                    "next": "-n-db;lg-!(lyaGFo;AQ",
                    "parent": "9aY%RY8/M5ayiAqP@a7U",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                64
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "-n-db;lg-!(lyaGFo;AQ": {
                    "opcode": "looks_sayforsecs",
                    "next": "4*Ly{a-GE~GGb~khP7#P",
                    "parent": "Pz:xDRpqyDJNLlR5?;,0",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hi, I'm Kristen!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                3
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "4*Ly{a-GE~GGb~khP7#P": {
                    "opcode": "looks_sayforsecs",
                    "next": "(P/J:UdY/Q,8|p4}V!P=",
                    "parent": "-n-db;lg-!(lyaGFo;AQ",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "I'm using squeeze bottles."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                4
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "(P/J:UdY/Q,8|p4}V!P=": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "4*Ly{a-GE~GGb~khP7#P",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click on Neha to see her celebrate!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "4"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "5c740972a1f49202719b50e896bd0cf6",
                    "name": "Kristen1",
                    "bitmapResolution": 1,
                    "md5ext": "5c740972a1f49202719b50e896bd0cf6.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 62.000001871426775,
                    "rotationCenterY": 87.08308115522249
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1032,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": -215,
            "y": -13,
            "size": 135.00000000000003,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}
},{}],44:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 3,
            "costumes": [
                {
                    "assetId": "2b0bddaf727e6bb95131290ae2549ac4",
                    "name": "background3",
                    "bitmapResolution": 2,
                    "md5ext": "2b0bddaf727e6bb95131290ae2549ac4.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                },
                {
                    "assetId": "a81668321aa3dcc0fc185d3e36ae76f6",
                    "name": "Room 1",
                    "bitmapResolution": 2,
                    "md5ext": "a81668321aa3dcc0fc185d3e36ae76f6.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                },
                {
                    "assetId": "e5f794c8756ca0cead5cb7e7fe354c41",
                    "name": "Playground",
                    "bitmapResolution": 2,
                    "md5ext": "e5f794c8756ca0cead5cb7e7fe354c41.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                },
                {
                    "assetId": "38be88e8026768d4606fe1932b05d258",
                    "name": "backdrop",
                    "bitmapResolution": 2,
                    "md5ext": "38be88e8026768d4606fe1932b05d258.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 48000,
                    "sampleCount": 1123,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "India",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "{?%H[3PODtzIOzw3NUAD": {
                    "opcode": "event_whenflagclicked",
                    "next": "X9F`sK3d.L!x-cTWVaGz",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 0,
                    "y": 0
                },
                "X9F`sK3d.L!x-cTWVaGz": {
                    "opcode": "motion_gotoxy",
                    "next": "kBZo|n~NnzgG!crdI1E;",
                    "parent": "{?%H[3PODtzIOzw3NUAD",
                    "inputs": {
                        "X": [
                            1,
                            [
                                4,
                                "-215"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-145"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "kBZo|n~NnzgG!crdI1E;": {
                    "opcode": "motion_movesteps",
                    "next": "u=@^[0kNfQx.2*Xvk0TX",
                    "parent": "X9F`sK3d.L!x-cTWVaGz",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "u=@^[0kNfQx.2*Xvk0TX": {
                    "opcode": "looks_sayforsecs",
                    "next": "C;QZb9TtC1(Ov9vkC+$f",
                    "parent": "kBZo|n~NnzgG!crdI1E;",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hello! My name is India."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "C;QZb9TtC1(Ov9vkC+$f": {
                    "opcode": "motion_movesteps",
                    "next": "=6=T6QR$yee::D$b8~s{",
                    "parent": "u=@^[0kNfQx.2*Xvk0TX",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "=6=T6QR$yee::D$b8~s{": {
                    "opcode": "looks_sayforsecs",
                    "next": ",`%kTB=!2Lz#4m!W2OpL",
                    "parent": "C;QZb9TtC1(Ov9vkC+$f",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Welcome to Scratch!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "3"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ",`%kTB=!2Lz#4m!W2OpL": {
                    "opcode": "motion_movesteps",
                    "next": "{Ipink+*Ul#QILZqGvdF",
                    "parent": "=6=T6QR$yee::D$b8~s{",
                    "inputs": {
                        "STEPS": [
                            1,
                            [
                                4,
                                "50"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "{Ipink+*Ul#QILZqGvdF": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": ",`%kTB=!2Lz#4m!W2OpL",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Click the Space Bar to see some of the things I like."
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "5"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "fec9549b732165ec6d09991de08b69cd",
                    "name": "character (1)",
                    "bitmapResolution": 1,
                    "md5ext": "fec9549b732165ec6d09991de08b69cd.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 78.87000274658203,
                    "rotationCenterY": 165.80999755859375
                }
            ],
            "sounds": [],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": -165,
            "y": -145,
            "size": 162.8369844855632,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "easel",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "XYmoOsQpwwb~bRU[WtDb": {
                    "opcode": "event_whenkeypressed",
                    "next": "NX*(%@1qK}o{lJ)1dp(L",
                    "parent": null,
                    "inputs": {},
                    "fields": {
                        "KEY_OPTION": [
                            "space",
                            null
                        ]
                    },
                    "shadow": false,
                    "topLevel": true,
                    "x": 56,
                    "y": 66
                },
                "NX*(%@1qK}o{lJ)1dp(L": {
                    "opcode": "looks_switchcostumeto",
                    "next": "A*?(6=CMw!5NQvy3GoJz",
                    "parent": "XYmoOsQpwwb~bRU[WtDb",
                    "inputs": {
                        "COSTUME": [
                            1,
                            "uxs{_T(3Fk%RETANj%^X"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "uxs{_T(3Fk%RETANj%^X": {
                    "opcode": "looks_costume",
                    "next": null,
                    "parent": "NX*(%@1qK}o{lJ)1dp(L",
                    "inputs": {},
                    "fields": {
                        "COSTUME": [
                            "easel-music",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "A*?(6=CMw!5NQvy3GoJz": {
                    "opcode": "control_repeat",
                    "next": null,
                    "parent": "NX*(%@1qK}o{lJ)1dp(L",
                    "inputs": {
                        "TIMES": [
                            1,
                            [
                                6,
                                "7"
                            ]
                        ],
                        "SUBSTACK": [
                            2,
                            "MkZ9YIg7M,WuN@FR]l:o"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "MkZ9YIg7M,WuN@FR]l:o": {
                    "opcode": "looks_nextcostume",
                    "next": "*i@~ROBKeTP[#l_7v/_-",
                    "parent": "A*?(6=CMw!5NQvy3GoJz",
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "*i@~ROBKeTP[#l_7v/_-": {
                    "opcode": "control_wait",
                    "next": null,
                    "parent": "MkZ9YIg7M,WuN@FR]l:o",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                "1"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "3?,1QT}D[0#@^jvT!J*^": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "gPD.*ilWONI2U7F-SE[}",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 51,
                    "y": 455
                },
                "gPD.*ilWONI2U7F-SE[}": {
                    "opcode": "looks_sayforsecs",
                    "next": null,
                    "parent": "3?,1QT}D[0#@^jvT!J*^",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Tada!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                "2"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 7,
            "costumes": [
                {
                    "assetId": "47a257ec82df9b221a9c8a0da1174652",
                    "name": "easel",
                    "bitmapResolution": 1,
                    "md5ext": "47a257ec82df9b221a9c8a0da1174652.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 72,
                    "rotationCenterY": 100.5
                },
                {
                    "assetId": "f80c9c273a7542f28fc0a0aa16f80532",
                    "name": "easel-sports",
                    "bitmapResolution": 1,
                    "md5ext": "f80c9c273a7542f28fc0a0aa16f80532.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "25fc936818594e0f67f48ffd39ee06b2",
                    "name": "easel-animals",
                    "bitmapResolution": 1,
                    "md5ext": "25fc936818594e0f67f48ffd39ee06b2.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "6a904db737d12cc410bd18e0e3837f1a",
                    "name": "easel-music",
                    "bitmapResolution": 1,
                    "md5ext": "6a904db737d12cc410bd18e0e3837f1a.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "eb955b9d6d17d5358e1c66ca5dbc4648",
                    "name": "easel-neighborhood",
                    "bitmapResolution": 1,
                    "md5ext": "eb955b9d6d17d5358e1c66ca5dbc4648.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "4c0e56f2cc17d497d76070033ab08654",
                    "name": "easel-travel",
                    "bitmapResolution": 1,
                    "md5ext": "4c0e56f2cc17d497d76070033ab08654.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "ba4d4b1af1eafdda9b882c0f51ced3ff",
                    "name": "easel-astronomy",
                    "bitmapResolution": 1,
                    "md5ext": "ba4d4b1af1eafdda9b882c0f51ced3ff.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                },
                {
                    "assetId": "b0841fa4e9ea101a530022a9b4758d14",
                    "name": "easel-video-games",
                    "bitmapResolution": 1,
                    "md5ext": "b0841fa4e9ea101a530022a9b4758d14.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 71.83499908447266,
                    "rotationCenterY": 99.56999969482422
                }
            ],
            "sounds": [],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 144,
            "y": -52,
            "size": 150,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [
        {
            "id": "undefined_costumenumbername_number",
            "mode": "default",
            "opcode": "looks_costumenumbername",
            "params": {
                "NUMBER_NAME": "number"
            },
            "spriteName": "Helen",
            "value": "",
            "width": 0,
            "height": 0,
            "x": 5,
            "y": 5,
            "visible": false,
            "sliderMin": 0,
            "sliderMax": 100,
            "isDiscrete": true
        }
    ],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190813192748",
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    }
}
},{}],45:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"7b59e3c3cd3ec7a9ff1499ae7ad0f79a","name":"hand in hallway iphone w: name","bitmapResolution":2,"md5ext":"7b59e3c3cd3ec7a9ff1499ae7ad0f79a.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Basketball","variables":{},"lists":{},"broadcasts":{},"blocks":{"Xv-Endey!BbY..-VD:)]":{"opcode":"event_whenflagclicked","next":"FG(H`DtDM]NB}C!M}x:j","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"FG(H`DtDM]NB}C!M}x:j":{"opcode":"sound_play","next":"I1KeKKubTFU?QWq7}Myu","parent":"Xv-Endey!BbY..-VD:)]","inputs":{"SOUND_MENU":[1,"`V#`75q{.O)!E0x*eNge"]},"fields":{},"shadow":false,"topLevel":false},"`V#`75q{.O)!E0x*eNge":{"opcode":"sound_sounds_menu","next":null,"parent":"FG(H`DtDM]NB}C!M}x:j","inputs":{},"fields":{"SOUND_MENU":["boing"]},"shadow":true,"topLevel":false},"I1KeKKubTFU?QWq7}Myu":{"opcode":"looks_thinkforsecs","next":"IfHnM9X)N2O%SYxhh?+r","parent":"FG(H`DtDM]NB}C!M}x:j","inputs":{"MESSAGE":[1,[10,"Hey!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"IfHnM9X)N2O%SYxhh?+r":{"opcode":"control_wait","next":null,"parent":"I1KeKKubTFU?QWq7}Myu","inputs":{"DURATION":[1,[5,2]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{"gV6Y}?gnF~}viknGKJxZ":{"blockId":null,"x":444,"y":39.6,"width":261,"height":325.6,"minimized":false,"text":"Add two more lines of text to the conversation - one for each sprite. \r\rBe sure to use wait blocks to synchronize the conversation! "}},"currentCostume":0,"costumes":[{"assetId":"c5e41b7b0c37fa47d850e58e13f2c2c6","name":"basketball","bitmapResolution":1,"md5ext":"c5e41b7b0c37fa47d850e58e13f2c2c6.svg","dataFormat":"svg","rotationCenterX":36,"rotationCenterY":-17}],"sounds":[{"assetId":"53a3c2e27d1fb5fdb14aaf0cb41e7889","name":"boing","dataFormat":"wav","format":"adpcm","rate":22050,"sampleCount":7113,"md5ext":"53a3c2e27d1fb5fdb14aaf0cb41e7889.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":16,"y":55,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Rainbow","variables":{},"lists":{},"broadcasts":{},"blocks":{"h%]_u4BasZFDtgMhl5UB":{"opcode":"event_whenflagclicked","next":"+;%OI3%-II/qzQh8QC8T","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"+;%OI3%-II/qzQh8QC8T":{"opcode":"control_wait","next":"slNuul3C|C,sDMI2jvR?","parent":"h%]_u4BasZFDtgMhl5UB","inputs":{"DURATION":[1,[5,2]]},"fields":{},"shadow":false,"topLevel":false},"slNuul3C|C,sDMI2jvR?":{"opcode":"sound_play","next":"Zu0dPVz+a,tNFA.pGF0E","parent":"+;%OI3%-II/qzQh8QC8T","inputs":{"SOUND_MENU":[1,"{:pWe[3-+.foJQ_Uy|5D"]},"fields":{},"shadow":false,"topLevel":false},"{:pWe[3-+.foJQ_Uy|5D":{"opcode":"sound_sounds_menu","next":null,"parent":"slNuul3C|C,sDMI2jvR?","inputs":{},"fields":{"SOUND_MENU":["pop"]},"shadow":true,"topLevel":false},"Zu0dPVz+a,tNFA.pGF0E":{"opcode":"looks_thinkforsecs","next":null,"parent":"slNuul3C|C,sDMI2jvR?","inputs":{"MESSAGE":[1,[10,"How r u?"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"4b5e631517784303a68b1be661a25e5d","name":"rainbow","bitmapResolution":1,"md5ext":"4b5e631517784303a68b1be661a25e5d.svg","dataFormat":"svg","rotationCenterX":72,"rotationCenterY":-24}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":true,"x":52,"y":-51,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190918022946","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"}}
},{}],46:[function(require,module,exports){
module.exports={
    "targets": [
        {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "7b59e3c3cd3ec7a9ff1499ae7ad0f79a",
                    "name": "hand in hallway iphone w: name",
                    "bitmapResolution": 2,
                    "md5ext": "7b59e3c3cd3ec7a9ff1499ae7ad0f79a.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 48000,
                    "sampleCount": 1123,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "off",
            "textToSpeechLanguage": null
        },
        {
            "isStage": false,
            "name": "Basketball",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "Xv-Endey!BbY..-VD:)]": {
                    "opcode": "event_whenflagclicked",
                    "next": "FG(H`DtDM]NB}C!M}x:j",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "FG(H`DtDM]NB}C!M}x:j": {
                    "opcode": "sound_play",
                    "next": "I1KeKKubTFU?QWq7}Myu",
                    "parent": "Xv-Endey!BbY..-VD:)]",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "`V#`75q{.O)!E0x*eNge"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "`V#`75q{.O)!E0x*eNge": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "FG(H`DtDM]NB}C!M}x:j",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "boing"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "I1KeKKubTFU?QWq7}Myu": {
                    "opcode": "looks_thinkforsecs",
                    "next": "IfHnM9X)N2O%SYxhh?+r",
                    "parent": "FG(H`DtDM]NB}C!M}x:j",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Hey!"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "IfHnM9X)N2O%SYxhh?+r": {
                    "opcode": "control_wait",
                    "next": null,
                    "parent": "I1KeKKubTFU?QWq7}Myu",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {
                "gV6Y}?gnF~}viknGKJxZ": {
                    "blockId": null,
                    "x": 444,
                    "y": 39.6,
                    "width": 261,
                    "height": 325.6,
                    "minimized": false,
                    "text": "Add two more lines of text to the conversation - one for each sprite. \r\rBe sure to use wait blocks to synchronize the conversation! "
                }
            },
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "c5e41b7b0c37fa47d850e58e13f2c2c6",
                    "name": "basketball",
                    "bitmapResolution": 1,
                    "md5ext": "c5e41b7b0c37fa47d850e58e13f2c2c6.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
                    "rotationCenterY": -17
                }
            ],
            "sounds": [
                {
                    "assetId": "53a3c2e27d1fb5fdb14aaf0cb41e7889",
                    "name": "boing",
                    "dataFormat": "wav",
                    "format": "adpcm",
                    "rate": 22050,
                    "sampleCount": 7113,
                    "md5ext": "53a3c2e27d1fb5fdb14aaf0cb41e7889.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 1,
            "visible": true,
            "x": 16,
            "y": 55,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "Rainbow",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "h%]_u4BasZFDtgMhl5UB": {
                    "opcode": "event_whenflagclicked",
                    "next": "+;%OI3%-II/qzQh8QC8T",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "+;%OI3%-II/qzQh8QC8T": {
                    "opcode": "control_wait",
                    "next": "slNuul3C|C,sDMI2jvR?",
                    "parent": "h%]_u4BasZFDtgMhl5UB",
                    "inputs": {
                        "DURATION": [
                            1,
                            [
                                5,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "slNuul3C|C,sDMI2jvR?": {
                    "opcode": "sound_play",
                    "next": "Zu0dPVz+a,tNFA.pGF0E",
                    "parent": "+;%OI3%-II/qzQh8QC8T",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "{:pWe[3-+.foJQ_Uy|5D"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "{:pWe[3-+.foJQ_Uy|5D": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "slNuul3C|C,sDMI2jvR?",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "pop"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "Zu0dPVz+a,tNFA.pGF0E": {
                    "opcode": "looks_thinkforsecs",
                    "next": null,
                    "parent": "slNuul3C|C,sDMI2jvR?",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "How r u?"
                            ]
                        ],
                        "SECS": [
                            1,
                            [
                                4,
                                2
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "4b5e631517784303a68b1be661a25e5d",
                    "name": "rainbow",
                    "bitmapResolution": 1,
                    "md5ext": "4b5e631517784303a68b1be661a25e5d.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 72,
                    "rotationCenterY": -24
                }
            ],
            "sounds": [
                {
                    "assetId": "83a9787d4cb6f3b7632b4ddfebf74367",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 48000,
                    "sampleCount": 1123,
                    "md5ext": "83a9787d4cb6f3b7632b4ddfebf74367.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 2,
            "visible": true,
            "x": 52,
            "y": -51,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        }
    ],
    "monitors": [],
    "extensions": [],
    "meta": {
        "semver": "3.0.0",
        "vm": "0.2.0-prerelease.20190918022946",
        "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
    }
}
},{}],47:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],48:[function(require,module,exports){
require('./grader');
require('./scratch3');

module.exports = class GradeTwoWaySyncL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/two-way-sync-L1-multicultural'),
            youthCulture:  require('./templates/two-way-sync-L1-youth-culture'),
            gaming:        require('./templates/two-way-sync-L1-gaming')
        };
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        this.strand = 'youthCulture';
        if (this.strand === 'multicultural') {

        }
        else if (this.strand === 'youthCulture') {
            this.requirements = [
                new Requirement('Add two more text messages to the conversation, one for each sprite.', this.testTalk(project)),
                new Requirement('Make the cow interrupt while the sheep\'s think bubble is still visible.', this.testSync(project))
            ]
            this.extensions = [
                new Extension('Add more messages to the texting conversation.', this.testExtraLines()),
                new Extension('Customize your project using sounds and other Scratch elements!', this.testCustom(project))
            ]
        }
        else if (this.strand === 'gaming') {

        }
    }

    messageTimes(script) {
        let times = [];
        for (let block of script.blocks) {
            if (opcodeLists.speak.includes(block.opcode)) {
                times.push(block.startTime);
            }
        }
        return times;
    }

    testTalk(project) {
        let spritesPassing = 0;
        let longerScript = false;
        for (let sprite of project.sprites) {
            let scriptsPassing = 0;
            for (let script of sprite.validScripts) {
                scriptsPassing += this.messageTimes(script).length > 1;
                if (this.messageTimes(script).length > 2) {
                    longerScript = true;
                }
            }
            spritesPassing += scriptsPassing > 0;
        }
        return (spritesPassing > 1 && longerScript);
    }

    testSync(project) {
        for (let sprite1 of project.sprites) {
            for (let sprite2 of project.sprites.filter(sprite => sprite !== sprite1)) {
                for (let script1 of sprite1.validScripts) {
                    for (let script2 of sprite2.validScripts) {
                        let messageTimes1 = this.messageTimes(script1);
                        let messageTimes2 = this.messageTimes(script2);
                        let synced = true;
                        for (let i = 0; i < messageTimes1.length && i < messageTimes2.length; i++) {
                            if (messageTimes1[i] >= messageTimes2[i]) {
                                synced = false;
                            }
                        }
                        let talksTwice = (messageTimes1.length > 1) && (messageTimes2.length > 1);
                        let talksMore  = (messageTimes1.length > 2) && (messageTimes2.length > 2);
                        if (synced && talksMore) {
                            this.extraLinesPassing = true;
                        }
                        if (synced && talksTwice) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    testExtraLines() {
        return this.extraLinesPassing;
    }

    testCustom() {
        return false; /// Working on a more general customization detector to deploy across graders
    }
}

},{"./grader":21,"./scratch3":26,"./templates/two-way-sync-L1-gaming":45,"./templates/two-way-sync-L1-multicultural":46,"./templates/two-way-sync-L1-youth-culture":47}],49:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":3,"costumes":[{"assetId":"2b0bddaf727e6bb95131290ae2549ac4","name":"background3","bitmapResolution":2,"md5ext":"2b0bddaf727e6bb95131290ae2549ac4.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"a81668321aa3dcc0fc185d3e36ae76f6","name":"Room 1","bitmapResolution":2,"md5ext":"a81668321aa3dcc0fc185d3e36ae76f6.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"e5f794c8756ca0cead5cb7e7fe354c41","name":"Playground","bitmapResolution":2,"md5ext":"e5f794c8756ca0cead5cb7e7fe354c41.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360},{"assetId":"38be88e8026768d4606fe1932b05d258","name":"backdrop","bitmapResolution":2,"md5ext":"38be88e8026768d4606fe1932b05d258.png","dataFormat":"png","rotationCenterX":480,"rotationCenterY":360}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":48000,"sampleCount":1123,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"India","variables":{},"lists":{},"broadcasts":{},"blocks":{"{?%H[3PODtzIOzw3NUAD":{"opcode":"event_whenflagclicked","next":"X9F`sK3d.L!x-cTWVaGz","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":0,"y":0},"X9F`sK3d.L!x-cTWVaGz":{"opcode":"motion_gotoxy","next":"kBZo|n~NnzgG!crdI1E;","parent":"{?%H[3PODtzIOzw3NUAD","inputs":{"X":[1,[4,"-215"]],"Y":[1,[4,"-145"]]},"fields":{},"shadow":false,"topLevel":false},"kBZo|n~NnzgG!crdI1E;":{"opcode":"motion_movesteps","next":"u=@^[0kNfQx.2*Xvk0TX","parent":"X9F`sK3d.L!x-cTWVaGz","inputs":{"STEPS":[1,[4,"50"]]},"fields":{},"shadow":false,"topLevel":false},"u=@^[0kNfQx.2*Xvk0TX":{"opcode":"looks_sayforsecs","next":"C;QZb9TtC1(Ov9vkC+$f","parent":"kBZo|n~NnzgG!crdI1E;","inputs":{"MESSAGE":[1,[10,"Hello! My name is India."]],"SECS":[1,[4,"3"]]},"fields":{},"shadow":false,"topLevel":false},"C;QZb9TtC1(Ov9vkC+$f":{"opcode":"motion_movesteps","next":"=6=T6QR$yee::D$b8~s{","parent":"u=@^[0kNfQx.2*Xvk0TX","inputs":{"STEPS":[1,[4,"50"]]},"fields":{},"shadow":false,"topLevel":false},"=6=T6QR$yee::D$b8~s{":{"opcode":"looks_sayforsecs","next":",`%kTB=!2Lz#4m!W2OpL","parent":"C;QZb9TtC1(Ov9vkC+$f","inputs":{"MESSAGE":[1,[10,"Welcome to Scratch!"]],"SECS":[1,[4,"3"]]},"fields":{},"shadow":false,"topLevel":false},",`%kTB=!2Lz#4m!W2OpL":{"opcode":"motion_movesteps","next":"{Ipink+*Ul#QILZqGvdF","parent":"=6=T6QR$yee::D$b8~s{","inputs":{"STEPS":[1,[4,"50"]]},"fields":{},"shadow":false,"topLevel":false},"{Ipink+*Ul#QILZqGvdF":{"opcode":"looks_sayforsecs","next":null,"parent":",`%kTB=!2Lz#4m!W2OpL","inputs":{"MESSAGE":[1,[10,"Click the Space Bar to see some of the things I like."]],"SECS":[1,[4,"5"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"fec9549b732165ec6d09991de08b69cd","name":"character (1)","bitmapResolution":1,"md5ext":"fec9549b732165ec6d09991de08b69cd.svg","dataFormat":"svg","rotationCenterX":78.87000274658203,"rotationCenterY":165.80999755859375}],"sounds":[],"volume":100,"layerOrder":2,"visible":true,"x":-165,"y":-145,"size":162.8369844855632,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"easel","variables":{},"lists":{},"broadcasts":{},"blocks":{"XYmoOsQpwwb~bRU[WtDb":{"opcode":"event_whenkeypressed","next":"NX*(%@1qK}o{lJ)1dp(L","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space",null]},"shadow":false,"topLevel":true,"x":56,"y":66},"NX*(%@1qK}o{lJ)1dp(L":{"opcode":"looks_switchcostumeto","next":"A*?(6=CMw!5NQvy3GoJz","parent":"XYmoOsQpwwb~bRU[WtDb","inputs":{"COSTUME":[1,"uxs{_T(3Fk%RETANj%^X"]},"fields":{},"shadow":false,"topLevel":false},"uxs{_T(3Fk%RETANj%^X":{"opcode":"looks_costume","next":null,"parent":"NX*(%@1qK}o{lJ)1dp(L","inputs":{},"fields":{"COSTUME":["easel-music",null]},"shadow":true,"topLevel":false},"A*?(6=CMw!5NQvy3GoJz":{"opcode":"control_repeat","next":null,"parent":"NX*(%@1qK}o{lJ)1dp(L","inputs":{"TIMES":[1,[6,"7"]],"SUBSTACK":[2,"MkZ9YIg7M,WuN@FR]l:o"]},"fields":{},"shadow":false,"topLevel":false},"MkZ9YIg7M,WuN@FR]l:o":{"opcode":"looks_nextcostume","next":"*i@~ROBKeTP[#l_7v/_-","parent":"A*?(6=CMw!5NQvy3GoJz","inputs":{},"fields":{},"shadow":false,"topLevel":false},"*i@~ROBKeTP[#l_7v/_-":{"opcode":"control_wait","next":null,"parent":"MkZ9YIg7M,WuN@FR]l:o","inputs":{"DURATION":[1,[5,"1"]]},"fields":{},"shadow":false,"topLevel":false},"3?,1QT}D[0#@^jvT!J*^":{"opcode":"event_whenthisspriteclicked","next":"gPD.*ilWONI2U7F-SE[}","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":51,"y":455},"gPD.*ilWONI2U7F-SE[}":{"opcode":"looks_sayforsecs","next":null,"parent":"3?,1QT}D[0#@^jvT!J*^","inputs":{"MESSAGE":[1,[10,"Tada!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":7,"costumes":[{"assetId":"47a257ec82df9b221a9c8a0da1174652","name":"easel","bitmapResolution":1,"md5ext":"47a257ec82df9b221a9c8a0da1174652.svg","dataFormat":"svg","rotationCenterX":72,"rotationCenterY":100.5},{"assetId":"f80c9c273a7542f28fc0a0aa16f80532","name":"easel-sports","bitmapResolution":1,"md5ext":"f80c9c273a7542f28fc0a0aa16f80532.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"25fc936818594e0f67f48ffd39ee06b2","name":"easel-animals","bitmapResolution":1,"md5ext":"25fc936818594e0f67f48ffd39ee06b2.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"6a904db737d12cc410bd18e0e3837f1a","name":"easel-music","bitmapResolution":1,"md5ext":"6a904db737d12cc410bd18e0e3837f1a.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"eb955b9d6d17d5358e1c66ca5dbc4648","name":"easel-neighborhood","bitmapResolution":1,"md5ext":"eb955b9d6d17d5358e1c66ca5dbc4648.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"4c0e56f2cc17d497d76070033ab08654","name":"easel-travel","bitmapResolution":1,"md5ext":"4c0e56f2cc17d497d76070033ab08654.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"ba4d4b1af1eafdda9b882c0f51ced3ff","name":"easel-astronomy","bitmapResolution":1,"md5ext":"ba4d4b1af1eafdda9b882c0f51ced3ff.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422},{"assetId":"b0841fa4e9ea101a530022a9b4758d14","name":"easel-video-games","bitmapResolution":1,"md5ext":"b0841fa4e9ea101a530022a9b4758d14.svg","dataFormat":"svg","rotationCenterX":71.83499908447266,"rotationCenterY":99.56999969482422}],"sounds":[],"volume":100,"layerOrder":1,"visible":true,"x":144,"y":-52,"size":150,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[{"id":"undefined_costumenumbername_number","mode":"default","opcode":"looks_costumenumbername","params":{"NUMBER_NAME":"number"},"spriteName":"Helen","value":"","width":0,"height":0,"x":5,"y":5,"visible":false,"sliderMin":0,"sliderMax":100,"isDiscrete":true}],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190813192748","agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}}
},{}],50:[function(require,module,exports){
/// Provides necessary scripts for HTML indices.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// Scratch Encore graders
let graders = {
    scratchBasicsL1:        { name: 'M1 - Scratch Basics L2',       file: require('./grading-scripts-s3/scratch-basics-L1') },
    scratchBasicsL2_create: { name: 'M1 - Scratch Basics L3',       file: require('./grading-scripts-s3/scratch-basics-L2') },
    eventsL1:               { name: 'M2 - Events L1',               file: require('./grading-scripts-s3/events-L1-syn') },
    eventsL2_create:        { name: 'M2 - Events L2',               file: require('./grading-scripts-s3/events-L2') },
    animationL1:            { name: 'M3 - Animation L1',            file: require('./grading-scripts-s3/animation-L1') },
    animationL2_create:     { name: 'M3 - Animation L2',            file: require('./grading-scripts-s3/animation-L2') },
    condLoopsL1:            { name: 'M4 - Conditional Loops L1',    file: require('./grading-scripts-s3/cond-loops-L1-syn') },
    condLoopsL2_create:     { name: 'M4 - Conditional Loops L2',    file: require('./grading-scripts-s3/cond-loops-L2') },
    decompL1:               { name: 'M5 - Decomp. by Sequence L1',  file: require('./grading-scripts-s3/decomp-L1') },
    decompL2_create:        { name: 'M5 - Decomp. by Sequence L2',  file: require('./grading-scripts-s3/decomp-L2') },
    oneWaySyncL1:           { name: 'M6 - One-Way Sync L1',         file: require('./grading-scripts-s3/one-way-sync-L1') },
    oneWaySyncL2_create:    { name: 'M6 - One-Way Sync L2',         file: require('./grading-scripts-s3/one-way-sync-L2') },
    twoWaySyncL1:           { name: 'M7 - Two-Way Sync L1',         file: require('./grading-scripts-s3/two-way-sync-L1') },
    complexConditionalsL1:  { name: 'M8 - Complex Conditionals L1', file: require('./grading-scripts-s3/complex-conditionals-L1') },
};

/// Act 1 graders
let actOneGraders = {
    scavengerHunt: { name: 'M1 - Scavenger Hunt',    file: require('./act1-grading-scripts/scavengerHunt') },
    onTheFarm:     { name: 'M2 - On the Farm',       file: require('./act1-grading-scripts/onTheFarm') },
    namePoem:      { name: 'M3 - Name Poem',         file: require('./act1-grading-scripts/name-poem') },
    ofrenda:       { name: 'M4 - Ofrenda',           file: require('./act1-grading-scripts/ofrenda') },
    aboutMe:       { name: 'M5 - About Me',          file: require('./act1-grading-scripts/aboutMe') },
    animalParade:  { name: 'M6 - Animal Parade',     file: require('./act1-grading-scripts/animal-parade') },
    danceParty:    { name: 'M7 - Dance Party',       file: require('./act1-grading-scripts/dance-party') },
    knockKnock:    { name: 'M8 - Knock Knock',       file: require('./act1-grading-scripts/knockKnock') },
    finalProject:  { name: 'M9 - Interactive Story', file: require('./act1-grading-scripts/final-project') },
};

let allGraders = {};
for (let graderKeyList of [graders, actOneGraders]) {
    for (let graderKey in graderKeyList) {
        allGraders[graderKey] = graderKeyList[graderKey];
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

let projectMode = 0;
window.useProjectMode = function() {
    projectMode = 1;
}

/* Stores the grade reports. */
let reports_list = [];
/* Number of projects scanned so far. */
let project_count = 0;
    /* Number of requirements of single project. */
    let total_reqs = 0;
    /* Number of completed requirements of single project. */
    let complete_reqs = 0;
    /* Number of extensions of single project. */
    let total_exts = 0;
    /* Number of completed extensions of single project. */
    let complete_exts = 0;
/* Number of projects that meet requirements. */
let passing_projects = 0;
/* Number of projects that meet requirements and extensions */
let complete_projects = 0;
/* Grading object. */
let gradeObj = null;

let IS_LOADING = false;

/* Experimental feature */
let downloadEnabled = false;

///////////////////////////////////////////////////////////////////////////////////////////////////

/// HTML helpers
///////////////////////////////////////////////////////////////////////////////////////////////////

/// Helps with form submission.
window.formHelper = function () {
    /// Blocks premature form submissions.
    $("form").submit(function () { return false; });
    /// Maps enter key to grade button.
    $(document).keypress(function (e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fillUnitsHTML = function() {
    let HTMLString = '';
    for (let graderKey in graders) {
        let graderName = graders[graderKey].name;
        let isCreate = graderKey.includes('create');
        if (!isCreate) {
            HTMLString += '<br><hr>';
            HTMLString += '<label class = "unit_name">';
            HTMLString += graderName.substring(0, graderName.length - 2);
            HTMLString += '</label>'
        }
        HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>';
        HTMLString += '<label class = "unitlabel">';
        if (isCreate) {
            HTMLString += '<img src = "pictures/create.png">';
            HTMLString += graderName.substring(graderName.length - 2);
            HTMLString += ' Create';
        }
        else {
            HTMLString += '<img src="pictures/' + graderKey.substring(0, graderKey.length - 2) + '.png">';
            HTMLString += graderName.substring(graderName.length - 2);
            HTMLString += ' Modify';
        }
        HTMLString += '</label> </a>';
    }
    HTMLString += '<hr>';
    document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/////////////// grader function for act 1 ////////////////////
window.fillUnitsHTMLAct1 = function() {
    let HTMLString = '';
    for (let graderKey in actOneGraders) {
        HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>'
        HTMLString += '<label class = "unitlabel">';
        HTMLString += '<img src="pictures/' + graderKey + '.png">';
        HTMLString += actOneGraders[graderKey].name;
        HTMLString += '</label> </a>';
    }
    document.getElementById("unitsHTML").innerHTML = HTMLString;
}
////////////// grader function for act 1 ////////////////////

/* Initializes html and initiates crawler. */
window.buttonHandler = async function () {
    if (IS_LOADING) return;
    if (!gradeObj) return unitError();
    init();
    document.getElementById('wait_time').innerHTML = "Loading...";
    IS_LOADING = true;
    let requestURL = document.getElementById('inches_input').value;
    let itemID = parseInt(requestURL.match(/\d+/));
    await crawlOrGrade(itemID);
}

/* Initializes global variables. */
function init() {

    /// HTML
    document.getElementById('process_button').blur();
    clearReport();
    noError();
    hideProgressBar();

    /// Globals
    reports_list = [];
    project_count = 0;
    crawl_finished = false;
    cross_org = true;
    grade_reqs = {};
    total_reqs = 0;
    complete_reqs = 0;
    total_exts = 0;
    complete_reqs = 0;
    passing_projects = 0;
    complete_projects = 0;
}

$(document).ready(function () {
    $('.unitselector').click(function () {
        $(this).addClass('selected');
        $(this).children().addClass('selected');
        $(this).siblings().removeClass('selected');
        $(this).siblings().children().removeClass('selected');
    });
});

window.drop_handler = function (graderKey) {
    gradeObj = new allGraders[graderKey].file;
    console.log("Selected " + allGraders[graderKey].name);
    document.getElementById("selectedUnit").innerHTML = 'Grading ' + allGraders[graderKey].name;
}

window.onclick = function (event) {
    if (event.target.matches('.dropdown_btn')) {
        return;
    }

    if (event.target.matches('#process_button')) {
        $('html, body').animate({
            scrollTop: 1400
        }, 300);
    }

    let droplinks = document.getElementsByClassName("dropdown_menu");
    [...droplinks].forEach(function (element) {
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Project retrieval and grading
///////////////////////////////////////////////////////////////////////////////////////////////////

class ProjectIdentifier {
    constructor(projectOverview) {
        this.id = projectOverview.id;
        this.author = projectOverview.author;
        this.username = 'Scratcher ' + this.author;
    }
}

function get(url) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = resolve;
        request.onerror = reject;
        request.send();
    });
}

async function gradeOneProject(projectID) {

    console.log('Grading project with aws ' + projectID);
    /// Getting the project metadata from Scratch API through TurboWarp
    const metadataResponse = await fetch(`https://trampoline.turbowarp.org/api/projects/${projectID}`);
    if (metadataResponse.status === 404) {
        throw new Error('The project is unshared or does not exist');
    }
    if (!metadataResponse.ok) {
        throw new Error(`HTTP error ${metadataResponse.status} fetching project metadata`);
    }
    const metadata = await metadataResponse.json();
    console.log(metadata);

    /// Getting the project JSON using project ID and token
    const projectAuthor = metadata.author.username;
    const token = metadata.project_token;
    const projectResponse = await fetch(`https://projects.scratch.mit.edu/${projectID}?token=${token}`);
    if (!projectResponse.ok) {
        throw new Error(`HTTP error ${projectResponse.status} fetching project data`);
    }
    const projectJSON = await projectResponse.json();
    console.log(projectJSON);

    try {
        analyze(projectJSON, projectAuthor, projectID);
    }
    catch (err) {
        console.log('Error grading project ' + projectID);
        /// console.log(err);
    }
    printReportList();
}

async function crawl(studioID) {
    const studioResponse = await fetch(`https://trampoline.turbowarp.org/api/studios/${studioID}/projects`);
    if (studioResponse.status === 404) {
        throw new Error('The studio is unshared or does not exist');
    }
    if (!studioResponse.ok) {
        throw new Error(`HTTP error ${studioResponse.status} fetching studio metadata`);
    }
    const studioJSON = await studioResponse.json();
    // console.log(studioJSON);

    for (let projectIdentifier of studioJSON) {
        // console.log(projectIdentifier);
        await gradeStudioProject(projectIdentifier);
        if (downloadEnabled) await new Promise((resolve, reject) => setTimeout(resolve, 300));
    }
}

async function gradeStudioProject(projectIdentifier) {
    let projectID = projectIdentifier.id;
    let projectAuthor = projectIdentifier.username;
    console.log('Grading project ' + projectID);
    
    /// Getting the project metadata from Scratch API through TurboWarp
    const metadataResponse = await fetch(`https://trampoline.turbowarp.org/api/projects/${projectID}`);
    if (metadataResponse.status === 404) {
        throw new Error('The project is unshared or does not exist');
    }
    if (!metadataResponse.ok) {
        throw new Error(`HTTP error ${metadataResponse.status} fetching project metadata`);
    }
    const metadata = await metadataResponse.json();
    console.log(metadata);

    /// Getting the project JSON using project ID and token
    const token = metadata.project_token;
    const projectResponse = await fetch(`https://projects.scratch.mit.edu/${projectID}?token=${token}`);
    if (!projectResponse.ok) {
        throw new Error(`HTTP error ${projectResponse.status} fetching project data`);
    }
    const projectJSON = await projectResponse.json();
    console.log(projectJSON);

    try {
        analyze(projectJSON, projectAuthor, projectID);
    }
    catch (err) {
        console.log('Error grading project ' + projectID);
        /// console.log(err);
    }
    printReportList();
}

// function downloadProject(projectID, projectJSON) {
//     let hiddenElement = document.createElement('a');
//     hiddenElement.style.display = 'none';
//     hiddenElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(projectJSON));
//     hiddenElement.setAttribute('download', projectID);
//     document.body.appendChild(hiddenElement);
//     hiddenElement.click();
//     document.body.removeChild(hiddenElement);
//     console.log('Downloaded ' + projectID);
//     return;
// }

function analyze(fileObj, user, id) {
    try {
        gradeObj.grade(fileObj, id);
    }
    catch (err) {
        console.log('Error grading project ' + id);
        console.log(err);
    }
    report(id, gradeObj.requirements, gradeObj.extensions, user);
    project_count++;
    console.log(project_count);

}

async function crawlOrGrade(itemID) {
    console.log(projectMode);
    if (projectMode) {
        return gradeOneProject(itemID);
    }
    else {
        return crawl(itemID, 0, []);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Reporting results
///////////////////////////////////////////////////////////////////////////////////////////////////

/* Prints a line of grading text. */
function appendText(string_list) {
    let tbi = document.createElement("div");
    tbi.className = "dynamic";

    let HTMLString = '';
    for (let string of string_list) {
        HTMLString += '<br>';
        HTMLString += string;
    }
    HTMLString += '<br>';

    tbi.style.width = "100%";
    tbi.style.fontSize = "14px";
    tbi.style.fontWeight = "normal";
    tbi.innerHTML = HTMLString;

    let ai = document.getElementById("report");
    document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a series of consecutive project reports. */
function printReportList() {
    clearReport();
    sortReport();
    printColorKey();
    showProgressBar();
    for (let report of reports_list) {
        appendText(report);
    }
    checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
    let removeables = document.getElementsByClassName('dynamic');
    while (removeables[0]) {
        removeables[0].remove();
    }
    removeables = document.getElementsByClassName('lines');
    while (removeables[0]) {
        removeables[0].remove();
    }
}

/* Prints progress bar. */
function showProgressBar() {
    let green = 0;
    let yellow = 0;
    let red = 0;
    let count = 0;
    if (projectMode) {
        console.log('pm');
        green = complete_reqs;
        yellow = 0;
        red = total_reqs - complete_reqs;
        console.log(red);
        count = total_reqs;
        console.log(count);
    }
    else {
        green = complete_projects;
        yellow = passing_projects;
        red = project_count - (complete_projects + passing_projects);
        count = project_count;
    }
    document.getElementById('myProgress').style.visibility = "visible";
    setProgress(document.getElementById('greenbar'), green, count, 0);
    setProgress(document.getElementById('yellowbar'), yellow, count, 1);
    setProgress(document.getElementById('redbar'), red, count, 2);
}

/* Hides progress bar. */
function hideProgressBar() {
    document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key.*/
function printColorKey() {
    let processObj = document.getElementById('process_status');
    processObj.style.visibility = 'visible';
    processObj.innerHTML = "results:";
}

function hideColorKey() {
    var processObj = document.getElementById('process_status');
    processObj.style.visibility = 'hidden';
}

/* Update progress bar segment to new proportion. */
function setProgress(bar, items, total_items, color) {
    let width_percent = ((items / total_items) * 100);
    bar.style.width = width_percent + '%';
    if (items && color === 0) {
        if (items !== total_items) bar.innerHTML = items;
        if (width_percent === 100) bar.innerHTML += projectMode ? 'All tasks done!' : ' done';
        else if (width_percent >= 15) bar.innerHTML += projectMode ? 
            items === 1 ?
                ' task done' : ' tasks done' 
            : ' done';
    }
    else if (items && color === 1) {
        bar.innerHTML = items;
        if (width_percent >= 15) bar.innerHTML += projectMode ? '' : ' almost done';
    }
    else if (items && color === 2) {
        bar.innerHTML = items;
        if (width_percent >= 15) bar.innerHTML += projectMode ?
            items === 1 ?
                ' task not done' : ' tasks not done' 
            : ' need time or help';
    }
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
    return (bool) ? ('✔️') : ('⬜️');
}

/* Adds results to reports_list and prints. */
function report(projectID, requirements, extensions, projectAuthor) {
    let ret_list = [];
    let project_complete = true;
    let passed_reqs_count = 0;

    /* Makes a string list of grading results. */
    ret_list.push('Project ID: <a href="https://scratch.mit.edu/projects/' + projectID + '">' + projectID + '</a>');
    ret_list.push('Creator: <a href="https://scratch.mit.edu/users/' + projectAuthor + '">' + projectAuthor + '</a>');
    ret_list.push(projectMode ? '\nTasks' : 'Requirements:');
    for (let x in requirements) {
        if (!requirements[x].bool) project_complete = false;
        else passed_reqs_count++;
        ret_list.push(checkbox(requirements[x].bool) + ' - ' + requirements[x].str);
    }
    if (extensions) {
        ret_list.push(projectMode ? '\nIf you are done early:' : 'Extensions:')
        for (let x in extensions) {
            if (extensions[x].bool) complete_exts++;
            ret_list.push(checkbox(extensions[x].bool) + ' - ' + extensions[x].str);
        }
    }
    ret_list.push('');
    reports_list.push(ret_list);

    /* Adjusts progress globals. */
    total_reqs = Object.keys(requirements).length;
    if (project_complete) complete_projects++;
    else if (passed_reqs_count >= (Object.keys(requirements).length / 2)) passing_projects++;
    complete_reqs = passed_reqs_count;
}

/* Checks if process is done.  */
function checkIfComplete() {
    if (project_count) document.getElementById('wait_time').innerHTML = '';
    else document.getElementById('wait_time').innerHTML = `No Scratch 3.0+ projects found. Did you enter a valid Scratch ${projectMode ? 'project' : 'studio'} URL?`;
    IS_LOADING = false;
    console.log("Done.");
}

/* Sorts the reports in reports_list alphabetically by username. */
function sortReport() {
    reports_list.sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Error reports
///////////////////////////////////////////////////////////////////////////////////////////////////

function linkError() {
    document.getElementById('myProgress').style.visibility = "hidden";
    let processObj = document.getElementById('process_error');
    processObj.style.visibility = 'visible';
    processObj.style.color = "red";
    processObj.innerHTML = "error: invalid link.";
    document.getElementById('wait_time').innerHTML = "";
    IS_LOADING = false;
}

function unitError() {
    let processObj = document.getElementById('process_error');
    processObj.style.visibility = 'visible';
    processObj.style.color = "red";
    processObj.innerHTML = "Please select a unit.";
    IS_LOADING = false;
}

function noError() {
    document.getElementById('process_error').innerHTML = "";
    document.getElementById('process_error').style.visibility = 'hidden';
}

///////////////////////////////////////////////////////////////////////////////////////////////////

},{"./act1-grading-scripts/aboutMe":1,"./act1-grading-scripts/animal-parade":2,"./act1-grading-scripts/dance-party":3,"./act1-grading-scripts/final-project":4,"./act1-grading-scripts/knockKnock":5,"./act1-grading-scripts/name-poem":6,"./act1-grading-scripts/ofrenda":7,"./act1-grading-scripts/onTheFarm":8,"./act1-grading-scripts/scavengerHunt":10,"./grading-scripts-s3/animation-L1":11,"./grading-scripts-s3/animation-L2":12,"./grading-scripts-s3/complex-conditionals-L1":13,"./grading-scripts-s3/cond-loops-L1-syn":14,"./grading-scripts-s3/cond-loops-L2":15,"./grading-scripts-s3/decomp-L1":17,"./grading-scripts-s3/decomp-L2":18,"./grading-scripts-s3/events-L1-syn":19,"./grading-scripts-s3/events-L2":20,"./grading-scripts-s3/one-way-sync-L1":22,"./grading-scripts-s3/one-way-sync-L2":23,"./grading-scripts-s3/scratch-basics-L1":24,"./grading-scripts-s3/scratch-basics-L2":25,"./grading-scripts-s3/two-way-sync-L1":48}],51:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? global : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],52:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":53,"get-intrinsic":57}],53:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":56,"get-intrinsic":57}],54:[function(require,module,exports){
'use strict';

var isCallable = require('is-callable');

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;

},{"is-callable":65}],55:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],56:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":55}],57:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":56,"has":62,"has-symbols":59}],58:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":57}],59:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":60}],60:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],61:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":60}],62:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":56}],63:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],64:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":52,"has-tostringtag/shams":61}],65:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var objectClass = '[object Object]';
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var ddaClass = '[object HTMLAllCollection]'; // IE 11
var ddaClass2 = '[object HTML document.all class]';
var ddaClass3 = '[object HTMLCollection]'; // IE 9-10
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`

var isIE68 = !(0 in [,]); // eslint-disable-line no-sparse-arrays, comma-spacing

var isDDA = function isDocumentDotAll() { return false; };
if (typeof document === 'object') {
	// Firefox 3 canonicalizes DDA to undefined when it's not accessed directly
	var all = document.all;
	if (toStr.call(all) === toStr.call(document.all)) {
		isDDA = function isDocumentDotAll(value) {
			/* globals document: false */
			// in IE 6-8, typeof document.all is "object" and it's truthy
			if ((isIE68 || !value) && (typeof value === 'undefined' || typeof value === 'object')) {
				try {
					var str = toStr.call(value);
					return (
						str === ddaClass
						|| str === ddaClass2
						|| str === ddaClass3 // opera 12.16
						|| str === objectClass // IE 6-8
					) && value('') == null; // eslint-disable-line eqeqeq
				} catch (e) { /**/ }
			}
			return false;
		};
	}
}

module.exports = reflectApply
	? function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	}
	: function isCallable(value) {
		if (isDDA(value)) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !(/^\[object HTML/).test(strClass)) { return false; }
		return tryFunctionObject(value);
	};

},{}],66:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":61}],67:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();
var gOPD = require('gopd');

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":51,"call-bind/callBound":52,"for-each":54,"gopd":58,"has-tostringtag/shams":61}],68:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],69:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],70:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":64,"is-generator-function":66,"is-typed-array":67,"which-typed-array":72}],71:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').slice(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.slice(1, -1);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":69,"./support/types":70,"_process":68,"inherits":63}],72:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('for-each');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');
var gOPD = require('gopd');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var g = typeof globalThis === 'undefined' ? global : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":51,"call-bind/callBound":52,"for-each":54,"gopd":58,"has-tostringtag/shams":61,"is-typed-array":67}]},{},[50]);
