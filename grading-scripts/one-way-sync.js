

class GradeOneWaySync {

  constructor() {
      this.requirements = {};
  }

  initReqs() {
    this.requirements.onetoone            =
      {bool:false, str:'Djembe passes unique message to Mali child.'};
    this.requirements.djembe1             =
      {bool:false, str:'When Djembe is clicked, Djembe plays music.'};
    this.requirements.boy1                =
      {bool:false, str:'When Djembe is clicked, Mali child dances.'};
    this.requirements.onetomany           =
      {bool:false, str:'Start button passes the same message to all other sprites.'};
    this.requirements.djembe2             =
      {bool:false, str:'When start button is clicked, Djembe plays music.'};
    this.requirements.flute2              =
      {bool:false, str:'When start button is clicked, Flute plays music.'};  
    this.requirements.boy2                =
      {bool:false, str:'When start button is clicked, Mali child dances.'};  
    this.requirements.girl2               =
      {bool:false, str:'When start button is clicked, Navajo child dances.'}; 
  }

  grade(fileObj, user) {
      
      this.initReqs();

      var sprites = fileObj.children;

      var index = [-1, -1, -1, -1, -1];

      for (var i = 0; i < sprites.length; i++) {
        if (sprites[i].hasOwnProperty('objName')) {
          var name = sprites[i].objName;
          if (name == "Navajo Flute") {
            index[0] = i;
          }
          else if (name == "Navajo girl") {
            index[1] = i;
          }
          else if (name == "Mali Djembe") {
            index[2] = i;
          }
          else if (name == "Mali boy") {
            index[3] = i;
          }
          else
          {
            index[4] = i;
          }
        }
      }

      if (index[3] == -1 || index[2] == -1){
          return;
      }

      var boy = sprites[index[3]];
      var drum = sprites[index[2]];

      if (!(drum.hasOwnProperty('scripts')) || !(boy.hasOwnProperty('scripts')))
        return;

      var message_sent = false;
      var message_name = "";

      for (var i = 0; i < drum.scripts.length; i++) {

          var script = drum.scripts[i][2];
          var event  = script[0][0];

          if (script.length > 1) {

              if (event === 'whenClicked') {

                  for (var j = 1; j < script.length; j++) {
                    var block = script[j];

                    if ((block[0] == "playSound:" || block[0] == "doPlaySoundAndWait") && block[1] == "djembe") {
                        this.requirements.djembe1.bool = true;
                    }

                    if (block[0] == "broadcast:" || block[0] == "doBroadcastAndWait") {
                        message_sent = true;
                        message_name = block[1];
                    }

                    if (block[0] == "doRepeat") {
                      for (var k = 0; k < block[2].length; k++) {
                        var loop = block[2][k];

                        if (loop[0] == 'broadcast:' || loop[0] == "doBroadcastAndWait") {
                          message_sent = true;
                          message_name = loop[1];
                        }
                      }
                    }

                  }
              }

              if (event === 'whenIReceive') {

                  if (message_sent && script[0][1] == message_name) {
                      for (var j = 1; j < script.length; j++) {
                          var block = script[j];

                          if ((block[0] == "playSound:" || block[0] == "doPlaySoundAndWait") && block[1] == "djembe") {
                              this.requirements.djembe1.bool = true;
                          }
                      }
                  }

              }
          }
      }

      if (message_sent) {

        var change_costume = false;
        var wait_block = false;

        for (i = 0; i < boy.scripts.length; i++) {

            script = boy.scripts[i][2];
            event  = script[0][0];

            if (event === 'whenIReceive' && script[0][1] == message_name) {
              if(message_name != 'Navajo') {
                  this.requirements.onetoone.bool = true;
              }

              for (var j = 1; j < script.length; j++) {
                var block = script[j];

                if (block[0] == "doRepeat" && block[1] > 1) {

                  for (var k = 0; k < block[2].length; k++) {
                    var loop = block[2][k];

                    if (loop[0] == 'nextCostume') {
                      change_costume = true;
                    }

                    if (loop[0] == "wait:elapsed:from:" && loop[1] > 0) {
                      wait_block = true;
      }}}}}}}

      if(change_costume && wait_block) this.requirements.boy1.bool = true;
      
      //// part 2

      //check for sprites

      var all_present = true;

      index.forEach(function(element) {
        if (element == -1) all_present = false;
      });

      if (!(all_present)) return;

      //ASSIGN SPRITES TO VARIABLES
      var flute = sprites[index[0]];
      var girl = sprites[index[1]];
      var play = sprites[index[4]];

      var sprites_arr = [flute, girl, drum, boy, play];


      var all_scripts = true;

      sprites_arr.forEach(function (element) {
        if (!(element.hasOwnProperty('scripts'))) all_scripts = false;
      });

      if (!(all_scripts)) return;

      var message = [];
      var num_broadcasts = 0;

      for (var i = 0; i < play.scripts.length; i++) {

          var script = play.scripts[i][2];
          var event  = script[0][0];

          if (script.length > 1) {

              if (event === 'whenClicked') {

                  for (var j = 1; j < script.length; j++) {
                    var block = script[j];

                    if (block[0] == "broadcast:" || block[0] == "doBroadcastAndWait") {
                        num_broadcasts++;
                        message.push(block[1]);
                    }
                  }
              }
          }
      }

      if (num_broadcasts == 0) return;

      var message_index = [-1, -1, -1, -1];

      for (var i = 0; i < flute.scripts.length; i++) {

          var script = flute.scripts[i][2];
          var event  = script[0][0];

          if (event === 'whenIReceive') {

            for (var j = 0; j < num_broadcasts; j++) {
              if (script[0][1] == message[j]) message_index[0] = j;
            }

            if (message_index[0] != -1) {

              for (var j = 1; j < script.length; j++) {
                var block = script[j];

                if ((block[0] == "playSound:" || block[0] == "doPlaySoundAndWait")
                 && block[1] == "Navajo Flute") {
                  this.requirements.flute2.bool = true;
                }
              }
            }
          }
      }

      for (var i = 0; i < drum.scripts.length; i++) {

          var script = drum.scripts[i][2];
          var event  = script[0][0];

          if (event === 'whenIReceive') {

            for (var j = 0; j < num_broadcasts; j++) {
              if (script[0][1] == message[j]) message_index[2] = j;
            }

            if (message_index[2] != -1) {

              for (var j = 1; j < script.length; j++) {
                var block = script[j];

                if ((block[0] == "playSound:" || block[0] == "doPlaySoundAndWait")
                 && block[1] == "djembe") {
                  this.requirements.djembe2.bool = true;
                }
              }
            }
          }
      }

      var change_costume = false;
      var wait_block = false;

      for (var i = 0; i < girl.scripts.length; i++) {

          var script = girl.scripts[i][2];
          var event  = script[0][0];

          if (event === 'whenIReceive') {

            for (var j = 0; j < num_broadcasts; j++) {
              if (script[0][1] == message[j]) message_index[1] = j;
            }

            if (message_index[1] != -1) {

              for (var j = 1; j < script.length; j++) {
                var block = script[j];

                if (block[0] == "doRepeat" && block[1] > 1) {

                  for (var k = 0; k < block[2].length; k++) {
                    var loop = block[2][k];

                    if (loop[0] == 'nextCostume') {
                      change_costume = true;
                    }

                    if (loop[0] == "wait:elapsed:from:" && loop[1] > 0) {
                      wait_block = true;
                    }
                  }
                }
              }
            }
          }
      }

      if(change_costume && wait_block) this.requirements.girl2.bool = true;

      change_costume = false;
      wait_block = false;

      for (var i = 0; i < boy.scripts.length; i++) {

          var script = boy.scripts[i][2];
          var event  = script[0][0];

          if (event === 'whenIReceive') {

            for (var j = 0; j < num_broadcasts; j++) {
              if (script[0][1] == message[j]) message_index[3] = j;
            }

            if (message_index[3] != -1) {

              for (var j = 1; j < script.length; j++) {
                var block = script[j];

                if (block[0] == "doRepeat" && block[1] > 1) {

                  for (var k = 0; k < block[2].length; k++) {
                    var loop = block[2][k];

                    if (loop[0] == 'nextCostume') {
                      change_costume = true;
                    }

                    if (loop[0] == "wait:elapsed:from:" && loop[1] > 0) {
                      wait_block = true;
                    }
                  }
                }
              }
            }
          }
      }

      if(change_costume && wait_block) this.requirements.boy2.bool = true;

      var receive = true;

      for (var i = 1; i < 4; i++) {
        if (message_index[i] == -1) receive = false;
        if (message_index[i] != message_index[0]) receive = false;
      }

      if (receive) {
        this.requirements.onetomany.bool = true;
        if (message[message_index[0]] == message_name){
            this.requirements.onetoone.bool = false;
        }
      }
      
  }
}

