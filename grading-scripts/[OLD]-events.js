class GradeEvents {

    constructor() {
        this.requirements = {};
    }

    initReqs() {
        this.requirements.containsTwoSprites  = 
        this.requirements.greenFlagHandled    =
        this.requirements.spriteClickHandled  =
        this.requirements.keyPressHandled     =
        this.requirements.spriteSaysSomething =
        this.requirements.spriteChangesSize   =
        this.requirements.spriteResetsSize    = false;
    }

    grade(fileObj, user) {
        this.initReqs();

        var pID = fileObj.info.projectID;

        var sprites    = fileObj.children;
        var numSprites = sprites.length;
        var numScripts = 0;
        var numBlocks  = 0;

        for (var i = 0; i < sprites.length; i++) {
            var scripts = sprites[i].scripts;
            if(!scripts) continue;
            for (var j = 0; j < scripts.length; j++) {
                numScripts++;
                numBlocks += scripts[j][2].length;
            }
        }

        var avgScriptLen = 0;
        if (numScripts !== 0) avgScriptLen = numBlocks / numScripts;

        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.hasOwnProperty('objName')) { /// checks if actually a sprite
                this.checkScripts(sprite);
            }
        }

        this.requirements.containsTwoSprites = fileObj.info.spriteCount > 1;
    }

    isValidEvent(event) {
        var validEvents = ['whenGreenFlag', 'whenClicked', 'whenKeyPressed'];
        return validEvents.includes(event);
    }

    checkScripts(sprite) {
        var block;
        if(!sprite.scripts) return;
        for (var i = 0; i < sprite.scripts.length; i++) {

            var script = sprite.scripts[i][2];
            var event  = script[0][0];
            
            if (script.length > 1 && this.isValidEvent(event)) {

                if (event === 'whenGreenFlag')  this.requirements.greenFlagHandled   = true;
                if (event === 'whenClicked')    this.requirements.spriteClickHandled = true;
                if (event === 'whenKeyPressed') this.requirements.keyPressHandled    = true;

                for (var j = 1; j < script.length; j++) {
                    block = script[j][0];
                    if (['say:', 'say:duration:elapsed:from:'].includes(block))
                        this.requirements.spriteSaysSomething = true;
                    if (block === 'changeSizeBy:')
                        this.requirements.spriteChangesSize = true;
                    if (block === 'setSizeTo:' && event === 'whenGreenFlag')
                        this.requirements.spriteResetsSize = true;

                }
            }
        }
    }
    
}