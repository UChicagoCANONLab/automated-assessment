/// Local tester for grading scripts
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Reformatted to make use of object to csv library
// Adapted from code by Zack Crenshaw
// Adapted from code by Max White

const fs  = require('fs');
const ObjectsToCsv = require('objects-to-csv');

var graderPath  = process.argv[2];
var projectPath = process.argv[3];
var resultsFile = process.argv[4];
var isVerbose = false;

data = []

//check for verbose flag
if (process.argv.length > 5) {
    isVerbose = true;
}


//Check if project is directory

var projectPathIsDirectory = fs.lstatSync(projectPath).isDirectory();


//Wipe the results file to allow for new assessment
fs.writeFile(resultsFile, "", err => {
    if (err) throw err;
});


//If project path is a directory, iterate the test over all files
if (projectPathIsDirectory) {
    var fileNames = fs.readdirSync(projectPath);
    for (var fileName of fileNames.filter(name => /_*\.json/g.test(name) )) {
        fullProjectPath = projectPath + '/' + fileName;
        var studentID = fileName.replace(".json","");
        gradeProjectWithGrader(fullProjectPath, graderPath, isVerbose, resultsFile, studentID);
    }
}

//If not, just run it once on the file
else {
    gradeProjectWithGrader(projectPath, graderPath, isVerbose, resultsFile);
}

// converting json to csv file, moving the row with the most columns to the top
// so that the conversion module functions properly
var largestRowIndex = data.map(row => Object.keys(row).length)
                          .reduce((a, b, i) => a[0] < b? [b, i] : a, [Number.MIN_VALUE, -1])[1];
var tmp = data[0];

data[0] = data[largestRowIndex];

data[largestRowIndex] = tmp;
try {
    new ObjectsToCsv(data).toDisk(resultsFile);
}
catch(err) {
    console.log(data);
}


/// Helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gradeProjectWithGrader(projectPath, graderPath,isVerbose,resultsFile,studentID) {

    var GraderClass = require(graderPath);
    var grader = new GraderClass();

    //Get JSON data
    var rawdata = fs.readFileSync(projectPath);  
    var projectJSON = JSON.parse(rawdata); 
    var row = {ID: studentID, ['Error grading project']: 0};

    
    if (isVerbose) console.log(studentID);

    
    //Run grade and output results
    try {
        grader.grade(projectJSON, '');

        if (thereExists(grader.requirements)) {
            
            for (var item of Object.values(grader.requirements)) {
                row[item.str] = ((item.bool) ? (1) : (0));
            }
        }
        /*
        if (thereExists(grader.extensions)) {
            for (var item of Object.values(grader.extensions)) {
                row[item.str] = ((item.bool) ? (1) : (0));
            }
        } 
        */
    }
    //If there was an error, report it
    catch(err) {
        row['Error grading project'] = 1;

        console.log('Error grading project:', studentID)
        console.log(err);
    }

    if (isVerbose) { //if verbose flag, output the results to the console
        console.log(row)
    }
    
    data.push(row);
    //write the output to the file
    //fs.appendFileSync(resultsFile,output)


}

function thereExists(it) {
    return (it !== undefined && it !== null && it !== {});
}
  
  