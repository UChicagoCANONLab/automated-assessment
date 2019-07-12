require('./scratch3');

module.exports = class {

    init(json) {
        if (no(json)) return false;
        this.requirements = {};
        this.extensions = {
            numSprites: { bool: false, str: 'Number of sprites in project: ' },
            numScripts: { bool: false, str: 'Number of scripts in project: ' },
            numBlocks:  { bool: false, str: 'Number of blocks in scripts: '  }
        }
        return true;
    }

    grade(json, user) {
        if (!this.init(json)) return;
        var Project = new Project(json, this);
        for (var sprite of project.sprites) {
            project.context.numSprites++;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1
            )) {
                sprite.context.numScripts++;
                for (var block of script.blocks) {
                    script.context.numBlocks++;
                }
            }
        }
    }

}