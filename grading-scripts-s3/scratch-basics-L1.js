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

        console.log(
            'in array match'
        );
        console.log('arr1')
        console.log(arr1);
        console.log('arr2');
        console.log(arr2);
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) {
            console.log(arr1.length);
            console.log(arr2.length);
            console.log('len issue');
            return false;
        }

        // Check if all items exist and are in the same order
        for (var i = 0; arr1.length < i; i++) {
            if (arr1[i] !== arr2[i]) {
                console.log('elements dont match');
                return false;
            }
        }

    };

    // function that decides what strand the project is, returns a string
    whichStrand(projBackdrops) {


        let strand = '';
        let gamingOrig = new Project(require('../grading-scripts-s3/gamingOriginal'));
        let multiOrig = new Project(require('../grading-scripts-s3/multiculturalOriginal'));
        let youthOrig = new Project(require('../grading-scripts-s3/youthOriginal'));

        // gets the asset id's of the original gaming project (backdrops)
        let gamingBackdrops = [];
        for (let target of gamingOrig.targets) {
            if (target.isStage) {
                for (let costume of target.costumes) {
                    gamingBackdrops.push(costume.assetId);
                }
            }
        }

        // gets the asset id's of the original multicultural project (backdrops)
        let multiBackdrops = [];
        for (let target of multiOrig.targets) {
            if (target.isStage) {
                for (let costume of target.costumes) {
                    multiBackdrops.push(costume.assetId);
                }
            }
        }

        // gets the asset id's of the original youth culture project (backdrops)
        let youthBackdrops = [];
        for (let target of youthOrig.targets) {
            if (target.isStage) {
                for (let costume of target.costumes) {
                    youthBackdrops.push(costume.assetId);
                }
            }
        }

        var util = require('util');
        let origUtil = util.inspect(projBackdrops);
        let gamingUtil = util.inspect(gamingBackdrops);
        let multiUtil = util.inspect(multiBackdrops);
        let youthUtil = util.inspect(youthBackdrops);

        if (origUtil === gamingUtil) {
            return 'gaming';
        }
        else if (origUtil === multiUtil) {
            return 'multicultural'
        }
        else if (origUtil === youthUtil) {
            return 'youthculture';
        } else {
            return 'gaming';
        }


    };


    grade(fileObj, user) {

        var project = new Project(fileObj, null);
        // call function that takes in the project, decides what strand it is in, that function returns a string


        let projBackdrops = [];
        for (let target of project.targets) {
            if (target.isStage) {
                for (let costume of target.costumes) {
                    projBackdrops.push(costume.assetId);
                }
            }
        }


        let strand = this.whichStrand(projBackdrops);


        // gaming strand 
        if (strand === 'gaming') {

            this.initReqsGaming();
            let sayBlocks = ['looks_say', 'looks_sayforsecs'];

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
            // checks to see if a
            if (sayBlocksGaming > 5) {
                this.extensions.helenSpeaks.bool = true;
            }
        }


        if (strand === 'multicultural') {
            console.log('in multicultural');
            this.initReqsMulticultural();
            let sayBlocks = ['looks_say', 'looks_sayforsecs'];
            let sayBlocksMulticultural = 0;

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
            if (sayBlocksMulticultural > 10) {
                this.extensions.bradSpeaks.bool = true;
            }
        }






        if (strand === 'youthculture') {

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
            let easel = false;
            let sayBlocksYouthCulture = 0;

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
            // number of say blocks should be greater than 2 
            if (sayBlocksYouthCulture > 5) {
                this.extensions.easelSaysSomethingElse.bool = true;
            }
        }
    }
}