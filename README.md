# Automated Assessment Web Apps

Grades a studio of Scratch projects or a single project by Scratch Encore module standards.

## Files

### bundle.js
* Generated on command by browserify to manage dependencies in browsers.
* Run `browserify main.js -o bundle.js` to update bundle.js after making changes in main.js or its dependencies, so that they show up in the browser.
* First run 'npm install -g browserify' to install this command if needed

### bundle_project.js
* Bundle file for project checker
* Run `browserify main_project.js -o bundle_project.js` to update bundle_project.js after making changes in main_project.js or its dependencies, so that they show up in the browser.
* First run 'npm install -g browserify' to install this command if needed

### index.html

* HTML body and elements.
* jQuery code to prevent accidental reload and to map enter key to the grade button.

### projects.html

* Contains HTML for the project checker

### main.js

* Functions to animate HTML and handle events.
* Functions for grading modules
* Functions for printing grade summaries.
* Functions for retrieving JSONs.

### main_project.js

* Same function as main.js but for the project checker

### favicon.png

* Favicon image.

### grader.css

* CSS code for studio grader website.

### grader.css

* CSS code for project checker website.

### pictures

* Pictures corresponding to the scratch modules, serve as button icons in app.

### grading-scripts

* Scripts to grade a JSON by the module standards.


## edx

edX autograder for Scratch Encore PD (created June 2021)


## Authors

Connor Hopcraft
chopcraft@uchicago.edu

Ashley Wang


Max White


Zack Crenshaw
zcrenshaw@uchicago.edu

## Acknowledgments

Created for the CANON Lab's Scratch Encore project.
