/* A dictionary matching the standard names of the actions and events
(as presented to the student) to the built-in op-code and an extra field
that helps process it. */
const to_opcode = {
    // Events
    flag: ["event_whenflagclicked"],
    click: ["event_whenthisspriteclicked"],
    keyPressSpace: ["event_whenkeypressed", "space"],
    keyPressRight: ["event_whenkeypressed", "right arrow"],
    keyPressLeft: ["event_whenkeypressed", "left arrow"],
    keyPressUp: ["event_whenkeypressed", "up arrow"],
    keyPressDown: ["event_whenkeypressed", "down arrow"],

    // Actions
    moveSteps: ["motion_movesteps", "simple"],
    turnLeft: ["motion_turnleft", "simple"],
    turnRight: ["motion_turnright", "simple"],
    pointInDirection: ["motion_pointindirection", "simple"],
    goToXY: ["motion_gotoxy", "simple"],
    glideToXY: ["motion_glidesecstoxy", "simple"],
    changeXBy: ["motion_changexby", "simple"],
    changeYBy: ["motion_changeyby", "simple"],

    sayForSecs: ["looks_sayforsecs", "simple"],
    say: ["looks_say", "simple"],
    thinkForSecs: ["looks_thinkforsecs", "simple"],
    think: ["looks_think", "simple"],
    switchCostume: ["looks_switchcostumeto", "dropdown"],
    nextCostume: ["looks_nextcostume", "simple"],
    changeSizeBy: ["looks_changesizeby", "simple"],
    setSizeTo: ["looks_setsizeto", "simple"],
    changeEffect: ["looks_changeeffectby", "dropdown"],

    playSound: ["sound_play", "dropdown"],

    wait: ["control_wait"],
    repeat: ["control_repeat"],
    waitUntil: ["control_wait_until"],

    touchColor: ["sensing_touchingcolor", "simple"],
    touchObject: ["sensing_touchingobject", "dropdown"]
}

/* An "abstract" class that represents a requirement for an action on Sprite.
It takes the action's name and a dictionary of any parameters taken by the block
that need to be checked. Parameters should be input as an ordered list, in the order
they are stored in the json (which is input order).

There are a few types of actions that we need to be able to process:
- built-in simple: actions directly corresponding to a built-in action block on Scratch, with
    inputs that are given as strings.
- built-in dropdown: actions directly corresponding to a built-in action block on Scratch,
    but with a dropdown menu for parameters. Checking the presence of this block is easy,
    but verifying parameters is trickier.
- custom action: an action that is coded up as a series of blocks.
- control flow: actions requiring a block nested within some control flow, like IF or REPEAT.

NOTE: Every action should have an inherited grade() functionality.
*/
class action {
    constructor(opcode, parameters, check_parameters) {
        this.opcode = opcode;
        this.parameters = parameters;
        this.check_parameters = check_parameters;
    }

    /* Each action must be checkable, but this depends on the action.
    This function should return an ordered pair:
     1) a boolean, whether the block satisfies the action.
     2) the next block to check, which can vary on the length of the action. */
    check(block, target) {return null;}
}

/* The class representing most actions, specifically any tasks that refer
* to blocks that are built into Scratch, where inputs (if any) are taken
* as strings. Grading is a matter of checking a block for the matching
* opcode.
*
* Most events are also graded using this class, but the keypress event
* needs to be checked with parameters.*/
class builtInSimpleAction extends action {
    constructor(opcode, parameters, check_parameters) {
        super(opcode, parameters, check_parameters);
    }

    // Checks a block to see if it is one required by the action.
    check(block, target) {
        let result = [false, block];
        // Check to see if block is correct action.
        if (block.opcode === this.opcode) {
            result = [true, block.next];
            // If there are parameters that need to be checked, check for them.
            if (this.parameters !== null && this.check_parameters) {
                // Check each parameter individually.
                for (let i = 0; i < Object.keys(this.parameters).length; i++) {
                    if (indexIntoObject(block.inputs, i)[1][1]
                        !== indexIntoObject(this.parameters, i)) {
                        result = [false, block];
                    }
                }
            }
        }
        return result;
    }
}

/* The class representing built-in single-block actions whose parameters
may be selected from a dropdown menu, rather than being directly input as
a string. This means that checking parameters will be more difficult.
Examples: changeEffect, selectCostume, touchingObject.
*/
class builtInDropdownAction extends action {
    constructor(opcode, parameters, check_parameters) {
        super(opcode, parameters, check_parameters);
    }

    // Checks a block to see if it is one required by the action.
    check(block, target) {
        let result = [false, block];
        // Check to see if block is correct action.
        if (block.opcode === this.opcode) {
            result = [true, block.next];
            // These blocks only have one parameter, but the JSON will need
            // to be traversed to find it.
            if (this.parameters !== null && this.check_parameters) {
                // Take the block representing the choice made in the dropdown menu.
                let choice_block = target.blocks[indexIntoObject(block.inputs, 0)[1]];
                if (indexIntoObject(choice_block.fields, 0)[0] !== indexIntoObject(this.parameters, 0)) {
                    result = [false, block];
                }
            }
        }
        return result;
    }
}

/*
A class representing a custom action, represented by a sequence of actions.
e.g. "jump up and down" = move up, then move down, then move up, then move down.
*/
class customAction {
    constructor(actions) {
        this.actions = []
        // TODO
    }
}

/*
A generic function to send each action to an appropriate action object.
*/
function toActionObject(actionName, parameters, checkParameters=false) {
    let classification = to_opcode[actionName];
    if (classification === undefined) {
        console.log("Error: Unrecognized built-in action!", actionName);
    }
    if (classification[1] === "simple") {
        return new builtInSimpleAction(classification[0], parameters, checkParameters);
    } else if (classification[1] === "dropdown") {
        return new builtInDropdownAction(classification[0], parameters, checkParameters);
    }
}

function indexIntoObject (object, index) {
    return object[Object.keys(object)[index]];
}

module.exports = {
    action: action,
    toActionObject: toActionObject,
    to_opcode: to_opcode
}