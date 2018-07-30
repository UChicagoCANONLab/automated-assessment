/* Contains web-crawling functions. */

/* Parses out link to studio and initiates crawl. */
function crawlFromStudio(string) {

  /* Variables */
  var id = 0;
  var page = 1;
  var res = string.split("/");

  /* Retrieve studio ID. */
  res.forEach(function(element){
    if(/^\d+$/.test(element)){
      id = element;
    }
  });

  /* Check for invalid URL. */
  if (id == 0)
  {
    linkError();
    return;
  }

  crawl (id, page);
}

/* Requests html from a studio page and recursively checks other studio pages. */
function crawl(id, page)
{
  /* Prepare link and send request. */
  var newurl = "https://scratch.mit.edu/site-api/projects/in/" + id + "/" + page + "/";
  var request = new XMLHttpRequest();
  request.open('GET', newurl);
  request.send();

  /* Handle response. */
  request.onload = function() {
    if(request.status != 200) {
      transferFailed();
      console.log("Page: " + page);
      return;
    }

    if(page == 1) {
      appendText("Project Report:");
      appendNewLine();
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
function transferFailed() {
  console.log("XML transfer terminated.");
}

/* Collects links to project pages from studio html and initiates JSON recovery. */
function collectLinks(source)
{
  /* Constants. */
  var pre = "http://projects.scratch.mit.edu/internalapi/project/";
  var post = "/get/"

  /* Fetches project links and initiates JSON recovery for each. */
  var doc = document.createElement( 'html' );
  doc.innerHTML = source;
  var thumb_items = doc.getElementsByClassName('project thumb item');
  [...thumb_items].forEach(function(item){
    var ret_val = pre + item.getAttribute('data-id') + post;
    console.log(ret_val);
    getJSON(ret_val);
  });
}