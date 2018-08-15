/// Grader for Events.Multicultural.L1
/// Max White
///////////////////////////////////////////////////////////////////////////////

class GradeEvents {

    constructor() {
        this.requirements = {};
    }

    initReqs() {

        this.requirements.containsThreeSprites =    /// contains >= 3 sprites
            {bool:false, str:'Project has at least three sprites.'};
        /// Sprite 1
        this.requirements.sprite1WhenClicked   =    /// sprite handles click
            {bool:false, str:'Sprite 1 handles click.'};
        this.requirements.sprite1GetsBigger    =    /// sprite grows...
            {bool:false, str:'Sprite 1 gets bigger.'};
        this.requirements.sprite1TalksTwice    =    /// then >= 2 say blocks...
            {bool:false, str:'Then Sprite 1 has at least two say blocks.'};
        this.requirements.sprite1ResetsSize    =    /// then resets size
            {bool:false, str:'The Sprite 1 resets size.'};
        /// Sprite 2
        this.requirements.sprite2WhenClicked   =    /// ditto
            {bool:false, str:'Sprite 2 handles click.'};
        this.requirements.sprite2GetsBigger    =
            {bool:false, str:'Sprite 2 gets bigger.'};
        this.requirements.sprite2TalksTwice    =
            {bool:false, str:'Then Sprite 2 has at least two say blocks.'};
        this.requirements.sprite2ResetsSize    =
            {bool:false, str:'The Sprite 2 resets size.'};
        /// Sprite 3
        this.requirements.sprite3WhenClicked   =
            {bool:false, str:'Sprite 3 handles click.'};
        this.requirements.sprite3GetsBigger    =
            {bool:false, str:'Sprite 3 gets bigger.'};
        this.requirements.sprite3TalksTwice    =
        {bool:false, str:'Then Sprite 3 has at least two say blocks.'};
        this.requirements.sprite3ResetsSize    = 
            {bool:false, str:'The Sprite 3 resets size.'};

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
        this.requirements.containsThreeSprites.bool = fileObj.info.spriteCount > 2;

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
            this.requirements.sprite1WhenClicked.bool = resultsArr[0].whenClicked;
            this.requirements.sprite1GetsBigger.bool  = resultsArr[0].getsBigger;
            this.requirements.sprite1TalksTwice.bool  = resultsArr[0].talksTwice;
            this.requirements.sprite1ResetsSize.bool  = resultsArr[0].resetsSize;
        }
        /// Sprite 2
        if(resultsArr[1]) {
            this.requirements.sprite2WhenClicked.bool = resultsArr[1].whenClicked;
            this.requirements.sprite2GetsBigger.bool  = resultsArr[1].getsBigger;
            this.requirements.sprite2TalksTwice.bool  = resultsArr[1].talksTwice;
            this.requirements.sprite2ResetsSize.bool  = resultsArr[1].resetsSize;
        }
        /// Sprite 3
        if(resultsArr[2]) {
            this.requirements.sprite3WhenClicked.bool = resultsArr[2].whenClicked;
            this.requirements.sprite3GetsBigger.bool  = resultsArr[2].getsBigger;
            this.requirements.sprite3TalksTwice.bool  = resultsArr[2].talksTwice;
            this.requirements.sprite3ResetsSize.bool  = resultsArr[2].resetsSize;
        }

    }
}