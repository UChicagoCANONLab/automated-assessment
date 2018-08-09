class GradeEvents {

    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        var reqs = (Math.random()*2)|0;
        var exts = (Math.random()*2)|0;

        this.requirements.containsTwoSprites  = 
        this.requirements.greenFlagHandled    =
        this.requirements.spriteClickHandled  =
        this.requirements.keyPressHandled     =
        this.requirements.spriteSaysSomething =
        this.requirements.spriteChangesSize   =
        this.requirements.spriteResetsSize    = reqs;

        this.extensions.test = exts;
    }

    grade(fileObj, user) {
        this.initReqs();

    }
    
}