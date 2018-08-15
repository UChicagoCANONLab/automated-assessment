/// Grader for Events.Multicultural.L1
/// Max White
///////////////////////////////////////////////////////////////////////////////

class GradeEvents {

    constructor() {
        this.requirements = {};
    }

    initReqs() {

        this.requirements.containsThreeSprites =    /// contains >= 3 sprites
        /// Sprite 1
        this.requirements.sprite1WhenClicked   =    /// sprite handles click
        this.requirements.sprite1GetsBigger    =    /// sprite grows...
        this.requirements.sprite1TalksTwice    =    /// then >= 2 say blocks...
        this.requirements.sprite1ResetsSize    =    /// then resets size
        /// Sprite 2
        this.requirements.sprite2WhenClicked   =    /// ditto
        this.requirements.sprite2GetsBigger    =
        this.requirements.sprite2TalksTwice    =
        this.requirements.sprite2ResetsSize    =
        /// Sprite 3
        this.requirements.sprite2WhenClicked   =
        this.requirements.sprite3GetsBigger    =
        this.requirements.sprite3TalksTwice    =
        this.requirements.sprite3ResetsSize    = false;

    }

    checkScripts(sprite) {
        
        var finalResults         = {};
        finalResults.whenClicked =
        finalResults.getsBigger  =
        finalResults.resetsSize  =
        finalResults.talksTwice  = false;
        finalResults.score       = -1;
        if (!sprite.hasOwnProperty('scripts')) return finalResults;

        for (var script of sprite.scripts) {

            /// Initialize for each script
            var results         = {};
            results.whenClicked =
            results.getsBigger  =
            results.resetsSize  =
            results.talksTwice  = false;
            results.score       = 0;

            var initialSize = sprite.scale;
            var newSize     = initialSize;
            var sayCount    = 0;

            /// Check script if it has 'whenClicked' event
            if (script.length > 1 && script[2][0][0] === 'whenClicked') {
                results.whenClicked = true;
                for (var block of script[2]) {

                    var blockName = block[0];

                    /// Check for changing size
                    if (blockName === 'changeSizeBy:')
                        newSize += block[1] / 100;

                    if (blockName === 'setSizeTo:')
                        newSize = block[1] / 100;

                    if (newSize > initialSize)
                        results.getsBigger = true;

                    if (results.getsBigger && newSize === initialSize)
                        results.resetsSize = true;

                    /// Count say blocks in script WHILE sprite is bigger
                    if (results.getsBigger  &&
                        !results.resetsSize &&
                        ['say:',
                         'say:duration:elapsed:from:'].includes(blockName))
                        sayCount++;
                }
            }

            /// Summarize results into object      
            results.talksTwice = sayCount > 1;
            results.score = results.getsBigger +
                            results.resetsSize +
                            results.talksTwice +
                            results.whenClicked;

            if (results.score > finalResults.score) finalResults = results;
        }

        /// Return results from most complete script          
        return finalResults;

    }

    grade(fileObj, user) {

        this.initReqs();
        this.requirements.containsThreeSprites = fileObj.info.spriteCount > 2;

        /// Build array of results objects
        var resultsArr = [];
        for (var child of fileObj.children) {
            if (child.hasOwnProperty('objName')) {
                var results = this.checkScripts(child);
                resultsArr.push(results);
            }
        }

        /// Sort resultsArr to display the most complete scripts first
        resultsArr.sort(function(a, b) {
            return b.score - a.score;
        })

        /// Pull requirements from head of resultsArr

        /// Sprite 1
        if(resultsArr[0]) {
            this.requirements.sprite1WhenClicked = resultsArr[0].whenClicked;
            this.requirements.sprite1GetsBigger  = resultsArr[0].getsBigger;
            this.requirements.sprite1TalksTwice  = resultsArr[0].talksTwice;
            this.requirements.sprite1ResetsSize  = resultsArr[0].resetsSize;
        }
        /// Sprite 2
        if(resultsArr[1]) {
            this.requirements.sprite2WhenClicked = resultsArr[1].whenClicked;
            this.requirements.sprite2GetsBigger  = resultsArr[1].getsBigger;
            this.requirements.sprite2TalksTwice  = resultsArr[1].talksTwice;
            this.requirements.sprite2ResetsSize  = resultsArr[1].resetsSize;
        }
        /// Sprite 3
        if(resultsArr[2]) {
            this.requirements.sprite3WhenClicked = resultsArr[2].whenClicked;
            this.requirements.sprite3GetsBigger  = resultsArr[2].getsBigger;
            this.requirements.sprite3TalksTwice  = resultsArr[2].talksTwice;
            this.requirements.sprite3ResetsSize  = resultsArr[2].resetsSize;
        }

    }
}