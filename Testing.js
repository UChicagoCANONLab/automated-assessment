class GradeTesting{
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }
    
    initMetrics() { //initialize all metrics to falsethis.initMetrics();
        var fred  = this.findSprite(fileObj, 'Fred');
        var helen = this.findSprite(fileObj, 'Helen');
        this.checkFred(fred);
        this.checkHelen(helen);
        this.checkExtensions(fileObj);
    }
}