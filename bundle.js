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
        this.requirements.hasOneInteractiveSprite = { bool: false, str: 'Project has at least one interactive sprite' };
        this.requirements.hasTwoInteractiveSprites = { bool: false, str: 'Project has at least two interactive sprites' };
        this.requirements.hasThreeInteractiveSprites = { bool: false, str: 'Project has at least three interactive sprites' };
        // interactive and speaking  - done
        this.requirements.hasOneSpeakingInteractive = { bool: false, str: 'Project has one interactive sprite that speaks' };
        this.requirements.hasTwoSpeakingInteractive = { bool: false, str: 'Project has two interactive sprites that speak' };
        this.requirements.hasThreeSpeakingInteractive = { bool: false, str: 'Project has three interactive sprites that speak' };
        // background - done
        this.requirements.hasBackdrop = { bool: false, str: 'This project has a backdrop' };
        // speaking - done
        this.requirements.usesSayBlock = {bool: false, str: 'This project uses a say block'};
      

        // check for block usage - done 
        this.extensions.usesThinkBlock = { bool: false, str: 'Project uses the think block' };
        this.extensions.changeSize = { bool: false, str: 'Project uses change size block' };
        this.extensions.playSound = { bool: false, str: 'Project uses play sound until done' };
        this.extensions.moveSteps = { bool: false, str: 'Project uses a move block' };
        

        let usesFlagClicked = 0;
        let usesSpriteClicked = 0;
        let usesGlide = 0;
        let usesSays = 0;
        let usesWait = 0;

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
                for (let cost in target.costumes) {
                    if ((target.costumes.length > 1) || (cost.assetID !== "cd21514d0531fdffb22204e0ec5ed84a")) {
                        this.requirements.hasBackdrop.bool = true;
                    }
                }
            }
            else {

                for (let script of target.scripts) {
                    if (script.blocks[0].opcode === 'event_whenthisspriteclicked') {
                        if (script.blocks.length > 1) {
                            numInteractive++;
                        }
                        for (let i = 0; i < script.blocks.length; i++) {
                            if ((script.blocks[i].opcode === 'looks_say') ||
                                (script.blocks[i].opcode === 'looks_sayforsecs')) {
                                isInteractiveAndSpeaks = true;
                            }
                        }
                    }

                    for (let i = 0; i < script.blocks.length; i++) {
                        if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                            this.extensions.usesThinkBlock.bool = true;
                        }
                        if (script.blocks[i].opcode === 'looks_changesizeby') {
                            this.extensions.changeSize.bool = true;
                        }
                        if (script.blocks[i].opcode === 'sound_playuntildone') {
                            this.extensions.playSound.bool = true;
                        }
                        if (script.blocks[i].opcode === 'motion_movesteps') {
                            this.extensions.moveSteps.bool = true;
                        }
                        if ((script.blocks[i].opcode === 'looks_say') || (script.blocks[i].opcode === 'looks_sayforsecs')) {
                            this.requirements.usesSayBlock.bool = true;
                        }
                    
                    }
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
            this.requirements.hasOneInteractiveSprite.bool = true;
        } 
        if (numInteractive >= 2) {
            this.requirements.hasTwoInteractiveSprites.bool = true;
        } 
        if (numInteractive >= 3) {
            this.requirements.hasThreeInteractiveSprites.bool = true;
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
        this.requirements.kangaroo = {bool: false, str: 'Kangaroo script has been changed'};
        this.requirements.grasshopper = {bool: false, str: 'Grasshopper script has been changed'};
       // this.requirements.stop = {bool: false, str: 'All the animals stop in the same place'};
        this.requirements.bee = {bool: false, str: 'Bee flies in a circle when clicked (using next costume, turn, and move steps)'};
        this.extensions.changeSize = {bool: false, str: 'Uses "change size by"'};
        this.extensions.changeEffect = {bool: false, str: 'Uses "change color effect by"'}
    }

    checkScripts(target) {
        for (let script of target.scripts){
            if (script.blocks[0].opcode.includes('event_')){
                switch (target.name){
                    case 'Kangaroo':
                        if (script.blocks[0].opcode !== 'event_whenflagclicked'
                            || !(script.blocks[1].opcode === 'motion_gotoxy'
                                && script.blocks[1].inputs.X[1][1] == -180
                                && script.blocks[1].inputs.Y[1][1] == -17)
                            || !(script.blocks[2].opcode === 'looks_switchcostumeto'
                                && target.blocks[script.blocks[2].inputs.COSTUME[1]].fields.COSTUME[0] === 'kangaroo crouching')
                            || script.blocks.length != 3) {
                                    this.requirements.kangaroo.bool = true;
                        }
                        break;
                    case 'Grasshopper':
                        if (script.blocks[0].opcode !== 'event_whenflagclicked' 
                            || !(script.blocks[1].opcode === 'motion_gotoxy'
                                && script.blocks[1].inputs.X[1][1] == -56
                                && script.blocks[1].inputs.Y[1][1] == -80)
                            || !(script.blocks[2].opcode === 'looks_switchcostumeto'
                                && target.blocks[script.blocks[2].inputs.COSTUME[1]].fields.COSTUME[0] === 'Grasshopper-a')
                            || script.blocks.length != 3){
                                    this.requirements.grasshopper.bool = true;
                                }
                        break;
                }
            }
        }
    } 

    checkBlocks(target) {
        for (let script of target.scripts){
            let costume = false;
            let turn = false;
            let move = false;
            let size = false;
            let effect = false;
            if (script.blocks[0].opcode.includes('event_')){
                for (let block of script.blocks){
                    switch(block.opcode){
                        case 'looks_nextcostume': costume = true; break;
                        case 'motion_turnleft': turn = true; break;
                        case 'motion_turnright': turn = true; break;
                        case 'motion_movesteps': move = true; break;
                        case 'looks_changesizeby': size = true; break;
                        case 'looks_changeeffectby': effect = true; break;
                    }
                }
            }
            if (costume && turn && move && (target.name === 'Bee')){
                this.requirements.bee.bool = true;
            }
            if (size) {this.extensions.changeSize.bool=true;}
            if (effect) {this.extensions.changeEffect.bool=true;}
        }
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        for (let target of project.targets){
            this.checkScripts(target);
            this.checkBlocks(target);
        }
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
        this.requirements.backdrop = { bool: false, str: 'Project has a new backdrop' };
        this.requirements.twoSprites = { bool: false, str: 'Project has two sprites' };
        this.requirements.goToXY = { bool: false, str: 'Both sprites have a "go to xy" block to start them in the same place each time the green flag is clicked' };
        this.requirements.repeat = { bool: false, str: 'There is a repeat loop using one of the four specified blocks' };
        this.requirements.scripts = { bool: false, str: 'Both sprites have at least one script starting with "when green flag clicked" and one starting with a different event block (which must not be the same as the other sprite)' };
        this.extensions.loop = { bool: false, str: '"Sound" or "look" block used inside a loop' };
        this.extensions.sizeOrDirection = { bool: false, str: 'The sprite moves and changes size or direction in the same script' };
        this.eventArr = [];
    }

    checkBackdrop(target) {
        if ((target.costumes.length > 1) ||
            (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
            this.requirements.backdrop.bool = true;
        }
    }

    checkXY(target){
        for (let script of target.scripts){
            if (script.blocks[0].opcode === 'event_whenflagclicked'){
                for (let block of script.blocks){
                    if (block.opcode === 'motion_gotoxy'){
                        this.requirements.goToXY.bool = true;
                    }
                }
            }
        }
    }

    checkLoop(target){
        for (let script of target.scripts){
            if (script.blocks[0].opcode.includes('event_')){
                for (let block of script.blocks){
                    if (block.opcode === 'control_repeat'){
                        for (let i = block.inputs.SUBSTACK[1]; i != null; i = target.blocks[i].next) {
                            let opc = target.blocks[i].opcode;
                            if (opc === 'motion_glidesecstoxy'
                                || opc === 'motion_movesteps'
                                || opc === 'looks_nextcostume'
                                || opc === 'control_wait'){
                                    this.requirements.repeat.bool = true;
                            }
                            else if (opc.includes('sound_')||opc.includes('looks_')){
                                this.extensions.loop.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkScripts(target){
        let greenFlag = false;
        let otherEvent = false;
        let move = false;
        let dirOrSize = false;
        for (let script of target.scripts){
            let opc1 = script.blocks[0].opcode;
            if (opc1.includes('event_')){
                if (opc1==='event_whenflagclicked'){greenFlag=true;}
                else {
                    if (!this.eventArr.includes(opc1)){
                        this.eventArr.push(opc1);
                        otherEvent = true;
                    }
                }
                for (let block of script.blocks){
                    let blopcode = block.opcode;
                    console.log(blopcode);
                    if (blopcode.includes('motion_')&&!(blopcode.includes('turn')||blopcode.includes('direction'))){
                        move = true;
                    } else if (blopcode.includes('size')
                        || blopcode.includes('turn')
                        || blopcode.includes('direction')) {
                            dirOrSize = true;
                        }
                }
            }
        }
        if (move && dirOrSize) {this.extensions.sizeOrDirection.bool=true;}
        return (greenFlag && otherEvent);
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let spriteNumber = 0;
        let scriptedSprites = 0;
        let eventArr = [];

        for (let target of project.targets) {
            if (target.isStage) {
                this.checkBackdrop(target);
            } else {
                spriteNumber++;
                this.checkXY(target);
                this.checkLoop(target);
                if (this.checkScripts(target)) {scriptedSprites++};
            }
        }

        if (spriteNumber >= 2){this.requirements.twoSprites.bool=true;}
        if (scriptedSprites >= 2) {this.requirements.scripts.bool=true;}
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

    initReqs(){
        this.requirements.event = {bool: false, str: 'Project uses at least one event block'};
        this.requirements.loop = {bool: false, str: 'Project has a functional loop'};
        this.requirements.sprite = {bool: false, str: 'Project has at least one sprite with a script'};
        this.requirements.backdrop = {bool: false, str: 'Scene changes'};
        this.extensions.threeBackdrops = {bool: false, str: 'Uses 3 different backdrops'};
        this.extensions.showHide = {bool: false, str: 'Uses "show" or "hide"'};
        this.extensions.music = {bool: false, str: 'Sounds added'};
        
        /////
        // this.requirements.one = { bool: false, str: 'at least 1 unique block'};
        // this.requirements.two = { bool: false, str: 'at least 2 unique blocks'};
        // this.requirements.three = { bool: false, str: 'at least 3 unique blocks'};
        // this.requirements.four = { bool: false, str: 'at least 4 unique blocks'};
        // this.requirements.five = { bool: false, str: 'at least 5 unique blocks'};
        // this.requirements.six = { bool: false, str: 'at least 6 unique blocks'};
        // this.requirements.seven = { bool: false, str: 'at least 7 unique blocks'};
        // this.requirements.eight = { bool: false, str: 'at least 8 unique blocks'};
        // this.requirements.nine = { bool: false, str: 'at least 9 unique blocks'};
        // this.requirements.ten = { bool: false, str: 'at least 10+ unique blocks'};
        /////
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        let uniqueBlocksArr = [];
        let uniqueBlocks = 0;

        for (let target of project.targets){

            if (target.isStage){
                if (target.costumes.length>=3){
                    // this.extensions.threeBackdrops.bool=true;
                }
            }  


            for (let script in target.scripts) {
                if (target.scripts[script].blocks[0].opcode.includes('event_')){
                    for (let block of target.scripts[script].blocks) {
                        let opc = block.opcode;
                        if (!uniqueBlocksArr.includes(opc)){
                            uniqueBlocksArr.push(opc);
                            uniqueBlocks++;
                        }
                    }
                }
            }

            for (let block in target.blocks){

                if (target.blocks[block].opcode.includes('event_')){
                    this.requirements.event.bool=true;

                    for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next){
                        let opc = target.blocks[i].opcode;
                        if ((opc==='control_forever')
                        ||(opc.includes('control_repeat'))){
                            if (target.blocks[i].inputs.SUBSTACK[1]!==null){
                                this.requirements.loop.bool=true;
                            }
                        }
                    }
                }

                let opc = target.blocks[block].opcode;
                if (opc.includes('backdrop')){
                    this.requirements.backdrop.bool=true;
                }
                if ((opc.includes('show'))
                ||opc.includes('hide')){
                    this.extensions.showHide.bool=true;
                }
                if ((opc==='sound_playuntildone')
                ||(opc==='sound_play')){
                    this.extensions.music.bool=true;
                }

                if (!target.isStage){
                    this.requirements.sprite.bool=true;
                }

            }
        }

        // if (uniqueBlocks>=1) this.requirements.one.bool=true;
        // if (uniqueBlocks>=2) this.requirements.two.bool=true;
        // if (uniqueBlocks>=3) this.requirements.three.bool=true;
        // if (uniqueBlocks>=4) this.requirements.four.bool=true;
        // if (uniqueBlocks>=5) this.requirements.five.bool=true;
        // if (uniqueBlocks>=6) this.requirements.six.bool=true;
        // if (uniqueBlocks>=7) this.requirements.seven.bool=true;
        // if (uniqueBlocks>=8) this.requirements.eight.bool=true;
        // if (uniqueBlocks>=9) this.requirements.nine.bool=true;
        // if (uniqueBlocks>=10) this.requirements.ten.bool=true;

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
        this.requirements.anotherKnockKnock = { bool: false, str: 'Another knock knock joke is told, starting with then the space bar is pressed' };
    }

    grade(fileObj, user) {
        this.initReqs();
        if (!is(fileObj)) {
            return;
        }


        var project = new Project(fileObj, null);
        let lastBlock = 0;
        let soundOptions = ['looks_say', 'looks_sayforsecs', 'sound_playforsecs', 'sound_playuntildone'];
        let sheepJoke = [];
        let cowJoke = [];
        let goodSheep = ['event_whenkeypressed', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs'];
        let goodCow = ['event_whenkeypressed', 'looks_thinkforsecs', 'control_wait', 'looks_thinkforsecs', 'control_wait', 'looks_sayforsecs'];

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Sheep') {
                    for (let script of target.scripts) {
                        if (script.blocks[0].opcode === 'event_whenflagclicked') {
                            for (let i = 0; i < script.blocks.length; i++) {

                                if (script.blocks[i].opcode === 'looks_thinkforsecs') {
                                    let nextBlock = script.blocks[i].next;
                                    if (nextBlock !== null) {
                                        if (target.blocks[nextBlock].opcode === 'control_wait') {
                                            let nextNextBlock = target.blocks[nextBlock].next;
                                            if (nextNextBlock !== null) {
                                                if (soundOptions.includes(target.blocks[nextNextBlock].opcode)) {
                                                    this.requirements.sheepLaughs.bool = true;
                                                }
                                            }
                                        }
                                    }

                                }

                            }

                        }



                        if (script.blocks[0].opcode === 'event_whenkeypressed') {
                            if (script.blocks[0].fields.KEY_OPTION[0] === 'space') {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    sheepJoke.push(script.blocks[i].opcode);

                                }
                            }
                        }
                    }

                }
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


    //updates bug direction and locaiton
    updateFromProc(block) {
        if (block.opcode === 'motion_gotoxy') {
            console.log('motion go to xy')
            this.bug.locX = parseFloat(this.blankTo0(block.inputs.X[1][1]));
            this.bug.locY = parseFloat(this.blankTo0(block.inputs.Y[1][1]));
        }
        if (block.opcode === 'motion_pointindirection') {
            console.log('motion point in direction');
            this.bug.dir = parseFloat(this.blankTo0(block.inputs.DIRECTION[1][1]));
        }
        if (block.opcode === 'motion_turnright') {
            console.log('motion turn right');
            this.bug.dir -= parseFloat(this.blankTo0(block.inputs.DEGREES[1][1]));
        }

        }

        var util = require('util');
        let cowOrig = util.inspect(goodCow);
        let sheepOrig = util.inspect(goodSheep);
        let cowUtil = util.inspect(cowJoke);
        let sheepUtil = util.inspect(sheepJoke);


        if (cowOrig === cowUtil && sheepOrig === sheepUtil) {
            this.requirements.anotherKnockKnock.bool = true;
        }

    }
}
},{"../grading-scripts-s3/scratch3":26,"util":36}],6:[function(require,module,exports){
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
            "currentCostume": 1,
            "costumes": [
                {
                    "assetId": "6e13e6f67ad8078462170a82958429b4",
                    "name": "backdrop1",
                    "bitmapResolution": 2,
                    "md5ext": "6e13e6f67ad8078462170a82958429b4.png",
                    "dataFormat": "png",
                    "rotationCenterX": 480,
                    "rotationCenterY": 360
                },
                {
                    "assetId": "a50c3550f948b17817504b0b32cdc6a0",
                    "name": "woods",
                    "bitmapResolution": 2,
                    "md5ext": "a50c3550f948b17817504b0b32cdc6a0.png",
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
            "name": "D-Glow",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "Fw}ev{0up#68XMVDC]5V": {
                    "opcode": "event_whenflagclicked",
                    "next": "67Z84wJ)FI9AEdBL91Re",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 19,
                    "y": 30
                },
                "67Z84wJ)FI9AEdBL91Re": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "Fw}ev{0up#68XMVDC]5V",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
                        "X": [
                            1,
                            [
                                4,
                                "-205"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "148"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ";7:di3O.oGwRy7Y-Zkyl": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "S3UP}H?~y^4+V6Xf?0%+",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 18,
                    "y": 415
                },
                "S3UP}H?~y^4+V6Xf?0%+": {
                    "opcode": "sound_playuntildone",
                    "next": "yBp{F@0b%qE?_?uRuv=P",
                    "parent": ";7:di3O.oGwRy7Y-Zkyl",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "m:Ka0J_^uu;Fqy*J-IRf"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "m:Ka0J_^uu;Fqy*J-IRf": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "S3UP}H?~y^4+V6Xf?0%+",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "pop"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "yBp{F@0b%qE?_?uRuv=P": {
                    "opcode": "looks_sayforsecs",
                    "next": "Hpow,tf?zH!9+(Z%a;n1",
                    "parent": "S3UP}H?~y^4+V6Xf?0%+",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Daring!!!"
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
                "Hpow,tf?zH!9+(Z%a;n1": {
                    "opcode": "sound_playuntildone",
                    "next": null,
                    "parent": "yBp{F@0b%qE?_?uRuv=P",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "j=C:pq)]R4H/HL]Vae}@"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "j=C:pq)]R4H/HL]Vae}@": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "Hpow,tf?zH!9+(Z%a;n1",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "pop"
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "a3a66e37de8d7ebe0505594e036ef6d1",
                    "name": "Glow-D",
                    "bitmapResolution": 1,
                    "md5ext": "a3a66e37de8d7ebe0505594e036ef6d1.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 33,
                    "rotationCenterY": 35
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
            "x": -205,
            "y": 148,
            "size": 80,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "I-Glow",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "em!(S`b]+MB2h8((R434": {
                    "opcode": "event_whenflagclicked",
                    "next": "U/S5Iia;0;[]IN~T*psn",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "ZstZjnd:|xmPpd|aG8zA": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "{dZO6l~Mjn,hjw{#.Bbs",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 38,
                    "y": 491
                },
                "Hth-}qjG)rsWgUgOcm@?": {
                    "opcode": "looks_sayforsecs",
                    "next": "`?BFu~=!y!XHF*Qfm{AV",
                    "parent": "{dZO6l~Mjn,hjw{#.Bbs",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Interesting!!!"
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
                "{dZO6l~Mjn,hjw{#.Bbs": {
                    "opcode": "looks_changesizeby",
                    "next": "Hth-}qjG)rsWgUgOcm@?",
                    "parent": "ZstZjnd:|xmPpd|aG8zA",
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
                "`?BFu~=!y!XHF*Qfm{AV": {
                    "opcode": "looks_changesizeby",
                    "next": null,
                    "parent": "Hth-}qjG)rsWgUgOcm@?",
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
                },
                "U/S5Iia;0;[]IN~T*psn": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "em!(S`b]+MB2h8((R434",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
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
                                "80"
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
                    "assetId": "9077988af075c80cc403b1d6e5891528",
                    "name": "I-glow",
                    "bitmapResolution": 1,
                    "md5ext": "9077988af075c80cc403b1d6e5891528.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 21,
                    "rotationCenterY": 38
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
            "x": -210,
            "y": 80,
            "size": 80.00000000000001,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "A-Glow",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "i[0P|D4q:tdG3Q{3hR`N": {
                    "opcode": "event_whenflagclicked",
                    "next": "-MKvtxlZd66oY:Z6{IVr",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "-MKvtxlZd66oY:Z6{IVr": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "i[0P|D4q:tdG3Q{3hR`N",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
                        "X": [
                            1,
                            [
                                4,
                                "-204"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "14"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "n]cy4r^o3t_m{{lMaGoY": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "-LLZ9x:Yw-i11]/T7RDq",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 460
                },
                "^6iWa|d-|jw!SQI#e(Jr": {
                    "opcode": "looks_sayforsecs",
                    "next": "YKzBCkZyE,u1HnRUQXL1",
                    "parent": "-LLZ9x:Yw-i11]/T7RDq",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Artistic!!!"
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
                "-LLZ9x:Yw-i11]/T7RDq": {
                    "opcode": "motion_glidesecstoxy",
                    "next": "^6iWa|d-|jw!SQI#e(Jr",
                    "parent": "n]cy4r^o3t_m{{lMaGoY",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
                        "X": [
                            1,
                            [
                                4,
                                "55"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "25"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "YKzBCkZyE,u1HnRUQXL1": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "^6iWa|d-|jw!SQI#e(Jr",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
                        "X": [
                            1,
                            [
                                4,
                                "-204"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "14"
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
                    "assetId": "fd470938cce54248aaf240b16e845456",
                    "name": "A-glow",
                    "bitmapResolution": 1,
                    "md5ext": "fd470938cce54248aaf240b16e845456.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 36,
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
                },
                {
                    "assetId": "3035f09384ae92b2a03cd4e964fadf6d",
                    "name": "Crash Cymbal",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 40033,
                    "md5ext": "3035f09384ae92b2a03cd4e964fadf6d.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 5,
            "visible": true,
            "x": -204,
            "y": 14,
            "size": 80,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "N-Glow",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "{nR@2|=S?G3-4ukMhO4n": {
                    "opcode": "event_whenflagclicked",
                    "next": "mH=}PU9/%#ySZ`^Q`+}e",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 15,
                    "y": 22
                },
                "GN6a/]#X1pYt~+7OZ{Rc": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": ",09=dAc^b~~X98.dk0,2",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 19,
                    "y": 400
                },
                "i4C7qLY,7Dc:@{}d`:nV": {
                    "opcode": "looks_sayforsecs",
                    "next": "^XGUgjOs186,p+(fGy9G",
                    "parent": ",09=dAc^b~~X98.dk0,2",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Nice!!!"
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
                "mH=}PU9/%#ySZ`^Q`+}e": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "{nR@2|=S?G3-4ukMhO4n",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
                        "X": [
                            1,
                            [
                                4,
                                "-202"
                            ]
                        ],
                        "Y": [
                            1,
                            [
                                4,
                                "-52"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                ",09=dAc^b~~X98.dk0,2": {
                    "opcode": "motion_pointindirection",
                    "next": "i4C7qLY,7Dc:@{}d`:nV",
                    "parent": "GN6a/]#X1pYt~+7OZ{Rc",
                    "inputs": {
                        "DIRECTION": [
                            1,
                            [
                                8,
                                "-90"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "^XGUgjOs186,p+(fGy9G": {
                    "opcode": "motion_pointindirection",
                    "next": null,
                    "parent": "i4C7qLY,7Dc:@{}d`:nV",
                    "inputs": {
                        "DIRECTION": [
                            1,
                            [
                                8,
                                "90"
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
                    "assetId": "d55a04ada14958eccc4aef446a4dad57",
                    "name": "N-glow",
                    "bitmapResolution": 1,
                    "md5ext": "d55a04ada14958eccc4aef446a4dad57.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 37,
                    "rotationCenterY": 39
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
            "x": -202,
            "y": -52,
            "size": 80,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
        },
        {
            "isStage": false,
            "name": "A-Glow2",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {
                "ojhZT:%|m?wFvLSVqRoH": {
                    "opcode": "event_whenflagclicked",
                    "next": "VkN2?uom)MjS=9rJ4@!:",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 27,
                    "y": 25
                },
                "VkN2?uom)MjS=9rJ4@!:": {
                    "opcode": "motion_glidesecstoxy",
                    "next": null,
                    "parent": "ojhZT:%|m?wFvLSVqRoH",
                    "inputs": {
                        "SECS": [
                            1,
                            [
                                4,
                                "1"
                            ]
                        ],
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
                                "-120"
                            ]
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "?LAjCC]|@!Vp6k;A1Zv{": {
                    "opcode": "event_whenthisspriteclicked",
                    "next": "2OV;`8O`W=S=~C(,;|?q",
                    "parent": null,
                    "inputs": {},
                    "fields": {},
                    "shadow": false,
                    "topLevel": true,
                    "x": 16,
                    "y": 410
                },
                "2OV;`8O`W=S=~C(,;|?q": {
                    "opcode": "sound_playuntildone",
                    "next": "SKyz]Pt/{=Ot`i6(41E;",
                    "parent": "?LAjCC]|@!Vp6k;A1Zv{",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "lb_xM=g74N72LvY!5A2V"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "lb_xM=g74N72LvY!5A2V": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "2OV;`8O`W=S=~C(,;|?q",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "Crash Cymbal",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                },
                "SKyz]Pt/{=Ot`i6(41E;": {
                    "opcode": "looks_sayforsecs",
                    "next": "lD`4iD`p^DIP_h!Q0[)C",
                    "parent": "2OV;`8O`W=S=~C(,;|?q",
                    "inputs": {
                        "MESSAGE": [
                            1,
                            [
                                10,
                                "Exciting!!!"
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
                "lD`4iD`p^DIP_h!Q0[)C": {
                    "opcode": "sound_playuntildone",
                    "next": null,
                    "parent": "SKyz]Pt/{=Ot`i6(41E;",
                    "inputs": {
                        "SOUND_MENU": [
                            1,
                            "mbj_F|Wh5Hk8Gm+}11A}"
                        ]
                    },
                    "fields": {},
                    "shadow": false,
                    "topLevel": false
                },
                "mbj_F|Wh5Hk8Gm+}11A}": {
                    "opcode": "sound_sounds_menu",
                    "next": null,
                    "parent": "lD`4iD`p^DIP_h!Q0[)C",
                    "inputs": {},
                    "fields": {
                        "SOUND_MENU": [
                            "Crash Cymbal",
                            null
                        ]
                    },
                    "shadow": true,
                    "topLevel": false
                }
            },
            "comments": {},
            "currentCostume": 0,
            "costumes": [
                {
                    "assetId": "80382a5db3fa556276068165c547b432",
                    "name": "E-glow",
                    "bitmapResolution": 1,
                    "md5ext": "80382a5db3fa556276068165c547b432.svg",
                    "dataFormat": "svg",
                    "rotationCenterX": 34,
                    "rotationCenterY": 38
                }
            ],
            "sounds": [
                {
                    "assetId": "0c2df42865b262ed57e181d1ef0cb110",
                    "name": "pop",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 1031,
                    "md5ext": "0c2df42865b262ed57e181d1ef0cb110.wav"
                },
                {
                    "assetId": "45c9a1b0fe8eb8bd143a714c997ee769",
                    "name": "Crash Cymbal",
                    "dataFormat": "wav",
                    "format": "",
                    "rate": 44100,
                    "sampleCount": 40034,
                    "md5ext": "45c9a1b0fe8eb8bd143a714c997ee769.wav"
                }
            ],
            "volume": 100,
            "layerOrder": 3,
            "visible": true,
            "x": -200,
            "y": -120,
            "size": 80,
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
        "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15"
    }
}
},{}],7:[function(require,module,exports){
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
        this.requirements.costumes1 = {bool: false, str: 'At least one sprite has a new costume'};
        this.requirements.costumes = { bool: false, str: 'At least half of the sprites have new costumes' };//done
        this.requirements.dialogue1 = { bool: false, str: 'At least one sprite has new dialogue' };
        this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have new dialogue using blocks specified' };//done
        this.requirements.movement1 = { bool: false, str: 'At least one sprite has new movement'};
        this.requirements.movement = { bool: false, str: 'At least half of the sprites have new movement using blocks specified' };//to fix
        this.requirements.backdrop = { bool: false, str: 'The background has been changed' };//done
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/name-poem-original-test'), null);
        this.initReqs();
        if (!is(fileObj)) return;

        //instantiate counters for requirements
        let spritesWithScripts = 0;
        let spritesWithNewDialogue = 0;
        let spritesWithNewCostumes = 0;
        let spritesWithNewMovement = 0;
        let newBackdrop = false;

        //make list of original costumes
        //make map of original blocks for movement
        let originalCostumes = [];
        let ogMovementBlocks = []; //array of arrays each containing a movement block's opcode, next, and previous
        let mapOriginal = new Map();
        let mapProject = new Map();
        for (let target of original.targets) {
            if (target.isStage) { continue; }
            for (let costume of target.costumes) {
                originalCostumes.push(costume.assetId);
            }
            for (let block in target.blocks) {
                if (target.blocks[block].opcode.includes('motion_') || target.blocks[block].opcode.includes('looks_')) {
                    if ((!target.blocks[block].opcode.includes('say')) && (!target.blocks[block].opcode.includes('think'))) {
                        let blockArray = [];
                        blockArray.push(target.blocks[block].opcode);
                        blockArray.push(target.blocks[block].next);
                        blockArray.push(target.blocks[block].previous);
                        ogMovementBlocks.push(blockArray);
                    }
                }
            }

            mapOriginal.set(target.name, target.blocks);
        }
        for (let target of project.targets) {
            //checks if backdrop has been changed
            if (target.isStage) {
                for (let cost of target.costumes) {
                    let equal = false;
                    for (let tOriginal of original.targets) {
                        for (let originalCostume of tOriginal.costumes) {
                            if (cost.assetId === originalCostume.assetId) {
                                equal = true;
                            }
                        }
                        if (!equal) {
                            newBackdrop = true;
                        }
                    }
                }
               this.requirements.backdrop.bool = newBackdrop;
            } else {

                //checks each sprite against given scripts to see if they've been changed
                let hasMovement = false;
                for (let script in target.scripts) {
                    for (let block in target.scripts[script].blocks) {
                        let opc = target.scripts[script].blocks[block].opcode;
                        let bool = true;
                        if (this.otherOpcodes.includes(opc) && opc !== 'looks_sayforsecs') {
                            if (opc === 'sound_playuntildone') {
                                let soundMenu = target.scripts[script].blocks[block].inputs.SOUND_MENU[1];
                                if (target.name === 'D-Glow') {
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'pop'
                                        && target.scripts[script].blocks[block].next === 'yBp{F@0b%qE?_?uRuv=P'
                                        && target.scripts[script].blocks[block].parent === ';7:di3O.oGwRy7Y-Zkyl') {
                                        bool = false;
                                    }
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'pop'
                                        && target.scripts[script].blocks[block].next === null
                                        && target.scripts[script].blocks[block].parent === 'yBp{F@0b%qE?_?uRuv=P') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow2') {
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'Crash Cymbal'
                                        && target.scripts[script].blocks[block].next === 'SKyz]Pt/{=Ot`i6(41E;'
                                        && target.scripts[script].blocks[block].parent === '?LAjCC]|@!Vp6k;A1Zv{') {
                                        bool = false;
                                    }
                                    if (target.blocks[soundMenu].fields.SOUND_MENU[0] === 'Crash Cymbal'
                                        && target.scripts[script].blocks[block].next === null
                                        && target.scripts[script].blocks[block].parent === 'SKyz]Pt/{=Ot`i6(41E;') {
                                        bool = false;
                                    }
                                }
                            }
                            if (opc === 'looks_changesizeby' && target.name === 'I-Glow') {
                                let param = target.scripts[script].blocks[block].inputs.CHANGE[1][1];
                                if (param === '30'
                                    && target.scripts[script].blocks[block].next === 'Hth-}qjG)rsWgUgOcm@?'
                                    && target.scripts[script].blocks[block].parent === 'ZstZjnd:|xmPpd|aG8zA') {
                                    bool = false;
                                }
                                if (param === '-30'
                                    && target.scripts[script].blocks[block].next === null
                                    && target.scripts[script].blocks[block].parent === 'Hth-}qjG)rsWgUgOcm@?') {
                                    bool = false;
                                }
                            }

                            if (opc === 'motion_glidesecstoxy') {
                                let paramSecs = target.scripts[script].blocks[block].inputs.SECS[1][1];
                                let paramX = target.scripts[script].blocks[block].inputs.X[1][1];
                                let paramY = target.scripts[script].blocks[block].inputs.Y[1][1];
                                let next = target.scripts[script].blocks[block].next;
                                let parent = target.scripts[script].blocks[block].parent;
                                if (target.name === 'D-Glow') {
                                    if (paramSecs === '1' && paramX === '-205' && paramY === '148'
                                        && next === null && parent === 'Fw}ev{0up#68XMVDC]5V') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'I-Glow') {
                                    if (paramSecs === '1' && paramX === '-210' && paramY === '80'
                                        && next === null && parent === 'em!(S`b]+MB2h8((R434') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow') {
                                    if (paramSecs === '1' && paramX === '55' && paramY === '25'
                                        && next === '^6iWa|d-|jw!SQI#e(Jr' && parent === 'n]cy4r^o3t_m{{lMaGoY') {
                                        bool = false;
                                    }
                                    if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                                        && next === null && parent === '^6iWa|d-|jw!SQI#e(Jr') {
                                        bool = false;
                                    }
                                    if (paramSecs === '1' && paramX === '-204' && paramY === '14'
                                        && next === null && parent === 'i[0P|D4q:tdG3Q{3hR`N') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'N-Glow') {
                                    if (paramSecs === '1' && paramX === '-202' && paramY === '-52'
                                        && next === null && parent === '{nR@2|=S?G3-4ukMhO4n') {
                                        bool = false;
                                    }
                                }
                                if (target.name === 'A-Glow2') {
                                    if (paramSecs === '1' && paramX === '-200' && paramY === '-120'
                                        && next === null && parent === 'ojhZT:%|m?wFvLSVqRoH') {
                                        bool = false;
                                    }
                                }
                            }
                            if (opc === 'motion_pointindirection' && target.name === 'N-Glow') {
                                let param = target.scripts[script].blocks[block].inputs.CHANGE[1][1];
                                if (param === '90'
                                    && target.scripts[script].blocks[block].next === 'i4C7qLY,7Dc:@{}d`:nV'
                                    && target.scripts[script].blocks[block].parent === 'GN6a/]#X1pYt~+7OZ{Rc') {
                                    bool = false;
                                }
                                if (param === '-90'
                                    && target.scripts[script].blocks[block].next === null
                                    && target.scripts[script].blocks[block].parent === 'i4C7qLY,7Dc:@{}d`:nV') {
                                    bool = false;
                                }
                            }
                            if (bool) {
                                hasMovement = true;
                            }
                        }
                    }
                }
                if (hasMovement) { spritesWithNewMovement++; }

                mapProject.set(target.name, target.blocks);
                let hasDialogue = false;

                //checks if dialogue/looks/motion have beenadded
                for (let script of target.scripts){
                    if (script.blocks[0].opcode.includes('event_')){
                        for (let block of script.blocks){
                            let opcode = block.opcode;
                            if (opcode==='looks_say'){
                                this.requirements.dialogue1.bool=true;
                            }
                            else if ((opcode.includes('motion_')||opcode.includes('looks_'))
                            && (!this.eventOpcodes.includes(opcode) && !this.otherOpcodes.includes(opcode))){
                                this.requirements.movement1.bool=true;
                            }
                            if (opcode.includes('motion_') || opcode.includes('looks_')) {
                                if ((!opcode.includes('say')) && (!opcode.includes('think'))) {
        
                                }
                            }
                        }
                    }
                }

                for (let block in target.blocks) {

                    // if (target.blocks[block].opcode==='looks_say'){
                    //    this.requirements.dialogue1.bool=true;
                    // }
                    // let opcode = target.blocks[block].opcode;
                    // if ((opcode.includes('motion_') || opcode.includes('looks_'))
                    //     && (!this.eventOpcodes.includes(opcode) && !this.otherOpcodes.includes(opcode))){
                    //         this.requirements.movement1.bool=true;
                    //     }

                    // if (target.blocks[block].opcode.includes('motion_') || target.blocks[block].opcode.includes('looks_')) {
                    //     if ((!target.blocks[block].opcode.includes('say')) && (!target.blocks[block].opcode.includes('think'))) {

                    //     }
                    // }

                    //checks for new dialogue
                    if (this.eventOpcodes.includes(target.blocks[block].opcode)) {                        
                        let b = new Block(target, block);
                        let childBlocks = b.childBlocks();
                        for (let i = 0; i < childBlocks.length; i++) {
                            if (childBlocks[i].opcode === 'looks_sayforsecs') {
                                let blockMessage = childBlocks[i].inputs.MESSAGE[1][1];
                                if ((blockMessage !== 'Daring!!!') &&
                                    (blockMessage !== 'Interesting!!!') &&
                                    (blockMessage !== 'Artistic!!!') &&
                                    (blockMessage !== 'Nice!!!') &&
                                    (blockMessage !== 'Exciting!!!')) {
                                    hasDialogue = true;
                                }
                            }
                        }
                        //checks if the sprite has a script
                        if (childBlocks.length >= 2) {
                            spritesWithScripts++;
                        }
                    }
                }
                if (hasDialogue) {
                    spritesWithNewDialogue++;
                }
                //checking costumes
                for (let costume of target.costumes) {
                    if (!originalCostumes.includes(costume.assetId)) {
                        spritesWithNewCostumes++;
                        break;
                    }
                }
            }
        }

        //sets requirements appropriately
       if (spritesWithNewDialogue) {this.requirements.dialogue1.bool=true;}
        if ((spritesWithNewDialogue >= project.sprites.length / 2)&&spritesWithNewDialogue) {
           this.requirements.dialogue.bool = true;
        }

       if (spritesWithNewCostumes) {this.requirements.costumes1.bool=true;}
        if ((spritesWithNewCostumes >= project.sprites.length / 2)&&spritesWithNewCostumes) {
           this.requirements.costumes.bool = true;
        }

      if (spritesWithNewMovement) {this.requirements.movement1.bool=true;}
        if ((spritesWithNewMovement >= project.sprites.length / 2)&&spritesWithNewMovement) {
          this.requirements.movement.bool = true;
        }
    }
}








},{"../act1-grading-scripts/name-poem-original-test":6,"../grading-scripts-s3/scratch3":26}],8:[function(require,module,exports){
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
        this.requirements.leftChanged = { bool: false, str: 'The left sprite has new dialogue' }; // done
        this.requirements.leftCostume = { bool: false, str: 'The left costume has been changed' }; // done
        this.requirements.rightCostume = { bool: false, str: 'The right costume has been changed' }; // done
        this.requirements.midCostume = { bool: false, str: 'The middle costume has been changed' };
        this.requirements.interactiveRight = { bool: false, str: 'Right sprite uses the "when this sprite clicked" block (is interactive)' };
        this.requirements.interactiveMiddle = { bool: false, str: 'Middle sprite uses the "when this sprite clicked" block (is interactive)' };
        this.requirements.speakingRight = { bool: false, str: 'Right sprite has a script with a say block in it' }; // done
        this.requirements.speakingMiddle = { bool: false, str: 'Middle sprite has a script with a say block in it' }; // done

        // done
        this.requirements.speaking1 = { bool: false, str: '1 sprite uses the say block' };
        this.requirements.speaking2 = {bool: false, str: '2 sprites use the say block'};
        this.requirements.speaking3 = {bool: false, str: '3 sprites use the say block'};
        this.requirements.interactive1 = { bool: false, str: '1 sprite is interactive' };
        this.requirements.interactive2 = {bool: false, str: '2 sprites are interactie'};
        
       
        // // extensions
        this.extensions.usesPlaySoundUntilDone = { bool: false, str: 'The project uses the "Play Sound Until" block in a script' };
        this.extensions.usesGotoXY = { bool: false, str: 'The project uses the "Go to XY" block in a script' };
        this.extensions.keyCommand = { bool: false, str: 'The project uses a "when "key" pressed" block in a script' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let origCostumeLeft = 0;
        let origCostumeRight = 0;
        let origCostumeMiddle = 0;
        let origLeftDialogue = '';

        // gets the costumes from the original project 
        var oldCostumes = [];
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Left') {
                let currCost1 = origTarget.currentCostume;
                origCostumeLeft = origTarget.costumes[currCost1].assetId;
                oldCostumes.push(origCostumeLeft);
                for (let block in origTarget.blocks) {
                    if (origTarget.blocks[block].opcode === 'looks_sayforsecs') {
                        origLeftDialogue = origTarget.blocks[block].inputs.MESSAGE[1][1];
                    }
                }
            }
            if (origTarget.name === 'Right') {
                let currCost2 = origTarget.currentCostume;
                origCostumeRight = origTarget.costumes[currCost2].assetId;
                oldCostumes.push(origCostumeRight);
            }
            if (origTarget.name === 'Middle') {
                let currCost3 = origTarget.currentCostume;
                origCostumeMiddle = origTarget.costumes[currCost3].assetId;
                oldCostumes.push(origCostumeMiddle);
            }
        }

        let leftCost = 0;
        let midCost = 0;
        let rightCost = 0;
        let leftDialogue = '';
        let rightDialogue = '';
        let midDialogue = '';
        let midInteraction = false;
        let rightInteraction = false;
        var soundOptions = ['looks_say', 'looks_sayforsecs'];
        var newCostumes = [];

        // strict requirements
        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
           
            if (target.name === 'Left') {
                let cost1 = target.currentCostume;
                leftCost = target.costumes[cost1].assetId;
                newCostumes.push(leftCost);
                for (let block in target.blocks) {
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            leftDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }

                    }
                }
                if (leftDialogue !== origLeftDialogue && leftDialogue !== '') {
                    this.requirements.leftChanged.bool = true;
                }
                if (leftCost !== origCostumeLeft && leftCost !== 0) {
                    this.requirements.leftCostume.bool = true;
                }
            }
            // make sure that the code is not the same as the original here, copy in from the bottom
            if (target.name === 'Middle') {
                let cost2 = target.currentCostume;
                midCost = target.costumes[cost2].assetId;
                newCostumes.push(midCost);
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else if ((target.blocks[block].next === "/f[ltBij)7]5Jtg|W(1%") && (target.blocks[block].parent === null)) {
                            let nextBlock = target.blocks[block].next;
                            if (target.blocks[nextBlock].next === null) {
                                continue;
                                // means that they have added another block to the script, meaning it is different from 
                                // the original
                            } else {
                                midInteraction = true;
                            }
                        } else {
                            midInteraction = true;
                        }
                    }
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            midDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }
                    }
                }
                if (midInteraction) {
                    this.requirements.interactiveMiddle.bool = true;
                }
                if (midDialogue !== '') {
                    this.requirements.speakingMiddle.bool = true;
                }
                if (midCost !== origCostumeMiddle && midCost !== 0) {
                    this.requirements.midCostume.bool = true;
                }
            }

            if (target.name === 'Right') {
                let cost3 = target.currentCostume;
                rightCost = target.costumes[cost3].assetId;
                newCostumes.push(rightCost);
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        }
                        else {
                            rightInteraction = true;
                        }
                    }
                    if (soundOptions.includes(target.blocks[block].opcode)) {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        } else {
                            rightDialogue = target.blocks[block].inputs.MESSAGE[1][1];
                        }
                    }
                }
                if (rightInteraction) {
                    this.requirements.interactiveRight.bool = true;
                }
                if (rightDialogue !== '') {
                    this.requirements.speakingRight.bool = true;
                }
                if (rightCost !== origCostumeRight && rightCost !== 0) {
                    this.requirements.rightCostume.bool = true;
                }
            }
        }


        // --------------------------------------------------------------------------------------------------------- //

    
        let speaks = false;
        let interactive = false;
        let numInteractive = 0;
        let numSpeaking = 0;

        //f there is a say block in a sprite that is not named catrina, and that say block is not used in the same 
        //context as the original project (same parent and next block)
        for (let target of project.targets) {
            speaks = false;
            interactive = false;
            if (target.name === 'Catrina') {
                continue;
            } else if (target.isStage) { continue;}
            else {
                console.log(speaks);
                for (let script in target.scripts) {
                    for (let block in target.scripts[script].blocks) {
                        if (soundOptions.includes(target.scripts[script].blocks[block].opcode)) {
                            console.log(speaks);
                            if ((target.scripts[script].blocks[block].next === "Q.gGFO#r}[Z@fzClmRq-") &&
                                (target.scripts[script].blocks[block].parent === "taz8m.4x_rVweL9%J@(3") &&
                                (target.scripts[script].blocks[block].inputs.MESSAGE[1][1] === "I am Grandpa John.")) {
                                continue;
                            } else if ((target.scripts[script].blocks[block].next === "sPl?mFlNaaD_l]+QJ.CW") &&
                                (target.scripts[script].blocks[block].parent === "Y5!LLf.Gqemqe/6!)t=e") &&
                                (target.scripts[script].blocks[block].inputs.MESSAGE[1][1] === "I loved to cook with my granchildren.")) {
                                continue;
                            }
                            else {
                                    
                                    speaks = true;
                                }
                        }

                        if (target.scripts[script].blocks[block].opcode === 'event_whenthisspriteclicked') {
                           
                            if (target.scripts[script].blocks[block].next === "}VBgCH{K:oDh6pV0h.pi" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else if (target.scripts[script].blocks[block].next === "/f[ltBij)7]5Jtg|W(1%" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                               
                            }  else if (target.scripts[script].blocks[block].next === null && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            }
                            else {
                                   
                                    interactive = true;
                                }
                        }

                        // extensions
                        if (target.scripts[script].blocks[block].opcode === 'sound_playuntildone') {
                            if (target.scripts[script].blocks[block].next === null && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else {
                                this.extensions.usesPlaySoundUntilDone.bool = true;
                            }
                        }
                        if (target.scripts[script].blocks[block].opcode === 'event_whenkeypressed') {
                            if (target.scripts[script].blocks[block].next === null && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else {
                                this.extensions.keyCommand.bool = true;
                            }
                        }
                        if (target.scripts[script].blocks[block].opcode === 'motion_gotoxy') {
                            if (target.scripts[script].blocks[block].next === null && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else {
                                this.extensions.usesGotoXY.bool = true;
                            }
                        }
                    }
                    
                }
               
                if (speaks === true) {
                    numSpeaking ++;
                }
                
                
                if (interactive === true) {
                    numInteractive ++;
                }
                
            }
        }
       
       
        if (numSpeaking >= 1) {
            this.requirements.speaking1.bool = true;
        }
        if (numSpeaking >= 2) {
            this.requirements.speaking2.bool = true;
        }
        if (numSpeaking >= 3) {
            this.requirements.speaking3.bool = true;
        }
        if (numInteractive >= 1) {
            this.requirements.interactive1.bool = true;
        }
        if (numInteractive >= 2) {
            this.requirements.interactive2.bool = true;
        }
    }
} 
},{"../act1-grading-scripts/originalOfrenda-test":10,"../grading-scripts-s3/scratch3":26}],9:[function(require,module,exports){

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
        this.requirements.scriptForBunnyMoves = { bool: false, str: 'Bunny has a script in which it moves' };
        this.requirements.scriptForBunnySounds = { bool: false, str: 'Bunny has a script in which it makes a sound' };
        this.requirements.scriptForBunnySaysOrThinks = { bool: false, str: 'Bunny has a script in which it says or thinks something' };
        this.requirements.scriptInOrderBunny = {bool: false, str: 'Bunny has a script in which the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.scriptForHeddyMoves = { bool: false, str: 'Heddy has a script in which it moves' };
        this.requirements.scriptForHeddySounds = { bool: false, str: 'Heddy has a script in which it makes a sound' };
        this.requirements.scriptForHeddySaysOrThinks = { bool: false, str: 'Heddy has a script in which it says or thinks something' };
        this.requirements.scriptInOrderHeddy = {bool: false, str: 'Heddy has a script in which the blocks are used in the in the order specified: move, make a sound, say/think something'};

        this.requirements.rooGlides = { bool: false, str: "Another glide block is added to Roo's script to make it move back to the starting location" };
        this.extensions.allMove = { bool: false, str: 'All animals move to a different location' };
        this.extensions.anotherSprite = { bool: false, str: 'Another sprite is added and has a script' };
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
                        if (script.blocks.length > 1) {
                            this.extensions.anotherSprite.bool = true;
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

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Bunny') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
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
                    }
                }
                else if (target.name === 'Heddy') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
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
                    }
                }

                else if (target.name === 'Roo') {
                    for (let script of target.scripts) {
                        // makes sure that it is part of a script that starts with an event block
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (eventOpcodes.includes(script.blocks[0].opcode)) {
                                if (script.blocks[i].opcode === 'motion_glidesecstoxy') {
                                    numGlides++;
                                }
                            }
                        }
                    }
                }
                
                if (numGlides >= 2) {
                    this.requirements.rooGlides.bool = true;
                }
            }
        }
    }
}

},{"../grading-scripts-s3/scratch3":26}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
        this.requirements.helenChangesColorFaster = { bool: false, str: 'Helen the crab changes colors fasters' };
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
        let numMoveMisc = 0;

        for (let target of project.targets) {
            if (target.isStage) { continue; }
            else {
                if (target.name === 'Fred') {
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            if ((script.blocks[i].opcode === 'looks_say') || (script.blocks[i].opcode === 'looks_sayforsecs')) {
                                let dialogue = (script.blocks[i].inputs.MESSAGE[1][1]).toLowerCase();
                                let punctuationless = dialogue.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                let finalString = punctuationless.replace(/\s{2,}/g, " ");
                                finalString = finalString.replace(/\s+/g, '');
                                if (finalString === 'havefun') {
                                    haveFunFred = true;
                                    //this.requirements.fredSaysHaveFun.bool = true;
                                }
                            }

                            if (script.blocks[i].opcode === 'motion_movesteps') {
                                numMoveFred++;
                            }
                        }
                    }
                    if (numMoveFred > 3) {
                        fredMoves = true;
                        //this.requirements.fredMoves.bool = true;
                    }
                }

                else if (target.name === 'Helen') {
                    let origWait = 1;
                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {
                            if (script.blocks[i].opcode === 'control_repeat') {
                                let substack = script.blocks[i].inputs.SUBSTACK[1];
                                if (target.blocks[substack].inputs.DURATION[1][1] < 1) {
                                    //this.requirements.helenChangesColor.bool = true;
                                    helenSpeed = true;
                                }
                            }
                            if (script.blocks[0].opcode === "event_whenthisspriteclicked") {
                                for (let i = 0; i < script.blocks.length; i++) {
                                    if (script.blocks[i].opcode === 'looks_switchcostumeto') {
                                        //this.requirements.helenDifferentColor.bool = true;
                                        helenColor = true;
                                    }
                                }

                            }
                        }
                    }
                }
                else {
                    for (let block in target.blocks) {
                        if ((target.blocks[block].opcode === 'looks_say') || (target.blocks[block].opcode === 'looks_sayforsecs')) {
                            let dialogue1 = (target.blocks[block].inputs.MESSAGE[1][1]).toLowerCase()
                            let punctuationless1 = dialogue1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                            let finalString1 = punctuationless1.replace(/\s{2,}/g, " ");
                            finalString1 = finalString1.replace(/\s+/g, '');
                            if (finalString1 === 'havefun') {
                                haveFunMisc = true;
                            }
                        }

                        if (target.blocks[block].opcode === 'motion_movesteps') {
                            numMoveMisc++;
                        }

                        if (target.blocks[block].opcode === 'control_repeat') {
                            let substack1 = target.blocks[block].inputs.SUBSTACK[1];
                            if (target.blocks[substack1].inputs.DURATION[1][1] < 1) {
                                miscSpeed = true;
                            }
                        }

                        if (target.blocks[block].opcode === 'looks_switchcostumeto') {
                            if (target.blocks[block].next === "ohLm|%[frcYkDCD02Izs" && target.blocks[block].parent === "N_^HGxU/.EOLU(;~p]Hp") {
                                continue;
                            } else {
                                miscColor = true;
                            }
                        }
                    }
                }
                if (numMoveMisc > 3) {
                    miscMoves = true;
                }
            }
        }
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



},{"../grading-scripts-s3/scratch3":26}],12:[function(require,module,exports){
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
        let animatedSprites = reports.filter(r => r.isAnimated && r.visible).length;
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

},{"./scratch3":26}],13:[function(require,module,exports){
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
        this.animationTypes = new Set([]);
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
                spritesAnimatedInPlace += (report.isAnimated && !report.isMoving);
                spritesAnimatedInMotion += (report.isAnimated && report.isMoving);
            }
        }
        if (spritesAnimatedInMotion >= 1) {
            this.requirements.animatedInMotion.bool = true;
            spritesAnimatedInMotion--;
        }
        this.requirements.animatedInPlace1.bool = (spritesAnimatedInMotion + spritesAnimatedInPlace) >= 1;
        this.requirements.animatedInPlace2.bool = (spritesAnimatedInMotion + spritesAnimatedInPlace) >= 2;
        this.requirements.atLeastThreeSprites.bool = sprites >= 3;

        this.extensions.moreAnimations.bool = spritesAnimatedInMotion > 1 || spritesAnimatedInPlace > 2;

        //counts the number of animation (motion) blocks used
        this.extensions.moreThanOneAnimation.bool = (this.animationTypes.size >= 1)
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
},{"./scratch3":26}],14:[function(require,module,exports){
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

        let ifCondition = block.conditionBlock();  // the operator block       
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
},{"./scratch3":26}],15:[function(require,module,exports){
require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            changedCostume: { bool: false, str: 'Car\'s costume has been changed.'                 },
            carStops:       { bool: false, str: 'Car stops at something other than the stop sign.' },
            carTalks:       { bool: false, str: 'Car says something after it stops.'               },
            changedSpeed:   { bool: false, str: 'Changed the speed of the car.'                    }
        };
        this.extensions =   {
            otherSprites:   { bool: false, str: 'Added scripts to other sprites.'                  },
            addedSound:     { bool: false, str: 'Car plays a sound.'                               }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        project.context.scriptCounts = [];
        for (var sprite of project.sprites) {
            project.context.scriptCounts.push(sprite.scripts.filter(
                script => script.blocks.length > 1 && script.blocks[0].opcode.includes('event_when')).length);
            for (var script of sprite.scripts.filter(script => script.blocks[0].opcode.includes('event_when'))) {
                script.context.hasLooped = 0;
                for (var block of script.blocks) {

                    /// Look for the loop
                    if (block.opcode === 'control_repeat_until' && is(block.subScripts())) {

                        /// Check loop body
                        script.context.hasLooped = 1;
                        block.context.includesMove = 0;
                        block.context.includesWait = 0;
                        if (block.subscripts.length) {
                            for (var subBlock of block.subscripts[0].blocks) {
                                if (subBlock.opcode === 'motion_movesteps') {
                                    block.context.includesMove = 1;
                                    if (parseFloat(subBlock.inputs.STEPS[1][1]) !== 10) {
                                        script.context.changedSpeed = 1;
                                    }
                                }
                                if (subBlock.opcode === 'control_wait') {
                                    block.context.includesWait = 1;
                                    if (parseFloat(subBlock.inputs.DURATION[1][1]) !== 0.1) {
                                        script.context.changedSpeed = 1;
                                    }
                                }
                            }
                        }
                        if (block.context.includesMove && !block.context.includesWait) {
                            script.context.changedSpeed = 1;
                        }

                        /// Check stop condition
                        if (is(block.inputs.CONDITION)) {
                            for (var anyBlock_ in sprite.blocks) {
                                if (anyBlock_ === block.inputs.CONDITION[1]) {
                                    var anyBlock = sprite.blocks[anyBlock_];
                                    if (is(anyBlock.inputs.TOUCHINGOBJECTMENU)) {
                                        var touchingObject = sprite.blocks[
                                            anyBlock.inputs.TOUCHINGOBJECTMENU[1]].fields.TOUCHINGOBJECTMENU[0];
                                        for (var anySprite of project.sprites) {
                                            if (anySprite.name === touchingObject && !anySprite.name.includes('Stop')) {
                                                script.context.carStops = 1;
                                            }
                                        }
                                    }
                                    else if (anyBlock.opcode === 'sensing_touchingcolor') {
                                        script.context.carStops = 1;
                                    }
                                }
                            }
                        }
                    }

                    /// Check what happens outside the loop
                    if (script.context.hasLooped &&
                        (block.opcode.includes('looks_say') || block.opcode.includes('looks_think'))) {
                        script.context.carTalks = 1;
                    }
                    if (block.opcode.includes('sound_play')) {
                        script.context.addedSound = 1;
                    }
                }
            }
            var costumeNames = sprite.costumes.map(costume => costume.name);
            var isCar = false;
            for (var costumeName of costumeNames) {
                if (['SUV', 'Cooper', 'Sedan', 'Bug'].includes(costumeName) || sprite.name === 'Car') {
                    isCar = true;
                }
            }
            if (isCar) {
                var costumeName = sprite.costumes[sprite.currentCostume].name;
                sprite.context.changedCostume = costumeName !== 'Sedan';
            }
            sprite.context.pull(['carStops', 'carTalks', 'changedSpeed', 'addedSound'], 1, false);
        }
        project.context.scriptCounts.sort((a, b) => a - b);
        project.context.otherSprites = (
            project.context.scriptCounts[0] > 0 ||
            project.context.scriptCounts[1] > 1 ||
            project.context.scriptCounts[2] > 1 ||
            project.context.scriptCounts[3] > 2
        )
        project.context.pull(['changedCostume', 'carStops', 'carTalks', 'changedSpeed', 'addedSound'], 1, false);
        project.context.makeGrade(this);
    }
}

},{"./scratch3":26}],16:[function(require,module,exports){
/* Conditional Loops L2 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
Scratch 3 updates: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.stop = {bool: false, str: 'Vehicle sprite stops when touching another sprite or another color'}; // check condition in repeat until
        this.requirements.speak = {bool: false, str: 'Vehicle sprite says something or makes a sound when it stops'}; // check block after repeat until 
        this.requirements.moves = {bool: false, str: 'Vehicle sprite moves across the stage in a looping fashion'}; // check contents of the loop
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();

        for (let target of project.targets) {
            if (target.isStage) {
                continue;
            }
            else {        
                for (let block in target.blocks) {
                    
                    // script starting with the when green flag clicked block
                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        
                        let b = new Block(target,block);
                        let childBlocks = b.childBlocks();
                        for (let i = 0; i < childBlocks.length; i ++) {
                            if (childBlocks[i].opcode === 'control_repeat_until') {
                                // checks if a sound is made once the loop is over
                                var soundOptions = ['sound_playuntildone', 'sound_play', 'looks_say', 'looks_sayforsecs']
                                let nextBlock = childBlocks[i].next;
                                if (nextBlock === null) {
                                    this.requirements.speak.bool = false;
                                } else if (soundOptions.includes(target.blocks[nextBlock].opcode)) {
                                    this.requirements.speak.bool = true;
                                }
                                if (childBlocks[i].inputs.CONDITION) {
                                    let condition = childBlocks[i].inputs.CONDITION[1];

                                    if (target.blocks[condition].opcode === 'sensing_touchingobject') {
                                        let touching = target.blocks[condition].inputs.TOUCHINGOBJECTMENU[1];
                                        var objectTouching = target.blocks[touching].fields.TOUCHINGOBJECTMENU[0];
                                    }
                                    
                                    // checks to see if it stops when it is touching a color
                                    if ((target.blocks[condition].opcode === 'sensing_touchingcolor') ||
                                        (target.blocks[condition].opcode === 'sensing_coloristouchingcolor')) {
                                        this.requirements.stop.bool = true;
                                    }
                                    
                                    let substack = childBlocks[i].inputs.SUBSTACK[1];
                                    
                                    var moveOptions = ['motion_changexby', 'motion_changeyby', 'motion_movesteps', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
                                    if (moveOptions.includes(target.blocks[substack].opcode)) {
                                        this.requirements.moves.bool = true;
                                    }
                                }
                            }
                        }
                    }  
                }
            }
            // checks to see if it stops when it is touching another sprite
            if (target.name === objectTouching) {
                this.requirements.stop.bool = true;
            }
        }
    }
}


},{"../grading-scripts-s3/scratch3":26}],17:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
/* Decomposition By Sequence L1 Autograder
 * Scratch 2 (original) version: Max White, Summer 2018
 * Scratch 3 updates: Elizabeth Crowdus, Spring 2019
 * Reformatting, bug fixes, and updates: Anna Zipp, Summer 2019
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

},{"./scratch3":26}],19:[function(require,module,exports){
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
},{"./scratch3":26}],20:[function(require,module,exports){
require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            reactToClick: { bool: false, str: 'Three sprites react to being clicked.'                          },
            getBigger:    { bool: false, str: 'Three sprites get bigger when clicked.'                         },
            talkTwice:    { bool: false, str: 'After getting bigger the sprites talk twice.'                  },
            resetSize:    { bool: false, str: 'After talking twice the sprites reset to their original size.' }
        };
        this.extensions = {
            changedName:  { bool: false, str: 'At least one sprite\'s name has been changed.'                  },
            addedSpin:    { bool: false, str: 'At least one sprite spins using turn and wait blocks.'          },
            addedEvent:   { bool: false, str: 'At least one sprite reacts to a different event.'               }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        for (var sprite of project.sprites) {
            for (var script of sprite.scripts.filter(script => script.blocks[0].opcode.includes('event_when'))) {
                script.context.spriteSize = script.context.initialSpriteSize = parseFloat(sprite.size);
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) script.context.getBigger = 1;
                        script.context.spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > script.context.initialSpriteSize) script.context.getBigger = 1;
                        script.context.spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    if (block.opcode.includes('looks_say') && script.context.spriteSize > script.context.initialSpriteSize) {
                        script.context.talkTwice++;
                    }
                }
                if (script.context.getBigger && Math.abs(script.context.spriteSize - script.context.initialSpriteSize) < 0.05) {
                    script.context.resetSize = 1;
                }
                if (script.blocks[0].opcode === 'event_whenthisspriteclicked' && script.blocks.length > 1) {
                    script.context.reactToClick = 1;
                }
                else if (script.blocks[0].opcode !== 'event_whenflagclicked' && script.blocks.length > 1) {
                    script.context.addedEvent = 1;
                }
                if (script.blocks.some(block => block.opcode.includes('motion_turn')) &&
                        script.blocks.some(block => block.opcode === 'control_wait')) {
                    script.context.addedSpin = 1;
                }
            }
            sprite.context.changedName = !['Left', 'Middle', 'Right', 'Catrina'].includes(sprite.name);
            sprite.context.pull(['reactToClick', 'getBigger', 'resetSize', 'addedEvent', 'addedSpin'], 1, false);
            sprite.context.pull(['talkTwice'], 2, false);
        }
        project.context.pull(['reactToClick', 'getBigger', 'talkTwice', 'resetSize'], 3, true);
        project.context.pull(['changedName', 'addedSpin', 'addedEvent'], 1, false);
        project.context.makeGrade(this);
    }
}

},{"./scratch3":26}],21:[function(require,module,exports){
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
        var validScripts = 0;    

        this.info.sprites++;
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))){
            
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
            if (event.opcode == "event_whenkeypressed") 
                event.opcode += event.fields.KEY_OPTION[0];
            // adds to list of unique events and scripts
            if (!events.includes(event.opcode)) {
                events.push(event.opcode);
                if (script.blocks.length > 1) 
                    validScripts++;
            }
            // checks if scripts outside of the required were used (only the first key pressed event is counted as required)
            if (!(['event_whenflagclicked', 'event_whenthisspriteclicked'].includes(event.opcode) || event.opcode.includes('event_whenkeypressed')) ||
                    (event.opcode.includes('event_whenkeypressed') && !events.includes(event.opcode))) {
                this.extensions.moreScripts.bool = true;
            }
        } 

        // check off how many sprites have met the requirements
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
        if (validScripts >=2) this.info.spritesWith2Scripts++
        else if (validScripts >= 1) this.info.spritesWith1Script++;
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
        this.requirements.usesTheThreeEvents.bool = (reqEvents.length === 3);
        this.requirements.hasThreeSprites.bool = (project.targets.length - 1 >= 3);
        
        delete this.info.strings;
        this.info.score = Object.values(this.requirements).reduce((sum, r) => sum + (r.bool? 1 : 0), 0);
        
    }
} 
},{"./scratch3":26}],22:[function(require,module,exports){
/* One Way Sync L1 Autograder
 * Marco Anaya, Summer 2019
 */
require('./scratch3');

module.exports = class {

	init() { //initialize all metrics to false
		this.requirements = {
			oneToOne: {bool:false, str:'Djembe passes unique message to Mali child'},
			djembePlays: {bool: false, str: 'When Djembe is clicked, Djembe plays music'},
			djembeToChild: {bool: false, str: 'When Djembe is clicked, Mali child dances'},
			startButton: {bool: false, str: 'Start button sprite created'},
			oneToMany: {bool: false, str: 'Start button passes the same message to all other sprites'},
			startToSprite1: {bool: false, str: 'A sprite plays or dances when the start button is clicked'},
			startToSprite2:	{bool: false, str: 'Another sprite plays or dances when the start button is clicked'},
			startToSprite3:	{bool: false, str: 'A third sprite plays or dances when the start button is clicked'},
			startToSprite4:	{bool: false, str: 'A fourth sprite plays or dances when the start button is clicked'}
		};
		this.extensions = {
			changeWait: {bool: false, str: 'Changed the duration of a wait block'},
			sayBlock:	{bool: false, str: 'Added a say block under another event'}
		}
	}

	grade(fileObj, user) {
		this.init();
		const project = new Project(fileObj)

		let reports = project.sprites.map(sprite => this.gradeSprite(sprite));
		let messages = {};
		
		for (let report of reports) {
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

		

		reports = reports.reduce((acc, r) => {
			acc.push({
				name: r.name,
				plays: r.plays,
				sent: 
					r.sent.length === 0 ? null : r.sent.reduce((acc, msg) => {
						acc[msg] = messages[msg].recipents;
						return acc;
					}, {}),
				received: r.received,
				dances: r.dances
			});
			return acc;
		}, []);
		const sentCount = (sender) => 
				Object.values(sender.sent).reduce((acc, b) => acc + b.length, 0) + !(sender.name.includes('ali') || sender.name.includes('avajo'));

		let senders = reports.filter(r => r.sent).sort((a, b) => {
				return sentCount(b) - sentCount(a);
		})
		this.requirements.startButton.bool = reports.length >= 5;
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
					this.requirements[`startToSprite${i}`].bool = true;
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
            [this.requirements.oneToOne.bool, this.requirements.djembePlays.bool, this.requirements.djembeToChild.bool] = Object.values(probableDjembe);
        }		
	}
	gradeSprite(sprite) {
		let reqs = {
			name: sprite.name,
			plays: {onClick: false, onBroadcast: false},
			sent: [],
			received: [],
			dances: {costume: false, wait: false}
		}
		for (let script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))) {
			if (script.blocks[0].opcode === 'event_whenthisspriteclicked')
				script.traverseBlocks((block, level) => {
					if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
						reqs.plays.onClick = true;
					else if (['event_broadcast', 'event_broadcastandwait'].includes(block.opcode))
						reqs.sent.push( block.inputs.BROADCAST_INPUT[1][1])
				});
			else if (script.blocks[0].opcode === 'event_whenbroadcastreceived') {
				reqs.received.push(script.blocks[0].fields.BROADCAST_OPTION[0]);
				script.traverseBlocks((block, level) => {
					if (['sound_play', 'sound_playuntildone'].includes(block.opcode))
						reqs.plays.onBroadcast = true;
					else if (['event_blooks_switchcostumeto', 'looks_nextcostume'].includes(block.opcode))
						reqs.dances.costume = true;
					else if (block.opcode === 'control_wait') {
						reqs.dances.wait = true;
						if (block.inputs.DURATION[1][1] != .5) this.extensions.changeWait.bool = true;
					}
				});
			} 
			script.traverseBlocks((block, level) => {
				if (['looks_say', 'looks_sayforsecs'].includes(block.opcode))
					this.extensions.sayBlock.bool = true;
			});
		}
		reqs.dances = reqs.dances.costume && reqs.dances.costume;
		return reqs;
	}
}
},{"./scratch3":26}],23:[function(require,module,exports){
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

    arraysMatch(arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) {

            return false;
        }

        // Check if all items exist and are in the same order
        for (var i = 0; arr1.length < i; i++) {
            if (arr1[i] !== arr2[i]) {

                return false;
            }
        }

    };

    // function that decides what strand the project is, returns a string
    // whichStrand(projBackdrops) {
    //     let gamingOrig = new Project(require('../grading-scripts-s3/gamingOriginal'));
    //     let multiOrig = new Project(require('../grading-scripts-s3/multiculturalOriginal'));
    //     let youthOrig = new Project(require('../grading-scripts-s3/youthOriginal'));

    //     // gets the asset id's of the original gaming project (backdrops)
    //     let gamingBackdrops = [];
    //     for (let target of gamingOrig.targets) {
    //         for (let costume of target.costumes) {
    //             gamingBackdrops.push(costume.assetId);
    //         }
    //     }
    //     // gets the asset id's of the original multicultural project (backdrops)
    //     let multiBackdrops = [];
    //     for (let target of multiOrig.targets) {
    //         for (let costume of target.costumes) {
    //             multiBackdrops.push(costume.assetId);
    //         }
    //     }
    //     // gets the asset id's of the original youth culture project (backdrops)
    //     let youthBackdrops = [];
    //     for (let target of youthOrig.targets) {

    //         for (let costume of target.costumes) {
    //             youthBackdrops.push(costume.assetId);
    //         }

    //     }
    //     var util = require('util');
    //     let origUtil = util.inspect(projBackdrops);
    //     let gamingUtil = util.inspect(gamingBackdrops);
    //     let multiUtil = util.inspect(multiBackdrops);
    //     let youthUtil = util.inspect(youthBackdrops);

    //     if (origUtil === gamingUtil) {
    //         return 'gaming';
    //     }
    //     else if (origUtil === multiUtil) {
    //         return 'multicultural'
    //     }
    //     else if (origUtil === youthUtil) {
    //         return 'youthculture';
    //     } else {
    //         return 'gaming';
    //     }
    // };


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
        console.log(strand);


        // gaming strand 
        if (strand === 'gaming') {

            this.initReqsGaming();
            let sayBlocks = ['looks_say', 'looks_sayforsecs'];
            let sayCarl = false;

            let sayBlocksGaming = 0;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {


                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {


                            // makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode === 'looks_sayforsecs') {

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

                                if (sayBlocks.includes(script.blocks[i].opcode)) {
                                    sayBlocksGaming++;
                                }
                            }
                        }
                    }
                }
            }
            // requirement not fulfilled
            if (sayCarl === false) {
                if (sayBlocksGaming > 4) {
                    this.extensions.helenSpeaks.bool = true;
                }
            }

            if (sayBlocksGaming > 5) {
                this.extensions.helenSpeaks.bool = true;
            }
            
        }


        if (strand === 'multicultural') {
            this.initReqsMulticultural();
            let sayBlocks = ['looks_say', 'looks_sayforsecs'];
            let sayBlocksMulticultural = 0;
            let sayNeha = false;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {
                    for (let script of target.scripts) {

                        for (let i = 0; i < script.blocks.length; i++) {

                            // makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode === 'looks_say') {


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
                                if (sayBlocks.includes(script.blocks[i].opcode)) {
                                    sayBlocksMulticultural++;
                                }
                            }
                        }
                    }
                }
            }
            if (sayNeha === false) {
                if (sayBlocksMulticultural > 14) {
                    this.extensions.bradSpeaks.bool = true;
                }
            }
            // checks to see if there is one more than the original say block count, exlcuding the say block needed for the requirement
            if (sayBlocksMulticultural > 15) {
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


            let sayBlocks = ['looks_say', 'looks_sayforsecs'];
            
            let sayBlocksYouthCulture = 0;
            let sayIndia = false;

            for (let target of project.targets) {
                if (target.isStage) { continue; }
                else {


                    for (let script of target.scripts) {
                        for (let i = 0; i < script.blocks.length; i++) {

                            //makes sure that the script starts with an event block
                            if (script.blocks[0].opcode.includes('event_')) {
                                if (script.blocks[i].opcode === 'looks_sayforsecs') {

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
                            if (sayBlocks.includes(script.blocks[i].opcode)) {
                                sayBlocksYouthCulture++;
                            }

                        }
                    }


                }
            }
            
            if (sayIndia === false) {
                if (sayBlocksYouthCulture > 4) {
                    this.extensions.easelSaysSomethingElse.bool = true;
                }
            }

            if (sayBlocksYouthCulture > 5) {
                this.extensions.easelSaysSomethingElse.bool = true;
            }
             
        }
    }
}
},{"../grading-scripts-s3/scratch3":26,"../grading-scripts-s3/youthOriginal":31,"./templates/scratch-basics-L1-gaming":27,"./templates/scratch-basics-L1-multicultural":28,"./templates/scratch-basics-L1-youthculture":29}],25:[function(require,module,exports){
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
(function (global){
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
        this.within = within;
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
    conditionBlock() {
        if (no(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1], this);
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
    /// Checks if the
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
        for (var block of this.blocks) {
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
    /// Format for templates
    /*
    var templates = {
        multicultural: require('./templates/events-L1-multicultural'),
        youthCulture:  require('./templates/events-L1-youth-culture'),
        gaming:        require('./templates/events-L1-gaming')
    };
    */
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./context":17}],27:[function(require,module,exports){
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
            "currentCostume": 4,
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
            "layerOrder": 4,
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
},{}],28:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"e6bf56f64eb4e7e6c97ec6c97e90d023","name":"Holi Background","bitmapResolution":1,"md5ext":"e6bf56f64eb4e7e6c97ec6c97e90d023.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Neha","variables":{},"lists":{},"broadcasts":{},"blocks":{"6*c`Xv=UPZ2te:JB2+U*":{"opcode":"event_whenflagclicked","next":"1,sGaB#:WD/!fp4ecgw=","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-67,"y":-587},"1,sGaB#:WD/!fp4ecgw=":{"opcode":"motion_gotoxy","next":"0*gfG!}+dNBRamr1EdBt","parent":"6*c`Xv=UPZ2te:JB2+U*","inputs":{"X":[1,[4,"28"]],"Y":[1,[4,"-51"]]},"fields":{},"shadow":false,"topLevel":false},"0*gfG!}+dNBRamr1EdBt":{"opcode":"looks_switchcostumeto","next":"y;SD_2:1H=d-=o]rf3Nq","parent":"1,sGaB#:WD/!fp4ecgw=","inputs":{"COSTUME":[1,"-XUo5ONrDRD76UyvwKL?"]},"fields":{},"shadow":false,"topLevel":false},"-XUo5ONrDRD76UyvwKL?":{"opcode":"looks_costume","next":null,"parent":"0*gfG!}+dNBRamr1EdBt","inputs":{},"fields":{"COSTUME":["Neha1",null]},"shadow":true,"topLevel":false},"y;SD_2:1H=d-=o]rf3Nq":{"opcode":"control_wait","next":"#;GgQ}*l)tV4E{1NPadV","parent":"0*gfG!}+dNBRamr1EdBt","inputs":{"DURATION":[1,[5,"1"]]},"fields":{},"shadow":false,"topLevel":false},"#;GgQ}*l)tV4E{1NPadV":{"opcode":"looks_sayforsecs","next":"GBVU3I7+QD=TSfHx]bhU","parent":"y;SD_2:1H=d-=o]rf3Nq","inputs":{"MESSAGE":[1,[10,"Hi, I'm Neha!"]],"SECS":[1,[4,"2"]]},"fields":{},"shadow":false,"topLevel":false},"GBVU3I7+QD=TSfHx]bhU":{"opcode":"looks_sayforsecs","next":"lTPM~|:Xs,_if#cv*}5O","parent":"#;GgQ}*l)tV4E{1NPadV","inputs":{"MESSAGE":[1,[10,"We are celebrating Holi, a traditional Hindu festival from India!"]],"SECS":[1,[4,"4"]]},"fields":{},"shadow":false,"topLevel":false},"lTPM~|:Xs,_if#cv*}5O":{"opcode":"looks_sayforsecs","next":"n%]__?|Z8]rI5Nb?gViq","parent":"GBVU3I7+QD=TSfHx]bhU","inputs":{"MESSAGE":[1,[10,"We use colorful powders and pastes to celebrate the beginning of Spring!"]],"SECS":[1,[4,"4"]]},"fields":{},"shadow":false,"topLevel":false},"n%]__?|Z8]rI5Nb?gViq":{"opcode":"looks_sayforsecs","next":",M3195%JsXVXc(d1Zg:L","parent":"lTPM~|:Xs,_if#cv*}5O","inputs":{"MESSAGE":[1,[10,"I'm holding some gulal!"]],"SECS":[1,[4,"3"]]},"fields":{},"shadow":false,"topLevel":false},",M3195%JsXVXc(d1Zg:L":{"opcode":"looks_sayforsecs","next":null,"parent":"n%]__?|Z8]rI5Nb?gViq","inputs":{"MESSAGE":[1,[10,"Press the space bar to meet my friends!"]],"SECS":[1,[4,"3"]]},"fields":{},"shadow":false,"topLevel":false},"|0_-JyE+)[h*:1fdtiA4":{"opcode":"event_whenthisspriteclicked","next":"^oA(iul1kHd(0wr^6Bw{","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":-69,"y":-82},"^oA(iul1kHd(0wr^6Bw{":{"opcode":"looks_switchcostumeto","next":"|7PoJdXk{ra2Uw|t`GbT","parent":"|0_-JyE+)[h*:1fdtiA4","inputs":{"COSTUME":[1,"N9bZPF:pJOq6u.zxph*s"]},"fields":{},"shadow":false,"topLevel":false},"N9bZPF:pJOq6u.zxph*s":{"opcode":"looks_costume","next":null,"parent":"^oA(iul1kHd(0wr^6Bw{","inputs":{},"fields":{"COSTUME":["Neha1",null]},"shadow":true,"topLevel":false},"|7PoJdXk{ra2Uw|t`GbT":{"opcode":"looks_sayforsecs","next":"Om]!9q+lw!s+4zF:/CG!","parent":"^oA(iul1kHd(0wr^6Bw{","inputs":{"MESSAGE":[1,[10,"3..."]],"SECS":[1,[4,"1"]]},"fields":{},"shadow":false,"topLevel":false},"Om]!9q+lw!s+4zF:/CG!":{"opcode":"looks_sayforsecs","next":"J6bm|w{z^q-RA%hf)afc","parent":"|7PoJdXk{ra2Uw|t`GbT","inputs":{"MESSAGE":[1,[10,"2..."]],"SECS":[1,[4,"1"]]},"fields":{},"shadow":false,"topLevel":false},"J6bm|w{z^q-RA%hf)afc":{"opcode":"looks_sayforsecs","next":"dBNdJtA%:m:n8TAUuL^K","parent":"Om]!9q+lw!s+4zF:/CG!","inputs":{"MESSAGE":[1,[10,"1!"]],"SECS":[1,[4,"1"]]},"fields":{},"shadow":false,"topLevel":false},"dBNdJtA%:m:n8TAUuL^K":{"opcode":"control_repeat","next":"GV:wKN`D#AUVaKS?5jmD","parent":"J6bm|w{z^q-RA%hf)afc","inputs":{"TIMES":[1,[6,"4"]],"SUBSTACK":[2,"x@m(|CWR`%*`#b~;!2OT"]},"fields":{},"shadow":false,"topLevel":false},"x@m(|CWR`%*`#b~;!2OT":{"opcode":"control_wait","next":".Z=GpTw~p|F,B38JSn^t","parent":"dBNdJtA%:m:n8TAUuL^K","inputs":{"DURATION":[1,[5,"0.7"]]},"fields":{},"shadow":false,"topLevel":false},".Z=GpTw~p|F,B38JSn^t":{"opcode":"looks_nextcostume","next":null,"parent":"x@m(|CWR`%*`#b~;!2OT","inputs":{},"fields":{},"shadow":false,"topLevel":false},"GV:wKN`D#AUVaKS?5jmD":{"opcode":"looks_say","next":null,"parent":"dBNdJtA%:m:n8TAUuL^K","inputs":{"MESSAGE":[1,[10,"Happy Holi!"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"588e1905e5323f75328276def2ac0116","name":"Neha1","bitmapResolution":1,"md5ext":"588e1905e5323f75328276def2ac0116.svg","dataFormat":"svg","rotationCenterX":45.99999113010236,"rotationCenterY":87},{"assetId":"8a174573e7d4a7885954acd2afad19ea","name":"Neha2","bitmapResolution":1,"md5ext":"8a174573e7d4a7885954acd2afad19ea.svg","dataFormat":"svg","rotationCenterX":123.41460248739168,"rotationCenterY":114.40293820688679},{"assetId":"500b791f9f077dd2377bc56033912b9a","name":"Neha3","bitmapResolution":1,"md5ext":"500b791f9f077dd2377bc56033912b9a.svg","dataFormat":"svg","rotationCenterX":133.59915850034727,"rotationCenterY":174.0481588381853},{"assetId":"c53eeb50bcdf509cb1522d378c9e380b","name":"Neha4","bitmapResolution":1,"md5ext":"c53eeb50bcdf509cb1522d378c9e380b.svg","dataFormat":"svg","rotationCenterX":128.6803772733968,"rotationCenterY":116.40943091603478},{"assetId":"9d660677a26fe0b657bc3e43da838c8e","name":"Neha5","bitmapResolution":1,"md5ext":"9d660677a26fe0b657bc3e43da838c8e.svg","dataFormat":"svg","rotationCenterX":90.9947,"rotationCenterY":85.4763088644717}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":28,"y":-51,"size":139.99999999999997,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Brad","variables":{},"lists":{},"broadcasts":{},"blocks":{"CBEwU.S^!3v*m}+l(2:*":{"opcode":"event_whenflagclicked","next":"R|3)LWe?;VLJtzxlX@8}","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"R|3)LWe?;VLJtzxlX@8}":{"opcode":"motion_gotoxy","next":"9sO:y?e(89=wDBQEX*84","parent":"CBEwU.S^!3v*m}+l(2:*","inputs":{"X":[1,[4,220]],"Y":[1,[4,-13]]},"fields":{},"shadow":false,"topLevel":false},"9sO:y?e(89=wDBQEX*84":{"opcode":"looks_switchcostumeto","next":null,"parent":"R|3)LWe?;VLJtzxlX@8}","inputs":{"COSTUME":[1,"4!H7s8i9Lh.C(?SHMT_O"]},"fields":{},"shadow":false,"topLevel":false},"4!H7s8i9Lh.C(?SHMT_O":{"opcode":"looks_costume","next":null,"parent":"9sO:y?e(89=wDBQEX*84","inputs":{},"fields":{"COSTUME":["Brad1"]},"shadow":true,"topLevel":false},"7rU;-waLK?7n!U94pB].":{"opcode":"event_whenkeypressed","next":"BYyQeX2S2e2l[UHn#0bq","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space"]},"shadow":false,"topLevel":true,"x":32,"y":304},"BYyQeX2S2e2l[UHn#0bq":{"opcode":"motion_movesteps","next":"SpljqntHJxfGDV;.4%#M","parent":"7rU;-waLK?7n!U94pB].","inputs":{"STEPS":[1,[4,-64]]},"fields":{},"shadow":false,"topLevel":false},"SpljqntHJxfGDV;.4%#M":{"opcode":"looks_sayforsecs","next":"m+[^4mRsSN%SjOXJ}+_t","parent":"BYyQeX2S2e2l[UHn#0bq","inputs":{"MESSAGE":[1,[10,"Hello, I'm Brad!"]],"SECS":[1,[4,3]]},"fields":{},"shadow":false,"topLevel":false},"m+[^4mRsSN%SjOXJ}+_t":{"opcode":"looks_sayforsecs","next":null,"parent":"SpljqntHJxfGDV;.4%#M","inputs":{"MESSAGE":[1,[10,"I'm holding a pichkari, a water squirter filled with colored water!"]],"SECS":[1,[4,6]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"dae278db1e4c65e9b70d966aa9a40429","name":"Brad1","bitmapResolution":1,"md5ext":"dae278db1e4c65e9b70d966aa9a40429.svg","dataFormat":"svg","rotationCenterX":37.99999373388661,"rotationCenterY":86.99998370205938}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":true,"x":220,"y":-13,"size":135.00000000000003,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Kristen","variables":{},"lists":{},"broadcasts":{},"blocks":{"[M~hMK`q/NYs#*-;ZiuH":{"opcode":"event_whenflagclicked","next":"H~_UJ8~bO+^zXvT^^^le","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":15,"y":22},"H~_UJ8~bO+^zXvT^^^le":{"opcode":"motion_gotoxy","next":"@DsqwPSbeqW_?Pi{uYT]","parent":"[M~hMK`q/NYs#*-;ZiuH","inputs":{"X":[1,[4,-215]],"Y":[1,[4,-13]]},"fields":{},"shadow":false,"topLevel":false},"@DsqwPSbeqW_?Pi{uYT]":{"opcode":"looks_switchcostumeto","next":null,"parent":"H~_UJ8~bO+^zXvT^^^le","inputs":{"COSTUME":[1,"?+RpBU3RL5~YKwsi/rIw"]},"fields":{},"shadow":false,"topLevel":false},"?+RpBU3RL5~YKwsi/rIw":{"opcode":"looks_costume","next":null,"parent":"@DsqwPSbeqW_?Pi{uYT]","inputs":{},"fields":{"COSTUME":["Kristen1"]},"shadow":true,"topLevel":false},"Jf4;4?`|e1udP=94]ErE":{"opcode":"event_whenkeypressed","next":"9aY%RY8/M5ayiAqP@a7U","parent":null,"inputs":{},"fields":{"KEY_OPTION":["space"]},"shadow":false,"topLevel":true,"x":27,"y":261},"9aY%RY8/M5ayiAqP@a7U":{"opcode":"control_wait","next":"Pz:xDRpqyDJNLlR5?;,0","parent":"Jf4;4?`|e1udP=94]ErE","inputs":{"DURATION":[1,[5,"10"]]},"fields":{},"shadow":false,"topLevel":false},"Pz:xDRpqyDJNLlR5?;,0":{"opcode":"motion_movesteps","next":"-n-db;lg-!(lyaGFo;AQ","parent":"9aY%RY8/M5ayiAqP@a7U","inputs":{"STEPS":[1,[4,64]]},"fields":{},"shadow":false,"topLevel":false},"-n-db;lg-!(lyaGFo;AQ":{"opcode":"looks_sayforsecs","next":"4*Ly{a-GE~GGb~khP7#P","parent":"Pz:xDRpqyDJNLlR5?;,0","inputs":{"MESSAGE":[1,[10,"Hi, I'm Kristen!"]],"SECS":[1,[4,3]]},"fields":{},"shadow":false,"topLevel":false},"4*Ly{a-GE~GGb~khP7#P":{"opcode":"looks_sayforsecs","next":"(P/J:UdY/Q,8|p4}V!P=","parent":"-n-db;lg-!(lyaGFo;AQ","inputs":{"MESSAGE":[1,[10,"I'm using squeeze bottles."]],"SECS":[1,[4,4]]},"fields":{},"shadow":false,"topLevel":false},"(P/J:UdY/Q,8|p4}V!P=":{"opcode":"looks_sayforsecs","next":null,"parent":"4*Ly{a-GE~GGb~khP7#P","inputs":{"MESSAGE":[1,[10,"Click on Neha to see her celebrate!"]],"SECS":[1,[4,"4"]]},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"5c740972a1f49202719b50e896bd0cf6","name":"Kristen1","bitmapResolution":1,"md5ext":"5c740972a1f49202719b50e896bd0cf6.svg","dataFormat":"svg","rotationCenterX":62.000001871426775,"rotationCenterY":87.08308115522249}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":true,"x":-215,"y":-13,"size":135.00000000000003,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190813192748","agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}}
},{}],29:[function(require,module,exports){
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
                        "X": [
                            1,
                            [
                                10,
                                "Welcome to Scratch!"
                            ]
                        ],
                        "Y": [
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
},{}],30:[function(require,module,exports){
require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            synced:     { bool: false, str: 'Text messages are correctly synchronized using wait blocks.' },
            talkTwice:  { bool: false, str: 'Each sprite talks at least twice.'                           }
        };
        this.extensions =   {
            talkMore:   { bool: false, str: 'Added more synchronized messages to each sprite.'            },
            addedSound: { bool: false, str: 'Added a sound other than "boing" or "pop."'                  }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        /// Test each pairing of scripts across sprites.
        var scriptPairs = [];
        for (var sprite1 of project.sprites) {
            for (var sprite2 of project.sprites) {
                for (var script1 of sprite1.scripts.filter(
                    script1 =>
                    script1.blocks.length > 1 &&
                    script1.blocks[0].opcode.includes('event_when'))) {
                    for (var script2 of sprite2.scripts.filter(
                        script2 =>
                        script2.blocks.length > 1 &&
                        script2.blocks[0].opcode === script1.blocks[0].opcode
                        )) {
                        var messageTimes1 = this.checkScript(sprite1, script1);
                        var messageTimes2 = this.checkScript(sprite2, script2);
                        console.log(messageTimes1);
                        console.log(messageTimes2);
                        var synced = 1;
                        for (var i = 0; i < messageTimes1.length && i < messageTimes2.length; i++) {
                            if (messageTimes1[i] >= messageTimes2[i]) {
                                synced = 0;
                            }
                        }
                        var talkTwice = (messageTimes1.length > 1) && (messageTimes2.length > 1);
                        var talkMore  = (messageTimes1.length > 2) && (messageTimes2.length > 2);
                        scriptPairs.push({
                            script1: script1,
                            script2: script2,
                            synced: synced,
                            talkTwice: talkTwice,
                            talkMore: talkMore,
                            score: synced + talkTwice
                        });
                    }
                }
            }
        }
        var bestScore = -1;
        var bestScriptPair = scriptPairs[0];
        for (var scriptPair of scriptPairs) {
            if (scriptPair.score > bestScore) {
                bestScore = scriptPair.score;
                bestScriptPair = scriptPair;
            }
        }
        this.requirements.synced.bool    = bestScriptPair.synced;
        this.requirements.talkTwice.bool = bestScriptPair.talkTwice;
        this.extensions.talkMore.bool    = bestScriptPair.talkMore;
    }

    /// Returns an array of times (in seconds after the event) at which this script makes the sprite talk or think.
    /// Also checks for any new sounds.
    checkScript(sprite, script) {
        var scriptTime = 0;
        var messageTimes = [];
        var isSpeaking = false;
        for (var block of script.blocks) {
            if (block.opcode === 'control_wait') {
                scriptTime += parseFloat(block.inputs.DURATION[1][1]);
                isSpeaking = false;
            }
            else if (block.opcode === 'looks_thinkforsecs' || block.opcode === 'looks_sayforsecs') {
                if (!isSpeaking) messageTimes.push(scriptTime);
                scriptTime += parseFloat(block.inputs.SECS[1][1]);
                isSpeaking = true;
            }
            else if (block.opcode === 'sound_play') {
                try {
                    var soundName = sprite.blocks[block.inputs.SOUND_MENU[1]].fields.SOUND_MENU[0];
                    if (soundName !== 'boing' && soundName !== 'pop') {
                        this.extensions.addedSound.bool = true;
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                isSpeaking = false;
            }
        }
        return messageTimes;
    }
}

},{"./scratch3":26}],31:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],32:[function(require,module,exports){
/// Provides necessary scripts for index.html.

/// Requirements (scripts)
var graders = {
  scratchBasicsL1: { name: 'Scratch Basics L1',      file: require('./grading-scripts-s3/scratch-basics-L1') },
  scratchBasicsL2: { name: 'Scratch Basics L2',      file: require('./grading-scripts-s3/scratch-basics-L2') },
  animationL1:     { name: 'Animation L1',           file: require('./grading-scripts-s3/animation-L1')      },
  animationL2:     { name: 'Animation L2',           file: require('./grading-scripts-s3/animation-L2')      },
  eventsL1:        { name: 'Events L1',              file: require('./grading-scripts-s3/events-L1')         },
  eventsL2:        { name: 'Events L2',              file: require('./grading-scripts-s3/events-L2')         },
  condLoopsL1:     { name: 'Conditional Loops L1',   file: require('./grading-scripts-s3/cond-loops-L1')        },
  condLoopsL2:     { name: 'Conditional Loops L2',   file: require('./grading-scripts-s3/cond-loops-L2')   },
  decompL1:        { name: 'Decomp. by Sequence L1', file: require('./grading-scripts-s3/decomp-L1')         },
  decompL2:        { name: 'Decomp. by Sequence L2', file: require('./grading-scripts-s3/decomp-L2')         },
  oneWaySyncL1:    { name: 'One-Way Sync L1',        file: require('./grading-scripts-s3/one-way-sync-L1')   },
  oneWaySyncL2:    { name: 'One-Way Sync L2',        file: require('./grading-scripts-s3/one-way-sync-L2')   },
  twoWaySyncL1:    { name: 'Two-Way Sync L1',        file: require('./grading-scripts-s3/two-way-sync-L1')   },
  complexConditionalsL1: {name: 'Complex Conditionals L1', file: require('./grading-scripts-s3/complex-conditionals-L1')},
};

// act 1 graders
var actOneGraders = {
  scavengerHunt:  {name: 'Scavenger Hunt',          file: require('./act1-grading-scripts/scavengerHunt')      },
  onTheFarm:      {name: 'On the Farm',             file: require('./act1-grading-scripts/onTheFarm')          },
  namePoem:       {name: 'Name Poem',               file: require('./act1-grading-scripts/name-poem')          },
  ofrenda:        {name: 'Ofrenda',                 file: require('./act1-grading-scripts/ofrenda')            },
  aboutMe:        {name: 'About Me',                file: require('./act1-grading-scripts/aboutMe')            },
  animalParade:   {name: 'Animal Parade',           file: require('./act1-grading-scripts/animal-parade')      },
  danceParty:     {name: 'Dance Party',             file: require('./act1-grading-scripts/dance-party')        },
  knockKnock:     {name: 'Knock Knock',             file: require('./act1-grading-scripts/knockKnock')         },
  finalProject:   {name: 'Interactive Story',       file: require('./act1-grading-scripts/final-project')      },
};

var allGraders = {};
for (var graderKeyList of [graders, actOneGraders]) {
  for (var graderKey in graderKeyList) {
    allGraders[graderKey] = graderKeyList[graderKey];
  }
}



/// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

/* Stores the grade reports. */
var reports_list = [];
/* Number of projects scanned so far. */
var project_count = 0;
/* Number of projects that meet requirements. */
var passing_projects = 0;
/* Number of projects that meet requirements and extensions */
var complete_projects = 0;
/* Grading object. */
var gradeObj = null;

var IS_LOADING = false;

/// HTML helpers
///////////////////////////////////////////////////////////////////////////////////////////////////

/// Helps with form submission.
window.formHelper = function() {
  /// Blocks premature form submissions.
  $("form").submit(function() { return false; });
  /// Maps enter key to grade button.
  $(document).keypress(function(e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fillUnitsHTML = function() {
  var HTMLString = '';
  for (var graderKey in graders) {
    HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>'
    HTMLString += '<label class = "unitlabel">';
    HTMLString += '<img src="pictures/' + graderKey + '.png">';
    HTMLString += graders[graderKey].name;
    HTMLString += '</label> </a>';
  }
  document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/////////////// grader function for act 1 ////////////////////
window.fillUnitsHTMLAct1= function() {
  var HTMLString = '';
  for (var graderKey in actOneGraders) {
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
window.buttonHandler = async function() {
  if (IS_LOADING) return;
  if(!gradeObj) return unitError();
  init();
  document.getElementById('wait_time').innerHTML = "Loading...";
  IS_LOADING = true;
  var requestURL = document.getElementById('inches_input').value;
  var studioID = parseInt(requestURL.match(/\d+/));
  crawl(studioID, 0, []);
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
  passing_projects = 0;
  complete_projects = 0;
}

$(document).ready(function(){
  $('.unitselector').click(function() {
    $(this).addClass('selected');
    $(this).children().addClass('selected');
    $(this).siblings().removeClass('selected');
    $(this).siblings().children().removeClass('selected');
  });
});

window.drop_handler = function(graderKey) {
  gradeObj = new allGraders[graderKey].file;
  console.log("Selected " + allGraders[graderKey].name);
}

window.onclick = function(event) {
  if(event.target.matches('.dropdown_btn')) {
    return;
  }

  if (event.target.matches('#process_button')) {
    $('html, body').animate({
      scrollTop: 750
    }, 800);
  }

  var droplinks = document.getElementsByClassName("dropdown_menu");
  [...droplinks].forEach(function(element) {
    if(element.classList.contains('show')) {
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
    this.author = projectOverview.author.id;
  }
}

function get(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = resolve;
    request.onerror = reject;
    request.send();
  });
}

async function crawl(studioID, offset, projectIdentifiers) {
    if (!offset) console.log('Grading studio ' + studioID);
    get('https://chord.cs.uchicago.edu/scratch/studio/' + studioID + '/offset/' + offset)
    .then(function(result) {
        var studioResponse = JSON.parse(result.target.response);
        /// Keep crawling or return?
        if (studioResponse.length === 0) {
            keepGoing = false;
            if (!project_count) {
              document.getElementById('wait_time').innerHTML =
                'No Scratch 3.0+ projects found. Did you enter a valid Scratch studio URL?';
              IS_LOADING = false;
            }
            for (var projectIdentifier of projectIdentifiers) {
                gradeProject(projectIdentifier);
            }
            return;
        }
        else {
            for (var projectOverview of studioResponse) {
                projectIdentifiers.push(new ProjectIdentifier(projectOverview));
            }
            crawl(studioID, offset + 20, projectIdentifiers);
        }
    });
}

function gradeProject(projectIdentifier) {
    var projectID = projectIdentifier.id;
    var projectAuthor = projectIdentifier.author;
    console.log('Grading project ' + projectID);
    get('https://chord.cs.uchicago.edu/scratch/project/' + projectID)
    .then(function(result) {
        var project = JSON.parse(result.target.response);
        if (project.targets === undefined) {
          console.log('Project ' + projectID + ' could not be found');
          return;
        }
        try {
          analyze(project, projectAuthor, projectID);
        }
        catch (err) {
          console.log('Error grading project ' + projectID);
          /// console.log(err);
        }
        printReportList();
    });
}

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

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Reporting results
///////////////////////////////////////////////////////////////////////////////////////////////////

/* Prints a line of grading text. */
function appendText(string_list) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  var HTMLString = '';
  for (var string of string_list) {
    HTMLString += '<br>';
    HTMLString += string;
  }
  HTMLString += '<br>';

  tbi.style.width = "100%";
  tbi.style.fontSize = "14px";
  tbi.style.fontWeight = "normal";
  tbi.innerHTML = HTMLString;

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a series of consecutive project reports. */
function printReportList() {
  clearReport();
  sortReport();
  printColorKey();
  showProgressBar();
  for (var report of reports_list) {
    appendText(report);
  }
  checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
  var removeables = document.getElementsByClassName('lines');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* Prints progress bar. */
function showProgressBar() {
  document.getElementById('myProgress').style.visibility = "visible";
  setProgress(document.getElementById('greenbar'), complete_projects, project_count, 0);
  setProgress(document.getElementById('yellowbar'), passing_projects, project_count, 1);
  setProgress(document.getElementById('redbar'), project_count - complete_projects - passing_projects, project_count, 2);
}

/* Hides progress bar. */
function hideProgressBar() {
  document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key.*/
function printColorKey() {
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.innerHTML = "results:";
}

/* Update progress bar segment to new proportion. */
function setProgress(bar,projects,total_projects,color) {
  var width_percent = ((projects/total_projects)*100);
  bar.style.width = width_percent + '%';
  if (projects && color === 0) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' done';
  }
  else if (projects && color === 1) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' almost done';
  }
  else if (projects && color === 2) {
    bar.innerHTML = projects;
    if (width_percent >= 15) bar.innerHTML += ' need time or help';
  }
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
  return (bool) ? ('✔️') : ('❌');
}

/* Adds results to reports_list and prints. */
function report(pID, reqs, exts, user) {
  var ret_list = [];
  var project_complete = true;
  var passed_reqs_count = 0;

  /* Makes a string list of grading results. */
  ret_list.push('Project ID: <a href="https://scratch.mit.edu/projects/' + pID + '">' + pID + '</a>');
  ret_list.push('Requirements:');
  for (var x in reqs) {
      if (!reqs[x].bool) project_complete = false;
      else passed_reqs_count++;
      ret_list.push(checkbox(reqs[x].bool) + ' - ' + reqs[x].str);
  }
  if (exts) {
      ret_list.push('Extensions:')
      for (var x in exts) {
          ret_list.push(checkbox(exts[x].bool) + ' - ' + exts[x].str);
      }
  }
  ret_list.push('');
  reports_list.push(ret_list);

  /* Adjusts class progress globals. */
  if (project_complete) complete_projects++;
  else if (passed_reqs_count >= (Object.keys(reqs).length / 2)) passing_projects++;
}

/* Checks if process is done.  */
function checkIfComplete() {
  if (project_count) document.getElementById('wait_time').innerHTML = '';
  else document.getElementById('wait_time').innerHTML = 'No Scratch 3.0+ projects found. Did you enter a valid Scratch studio URL?';
  IS_LOADING = false;
  console.log("Done.");
}

/* Sorts the reports in reports_list alphabetically
 username. */
function sortReport() {
reports_list.sort(function(a,b) {
  return a[0].localeCompare(b[0]);
})
}


///////////////////////////////////////////////////////////////////////////////////////////////////

/// Error reports
///////////////////////////////////////////////////////////////////////////////////////////////////

function linkError() {
  document.getElementById('myProgress').style.visibility = "hidden";
  var processObj = document.getElementById('process_error');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "error: invalid link.";
  document.getElementById('wait_time').innerHTML = "";
  IS_LOADING = false;
}

function unitError() {
  var processObj = document.getElementById('process_error');
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

},{"./act1-grading-scripts/aboutMe":1,"./act1-grading-scripts/animal-parade":2,"./act1-grading-scripts/dance-party":3,"./act1-grading-scripts/final-project":4,"./act1-grading-scripts/knockKnock":5,"./act1-grading-scripts/name-poem":7,"./act1-grading-scripts/ofrenda":8,"./act1-grading-scripts/onTheFarm":9,"./act1-grading-scripts/scavengerHunt":11,"./grading-scripts-s3/animation-L1":12,"./grading-scripts-s3/animation-L2":13,"./grading-scripts-s3/complex-conditionals-L1":14,"./grading-scripts-s3/cond-loops-L1":15,"./grading-scripts-s3/cond-loops-L2":16,"./grading-scripts-s3/decomp-L1":18,"./grading-scripts-s3/decomp-L2":19,"./grading-scripts-s3/events-L1":20,"./grading-scripts-s3/events-L2":21,"./grading-scripts-s3/one-way-sync-L1":22,"./grading-scripts-s3/one-way-sync-L2":23,"./grading-scripts-s3/scratch-basics-L1":24,"./grading-scripts-s3/scratch-basics-L2":25,"./grading-scripts-s3/two-way-sync-L1":30}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],35:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],36:[function(require,module,exports){
(function (process,global){
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
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
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
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
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
          }).join('\n').substr(2);
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
      name = name.substr(1, name.length - 2);
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

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

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

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":35,"_process":33,"inherits":34}]},{},[32]);
