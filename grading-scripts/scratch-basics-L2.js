class GradeScratchBasicsL2 {

    constructor() {
        this.requirements = {};
        this.extensions   = {};
    }

    init() {
        this.requirements = {
            changedBackdrop:
                {bool: false, str: 'Added a new backdrop.'},
            pickedSprite:
                {bool: false, str: 'Added a new sprite to the project.'},
            greenFlag:
                {bool: false, str: 'Created a script starting with the "when green flag clicked" block.'},
            goTo:
                {bool: false, str: 'Script uses the "go to x:_ y:_" block.'},
            say:
                {bool: false, str: 'Script uses at least 3 "say _ for _ secs" blocks.'},
            move:
                {bool: false, str: 'Script uses the "move _ steps" block.'}
        }
        this.extensions = {
            secondEvent:
                {bool: false, str: 'Added another script using the "when sprite clicked" or "when key pressed" event.'},
            newBlocks:
                {bool: false, str: 'Project includes new blocks you haven\'t used before.'},
            secondSprite:
                {bool: false, str: 'Added a second sprite with its own scripts.'}
        }
    }

    grade(fileObj, user) {
        this.init();
        this.checkBackdrop(fileObj); // changedBackdrop
        this.checkSprite(fileObj);   // pickedSprite
        this.checkScripts(fileObj);  // greenFlag, goTo, say, move, secondEvent, newBlocks, secondSprite
    }

    checkBackdrop(fileObj) {
        var backdrop = fileObj.costumes[fileObj.currentCostumeIndex];
        this.requirements.changedBackdrop.bool = (backdrop.costumeName !== 'backdrop1');
    }

    checkSprite(fileObj) {
        this.requirements.pickedSprite.bool = (fileObj.info.spriteCount > 0);
    }

    checkScripts(fileObj) {
        var defaultOpcodes = [
            'whenGreenFlag',
            'gotoX:y:',
            'forward:',
            'say:duration:elapsed:from:',
            'whenKeyPressed',
            'lookLike:',
            'doRepeat',
            'whenClicked'
        ];
        var spritesWithScripts = 0;

        for (var sprite of fileObj.children) {
            if (sprite.scripts) {
                if (sprite.scripts.length > 0) spritesWithScripts++;
                for (var script of sprite.scripts) {
                    if (this.scriptContains(script, 'whenGreenFlag')) {
                        this.requirements.greenFlag.bool = true;
                        if (this.scriptContains(script, 'gotoX:y:'))
                            this.requirements.goTo.bool  = true;
                        if (this.scriptContains(script, 'forward:'))
                            this.requirements.move.bool  = true;
                        var sayCount = 0;
                        for (var block of this.blocks(script)) {
                            if (this.opcode(block) === 'say:duration:elapsed:from:') sayCount++;
                            if (sayCount > 2) this.requirements.say.bool = true;
                        }
                    }

                    if (this.scriptContains(script, 'whenClicked') ||
                            this.scriptContains(script, 'whenKeyPressed'))
                        this.extensions.secondEvent.bool = true;

                    for (var block of this.blocks(script)) {
                        if (!defaultOpcodes.includes(this.opcode(block)))
                            this.extensions.newBlocks.bool = true;
                    }
                }
            }
        }

        this.extensions.secondSprite.bool = (spritesWithScripts > 1);
    }

    /// Helpers

    no(x) {
        return (x == null || x.length === 0);
    }

    blocks(script) {
        if (this.no(script)) return [];
        return script[2];
    }

    opcode(block) {
        if (this.no(block)) return "";
        return block[0];
    }

    eventScripts(sprite, myEvent) {
        if (this.no(sprite)) return [];
        return sprite.scripts.filter(script => this.hatCode(script) === myEvent);
    }

    opcodeBlocks(script, myOpcode) {
        if (this.no(this.blocks(script))) return [];
        return this.blocks(script).filter(block => this.opcode(block) === myOpcode);
    }

    scriptContains(script, myOpcode) {
        if (!script || script === undefined || !blocks(script)) return false;
        return this.blocks(script).some(block => this.opcode(block) === myOpcode);
    }

}