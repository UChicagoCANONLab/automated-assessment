const fs     = require('fs');
const grader = require('./grader.js');
const action_list = require('./actions.js')

////////////////////////////////////////////////////////////////////////////////////////////
// Module 1 Modify: Multicultural

// Projects: Load the Project JSON
const templateProject1 = './test-jsons/m1-multicultural-modify.json';
let project1JSON = JSON.parse(fs.readFileSync(templateProject1, 'utf-8'));

// Requirements: For each sprite/event pair, make a list of action objects in order using
// toActionObject, and then put them all into a spriteRequirement object.
const SaysHappyHoli = new action_list.toActionObject('sayForSecs', ["Hi, I'm Neha!", "2"]); // Should be True
const SaysSomethingAfter = new action_list.toActionObject('sayForSecs', ["Press the space bar to meet my friends!", "2"], true); // Should be False
const NehaFlagReqs = new grader.spriteRequirement("Neha",
    [SaysHappyHoli, SaysSomethingAfter],
    "flag");

const CountsDown3 = new action_list.toActionObject('sayForSecs', ["3...", "1"]); // Should be True
const CountsDown2 = new action_list.toActionObject('sayForSecs', ["2...", "1"]); // Should be True
const NehaClickReqs = new grader.spriteRequirement("Neha",
    [CountsDown3, CountsDown2],
    "click"
);

const BradCostume = new action_list.toActionObject('switchCostume', ["Brad1"], true); // Should be True
const BradFlagReqs = new grader.spriteRequirement("Brad",
    [BradCostume],
    "flag");

// Grader Creation: Create a grader using lessonGrader than takes the requirements and the JSON.
const mod1Grader = new grader.lessonGrader([NehaFlagReqs, NehaClickReqs, BradFlagReqs], project1JSON);
let output1 = mod1Grader.gradeProject();
console.log("Test 1 Expected: ", [[true, false], [true, true], [true]])
console.log("Test 1 Actual: ", output1);
console.log()

////////////////////////////////////////////////////////////////////////////////////////////
// Module 2 Gaming Modify: Testing Keypress Events

// Projects
const templateProject2 = './test-jsons/m2-gaming-modify.json';
let project2JSON = JSON.parse(fs.readFileSync(templateProject2, 'utf-8'));


const BopCostume = new action_list.toActionObject('switchCostume', ["ship2"], true); // Should be true
const BopCostume2 = new action_list.toActionObject('switchCostume', ["ship2"], false); // Should be true
const BopCostume3 = new action_list.toActionObject('switchCostume', ["ship2"], true); // Should be false

const BopUpReqs = new grader.spriteRequirement("Bop",
    [BopCostume],
    "keyPressUp");
const BopDownReqs = new grader.spriteRequirement("Bop",
    [BopCostume2],
    "keyPressDown");
const BopDownReqs2 = new grader.spriteRequirement("Bop",
    [BopCostume3],
    "keyPressDown");

const mod2Grader = new grader.lessonGrader([BopUpReqs, BopDownReqs, BopDownReqs2], project2JSON);
let output2 = mod2Grader.gradeProject();
console.log("Test 2 Expected: ", [[true], [true], [false]])
console.log("Test 2 Actual: ", output2);