/* --- Contains project analysis functions. --- */

/* Top-level analysis function, checks for appropraite number of sprites
   and initializes script analysis. */
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

function requirementsToStrings(reqs, ret_list) {
    
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
