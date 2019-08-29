require('./scratch3');

module.exports = class GradeEventsL1 {

    /// Initialize all requirements and extensions to their default values.
    init() {
        this.requirements = {
            reactToClick:     {str: 'At least two sprites use the [when this sprite clicked] block to detect when they are clicked.'},
            getBigger:        {str: 'These two sprites get larger when they are clicked.'},
            talkWhileBigger:  {str: 'These two sprites speak while they are larger.'},
            resetSize:        {str: 'These two sprites go back to their original sizes after they speak.'},
            twoEvents:        {str: 'Each sprite in the project has scripts for at least two different types of event blocks.'}
        };
        this.extensions = {
            changedName:      {str: 'At least one sprite\'s name has been changed from the original project.'},
            addedSpin:        {str: 'At least one sprite spins around using turn and wait blocks inside of a loop.'},
            moveOnKey:        {str: 'At least one sprite moves when a key is pressed.'},
            additionalEvents: {str: 'At least one sprite handles three or more different types of event blocks.'}
        }
        for (var item in this.requirements) {this.requirements[item].bool = false;}
        for (var item in this.extensions)   {this.extensions[item].bool = false;}
    }

    drop(name) {
        for (var item in this.requirements) {this.requirements[item][name] = 0;}
        for (var item in this.extensions)   {this.extensions[item][name] = 0;}
    }

    lift(item, nameTo, nameFrom, conditionFunction) {
        if (this.requirements[item] !== undefined) {
            if (conditionFunction(this.requirements[item][nameFrom])) {
                nameTo === 'bool' ? this.requirements[item].bool = true : this.requirements[item][nameTo]++;
            }
        }
        else if (this.extensions[item] !== undefined) {
            if (conditionFunction(this.extensions[item][nameFrom])) {
                nameTo === 'bool' ? this.extensions[item].bool = true : this.extensions[item][nameTo]++;
            }
        }
        else {
            console.log('Item ' + item + ' not found.');
        }
    }

    /// Evaluate the completion of the requirements and extensions for a given JSON representation of a project.
    grade(json, user) {
        this.init();
        if (no(json)) return;

        /// Drop down
        var project = new Project(json, this);
        this.drop('countInSprites');
        for (var sprite of project.sprites) {
            this.drop('countInScripts');
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1
            )) {
                var spriteSize = parseFloat(sprite.size);
                var initialSpriteSize = spriteSize;
                var eventList = [];
                for (var block of script.blocks) {
                    if (block.opcode === 'looks_changesizeby') {
                        if (block.inputs.CHANGE[1][1] > 0) {
                            this.requirements.getBigger.countInScripts++;
                        }
                        spriteSize += parseFloat(block.inputs.CHANGE[1][1]);
                    }
                    else if (block.opcode === 'looks_setsizeto') {
                        if (block.inputs.SIZE[1][1] > initialSpriteSize) {
                            this.requirements.getBigger.countInScripts++;
                        }
                        spriteSize = parseFloat(block.inputs.SIZE[1][1]);
                    }
                    else if (block.opcode.includes('looks_say') && spriteSize > initialSpriteSize) {
                        this.requirements.talkWhileBigger.countInScripts++;
                    }
                    else if (block.opcode.includes('event_when')) {
                        eventList.push(block.opcode);
                        if (block.opcode === 'event_whenthisspriteclicked') {
                            this.requirements.reactToClick.countInScripts++;
                        }
                    }
                }
            }
            this.requirements.twoEvents.countInScripts = Array.from(new Set(eventList)).length;

            /// Lift up
            this.lift('reactToClick',     'countInSprites', 'countInScripts', count => count > 0);
            this.lift('getBigger',        'countInSprites', 'countInScripts', count => count > 0);
            this.lift('talkWhileBigger' , 'countInSprites', 'countInScripts', count => count > 0);
            this.lift('resetSize',        'countInSprites', 'countInScripts', count => count > 0);
            this.lift('twoEvents',        'countInSprites', 'countInScripts', count => count > 1);
            this.lift('changedName',      'countInSprites', 'countInScripts', count => count > 0);
            this.lift('addedSpin',        'countInSprites', 'countInScripts', count => count > 0);
            this.lift('moveOnKey',        'countInSprites', 'countInScripts', count => count > 0);
            this.lift('additionalEvents', 'countInSprites', 'countInScripts', count => count > 0);
        }
        this.lift('reactToClick',     'bool', 'countInSprites', count => count > 1);
        this.lift('getBigger',        'bool', 'countInSprites', count => count > 1);
        this.lift('talkWhileBigger' , 'bool', 'countInSprites', count => count > 1);
        this.lift('resetSize',        'bool', 'countInSprites', count => count > 1);
        this.lift('twoEvents',        'bool', 'countInSprites', count => count > project.sprites.length - 1);
        this.lift('changedName',      'bool', 'countInSprites', count => count > 0);
        this.lift('addedSpin',        'bool', 'countInSprites', count => count > 0);
        this.lift('moveOnKey',        'bool', 'countInSprites', count => count > 0);
        this.lift('additionalEvents', 'bool', 'countInSprites', count => count > 0);
    }
}
