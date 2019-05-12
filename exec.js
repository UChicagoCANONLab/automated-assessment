/// Execute any function that is in its parent file's module.exports.
try {
    const loadedModule = require(process.argv[2]);
    if (!loadedModule) throw new Error('Module ' + process.argv[2] + ' was not found. Please check the file path.');
    const loadedFunction = loadedModule[process.argv[3]];
    if (!loadedFunction) throw new Error('Function ' + process.argv[3] + ' was not found. Make sure that you are exporting it.');
    loadedFunction(...process.argv.slice(4));
}
catch (err) {
    console.log(err);
    console.log('Usage: node exec filePath functionName argument1 argument2 ...');
}