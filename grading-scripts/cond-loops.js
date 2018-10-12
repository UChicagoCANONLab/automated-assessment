/// TODO: Put these in their own file

/// Returns an array of the blocks in a script.
function blocks(script) {
    if (!script || script === undefined) return [];
    return script[2];
}

/// Returns the opcode of a block.
function opcode(block) {
    if (!block || block === undefined || block.length === 0) return '';
    return block[0];
}

/// Returns the first block in a script's opcode.
function hatCode(script) {
    return opcode(blocks(script)[0]);
}

/// Returns an array containing the subset of a sprite's scripts with a given event.
function eventScripts(sprite, myEvent) {
    if (!sprite.scripts) return [];
    return sprite.scripts.filter(script => hatCode(script) === myEvent);
}

/// Returns an array containing the subset of a scripts's blocks with a given opcode.
function opcodeBlocks(script, myOpcode) {
    if (!blocks(script)) return [];
    return blocks(script).filter(block => opcode(block) === myOpcode);
}

/// Returns true if a script contains a certain block, and false otherwise.
function scriptContains(script, myOpcode) {
    if (!script || script === undefined || !blocks(script)) return false;
    return blocks(script).some(block => opcode(block) === myOpcode);
}

/// Finds a block with a given opcode in a script.
function findBlock(script, myOpcode) {
    return blocks(script).find(block => opcode(block) === myOpcode);
}

class GradeCondLoops {

    constructor() {
        this.requirements = {}
        this.extensions = {}
    }

    initReqs() {
        this.requirements.newCostume    = 
            {bool:false, str:'Changed car sprite.'};
        this.requirements.carStop       =
            {bool:false, str:'Car stops upon collision.'};
        this.requirements.saySomething  = 
            {bool:false, str:'Car says something.'};
        this.requirements.changeSpeed   = 
            {bool:false, str:'Changed car speed.'};

        this.extensions.otherSprites    =   
            {bool:false, str:'Other sprites perform actions.'};
        this.extensions.carSound        = 
            {bool:false, str:'Car makes a sound.'};
    }

    grade(fileObj, user) {
        this.initReqs()
        var car = fileObj.children.find(child => child.objName === 'Car');
        if(!car) return;
        this.checkCostume(car);
        this.checkSound(car);
        this.checkSpeed(8, 0.1, car); // where to pull defaults from?
        this.checkSprites(fileObj.children);
        this.checkSay(this.checkStop(car));
    }

    /// Checks that a different costume was chosen (requirement).
    checkCostume(car) {
        this.requirements.newCostume.bool = (car.currentCostumeIndex !== 2);
    }

    /// Checks that speed was changed (requirement).
    checkSpeed(defaultSteps, defaultTime, car) {
        for (var script of eventScripts(car, 'whenGreenFlag')) {
            for (var block of opcodeBlocks(script, 'doUntil')) {
                var containsWait = false;
                var containsMove = false;
                if (block[2]) {
                    for (var subBlock of block[2]) {
                        if (subBlock && opcode(subBlock) === 'forward:') {
                            containsMove = true;
                            if (subBlock[1] !== defaultSteps)
                                this.requirements.changeSpeed.bool = true;
                        }
                        if (subBlock && opcode(subBlock) === 'wait:elapsed:from:') {
                            containsWait = true;
                            if (subBlock[1] !== defaultTime)
                                this.requirements.changeSpeed.bool = true;
                        }            
                    }
                }
                if (!containsWait && containsMove) this.requirements.changeSpeed.bool = true;
            }
        }
    }

    /// Checks for car sound (extension).
    checkSound(car) {
        for (var script of car.scripts) {
            if (scriptContains(script, 'playSound:'))
                this.extensions.carSound.bool = true;
            else if (scriptContains(script, 'doPlaySoundAndWait'))
                this.extensions.carSound.bool = true;
            else for (var block of opcodeBlocks(script, 'doUntil')) {
                for (var subBlock of block[2]) {
                    if (subBlock && ['playSound:', 'doPlaySoundAndWait'].includes(opcode(subBlock))) {
                        this.extensions.carSound.bool = true;
                    }
                }
            }
        }
    }

    /// Checks that other sprites perform actions (extension).
    checkSprites(sprites) {      
        this.extensions.otherSprites.bool = sprites.find((sprite) => {
            if(sprite.objName != 'Car' && sprite.scripts) {
                return sprite.scripts.find((script) => {
                    return blocks(script).find((block) => {
                        return opcode(block).startsWith('say') ||
                               opcode(block).startsWith('move')
                    })
                })
            }
        })
    }

    /// Check for stop condition (requirement).
    checkStop(car) {
        var events_list = ['whenGreenFlag', 'whenKeyPressed','whenIReceive'];
        var event_script = null;
        this.requirements.carStop.bool = car.scripts.find((e) => {
            if(events_list.includes(e[2][0][0])) {
                return e[2].find((f) => {
                    if(f[0] == 'doUntil') {
                        event_script = e[2];
                        try {return f[1][0].startsWith('touching');}
                        catch(err) {return false}
                    }
                });
            }
        });
        return event_script;
    }

    /// Checks that the car says something (requirement).
    checkSay(script) {
        if(!script) return null;      
        var i = 0;
        while(blocks(script)[i] && opcode(blocks(script)[i]) != 'doUntil') i++;
        this.requirements.saySomething.bool = script.slice(i).find((block) => {
            return (opcode(block).startsWith('say') || 
            opcode(block).startsWith('think'))
        });
    }
}