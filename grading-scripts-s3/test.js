require('./scratch3');

module.exports.main = function() {
    var project = new Project(require('../test-projects/pirate'));
    for (var target of project.targets) {
        console.log('Target: ' + target.name);
        for (var script of target.scripts) {
            printBlocks(script, 1);
        }
    }
}

function indent(x) {
    var str = '';
    for (var i = 0; i < x; i++) str += '    ';
    return str;
}

function printBlocks(script, level) {
    console.log(indent(level) + 'Script:');
    for (var block of script.blocks) {
        console.log(indent(level + 1) + block.opcode);
        if (is(block.conditionBlock)) {
            console.log(indent(level + 1) + 'Condition: ' + block.conditionBlock.opcode);
        }
        for (var subScript of block.subScripts()) {
            printBlocks(subScript, level + 2);
        }
    }
}

module.exports.test = function() {
    var grader = new GradeEvents;
    grader.grade(require('../test-projects/events'), null);
    return (grader)
};
