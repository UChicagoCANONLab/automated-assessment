require('./scratch3');

global.allOf = function(tests) {
    var result = true;
    for (var test of tests) {
        if (!test) {
            result = false;
        }
    }
    return result;
}

global.anyOf = function(tests) {
    var result = false;
    for (var test of tests) {
        if (test) {
            result = true;
        }
    }
    return result;
}

global.detectStrand = function(project, templates, defaultStrand = 'generic') {
    var strand = defaultStrand;
    var projectBlocks = [];
    for (var target of project.targets) {
        for (const key in target.blocks) {
            var block = target.blocks[key]
            projectBlocks.push(block.opcode);
        }
    }
    var highScore = 0;
    for (var template in templates) {
        var templateFile = templates[template];
        var templateBlocks = [];
        for (var target of templateFile.targets) {
            for (const key in target.blocks) {
                var block = target.blocks[key]
                templateBlocks.push(block.opcode);
            }
        }
        var templateScore = 0;
        for (var i = 0; i < projectBlocks.length; i++) {
            if (templateBlocks[i] == projectBlocks[i]) {
                templateScore++;
            }
            if (templateScore > highScore) {
                strand = template;
                highScore = templateScore;
            }
        }
        console.log(templateScore)
        console.log(template)
    }
    return strand;
}

global.Requirement = class {

    constructor(description, evaluator) {
        this.str = description;
        this.bool = evaluator;
    }
}

global.Extension = class extends Requirement {

    constructor(description, evaluator) {
        super(description, evaluator);
    }
}

global.Grader = class {

    constructor() {
        this.requirements = {};
        this.extensions = {};
        this.strand = 'generic';
    }

    init(project) {
        return;
    }

    grade(json) {
        var project = new Project(json, {});
        this.requirements = [];
        this.extensions = [];
        this.init(project);
    }
}
