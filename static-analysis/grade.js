/// Local tester for grading scripts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Zack Crenshaw
//Adapted from code by Max White

const fs  = require('fs');

var graderPath  = process.argv[2];
var projectPath = process.argv[3];
var resultsFile = process.argv[4];
var isVerbose = false;

//check for verbose flag
if (process.argv.length > 5) {
    isVerbose = true;
}


//Check if project is directory
var projectPathIsDirectory = fs.lstatSync(projectPath).isDirectory();


//Wipe the results file to allow for new assessment
fs.writeFile(resultsFile, "", function (err) {
    if (err) throw err;
});



//If project path is a directory, iterate the test over all files
if (projectPathIsDirectory) {
    var fileNames = fs.readdirSync(projectPath);
    for (var fileName of fileNames.filter(function(fileName) { return /_*\.json/g.test(fileName) } )) {
        fullProjectPath = projectPath + '/' + fileName;
        var studentID = fileName.replace(".json","");
        gradeProjectWithGrader(fullProjectPath, graderPath,isVerbose,resultsFile,studentID);
    }
}

//If not, just run it once on the file
else /* if (!projectPathIsDirectory) */ {
    gradeProjectWithGrader(projectPath, graderPath,isVerbose,resultsFile);
}



/// Helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gradeProjectWithGrader(projectPath, graderPath,isVerbose,resultsFile) {

    var GraderClass = require(graderPath);
    var grader = new GraderClass();

    //Get JSON data
    var rawdata = fs.readFileSync(projectPath);  
    var projectJSON = JSON.parse(rawdata); 
    
    var output = "" + studentID + "\n";

    //Run grade and output results
    try {
        grader.grade(projectJSON, '');
        output += "Requirements:\n";
        if (thereExists(grader.requirements)) {
            for (var item of Object.values(grader.requirements)) {
                output += item.str + ',' + ((item.bool) ? (1) : (0)) + "\n";
            }
        }
        output += "Extensions:\n";
        if (thereExists(grader.extensions)) {
            for (var item of Object.values(grader.extensions)) {
                output += item.str + ',' + ((item.bool) ? (1) : (0)) + "\n";
            }
        }
    }
    //If there was an error, report it
    catch(err) {
        output += "Error grading project\n";
        //fs.appendFileSync(resultsFile,"Error grading project\n");
    }

    output += "|\n"; //add delimiter 

    if (isVerbose) { //if verbose flag, output the results to the console
        console.log(output)
    }

    //write the output to the file
    fs.appendFileSync(resultsFile,output)


}

function thereExists(it) {
    return (it !== undefined && it !== null && it !== {});
}
  
  