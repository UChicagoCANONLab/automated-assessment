require('./sb3');

module.exports.main = function() {
    var json = require('./pirate');
    for (var target_ of json.targets) {
        var target = new Target(target_);
        for (var block_ of target.blocks) {
            var block = new Block(target, block_);
            console.log(block);
        }
    }
}