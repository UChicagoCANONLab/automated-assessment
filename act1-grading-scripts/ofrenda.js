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