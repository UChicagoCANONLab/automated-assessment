/* --- Contains project analysis functions. --- */

/* Top-level analysis function, checks for appropraite number of sprites
   and initializes script analysis. */
function analyze(fileObj) {
    var pID = fileObj.info.projectID
    gradeObj.grade(fileObj,pID);
    report(pID, gradeObj.requirements, gradeObj.extensions);
}

/* Returns pass/fail symbol. */
function checkbox(bool) {
    if (bool) return '✔️';
    else return '❌';
}

/* Reports results. */
function report(pID, reqs, exts) {
    var ret_list = [];
    var project_complete = true;
    var exts_pass = true;
    var passed_reqs_count = 0;

    ret_list.push('Project ID: ' + pID);
    for(var x in reqs) {
        if(!reqs[x]) project_complete = false;
        else passed_reqs_count++;

        ret_list.push(checkbox(reqs[x]) + 
            ' - ' + String(x));
    }

    if(project_complete) complete_projects++;
    else if (passed_reqs_count >= (Object.keys(reqs).length / 2))
        passing_projects++;

    reports_list.push(ret_list);
    printReport();        
}