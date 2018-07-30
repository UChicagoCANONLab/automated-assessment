
/* Initializes html and initiates crawler. */
function buttonHandler() {
  document.getElementById('process_button').blur();
  clearReport();
  noError();
  
	
	var requestURL = document.getElementById('inches_input').value;
	crawlFromStudio(requestURL);
}

/* Request project jsons and initiate analysis. */
function getJSON(requestURL){
	var request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		var project = request.response;
		console.log(project);
		console.log(typeof(project));
		analyze(project);
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

function clearReport() {
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
}

/* ERROR REPORTS */
function linkError() {
  document.getElementById("process_status").style.color = "red";
  document.getElementById('process_status').innerHTML = "Error: invalid link.";
}

function noError() {
  document.getElementById('process_status').innerHTML = "";
}