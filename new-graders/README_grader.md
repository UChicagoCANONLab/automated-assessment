# Modular Grader README
by: Jonathan Liu

Hello! This grader takes as input a set of desired (sprite, action) pairs and a scratch project,
and traverses the scratch project's json to determine if the sprite does that object. 

### Object Hierarchy
##### Actions (actions.js)
Actions are generally referenced by their opcode in Scratch, so this is the ID we use here. The Action object can also
store any parameters we are interested in. Actions are classified into a few categories, differning based on how they 
can be graded through our traversal of the scratch json:
- builtInSimpleAction
  - These actions are blocks built into scratch, with inputs are simply strings. There are "simple" in the sense that
  they are easiest to check for correctness: all we need to do is check the opcode, and then check the string if needed.
  - We have code that checks for these blocks in the json. 
- builtInDropDownAction
  - These actions are blocks built into scratch as well, but their inputs are dropdowns instead of strings. This is a
  bit more annoyin to check, because we have to traverse further into the json instead of simply checking a string. 
  - Nonetheless, checking these is handled by our grader.
- customAction
  - These actions are the ones that we are specifying on our own, which means we will also have to write graders on our
  own for them. This may look like a new block, a combination of built-in blocks, or some other non-default
  characteristic of the project like the background being changed.
  - For each of these, we'll have to fill in the `check` function on our own.

##### spriteRequirements (grader.js)
The basic unit of requirements within this grader is the spriteRequirement object, found in grader.js. On a high level, 
most requirements should look like "When [event], [sprite] does [set of actions, in order]." This is naturally converted
into spriteRequirement objects, which have three properties:
- name (string)
  - the **name** of the sprite, as stored in the project
- requirements (array)
  - An array of required **actions**, in the order they should be done by the project.
- event (string)
  - The **event** that should trigger this action. The event is input as a string opcode.

##### lessonGrader (grader.js)
Each project should come with a set of requirements that we are checking. The lessonGrader object simply takes in a list
of requirements, and the JSON for a project, and the gradeProject() function checks each of the requirements and returns
an array of booleans. 