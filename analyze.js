
///////////////////////////////////////////////////////////////////////////////
/// student requirements for Events module

var req_containsTwoSprites  = false;
var req_greenFlagHandled    = false;
var req_spriteClickHandled  = false;
var req_keyPressHandled     = false;
var req_spriteSaysSomething = false;
var req_spriteChangesSize   = false;
var req_spriteResetsSize    = false;

///////////////////////////////////////////////////////////////////////////////
/// analyze JSON

function isValidEvent(event) {
    var validEvents = ['whenGreenFlag', 'whenClicked', 'whenKeyPressed'];
    return validEvents.includes(event);
}

function checkScripts(sprite) {
    for (var i = 0; i < sprite.scripts.length; i++) {

        var script = sprite.scripts[i][2];
        var event  = script[0][0];
        
        if (script.length > 1 && isValidEvent(event)) {

            if (event === 'whenGreenFlag')  req_greenFlagHandled   = true;
            if (event === 'whenClicked')    req_spriteClickHandled = true;
            if (event === 'whenKeyPressed') req_keyPressHandled    = true;

            for (var j = 1; j < script.length; j++) {
                block = script[j][0];
                if (['say:', 'say:duration:elapsed:from:'].includes(block))
                    req_spriteSaysSomething = true;
                if (block === 'changeSizeBy:')
                    req_spriteChangesSize = true;
                if (block === 'setSizeTo:' && event === 'whenGreenFlag')
                    req_spriteResetsSize = true;

            }
        }
    }
}

function analyze(fileObj) {
    var pID = fileObj.info.projectID;
    var sprites = fileObj.children;

    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        if (sprite.hasOwnProperty('objName')) { /// checks if actually a sprite
            checkScripts(sprite);
        }
    }

    req_containsTwoSprites = fileObj.info.spriteCount > 1;
    report(pID);
}

///////////////////////////////////////////////////////////////////////////////
/// report results

function checkbox(bool) {
    if (bool) return '✔️';
    else return '❌';
}

function report(pID) {

    appendText('Scratch Project ID: ' + pID);

    appendText(checkbox(req_containsTwoSprites) + 
        ' - Project contains at least two sprites');

    appendText(checkbox(req_greenFlagHandled) + 
        ' - Project handles [when green flag clicked] event');

    appendText(checkbox(req_spriteClickHandled) + 
        ' - Project handles [when this sprite clicked] event');

    appendText(checkbox(req_keyPressHandled) + 
        ' - Project handles [when _ key pressed] event');

    appendText(checkbox(req_spriteSaysSomething) +
        ' - Sprite says something in response to an event')

    appendText(checkbox(req_spriteChangesSize) +
        ' - Sprite changes size in response to an event')

    appendText(checkbox(req_spriteResetsSize) +
        ' - Sprite resets its size when green flag clicked')

    appendNewLine();

}

