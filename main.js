
/* initialize html, initiate crawler */
function buttonHandler() {
  document.getElementById('process_button').blur();
  var removeables = document.getElementsByClassName('dynamic');
  while(removeables[0]) {
    removeables[0].remove();
  }
  
	appendText("Project Report:");
	appendNewLine();
	var requestURL = document.getElementById('inches_input').value;
	crawlFromStudio(requestURL);
}

/* request project json, initiate analysis */
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

/* print a line of grading text */
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

/* print a blank line */
function appendNewLine() {
  var tbi = document.createElement("div"); 
  tbi.className = "dynamic";
  tbi.style.padding = "15px";

  var ai = document.getElementById("report"); 
  document.body.insertBefore(tbi, ai); 
}