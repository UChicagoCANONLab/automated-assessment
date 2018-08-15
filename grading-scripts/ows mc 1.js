class GradeOneWaySyncP1 {

    constructor() {
        this.requirements = {};
        this.strings = [
          'Mali Djembe passes unique message to Mali boy',
          'Music plays when Djembe sprite is clicked',
          'Mali boy dances when Djembe sprite is clicked',
        ];
    }

    initReqs() {
      this.requirements = {};
      this.requirements.messagePassing      = 
        {bool:false, str:'Mali Djembe passes unique message to Mali boy'};
      this.requirements.playSound           = 
        {bool:false, str:'Music plays when Djembe sprite is clicked'};
      this.requirements.maliDance           = 
        {bool:false, str:'Mali boy dances when Djembe sprite is clicked'};
    }

    grade(fileObj, user) {
        this.initReqs();
        var sprites = fileObj.children;

        var drum_index = -1;
        var boy_index = -1;

        for (var i = 0; i < sprites.length; i++) {
            if(sprites[i].objName == "Mali Djembe") {
                drum_index = i;
            }
            if(sprites[i].objName == "Mali boy") {
                boy_index = i;
            }
        }

        if (boy_index == -1 || drum_index == -1){
            return;
        }

        var boy = sprites[boy_index];
        var drum = sprites[drum_index];

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

                      if (block[0] == "playSound:" && block[1] == "djembe") {
                          this.requirements.playSound.bool = true;
                      }

                      if (block[0] == "broadcast:") {
                          message_sent = true;
                          message_name = block[1];
                      }

                      if (block[0] == "doRepeat") {
                        for (var k = 0; k < block[2].length; k++) {
                          var loop = block[2][k];

                          if (loop[0] == 'broadcast:') {
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

                            if (block[0] == "playSound:" && block[1] == "djembe") {
                                this.requirements.playSound.bool = true;
                            }
                        }
                    }

                }
            }
        }

        if (!(message_sent)) return;

        var change_costume = false;
        var wait_block = false;

        for (i = 0; i < boy.scripts.length; i++) {

            script = boy.scripts[i][2];
            event  = script[0][0];

            if (event === 'whenIReceive' && script[0][1] == message_name) {
              if (message_name != "Navajo") {
                this.requirements.messagePassing.bool = true;
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
        }}}}}}

        if(change_costume && wait_block) this.requirements.maliDance.bool = true;

    }

}