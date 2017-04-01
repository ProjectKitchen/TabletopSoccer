var express = require('express');
var app = express();
var http = require('http').Server(app);
var events = require("events");
//var db = require('./mock/db.js').init();
var db = require('./db.js').init();

var game = require('./game');
//var wuzzler = require('./mock/wuzzler').init({port:5000});
var wuzzler = require('./wuzzler').init();

var sessions = require('./sessions');

var EurecaServer = require('eureca.io').EurecaServer;
var eurecaServer = new EurecaServer({allow : ['wuzzlerClient.update']});
eurecaServer.attach(http);

sessions.onLogin       = db.login;
sessions.onRegister    = db.register;
sessions.onSetSession  = db.getUser;
sessions.onGetTop10    = db.getTop10;
sessions.onFinishGame  = function(game){
    if (game.red_name && game.blue_name){
        db.addGame(game.red_name, game.blue_name, game.red, game.blue);
    }
};

function log(msg){
    console.log("app: " + msg);
}

function error(msg){
    console.error("app: " + msg);
}

sessions.onSyncClient  = function(connectionId, client, state){
    log("updating client " + connectionId);
    console.log(client);
    client.wuzzlerClient.update(state);
};

var wuzzlerServer = eurecaServer.exports;

var connections = {};
var onlineUsers = [];

eurecaServer.onConnect(function (connection) {
    log('New client ' + JSON.stringify(connection.id));
    sessions.addConnection(connection.id, eurecaServer.getClient(connection.id));
});

eurecaServer.onDisconnect(function (connection) {
    log('Client quit ' + connection.id);
    sessions.removeConnection(connection.id);
});


wuzzlerServer.getTop10 = function (period) {
    var context = this;         //"this" contains an eureca.io internal context
    context.async = true;       //tell eureca to not trigger onReady event

    db.getTop10(period, function(err, res){
        if(err){
            context.return({success:false, error:err});
            return error('internal error');

        }
        context.return({success:true, result:res});
    });
}

wuzzlerServer.getUserStats = function (user, period) {
    var context = this;         //"this" contains an eureca.io internal context
    context.async = true;       //tell eureca to not trigger onReady event

    db.getUserStats(user, period, function(err, res){
        if(err){
            context.return({success:false, error:err});
            return error('internal error');

        }
        context.return({success:true, result:res});
    });
}

wuzzlerServer.login = function (params) {
    var context = this;         //"this" contains an eureca.io internal context
    context.async = true;       //tell eureca to not trigger onReady event

    sessions.login(this.connection.id,params.username, params.passwd, function(err, res){
        if(err){
            context.return({success:false, error:err});
            return error('login failed: '+ err);

        }
        context.return({success:true, result:res});
    });
}

wuzzlerServer.register = function (params) {
    var context = this;         //"this" contains an eureca.io internal context
    context.async = true;       //tell eureca to not trigger onReady event

    sessions.register(this.connection.id,params.username, params.passwd, function(err, res){
        if(err){
            context.return({success:false, error:err});
            return error('register failed: '+ err);

        }
        context.return({success:true, result:res});
    });
}

wuzzlerServer.setSession = function (sessionId) {
    var context = this;         //"this" contains an eureca.io internal context
    context.async = true;       //tell eureca to not trigger onReady event

    sessions.setSession(this.connection.id, sessionId, function callback(err, res){
        if(err){
            context.return({success:false, error:err});
            return error('setSession failed: '+ JSON.stringify(err));
        }
        context.return({success:true, result:res});
    });
}

wuzzlerServer.challenge = function (name) {
    sessions.addChallenge(this.connection.id, name);
}
wuzzlerServer.cancelChallenge = function (name) {
    sessions.cancelChallenge(this.connection.id, name);
}
wuzzlerServer.dismissChallenge = function (name) {
    sessions.dismissChallenge(this.connection.id, name);
}
wuzzlerServer.acceptChallenge = function (name) {
    sessions.acceptChallenge(this.connection.id, name);
}
wuzzlerServer.cancelGame = function (name) {
    sessions.cancelGame(this.connection.id, name);
}

/*var events = ['btn_red', 'btn_blue', 'goal_red', 'goal_blue']
for(evt in events){
    event_label = events[evt];
    log('registering event: '+ event_label);
    wuzzler.on(event_label,function(){
        sessions.gameEvent(event_label);
    });
}*/

wuzzler.on('btn_blue',function(){
    sessions.gameEvent('btn_blue');
});

wuzzler.on('btn_red',function(){
    sessions.gameEvent('btn_red');
});

wuzzler.on('goal_blue',function(){
    sessions.gameEvent('goal_blue');
});

wuzzler.on('goal_red',function(){
    sessions.gameEvent('goal_red');
});



app.use("/", express.static( __dirname + '/public/client'));
app.use("/display",express.static( __dirname + '/public/display'));

http.listen(3000, function(){
    log('listening on *:3000');
});
