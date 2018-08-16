class GradeOneWaySyncP2 {

    constructor() {
        this.requirements = {};
        this.strings = [
          'Created Play Button sprite',
          'Play Button passes message to all other sprites',
          'Mali Djembe plays music when play button sprite is clicked',
          'Mali boy dances when play button sprite is clicked',
          'Navajo Flute plays music when play button sprite is clicked',
          'Navajo girl dances when play button sprite is clicked',
        ];
    }

    initReqs() {
      this.requirements.playButton          = 
        {bool:false, str:'Created Play Button sprite.'};
      this.requirements.messagePassing      = 
        {bool:false, str:'Play Button passes message to all other sprites.'};
      this.requirements.djembe              = 
        {bool:false, str:'Mali Djembe plays music when play button sprite is clicked.'};
      this.requirements.boyDance            = 
        {bool:false, str:'Mali boy dances when play button sprite is clicked.'};
      this.requirements.flute               = 
        {bool:false, str:'Navajo Flute plays music when play button sprite is clicked.'};
      this.requirements.girlDance           = 
        {bool:false, str:'Navajo girl dances when play button sprite is clicked.'};
    }

    grade(fileObj, user) {
        this.initReqs();

        //CHECK FOR SPRITES
        var sprites = fileObj.children;

        var index = [-1, -1, -1, -1, -1]

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

        var all_present = true;

        index.forEach(function(element) {
          if (element == -1) all_present = false;
        });

        if (!(all_present)) return;

        this.requirements.playButton.bool = true;

        //ASSIGN SPRITES TO VARIABLES
        var flute = sprites[index[0]];
        var girl = sprites[index[1]];
        var drum = sprites[index[2]];
        var boy = sprites[index[3]];
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
                    this.requirements.flute.bool = true;
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
                    this.requirements.djembe.bool = true;
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

        if(change_costume && wait_block) this.requirements.girlDance.bool = true;

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

        if(change_costume && wait_block) this.requirements.boyDance.bool = true;

        var receive = true;

        for (var i = 1; i < 4; i++) {
          if (message_index[i] == -1) receive = false;
          if (message_index[i] != message_index[0]) receive = false;
        }

        if (receive) {
          this.requirements.messagePassing.bool = true;
        }
    }

}