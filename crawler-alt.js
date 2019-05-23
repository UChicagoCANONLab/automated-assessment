/// Crawler using Scratch 3 updated site API

var XMLHttpRequest = require('xhr2');
var web = require('./web');

/// This function assembles an array of project IDs that are linked to in a Scratch studio.
/// This array gets passed to another function, retrieveProjectsByID, that actually grabs each project from the site.
function crawlStudio(studioURL) {

    /// Figure out the URL to fetch the studio info from.
    var studioID = parseInt(studioURL.match(/\d+/));
    if (studioID === 0 || isNaN(studioID)) {
        console.error('Error parsing studio URL. Please make sure that you have entered a valid Scratch studio URL.');
        return;
    }
    var studioURLforAPI = 'https://api.scratch.mit.edu/studios/' + studioID + '/projects';

    /// Assemble a list of project IDs from the studio.
    /// Since the server limits how much data it sends over and how often we can request more, we need to use setInterval() to get all the project IDs.
    var projectIDs = [];
    var promisedResourceArray = [];
    var loopMilliseconds = 150;
    var isDone = false;
    var requestLoopID = setInterval(function() {

        /// If we're not done, we collect more IDs.
        if (!isDone) {

            /// Request the info using the URL found above (and the offset found below).
            var request = new XMLHttpRequest();
            request.open('GET', studioURLforAPI + '?offset=' + projectIDs.length);
            request.send();

            /// Case 1: Receive the response and use it to build up our array of project IDs.
            request.onload = function() {

                /// Since the response is a string, convert it to JSON.
                var response = JSON.parse(request.response);

                /// If the response is an empty array, that means we're done.
                if (response.length === 0) {
                    isDone = true;
                }
                
                /// Otherwise, iterate through our new JSON object and extract the project IDs we need.
                else {
                    for (var projectOverview of response) {
                        projectIDs.push(projectOverview.id);
                        var promisedResource = web.promiseResource('https://projects.scratch.mit.edu/' + projectOverview.id);
                        promisedResourceArray.push(promisedResource);
                    }
                }
            }

            /// Case 2: If an error occurs, handle it.
            request.onerror = function() {
                reject('Error reading studio information.');
            }
        }

        /// If we are done collecting IDs, we end the request loop.
        else {
            //let x = retrieveProjectsByID(projectIDs);
            clearInterval(requestLoopID);
            return Promise.all(promisedResourceArray);
        }

    }, loopMilliseconds);

}

/// This function grabs each project referred to in an array of project ID numbers.
function retrieveProjectsByID(projectIDs) {

    /// We loop through the project IDs and retrieve each corresponding project.
    for (var projectID_ of projectIDs) {

        /// This try-catch block is just a trick to make sure we go through all the project IDs and not just the last one.
        try { throw projectID_; } catch (projectID) {

            /// Figure out the URL to fetch the project from.
            var projectURLforAPI = 'https://projects.scratch.mit.edu/' + projectID;

            /// Request the project using the URL found above.
            var request = new XMLHttpRequest();
            request.open('GET', projectURLforAPI);
            request.send();

            /// Case 1: Receive the response and ...
            request.onload = function() {

                /// Since the response is a string, convert it to JSON.
                var response = JSON.parse(request.response);

                /// If that didn't work, try the old URL.
                if (response === null) {

                    var backupRequest = new XMLHttpRequest();
                    backupRequest.open('GET', 'https://chord.cs.uchicago.edu/' + projectID);
                    backupRequest.send();

                    backupRequest.onload = function() {
                        response = JSON.parse(backupRequest.response);
                    }

                    backupRequest.onerror = function() {
                        console.error('Error downloading project ' + projectID + ' from Scratch.');
                    }
                }
                console.log(projectID + ': ' + response);

                /// Package up the response with some helpful info and add it to the return array.
                




            }

            /// Case 2: If an error occurs, handle it.
            request.onerror = function() {
                //clearReport();
                //linkError();
                console.log('Error');
            }

        }
    }
}

async function main(studioURL) {

    try {
        var projects = await crawlStudio(studioURL);
        console.log(projects[0]);
    }

    catch(err) {
        
        console.error('Z: ' + err);
    }
    


    /*
    var URLs = [];
    for (var projectID of projectIDs) URLs.push('https://projects.scratch.mit.edu/' + projectID);
    console.log(URLs);*/

}

module.exports.main = main;