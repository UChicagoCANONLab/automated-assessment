require('./scratch3');

module.exports = class {

    init() {
        this.requirements = {
            synced:     { bool: false, str: 'Text messages are correctly synchronized using wait blocks.' },
            talkTwice:  { bool: false, str: 'Each sprite talks at least twice.'                           }
        };
        this.extensions =   {
            talkMore:   { bool: false, str: 'Added more synchronized messages to each sprite.'            },
            addedSound: { bool: false, str: 'Added a sound other than "boing" or "pop."'                  }
        };
    }

    grade(json, user) {
        this.init();
        if (no(json)) return;
        var project = new Project(json, this);
        /// Test each pairing of scripts across sprites.
        var scriptPairs = [];
        for (var sprite1 of project.sprites) {
            for (var sprite2 of project.sprites) {
                for (var script1 of sprite1.scripts.filter(
                    script1 =>
                    script1.blocks.length > 1 &&
                    script1.blocks[0].opcode.includes('event_when'))) {
                    for (var script2 of sprite2.scripts.filter(
                        script2 =>
                        script2.blocks.length > 1 &&
                        script2.blocks[0].opcode === script1.blocks[0].opcode
                        )) {
                        var messageTimes1 = this.checkScript(sprite1, script1);
                        var messageTimes2 = this.checkScript(sprite2, script2);
                        console.log(messageTimes1);
                        console.log(messageTimes2);
                        var synced = 1;
                        for (var i = 0; i < messageTimes1.length && i < messageTimes2.length; i++) {
                            if (messageTimes1[i] >= messageTimes2[i]) {
                                synced = 0;
                            }
                        }
                        var talkTwice = (messageTimes1.length > 1) && (messageTimes2.length > 1);
                        var talkMore  = (messageTimes1.length > 2) && (messageTimes2.length > 2);
                        scriptPairs.push({
                            script1: script1,
                            script2: script2,
                            synced: synced,
                            talkTwice: talkTwice,
                            talkMore: talkMore,
                            score: synced + talkTwice
                        });
                    }
                }
            }
        }
        var bestScore = -1;
        var bestScriptPair = scriptPairs[0];
        for (var scriptPair of scriptPairs) {
            if (scriptPair.score > bestScore) {
                bestScore = scriptPair.score;
                bestScriptPair = scriptPair;
            }
        }
        this.requirements.synced.bool    = bestScriptPair.synced;
        this.requirements.talkTwice.bool = bestScriptPair.talkTwice;
        this.extensions.talkMore.bool    = bestScriptPair.talkMore;
    }

    /// Returns an array of times (in seconds after the event) at which this script makes the sprite talk or think.
    /// Also checks for any new sounds.
    checkScript(sprite, script) {
        var scriptTime = 0;
        var messageTimes = [];
        var isSpeaking = false;
        for (var block of script.blocks) {
            if (block.opcode === 'control_wait') {
                scriptTime += parseFloat(block.inputs.DURATION[1][1]);
                isSpeaking = false;
            }
            else if (block.opcode === 'looks_thinkforsecs' || block.opcode === 'looks_sayforsecs') {
                if (!isSpeaking) messageTimes.push(scriptTime);
                scriptTime += parseFloat(block.inputs.SECS[1][1]);
                isSpeaking = true;
            }
            else if (block.opcode === 'sound_play') {
                try {
                    var soundName = sprite.blocks[block.inputs.SOUND_MENU[1]].fields.SOUND_MENU[0];
                    if (soundName !== 'boing' && soundName !== 'pop') {
                        this.extensions.addedSound.bool = true;
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                isSpeaking = false;
            }
        }
        return messageTimes;
    }
}
