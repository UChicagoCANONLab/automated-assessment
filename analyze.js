/* --- Contains project analysis functions. --- */

/* Top-level analysis function, checks for appropraite number of sprites
   and initializes script analysis. */
function analyze(fileObj, user) {
    var pID = fileObj.info.projectID
    gradeObj.grade(fileObj,pID);
    report(pID, gradeObj.requirements, user);
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
    if (bool) return '✔️';
    else return '❌';
}

/* Adds results to reports_list and prints. */
function report(pID, reqs, user) {
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
    document.getElementById('wait_time').innerHTML = 'Done.';
  }
}

/* Sorts the reports in reports_list alphabetically 
   username. */
function sortReport() {
  reports_list.sort(function(a,b) {
    return a[0].localeCompare(b[0]);
  })
}