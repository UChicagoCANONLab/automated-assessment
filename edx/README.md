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

The install script should take care of the rest.

### Step 3: Autograder Run

In a tmux window (or something else that allows it to run on a server in the background) run:

$ python autograder/autograder.py


### Notes on running:

Currently being run on a DigitalOcean VPS.

Inquire for more details.


