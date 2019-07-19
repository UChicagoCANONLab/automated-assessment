require('../grading-scripts-s3/scratch3');
var fs = require('fs');
var arrayToCSV = require('./array-to-csv');

module.exports = class {

    /// Initializes the grader's properties.
    init(json) {
        if (no(json)) return false;
        this.requirements = {};
        this.extensions = {};
        this.info = {
            numSprites: { val: 0, str: 'Number of sprites in project'                               },
            numScripts: { val: 0, str: 'Number of scripts in project: '                             },
            numBlocks:  { val: 0, str: 'Number of blocks in scripts: '                              },
            lDistance:  { val: 0, str: 'Number of blocks that are not present in original project'  }
        }
        return true;
    }

    /// Measures the complexity of the project JSON and compares it to the Scratch Encore original.
    grade(json, originalJson) {
        if (!this.init(json)) return;
        var project         = new Project(json,         this);
        var originalProject = new Project(originalJson, this);
        for (var sprite of project.sprites) {
            this.info.numSprites.val++;
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1
            )) {
                this.info.numScripts.val++;
                for (var block of script.blocks) {
                    this.info.numBlocks.val++;
                }
            }
        }

        /// Calculate minimum lDistance for each script and sum them up.
        var distanceSum = 0;
        for (var sprite of project.sprites) {
            for (var script of sprite.scripts.filter(
                script => script.blocks[0].opcode.includes('event_when') && script.blocks.length > 1)) {
                var opcodeArray = [];
                for (var block of script.blocks) {
                    opcodeArray.push(block.opcode);
                }

                /// Find the minimum distance (i.e. the best match, most probable origin, etc.).
                var minScriptDistance = 1000 * script.blocks.length;
                for (var originalSprite of originalProject.sprites) {
                    for (var originalScript of originalSprite.scripts) {
                        var originalOpcodeArray = [];
                        for (var originalBlock of originalScript.blocks) {
                            originalOpcodeArray.push(originalBlock.opcode);
                        }
                        var scriptDistance = lDistance(opcodeArray, originalOpcodeArray);
                        //console.log(scriptDistance);
                        if (minScriptDistance > scriptDistance) minScriptDistance = scriptDistance;
                    }
                }
                distanceSum += minScriptDistance;
                this.info.lDistance.val = distanceSum;
            }
        }
    }
}

/// Measures the Levenshtein distance between two Arrays.
function lDistance(arr1, arr2) {

    /// Initialize distance matrix.
    var dMatrix = [];
    for (var i = 0; i <= arr1.length; i++) {
        var column = [];
        for (var j = 0; j <= arr2.length; j++) {
            var value = 0;
            if (!i) value = j;
            if (!j) value = i;
            column.push(value);
        }
        dMatrix.push(column);
    }

    for (var j = 1; j <= arr2.length; j++) {
        for (var i = 1; i <= arr1.length; i++) {
            var swapCost = Number(arr1[i - 1] !== arr2[j - 1]);
            dMatrix[i][j] = Math.min(
                dMatrix[i - 1][j    ] + 1,
                dMatrix[i    ][j - 1] + 1,
                dMatrix[i - 1][j - 1] + swapCost
            );
        }
    }
    return dMatrix[arr1.length][arr2.length];
}

/// Creates a directory if it's not there yet and notifies the user.
function installDir(dirname) {
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
        console.log('Created directory ' + dirname + '.');
    }
}

/// Outputs true if two objects are equal.
function areEqual(a, b) {
    if ((a === undefined || b === undefined) && a !== b) return false;
    if (a === b) return true;
    for (var x in a) {
        if (a[x] !== b[x]) {
            return false;
        }
        else {
            return areEqual(a[x], b[x]);
        }
    }
    for (var y in b) {
        if (a[y] !== b[y]) {
            return false;
        }
        else {
            return areEqual(a[y], b[y]);
        }
    }
    return true;
}

/// Assesses complexity of projects and compares them to their original versions.
function main() {

    /// Checks to make sure that all the necessary directories are present.
    installDir('./test-original');
    installDir('./test-classes');
    installDir('./test-results');

    /// 2D array spine. Each cell will contain a row of the table.
    var rows = [];

    /// Populates the first row of the table with headers.
    var headerRow = [
        'Class', '# Projects', '# Sprites', '# Scripts', '# Blocks', 'L. Distance'
    ];
    rows.push(headerRow);

    /// Gets the JSON of the original Scratch project (usually by ScratchEncore).
    var originalFilename = fs.readdirSync('./test-original')[0];
    if (originalFilename === undefined) {
        console.error('Please place the original JSON file in ./test-original.');
        return;
    }
    var originalFileJSON = JSON.parse(fs.readFileSync('./test-original/' + originalFilename, 'utf8'));
    
    /// Now we look into ./test-classes for folders to assess.
    var foldernames = fs.readdirSync('./test-classes');
    if (foldernames === []) {
        console.error('Please place folders containing student JSON files in ./test-classes.');
        return;
    }
    for (var foldername of foldernames) {

        /// Bookkeeping.
        var numProjects = 0;
        var dummyGrader = new module.exports();
        dummyGrader.init(1);

        /// Look through all the files in the class subfolder.
        var filenames = fs.readdirSync('./test-classes/' + foldername);
        if (filenames.length) {
            for (var filename of filenames) {
                /// Get the results from the file.
                var fileJSON = JSON.parse(fs.readFileSync('./test-classes/' + foldername + '/' + filename, 'utf8'));
                var grader = new module.exports();
                grader.grade(fileJSON, originalFileJSON);
        
                /// Update our counts.
                numProjects++;
                for (var infoItem in grader.info) {
                    dummyGrader.info[infoItem].val += grader.info[infoItem].val;
                }
            }
        }

        /// Create a new row of the table.
        var currentRow = [];

        /// Fill in the row with our info.
        currentRow.push(foldername);
        currentRow.push(numProjects);
        var divisor = numProjects ? numProjects : 1;
        for (var infoItem in dummyGrader.info) {
            currentRow.push(dummyGrader.info[infoItem].val / divisor);
        }

        /// Push the row to the table.
        rows.push(currentRow);
    }

    /// Finally, we save the table as a .csv file.
    arrayToCSV(rows, './test-results/results.csv');
}

main();