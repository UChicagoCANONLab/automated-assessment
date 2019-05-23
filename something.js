/// Does something

class Scratch3 {

    constructor() {
        this.sprites = {};
        this.hasBeenTraversed = false;
    }

    grade(project, user) {
        this.traverse(project);
    }

    traverse(project) {

        forEachOf_if_do_(project.targets, true, function(each) {
            var consoleStr = '';

            var oldTarget = each;
            var newTarget = {};
            newTarget.name = oldTarget.name;
            newTarget.scripts = [];
            consoleStr += '\nTarget: ' + newTarget.name;

            /// TODO: don't forget about variables, etc...

            /// Identify the blocks that are at the top of a script (because they point to no parent block)
            forEachOf_if_do_(oldTarget.blocks, function(each) { return is(each.parent, null) }, function(each) {
                var oldBlock = each;
                var newScript = [];
                consoleStr += '\n\n    Script:';
                
                /// Traverse scripts from top to bottom until we encounter a block with no next block
                while (oldBlock !== null) {
                    var newBlock = {};
                    newBlock.opcode = oldBlock.opcode;
                    newBlock.inputs = {};
                    consoleStr += '\n        ' + newBlock.opcode;

                    /// Fill out inputs of newBlock
                    forEachOf_if_do_(oldBlock.inputs, true, function(each) {
                        var oldInput = each;
                        var newInput = {};
                        newInput.name = oldInput.key;
                        newInput.value = oldInput[1][1];
                        consoleStr += ' (' + newInput.name + ': ' + newInput.value + ')';
                    });

                    /// Fill out fields of newBlock


                    /// Advance to the next block
                    if (oldBlock.next === null) oldBlock = null;
                    else oldBlock = oldTarget.blocks[oldBlock.next];
                }
            });

            console.log(consoleStr);
        });

        /*
        for (var project_target of project.targets) {
            var target     = {};
            target.name    = project_target.name;
            target.scripts = [];

            if (project_target.blocks.length && project_target.blocks != null) for (var project_target_block of project_target.blocks) {

                /// Identify the blocks that are at the END of a script (because they point to no next block)
                if (project_target_block.next === null) {
                    var script = [];
                    var traversingBlock = project_target_block;

                    /// Traverse scripts upwards, from foot to head, until we encounter a block with no parent
                    while (traversingBlock) {
                        var block = {};
                        block.opcode = traversingBlock.opcode;
                        block.args = [];
                        block.subscripts = [];

                        for (var traversingBlock_input of traversingBlock.inputs) {
                            var input = {};
                            input.name = Object.keys({traversingBlock_input})[0]; //???
                            input.value = traversingBlock_input[1][1];
        
                            /// Handle control blocks that contain subscripts (like 'repeat')
                            if (input.name === 'SUBSTACK') {
                                var subscript;
                            }
                        }

                        script.unshift(block);
                        traversingBlock = traversingBlock.parent;
                    }

                    target.scripts.unshift(script);
                }



                /////////////////////////////////////////////////////////////
                

                

            }

        }

        this.hasBeenTraversed = true; */
    } 

    showStructure() {

        if (!this.hasBeenTraversed) console.log('No project in memory.');

        for (var sprite of this.sprites) {

        }
    }


}

function forEachOf_if_do_(object, condition, functionToExecute) {
    if (thereExists(object)) {
        if (Array.isArray(object)) {
            for (var each of object) 
                if (condition === true || condition(each)) functionToExecute(each);
        }
        else {
            for (var eachKey of Object.keys(object)) {
                var each = object[eachKey];
                each.key = eachKey;
                if (condition === true || condition(each)) functionToExecute(each);
            }
        }      
    }
}

function is(one, other) {
    return (one === other);
}

function nameOf(property) {
    return Object.keys({property})[0];
}

function pierce(it) {
    //console.log(Object.keys(it)[0]);
    return it[Object.keys(it)[0]];
}

function thereExists(it) {
    return (it !== undefined && it !== null && it !== {});
}

function combine() {
    var ret = {};
    for (var argument of arguments) {
        if (thereExists(argument)) Object.assign(ret, argument);
    }
    return ret;
}

module.exports = Scratch3;