var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require("events");

function log(msg){
    console.log("wuzzler_mock: " + msg);
}

exports.init = function(conf){
    http.listen(conf.port, function(){
        log('listening on *:'+ conf.port);
    });

    var emitter = new events.EventEmitter();
    var state ={
        led_blue:null,
        led_red:null
    }

    app.use(express.static(__dirname));

    emitter.on('update', function(msg){
        io.emit('update', msg);

    });

    io.on('connection', function(socket){
        log('a user connected');
        socket.emit('update', state);

        socket.on('goal_red', function(){
            emitter.emit('goal_red');
            log('goal_red');
        });
        socket.on('goal_blue', function(){
            emitter.emit('goal_blue');
            log('goal_blue');
        });
        socket.on('btn_red', function(){
            emitter.emit('btn_red');
            log('btn_red');
        });
        socket.on('btn_blue', function(){
            emitter.emit('btn_blue');
            log('btn_blue');
        });
    });


    emitter.led_blue=function(led){
        state.led_blue=led;
        io.emit('update', state);
        log('led_blue: '+led)
    };

    emitter.led_red=function(led){
        state.led_red=led;
        io.emit('update', state);
        log('led_red: '+led)
    };

    return emitter
};
