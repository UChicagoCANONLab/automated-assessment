require('./grader');
require('./scratch3');

module.exports = class GradeTwoWaySyncL1 extends Grader {

    init(project) {
        let strandTemplates = {
            multicultural: require('./templates/two-way-sync-L1-multicultural'),
            youthCulture:  require('./templates/two-way-sync-L1-youth-culture'),
            gaming:        require('./templates/two-way-sync-L1-gaming')
        };
        this.strand = detectStrand(project, strandTemplates, 'youthCulture');
        this.strand = 'youthCulture';
        if (this.strand === 'multicultural') {

        }
        else if (this.strand === 'youthCulture') {
            this.requirements = [
                new Requirement('Add two more text messages to the conversation, one for each sprite.', this.testTalk(project)),
                new Requirement('Make the cow interrupt while the sheep\'s think bubble is still visible.', this.testSync(project))
            ]
            this.extensions = [
                new Extension('Add more messages to the texting conversation.', this.testExtraLines()),
                new Extension('Customize your project using sounds and other Scratch elements!', this.testCustom(project))
            ]
        }
        else if (this.strand === 'gaming') {

        }
    }

    messageTimes(script) {
        let times = [];
        for (let block of script.blocks) {
            if (opcodeLists.speak.includes(block.opcode)) {
                times.push(block.startTime);
            }
        }
        return times;
    }

    testTalk(project) {
        let spritesPassing = 0;
        let longerScript = false;
        for (let sprite of project.sprites) {
            let scriptsPassing = 0;
            for (let script of sprite.validScripts) {
                scriptsPassing += this.messageTimes(script).length > 1;
                if (this.messageTimes(script).length > 2) {
                    longerScript = true;
                }
            }
            spritesPassing += scriptsPassing > 0;
        }
        return (spritesPassing > 1 && longerScript);
    }

    testSync(project) {
        for (let sprite1 of project.sprites) {
            for (let sprite2 of project.sprites.filter(sprite => sprite !== sprite1)) {
                for (let script1 of sprite1.validScripts) {
                    for (let script2 of sprite2.validScripts) {
                        let messageTimes1 = this.messageTimes(script1);
                        let messageTimes2 = this.messageTimes(script2);
                        let synced = true;
                        for (let i = 0; i < messageTimes1.length && i < messageTimes2.length; i++) {
                            if (messageTimes1[i] >= messageTimes2[i]) {
                                synced = false;
                            }
                        }
                        let talksTwice = (messageTimes1.length > 1) && (messageTimes2.length > 1);
                        let talksMore  = (messageTimes1.length > 2) && (messageTimes2.length > 2);
                        if (synced && talksMore) {
                            this.extraLinesPassing = true;
                        }
                        if (synced && talksTwice) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    testExtraLines() {
        return this.extraLinesPassing;
    }

    testCustom() {
        return false; /// Working on a more general customization detector to deploy across graders
    }
}
