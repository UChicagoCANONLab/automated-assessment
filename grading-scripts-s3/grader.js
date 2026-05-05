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

// Helper function to compare blocks regardless of their exact order.
// It counts matching block frequencies (Multiset intersection).
function getSimilarityScore(blocksA, blocksB) {
    const countsA = {};
    
    // Count the frequency of each opcode in the first array
    for (const op of blocksA) {
        countsA[op] = (countsA[op] || 0) + 1;
    }

    let score = 0;
    
    // Compare against the second array
    for (const op of blocksB) {
        if (countsA[op] > 0) {
            score++;
            countsA[op]--; // Decrement so we don't double-count matches
        }
    }
    
    return score;
}

global.detectStrand = function(project, templates, defaultStrand = 'generic') {
    var strand = defaultStrand;
    var projectBlocks = [];
    
    // Gather all project opcodes
    for (var target of project.targets) {
        for (const key in target.blocks) {
            projectBlocks.push(target.blocks[key].opcode);
        }
    }
    
    var highScore = 0;
    
    for (var template in templates) {
        var templateFile = templates[template];
        var templateBlocks = [];
        
        // Gather all template opcodes
        for (var target of templateFile.targets) {
            for (const key in target.blocks) {
                templateBlocks.push(target.blocks[key].opcode);
            }
        }
        
        // Use the order-independent scoring helper
        var templateScore = getSimilarityScore(projectBlocks, templateBlocks);
        
        // Update high score once per template
        if (templateScore > highScore) {
            strand = template;
            highScore = templateScore;
        }
        console.log(template + ": " + templateScore);
    }
    
    return strand;
}

// Function to determine what sprite this is based off of in conjuror
global.detectSprite = function(sprite, template) {
    var spriteName = "";
    var gradeBlocks = [];
    
    // Gather opcodes for the target sprite
    for (const key in sprite.blocks) {
        gradeBlocks.push(sprite.blocks[key].opcode);
    }

    var highScore = 0;

    for (var target of template.targets) {
        var templateBlocks = [];
        
        // Gather opcodes for the template sprite
        for (const key in target.blocks) {
            templateBlocks.push(target.blocks[key].opcode);
        }
        
        // Use the order-independent scoring helper
        var templateScore = getSimilarityScore(gradeBlocks, templateBlocks);
        
        // Update high score once per target
        if (templateScore > highScore) {
            spriteName = target.name;
            highScore = templateScore;
        }
    }
    
    return spriteName;
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
