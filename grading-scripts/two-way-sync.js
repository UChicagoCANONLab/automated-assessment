/// Returns an array of the blocks in a script.
function blocks(script) {
    if (!script || script === undefined) return [];
    return script[2];
}

/// Returns the opcode of a block.
function opcode(block) {
    if (!block || block === undefined || block.length === 0) return '';
    return block[0];
}

/// Returns the first block in a script's opcode.
function hatCode(script) {
    return opcode(blocks(script)[0]);
}

/// Returns an array containing the subset of a sprite's scripts with a given event.
function eventScripts(sprite, myEvent) {
    if (!sprite.scripts) return [];
    return sprite.scripts.filter(script => hatCode(script) === myEvent);
}

/// Returns an array containing the subset of a scripts's blocks with a given opcode.
function opcodeBlocks(script, myOpcode) {
    if (!blocks(script)) return [];
    return blocks(script).filter(block => opcode(block) === myOpcode);
}

/// Returns true if a script contains a certain block, and false otherwise.
function scriptContains(script, myOpcode) {
    if (!script || script === undefined || !blocks(script)) return false;
    return blocks(script).some(block => opcode(block) === myOpcode);
}

/// Finds a block with a given opcode in a script.
function findBlock(script, myOpcode) {
    return blocks(script).find(block => opcode(block) === myOpcode);
}

class GradeTwoWaySync {

  constructor() {
      this.requirements = {};
      this.extensions = {};
  }

  initReqs() {
    this.requirements.addMessageBall      =
      {bool:false, str:'Added at least one message to Sprite 1 using proper timing.'};
    this.requirements.addMessageRainbow   = 
      {bool:false, str:'Added at least one message to Sprite 2 using proper timing.'};

    this.extensions.moreMessages          = 
      {bool:false, str:'Added more messages.'};
    this.extensions.changeSounds          =
      {bool:false, str:'Changed the boing or pop sounds.'};
  }

  grade(fileObj, user) {
      this.initReqs();

      var ball = fileObj.children.find(child => child.objName === 'Basketball');
      var rainbow = fileObj.children.find(child => child.objName === 'Rainbow');
      if (!ball || !rainbow) return;

      var ball_gf = eventScripts(ball, 'whenGreenFlag');
      var rainbow_gf = eventScripts(rainbow, 'whenGreenFlag');
        
      if (ball_gf == [] || rainbow_gf == []) return;
      
      var ball_timing = [];
      var rainbow_timing = [];
      var i;
      var ball_green_flags = 0;
      var rainbow_green_flags = 0;
        
      for (var script of ball_gf) {
          if (opcodeBlocks (script, 'think:duration:elapsed:from:').length < 1) continue;
          ball_green_flags++;
          var blocks = script[2];
          for (i = 0; i < blocks.length; i++) {
              if (opcode(blocks[i]) == 'think:duration:elapsed:from:') {
                  ball_timing.push(['think', blocks[i][2]]);
              }
              if (opcode(blocks[i]) == 'wait:elapsed:from:') {
                  ball_timing.push(['wait', blocks[i][1]]);
              }
              if (opcode(blocks[i]) == 'playSound:' && blocks[i][1] != 'boing') {
                  this.extensions.changeSounds.bool = true;
              }  
          }        
      }
      
      for (var script of rainbow_gf) {
          if (opcodeBlocks (script, 'think:duration:elapsed:from:').length < 1) continue;
          rainbow_green_flags++;
          var blocks = script[2];
          for (i = 0; i < blocks.length; i++) {
              if (opcode(blocks[i]) == 'think:duration:elapsed:from:') {
                  rainbow_timing.push(['think', blocks[i][2]]);
              }
              if (opcode(blocks[i]) == 'wait:elapsed:from:') {
                  rainbow_timing.push(['wait', blocks[i][1]]);
              }
              if (opcode(blocks[i]) == 'playSound:' && blocks[i][1] != 'pop') {
                  this.extensions.changeSounds.bool = true;
              }
          }        
      }
      
      if (ball_timing.length != rainbow_timing.length) return;
      if (ball_green_flags > 1 || rainbow_green_flags > 1) return;
      
      for (i = 0; i < ball_timing.length; i++) {
          
          if (ball_timing[i][1] != rainbow_timing[i][1]) break;
          if (ball_timing[i][0] == rainbow_timing[i][0]){
              if (ball_timing[i][0] == 'think') break;
              else if (i > 3) break;
              else continue;
          }
          
          if (i > 1) {
              
              if (i > 3) {
                  this.extensions.moreMessages.bool = true; 
                  break;
              } else if (ball_timing[i][0] == 'think') {
                  this.requirements.addMessageBall.bool = true;
              } else if (rainbow_timing[i][0] == 'think') {
                  this.requirements.addMessageRainbow.bool = true;
              }
              
          }
          
      }
      
      
  }
}
