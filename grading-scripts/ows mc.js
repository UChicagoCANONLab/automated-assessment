class GradeOneWaySync {

  constructor() {
      this.requirements = {};
      this.strings = [
        'When Djembe is clicked, Djembe plays music and Mali child dances.',
        'When start button is clicked, Djembe and Flute play music and Mali child and Navajo child dance.',
      ];
  }

  initReqs() {
    this.requirements.djembe              =
      {bool:false, str:'When Djembe is clicked, Djembe plays music and Mali child dances.'};
    this.requirements.start               = 
      {bool:false, str:'When start button is clicked, Djembe and Flute play music and Mali child and Navajo child dance.'};
  }

  grade(fileObj, user) {      this.initReqs();

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

      var p1_message_passing = false;
      var p1_play_sound = false;
      var p1_mali_dance = false;

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
                        p1_play_sound = true;
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
                              p1_play_sound = true;
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
              p1_message_passing = true;

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

      if(change_costume && wait_block) p1_mali_dance = true;

      if(p1_mali_dance && p1_play_sound && p1_message_passing) {
          this.requirements.djembe.bool = true;
      }

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

      var p2_message_passing = false;
      var p2_drum = false;
      var p2_boy_dance = false;
      var p2_flute = false;
      var p2_girl_dance = false;

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
                  p2_flute = true;
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
                  p2_drum = true;
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

      if(change_costume && wait_block) p2_girl_dance = true;

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

      if(change_costume && wait_block) p2_boy_dance = true;

      var receive = true;

      for (var i = 1; i < 4; i++) {
        if (message_index[i] == -1) receive = false;
        if (message_index[i] != message_index[0]) receive = false;
      }

      if (receive) {
        p2_message_passing = true;
      }

      if (p2_message_passing && p2_drum && p2_flute && p2_boy_dance
        && p2_girl_dance) this.requirements.start.bool = true;

      if (message[message_index[0]] == message_name)
        this.requirements.djembe.bool = false;
}
