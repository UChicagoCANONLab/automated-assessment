/// Provides necessary scripts for HTML indices.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// Scratch Encore graders
let graders = {
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
let actOneGraders = {
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

let allGraders = {};
for (let graderKeyList of [graders, actOneGraders]) {
    for (let graderKey in graderKeyList) {
        allGraders[graderKey] = graderKeyList[graderKey];
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

let projectMode = 0;
window.useProjectMode = function() {
    projectMode = 1;
}

/* Stores the grade reports. */
let reports_list = [];
/* Number of projects scanned so far. */
let project_count = 0;
    /* Number of requirements of single project. */
    let total_reqs = 0;
    /* Number of completed requirements of single project. */
    let complete_reqs = 0;
    /* Number of extensions of single project. */
    let total_exts = 0;
    /* Number of completed extensions of single project. */
    let complete_exts = 0;
/* Number of projects that meet requirements. */
let passing_projects = 0;
/* Number of projects that meet requirements and extensions */
let complete_projects = 0;
/* Grading object. */
let gradeObj = null;

let IS_LOADING = false;

/* Experimental feature */
let downloadEnabled = false;

///////////////////////////////////////////////////////////////////////////////////////////////////

/// HTML helpers
///////////////////////////////////////////////////////////////////////////////////////////////////

/// Helps with form submission.
window.formHelper = function () {
    /// Blocks premature form submissions.
    $("form").submit(function () { return false; });
    /// Maps enter key to grade button.
    $(document).keypress(function (e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fillUnitsHTML = function() {
    let HTMLString = '';
    for (let graderKey in graders) {
        let graderName = graders[graderKey].name;
        let isCreate = graderKey.includes('create');
        if (!isCreate) {
            HTMLString += '<br><hr>';
            HTMLString += '<label class = "unit_name">';
            HTMLString += graderName.substring(0, graderName.length - 2);
            HTMLString += '</label>'
        }
        HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>';
        HTMLString += '<label class = "unitlabel">';
        if (isCreate) {
            HTMLString += '<img src = "pictures/create.png">';
            HTMLString += graderName.substring(graderName.length - 2);
            HTMLString += ' Create';
        }
        else {
            HTMLString += '<img src="pictures/' + graderKey.substring(0, graderKey.length - 2) + '.png">';
            HTMLString += graderName.substring(graderName.length - 2);
            HTMLString += ' Modify';
        }
        HTMLString += '</label> </a>';
    }
    HTMLString += '<hr>';
    document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/////////////// grader function for act 1 ////////////////////
window.fillUnitsHTMLAct1 = function() {
    let HTMLString = '';
    for (let graderKey in actOneGraders) {
        HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')" class = unitselector>'
        HTMLString += '<label class = "unitlabel">';
        HTMLString += '<img src="pictures/' + graderKey + '.png">';
        HTMLString += actOneGraders[graderKey].name;
        HTMLString += '</label> </a>';
    }
    document.getElementById("unitsHTML").innerHTML = HTMLString;
}
////////////// grader function for act 1 ////////////////////

/* Initializes html and initiates crawler. */
window.buttonHandler = async function () {
    if (IS_LOADING) return;
    if (!gradeObj) return unitError();
    init();
    document.getElementById('wait_time').innerHTML = "Loading...";
    IS_LOADING = true;
    let requestURL = document.getElementById('inches_input').value;
    let itemID = parseInt(requestURL.match(/\d+/));
    await crawlOrGrade(itemID);
}

/* Initializes global variables. */
function init() {

    /// HTML
    document.getElementById('process_button').blur();
    clearReport();
    noError();
    hideProgressBar();

    /// Globals
    reports_list = [];
    project_count = 0;
    crawl_finished = false;
    cross_org = true;
    grade_reqs = {};
    total_reqs = 0;
    complete_reqs = 0;
    total_exts = 0;
    complete_reqs = 0;
    passing_projects = 0;
    complete_projects = 0;
}

$(document).ready(function () {
    $('.unitselector').click(function () {
        $(this).addClass('selected');
        $(this).children().addClass('selected');
        $(this).siblings().removeClass('selected');
        $(this).siblings().children().removeClass('selected');
    });
});

window.drop_handler = function (graderKey) {
    gradeObj = new allGraders[graderKey].file;
    console.log("Selected " + allGraders[graderKey].name);
    document.getElementById("selectedUnit").innerHTML = 'Grading ' + allGraders[graderKey].name;
}

window.onclick = function (event) {
    if (event.target.matches('.dropdown_btn')) {
        return;
    }

    if (event.target.matches('#process_button')) {
        $('html, body').animate({
            scrollTop: 1400
        }, 300);
    }

    let droplinks = document.getElementsByClassName("dropdown_menu");
    [...droplinks].forEach(function (element) {
        if (element.classList.contains('show')) {
            element.classList.remove('show');
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Project retrieval and grading
///////////////////////////////////////////////////////////////////////////////////////////////////

class ProjectIdentifier {
    constructor(projectOverview) {
        this.id = projectOverview.id;
        this.author = projectOverview.author;
        this.username = 'Scratcher ' + this.author;
    }
}

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

    console.log('Grading project with aws ' + projectID);
    /// Getting the project metadata from Scratch API through TurboWarp
    const metadataResponse = await fetch(`https://trampoline.turbowarp.org/api/projects/${projectID}`);
    if (metadataResponse.status === 404) {
        throw new Error('The project is unshared or does not exist');
    }
    if (!metadataResponse.ok) {
        throw new Error(`HTTP error ${metadataResponse.status} fetching project metadata`);
    }
    const metadata = await metadataResponse.json();
    console.log(metadata);

    /// Getting the project JSON using project ID and token
    const token = metadata.project_token;
    const projectResponse = await fetch(`https://projects.scratch.mit.edu/${projectID}?token=${token}`);
    if (!projectResponse.ok) {
        throw new Error(`HTTP error ${projectResponse.status} fetching project data`);
    }
    const projectJSON = await projectResponse.json();
    console.log(projectJSON);

    analyze(projectJSON, '', projectID);
    printReportList();

    // get('https://backend-quantime.link/get_project?projectID=' + projectID)
    // .then(async function (result) {
    //     console.log(result.target)
    //     var projectJSON = JSON.parse(result.target.response);
    //     analyze(projectJSON, '', projectID);
    //     printReportList();
    // });

    // get('https://api.scratch.mit.edu/projects/' + projectID)
    //     .then(async function (result) {
    //         var projectInfo = JSON.parse(result.target.response);
    //         console.log("token received")
    //         if (projectInfo.length === 0 || projectInfo.targets === undefined){
    //             if (!project_count) {
    //                 document.getElementById('wait_time').innerHTML =
    //                 'Project ' + projectID + ' could not be found. Did you enter a valid Scratch project URL?';
    //                 IS_LOADING = false;
    //                 hideColorKey();                    
    //             }
    //         }

    //         /// Using project ID and token download project JSON file only via Scratch API
    //         projectToken = projectInfo.project_token
    //         projectAuthor = projectInfo.author.username
    //         get('https://projects.scratch.mit.edu/' + projectID + '?token=' + projectToken)
    //         .then(async function (result) {
    //             var projectJSON = JSON.parse(result.target.response);
    //             try {
    //                 analyze(projectJSON, projectAuthor, projectID);
    //             }
    //             catch (err) {
    //                 console.log('Error grading project ' + projectID);
    //                 /// console.log(err);
    //             }
    //             printReportList();
    //         });
    //     });
}

async function crawl(studioID, offset, projectIdentifiers) {
    if (!offset) console.log('Grading studio ' + studioID);
    get('https://backend-quantime.link/get_studio?studioID=' + studioID)
        .then(async function (result) {
            let studioResponse = JSON.parse(result.target.response);
            for (let projectIdentifier of studioResponse) {
                    console.log(projectIdentifier)
                    await gradeStudioProject(projectIdentifier);
                    if (downloadEnabled) await new Promise((resolve, reject) => setTimeout(resolve, 300));
            }
            return;

        });
}

async function gradeStudioProject(projectIdentifier) {
    let projectID = projectIdentifier.id;
    let projectAuthor = projectIdentifier.author;
    console.log('Grading project ' + projectID);
    /// Getting the project page from Scratch so we can see the teacher-facing usernames
    get('https://backend-quantime.link/get_project?projectID=' + projectID)
        .then(async function (result) {
            let projectJSON = JSON.parse(result.target.response);
            try {
                analyze(projectJSON, projectAuthor, projectID);
            }
            catch (err) {
                console.log('Error grading project ' + projectID);
                /// console.log(err);
            }
            printReportList();
        });

    // get('https://api.scratch.mit.edu/projects/' + projectID)
    //     .then(async function (result) {
    //         let projectInfo = JSON.parse(result.target.response);
    //         if (projectInfo.length === 0 || projectInfo.targets === undefined) {
    //             if (!project_count) {
    //                 document.getElementById('wait_time').innerHTML = `Project ${projectID} could not be found. Did you enter a valid Scratch project URL?`;
    //                 IS_LOADING = false;
    //                 hideColorKey();
    //             }
    //         }
    //         /// Using project ID and token download project JSON file only via Scratch API
    //         projectToken = projectInfo.project_token
    //         projectAuthor = projectInfo.author.username
    //         get('https://projects.scratch.mit.edu/' + projectID + '?token=' + projectToken)
    //         .then(async function (result) {
    //             let projectJSON = JSON.parse(result.target.response);
    //             try {
    //                 analyze(projectJSON, projectAuthor, projectID);
    //             }
    //             catch (err) {
    //                 console.log('Error grading project ' + projectID);
    //                 /// console.log(err);
    //             }
    //             printReportList();
    //         });
    //     });
}

// function downloadProject(projectID, projectJSON) {
//     let hiddenElement = document.createElement('a');
//     hiddenElement.style.display = 'none';
//     hiddenElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(projectJSON));
//     hiddenElement.setAttribute('download', projectID);
//     document.body.appendChild(hiddenElement);
//     hiddenElement.click();
//     document.body.removeChild(hiddenElement);
//     console.log('Downloaded ' + projectID);
//     return;
// }

function analyze(fileObj, user, id) {
    try {
        gradeObj.grade(fileObj, id);
    }
    catch (err) {
        console.log('Error grading project ' + id);
        console.log(err);
    }
    report(id, gradeObj.requirements, gradeObj.extensions, user);
    project_count++;
    console.log(project_count);

}

async function crawlOrGrade(itemID) {
    console.log(projectMode);
    if (projectMode) {
        return gradeOneProject(itemID);
    }
    else {
        return crawl(itemID, 0, []);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Reporting results
///////////////////////////////////////////////////////////////////////////////////////////////////

/* Prints a line of grading text. */
function appendText(string_list) {
    let tbi = document.createElement("div");
    tbi.className = "dynamic";

    let HTMLString = '';
    for (let string of string_list) {
        HTMLString += '<br>';
        HTMLString += string;
    }
    HTMLString += '<br>';

    tbi.style.width = "100%";
    tbi.style.fontSize = "14px";
    tbi.style.fontWeight = "normal";
    tbi.innerHTML = HTMLString;

    let ai = document.getElementById("report");
    document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a series of consecutive project reports. */
function printReportList() {
    clearReport();
    sortReport();
    printColorKey();
    showProgressBar();
    for (let report of reports_list) {
        appendText(report);
    }
    checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
    let removeables = document.getElementsByClassName('dynamic');
    while (removeables[0]) {
        removeables[0].remove();
    }
    removeables = document.getElementsByClassName('lines');
    while (removeables[0]) {
        removeables[0].remove();
    }
}

/* Prints progress bar. */
function showProgressBar() {
    let green = 0;
    let yellow = 0;
    let red = 0;
    let count = 0;
    if (projectMode) {
        console.log('pm');
        green = complete_reqs;
        yellow = 0;
        red = total_reqs - complete_reqs;
        console.log(red);
        count = total_reqs;
        console.log(count);
    }
    else {
        green = complete_projects;
        yellow = passing_projects;
        red = project_count - (complete_projects + passing_projects);
        count = project_count;
    }
    document.getElementById('myProgress').style.visibility = "visible";
    setProgress(document.getElementById('greenbar'), green, count, 0);
    setProgress(document.getElementById('yellowbar'), yellow, count, 1);
    setProgress(document.getElementById('redbar'), red, count, 2);
}

/* Hides progress bar. */
function hideProgressBar() {
    document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key.*/
function printColorKey() {
    let processObj = document.getElementById('process_status');
    processObj.style.visibility = 'visible';
    processObj.innerHTML = "results:";
}

function hideColorKey() {
    var processObj = document.getElementById('process_status');
    processObj.style.visibility = 'hidden';
}

/* Update progress bar segment to new proportion. */
function setProgress(bar, items, total_items, color) {
    let width_percent = ((items / total_items) * 100);
    bar.style.width = width_percent + '%';
    if (items && color === 0) {
        if (items !== total_items) bar.innerHTML = items;
        if (width_percent === 100) bar.innerHTML += projectMode ? 'All tasks done!' : ' done';
        else if (width_percent >= 15) bar.innerHTML += projectMode ? 
            items === 1 ?
                ' task done' : ' tasks done' 
            : ' done';
    }
    else if (items && color === 1) {
        bar.innerHTML = items;
        if (width_percent >= 15) bar.innerHTML += projectMode ? '' : ' almost done';
    }
    else if (items && color === 2) {
        bar.innerHTML = items;
        if (width_percent >= 15) bar.innerHTML += projectMode ?
            items === 1 ?
                ' task not done' : ' tasks not done' 
            : ' need time or help';
    }
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
    reports_list.push(ret_list);

    /* Adjusts progress globals. */
    total_reqs = Object.keys(requirements).length;
    if (project_complete) complete_projects++;
    else if (passed_reqs_count >= (Object.keys(requirements).length / 2)) passing_projects++;
    complete_reqs = passed_reqs_count;
}

/* Checks if process is done.  */
function checkIfComplete() {
    if (project_count) document.getElementById('wait_time').innerHTML = '';
    else document.getElementById('wait_time').innerHTML = `No Scratch 3.0+ projects found. Did you enter a valid Scratch ${projectMode ? 'project' : 'studio'} URL?`;
    IS_LOADING = false;
    console.log("Done.");
}

/* Sorts the reports in reports_list alphabetically by username. */
function sortReport() {
    reports_list.sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Error reports
///////////////////////////////////////////////////////////////////////////////////////////////////

function linkError() {
    document.getElementById('myProgress').style.visibility = "hidden";
    let processObj = document.getElementById('process_error');
    processObj.style.visibility = 'visible';
    processObj.style.color = "red";
    processObj.innerHTML = "error: invalid link.";
    document.getElementById('wait_time').innerHTML = "";
    IS_LOADING = false;
}

function unitError() {
    let processObj = document.getElementById('process_error');
    processObj.style.visibility = 'visible';
    processObj.style.color = "red";
    processObj.innerHTML = "Please select a unit.";
    IS_LOADING = false;
}

function noError() {
    document.getElementById('process_error').innerHTML = "";
    document.getElementById('process_error').style.visibility = 'hidden';
}

///////////////////////////////////////////////////////////////////////////////////////////////////
