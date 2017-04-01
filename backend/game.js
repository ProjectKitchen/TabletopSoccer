var game;

function log(msg){
    console.log("game: " + msg);
};
function error(msg){
    console.error("game: " + msg);
};

function start(red, blue){
    game = {
        red:        0,
        blue:       0,
        red_name:   red || null,
        blue_name:  blue || null,
        red_ready:  false,
        blue_ready: false,
        state:      'waiting',
        winner:     null
    };
    exports.onUpdate(game);
};

function finish(winner){
    game.state = 'finished';
    game.winner = winner;
    setTimeout(function(){
        game = null;
        exports.onUpdate(game);
    }, 5000);
    exports.onFinish(game);
}

var statemachine={
    null:{
        btn_red:  function(){start();},
        btn_blue: function(){start();}
    },
    waiting:{
        btn_red: function(){
            if (game.red_ready ===false){
                game.red_ready=true;
                if (game.blue_ready === true) {
                    game.state = 'started';
                }
            }
        },
        btn_blue: function(){
            if (game.blue_ready ===false){
                game.blue_ready=true;
                if (game.red_ready === true) {
                    game.state = 'started';
                }
            }
        },
    },
    started:{
        goal_red: function(){
            game.red++;
            if ( game.red === 10 ){
                finish('red');
            };
        },
        goal_blue: function(){
            game.blue++;
            if ( game.blue === 10 ){
                finish('blue');
            };
        }
    },
    finished:{
        reset: function(){
            state = newGame();
            update();
        }
    }
}

exports.onFinish = function(state){
    log('onFinish called '+ JSON.stringify(state));
}

exports.onUpdate = function(state){
    log('onUpdate called '+ JSON.stringify(state));
}

exports.reset = function(){

};

exports.start = function(red, blue){
    start(red, blue);
};

exports.event = function(event){
    (statemachine[game.state][event] || function(){log('not found')}) ();
    
};
