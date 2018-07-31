/* Stores the grade reports. */
var reports_list = [];
/* Requirements dictionary. */
var grade_reqs = {};
/**/
var project_count = 0;
/* Cross-origin request permissibility UNUSED*/
var cross_org = true;

var crawl_finished = false;

/* Initializes html and initiates crawler. */
function buttonHandler() {
  if(document.getElementById('wait_time').innerHTML == "Loading...") {
    return;
  }
  document.getElementById('process_button').blur();
  clearReport();
  reports_list = [];
  project_count = 0;
  crawl_finished = false;
  cross_org = true;
  grade_reqs = {};

  noError();
  document.getElementById('wait_time').innerHTML = "Loading...";
  
	
	var requestURL = document.getElementById('inches_input').value;
	crawlFromStudio(requestURL);
}

/* Request project jsons and initiate analysis. */
function getJSON(requestURL,process_function, args){
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		var project = request.response;
    args.unshift(project)
		process_function.apply(null,args);
	}
}

/* Prints a line of grading text. */
function appendText(string) {
  var tbi = document.createElement("div");
  tbi.className = "dynamic";

  var newContent = document.createTextNode(string);

  tbi.appendChild(newContent);
  tbi.style.paddingLeft = "" + (window.innerWidth/2 - 190) + "px";
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
  reports_list.forEach(function(element) {
    element.forEach(function(sub_element) {
      appendText(sub_element);
    });
    appendNewLine();
  });
  checkComplete();
}

/* Checks if process is done.  */
function checkComplete() {
  if(project_count == reports_list.length && crawl_finished) {
    console.log("Done.");
    document.getElementById('wait_time').innerHTML = 'Done.';

  }
}

/* Clears all project reports from the page. */
function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* Sorts the reports in reports_list alphabetically 
   username. */
function sortReport() {
  reports_list.sort(function(a,b) {
    return a[0].localeCompare(b[0]);
  })
}

/* ERROR REPORTS */
function linkError() {
  document.getElementById("process_status").style.color = "red";
  document.getElementById('process_status').innerHTML = "Error: invalid link.";
  document.getElementById('wait_time').innerHTML = "Studio links are generally of the form: <br /> <span class = 'link'> https://scratch.mit.edu/studios/[id number]/</span>";
}

function noError() {
  document.getElementById('process_status').innerHTML = "";
}