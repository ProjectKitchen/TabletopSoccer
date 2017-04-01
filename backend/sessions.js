//var db = require('./db.js').init();

function log(msg){
    console.log("state: " + msg);
};
function error(msg){
    console.error("state: " + msg);
};

var challenges = [];
var waitingGames = [];
var connections = {};
var game = {state:'none'};
var gameTimeout;
var timer;

function reset(){
    game = {state:'none'};
    var newGame = waitingGames.splice(0, 1)[0];
    if (newGame){
        startGame(newGame)
    }
    syncState();
}

function watchdog(timeout){
    gameTimeout && gameTimeout.close();
    gameTimeout=setTimeout(reset, timeout);
}


function callIfFnc(fnc){
    if(typeof(fnc)==='function'){
        return fnc;
    }else{
        return (function(){log("missing function");});
    }
}

function syncState(){

    var users = {};

    //refresh list of online users
    for (con in connections){
        var user = connections[con] && connections[con].user && connections[con].user.name
        if(typeof(user)=== "string" && !(users.hasOwnProperty(user))) {
            users[user] = {
                to: [],
                by: [],
                available:[]
            };
        }
    };

    //filter challenges and map to users
    challenges=challenges.filter(function(element, index, array){
        if (
            users.hasOwnProperty(element.to) &&     //check that challenged player is still online
            users.hasOwnProperty(element.by) &&     //check that challenging player is still online
            users[element.to].by.indexOf(element.by) === -1 &&  //check duplicate
            users[element.by].to.indexOf(element.to) === -1 &&  //check duplicate
            element.by != element.to    //check self challenge
        ){

            users[element.to].by.push(element.by);
            users[element.by].to.push(element.to);
            return true;
        };
        return false;
    });

    //refresh list of available users to challenge
    function checkGames(name){
        for (i in waitingGames){
            if (waitingGames[i].red === name || waitingGames[i].blue === name){
                return true;
            }
        }
        return false;
    };

    for (user in users){
        log("users: "+ JSON.stringify(Object.keys(users)) );
        users[user].available=Object.keys(users).filter(function(element){
            return ! (
                element===user ||   // no selfchallenges
                users[user].to.indexOf(element) !=-1 ||   // no duplicates
                users[user].by.indexOf(element) !=-1 ||   // no duplicates
                checkGames(element)    // no challenges while waiting for game
            )
        })
    }

    //remove offline players from games
    /*waitingGames=waitingGames.filter(function(element){
        return (
            users.hasOwnProperty(element.red) &&    //check that red player is still online
            users.hasOwnProperty(element.blue)      //check that blue player is still online
        )
    });*/


    log("syncState: "+JSON.stringify({users:users, waitingGames: waitingGames, game: game}), null, 4);

    for(conId in connections){
        username=connections[conId].user && connections[conId].user.name;
        callIfFnc(exports.onSyncClient)(
            conId,
            connections[conId].connection,
            {
                challenges: users[username],
                waitingGames: waitingGames,
                game: game
            }
        );
    }
}

function startGame(newGame){
    game = {
        red:        0,
        blue:       0,
        red_name:   newGame && newGame.red  || null,
        blue_name:  newGame && newGame.blue || null,
        red_ready:  false,
        blue_ready: false,
        state:      'waiting',
        winner:     null
    };
    syncState();

    watchdog(60000);
};

function finishGame(winner){
    game.state = 'finished';
    game.winner = winner;
    watchdog(5000);
    exports.onFinishGame(game);
}

var statemachine={
    none:{
        btn_red:  function(){startGame();},
        btn_blue: function(){startGame();}
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
            watchdog(120000);
            timer=setTimeout(function(){
                if ( game.red === 10 ){
                    finishGame('red');
                };
                game.state='started';
                syncState();
            }, 10000);
            game.state='goal_red'
        },
        goal_blue: function(){
            game.blue++;
            watchdog(120000);
            timer=setTimeout(function(){
                if ( game.blue === 10 ){
                    finishGame('blue');
                };
                game.state='started';
                syncState();
            }, 10000);
            game.state='goal_blue'
        },
        btn_blue: function(){
            timer=setTimeout(function(){
                game.state='started';
                syncState();
            }, 2000);
            game.state='abort_red'
        },
        btn_red: function(){
            timer=setTimeout(function(){
                game.state='started';
                syncState();
            }, 2000);
            game.state='abort_blue'
        }

    },
    goal_red:{
        btn_red: function(){
            timer && timer.close();
            game.red--;
            game.state='started';
        }
    },
    goal_blue:{
        btn_blue: function(){
            timer && timer.close();
            game.blue--;
            game.state='started';
        }
    },
    abort_red:{
        btn_red: function(){
            timer && timer.close();
            reset();
        }
    },
    abort_blue:{
        btn_blue: function(){
            timer && timer.close();
            reset();
        }
    }
}

exports.onSyncClient = function(connectionId, connection, state){
    log('onSyncClient called' + JSON.stringify(connection) + JSON.stringify(state));
};

exports.onLogin = function(user, passwd, callback){
    error('missing Function onLogin called');
};

exports.onRegister = function(user, passwd, callback){
    error('missing Function onRegister called');
};

exports.onSetSession = function(user, passwd, callback){
    error('missing Function onSetSession called');
};

exports.onFinishGame = function(Game){
    error('missing Function onFinishGame called: '+ JSON.stringify(Game));
};

exports.onGetTop10 = function(period, callback){
    error('missing Function onGetTop10 called');
};

exports.addConnection = function(connectionId, connection){
    console.log("connection: ",connection);
    connections[connectionId]={
        connection:connection
    };
    log('addedConnection');
    log('Connections: ' + JSON.stringify(connections));
    syncState();
};

exports.removeConnection = function(connectionId){
    delete connections[connectionId];
    log('removedConnection');
    log('Connections: ' + JSON.stringify(connections));

    syncState();
};

exports.addChallenge = function(connectionId, user){
    var by = connections[connectionId].user.name;

    challenges.push({
        by: by,
        to: user
    });

    syncState();
};

exports.acceptChallenge = function(connectionId, user){
    var to = connections[connectionId].user.name;
    challenges=challenges.filter(function(element){
        if( element.to === to && element.by === user ){
            var newGame;
            if (Math.random()<0.5){
                newGame={
                    blue: element.to,
                    red: element.by
                };
            }else{
                newGame={
                    blue: element.by,
                    red: element.to
                };
            }
            if(game.state==='none'){
                startGame(newGame)
            }else{
                waitingGames.push(newGame);
            }
            return false;
        }
        return true;
    });

    syncState();
};

exports.cancelGame = function(connectionId, game){
    var user = connections[connectionId].user.name;
    waitingGames=waitingGames.filter(function(element){
        return !(
            element.red  === game.red &&
            element.blue === game.blue && (
                element.red  === user ||
                element.blue === user
            )

        )
    });

    syncState();
};

exports.dismissChallenge = function(connectionId, user){
    var to = connections[connectionId].user.name;
    challenges=challenges.filter(function(element){
        return !(
            element.to === to &&
            element.by === user
        )
    });

    syncState();
};

exports.cancelChallenge = function(connectionId, user){
    var by = connections[connectionId].user.name;
    challenges=challenges.filter(function(element){
        return !(
            element.by === by &&
            element.to === user
        )
    });

    syncState();
};

exports.login = function (connectionId, user, passwd, callback) {
    con = connections[connectionId]

    exports.onLogin(user, passwd,function(err, res){
        if(!err){
            con.user=res;
            syncState();
        }
        callIfFnc(callback)(err, res);
    });
};

exports.register = function (connectionId, user, passwd, callback) {
    con = connections[connectionId]

    exports.onRegister(user, passwd, function(err, res){
        if(!err){
            con.user=res;
            syncState();
        }
        callIfFnc(callback)(err, res);
    });
};

exports.setSession = function (connectionId, sessionId, callback) {
    var con = connections[connectionId];

    exports.onSetSession(sessionId, function(err, res){
        if(!err){
            con.user=res;
            syncState();
        }
        callIfFnc(callback)(err, res);
    });
};

exports.gameEvent = function(evt){
    log('received event: '+ evt + ' in state: '+ game.state )
    log(JSON.stringify(statemachine[game.state]));
    (statemachine[game.state][evt] || function(){log('not found')}) ();
    syncState();
};
