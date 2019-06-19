/// Provides necessary scripts for index.html.

/// Requirements (scripts)
var graders = {
  scratchBasicsL1: { name: 'Scratch Basics L1',      file: require('./grading-scripts-s3/scratch-basics-L1') },
  animationL1:     { name: 'Animation L1',           file: require('./grading-scripts-s3/animation-L1')      },
  animationL2:     { name: 'Animation L2',           file: require('./grading-scripts-s3/animation-L2')      },
  eventsL1:        { name: 'Events L1',              file: require('./grading-scripts-s3/events-L1')         },
  eventsL2:        { name: 'Events L2',              file: require('./grading-scripts-s3/events-L2')         },
  condLoops:       { name: 'Conditional Loops L1',   file: require('./grading-scripts-s3/cond-loops')        },
  decompL1:        { name: 'Decomp. by Sequence L1', file: require('./grading-scripts-s3/decomp-L1')         },
  oneWaySyncL1:    { name: 'One-Way Sync L1',        file: require('./grading-scripts-s3/one-way-sync-L1')   },
  oneWaySyncL2:    { name: 'Two-Way Sync L2',        file: require('./grading-scripts-s3/two-way-sync-L2')   },
};

/// Globals
///////////////////////////////////////////////////////////////////////////////////////////////////

/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

/* Stores the grade reports. */
var reports_list = [];
/* Number of projects scanned so far. */
var project_count = 0;
/* Number of projects that meet requirements. */
var passing_projects = 0;
/* Number of projects that meet requirements and extensions */
var complete_projects = 0;
/* Grading object. */
var gradeObj = null;

var table = 0;

var IS_LOADING = false;
var numLoadingProjects = 0;

/// HTML helpers
///////////////////////////////////////////////////////////////////////////////////////////////////

/// Helps with form submission.
window.formHelper = function() {
  /// Blocks premature form submissions.
  $("form").submit(function() { return false; });
  /// Maps enter key to grade button.
  $(document).keypress(function(e) { if (e.which == 13) $("#process_button").click(); });
};

/// Populates the unit selector from a built-in list.
window.fill_unitsHTML = function() {
  var HTMLString = '';
  for (var graderKey in graders) {
    HTMLString += '<input type="radio" value="' + graderKey + '" class = "hidden"/>';
    HTMLString += '<label class = "unitlabel">';
    HTMLString += '<a onclick="drop_handler(\'' + graderKey + '\')"> <img src="pictures/' + graderKey + '.png"> </a>';
    HTMLString += graders[graderKey].name;
    HTMLString += '</label>';
  }
  document.getElementById("unitsHTML").innerHTML = HTMLString;
}

/* Initializes html and initiates crawler. */
window.buttonHandler = async function() {
  if(IS_LOADING) {
    return;
  }

  if(!gradeObj) {
    unitError();
    return;
  }

  htmlInit();
  globalInit();
  document.getElementById('wait_time').innerHTML = "loading...";
  IS_LOADING = true;

  var requestURL = document.getElementById('inches_input').value;
  var studioID = parseInt(requestURL.match(/\d+/));
  crawl(studioID, 0, []);
  //crawl(id,1);
}

/* Initializes global variables. */
function globalInit() {
  reports_list = [];
  project_count = 0;
  crawl_finished = false;
  cross_org = true;
  grade_reqs = {};
  passing_projects = 0;
  complete_projects = 0;
}

/* Initializes HTML elements. */
function htmlInit() {
  document.getElementById('process_button').blur();
  clearReport();
  noError();
}

$(document).ready(function(){
  $('.units label').click(function() {
    $(this).addClass('selected').siblings().removeClass('selected');
  });
});

window.drop_handler = function(graderKey) {
  gradeObj = new graders[graderKey].file;
  console.log("Selected " + graders[graderKey].name);
}

window.onclick = function(event) {
  if(event.target.matches('.dropdown_btn')) {
    return;
  }

  var droplinks = document.getElementsByClassName("dropdown_menu");
  [...droplinks].forEach(function(element) {
    if(element.classList.contains('show')) {
      element.classList.remove('show');
    }
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Web crawling
///////////////////////////////////////////////////////////////////////////////////////////////////

function get(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = resolve;
    request.onerror = reject;
    request.send();
  });
}

async function crawl(studioID, offset, projectIDs) {
    if (!offset) console.log('Grading studio ' + studioID);
    get('https://chord.cs.uchicago.edu/scratch/studio/' + studioID + '/offset/' + offset)
    .then(function(result) {
        var studioResponse = JSON.parse(result.target.response);
        /// Keep crawling or return?
        if (studioResponse.length === 0) {
            keepGoing = false;
            project_count = projectIDs.length;
            for (var projectID of projectIDs) {
                gradeProject(projectID);
            }
            IS_LOADING = false;
            return;
        }
        else {
            for (var projectOverview of studioResponse) {
                projectIDs.push(projectOverview.id);
            }
            crawl(studioID, offset + 20, projectIDs);
        }
    });
}

function gradeProject(projectID) {
    console.log('    Grading project ' + projectID);
    get('https://chord.cs.uchicago.edu/scratch/project/' + projectID)
    .then(function(result) {
        var project = JSON.parse(result.target.response);
        if (project.targets === undefined) {
          console.log('Project ' + projectID + ' could not be found');
          return;
        }
        try {
          console.log(project);
          analyze(project, projectID, '');
        }
        catch (err) {
          console.log('Error grading project ' + projectID);
          console.log(err);
        }
        console.log(reports_list);
        printReport();
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

/// Reporting results
///////////////////////////////////////////////////////////////////////////////////////////////////

function addReport(gradeObj, projectID) {
    var reportString = '';
    reportString += 'Project ID: ' + projectID + '\n';
    reportString += 'Requirements:\n'
    for (var requirement in gradeObj.requirements) {
        reportString += gradeObj.requirements[requirement].bool ? '✔️' : '❌';
        reportString += ': ' + gradeObj.requirements[requirement].str + '\n';
    }
    console.log(reportString);
    report(projectID, gradeObj.requirements, gradeObj.extensions, '');

}

/* Prints a line of grading text. */
function appendText(string_list) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  string_list.forEach(function(sub_element) {
    var newContent = document.createTextNode(sub_element);
    tbi.appendChild(newContent);
    var br = document.createElement("br");
    tbi.appendChild(br);
  });

  tbi.style.width = 33 + "%";
  tbi.style.fontSize = "15px";
  tbi.style.display= 'inline-block';

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);

  table++;
  if (table > 2) {
    table = 0;
  }
}

/* Prints a blank line. */
function appendNewLine() {
  var tbi = document.createElement("div");
  tbi.className = "lines";
  tbi.style.padding = "15px";

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);
}

/* Prints out the contents of report_list as a
   series of consecutive project reports. */
function printReport() {
  clearReport();
  sortReport();
  appendNewLine();
  appendNewLine();

  printColorKey();
  showProgressBar();

  table = 0;
  reports_list.forEach(function(element) {
    appendText(element);
    if (table == 0){
      appendNewLine();
    }
  });
  appendNewLine();
  appendNewLine();
  checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
  var removeables = document.getElementsByClassName('lines');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* Prints progress bar. */
function showProgressBar() {
  document.getElementById('myProgress').style.visibility = "visible";
  setProgress(document.getElementById('greenbar'),complete_projects, project_count,0);
  setProgress(document.getElementById('yellowbar'),passing_projects, project_count,1);
  setProgress(document.getElementById('redbar'),project_count-complete_projects-passing_projects, project_count,2);
}

/* Hides progress bar. */
function hideProgressBar() {
  document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key.*/
function printColorKey() {
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.innerHTML = "results:";
}

/* Update progress bar segment to new proportion. */
function setProgress(bar,projects,total_projects,color) {
  var width_percent = ((projects/total_projects)*100);
  bar.style.width = width_percent + '%';
  if (projects != 0 && color == 0) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' done';
  }
  else if (projects != 0 && color == 1) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' almost done';
  }
  else if (projects != 0 && color == 2) {
    bar.innerHTML = projects 
    if (width_percent >= 15) bar.innerHTML += ' need time or help';
  }
}

/* --- Contains project analysis functions. --- */

/* Top-level analysis function; initializes script analysis. */
function analyze(fileObj, user,id) {
  try {
      gradeObj.grade(fileObj,id);     
  }
  catch (err) {
      console.log('Error grading project ' + id);
  }
  report(id, gradeObj.requirements, gradeObj.extensions, user);
  
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
  if (bool) return '✔️';
  else return '❌';
}

/* Adds results to reports_list and prints. */
function report(pID, reqs, exts, user) {
  var ret_list = [];
  var project_complete = true;
  var exts_pass = true;
  var passed_reqs_count = 0;

  /* Makes a string list of grading results. */
  ret_list.push('User: ' + user);
  ret_list.push('Project ID: ' + pID);
  for(var x in reqs) {
      if(!reqs[x].bool) project_complete = false;
      else passed_reqs_count++;

      ret_list.push(checkbox(reqs[x].bool) + 
          ' - ' + reqs[x].str);
  }
  if(exts) {
      ret_list.push('Extensions:')
      for(var x in exts) {
          ret_list.push(checkbox(exts[x].bool) + 
              ' - ' + exts[x].str);
      }
  }
  
  reports_list.push(ret_list);

  /* Adjusts class progress globals. */
  if(project_complete) complete_projects++;
  else if (passed_reqs_count >= (Object.keys(reqs).length / 2))
      passing_projects++;

  printReport();        
}

/* Checks if process is done.  */
function checkIfComplete() {
if(project_count == reports_list.length && crawl_finished) {
  console.log("Done.");
  document.getElementById('wait_time').innerHTML = 'done.';
  IS_LOADING = false;
  $('html, body').animate({
    scrollTop: $("#process_status").offset().top -20
  }, 800);
}
}


/* Sorts the reports in reports_list alphabetically
 username. */
function sortReport() {
reports_list.sort(function(a,b) {
  return a[0].localeCompare(b[0]);
})
}


///////////////////////////////////////////////////////////////////////////////////////////////////

/// Error reports
///////////////////////////////////////////////////////////////////////////////////////////////////

function linkError() {
  document.getElementById('myProgress').style.visibility = "hidden";
  var processObj = document.getElementById('process_error');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "error: invalid link.";
  document.getElementById('wait_time').innerHTML = "";
  IS_LOADING = false;
}

function unitError() {
  var processObj = document.getElementById('process_error');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "error: no unit selected.";
  IS_LOADING = false;
}

function noError() {
  document.getElementById('process_error').innerHTML = "";
  document.getElementById('process_error').style.visibility = 'hidden';
}

///////////////////////////////////////////////////////////////////////////////////////////////////