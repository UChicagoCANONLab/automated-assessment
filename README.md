# Automated Assessment Web App

Grades a studio of Scratch projects by Scratch Encore module standards.

## Files

### bundle.js
* Generated on command by browserify to manage dependencies in browsers.
* Run `browserify main.js -o bundle.js` to update bundle.js after making changes in main.js or its dependencies, so that they show up in the browser.
* First run 'npm install -g browserify' to install this command if needed

### index.html

* HTML body and elements.
* jQuery code to prevent accidental reload and to map enter key to the grade button.

### main.js

* Functions to animate HTML and handle events.
* Functions for grading modules
* Functions for printing grade summaries.
* Functions for retrieving JSONs.

### favicon.png

* Favicon image.

### grader.css

* CSS code for website.

### pictures

* Pictures corresponding to the scratch modules, serve as button icons in app.

### grading-scripts

* Scripts to grade a JSON by the module standards.

## Authors

Connor Hopcraft
chopcraft@uchicago.edu

Ashley Wang


Max White
mnwhite@uchicago.edu

## Acknowledgments

Created for the CANON Lab's Scratch Encore project.
