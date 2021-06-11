
/// Scratch Encore graders
var graders = {
    scratchBasicsL1:        { name: 'M1 - Scratch Basics L2',       file: require('./grading-scripts-s3/scratch-basics-L1') },
    scratchBasicsL2_create: { name: 'M1 - Scratch Basics L3',       file: require('./grading-scripts-s3/scratch-basics-L2') },
    eventsL1:               { name: 'M2 - Events L1',               file: require('./grading-scripts-s3/events-L1-syn') },
    eventsL2_create:        { name: 'M2 - Events L2',               file: require('./grading-scripts-s3/events-L2') },
    animationL1:            { name: 'M3 - Animation L1',            file: require('./grading-scripts-s3/animation-L1') },
    animationL2_create:     { name: 'M3 - Animation L2',            file: require('./grading-scripts-s3/animation-L2') },
    condLoopsL1:            { name: 'M4 - Conditional Loops L1',    file: require('./grading-scripts-s3/cond-loops-L1-syn') },
    condLoopsL2_create:     { name: 'M4 - Conditional Loops L2',    file: require('./grading-scripts-s3/cond-loops-L2') },
    decompL1:               { name: 'M5 - Decomp. by Sequence L1',  file: require('./grading-scripts-s3/decomp-L1') },
    decompL2_create:        { name: 'M5 - Decomp. by Sequence L2',  file: require('./grading-scripts-s3/decomp-L2') },
    oneWaySyncL1:           { name: 'M6 - One-Way Sync L1',         file: require('./grading-scripts-s3/one-way-sync-L1') },
    oneWaySyncL2_create:    { name: 'M6 - One-Way Sync L2',         file: require('./grading-scripts-s3/one-way-sync-L2') },
    twoWaySyncL1:           { name: 'M7 - Two-Way Sync L1',         file: require('./grading-scripts-s3/two-way-sync-L1') },
    complexConditionalsL1:  { name: 'M8 - Complex Conditionals L1', file: require('./grading-scripts-s3/complex-conditionals-L1') },
};

/// Act 1 graders
var actOneGraders = {
    scavengerHunt: { name: 'M1 - Scavenger Hunt',    file: require('./act1-grading-scripts/scavengerHunt') },
    onTheFarm:     { name: 'M2 - On the Farm',       file: require('./act1-grading-scripts/onTheFarm') },
    namePoem:      { name: 'M3 - Name Poem',         file: require('./act1-grading-scripts/name-poem') },
    ofrenda:       { name: 'M4 - Ofrenda',           file: require('./act1-grading-scripts/ofrenda') },
    aboutMe:       { name: 'M5 - About Me',          file: require('./act1-grading-scripts/aboutMe') },
    animalParade:  { name: 'M6 - Animal Parade',     file: require('./act1-grading-scripts/animal-parade') },
    danceParty:    { name: 'M7 - Dance Party',       file: require('./act1-grading-scripts/dance-party') },
    knockKnock:    { name: 'M8 - Knock Knock',       file: require('./act1-grading-scripts/knockKnock') },
    finalProject:  { name: 'M9 - Interactive Story', file: require('./act1-grading-scripts/final-project') },
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
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = resolve;
        request.onerror = reject;
        request.send();
    });
}



async function gradeOneProject(projectID) {

    console.log('Grading project ' + projectID);
    /// Getting the project page from Scratch so we can see the teacher-facing usernames
    get('https://chord.cs.uchicago.edu/scratch/projectinfo/' + projectID)
        .then(async function (result) {
            var projectInfo = JSON.parse(result.target.response);
            if (projectInfo.length === 0 || projectInfo.targets === undefined){
                if (!project_count) {
                    console.log('Project ' + projectID + ' could not be found. Did you enter a valid Scratch project URL?');
                    IS_LOADING = false;
                }
            }
             /// Getting the project file itself
            get('https://chord.cs.uchicago.edu/scratch/project/' + projectID)
            .then(async function (result) {
                var projectJSON = JSON.parse(result.target.response);
                if (projectJSON.targets === undefined) {
                    console.log('Project ' + projectID + ' could not be found');
                    return;
                }
                try {
                    analyze(projectJSON, projectInfo.author.username, projectID);
                }
                catch (err) {
                    console.log('Error grading project ' + projectID);
                    /// console.log(err);
                }
            });
        });
}

function analyze(fileObj, user, id) {
    try {
        gradeObj.grade(fileObj, id);
    }
    catch (err) {
        console.log('Error grading project ' + id);
        console.log(err);
    }
    report(id, gradeObj.requirements, gradeObj.extensions, user);

}

function clearReport() {
  return {
                  "progressBar":
                    {
                      "greenbar": {width : "", innerHTML : ""},
                      "yellowbar": {width : "", innerHTML : ""},
                      "redbar": {width : "", innerHTML : ""}
                    },

                  "report":
                    {

                    }

                };
}


/* Returns pass/fail symbol. */
function checkbox(bool) {
    return (bool) ? ('✔️') : ('⬜️');
}


/* Adds results to reports_list and prints. */
function report(projectID, requirements, extensions, projectAuthor) {
    let ret_list = [];
    let project_complete = true;
    let passed_reqs_count = 0;

    /* Makes a string list of grading results. */
    ret_list.push('Project ID: <a href="https://scratch.mit.edu/projects/' + projectID + '">' + projectID + '</a>');
    ret_list.push('Creator: <a href="https://scratch.mit.edu/users/' + projectAuthor + '">' + projectAuthor + '</a>');
    ret_list.push(projectMode ? '\nTasks' : 'Requirements:');
    for (let x in requirements) {
        if (!requirements[x].bool) project_complete = false;
        else passed_reqs_count++;
        ret_list.push(checkbox(requirements[x].bool) + ' - ' + requirements[x].str);
    }
    if (extensions) {
        ret_list.push(projectMode ? '\nIf you are done early:' : 'Extensions:')
        for (let x in extensions) {
            if (extensions[x].bool) complete_exts++;
            ret_list.push(checkbox(extensions[x].bool) + ' - ' + extensions[x].str);
        }
    }
    ret_list.push('');
    return [ret_list, project_complete, passed_reqs_count];

}

/* Update progress bar segment to new proportion. */
function setProgress(bar, items, total_items, color) {
    let width_percent = ((items / total_items) * 100);
    bar['width'] = width_percent + '%';
    if (items && color === 0) {
        if (items !== total_items) bar['innerHTML'] = items;
        if (width_percent === 100) bar['innerHTML'] += projectMode ? 'All tasks done!' : ' done';
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
}


function showProgressBar(report) {
    let green = 0;
    let yellow = 0;
    let red = 0;
    let count = 0;
    console.log('pm');
    green = complete_reqs;
    yellow = 0;
    red = total_reqs - complete_reqs;
    console.log(red);
    count = total_reqs;
    console.log(count);
    setProgress(report['myProgress']['greenbar'], yellow, count, 1);
    setProgress(report['myProgress']['greenbar'], yellow, count, 1);
    setProgress(report['myProgress']['greenbar'], red, count, 2);
}

//////SCRIPT

var myArgs = process.argv.slice(2);
this_module = myArgs[0]
report_dict = clearReport()
graderObj = new allGraders[this_module].file
console.log(report_dict)

return 2
