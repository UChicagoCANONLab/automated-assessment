# Autograder for EdX course via XQueue

### Zack Crenshaw
### Last updated: June 2021
### Many thanks to Andrew Litteken for his help

## Installation

### Step 1: XQueue Watcher
Make sure to install the XQueue Watcher repo (https://github.com/edx/xqueue-watcher)
Download the repo and then:

$ cd xqueue-watcher
$ pip install -e .

### Step 2: Autograder Install

$ cd edx
$ pip install -e .

You will need to have nodeJS installed:

$ sudo apt install nodejs

And also xhr2:

$ npm install xhr2


### Step 3: Autograder Run

In a tmux window (or something else that allows it to run on a server in the background) run:

$ python autograder/autograder.py


### Notes on running:

Currently being run on a DigitalOcean VPS.

Inquire for more details.

## File Structure:

* autograder/autograder.py: Autograder script
* autograder/test.py: Local test file. 
** To run: python autograder/test.py <module> <input (link or project id)> 


