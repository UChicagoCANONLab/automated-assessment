/* --- Contains web-crawling functions. --- */
var web = require('./web');
var my = module.exports;
/* Parses out link to studio and initiates crawl. */
function crawlFromStudio(string) {

  /* Variables */
  var id = 0;
  var page = 1;
  var res = string.split("/");

  /* Retrieve studio ID. */
  res.forEach(function(element) {
    if(/^\d+$/.test(element)) {
      id = element;
    }
  });

  /* Check for invalid URL. */
  if (id == 0) {
    linkError();
    return;
  }
  return id;
}

/* || Work In Progress || */
function testCrossOrg(id) {
  var newurl = "https://scratch.mit.edu/site-api/projects/in/" + id + "/1/";
  var request = new XMLHttpRequest();
  request.open('GET', newurl);
  request.send();

  /* Handle response. */
  request.onload = function() {
    if(request.status != 200) {
      cross_org = false;      
      console.log(cross_org);
      return;
    }
    console.log(cross_org);
    console.log(request.response);
  }
}

/* Requests html from a studio page and recursively checks other studio pages. */
function crawl(id, page) {
  
  /* Prepare link and send request. */
  var newurl = "https://scratch.mit.edu/site-api/projects/in/" + id + "/" + page + "/";
  var request = new XMLHttpRequest();
  request.open('GET', newurl);
  request.send();

  /* Handle response. */
  request.onload = function() {
    if(request.status != 200) {
      transferFailed(page);
      return;
    }
    var project = request.response;

    collectLinks(project);
    crawl(id, page + 1);
  }

  /* Handle error. */
  request.onerror = function() {
    clearReport();
    linkError();
  }
}

/* Logs unsuccessful transfer (generally intentional). */
function transferFailed(page) {
  console.log("XML transfer terminated on page " + page + ".");

  if(page == 1) {
    linkError();
  }
  else{
    crawl_finished = true;
    checkIfComplete();
  }
}

/* Collects links to project pages from studio html and initiates JSON recovery. */
function collectLinks(source) {
  /* Constants. */
  var pre = "https://chord.cs.uchicago.edu/";

  /* Fetches project links and initiates JSON recovery for each. */
  var doc = document.createElement( 'html' );
  doc.innerHTML = source;
  var thumb_items = doc.getElementsByClassName('project thumb item');
  project_count += [...thumb_items].length;
  
  [...thumb_items].forEach(function(item){
    var id = item.getAttribute('data-id');
    var ret_val = pre + id;
    var name;
    try {
      name = item.getElementsByClassName("owner")[0].children[0].innerHTML;
    }
    catch(err) {
      name = '[undefined]';
    }
    getJSON(ret_val,analyze,[name,id]);
  });
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