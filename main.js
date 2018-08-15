/* MAKE SURE OBJ'S AUTO INITIALIZE AT GRADE */

/* Stores strings to be printed. */
var reports_list = [];
/* Number of projects scanned so far. */
var project_count = 0;
/* Cross-origin request permissibility [UNUSED]*/
var cross_org = true;
/* Sets to true when next page returns 404. */
var crawl_finished = false;
/* Number of projects that meet requirements. */
var passing_projects = 0;
/* Number of projects that meet requirements and extensions */
var complete_projects = 0;
/* Grading object. */
var gradeObj = null;

/*
	GRADE BUTTON
*/

/* Initializes html and initiates crawler. */
function buttonHandler() {
	if(!gradeObj) {
		unitError();
		return;
	}

	if(document.getElementById('wait_time').innerHTML == "Loading...") {
		return;
	}
	document.getElementById('wait_time').innerHTML = "Loading...";

	htmlInit();
	globalInit();
  hideProgressBar();
		
	var requestURL = document.getElementById('inches_input').value;
	var id = crawlFromStudio(requestURL);
	crawl(id,1);
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

/*
	DROP DOWN MENU
*/

/* Shows drop down menu. */
function dropdownHandler() {
  document.getElementById("unit_dropdown").classList.toggle("show");
}

/* Module select handlers (from dropdown): */
function drop_eventHandler() {
  document.getElementById("module_button").value = 'Events';
  gradeObj = new GradeEvents();
  console.log("Grading Events");
}

function drop_condloopsHandler() {
  document.getElementById("module_button").value = 'Conditional Loops';
  gradeObj = new GradeCondLoops();
  console.log("Grading Conditional Loops");
}

function drop_decompbyseqp1Handler() {
   document.getElementById("module_button").value = 'Decomposition by Sequence';
   gradeObj = new GradeDecompBySeqP1();
   console.log("Grading Decomposition By Sequence");
}

function drop_onewaysyncp1Handler() {
  document.getElementById("module_button").value = 'One-Way Sync [Part 1]';
   gradeObj = new GradeOneWaySyncP1();
   console.log("Grading One Way Sync Pt. 1");
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

/*
	DISPLAY RESULTS
*/

/* Prints a line of grading text. */
function appendText(string) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  var newContent = document.createTextNode(string);

  tbi.appendChild(newContent);
  tbi.style.paddingLeft = "" + (window.innerWidth/2 - 130) + "px";
  tbi.style.font = "1rem 'Verdana', sans-serif";
  tbi.style.fontSize = "14px";

  var ai = document.getElementById("report");
  document.body.insertBefore(tbi, ai);
}

/* Prints a blank line. */
function appendNewLine() {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";
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
  
  reports_list.forEach(function(element) {
    element.forEach(function(sub_element) {
      appendText(sub_element);
    });
    appendNewLine();
  });
  checkIfComplete();
}

/* Clears all project reports from the page. */
function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* Prints prorgess bar. */
function showProgressBar() {
  document.getElementById('myProgress').style.visibility = "visible";
  setProgress(document.getElementById('greenbar'),complete_projects, project_count);
  setProgress(document.getElementById('yellowbar'),passing_projects, project_count);
  setProgress(document.getElementById('redbar'),project_count-complete_projects-passing_projects, project_count);
}

function hideProgressBar() {
  document.getElementById('myProgress').style.visibility = "hidden";
}

/* Prints color key. */
function printColorKey() {
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.style.color = "black";
  processObj.innerHTML = "Green - Complete; Yellow - Passing; Red - Failing";
}

/* Update progress bar segment to new proportion. */
function setProgress(bar,projects,total_projects) {
  bar.style.width = ((projects/total_projects)*100) + '%';
  bar.innerHTML = projects + '';
}

/* 
	ERROR REPORTS 
*/

function linkError() {
  hideProgressBar();
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "Error: invalid link.";
  document.getElementById('wait_time').innerHTML = "Studio links are generally\
  of the form: <br /> <span class = 'link'> https://scratch.mit.edu/studios/[id number]/</span>";
}

function unitError() {
  var processObj = document.getElementById('process_status');
  processObj.style.visibility = 'visible';
  processObj.style.color = "red";
  processObj.innerHTML = "Error: No unit selected.";
}

function noError() {
  document.getElementById('process_status').innerHTML = "";
  document.getElementById('process_status').style.visibility = 'hidden';
}