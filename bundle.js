(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.avgScriptLength = 0;
        this.eventOpcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked'];
        this.otherOpcodes = ['motion_glidesecstoxy', 'looks_sayforsecs', 'control_wait'];
    }

    initReqs() {
        this.requirements.fiveBlocks = { bool: false, str: 'Used (only) 5 blocks specified' };
        this.requirements.backdrop = { bool: false, str: 'Backdrop added' };
        this.requirements.twoSprites = { bool: false, str: 'At least two sprites chosen' };
        this.extensions.moreSprites = {bool: false, str: 'More sprites added'};
        this.extensions.convo = {bool: false, str: 'Sprites have a conversation (at least two sprites say something)'};
        this.extensions.three = {bool: false, str: 'Average script length is at least three'};
        this.extensions.four = {bool: false, str: 'Average script length is at least four'};
        this.extensions.five = {bool: false, str: 'Average script length is at least five'};
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        let numSprites = 0;
        let scriptLengths = [];
        let spritesTalking = 0;

        for (let target of project.targets) {
            if (target.isStage) {
                if ((target.costumes.length > 1) ||
                    (target.costumes[0].assetId !== 'cd21514d0531fdffb22204e0ec5ed84a')) {
                    this.requirements.backdrop.bool = true;
                }
            } else {
                numSprites++;
                let spriteTalks = false;

                for (let block in target.blocks) {
                    if ((this.eventOpcodes.includes(target.blocks[block].opcode)
                        || (this.otherOpcodes.includes(target.blocks[block].opcode)))) {
                        this.requirements.fiveBlocks.bool = true;
                    }

                    if (target.blocks[block].opcode==='looks_sayforsecs'){
                        spriteTalks = true;
                    }

                    if ((target.blocks[block].opcode==='event_whenflagclicked')
                        || (target.blocks[block].opcode==='event_whenthisspriteclicked')){
                            let scriptLength = 1;
                            for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next){
                                scriptLength++;
                            }
                            scriptLengths.push(scriptLength);
                        }
                }

                if (spriteTalks) {spritesTalking++};
            }
        }
        if (numSprites >= 2) {
            this.requirements.twoSprites.bool = true;
        }
        if (numSprites >= 3){
            this.extensions.moreSprites.bool = true;
        }
        if (spritesTalking>=2){
            this.extensions.convo.bool = true;
        }

        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let total = scriptLengths.reduce(reducer,0);
        if (scriptLengths.length === 0){
            this.avgScriptLength = 0;
        }else{
            this.avgScriptLength=total/scriptLengths.length;
        }
        console.log('Average Script Length (including event block):');
        console.log(this.avgScriptLength);

        if (this.avgScriptLength>=3){
            this.extensions.three.bool=true;
        }
        if (this.avgScriptLength>=4){
            this.extensions.four.bool=true;
        }
        if (this.avgScriptLength>=5){
            this.extensions.five.bool=true;
        }

        let longestLength = scriptLengths[0];
        for (let i = 1; i < scriptLengths.length; i++){
            if (scriptLengths[i]>longestLength){
                longestLength=scriptLengths[i];
            }
        }

        console.log('Longest Script Length (including event block):');
        console.log(longestLength);

    }
}
},{"../grading-scripts-s3/scratch3":23}],2:[function(require,module,exports){
/*
Act 1 About Me Grader
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };
        this.requirements.interactiveSprite = { bool: false, str: 'Project has at least one interactive sprite with a multi-block script attached' };
        //this.requirements.nonInteractiveSprite = { bool: false, str: 'Proejct has at least one non-interactive sprite with a multi-block script attached to it' };
        this.extensions.multipleSprites = { bool: false, str: 'This project uses more than one sprite' }; // done
        this.extensions.additionalBackdrop = { bool: false, str: 'This project has an additional backdrop' };
        this.extensions.movingSprites = { bool: false, str: 'This project has a moving sprite' };
        this.extensions.hasBackgroundMusic = { bool: false, str: 'This project has background music' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);

        this.initReqs();
        if (!is(fileObj)) return;

        let scriptLengthInteractive = 0;
        let scriptLengthNotInteractive = 0;
        let isInteractive = false;
        let numSprites = project.sprites.length;

        for (let target of project.targets) {
            if (target.isStage) {
                for (let cost in target.costumes) {
                    if ((target.costumes.length > 1) || (cost.assetID !== "cd21514d0531fdffb22204e0ec5ed84a")) {
                        this.extensions.additionalBackdrop.bool = true;
                    }
                }
            }
            else {
                for (let block in target.blocks) {
                    
                    if (target.blocks[block].opcode === "event_whenthisspriteclicked") {

                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            scriptLengthInteractive++;
                        }
                        if (scriptLengthInteractive > 1) {
                            this.requirements.interactiveSprite.bool = true;
                            
                        }
                    }

                    else if ((target.blocks[block].opcode === 'motion_gotoxy') ||
                    target.blocks[block].opcode === 'motion_glidesecstoxy' ||
                    target.blocks[block].opcode === 'motion_movesteps') {
                        this.extensions.movingSprites.bool = true;
                    }

                    else if ((target.blocks[block].opcode === 'sound_playuntildone') ||
                    (target.blocks[block].opcode === 'sound_play')) {
                        this.extensions.hasBackgroundMusic.bool = true;
                    }
                }
            }
        }

        if (this.requirements.interactiveSprite.bool === true) {
            this.requirements.nonInteractiveSprite.bool = true;
        }
        
        if (numSprites >= 1) {
            this.requirements.hasOneSprite.bool = true;
        }

        if (numSprites > 1) {
            this.extensions.multipleSprites.bool = true;
        }

    }
}

},{"../grading-scripts-s3/scratch3":23}],3:[function(require,module,exports){
/*
Act 1 Build-a-Band Project Autograder
Initial version and testing: Zipporah Klain
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.guitar = { bool: false, str: 'Script added for guitar (including event and action block)' }
        this.requirements.sprite = { bool: false, str: 'Added at least one new sprite' };
        this.requirements.script = { bool: false, str: 'At least one of the new sprites has a script' };
        this.requirements.cat = { bool: false, str: 'Cat animated using loop with wait block and motion (including changing costumes and size)' };
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        this.initReqs();
        if (!is(fileObj)) return;

        for (let target of project.targets) {
            if (!target.isStage) {
                if (target.name === 'Sprite2') {
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            for (let i = block; i !== null; i = target.blocks[i].next) {
                                let opc = target.blocks[i].opcode;
                                if ((opc === 'control_forever')
                                    || (opc.includes('control_repeat'))) {
                                    if (target.blocks[i].inputs.SUBSTACK[1] !== null) {
                                        let wait = 0;
                                        let nextCostChangeSize = 0;
                                        let switchCostSize = 0;
                                        let motion = 0;
                                        for (let j = target.blocks[i].inputs.SUBSTACK[1];
                                            j !== null; j = target.blocks[j].next) {
                                                let opc2 = target.blocks[j].opcode;
                                                switch (opc2) {
                                                    case 'control_wait': wait++; break;
                                                    case 'looks_nextcostume': nextCostChangeSize++; break;
                                                    case 'looks_switchcostumeto': switchCostSize++; break;
                                                    case 'looks_setsizeto': switchCostSize++;break;
                                                    case 'looks_changesizeby': nextCostChangeSize++;break;
                                                }
                                                if (opc2.includes('motion_')) { motion++ };

                                            }
                                        if (wait && (nextCostChangeSize || motion || (switchCostSize > 1))) {
                                            this.requirements.cat.bool = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (target.name === 'Guitar-Electric') {
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
                                this.requirements.guitar.bool = true;
                            }
                        }
                    }
                }

                if ((target.name != 'Sprite2') &&
                    (target.name != 'Trumpet') &&
                    (target.name != 'Drum-Bass') &&
                    (target.name != 'Guitar-Electric')) {
                    this.requirements.sprite.bool = true;
                    for (let block in target.blocks) {
                        if (target.blocks[block].opcode.includes('event_')) {
                            if (target.blocks[block].next != null) {
                                this.requirements.script.bool = true;
                            }
                        }
                    }
                }
            }
        }
    }
}


},{"../grading-scripts-s3/scratch3":23}],4:[function(require,module,exports){
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
        this.extensions.music = {bool: false, str: 'Background music added'};
    }

    grade(fileObj,user){
        var project = new Project(fileObj,null);
        this.initReqs();
        if (!is(fileObj)) return;

        for (let target of project.targets){

            if (target.isStage){
                if (target.costumes.length>=3){
                    this.extensions.threeBackdrops.bool=true;
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
                ||(opc==='sound_sounds_menu')){
                    this.extensions.music.bool=true;
                }

                if (!target.isStage){
                    this.requirements.sprite.bool=true;
                }

            }
        }

    }

}
},{"../grading-scripts-s3/scratch3":23}],5:[function(require,module,exports){
/*
Act 1 Ladybug Scramble Autograder
Initial version and testing: Saranya Turimella and Zipporah Klain, 2019
*/


require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.bug = { dir: 0, locX: -200, locY: -25 }
    }

    initReqs() {
        this.requirements.oneAphid = { bool: false, str: 'Ladybug eats at least one aphid using only blocks specified' };
        this.requirements.bothAphids = { bool: false, str: 'Ladybug eats both aphids using only blocks specified' };
        this.requirements.eatAphidBlock = { bool: false, str: '"Eat Aphid" block is used' };
        this.requirements.ladybugInBounds = { bool: true, str: 'The ladybug stays on the branch' };
        this.requirements.changedProject = { bool: false, str: 'Project has been modified from the original project' };
        this.extensions.music = { bool: false, str: 'Background music added' };
        this.extensions.changeAphidCode = { bool: false, str: 'Aphid code has been changed' };
        this.extensions.ladybugRedrawn = { bool: false, str: 'The ladybug has been redrawn in the costumes tab' };
    }

    //helper functions
    inBounds(x, y) {

        if ((x < -130) || ((x > -117) && (x < -31)) || ((x > -18) && (x < 69))) {
            return ((y <= -19) && (y > -32));
        }
        if ((x >= -130) && (x < -117)) {
            return ((y <= -19) && (y > -84));
        }
        if ((x > -31) && (x < -18)) {
            return ((y > -32) && (y < 131));
        }
        if ((x > 69) && (x < 82)) {
            return ((y <= -19) && (y > -133));
        }
        return false;
    }

    updateBug(block) {

        if (block.opcode === 'motion_gotoxy') {
            this.bug.locX = parseFloat(block.inputs.X[1][1]);
            this.bug.locY = parseFloat(block.inputs.Y[1][1]);
        }
        if (block.opcode === 'motion_pointindirection') {
            this.bug.dir = parseFloat(block.inputs.DIRECTION[1][1]);
        }
        if (block.opcode === 'motion_turnright') {
            this.bug.dir -= parseFloat(block.inputs.DEGREES[1][1]);
        }
        if (block.opcode === 'motion_turnleft') {
            this.bug.dir += parseFloat(block.inputs.DEGREES[1][1]);
        }
        if (block.opcode === 'motion_movesteps') {
            let radDir = (this.bug.dir - 90) * Math.PI / 180;
            let steps = parseFloat(block.inputs.STEPS[1][1]);
            this.bug.locX += Math.round(steps * Math.cos(radDir));
            this.bug.locY += Math.round(steps * Math.sin(radDir));
        }
    }

    isLadybug(target) {
        for (let block in target.blocks) {
            if (target.blocks[block].opcode === 'procedures_definition') {
                return true;
            }
        }
        return false;
    }

    grade(fileObj, user) {

        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/original-ladybug'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let aphidLocations = [];
        let aphidsEaten = 0;
        let failed = false;

        let moveStepsBlocks = 0; //don't delete these you do use them even if vscode says you don't!
        let turnBlocks = 0;

        let aphidBlocks = null;
        let aphid2Blocks = null;
        let ogAphidBlocks = null;
        let ogAphid2Blocks = null;
        let bugBlocks = null;
        let ogBugBlocks = null;

        for (let target of original.targets){
            if (target.name === 'Aphid'){
                ogAphidBlocks = target.blocks;
            }else if (target.name === 'Aphid2'){
                ogAphid2Blocks=target.blocks;
            }else if ((target.name === 'Ladybug1')||this.isLadybug(target)){
                ogBugBlocks = target.blocks;
            }
        }

        for (let target of project.targets) {
            if ((target.name === 'Aphid') || (target.name === 'Aphid2')) {
                let loc = [];
                loc.push(target.x);
                loc.push(target.y);
                aphidLocations.push(loc);
            }
            if (target.name === 'Aphid'){
                aphidBlocks = target.blocks;
            }else if (target.name === 'Aphid2'){
                aphid2Blocks = target.blocks;
            }else if ((target.name === 'Ladybug1')||this.isLadybug(target)){
                bugBlocks=target.blocks;
            }
        }

        var util = require('util');
        let a = util.inspect(aphidBlocks);
        let a2 = util.inspect(aphid2Blocks);
        let ogA = util.inspect(ogAphidBlocks);
        let ogA2 = util.inspect(ogAphid2Blocks);
        let bb = util.inspect(bugBlocks);
        let ogBB = util.inspect(ogBugBlocks);
        if ((a!==ogA)||(a2!==ogA2)){
            this.extensions.changeAphidCode.bool=true;
        }
        if (bb!==ogBB){ this.requirements.changedProject.bool=true;}

        for (let target of project.targets) {
            for (let block in target.blocks) {
                if ((target.blocks[block].opcode === 'sound_playuntildone')
                    || (target.blocks[block].opcode === 'sound_play')) {
                    this.extensions.music.bool = true;
                    break;
                }
            }
            if (target.name === 'Ladybug1' || this.isLadybug(target)) {
                for (let cost in target.costumes) {
                    if ((target.costumes[cost].assetId !== '7501580fb154fde8192a931f6cab472b')
                        && (target.costumes[cost].assetId !== '169c0efa8c094fdedddf8c19c36f0229')) {
                        this.extensions.ladybugRedrawn.bool = true;
                        break;
                    }
                }
                for (let block in target.blocks) {

                    if (target.blocks[block].opcode === 'event_whenflagclicked') {
                        for (let i = block; target.blocks[i].next !== null; i = target.blocks[i].next) {
                            this.updateBug(target.blocks[i]);
                            let onBranch = this.inBounds(this.bug.locX, this.bug.locY);
                            if (!onBranch) {
                                this.requirements.ladybugInBounds.bool = false;
                                failed = true;
                            }

                            let onAphid = false;
                            for (let aphidLoc of aphidLocations) {
                                if ((Math.abs(aphidLoc[0] - this.bug.locX) <= 40) &&
                                    (Math.abs(aphidLoc[1] - this.bug.locY) <= 40)) {
                                    onAphid = true;
                                }
                            }

                            if (onAphid) {
                                let nextBlock = target.blocks[i].next;
                                if (target.blocks[nextBlock].opcode === 'procedures_call') {
                                    if (target.blocks[nextBlock].mutation.proccode === 'Eat Aphid') {
                                        if (failed === false) {
                                            aphidsEaten++;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //checks if 'Eat Aphid' block is connected to a script
                    if (target.blocks[block].opcode === 'procedures_call') {
                        if (target.blocks[block].mutation.proccode === 'Eat Aphid') {
                            if (target.blocks[block].parent !== null) {
                                this.requirements.eatAphidBlock.bool = true;
                            }
                        }
                    }

                    //checks if a new "move steps" block has been connected
                    if (target.blocks[block].opcode === 'motion_movesteps') {
                        if (target.blocks[block].parent !== null) {
                            moveStepsBlocks++;
                        }
                    }
                    if ((target.blocks[block].opcode === 'motion_turnright') ||
                        (target.blocks[block].opcode === 'motion_turnleft')) {
                        if (target.blocks[block].parent !== null) {
                            turnBlocks++;
                        }
                    }
                }
                break;
            }

        }

        if (aphidsEaten > 0) {
            this.requirements.oneAphid.bool = true;
        }
        if (aphidsEaten > 1) {
            this.requirements.bothAphids.bool = true;
        }
    }

}
},{"../act1-grading-scripts/original-ladybug":9,"../grading-scripts-s3/scratch3":23,"util":29}],6:[function(require,module,exports){
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
        this.requirements.hasOneSprite = { bool: false, str: 'Project has at least one sprite' };//done
        this.requirements.scripts = { bool: false, str: 'At least half of the sprites have a script using the 11 blocks given (with at least one event block and at least one other block)' };//done
        this.requirements.costumes = { bool: false, str: 'At least half of the sprites have costumes other than the ones originally set' };//done
        this.requirements.dialogue = { bool: false, str: 'At least half of the sprites have dialogue other than that originally given' };//done
        this.requirements.movement = { bool: false, str: 'At least half of the sprites have movement other than that already given' };//to fix
        this.requirements.backdrop = { bool: false, str: 'The background has been changed' };//done
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/name-poem-original-test'), null);
        this.initReqs();
        if (!is(fileObj)) return;

        //checks if there's at least one sprite
        if (project.sprites.length > 0) {
            this.requirements.hasOneSprite.bool = true;
        }

        //instantiate counters for requirements
        let spritesWithScripts = 0;
        let spritesWithNewDialogue = 0;
        let spritesWithNewCostumes = 0;
        let spritesWithNewMovement = 0;
        let newBackdrop = false;

        //make list of original costumes
        //make map of original blocks for movement
        let originalCostumes = [];
        let mapOriginal = new Map();
        let mapProject = new Map();
        for (let target of original.targets) {
            if (target.isStage) { continue; }
            for (let costume of target.costumes) {
                originalCostumes.push(costume.assetId);
            }
            mapOriginal.set(target.name, target.blocks);
        }

        for (let target of project.targets) {
            //checking backdrop
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
                mapProject.set(target.name, target.blocks);
                let hasDialogue = false;
                for (let block in target.blocks) {
                    if (this.eventOpcodes.includes(target.blocks[block].opcode)) {
                        console.log('here');
                        let b = new Block(target, block);
                        let childBlocks = b.childBlocks();
                        console.log('this is child blocks');
                        console.log(childBlocks);
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

          //checking movement
          let inDIANE = false;
          for (let v of mapProject.values()) {
              for (let w of mapOriginal.values()) {
                  var util = require('util');
                  v = util.inspect(v);
                  w = util.inspect(w);
                  if (v === w) {
                      inDIANE = true;
                  };
              }
              if (!inDIANE) {
                  spritesWithNewMovement++;
              }
          }

        // > 1/2 of sprites fulfill requirement?
        console.log('sprites with scripts');
        console.log(spritesWithScripts);
        if (spritesWithScripts >= project.sprites.length / 2) {
            this.requirements.scripts.bool = true;
        }

        console.log('sprites with dialogue');
        console.log(spritesWithNewDialogue)
        if (spritesWithNewDialogue >= project.sprites.length / 2) {
            this.requirements.dialogue.bool = true;
        }

        console.log('sprite with new costumes');
        console.log(spritesWithNewCostumes);
        if (spritesWithNewCostumes >= project.sprites.length / 2) {
            this.requirements.costumes.bool = true;
        }

        console.log('sprites with new movement');
        console.log(spritesWithNewMovement);
        if (spritesWithNewMovement >= project.sprites.length / 2) {
            this.requirements.movement.bool = true;
        }
    }
}








},{"../act1-grading-scripts/name-poem-original-test":6,"../grading-scripts-s3/scratch3":23,"util":29}],8:[function(require,module,exports){
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
        // strict completion metrics
        this.requirements.leftChanged = { bool: false, str: 'The left sprite has new dialogue' }; // done
        this.requirements.leftCostume = { bool: false, str: 'The left costume has been changed' }; // done
        this.requirements.rightCostume = { bool: false, str: 'The right costume has been changed' }; // done
        this.requirements.midCostume = {bool: false, str: 'The middle costume has been changed'};
        this.requirements.interactiveRight = { bool: false, str: 'Right sprite uses the "when this sprite clicked" block' };
        this.requirements.interactiveMiddle = { bool: false, str: 'Middle sprite uses the "when this sprite clicked" block'};
        this.requirements.speakingRight = { bool: false, str: 'Right sprite has a script with a say block in it' }; // done
        this.requirements.speakingMiddle = { bool: false, str: 'Middle sprite has a script with a say block in it' }; // done

        // demonstrated understanding metrics under extensions
        this.extensions.newCostumes1 = { bool: false, str: 'At least one sprite has a new costumes' };
        //this.requirements.newCostumes2= {bool: false, str: 'At least two sprites have new costumes'};
        //this.requirements.newCostumes3 = {bool: false, str: 'At least three sprites have new costumes'}; 

        //this.extensions.speaking3 = {bool: false, str: 'All three sprites use the say block'}; 
        //this.extensions.speaking2 = {bool: false, str: 'Two sprites use the say block'}; 
        this.extensions.speaking1 = { bool: false, str: 'A sprite uses the say block' };

        //this.extensions.interactive2 = {bool: false, str: '2/3 sprites are interactive'}; 
        this.extensions.interactive1 = { bool: false, str: '1/3 sprites are interactive' };

        // extensions
        // this.extensions.usesPlaySoundUntilDone = { bool: false, str: 'The project uses the "Play Sound Until" block in a script' }; 
        // this.extensions.usesGotoXY = { bool: false, str: 'The project uses the "Go to XY" block in a script' };
        // this.extensions.keyCommand = { bool: false, str: 'The project uses a "when "key" pressed" block in a script' };
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
            }
            if (target.name === 'Middle') {
                let cost2 = target.currentCostume;
                midCost = target.costumes[cost2].assetId;
                newCostumes.push(midCost);
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            continue;
                        }
                        else {
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
            }
        }

        if (midInteraction) {
            this.requirements.interactiveMiddle.bool = true;
        } 
        if (rightInteraction) {
            this.requirements.interactiveRight.bool = true;
        }
        if (midDialogue !== '') {
            this.requirements.speakingMiddle.bool = true;
        }
        if (rightDialogue !== '') {
            this.requirements.speakingRight.bool = true;
        }
        
        if (leftDialogue !== origLeftDialogue) {
            this.requirements.leftChanged.bool = true;
        }
        if (leftCost !== origCostumeLeft) {
            this.requirements.leftCostume.bool = true;
        }
        if (rightCost !== origCostumeRight) {
            this.requirements.rightCostume.bool = true;
        }
        if (midCost !== origCostumeMiddle) {
            this.requirements.midCostume.bool = true;
        }
        // --------------------------------------------------------------------------------------------------------- //

        // if the elements are not the same or they are not in the same order
        if (JSON.stringify(oldCostumes) !== JSON.stringify(newCostumes)) {
            this.extensions.newCostumes1.bool = true;
        }

        // if there is a say block in a sprite that is not named catrina, and that say block is not used in the same 
        // context as the original project (same parent and next block)
        for (let target of project.targets) {
            if (target.name === 'Catrina') {
                continue;
            } else {
                for (let script in target.scripts) {
                    for (let block in target.scripts[script].blocks) {
                        if (soundOptions.includes(target.scripts[script].blocks[block].opcode)) {
                            if (target.scripts[script].blocks[block].next === "Q.gGFO#r}[Z@fzClmRq-" && target.scripts[script].blocks[block].parent === "taz8m.4x_rVweL9%J@(3") {
                                continue;
                            } else if (target.scripts[script].blocks[block].next === "sPl?mFlNaaD_l]+QJ.CW" && target.scripts[script].blocks[block].parent === "Y5!LLf.Gqemqe/6!)t=e") {
                                continue;
                            }
                            else {
                                this.extensions.speaking1.bool = true;
                            }
                        }
                        
                        if (target.scripts[script].blocks[block].opcode === 'event_whenthisspriteclicked') {
                            if (target.scripts[script].blocks[block].next === "}VBgCH{K:oDh6pV0h.pi" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else if (target.scripts[script].blocks[block].next === "/f[ltBij)7]5Jtg|W(1%" && target.scripts[script].blocks[block].parent === null) {
                                continue;
                            } else {
                                this.extensions.interactive1.bool = true;
                            }
                        }
                    }

                    //checks if 'Eat Aphid' block is connected to a script
                    if (target.blocks[block].opcode === 'procedures_call') {
                        if (target.blocks[block].mutation.proccode === 'Eat Aphid') {
                            if (target.blocks[block].parent !== null) {
                                this.requirements.eatAphidBlock.bool = true;
                            }
                        }
                    }

                    //checks if a new "move steps" block has been connected
                    if (target.blocks[block].opcode === 'motion_movesteps') {
                        if (target.blocks[block].parent !== null) {
                            moveStepsBlocks++;
                        }
                    }
                    if ((target.blocks[block].opcode === 'motion_turnright') ||
                        (target.blocks[block].opcode === 'motion_turnleft')) {
                        if (target.blocks[block].parent !== null) {
                            turnBlocks++;
                        }
                    }
                }
                break;
            }

        }
    }
} 
},{"../act1-grading-scripts/originalOfrenda-test":10,"../grading-scripts-s3/scratch3":23}],9:[function(require,module,exports){
module.exports={"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{"broadcastMsgId-munch":"munch"},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"assetId":"6bbe43392c0dbffe7d7c63cc5bd08aa3","name":"backdrop1","bitmapResolution":1,"md5ext":"6bbe43392c0dbffe7d7c63cc5bd08aa3.svg","dataFormat":"svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"off","textToSpeechLanguage":null},{"isStage":false,"name":"Ladybug1","variables":{},"lists":{},"broadcasts":{},"blocks":{"U7gIJGYi2sEQ1R~Q#Y(x":{"opcode":"event_whenflagclicked","next":"F@9g]aRRb1sq*2qa!%ng","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":264,"y":24},"F@9g]aRRb1sq*2qa!%ng":{"opcode":"motion_gotoxy","next":"Sfc=i0}1cnoDpchs?.Uq","parent":"U7gIJGYi2sEQ1R~Q#Y(x","inputs":{"X":[1,[4,-175]],"Y":[1,[4,-24]]},"fields":{},"shadow":false,"topLevel":false},"Sfc=i0}1cnoDpchs?.Uq":{"opcode":"motion_pointindirection","next":"^)NnU+Yxi6BeEWyh3in`","parent":"F@9g]aRRb1sq*2qa!%ng","inputs":{"DIRECTION":[1,[8,90]]},"fields":{},"shadow":false,"topLevel":false},"^)NnU+Yxi6BeEWyh3in`":{"opcode":"control_wait","next":"{*nT,|Un;N}8m)P0wAVC","parent":"Sfc=i0}1cnoDpchs?.Uq","inputs":{"DURATION":[1,[5,1]]},"fields":{},"shadow":false,"topLevel":false},"{*nT,|Un;N}8m)P0wAVC":{"opcode":"motion_movesteps","next":"Qjej.|{eUe=~o*uAuRF,","parent":"^)NnU+Yxi6BeEWyh3in`","inputs":{"STEPS":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":false},"Qjej.|{eUe=~o*uAuRF,":{"opcode":"control_wait","next":"lDrR0@W5G`|K9EW2^U=0","parent":"{*nT,|Un;N}8m)P0wAVC","inputs":{"DURATION":[1,[5,1]]},"fields":{},"shadow":false,"topLevel":false},"lDrR0@W5G`|K9EW2^U=0":{"opcode":"motion_turnright","next":"R%7gnK]7!DF4`qpYfccd","parent":"Qjej.|{eUe=~o*uAuRF,","inputs":{"DEGREES":[1,[4,90]]},"fields":{},"shadow":false,"topLevel":false},"R%7gnK]7!DF4`qpYfccd":{"opcode":"control_wait","next":"1?YefC;{nn1p+6x[y7=p","parent":"lDrR0@W5G`|K9EW2^U=0","inputs":{"DURATION":[1,[5,1]]},"fields":{},"shadow":false,"topLevel":false},"1?YefC;{nn1p+6x[y7=p":{"opcode":"motion_movesteps","next":null,"parent":"R%7gnK]7!DF4`qpYfccd","inputs":{"STEPS":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":false},"iQ]xjD_RSjVU39KKi+D+":{"opcode":"event_whenflagclicked","next":"03[Ml=XIME[mlM`[oI,{","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":1117,"y":41},"03[Ml=XIME[mlM`[oI,{":{"opcode":"control_forever","next":null,"parent":"iQ]xjD_RSjVU39KKi+D+","inputs":{"SUBSTACK":[2,"{eG]NNI}y+`9w8~P-Y@w"]},"fields":{},"shadow":false,"topLevel":false},"{eG]NNI}y+`9w8~P-Y@w":{"opcode":"control_if","next":null,"parent":"03[Ml=XIME[mlM`[oI,{","inputs":{"CONDITION":[2,"HJ?{4{KV1xCg#k7UhPC6"],"SUBSTACK":[2,"kQKB.w^V0`:QX38gKYzf"]},"fields":{},"shadow":false,"topLevel":false},"HJ?{4{KV1xCg#k7UhPC6":{"opcode":"sensing_touchingcolor","next":null,"parent":"{eG]NNI}y+`9w8~P-Y@w","inputs":{"COLOR":[1,[9,"#00ffff"]]},"fields":{},"shadow":false,"topLevel":false},"kQKB.w^V0`:QX38gKYzf":{"opcode":"control_stop","next":";Dm1;gL:ROwhL*^;y!zp","parent":"{eG]NNI}y+`9w8~P-Y@w","inputs":{},"fields":{"STOP_OPTION":["other scripts in sprite"]},"shadow":false,"topLevel":false,"mutation":{"tagName":"mutation","hasnext":"true","children":[]}},";Dm1;gL:ROwhL*^;y!zp":{"opcode":"looks_sayforsecs","next":"H#v_fC4p1{^Dy]J98),R","parent":"kQKB.w^V0`:QX38gKYzf","inputs":{"MESSAGE":[1,[10,"Aaaaah! I fell off the branch!!!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"H#v_fC4p1{^Dy]J98),R":{"opcode":"control_repeat","next":"eO]JO},91+03]-,-p.kW","parent":";Dm1;gL:ROwhL*^;y!zp","inputs":{"TIMES":[1,[6,3]],"SUBSTACK":[2,"Hfkes2)|!Awk/*Iir#]f"]},"fields":{},"shadow":false,"topLevel":false},"Hfkes2)|!Awk/*Iir#]f":{"opcode":"looks_hide","next":"NdsT}^o2UI(D_trv9KW9","parent":"H#v_fC4p1{^Dy]J98),R","inputs":{},"fields":{},"shadow":false,"topLevel":false},"NdsT}^o2UI(D_trv9KW9":{"opcode":"control_wait","next":"Rp7XGUXIMwRD^e4J2IZy","parent":"Hfkes2)|!Awk/*Iir#]f","inputs":{"DURATION":[1,[5,0.5]]},"fields":{},"shadow":false,"topLevel":false},"Rp7XGUXIMwRD^e4J2IZy":{"opcode":"looks_show","next":"k7:X0JW7;CDuX8ZM[`|-","parent":"NdsT}^o2UI(D_trv9KW9","inputs":{},"fields":{},"shadow":false,"topLevel":false},"k7:X0JW7;CDuX8ZM[`|-":{"opcode":"control_wait","next":null,"parent":"Rp7XGUXIMwRD^e4J2IZy","inputs":{"DURATION":[1,[5,0.5]]},"fields":{},"shadow":false,"topLevel":false},"eO]JO},91+03]-,-p.kW":{"opcode":"motion_gotoxy","next":"I3gZVQ)z)SV7w[OezvsL","parent":"H#v_fC4p1{^Dy]J98),R","inputs":{"X":[1,[4,-175]],"Y":[1,[4,-24]]},"fields":{},"shadow":false,"topLevel":false},"I3gZVQ)z)SV7w[OezvsL":{"opcode":"motion_pointindirection","next":null,"parent":"eO]JO},91+03]-,-p.kW","inputs":{"DIRECTION":[1,[8,90]]},"fields":{},"shadow":false,"topLevel":false},":g/E[3PXa}d6Cve2Swk2":{"opcode":"motion_movesteps","next":null,"parent":null,"inputs":{"STEPS":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":true,"x":8,"y":33},"M1gwhU_QVGXM)kQF*L`{":{"opcode":"procedures_definition","next":"@,~#(h4pJpg}jA2}_/R[","parent":null,"inputs":{"custom_block":[1,"+d7X?d`DBq2~x0}OHSC/"]},"fields":{},"shadow":false,"topLevel":true,"x":1136,"y":820},"+d7X?d`DBq2~x0}OHSC/":{"opcode":"procedures_prototype","next":null,"inputs":{},"fields":{},"shadow":true,"topLevel":false,"mutation":{"tagName":"mutation","proccode":"Eat Aphid","argumentnames":"[]","argumentids":"[]","argumentdefaults":"[]","warp":false,"children":[]}},"@,~#(h4pJpg}jA2}_/R[":{"opcode":"event_broadcast","next":null,"parent":"M1gwhU_QVGXM)kQF*L`{","inputs":{"BROADCAST_INPUT":[1,[11,"Munch","broadcastMsgId-munch"]]},"fields":{},"shadow":false,"topLevel":false},"%vAkoQPRX5(5~AohGy*u":{"opcode":"motion_turnright","next":null,"parent":null,"inputs":{"DEGREES":[1,[4,90]]},"fields":{},"shadow":false,"topLevel":true,"x":8,"y":109},"~)q`N2jinQ]:/zs,-.s1":{"opcode":"motion_turnleft","next":null,"parent":null,"inputs":{"DEGREES":[1,[4,90]]},"fields":{},"shadow":false,"topLevel":true,"x":7,"y":188},"nZ1!J1WTOAWy}Af(z1#c":{"opcode":"control_wait","next":null,"parent":null,"inputs":{"DURATION":[1,[5,1]]},"fields":{},"shadow":false,"topLevel":true,"x":8,"y":268},"Yl_GU18WZdM(iSO=,FM~":{"opcode":"procedures_call","next":null,"parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":10,"y":366,"mutation":{"tagName":"mutation","children":[],"proccode":"Eat Aphid","argumentids":"[]"}}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"7501580fb154fde8192a931f6cab472b","name":"ladybug3","bitmapResolution":1,"md5ext":"7501580fb154fde8192a931f6cab472b.svg","dataFormat":"svg","rotationCenterX":41,"rotationCenterY":43},{"assetId":"169c0efa8c094fdedddf8c19c36f0229","name":"ladybug2","bitmapResolution":1,"md5ext":"169c0efa8c094fdedddf8c19c36f0229.svg","dataFormat":"svg","rotationCenterX":41,"rotationCenterY":43}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":4,"visible":true,"x":-175,"y":-24,"size":50,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Sprite1","variables":{},"lists":{},"broadcasts":{},"blocks":{"g{X}coEAM3Ta^+%(=s^s":{"opcode":"event_whenflagclicked","next":"3S,1y@;w+[,tG`(EZCAt","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":68,"y":35},"3S,1y@;w+[,tG`(EZCAt":{"opcode":"looks_show","next":"_LYbp}EcsXWoN1ppLxcv","parent":"g{X}coEAM3Ta^+%(=s^s","inputs":{},"fields":{},"shadow":false,"topLevel":false},"_LYbp}EcsXWoN1ppLxcv":{"opcode":"motion_pointindirection","next":"4Q5;gsz5+/bgWS(:Rag,","parent":"3S,1y@;w+[,tG`(EZCAt","inputs":{"DIRECTION":[1,[8,90]]},"fields":{},"shadow":false,"topLevel":false},"4Q5;gsz5+/bgWS(:Rag,":{"opcode":"motion_gotoxy","next":"4L~#s_w.KLA*F5Xc`{C`","parent":"_LYbp}EcsXWoN1ppLxcv","inputs":{"X":[1,[4,0]],"Y":[1,[4,-150]]},"fields":{},"shadow":false,"topLevel":false},"4L~#s_w.KLA*F5Xc`{C`":{"opcode":"control_repeat","next":"Vb38^m9i^P8Qx=K`.+Yh","parent":"4Q5;gsz5+/bgWS(:Rag,","inputs":{"TIMES":[1,[6,6]],"SUBSTACK":[2,"56{t%hej8N*pk`S3%Nrj"]},"fields":{},"shadow":false,"topLevel":false},"56{t%hej8N*pk`S3%Nrj":{"opcode":"pen_stamp","next":"UyBZkQkw+i|j3]/7K`[%","parent":"4L~#s_w.KLA*F5Xc`{C`","inputs":{},"fields":{},"shadow":false,"topLevel":false},"UyBZkQkw+i|j3]/7K`[%":{"opcode":"motion_changeyby","next":null,"parent":"56{t%hej8N*pk`S3%Nrj","inputs":{"DY":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":false},"Vb38^m9i^P8Qx=K`.+Yh":{"opcode":"pen_stamp","next":"#I:55@rxBustg@:0CNW,","parent":"4L~#s_w.KLA*F5Xc`{C`","inputs":{},"fields":{},"shadow":false,"topLevel":false},"#I:55@rxBustg@:0CNW,":{"opcode":"motion_gotoxy","next":"c?Rcii^r7j{3zIKlPCY7","parent":"Vb38^m9i^P8Qx=K`.+Yh","inputs":{"X":[1,[4,-200]],"Y":[1,[4,0]]},"fields":{},"shadow":false,"topLevel":false},"c?Rcii^r7j{3zIKlPCY7":{"opcode":"motion_pointindirection","next":"Ev;g}Py1-pZ#SpwkoO~I","parent":"#I:55@rxBustg@:0CNW,","inputs":{"DIRECTION":[1,[8,0]]},"fields":{},"shadow":false,"topLevel":false},"Ev;g}Py1-pZ#SpwkoO~I":{"opcode":"control_repeat","next":"1R95jS-gQRcWy1!()qDX","parent":"c?Rcii^r7j{3zIKlPCY7","inputs":{"TIMES":[1,[6,8]],"SUBSTACK":[2,"C+]}-*OqPzGDND@[I`!`"]},"fields":{},"shadow":false,"topLevel":false},"C+]}-*OqPzGDND@[I`!`":{"opcode":"pen_stamp","next":"vf~MRj8GONdu)xTW+`sX","parent":"Ev;g}Py1-pZ#SpwkoO~I","inputs":{},"fields":{},"shadow":false,"topLevel":false},"vf~MRj8GONdu)xTW+`sX":{"opcode":"motion_changexby","next":null,"parent":"C+]}-*OqPzGDND@[I`!`","inputs":{"DX":[1,[4,50]]},"fields":{},"shadow":false,"topLevel":false},"1R95jS-gQRcWy1!()qDX":{"opcode":"pen_stamp","next":"!]hy8aHujpmLSmfwgk7+","parent":"Ev;g}Py1-pZ#SpwkoO~I","inputs":{},"fields":{},"shadow":false,"topLevel":false},"!]hy8aHujpmLSmfwgk7+":{"opcode":"looks_hide","next":null,"parent":"1R95jS-gQRcWy1!()qDX","inputs":{},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"098ac26af75d9b14546ba423f0376c78","name":"costume1","bitmapResolution":1,"md5ext":"098ac26af75d9b14546ba423f0376c78.svg","dataFormat":"svg","rotationCenterX":247,"rotationCenterY":2}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":1,"visible":false,"x":200,"y":0,"size":100,"direction":0,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Aphid","variables":{},"lists":{},"broadcasts":{},"blocks":{"Al/9-=x`PHo)+1K4Jsw2":{"opcode":"event_whenflagclicked","next":"|FY,izak`W47{j*=KnG5","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":37,"y":46},"|FY,izak`W47{j*=KnG5":{"opcode":"looks_show","next":null,"parent":"Al/9-=x`PHo)+1K4Jsw2","inputs":{},"fields":{},"shadow":false,"topLevel":false},"se5y3M`e{qYhvvplydn.":{"opcode":"event_whenbroadcastreceived","next":"?ec)oOeZLY5LfeL(D5QB","parent":null,"inputs":{},"fields":{"BROADCAST_OPTION":["Munch","broadcastMsgId-munch"]},"shadow":false,"topLevel":true,"x":45,"y":264},"?ec)oOeZLY5LfeL(D5QB":{"opcode":"control_if","next":null,"parent":"se5y3M`e{qYhvvplydn.","inputs":{"CONDITION":[2,".[;R|zxb)eHrP+bfg`JR"],"SUBSTACK":[2,"@:tiv_aA#I^^`0sQ%}O1"]},"fields":{},"shadow":false,"topLevel":false},".[;R|zxb)eHrP+bfg`JR":{"opcode":"sensing_touchingobject","next":null,"parent":"?ec)oOeZLY5LfeL(D5QB","inputs":{"TOUCHINGOBJECTMENU":[1,"cB1l?RjX4g=!:@^[I(X?"]},"fields":{},"shadow":false,"topLevel":false},"cB1l?RjX4g=!:@^[I(X?":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":".[;R|zxb)eHrP+bfg`JR","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["Ladybug1"]},"shadow":true,"topLevel":false},"@:tiv_aA#I^^`0sQ%}O1":{"opcode":"looks_sayforsecs","next":"d4JFINYQk,`yV3Hd5Rz3","parent":"?ec)oOeZLY5LfeL(D5QB","inputs":{"MESSAGE":[1,[10,"Oh, no!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"d4JFINYQk,`yV3Hd5Rz3":{"opcode":"looks_hide","next":null,"parent":"@:tiv_aA#I^^`0sQ%}O1","inputs":{},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"2b3b7ab6b68e1d72f5f0246bd5246e35","name":"beetle","bitmapResolution":1,"md5ext":"2b3b7ab6b68e1d72f5f0246bd5246e35.svg","dataFormat":"svg","rotationCenterX":43,"rotationCenterY":38}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":2,"visible":true,"x":-24,"y":77,"size":30,"direction":90,"draggable":false,"rotationStyle":"all around"},{"isStage":false,"name":"Aphid2","variables":{},"lists":{},"broadcasts":{},"blocks":{"|*E4bHy6(tUyNr_FpiHL":{"opcode":"event_whenbroadcastreceived","next":"@I467Tz-PCo,~F~{tDEl","parent":null,"inputs":{},"fields":{"BROADCAST_OPTION":["Munch","broadcastMsgId-munch"]},"shadow":false,"topLevel":true,"x":31,"y":393},"@I467Tz-PCo,~F~{tDEl":{"opcode":"control_if","next":null,"parent":"|*E4bHy6(tUyNr_FpiHL","inputs":{"CONDITION":[2,"uT8k:bk6A^umen=_kL-m"],"SUBSTACK":[2,"LBQ7xhpD3hzBGz^u~MW`"]},"fields":{},"shadow":false,"topLevel":false},"uT8k:bk6A^umen=_kL-m":{"opcode":"sensing_touchingobject","next":null,"parent":"@I467Tz-PCo,~F~{tDEl","inputs":{"TOUCHINGOBJECTMENU":[1,"w.R6uBYuAjg(y#K#YJx*"]},"fields":{},"shadow":false,"topLevel":false},"w.R6uBYuAjg(y#K#YJx*":{"opcode":"sensing_touchingobjectmenu","next":null,"parent":"uT8k:bk6A^umen=_kL-m","inputs":{},"fields":{"TOUCHINGOBJECTMENU":["Ladybug1"]},"shadow":true,"topLevel":false},"LBQ7xhpD3hzBGz^u~MW`":{"opcode":"looks_sayforsecs","next":"XO!5H:??cO_M~G2fB;}l","parent":"@I467Tz-PCo,~F~{tDEl","inputs":{"MESSAGE":[1,[10,"Oh, no!"]],"SECS":[1,[4,2]]},"fields":{},"shadow":false,"topLevel":false},"XO!5H:??cO_M~G2fB;}l":{"opcode":"looks_hide","next":null,"parent":"LBQ7xhpD3hzBGz^u~MW`","inputs":{},"fields":{},"shadow":false,"topLevel":false},"|pG9oKkH+F.OL|36O0Lp":{"opcode":"event_whenflagclicked","next":"t:(!q?g_}9!~)wm!FUIP","parent":null,"inputs":{},"fields":{},"shadow":false,"topLevel":true,"x":39,"y":50},"t:(!q?g_}9!~)wm!FUIP":{"opcode":"looks_show","next":null,"parent":"|pG9oKkH+F.OL|36O0Lp","inputs":{},"fields":{},"shadow":false,"topLevel":false}},"comments":{},"currentCostume":0,"costumes":[{"assetId":"2b3b7ab6b68e1d72f5f0246bd5246e35","name":"beetle","bitmapResolution":1,"md5ext":"2b3b7ab6b68e1d72f5f0246bd5246e35.svg","dataFormat":"svg","rotationCenterX":43,"rotationCenterY":38}],"sounds":[{"assetId":"83a9787d4cb6f3b7632b4ddfebf74367","name":"pop","dataFormat":"wav","format":"","rate":44100,"sampleCount":1032,"md5ext":"83a9787d4cb6f3b7632b4ddfebf74367.wav"}],"volume":100,"layerOrder":3,"visible":true,"x":75,"y":-123,"size":30,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":["pen"],"meta":{"semver":"3.0.0","vm":"0.2.0-prerelease.20190619042313","agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"}}
},{}],10:[function(require,module,exports){
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
require('./scratch3');

let control = ['control_forever', 'control_if', 'control_if_else', 'control_repeat', 'control_stop', 'control_repeat_until', 'control_wait_until'];
let loops = ['control_forever', 'control_repeat', 'control_repeat_until'];

// helper function to iterate for each block in scripts and subscripts recursively.
// understanding the usecases is more important than the details of the code (unless there are bugs)
let iterateBlocks = (script, func, parentBlocks=control) => {
    const recursive = (scripts, func, level) => {
        if (!is(scripts) || scripts === [[]]) return;
        for (let script of scripts) {
            for(let block of script.blocks) {
                func(block, level);
                if (parentBlocks.includes(block.opcode)) 
                    recursive(block.subScripts(), func, level + 1);
            }
        }
    }
    recursive([script], func, 1);
}

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
            iterateBlocks(script, (block, level) => {
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
                iterateBlocks(script, (block, level) => {
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
                iterateBlocks(script, (block, level) => {
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

},{"./scratch3":23}],12:[function(require,module,exports){
/* Animation L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and minor bug fixes: Marco Anaya, Summer 2019
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

const print = (block, level) => console.log("   ".repeat(level) + block.opcode);

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
            iterateBlocks(script, (block, level) => {
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
},{"./scratch3":23}],13:[function(require,module,exports){
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
                           //     console.log('Sprite with new movement:');
                             //   console.log(target.name);
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

},{"./scratch3":23}],14:[function(require,module,exports){
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


},{"../grading-scripts-s3/scratch3":23}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
/* Decomposition By Sequence L1 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
*/

var sb3 = {
    //null checker
    no: function(x) { 
        return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
    },

    //retrieve a given sprite's blocks from JSON
    //note: doesn't check whether or not blocks are properly attached
    jsonToSpriteBlocks: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        var allBlocks={};
        var blocks={};
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i]['blocks'];
            }
        }
        return [];
    }, //done
    
    //retrieve a given sprite's info (not just blocks) from JSON
    jsonToSprite: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return [];
    }, //done
    
    //counts the number of non-background sprites in a project
    countSprites: function(json){
        if (this.no(json)) return false; //make sure script exists
        
        var numSprites = 0;
        var projInfo = json['targets'] //extract targets from JSON data
        
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['isStage'] == false){
                numSprites ++;
            }
        }
        return numSprites
    },
    
    //looks through json to see if a sprite with a given name is present
    //returns sprite
    returnSprite: function(json, spriteName){ 
        if (this.no(json)) return; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return ;
    }, //done
    
    //looks through json to see if a sprite with a given name is present
    //returns true if sprite with given name found
    findSprite: function(json, spriteName){ 
        if (this.no(json)) return false; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return true;
            }
        }
        return false;
    }, //done
    
    //returns list of block ids given a set of blocks
    findBlockIDs: function(blocks, opcode){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                blockids.push(block);
            }
        }
        return blockids;
    },
    
    //given particular key, returns list of block ids of a certain kind of key press given a set of blocks 
    findKeyPressIDs: function(blocks, key){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == 'event_whenkeypressed'){
                if(blocks[block]['fields']['KEY_OPTION'][0] == key){
                    blockids.push(block);
                }
            }
        }
        return blockids;
    },
    
    opcodeBlocks: function(script, myOpcode) { //retrieve blocks with a certain opcode from a script list of blocks
        if (this.no(script)) return [];
        
        var miniscript = [];

        for(block in script){
            if(script[block]['opcode'] == myOpcode){
                miniscript.push(script[block]);
            }
        }
        return miniscript;
    }, 
    
    opcode: function(block) { //retrives opcode from a block object 
        if (this.no(block)) return "";
        return block['opcode'];
    }, 
    
    countBlocks: function(blocks,opcode){ //counts number of blocks with a given opcode
        var total = 0;
		for(id in blocks){ 
            if([blocks][id]['opcode'] == opcode){
                total = total + 1;
            }
        }
        return total;
    }, //done
    
    //(recursive) helper function to extract blocks inside a given loop
    //works like makeScript except it only goes down the linked list (rather than down & up)
    loopExtract: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];

        //Find all blocks that come after
        curBlockID = blockID //Initialize with blockID of interest
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary                

            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.makeScript(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }     
        return script;        
    },
    
    //given list of blocks and a keyID of a block, return a script
    makeScript: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];
    
        //find all blocks that come before
        while(curBlockID != null){
            var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary 
            
            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            //parentInfo = blocks[parentID]
    		var opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
            if ((parentID == null) && !(event_opcodes.includes(opcode))){
                return [];
            }

            //Iterate: set parent to curBlock
            curBlockID = parentID
        }

        //find all blocks that come after
        curBlockID = blocks[blockID]['next']
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block

            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];

            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){   
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            script.push(curBlockInfo); //Add the block itself to the script dictionary                
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }
        return script;
    }
};

class GradeDecompBySeq{
    
    constructor() {
        this.requirements = {}
    }
    
    init() {
        this.requirements = {
      JaimeToBall:
        {bool:false, str:'Jaime uses the "repeat until" block to do an action until it touches the Soccer Ball.'},
      JaimeAnimated:
        {bool:false, str:'Jaime is animated correctly to move towards the Soccer Ball.'},
      ballStayStill:
        {bool:false, str:'Soccer Ball uses the "wait until" to wait until Jaime touches it.'},
      ballToGoal:
        {bool:false, str:'Soccer Ball uses the "repeat until" block to do an action until it touches the Goal.'},
      ballAnimated: 
        {bool:false, str:'Soccer Ball is animated correctly to move towards the Goal.'},
    }
        this.extensions = {
            cheer:
                {bool: false, str: 'Cheer sound when ball enters goal'},
            bounce:
                {bool: false, str: 'Ball bounces off goal'},
            jump:
                {bool: false, str: 'Jaime jumps up and down to celebrate goal'},
            goalie: 
                {bool: false, str: 'Added a goalie sprite.'},
            goaliebounce:
                {bool: false, str: 'Ball bounces off the goalie.'},
            goaliemoves:
                {bool: false, str: 'Goalie can move left and right with the arrow keys.'}
            
        }
    }
    
    
    
    grade(fileObj, user){
        this.init();
        
        for(var i in fileObj['targets']){ //find sprite
            var sprite = fileObj['targets'][i]
            if(sprite['name'] == 'Jaime '){
                var jaime = sprite;
                this.checkJaime(jaime);
            }
            else if(sprite['name'] == 'Soccer Ball'){
                var ball = sprite;
                this.checkBall(ball);
            }
            else if(sprite['name'] == 'Goal'){
                var goal = sprite;
                this.checkGoal(goal);
            }
            else if(goal != undefined && ball != undefined && goal != undefined){ //
                var goalie = sprite;
                this.extensions.goalie.bool = true;
                this.checkGoalie(goalie);
            }
        }
    }
    
    checkJaime(jaime){
        var jaimeids = sb3.findBlockIDs(jaime['blocks'], 'event_whenflagclicked');
        for(var j in jaimeids){
            var jaimeScript = sb3.makeScript(jaime['blocks'], jaimeids[j]);
            for(var i in jaimeScript){
                if(jaimeScript[i]['opcode'] == 'control_repeat_until'){
                    var condblock = jaimeScript[i]['inputs']['CONDITION'][1];
                    var cond = jaime['blocks'][condblock];
                    if(cond['opcode'] == 'sensing_touchingobject'){
                        var objectID = cond['inputs']['TOUCHINGOBJECTMENU'][1];
                        var object = jaime['blocks'][objectID]['fields']['TOUCHINGOBJECTMENU'][0]
                        if(object == 'Soccer Ball'){
                            this.requirements.JaimeToBall.bool = true;
                            var curID = jaimeScript[i]['inputs']['SUBSTACK'][1]
                            while(curID != null){ //check if Jaime is moving towards the ball
                                if(jaime['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                   this.requirements.JaimeAnimated.bool = true;
                                }
                                curID = jaime['blocks'][curID]['next']
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkBall(ball){
        var ballids = sb3.findBlockIDs(ball['blocks'], 'event_whenflagclicked');
        for(var j in ballids){
            var ballScript = sb3.makeScript(ball['blocks'], ballids[j]);
            for(var i in ballScript){
                if(ballScript[i]['opcode'] == 'control_wait_until'){
                    var condid = ballScript[i]['inputs']['CONDITION'][1] //find key of condition block
                    if(condid != null){ //handles case where no condition is nested in the block
                        var cond = ball['blocks'][condid]
                        var nameid = cond['inputs']['TOUCHINGOBJECTMENU'][1] //find key of block with nested object of the condition
                        if(nameid != null){
                            var name = ball['blocks'][nameid]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(name == 'Jaime '){
                                this.requirements.ballStayStill.bool = true;
                            }
                            if(name == 'Goal'){
                            
                                var curID = ballScript[i]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'control_repeat_until'){
                                        var condid = ballScript[i]['inputs']['CONDITION'][1]
                                        var condition = ball['blocks'][condid]['opcode']
                                        if(condition == 'sensing_touchingobject'){
                                            var object = ball['blocks'][condid]['inputs']['TOUCHINGOBJECTMENU'][1] //find key of condition block
                                            if(object != null){
                                                var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0] //find key of block with nested object
                                                if(objname == 'Jaime '){
                                                    this.extensions.bounce.bool = true;
                                                }
                                            }
                                        }
                                    }
                                    curID = ball['blocks'][curID]['next'] //iterate
                                }
                                
                            }
                        }
                    }
                }
                if(ballScript[i]['opcode'] == 'control_repeat_until' ){
                    var condid = ballScript[i]['inputs']['CONDITION'][1]
                    var condition = ball['blocks'][condid]['opcode']
                    if(condition == 'sensing_touchingobject'){
                        var object = ball['blocks'][condid]['inputs']['TOUCHINGOBJECTMENU'][1] //find key of condition block
                        if(object != null){
                            var objname = ball['blocks'][object]['fields']['TOUCHINGOBJECTMENU'][0] //find key of block with nested object
                            if(objname == 'Goal'){
                                this.requirements.ballToGoal.bool = true;
                            
                                var curID = ballScript[i]['inputs']['SUBSTACK'][1]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                        this.requirements.ballAnimated.bool = true;
                                    }
                                    curID = ball['blocks'][curID]['next']
                                }
                            }
                            if(objname == 'Jaime '){
                                var curID = ballScript[i]['inputs']['SUBSTACK'][1]
                                while(curID != null){ 
                                    if(ball['blocks'][curID]['opcode'] == 'motion_movesteps'){
                                        this.extensions.bounce.bool = true;
                                    }
                                    curID = ball['blocks'][curID]['next']
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    checkGoal(goal){
        var flags = sb3.findBlockIDs(goal['blocks'], 'event_whenflagclicked');
        for(var j in flags){
            var goalScript = sb3.makeScript(goal['blocks'], flags[j]);
            for(var i in goalScript){
                if(goalScript[i]['opcode'] == 'control_wait_until'){
                    var condid = goalScript[i]['inputs']['CONDITION'][1] //find key of condition block
                    if(condid != null){ //handles case where no condition is nested in the block
                        var cond = goal['blocks'][condid]
                        var nameid = cond['inputs']['TOUCHINGOBJECTMENU'][1] //find key of block with nested object of the condition
                        if(nameid != null){
                            var name = goal['blocks'][nameid]['fields']['TOUCHINGOBJECTMENU'][0]
                            if(name == 'Soccer Ball'){
                                var curid = goalScript[i]['next']
                                while(curid != null){
                                    if(goal['blocks'][curid]['opcode'] == 'sound_playuntildone' || goal['blocks'][curid]['opcode'] == 'sound_play'){
                                        this.extensions.cheer.bool = true;
                                    }
                                    curid = goal['blocks'][curid]['next'] //iterate
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }
    
    checkGoalie(goalie){
        var movement = ['motion_changexby', 'motion_glidesecstoxy', 'motion_glideto', 'motion_goto', 'motion_gotoxy']
        
        var arrows = sb3.findBlockIDs(goalie['blocks'], 'event_whenkeypressed');
        var left = false;
        var right = false;
        for(var i in arrows){ 
            var blockid = arrows[i]
            if(goalie['blocks'][arrows[i]]['fields']['KEY_OPTION'][0] == 'left arrow'){
                var leftscript = sb3.makeScript(goalie['blocks'], blockid)
                for(var j in leftscript){
                    if(movement.includes(leftscript[j]['opcode'])){
                        left = true
                    }
                }
                
            }
            if(goalie['blocks'][arrows[i]]['fields']['KEY_OPTION'][0] == 'right arrow'){
                var rightscript = sb3.makeScript(goalie['blocks'], blockid)
                for(var j in rightscript){
                    if(movement.includes(rightscript[j]['opcode'])){
                        right = true
                    }
                }
            }
            if(left == true && right == true){
                this.extensions.goaliemoves.bool = true
            }
        }
    }
    
    
}

module.exports = GradeDecompBySeq;
},{}],17:[function(require,module,exports){
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
            touchingBlock: {bool: false, str: 'Two sprites use "wait until touching" and/or "repeat until touching".'},
            sequentialAction: {bool: false, str: 'Two sprites have sequential action.'},
            //TODO: do the touching and sequentialaction reqs have to be under the same event block?
        }
        this.extensions = {
            thirdSprite: {bool: false, str: 'The third sprite has a new event with different actions.'},
            soundBlock: {bool: false, str: 'The project uses a sound block.'},
        }
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
            'sound_playuntildone'
        ];

        var goTo = false;
        var touching = false;
        var seqAction = false;
        var diffActions = false; 

        var actionBlocks = [
            'motion_movesteps', 
            'looks_costume', 
            'looks_switchcostumeto', 
            'looks_nextcostume', 
            'control_wait',
        ];

        var foundMove = false;
        var foundCostume = false;
        var foundWait = false; 

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
                    if (["control_wait_until", "control_repeat_until"].includes(opcode)) {
                        var inputCond = block.conditionBlock();  // the input condition block
                        if (inputCond !== null) {
                            if (["sensing_touchingcolor", "sensing_touchingobject", "sensing_touchingobjectmenu", "sensing_coloristouchingcolor"].includes(inputCond.opcode)) 
                                touching = true;
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

                    // search for sequential action blocks (wait, move, change costume) in any order
                    if (actionBlocks.includes(opcode) && (seqAction === false)) {
                        var currBlock = block;
                        var nextBlock = block.nextBlock();
                        if ((nextBlock !== null) && (nextBlock.next !== null)) {  // if a group of 3 blocks exist
                            var thirdBlock = nextBlock.nextBlock();
                            // only check groups of three sequential blocks that are all potential seqAction blocks 
                            if ((actionBlocks.includes(nextBlock.opcode)) && (actionBlocks.includes(thirdBlock.opcode))) { 
                                if (currBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto','looks_nextcostume'].includes(currBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (currBlock.opcode.includes("control_wait")) { 
                                    foundWait = true; 
                                }

                                if (nextBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto','looks_nextcostume'].includes(nextBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (nextBlock.opcode.includes("control_wait")) { 
                                    foundWait = true; 
                                }

                                if (thirdBlock.opcode.includes("motion_movesteps")) {
                                    foundMove = true; 
                                } else if (['looks_costume','looks_switchcostumeto','looks_nextcostume'].includes(thirdBlock.opcode)) {
                                    foundCostume = true; 
                                } else if (thirdBlock.opcode.includes("control_wait")) {
                                    foundWait = true; 
                                }
                
                                // if one of each kind of seqAction blocks is found in the sequence of three given blocks
                                seqAction = seqAction || (foundMove && foundCostume && foundWait);
                                    
                                // reset the flags
                                foundMove = false;
                                foundCostume = false;
                                foundWait = false;                                
                            }
                        }                         
                    }                  
                });
            }
        }        

        return {
            name: sprite.name,
            usesGoTo: goTo,
            usesTouching: touching,
            hasSeqAction: seqAction,
            hasDiffActions: diffActions,
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
        var numSpritesTouching = 0;
        var numSpritesSeqAction = 0;
        var numSpritesDiffAction = 0;

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
                if (currSprite.usesTouching) numSpritesTouching++;
                if (currSprite.hasSeqAction) numSpritesSeqAction++;
                if (currSprite.hasDiffActions) numSpritesDiffAction++;
            }
        }
        if (newSprites >= 3) this.requirements.addThreeSprites.bool = true;
        if (numSpritesGoTo >= 2) this.requirements.twoSpritesGoTo.bool = true;
        if (numSpritesTouching >= 2) this.requirements.touchingBlock.bool = true;
        if (numSpritesSeqAction >= 2) this.requirements.sequentialAction.bool = true;

        if ((numSpritesDiffAction >= 3) || ((totalSprites >= 3) && (numSpritesDiffAction >= 1))) {
            this.extensions.thirdSprite.bool = true;
            // TODO: test for edge cases, probs doesnt cover everything
            // if sprites w events >=3 and sprites w diff actions >=1
        }
    }
}
},{"./scratch3":23}],18:[function(require,module,exports){
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

},{"./scratch3":23}],19:[function(require,module,exports){
/* Events L2 Autograder
Initial version and testing: Zack Crenshaw, Spring 2019
Reformatting and bug fixes: Marco Anaya, Summer 2019
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
    }
    
    gradeSprite(sprite) {
        var reqEvents = [];
        var events = [];
        var validScripts = 0;     
        for (var script of sprite.scripts.filter(s => s.blocks[0].opcode.includes('event_when'))){

            //look for extension requirements throughout each block
            var blink = {hide: false, wait: false, show: false};
            var spin = {wait: false, turn: false};
            iterateBlocks(script, (block, level) => {
                var opcode = block.opcode;
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
    }
} 
},{"./scratch3":23}],20:[function(require,module,exports){
/* One Way Sync L1 Autograder
 * Marco Anaya, Spring 2019
 */

var sb3 = {
	//null checker
	no: function(x) { 
	  return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
	},

	//retrieve a given sprite's blocks from JSON
	//note: doesn't check whether or not blocks are properly attached
	jsonToSpriteBlocks: function(json, spriteName) { 
		if (this.no(json)) return []; //make sure script exists

		var projInfo = json['targets'] //extract targets from JSON data
		var allBlocks={};
		var blocks={};
		
		//find sprite
		for(i=0; i <projInfo.length; i++){
			if(projInfo[i]['name'] == spriteName){
				return projInfo[i]['blocks'];
			}
		}
		return [];
	}, //done
	
	//retrieve a given sprite's info (not just blocks) from JSON
	jsonToSprite: function(json, spriteName) { 
		if (this.no(json)) return []; //make sure script exists

		var projInfo = json['targets'] //extract targets from JSON data
		
		//find sprite
		for(i=0; i <projInfo.length; i++){
			if(projInfo[i]['name'] == spriteName){
				return projInfo[i];
			}
		}
		return [];
	}, //done
	
	//counts the number of non-background sprites in a project
	countSprites: function(json){
		if (this.no(json)) return false; //make sure script exists
		
		var numSprites = 0;
		var projInfo = json['targets'] //extract targets from JSON data
		
		for(i=0; i <projInfo.length; i++){
			if(projInfo[i]['isStage'] == false){
				numSprites ++;
			}
		}
		return numSprites
	},
	
	//looks through json to see if a sprite with a given name is present
	//returns true if sprite with given name found
	findSprite: function(json, spriteName){ 
		if (this.no(json)) return false; //make sure script exists

		var projInfo = json['targets'] //extract targets from JSON data
		
		//find sprite
		for(i=0; i <projInfo.length; i++){
			if(projInfo[i]['name'] == spriteName){
				return true;
			}
		}
		return false;
	}, //done
	
	//returns list of block ids given a set of blocks
	findBlockIDs: function(blocks, opcode){
		if(this.no(blocks) || blocks == {}) return null;
		
		var blockids = [];
		
		for(block in blocks){ 
			if(blocks[block]['opcode'] == opcode){
				blockids.push(block);
			}
		}
		return blockids;
	},
	
	//given particular key, returns list of block ids of a certain kind of key press given a set of blocks 
	findKeyPressID: function(blocks, key){
		if(this.no(blocks) || blocks == {}) return [];
		
		var blockids = [];
		
		for(block in blocks){ 
			if(blocks[block]['opcode'] == 'event_whenkeypressed'){
				if(blocks[block]['fields']['KEY_OPTION'][0] == key){
					blockids.push(block);
				}
			}
		}
		return blockids;
	},
	
	opcodeBlocks: function(script, myOpcode) { //retrieve blocks with a certain opcode from a script list of blocks
		if (this.no(script)) return [];
		
		var miniscript = [];

		for(block in script){
			if(script[block]['opcode'] == myOpcode){
				miniscript.push(script[block]);
			}
		}
		return miniscript;
	}, 
	
	opcode: function(block) { //retrives opcode from a block object 
		if (this.no(block)) return "";
		return block['opcode'];
	}, 
	
	countBlocks: function(blocks,opcode){ //counts number of blocks with a given opcode
		var total = 0;
	for(id in blocks){ 
			if([blocks][id]['opcode'] == opcode){
				total = total + 1;
			}
		}
		return total;
	}, //done
	
	//(recursive) helper function to extract blocks inside a given loop
	//works like makeScript except it only goes down the linked list (rather than down & up)
	loopExtract: function(blocks, blockID){
		if (this.no(blocks) || this.no(blockID)) return [];
		loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
		
		var curBlockID = blockID;
		var script = [];

		//Find all blocks that come after
		curBlockID = blockID //Initialize with blockID of interest
		while(curBlockID != null){
			curBlockInfo = blocks[curBlockID]; //Pull out info about the block
			script.push(curBlockInfo); //Add the block itself to the script dictionary                

			
			//nextInfo = blocks[nextID]
			opcode = curBlockInfo['opcode'];
			
			//extract nested children if loop block
			if(loop_opcodes.includes(opcode)){
				var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
				if(innerloop != undefined){
					var nested_blocks = this.makeScript(blocks, innerloop)
					for(b in nested_blocks){
						script.push(nested_blocks[b])
					}
				}
			}

			//Get next info out
			nextID = curBlockInfo['next']; //Block that comes after has key 'next'
	
			//If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
			if((nextID == null) && (event_opcodes.includes(opcode))){
				return [];
			}
			//Iterate: Set next to curBlock
			curBlockID = nextID;
		}     
		return script;        
	},
	
	//given list of blocks and a keyID of a block, return a script
	makeScript: function(blocks, blockID){
		if (this.no(blocks) || this.no(blockID)) return [];
		event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
		loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
		
		var curBlockID = blockID;
		var script = [];
	
		//find all blocks that come before
		while(curBlockID != null){
			var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
			script.push(curBlockInfo); //Add the block itself to the script dictionary 
			
			//Get parent info out
			var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
			//parentInfo = blocks[parentID]
		var opcode = curBlockInfo['opcode'];

			
			//extract nested children if loop block
			if(loop_opcodes.includes(opcode)){
				var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
				if(innerloop != undefined){
					var nested_blocks = this.loopExtract(blocks, innerloop)
					for(b in nested_blocks){
						script.push(nested_blocks[b])
					}
				}
			}
			
			//If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
			if ((parentID == null) && !(event_opcodes.includes(opcode))){
				return [];
			}

			//Iterate: set parent to curBlock
			curBlockID = parentID
		}

		//find all blocks that come after
		curBlockID = blocks[blockID]['next']
		while(curBlockID != null){
			curBlockInfo = blocks[curBlockID]; //Pull out info about the block

			//nextInfo = blocks[nextID]
			opcode = curBlockInfo['opcode'];
			
			//extract nested children if loop block
			if(loop_opcodes.includes(opcode)){
				var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
				if(innerloop != undefined){
					var nested_blocks = this.loopExtract(blocks, innerloop)
					for(b in nested_blocks){                            
						script.push(nested_blocks[b])
					}
				}
			}

			//Get next info out
			nextID = curBlockInfo['next']; //Block that comes after has key 'next'
	
			//If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
			if((nextID == null) && (event_opcodes.includes(opcode))){
				return [];
			}
			script.push(curBlockInfo); //Add the block itself to the script dictionary                
			//Iterate: Set next to curBlock
			curBlockID = nextID;
		}
		return script;
	}
};

class GradeOneWaySyncL1 {

	constructor() {
		this.requirements = {};
		this.extensions = {};
	}

	initReqs() { //initialize all metrics to false
		this.requirements = {

			oneToOne: 
				{bool:false, str:'Djembe passes unique message to Mali child'},
			djembePlays: 
				{bool: false, str: 'When Djembe is clicked, Djembe plays music'},
			djembeToChild: 
				{bool: false, str: 'When Djembe is clicked, Mali child dances'},
			startButton: 
				{bool: false, str: 'Start button sprite created'},
			oneToMany: 
				{bool: false, str: 'Start button passes the same message to all other sprites'},
			startToDjembe: 
				{bool: false, str: 'When start button is clicked, Djembe plays music'},
			startToFlute: 
				{bool: false, str: 'When start button is clicked, Flute plays music'},
			startToMaliChild: 
				{bool: false, str: 'When start button is clicked, Mali child dances'},
			startToNavajoChild: 
				{bool: false, str: 'When start button is clicked, Navajo child dances'}
		};
	}
	initExts() {
		this.extensions = {
			changeWait: 
				{bool: false, str: 'Changed the duration of a wait block'},
			sayBlock: 
				{bool: false, str: 'Added a say block under another event'}
		}
	}

	grade(fileObj, user) { //call to grade project //fileobj is 
		this.initReqs();
		this.initExts();
		var sprites = {'Navajo Flute': null, 'Navajo child': null, 'Mali Djembe': null, 'Mali child': null};
		const targets = fileObj.targets;
		var spriteIsButton = true;
		
		// creates object of sprites, first non-default one is marked as the start button
		for (var target of targets) {
			if (target.isStage) {
				continue;
			}
			if (target.name in sprites) {
				sprites[target.name] = target;
			} else if (spriteIsButton) {
				sprites['Start Button'] = target;
				spriteIsButton = false;
			}
		}
		this.checkDjembeBroadcast(sprites)
		this.checkStartBroadcast(sprites);
		sprites = Object.values(sprites).filter(sprite => sprite != null);
		this.checkSayOnEvent(sprites);
		this.checkChangeWait(sprites);
	}

	/*
	 * Returns an array of two booleans:
	 *   whether the sprite received the message
	 *   whether it is playing a sound
	 */
	broadcastToPlay(sprite, message) {
		if (sb3.no(sprite)) {
			return;
		}
		var receivesMessage = false;
		const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

		if(whenReceiveBlocks) {
			for(var whenReceiveBlock of whenReceiveBlocks) {
				var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);

				if (script[0].fields.BROADCAST_OPTION[0] == message) {
					receivesMessage = true;
					for (var block of script) {
						if (['sound_play', 'sound_playuntildone'].includes(block.opcode)) {
							return [receivesMessage, true];
						}
					}
				}
			}
		}
		return [receivesMessage, false];
	}

	/* 
	 * Returns an array of two booleans:
	 *   whether the sprite received the message
	 *   whether it is dancing
	 */
	broadcastToDance(sprite, message) {
		if (sb3.no(sprite)) {
			return;
		}
		// if costume change and waitblock within a repeat loop, the sprite is dancing
		var animation = {constume: false, wait: false};
		var receivesMessage = false;

		const whenReceiveBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');

		if (whenReceiveBlocks) {
			for(var whenReceiveBlock of whenReceiveBlocks) {
				var script = sb3.makeScript(sprite.blocks, whenReceiveBlock);

				if (script[0].fields.BROADCAST_OPTION[0] == message) {
					receivesMessage = true;

					for (var block of script) {
							if (block.opcode == 'control_repeat') {

							var sblock = block.inputs.SUBSTACK[1];
							while(sblock != null) {
								const sblockInfo = sprite.blocks[sblock];
								switch(sblockInfo.opcode) {
									case 'looks_switchcostumeto':
									case 'looks_nextcostume': {
										animation.costume = true;
										break;
									}
									case 'control_wait': {

										animation.wait = true;
									}
								}
								sblock = sblockInfo.next;
							}
						}
					}
				}
			}
		}
		return [receivesMessage, animation.costume && animation.wait];
	}

	/* Checks first part of lesson, whether djembe broadcasts to child */
	checkDjembeBroadcast({ 'Mali Djembe': djembe = null, 'Mali child': child = null}) {
		if (!djembe) return;
		
		var messageSent = false;
		var messageName = "";
		var djembePlaysDirectly = false;

		var whenClickedBlocks = sb3.findBlockIDs(djembe.blocks, 'event_whenthisspriteclicked');

		if(whenClickedBlocks) {
			for(var whenClickedBlock of whenClickedBlocks) {
				var script = sb3.makeScript(djembe.blocks, whenClickedBlock);
				for(var block of script){
					switch(block.opcode) {
						case 'sound_play':
						case 'sound_playuntildone': {
							djembePlaysDirectly = true;
							break;
						}
						case 'event_broadcast':
						case 'event_broadcastandwait': {
							messageSent = true;
							messageName = block.inputs.BROADCAST_INPUT[1][1];
						}
					} 
				}
			}  
			
			const [, djembePlaysBroadcast] = this.broadcastToPlay(djembe, messageName);
			// djembe can be played directly when sprite is clicked, or it can send a message to itself
			this.requirements.djembePlays.bool = djembePlaysDirectly || djembePlaysBroadcast;
		}
		// if message was sent, check if it was received and produced the desired result
		if (messageSent) {
			if (!child) 
				return;

			const [childReceives, childDances] = this.broadcastToDance(child, messageName);
			// checks whether the child receives the message and whether it is unique
			this.requirements.oneToOne.bool = childReceives && (messageName != 'Navajo');
			this.requirements.djembeToChild.bool = childDances;
		}
	}

	/* Checks second part of lesson, the creation and broadcasting of start sprite */
	checkStartBroadcast({ 'Mali Djembe': djembe, 
											  'Mali child': maliChild, 
											  'Navajo Flute': flute, 
											  'Navajo child': navajoChild, 
											  'Start Button': start = null }) {
		if (!start) {
			return;
		}

		this.requirements.startButton.bool = true;

		var messageSent = false;
		var messageName = "";
		var whenClickedBlocks = sb3.findBlockIDs(start.blocks, 'event_whenthisspriteclicked');

		if(whenClickedBlocks) {
			for(var whenClickedBlock of whenClickedBlocks) {
				var script = sb3.makeScript(start.blocks, whenClickedBlock);
				for(var block of script){
					if(['event_broadcast', 'event_broadcastandwait'].includes(block.opcode)) {
						messageSent = true;
						messageName = block.inputs.BROADCAST_INPUT[1][1];
					} 
				}
			}
		}
		// if message was sent, check if it was received and if it produced the desired results
		if(messageSent) {
			var receives = Array(4).fill(false);
			
			if (djembe) 
				[receives[0], this.requirements.startToDjembe.bool] = this.broadcastToPlay(djembe, messageName);
			if (flute)
				[receives[1], this.requirements.startToFlute.bool] = this.broadcastToPlay(flute, messageName);
			if (maliChild) 
				[receives[2], this.requirements.startToMaliChild.bool] = this.broadcastToDance(maliChild, messageName);
			if (navajoChild)
				[receives[3], this.requirements.startToNavajoChild.bool] = this.broadcastToDance(navajoChild, messageName);
				
			// if all sprites receive the same message, this requirement is satisfied
			if (djembe && flute && maliChild && navajoChild) 
				this.requirements.oneToMany.bool = receives.every(received => received === true);
		}
	}
	checkSayOnEvent(sprites) {
		if (sb3.no(sprites)) {
			return;
		}

		const eventOpcodes = [
			'event_whenflagclicked', 'event_whenthisspriteclicked','event_whenkeypressed', 
			'event_whenbackdropswitchesto','event_whengreaterthan'
		];
			
		for (const sprite of sprites) {
			var eventBlocks = [];
			for(const block in sprite.blocks){ 
				const blockInfo = sprite.blocks[block];
				if(eventOpcodes.includes(blockInfo.opcode)){

					eventBlocks.push(block);
				}
			}

			for (const eventBlock of eventBlocks) {
				const script = sb3.makeScript(sprite.blocks, eventBlock);
				for (const block of script) {
					if (['looks_say', 'looks_sayforsecs'].includes(block.opcode)) {
						this.extensions.sayBlock.bool = true;
						return;
					}
				}
			}
		}
	}

	checkChangeWait(sprites) {
		if (sb3.no(sprites)) {
			return;
		}

		for (const sprite of sprites) {
			const whenReceivedBlocks = sb3.findBlockIDs(sprite.blocks, 'event_whenbroadcastreceived');
			for (const whenReceivedBlock of whenReceivedBlocks) {
				const script = sb3.makeScript(sprite.blocks, whenReceivedBlock);
				for (const block of script) {

					if (block.opcode == 'control_wait') {

						if (block.inputs.DURATION[1][1] != .5) {
							this.extensions.changeWait.bool = true;
						}
					}
				}
			}
		}
	}
}

module.exports = GradeOneWaySyncL1;
},{}],21:[function(require,module,exports){
/* Scratch Basics L1 Autograder
Scratch 2 (original) version: Max White, Summer 2018
Scratch 3 updates: Elizabeth Crowdus, Spring 2019
*/

var sb3 = {
    //null checker
    no: function(x) { 
        return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
    },

    //retrieve a given sprite's blocks from JSON
    //note: doesn't check whether or not blocks are properly attached
    jsonToSpriteBlocks: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        var allBlocks={};
        var blocks={};
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i]['blocks'];
            }
        }
        return [];
    }, //done
    
    //retrieve a given sprite's info (not just blocks) from JSON
    jsonToSprite: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return [];
    }, //done
    
    //counts the number of non-background sprites in a project
    countSprites: function(json){
        if (this.no(json)) return false; //make sure script exists
        
        var numSprites = 0;
        var projInfo = json['targets'] //extract targets from JSON data
        
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['isStage'] == false){
                numSprites ++;
            }
        }
        return numSprites
    },
    
    //looks through json to see if a sprite with a given name is present
    //returns true if sprite with given name found
    findSprite: function(json, spriteName){ 
        if (this.no(json)) return false; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return true;
            }
        }
        return false;
    }, //done
    
    //returns list of block ids given a set of blocks
    findBlockIDs: function(blocks, opcode){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                blockids.push(block);
            }
        }
        return blockids;
    },
    
    //given particular key, returns list of block ids of a certain kind of key press given a set of blocks 
    findKeyPressID: function(blocks, key){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == 'event_whenkeypressed'){
                if(blocks[block]['fields']['KEY_OPTION'][0] == key){
                    blockids.push(block);
                }
            }
        }
        return blockids;
    },
    
    opcodeBlocks: function(script, myOpcode) { //retrieve blocks with a certain opcode from a script list of blocks
        if (this.no(script)) return [];
        
        var miniscript = [];

        for(block in script){
            if(script[block]['opcode'] == myOpcode){
                miniscript.push(script[block]);
            }
        }
        return miniscript;
    }, 
    
    opcode: function(block) { //retrives opcode from a block object 
        if (this.no(block)) return "";
        return block['opcode'];
    }, 
    
    countBlocks: function(blocks,opcode){ //counts number of blocks with a given opcode
        var total = 0;
		for(id in blocks){ 
            if([blocks][id]['opcode'] == opcode){
                total = total + 1;
            }
        }
        return total;
    }, //done
    
    //(recursive) helper function to extract blocks inside a given loop
    //works like makeScript except it only goes down the linked list (rather than down & up)
    loopExtract: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];

        //Find all blocks that come after
        curBlockID = blockID //Initialize with blockID of interest
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary                

            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.makeScript(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }     
        return script;        
    },
    
    //given list of blocks and a keyID of a block, return a script
    makeScript: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];
    
        //find all blocks that come before
        while(curBlockID != null){
            var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary 
            
            //parentInfo = blocks[parentID]
    		var opcode = curBlockInfo['opcode'];

            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            
            //If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
            if ((parentID == null) && !(event_opcodes.includes(opcode))){
                return [];
            }

            //Iterate: set parent to curBlock
            curBlockID = parentID
        }

        //find all blocks that come after
        curBlockID = blocks[blockID]['next']
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block

            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){                            
                        script.push(nested_blocks[b])
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
            
            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            script.push(curBlockInfo); //Add the block itself to the script dictionary                
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }
        return script;
    }
};

class GradeScratchBasicsL1 {

    constructor() {
        this.requirements = {};
    }

    grade(fileObj, user) { //call to grade project //fileobj is 
        this.initMetrics();
        
        var fred  = sb3.jsonToSpriteBlocks(fileObj, 'Fred'); 
        var helen = sb3.jsonToSpriteBlocks(fileObj, 'Helen');
        this.checkFred(fred);
        this.checkHelen(helen);  
    }

    initMetrics() { //initialize all metrics to false
        this.requirements = {
            changedSteps: {
                bool: false, str: 'Fred takes 100 steps each time he talks instead of 50.'
            },
            fredTalks: {
                bool: false, str: 'Fred uses a new block to say "Have fun!" to the user.'
            },
            timeChanged: {
                bool: false, str: 'Changed time between Helen\'s costume changes.'
            }
        };

    }

    checkFred(fred) {
        if (!fred) return;
        
        var stepcount = 0;
        var speakcount = 0;
        var havefun = false;
        var funs = ['Have fun!', 'have fun!', 'have Fun!', 'HAVE FUN', 'HAVE FUN!', 'have fun', 'Have fun', 'have Fun', 'Have Fun', 'Have Fun!']
        
        var blockids = sb3.findBlockIDs(fred, 'event_whenflagclicked');
        
        if(blockids != null){
            for(var block of blockids){
                var script = sb3.makeScript(fred, block)
                for(var sblock of script){
                    if(sblock['opcode'] == 'motion_movesteps' && sblock['inputs']['STEPS'][1][1] == 100){
                        stepcount++;
                        if(stepcount >= 3){
                            this.requirements.changedSteps.bool = true;
                        }
                    }
                    if (sblock['opcode'] == 'looks_sayforsecs'){ 
                        speakcount++;
                        if(funs.includes(sblock['inputs']['MESSAGE'][1][1])){ //check for have fun message
                            havefun = true;
                        }
                        if(havefun && speakcount >= 4){ //check that new block was added
                            this.requirements.fredTalks.bool = true;
                        }
                    }  
                }
            }  
        }
        this.requirements.usesTheThreeEvents.bool = (reqEvents.length === 3);
        this.requirements.hasThreeSprites.bool = (project.targets.length - 1 >= 3);
        
    }

    checkHelen(helen) {
        if (!helen) return;
        
        var blockids = sb3.findBlockIDs(helen, 'event_whenkeypressed');
        
        for(var block of blockids){
            var script = sb3.makeScript(helen, block)

            for(var sblock of script){
                if(sblock['opcode'] == 'control_wait' && sblock['inputs']['DURATION'][1][1] > 1){
                    this.requirements.timeChanged.bool = true
                    return
                }
            }
        }  
    }
}


module.exports = GradeScratchBasicsL1;
},{}],22:[function(require,module,exports){
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
            "looks_costume", 
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
},{"./scratch3":23}],23:[function(require,module,exports){
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
    constructor(target, block) {
        Object.assign(this, target.blocks[block]);
        this.id = block;
        this.context = new Context(target.context, false);
        this.target = target;
        this.subscripts = this.subScripts();
    }

    /// Internal function that converts a block to a Block.
    toBlock(x) {
        return new Block(this.target, x);
    }

    /// Returns the next block in the script.
    nextBlock() {
        if (no(this.next)) return null;

        return this.toBlock(this.next);
    }

    /// Returns the previous block in the script.
    prevBlock() {
        if (no(this.parent)) return null;

        return this.toBlock(this.parent);
    }

    /// Returns the conditional statement of the block, if it exists.
    conditionBlock() {
        if (no(this.inputs.CONDITION)) return null;
        return this.toBlock(this.inputs.CONDITION[1]);
    }

    /// Returns an array representing the script that contains the block.
    childBlocks() {
        var array = [];
        var x = this;
        while (x) {
            array.push(x);
            x = x.nextBlock();
        }
        return array;
    }

    /// Returns an array of Scripts representing the subscripts of the block.
    subScripts() {
        if (no(this.inputs)) return [];
        var array = [];

        if (is(this.inputs.SUBSTACK) && is(this.inputs.SUBSTACK[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK[1]), this.target));
        }
        if (is(this.inputs.SUBSTACK2) && is(this.inputs.SUBSTACK2[1])) {
            array.push(new Script(this.toBlock(this.inputs.SUBSTACK2[1]), this.target));
        }
        return array;
    }
}

/// Container class for Scratch scripts.
global.Script = class {
/// Pass this a Block object!
    constructor(block, target) {
        this.blocks  = block.childBlocks();
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./context":15}],24:[function(require,module,exports){
var sb3 = {
    //null checker
    no: function(x) { 
        return (x == null || x == {} || x == undefined || !x || x == '' | x.length === 0);
    },

    //retrieve a given sprite's blocks from JSON
    //note: doesn't check whether or not blocks are properly attached
    jsonToSpriteBlocks: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        var allBlocks={};
        var blocks={};
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i]['blocks'];
            }
        }
        return [];
    }, //done
    
    //retrieve a given sprite's info (not just blocks) from JSON
    jsonToSprite: function(json, spriteName) { 
        if (this.no(json)) return []; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return [];
    }, //done
    
    //counts the number of non-background sprites in a project
    countSprites: function(json){
        if (this.no(json)) return false; //make sure script exists
        
        var numSprites = 0;
        var projInfo = json['targets'] //extract targets from JSON data
        
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['isStage'] == false){
                numSprites ++;
            }
        }
        return numSprites
    },
    
    //looks through json to see if a sprite with a given name is present
    //returns sprite
    returnSprite: function(json, spriteName){ 
        if (this.no(json)) return; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return projInfo[i];
            }
        }
        return ;
    }, //done
    
    //looks through json to see if a sprite with a given name is present
    //returns true if sprite with given name found
    findSprite: function(json, spriteName){ 
        if (this.no(json)) return false; //make sure script exists

        var projInfo = json['targets'] //extract targets from JSON data
        
        //find sprite
        for(i=0; i <projInfo.length; i++){
            if(projInfo[i]['name'] == spriteName){
                return true;
            }
        }
        return false;
    }, //done
    
    //returns list of block ids given a set of blocks
    findBlockIDs: function(blocks, opcode){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == opcode){
                blockids.push(block);
            }
        }
        return blockids;
    },
    
    //given particular key, returns list of block ids of a certain kind of key press given a set of blocks 
    findKeyPressID: function(blocks, key){
        if(this.no(blocks) || blocks == {}) return [];
        
        var blockids = [];
        
        for(block in blocks){ 
            if(blocks[block]['opcode'] == 'event_whenkeypressed'){
                if(blocks[block]['fields']['KEY_OPTION'][0] == key){
                    blockids.push(block);
                }
            }
        }
        return blockids;
    },
    
    opcodeBlocks: function(script, myOpcode) { //retrieve blocks with a certain opcode from a script list of blocks
        if (this.no(script)) return [];
        
        var miniscript = [];

        for(block in script){
            if(script[block]['opcode'] == myOpcode){
                miniscript.push(script[block]);
            }
        }
        return miniscript;
    }, 
    
    opcode: function(block) { //retrives opcode from a block object 
        if (this.no(block)) return "";
        return block['opcode'];
    }, 
    
    countBlocks: function(blocks,opcode){ //counts number of blocks with a given opcode
        var total = 0;
		for(id in blocks){ 
            if([blocks][id]['opcode'] == opcode){
                total = total + 1;
            }
        }
        return total;
    }, //done
    
    //(recursive) helper function to extract blocks inside a given loop
    //works like makeScript except it only goes down the linked list (rather than down & up)
    loopExtract: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];

        //Find all blocks that come after
        curBlockID = blockID //Initialize with blockID of interest
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary                

            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.makeScript(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }     
        return script;        
    },
    
    //given list of blocks and a keyID of a block, return a script
    makeScript: function(blocks, blockID){
        if (this.no(blocks) || this.no(blockID)) return [];
        event_opcodes = ['event_whenflagclicked', 'event_whenthisspriteclicked','event_whenbroadcastreceived','event_whenkeypressed', 'event_whenbackdropswitchesto','event_whengreaterthan'];
        loop_opcodes = ['control_repeat', 'control_forever', 'control_if', 'control_if_else', 'control_repeat_until'];
        
        var curBlockID = blockID;
        var script = [];
    
        //find all blocks that come before
        while(curBlockID != null){
            var curBlockInfo = blocks[curBlockID]; //Pull out info about the block
            script.push(curBlockInfo); //Add the block itself to the script dictionary 
            
            //Get parent info out
            var parentID = curBlockInfo['parent']; //Block that comes before has key 'parent'
            //parentInfo = blocks[parentID]
    		var opcode = curBlockInfo['opcode'];

            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){
                        script.push(nested_blocks[b])
                    }
                }
            }
            
            //If the block is not part of a script (i.e. it's the first block, but is not an event), return empty dictionary
            if ((parentID == null) && !(event_opcodes.includes(opcode))){
                return [];
            }

            //Iterate: set parent to curBlock
            curBlockID = parentID
        }

        //find all blocks that come after
        curBlockID = blocks[blockID]['next']
        while(curBlockID != null){
            curBlockInfo = blocks[curBlockID]; //Pull out info about the block

            //Get next info out
            nextID = curBlockInfo['next']; //Block that comes after has key 'next'
            //nextInfo = blocks[nextID]
            opcode = curBlockInfo['opcode'];
            
            //extract nested children if loop block
            if(loop_opcodes.includes(opcode)){
                var innerloop = curBlockInfo['inputs']['SUBSTACK'][1]
                if(innerloop != undefined){
                    var nested_blocks = this.loopExtract(blocks, innerloop)
                    for(b in nested_blocks){                            
                        script.push(nested_blocks[b])
                    }
                }
            }
		
            //If the block is not a script (i.e. it's an event but doesn't have anything after), return empty dictionary
            if((nextID == null) && (event_opcodes.includes(opcode))){
                return [];
            }
            script.push(curBlockInfo); //Add the block itself to the script dictionary                
            //Iterate: Set next to curBlock
            curBlockID = nextID;
        }
        return script;
    }
};

/// Max White
class GradeTwoWaySyncL1 {

    constructor() {
        this.requirements = {};
    }

    grade(fileObj, user) {
        this.initMetrics();
        this.checkSync(fileObj);
    }

    initMetrics() {
        this.requirements = {
            isDialogueSynced: {
                bool: true, str: 'Text messages are correctly synchronized.'
            },
            areMessagesAdded: {
                bool: false, str: 'One additional text message has been added to each sprite.'
            }
        };
        this.extensions = {
            evenMoreMessages: {
                bool: false, str: 'Added more than one additional text message to each sprite.'
            },
            changedSounds: {
                bool: false, str: 'Changed the "boing" or "pop" sound to something else.'
            },
        }
    }

    checkSync(fileObj) {

        /// Find the relevant sprites for this project.
        var basketball = fileObj.targets.find(function(target) {
            return target.name === 'Basketball';
        });
        var rainbow = fileObj.targets.find(function(target) {
            return target.name === 'Rainbow';
        });
        if (basketball === undefined || rainbow === undefined) {
            /// TODO: Signal a mistake
            return;
        }

        /// Iterate through the basketball's scripts and note the times (in seconds) at which it speaks.
        var basketballTime = 0;
        var basketballThinkTimes = [];
        var blockIDs = sb3.findBlockIDs(basketball.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(basketball.blocks, blockID);
                basketballTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        basketballTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        basketballThinkTimes.push(basketballTime);
                        basketballTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// Do the same for the rainbow.
        var rainbowTime = 0;
        var rainbowThinkTimes = [];
        blockIDs = sb3.findBlockIDs(rainbow.blocks, 'event_whenflagclicked');
        if (blockIDs !== null) {
            for (var blockID of blockIDs) {
                var script = sb3.makeScript(rainbow.blocks, blockID);
                rainbowTime = 0;
                for (var block of script) {
                    if (block.opcode === 'control_wait') {
                        rainbowTime += parseInt(block.inputs.DURATION[1][1]);
                    }
                    if (block.opcode === 'looks_thinkforsecs') {
                        rainbowThinkTimes.push(rainbowTime);
                        rainbowTime += parseInt(block.inputs.SECS[1][1]);
                    }
                }
            }
        }

        /// We can check now if enough (or extra) messages have been added.
        var basketballThoughts = basketballThinkTimes.length;
        var rainbowThoughts = rainbowThinkTimes.length;
        this.requirements.areMessagesAdded.bool = (basketballThoughts > 1) && (rainbowThoughts > 1);
        this.extensions.evenMoreMessages.bool = (basketballThoughts > 2) && (rainbowThoughts > 2);

        /// Now we can see if the dialogue is synced by comparing the thinkTime arrays. The basketball goes first.
        if (!basketballThoughts || !rainbowThoughts) this.requirements.isDialogueSynced.bool = false;
        for (var i = 0; i < basketballThoughts && i < rainbowThoughts; i++) {
            if (basketballThinkTimes[i] >= rainbowThinkTimes[i]) {
                this.requirements.isDialogueSynced.bool = false;
            }
        }

        /// Finally, we check if there are any sounds aside from 'boing' or 'pop.'
        var sprites = [basketball, rainbow];
        for (var sprite of sprites) {
            if (sprite.sounds != null) {
                for (var sound of sprite.sounds) {
                    if (sound.name !== 'boing' && sound.name !== 'pop') {
                        this.extensions.changedSounds.bool = true;
                    }
                }
            }
        }
    }
}

module.exports = GradeTwoWaySyncL1;
},{}],25:[function(require,module,exports){
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
  oneWaySyncL2:    { name: 'Two-Way Sync L2',        file: require('./grading-scripts-s3/two-way-sync-L2')   },
};

// act 1 graders
var actOneGraders = {
  namePoem:       { name: 'Name Poem',               file: require('./act1-grading-scripts/name-poem')       },
  ladybug:        { name: 'Ladybug Challenge',       file: require('./act1-grading-scripts/ladybug')         },
  fiveBlockChallenge: { name: 'Five Block Challenge', file: require('./act1-grading-scripts/5-block-challenge')},
  ofrenda:       { name: 'Ofrenda',                  file: require('./act1-grading-scripts/ofrenda')         },
  aboutMe:        { name: 'About Me',                file: require('./act1-grading-scripts/aboutMe')          },
  buildABand:     { name: 'Build A Band',            file: require('./act1-grading-scripts/build-a-band')     },
  finalProject:   { name: 'Interactive Story',       file: require('./act1-grading-scripts/final-project')    },
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
},{"./act1-grading-scripts/5-block-challenge":1,"./act1-grading-scripts/aboutMe":2,"./act1-grading-scripts/build-a-band":3,"./act1-grading-scripts/final-project":4,"./act1-grading-scripts/ladybug":5,"./act1-grading-scripts/name-poem":7,"./act1-grading-scripts/ofrenda":8,"./grading-scripts-s3/animation-L1":11,"./grading-scripts-s3/animation-L2":12,"./grading-scripts-s3/cond-loops-L1":13,"./grading-scripts-s3/cond-loops-L2":14,"./grading-scripts-s3/decomp-L1":16,"./grading-scripts-s3/decomp-L2":17,"./grading-scripts-s3/events-L1":18,"./grading-scripts-s3/events-L2":19,"./grading-scripts-s3/one-way-sync-L1":20,"./grading-scripts-s3/scratch-basics-L1":21,"./grading-scripts-s3/scratch-basics-L2":22,"./grading-scripts-s3/two-way-sync-L2":24}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],29:[function(require,module,exports){
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
},{"./support/isBuffer":28,"_process":26,"inherits":27}]},{},[25]);
