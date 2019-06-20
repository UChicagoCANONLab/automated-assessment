require('./scratch3');

module.exports.main = function() {
    var project = new Project(require('./pirate'));
    for (var target of project.targets) {
        console.log(target.name);
    }
}

