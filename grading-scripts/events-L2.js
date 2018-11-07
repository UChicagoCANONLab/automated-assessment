class GradeEventsL2 {

    constructor() {
        this.requirements = {};
        this.extensions   = {};
    }

    grade(fileObj) {
        this.init();
        this.upgrade(fileObj);
        this.checkStage(fileObj);
        this.checkScripts(fileObj);
    }

    init() {
        this.requirements = {
            newBackdrop:  {bool: false, str: 'Project has a new backdrop.'},
            threeSprites: {bool: false, str: 'Project has at least three different sprites.'},
            greenFlag:    {bool: false, str: 'Project handles "when green flag clicked" events.'},
            whenClicked:  {bool: false, str: 'Project handles "when this sprite clicked" events.'},
            keyPressed:   {bool: false, str: 'Project handles "when _ key pressed" events.'},
            threeSays:    {bool: false, str: 'Project includes 3 or more "say _ for _ secs" blocks.'},
            changeSize:   {bool: false, str: 'Sprite changes size with the "change size by _" block.'},
            resetSize:    {bool: false, str: 'Sprite initializes its size with the "set size to _" block when the green flag is clicked.'},
        };
        this.extensions = {
            multiEvents:  {bool: false, str: 'One sprite handles multiple kinds of events.'}
        };
    }

    upgrade(fileObj) {
        fileObj.sprites = [];
        for (var sprite of fileObj.children) {
            if (sprite.hasOwnProperty('objName')) {
                if (sprite.scripts !== undefined) {
                    for (var script of sprite.scripts) {
                        script.blocks = script[2];
                        for (var block of script.blocks) {
                            block.opcode = block[0];
                        }
                    }
                }
                else sprite.scripts = [];
                fileObj.sprites.push(sprite);
            }
        }
    }

    checkStage(fileObj) {
        var backdrop = fileObj.costumes[fileObj.currentCostumeIndex];
        this.requirements.newBackdrop.bool = backdrop.costumeName !== 'backdrop1';
        this.requirements.threeSprites.bool = fileObj.info.spriteCount > 2;
    }

    checkScripts(fileObj) {
        var sayCount = 0;
        for (var sprite of fileObj.sprites) {
            var click = false;
            var press = false;
            for (var script of sprite.scripts) {
                var flag  = false;
                var sizeChanged = false;
                for (var block of script.blocks) {
                    if (block.opcode === 'whenGreenFlag')  this.requirements.greenFlag.bool   = flag  = true;
                    if (block.opcode === 'whenClicked')    this.requirements.whenClicked.bool = click = true;
                    if (block.opcode === 'whenKeyPressed') this.requirements.keyPressed.bool  = press = true;
                    if (block.opcode === 'changeSizeBy:')  this.requirements.changeSize.bool = sizeChanged = true;
                    if (block.opcode === 'setSizeTo:' && !sizeChanged && flag) this.requirements.resetSize.bool = true;
                    if (block.opcode === 'say:duration:elapsed:from:') sayCount++;
                    if ((flag && click) || (flag && press) || (click && press)) this.extensions.multiEvents.bool = true;
                }
            }
        }
        this.requirements.threeSays.bool = sayCount > 2;
    }
}