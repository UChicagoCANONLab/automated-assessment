const action_list = require('./actions.js');

/*
A class representing a sprite and its corresponding requirements for a specific event.
It has three properties:
name: the name of the sprite in question
reqs: an array of action objects that need to be completed after this event.
event: the name of the event that precedes these actions.
*/
class spriteRequirement {
    constructor(name, requirements, event) {
        this.name = name;
        this.requirements = requirements;
        this.event = event;
    }
}

/* Takes as input a list of spriteRequirement objects and a project json, and determines
if the file meets each of the requirements. */
class lessonGrader {
    constructor(requirements, projJson) {
        this.requirements = requirements;
        this.projJson = projJson;
    }

    /*
    Takes as input a starting block and a list of actions, and outputs an array
    indicating whether the children of the block contains those actions, in order.
     */
    grade_actions(target, start_block, actions) {
        let results = new Array(actions.length).fill(false);
        // Iterate through the blocks that follow the start,
        // scanning for the actions one at a time.
        let action_index = 0;
        let req = actions[action_index];
        let block = target.blocks[start_block.next];
        // Iterate until the end of the chain.
        while (block !== undefined && action_index < actions.length) {
            // If requirement is a built-in action
            if (req instanceof action_list.action) {
                // check to see if block lines up with action
                let result = req.check(block, target);
                // If all parameters line up, indicate that the requirement is
                // satisfied and move to next requirement.
                if (result[0]) {
                    results[action_index] = true;
                    action_index++;
                    req = actions[action_index];
                }
            } else {
                console.log("Error: improper action instantiated.", req);
            }
            block = target.blocks[block.next];
        }
        return results;
    }

    /*
    Takes as input a spriteRequirement object, and determines whether the stage
    meets the requirements outlined.
    Returns: A boolean array of whether each requirement in the input is satisfied.
    If the sprite does not exist, returns an array of all False.
    */
    grade_requirement(requirement) {
        let results = new Array(requirement.requirements.length).fill(false);
        // Find the code in the project corresponding to the sprite.
        for (let target of this.projJson.targets) {
            if (target.name === requirement.name) {
                // Look for the corresponding event block.
                let event = action_list.to_opcode[requirement.event];
                for (let i = 0; i < Object.keys(target.blocks).length; i++) {
                    let block = indexIntoObject(target.blocks, i);
                    if (block.opcode === event[0]) {
                        if (event[0] === "event_whenkeypressed") {
                            if (block.fields["KEY_OPTION"][0] === event[1]) {
                                return this.grade_actions(target, block, requirement.requirements);
                            }
                        } else {
                            return this.grade_actions(target, block, requirement.requirements);
                        }
                    }
                }
            }
        }
        // Return the array.
        return results;
    }

    /*
    Grades the entire project by grading each requirement individually.
    */
    gradeProject() {
        let results = [];
        for (let requirement of this.requirements) {
            results.push(this.grade_requirement(requirement));
        }
        return results;
    }
}

function indexIntoObject (object, index) {
    return object[Object.keys(object)[index]];
}

module.exports = {
    spriteRequirement:spriteRequirement,
    lessonGrader:lessonGrader
}
