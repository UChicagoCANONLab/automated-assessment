// Be careful, shift() is actually editing car itself

class GradeCondLoops {

    constructor() {
        this.requirements = {}
        this.extensions = {}
    }

    initReqs() {
        this.requirements.newCostume    = 
            {bool:false, str:'Changed car sprite.'};
        this.requirements.carStop       =
            {bool:false, str:'Car stops upon collision.'};
        this.requirements.saySomething  = 
            {bool:false, str:'Car says something.'};
        this.requirements.changeSpeed   = 
            {bool:false, str:'Changed car speed.'};

        this.extensions.otherSprites    =   
            {bool:false, str:'Other sprites perform actions.'};
        this.extensions.carSound        = 
            {bool:false, str:'Car makes a sound.'};
    }

    grade(fileObj, user) {
        this.initReqs()

        var car = fileObj.children.find((e) => {
            return e.objName == 'Car'
        })    
        if(!car) return

        this.checkSound(car)
        this.checkSprites(fileObj.children)
        this.checkCostume(car)
        var event_script = this.checkStop(car)
        var do_until_body = this.checkSay(event_script)
        this.checkSpeed(do_until_body,.1)

    }

    /* Check for car sound */
    checkSound(car) {

        this.extensions.carSound.bool = car.scripts.find((e) => {
            return (undefined != e[2].find((f) => {
                return f[0] == 'playSound:' 
            }))
        })
    }

    checkSprites(sprites) {
        
        this.extensions.otherSprites.bool = sprites.find((e) => {
            if(e.objName != 'Car' && e.scripts) {
                return e.scripts.find((f) => {
                    return f[2].find((g) => {
                        return g[0].startsWith('say') || g[0].startsWith('move')
                    })
                })
            }
        })
    }

    /* Check that speed was changed. */
    checkSpeed(do_body, orig_wait, orig_move) {
        try {do_body[2][0]}
        catch(err) {return null}
 
        this.requirements.changeSpeed.bool = do_body[2].find((g) => {
            if(g[0].startsWith("wait")) {
                return (g[1] != orig_wait)
            }
        })
    }

    /* Check for say block, return doUntil scripts. */
    checkSay(event_script) {
        if(!event_script) return null
        
        while(event_script[0] && event_script[0][0] != 'doUntil')
            event_script.shift()
        var do_body = event_script.shift()

        this.requirements.saySomething.bool = event_script.find((e) => {
            return (e[0].startsWith('say') || e[0].startsWith('think'))
        })

        return do_body
    }

    /* Check for new costume. */
    checkCostume(car) {
        this.requirements.newCostume.bool = (car.currentCostumeIndex != 2)
    }

    /* Check for stop condition. */
    checkStop(car) {
        var events_list = ['whenGreenFlag', 'whenKeyPressed','whenIReceive'];
        var event_script = null;
        this.requirements.carStop.bool = car.scripts.find((e) => {
            if(events_list.includes(e[2][0][0])) {
                return e[2].find((f) => {
                    if(f[0] == 'doUntil') {
                        event_script = e[2];
                        try {return f[1][0].startsWith('touching');}
                        catch(err) {return null}
                    }
                });
            }
        });
        return event_script;
    }
}
