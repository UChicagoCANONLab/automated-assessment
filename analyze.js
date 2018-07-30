/* Contains project analysis functions. */

/* Requirements dictionary. */
var grade_reqs = {};

/* Checks for correct event listener. */
function isValidEvent(event) {
    var validEvents = ['whenGreenFlag', 'whenClicked', 'whenKeyPressed'];
    return validEvents.includes(event);
}

/* Low-level analysis function, looks for expected scripts. */
function checkScripts(sprite) {
    /* Checks for no scripts */
    if(!sprite.scripts) {
        console.log(sprite);
        return;
    }
    for (var i = 0; i < sprite.scripts.length; i++) {

        var script = sprite.scripts[i][2];
        var event  = script[0][0];
        
        if (script.length > 1 && isValidEvent(event)) {

            if (event === 'whenGreenFlag')  grade_reqs.greenFlagHandled   = true;
            if (event === 'whenClicked')    grade_reqs.spriteClickHandled = true;
            if (event === 'whenKeyPressed') grade_reqs.keyPressHandled    = true;

            for (var j = 1; j < script.length; j++) {
                block = script[j][0];
                if (['say:', 'say:duration:elapsed:from:'].includes(block))
                    grade_reqs.spriteSaysSomething = true;
                if (block === 'changeSizeBy:')
                    grade_reqs.spriteChangesSize = true;
                if (block === 'setSizeTo:' && event === 'whenGreenFlag')
                    grade_reqs.spriteResetsSize = true;

            }
        }
    }
}

/* Top-level analysis function, checks for appropraite number of sprites
   and initializes script analysis. */
function analyze(fileObj) {
    grade_reqs.containsTwoSprites = false;
    grade_reqs.greenFlagHandled    = false;
    grade_reqs.spriteClickHandled  = false;
    grade_reqs.keyPressHandled     = false;
    grade_reqs.spriteSaysSomething = false;
    grade_reqs.spriteChangesSize   = false;
    grade_reqs.spriteResetsSize    = false;

    var pID = fileObj.info.projectID;
    var sprites = fileObj.children;

    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (sprite.hasOwnProperty('objName')) { /// checks if actually a sprite
            checkScripts(sprite);
        }
    }

    grade_reqs.containsTwoSprites = fileObj.info.spriteCount > 1;
    report(pID);
}


/* Returns pass/fail symbol. */
function checkbox(bool) {
    if (bool) return '✔️';
    else return '❌';
}

/* Reports results. */
function report(pID) {

    appendText('Scratch Project ID: ' + pID);

    appendText(checkbox(grade_reqs.containsTwoSprites) + 
        ' - Project contains at least two sprites');

    appendText(checkbox(grade_reqs.greenFlagHandled) + 
        ' - Project handles [when green flag clicked] event');

    appendText(checkbox(grade_reqs.spriteClickHandled) + 
        ' - Project handles [when this sprite clicked] event');

    appendText(checkbox(grade_reqs.keyPressHandled) + 
        ' - Project handles [when _ key pressed] event');

    appendText(checkbox(grade_reqs.spriteSaysSomething) +
        ' - Sprite says something in response to an event')

    appendText(checkbox(grade_reqs.spriteChangesSize) +
        ' - Sprite changes size in response to an event')

    appendText(checkbox(grade_reqs.spriteResetsSize) +
        ' - Sprite resets its size when green flag clicked')

    appendNewLine();

}

