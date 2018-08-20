

class GradeAnimation {

    constructor() {
        this.requirements = {};
    }

    initReqs() {
        // checks for non-moving animation
        this.requirements.handlesDownArrow = {bool:false, str:'Handles down arrow.'};
        this.requirements.downArrowCostumeChange = {bool:false, str:'Change costume on down arrow.'};
        this.requirements.downArrowWaitBlock = {bool:false, str:'Wait block on down arrow.'};
        // checks for moving animation
        this.requirements.handlesSpaceBar = {bool:false, str:'Handles space bar.'};;
        this.requirements.spaceBarLoop = {bool:false, str:'Loop on space bar.'};;
        this.requirements.spaceBarMovement = {bool:false, str:'Moves on space bar.'};;
        this.requirements.spaceBarCostumeChange = {bool:false, str:'Costume change on space bar.'};;
        this.requirements.spaceBarWaitBlock = {bool:false, str:'Wait block on space bar.'};;
        // checks for race winner
        this.requirements.hasWinner = {bool:false, str:'Race has a winner.'};;
        // checks for extra components
        // victory dance, turn block
        this.requirements.extraPostFinishAnimation = {bool:false, str:'Changes costume during victory dance.'};;
        this.requirements.extraTurnBlock = {bool:false, str:'Turn block during victory dance.'};;
    }

    grade(fileObj, user) {
        this.initReqs();
        // for private method
        var that = this;

        // general metrics
        var sprites = fileObj.children;
        var validMoves = ['gotoX:y:', 'changeXposBy:', 'changeYposBy:', 'forward:', 'glideSecs:toX:y:elapsed:from:'];
        var validLoops = ['doForever', 'doRepeat', 'doUntil'];
        var validCostumes = ['lookLike:', 'nextCostume'];

        var extraBeeWaitTime = -1;
        var extraBeeMoveSteps = -1;
        var extraSnakeWaitTime = -1;
        var extraSnakeMoveSteps = -1;
        var winner = null;
        var victoryDance = {};

        // check the script for the Bee sprite
        var checkScript = function(sprite) {
            for (var i = 0; i < sprite.scripts.length; i++) {
                var script = sprite.scripts[i][2];
                var eventName = script[0][0];
                if (script.length > 1) {
                    if (eventName === 'whenKeyPressed') {
                        var eventKey = script[0][1];
                        if (eventKey === 'down arrow') {
                            // check correctness for Bee, skip for Snake
                            if (sprite.objName === 'Bee') {
                                that.requirements.handlesDownArrow.bool = true;
                                checkDownArrow(script);
                            }
                        } else if (eventKey === 'space') {
                            // check correctness for Bee, record speed for Snake
                            if (sprite.objName === 'Bee') {
                                that.requirements.handlesSpaceBar.bool = true;
                                checkSpaceBar(script);
                                that.extraTurnBlock = that.extraTurnBlock && (sprite.rotationStyle === 'normal');
                            } else if (sprite.objName === 'Snake') {
                                checkSpaceBar(script, false);
                            }
                        }
                    }
                }
            }
        };

        // check the blocks following Down Arrow
        // costume change, wait
        var checkDownArrow = function(script) {
            var blocks = script.slice(1);
            var waitBlockCounter = 0;
            var switchBlockCounter = 0;
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block[0] === 'wait:elapsed:from:') 
                    waitBlockCounter += 1;
                if (validCostumes.includes(block[0])) {
                    switchBlockCounter += 1;
                }
                if (validLoops.includes(block[0])) {
                    if (block[1] >= 4) {
                        var nested = block.slice(2)[0];
                        for (var i = 0; i < nested.length; i++) {
                            if (nested[i][0] === 'wait:elapsed:from:') 
                                that.requirements.downArrowWaitBlock.bool = true;
                            if (nested[i][0] === 'nextCostume')
                                that.requirements.downArrowCostumeChange.bool = true;
                        }
                    }
                }
            }
            // showing all 4 costumes, may include beginning
            if (waitBlockCounter >= 3)
                that.requirements.downArrowWaitBlock.bool = true;
            if (switchBlockCounter >= 3)
                that.requirements.downArrowCostumeChange.bool = true;          
        };

        // check the blocks following Space Bar
        // loop, movement, costume change, wait
        var checkSpaceBar = function(script, grading=true) {
            var blocks = script.slice(1);
            var loopBlockIndex = -1;
            for (var i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                // requirements: racing loop
                if (i === 0 && (validLoops.includes(block[0]))) {
                    loopBlockIndex = i;
                    if (grading && block[0] !== 'doForever')
                        that.requirements.spaceBarLoop.bool = true;
                    var nested;
                    if (block[0] === 'doForever') 
                        nested = block.slice(1)[0];
                    else
                        nested = block.slice(2)[0];
                    for (var j = 0; j < nested.length; j++) {
                        if (grading) {
                            // requirements
                            if (nested[j][0] === 'wait:elapsed:from:') {
                                that.requirements.spaceBarWaitBlock.bool = true;
                                if (extraBeeWaitTime === -1)
                                    extraBeeWaitTime = 0;
                                extraBeeWaitTime += nested[j][1];
                            }
                            if (nested[j][0] === 'forward:') {
                                that.requirements.spaceBarMovement.bool = true;
                                if (extraBeeMoveSteps === -1)
                                    extraBeeMoveSteps = 0;
                                extraBeeMoveSteps += nested[j][1];
                            }
                            if (nested[j][0] === 'nextCostume')
                                that.requirements.spaceBarCostumeChange.bool = true;
                            // extra: wiggly path for Bee
                            if (nested[j][0] === 'turnLeft:' || nested[j][0] === 'turnRight:')
                                that.requirements.extraTurnBlock.bool = true;
                        } else {
                            if (nested[j][0] === 'wait:elapsed:from:')
                                extraSnakeWaitTime = nested[j][1];
                            if (nested[j][0] === 'forward:')
                                extraSnakeMoveSteps = nested[j][1];
                        }
                    }
                }
                // extra: victory dance after racing loop
                else {
                    var checkDance = function(block) {
                        var extraCostumeChange = false;
                        var extraMoveBlock = false;
                        if (block[0] === 'doRepeat' || block[0] === 'forever') {
                            var nested = block.slice(2)[0];
                            for (var j = 0; j < nested.length; j++) {
                                if (validMoves.includes(nested[j][0]))
                                    extraMoveBlock = true;
                                if (nested[j][0] === 'lookLike:' || nested[j][0] === 'nextCostume')
                                    extraCostumeChange = true;
                            }
                        } else if (validMoves.includes(block[0])) {
                            extraMoveBlock = true;
                        }
                        return (extraMoveBlock || extraCostumeChange);
                    };
                    if (loopBlockIndex !== -1 && i > loopBlockIndex) {
                        if (grading) {
                            victoryDance.bee = checkDance(block);
                        }
                        else {
                            victoryDance.snake = checkDance(block);
                        }
                    };               
                }
            }
        };

        // main
        // check script for both Bee and Snake
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite.hasOwnProperty('objName') && 
                sprite.hasOwnProperty('scripts')) {
                checkScript(sprite);
            }
        }

        // extra: Bee and Snake finish with different speed
        if (extraBeeWaitTime !== -1 && extraBeeMoveSteps !== -1) {
            if (extraBeeWaitTime !== extraSnakeWaitTime) {
                this.requirements.hasWinner.bool = true;
                if (extraBeeWaitTime < extraSnakeWaitTime)
                    winner = 'bee';
                else
                    winner = 'snake';
            }
            if (extraBeeMoveSteps !== extraSnakeMoveSteps) {
                 this.requirements.hasWinner.bool = true;
                if (extraBeeMoveSteps > extraSnakeMoveSteps)
                    winner = 'bee';
                else
                    winner = 'snake';
            }
        }
        if (winner && victoryDance.hasOwnProperty(winner)) {
            this.requirements.extraPostFinishAnimation.bool = true;
        }
    }
}