var cylon = require("cylon");
var events = require("events");

function led(led){
    var interval;

    return function(mode){
        if (interval && interval.clearInterval){
            interval.clearInterval();
        };

        switch(mode) {
            case 'on':
                led.turnOff();
                break;
            case 'off':
                led.turnOn();
                break;
            case 'blink':
                interval=setInterval(
                    led.toggle,
                    500
                );
                break;
            case 'flash':
                interval=setInterval(
                    function(){
                        led.turnOff();
                        setTimeout(
                            led.turnOn,
                            100
                        );
                    },
                    1000
                );
                break;
            default:
                throw 'invalid mode';
        }
    }
}

var emitter = new events.EventEmitter();

var led_red;
var led_blue;

var robot = cylon.robot({
    connections: {
        arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
    },

    devices: {
        led: { driver: 'led', pin: 13 },
        goal1: { driver: 'button', pin: 12 },
        goal2: { driver: 'button', pin: 10 },
        led1: { driver: 'led', pin: 8 },
        led2: { driver: 'led', pin: 9 },
        button1: { driver: 'button', pin: 6 },
        button2: { driver: 'button', pin: 7 }
    },

    work: function(devices) {
        led_red = led(devices.led1);
        led_red('on');
        led_blue = led(devices.led2);
        led_blue('on');
    }
});

function update(){
    emitter.emit('update', state );
    console.log(state);
};

var game = function(){
    var statemachine={
        waiting:{
            rdy_red: function(){
                if (state.red_ready ===false){
                    state.red_ready=true;
                    if (state.blue_ready === true) {
                        state.state = 'started';
                    }
                    update();
                }
            },
            rdy_blue: function(){
                if (state.blue_ready ===false){
                    state.blue_ready=true;
                    if (state.red_ready === true) {
                        state.state = 'started';
                    }
                    update();
                }
            }
        },
        started:{
            goal_red: function(){
                state.red++;
                if ( state.red === max_count ){
                    state.state = 'finished';
                    state.winner ='red';
                };
                update();
            },
            goal_blue: function(){
                state.blue++;
                if ( state.blue === max_count ){
                    state.state = 'finished';
                    state.winner ='blue';
                };
                update();
            }
        },
        finished:{
            reset: function(){
                state = clone(init_state);
                update();
            }
        }
    }

    return function(event){
        (statemachine[state.state][event] || function(){console.log('not found')}) ();
    }
}();

var io_mapper = function(){
    var statemachine = {
        waiting:{
            btn_red: function(){
                game('rdy_red');
            },
            btn_blue: function(){
                game('rdy_blue');
            }
        },
        started:{
            goal_red: function(){
                game('goal_red');
            },
            goal_blue: function(){
                game('goal_blue');
            }
        },
        finished:{
            btn_red: function(){
                game('reset');
            },
            btn_blue: function(){
                game('reset');
            }
        }
    };

    return function(event){
        (statemachine[state.state][event] || function(){console.log('not found')}) ();
    };
}();

robot.devices.button1.on('push', function() {
    console.log('robot.devices.button1');
    io_mapper('btn_red');
});

robot.devices.button2.on('push', function() {
    console.log('robot.devices.button2');
    io_mapper('btn_blue');
});

robot.devices.goal1.on('push', function() {
    console.log('robot.devices.goal1');
    io_mapper('goal_red');
});

robot.devices.goal2.on('push', function() {
    console.log('robot.devices.goal2');
    io_mapper('goal_blue');
});


robot.start();


emitter.on('update', function(msg){
    //io.emit('update', msg);
});
