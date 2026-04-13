/* Scratch Basics L1 Autograder
Updated Version: Saranya Turimella, Summer 2019
*/

require('../grading-scripts-s3/scratch3')

module.exports = class {

    // Implement Generic Requirements instead

    init(){
        this.requirements = {
            addSay : {bool: false, str: 'A say block is added'}
        }
        this.extensions = {
            addSayAgain : {bool: false, str: 'A second say block is added'},
            addMove: {bool: false, str: 'A move block is added'}
        }

        
    }   

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        // call function that takes in the project, decides what strand it is in, that function returns a string

        let projBackdrops = [];
        for (let target of project.targets) {
            for (let costume of target.costumes) {
                projBackdrops.push(costume.assetId);
            }
        }

        var templates = {
            multicultural: require('./templates/scratch-basics-L1-multicultural'),
            gaming: require('./templates/scratch-basics-L1-gaming'),
            stardew: require('./templates/scratch-basics-L1-stardew.json')
        };
        
        let strand = detectStrand(project, templates);
        let template = templates[strand]

        this.init()
        var addSay = 0;
        var addSayAgain = 0;
        var addMove = 0;
        for (var sprite of project.sprites) {
            // Find the primary sprite
            if(strand == 'gaming'){
                var spriteName = detectSprite(sprite, template)
                if (spriteName == "Carl the Cloud"){
                    const opcodes = Object.values(sprite.blocks).map(item => item.opcode);
                    for (var opcode of opcodes) {
                        if (opcode.includes('looks_say')) {
                            addSay++;
                        }
                        else if (opcode.includes('motion_movesteps')){
                            addMove++;
                        }
                    }
                }
                else if (spriteName == "Helen the Hedgehog") {
                    const opcodes = Object.values(sprite.blocks).map(item => item.opcode);
                    for (var opcode of opcodes) {
                        if (opcode.includes('looks_say')) {
                            addSayAgain++;
                        }
                    }
                }                            
            }
            else if (strand == 'multicultural'){
                var spriteName = detectSprite(sprite, template)
                if (spriteName == "Neha"){
                    const opcodes = Object.values(sprite.blocks).map(item => item.opcode);
                    for (var opcode of opcodes) {
                        if (opcode.includes('looks_say')) {
                            addSay++;
                        }
                        else if (opcode.includes('motion_movesteps')){
                            addMove++;
                        }
                    }
                }
                else if (spriteName == "Brad"){
                    const opcodes = Object.values(sprite.blocks).map(item => item.opcode);
                    for (var opcode of opcodes) {
                        if (opcode.includes('looks_say')) {
                            addSayAgain++;
                        }
                    }
                }
            }
            else if (strand == 'stardew'){
                var spriteName = detectSprite(sprite, template)
                if (spriteName == "Mayor Lewis"){
                    const opcodes = Object.values(sprite.blocks).map(item => item.opcode);
                    for (var opcode of opcodes) {
                        if (opcode.includes('looks_say')) {
                            addSay++;
                        }
                    }
                }
                else if (spriteName == "Robin"){
                    for (var script of sprite.scripts) {
                        if (script.blocks[0].opcode === 'event_whenflagclicked') {
                            
                            for (var block of script.blocks) {
                                if (block.opcode.includes('looks_say')) {
                                    addSayAgain++;
                                }
                                else if (block.opcode === 'motion_movesteps'){
                                    addMove++;
                                }
                            }
                        }
                    }
                }
            }
        } 
        if (strand == 'gaming'){
            this.requirements.addSay.bool = (addSay > 3);
            this.extensions.addMove.bool = (addMove > 3);
            this.extensions.addSayAgain.bool = (addSayAgain > 1);    
        }
        else if (strand == 'multicultural'){
            this.requirements.addSay.bool = (addSay > 9);
            this.extensions.addMove.bool = (addMove > 0);
            this.extensions.addSayAgain.bool = (addSayAgain > 2);
        }
        else if (strand == 'stardew'){
            this.requirements.addSay.bool = (addSay > 4);
            this.extensions.addSayAgain.bool = (addSayAgain > 0);
            this.extensions.addMove.bool = (addMove > 0);
        }
              
    }
}