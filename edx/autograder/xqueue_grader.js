
/// Scratch Encore graders
var graders = {
    scratchBasicsL1:        { name: 'M1 - Scratch Basics L2',       file: require('../../grading-scripts-s3/scratch-basics-L1') },
    scratchBasicsL2_create: { name: 'M1 - Scratch Basics L3',       file: require('../../grading-scripts-s3/scratch-basics-L2') },
    eventsL1:               { name: 'M2 - Events L1',               file: require('../../grading-scripts-s3/events-L1-syn') },
    eventsL2_create:        { name: 'M2 - Events L2',               file: require('../../grading-scripts-s3/events-L2') },
    animationL1:            { name: 'M3 - Animation L1',            file: require('../../grading-scripts-s3/animation-L1') },
    animationL2_create:     { name: 'M3 - Animation L2',            file: require('../../grading-scripts-s3/animation-L2') },
    condLoopsL1:            { name: 'M4 - Conditional Loops L1',    file: require('../../grading-scripts-s3/cond-loops-L1-syn') },
    condLoopsL2_create:     { name: 'M4 - Conditional Loops L2',    file: require('../../grading-scripts-s3/cond-loops-L2') },
    decompL1:               { name: 'M5 - Decomp. by Sequence L1',  file: require('../../grading-scripts-s3/decomp-L1') },
    decompL2_create:        { name: 'M5 - Decomp. by Sequence L2',  file: require('../../grading-scripts-s3/decomp-L2') },
    oneWaySyncL1:           { name: 'M6 - One-Way Sync L1',         file: require('../../grading-scripts-s3/one-way-sync-L1') },
    oneWaySyncL2_create:    { name: 'M6 - One-Way Sync L2',         file: require('../../grading-scripts-s3/one-way-sync-L2') },
    twoWaySyncL1:           { name: 'M7 - Two-Way Sync L1',         file: require('../../grading-scripts-s3/two-way-sync-L1') },
    complexConditionalsL1:  { name: 'M8 - Complex Conditionals L1', file: require('../../grading-scripts-s3/complex-conditionals-L1') },
};

/// Act 1 graders
var actOneGraders = {
    scavengerHunt: { name: 'M1 - Scavenger Hunt',    file: require('../../act1-grading-scripts/scavengerHunt') },
    onTheFarm:     { name: 'M2 - On the Farm',       file: require('../../act1-grading-scripts/onTheFarm') },
    namePoem:      { name: 'M3 - Name Poem',         file: require('../../act1-grading-scripts/name-poem') },
    ofrenda:       { name: 'M4 - Ofrenda',           file: require('../../act1-grading-scripts/ofrenda') },
    aboutMe:       { name: 'M5 - About Me',          file: require('../../act1-grading-scripts/aboutMe') },
    animalParade:  { name: 'M6 - Animal Parade',     file: require('../../act1-grading-scripts/animal-parade') },
    danceParty:    { name: 'M7 - Dance Party',       file: require('../../act1-grading-scripts/dance-party') },
    knockKnock:    { name: 'M8 - Knock Knock',       file: require('../../act1-grading-scripts/knockKnock') },
    finalProject:  { name: 'M9 - Interactive Story', file: require('../../act1-grading-scripts/final-project') },
};


var allGraders = {};

for (let graderKeyList of [graders, actOneGraders]) {
    for (let graderKey in graderKeyList) {
        allGraders[graderKey] = graderKeyList[graderKey];
    }
}

//Get project from url
function get(url) {
    return new Promise(function (resolve, reject) {
        var XMLHttpRequest = require('xhr2');
        //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = resolve;
        request.onerror = reject;
        request.send();
    });
}



async function gradeOneProject(projectID, report_dict, gradeObj) {
    /// Getting the project page from Scratch so we can see the teacher-facing usernames
    get('https://chord.cs.uchicago.edu/scratch/projectinfo/' + projectID)
        .then(async function (result) {
            var projectInfo = JSON.parse(result.target.response);
            if (projectInfo.length === 0 || projectInfo.targets === undefined){
                    console.log('Error: Project ' + projectID + ' could not be found. Did you enter a valid Scratch project URL?');
                    report_dict['error'] = true;
            }
            else {
              report_dict['error'] = false;
            }
             /// Getting the project file itself
            get('https://chord.cs.uchicago.edu/scratch/project/' + projectID)
            .then(async function (result) {
                var projectJSON = JSON.parse(result.target.response);
                if (projectJSON.targets === undefined) {
                    console.log('Error: Project ' + projectID + ' could not be found');
                    report_dict['error'] = true;
                    return;
                }
                report_dict['error'] = false;
                try {
                    analyze(projectJSON, projectInfo.author.username, projectID, report_dict, gradeObj);
                }
                catch (err) {
                    //console.log('Error grading project ' + projectID);
                    //report_dict['error'] = err;
                    //console.log(err);
                }
            });
        });
}

function analyze(fileObj, user, id, report_dict, gradeObj) {
    try {
        console.log("start_grade_script");
        gradeObj.grade(fileObj, id);
        console.log("end_grade_script");
    }
    catch (err) {
        logger.enableLogger();
        console.log('Error grading project ' + id);
        console.log(err);
        report_dict['error'] = err;
    }
    report(id, gradeObj.requirements, gradeObj.extensions, user, report_dict);


}

function clearReport() {
  return {
                  "projectID": null,
                  "module": null,
                  "error" : false,
                  "progressBar":
                    {
                      "greenbar": {width : "", innerHTML : ""},
                      "yellowbar": {width : "", innerHTML : ""},
                      "redbar": {width : "", innerHTML : ""}
                    },

                  "report":
                    {

                    },
                  "score" : 0

                };
}


/* Returns pass/fail symbol. */
function checkbox(bool) {
    return (bool) ? ('✔️') : ('⬜️');
}


/* Adds results to reports_list and prints. */
function report(projectID, requirements, extensions, projectAuthor, report_dict) {
    let ret_list = [];
    let total_reqs_count = 0;
    let passed_reqs_count = 0;
    let complete_exts = 0;
    let total_exts = 0;

    /* Makes a string list of grading results. */
    ret_list.push('Project ID: <a href="https://scratch.mit.edu/projects/' + projectID + '">' + projectID + '</a>');
    ret_list.push('Creator: <a href="https://scratch.mit.edu/users/' + projectAuthor + '">' + projectAuthor + '</a>');
    ret_list.push('\nTasks');
    for (let x in requirements) {
        total_reqs_count++;
        if (requirements[x].bool) passed_reqs_count++;
        ret_list.push(checkbox(requirements[x].bool) + ' - ' + requirements[x].str);
    }
    if (extensions) {
        ret_list.push('\nIf you are done early:');
        total_exts++;
        for (let x in extensions) {
            if (extensions[x].bool) complete_exts++;
            ret_list.push(checkbox(extensions[x].bool) + ' - ' + extensions[x].str);
        }
    }
    console.log("report_start");
    for (let x in ret_list){
      console.log(ret_list[x]);
    }
    console.log("report_end");
    report_dict = showProgressBar(report_dict, total_reqs_count, passed_reqs_count);

}

/* Update progress bar segment to new proportion. */
function setProgress(name, bar, items, total_items, color) {
    var projectMode = true;
    let width_percent = ((items / total_items) * 100);
    bar['width'] = width_percent + '%';
    if (items && color === 0) {
        if (items !== total_items) bar['innerHTML'] = items;
        if (width_percent === 100) bar['innerHTML'] += 'All tasks done!';
        else if (width_percent >= 15) bar['innerHTML'] += projectMode ?
            items === 1 ?
                ' task done' : ' tasks done'
            : ' done';
    }
    else if (items && color === 1) {
        bar['innerHTML'] = items;
        if (width_percent >= 15) bar['innerHTML'] += projectMode ? '' : ' almost done';
    }
    else if (items && color === 2) {
        bar['innerHTML'] = items;
        if (width_percent >= 15) bar['innerHTML'] += projectMode ?
            items === 1 ?
                ' task not done' : ' tasks not done'
            : ' need time or help';
    }
    console.log(name + ":"  + bar['width'] + ":" + bar['innerHTML']);
}


function showProgressBar(report_dict, total_reqs, complete_reqs) {
    let green = 0;
    let yellow = 0;
    let red = 0;
    let count = 0;
    green = complete_reqs;
    yellow = 0;
    red = total_reqs - complete_reqs;
    count = total_reqs;
    setProgress('green', report_dict['progressBar']['greenbar'], green, count, 0);
    setProgress('yellow', report_dict['progressBar']['yellowbar'], yellow, count, 1);
    setProgress('red', report_dict['progressBar']['redbar'], red, count, 2);
    console.log('score: ' + parseFloat(green / count));

}

//////SCRIPT

async function operate(){
  let myPromise = new Promise(function(myResolve, myReject) {
    run();
  });
  return myPromise;
}

async function run(){
  var myArgs = process.argv.slice(2);
  var this_module = myArgs[0];
  var projectID = myArgs[1];
  var report_dict = clearReport();
  var gradeObj = new allGraders[this_module].file;
  report_dict['module'] = this_module;
  report_dict['projectID'] = projectID;
  try {
    await gradeOneProject(projectID, report_dict, gradeObj);
  }
  catch(err){
    console.log(err);
  }
}
console.log("start")
operate().then(async function (result) {
console.log("end");},
async function (error) {console.log(err);}
);
