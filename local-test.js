/// Local tester for grading scripts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs     = require('fs');
const AdmZip = require('adm-zip');

if (process.argv.length < 4) { console.log('Usage: node local-test (path to grading script) (path to .sb3 file) [--verbose]'); return; }
var graderPath  = process.argv[2];
var projectPath = process.argv[3];
var isVerbose   = process.argv.length > 4;

var projectPathIsDirectory = fs.lstatSync(projectPath).isDirectory();

if (projectPathIsDirectory) {
    var fileNames = fs.readdirSync(projectPath);
    if (isVerbose) console.log(fileNames);
    for (var fileName of fileNames.filter(function(fileName) { return /_*\.sb3/g.test(fileName) } )) {
        fullProjectPath = projectPath + '/' + fileName;
        gradeProjectWithGrader(fullProjectPath, graderPath);
    }
}

else /* if (!projectPathIsDirectory) */ {
    gradeProjectWithGrader(projectPath, graderPath);
}

/// Helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gradeProjectWithGrader(projectPath, graderPath) {

    var GraderClass = require(graderPath);
    var grader = new GraderClass();

    var archive = new AdmZip(projectPath);
    var projectJSON = JSON.parse(archive.readAsText('project.json'));
    if (isVerbose) console.log(projectJSON);
    try {
        grader.grade(projectJSON, '');
        console.log('Requirements:');
        for (var item of grader.requirements) console.log(item.str + ': ' + ((item.bool) ? ('✔️') : ('❌')));
        console.log('Extensions:');
        for (var item of grader.extensions)   console.log(item.str + ': ' + ((item.bool) ? ('✔️') : ('❌')));
    }
    
    catch(err) {
        console.log('Error grading project');
        if (isVerbose) console.error(err);
    }

    console.log('');

}