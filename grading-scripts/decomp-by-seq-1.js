class GradeDecompBySeqP1 {
  /*
  this.strings includes short one sentence descriptions of each of the requirements in order.
  Here are longer descriptions for each requirement and what the specifically do:

  1. JaimeToBall
    -There is a "repeat until touching Soccer Ball" loop block.

  2. JaimeAnimated
    -Inside the "repeat until" block, Jaime uses "move" blocks to animate movement.
    -Jaime is pointing towards the Soccer Ball when he moves
    -Jaime doesn't make any direct movements using "go to x: y:", "go to mouse",
    or "glide" blocks

  3. ballStayStill
    -A "wait until touching Jaime" block exists before the balls starts moving
    towards the goal.

  4. ballToGoal
    -There is a "repeat until touching Goal" loop block.

  5. ballAnimated
    -Inside the "repeat until" block, the ball uses "move" blocks to move.
    -The ball is pointing towards the goal when he moves.
    -The ball doesn't make any direct movements using "go to x: y:", "go to
    mouse", or "glide" blocks.
  */

    constructor() {
      this.strings =
      ['Jaime uses the "repeat until" block to do an action until it touches the Soccer Ball',
      'Jaime is animated correctly to move towards the Soccer Ball',
      'Soccer Ball uses the "wait until" to wait until Jaime touches it',
      'Soccer Ball uses the "repeat until" block to do an action until it touches the Goal',
      'Soccer Ball is animated correctly to move towards the Goal'];
      this.requirements = {};
    }

    initReqs() {
      this.requirements.JaimeToBall =
      this.requirements.JaimeAnimated =
      this.requirements.ballStayStill =
      this.requirements.ballToGoal =
      this.requirements.ballAnimated = false;
    }


    //helper function to find the green flag script, returns null otherwise
    findGreenFlag(scripts){
      for(var i = 0; i < scripts.length; i++){
        var script = scripts[i][2];
        if(script[0] == 'whenGreenFlag')
          return script;
      }
      return null;
    }

    //function to return Jaime sprite, returns NULL if no Jaime
    findJaime(children){
      for(var i = 0; i < children.length; i++){
        var sprite = children[i];
        if(sprite.objName == 'Jaime ')
          return sprite;
      }
      return null;
    }

    //Checks Jaime's scripts
    testJaime(jaime){
      var scripts = jaime.scripts;
      //check that sprite has scripts
      if(scripts == null)
        return;

      var pointingTo = null; //direction Jaime is traveling

      //iterate through all scripts to find green flag script
      var greenFlag = this.findGreenFlag(scripts);

      if(greenFlag != null){ //green flag script exists
        for(var i = 1; i < greenFlag.length; i++){ //iterate through script
          var block = greenFlag[i];

          //update where Jaime is pointing towards
          if(block[0] == 'pointTowards:')
            pointingTo = block[1];

          //check for correct 'repeat until' loop block
          else if(block[0] == 'doUntil'){ //found repeat until loop block
            if((block[1][0] == 'touching:') && (block[1][1] == 'Soccer Ball')){
              this.requirements.JaimeToBall = true;

              //check Jaime moves towards the soccer ball w/o direct move
              var inLoop = block[2];
              var move = false;
              var noDirectMovement = true;
              var direction = false;

              for(var j = 0; j < inLoop.length; j++){ //iterate in loop
                var innerBlock = inLoop[j][0]; //blocks in loop
                //update where Jaime is pointing towards
                if(innerBlock == 'pointTowards:')
                  pointingTo = inLoop[j][1];
                //check that loop doesn't have any direct movement
                else if((innerBlock == 'gotoX:y:') ||
                        (innerBlock == 'gotoSpriteOrMouse:') ||
                        (innerBlock == 'glideSecs:toX:y:elapsed:from:'))
                  noDirectMovement = false;
                //check that Jaime is moving using th move block
                else if(innerBlock == 'forward:'){
                  //Check if Jaime is moving the correct direction
                  if(pointingTo == 'Soccer Ball')
                    direction = true;
                  move = true;
                }
                //checks for correct animation of Jaime
                if((move == true) && (noDirectMovement == true) &&
                  (direction == true))
                  this.requirements.JaimeAnimated = true;
      }}}}}
    }

    //function to return Soccer Ball sprite, returns NULL if no soccer ball
    findSoccerBall(children){
      for(var i = 0; i < children.length; i++){
        var sprite = children[i];
        if(sprite.objName == 'Soccer Ball')
          return sprite;
      }
      return null;
    }

    //check Soccer Ball's scripts
    testSoccerBall(ball){
      var scripts = ball.scripts;
      //check that sprite has scripts
      if(scripts == null)
        return;

      var pointingTo = null; //direction ball is traveling

      //iterate through all scripts to find green flag script
      var greenFlag = this.findGreenFlag(scripts);
      //ball shouldn't move to goal without Jaime
      var prevBlockNoMove = true;

      if(greenFlag != null){ //green flag script exists
        for(var i = 1; i < greenFlag.length; i++){ //iterate through script
          var block = greenFlag[i];

          //update where ball is pointing towards
          if(block[0] == 'pointTowards:')
            pointingTo = block[1];

          //check for wait until block
          else if(block[0] == 'doWaitUntil'){
            if((block[1][0] == 'touching:') && (block[1][1] == 'Jaime ')){
              if (prevBlockNoMove == true)
                this.requirements.ballStayStill = true;
            }
          }

          //check for repeat until block
          else if(block[0] == 'doUntil'){ //found repeat until loop block
            if((block[1][0] == 'touching:') && (block[1][1] == 'Goal')){
              this.requirements.ballToGoal = true;

              //check that ball moves until it gets to Goal
              var inLoop = block[2]
              var direction = false;
              var noDirectMovement = true;

              for(var j = 0; j < inLoop.length; j++){
                var innerBlock = inLoop[j][0];
                if(innerBlock == 'pointTowards:')
                  pointingTo = inLoop[j][1];
                else if((innerBlock == 'gotoX:y:') ||
                        (innerBlock == 'gotoSpriteOrMouse:') ||
                        (innerBlock == 'glideSecs:toX:y:elapsed:from:'))
                  noDirectMovement = false;
                else if(innerBlock == 'forward:'){
                  if(pointingTo == 'Goal'){
                    if(noDirectMovement == true)
                      this.requirements.ballAnimated = true;
                    prevBlockNoMove = false; //ball moves towards Goal
                }
      }}}}}}
    }

    grade(fileObj, user){
      this.initReqs();

      //Check that project has at least one sprite/variable to check
      var sprites = fileObj.children;
      if(sprites == null)
        return;

      //Check Jaime sprite for requirements
      var jaime = this.findJaime(sprites);
      if(jaime != null){
        this.testJaime(jaime);
      }

      //Check Soccer Ball sprite for requirements
      var ball = this.findSoccerBall(sprites);
      if(ball != null){
        this.testSoccerBall(ball);
      }
  }
}