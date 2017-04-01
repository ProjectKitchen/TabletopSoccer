var cylon = require("cylon");
var events = require("events");

var emitter = new events.EventEmitter();

var led_red;
var led_blue;

function log(msg){
    console.log("wuzzler: " + msg);
}

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

robot.devices.button1.on('push', function() {
    emitter.emit('btn_red');
    log('btn_red');
});

robot.devices.button2.on('push', function() {
    emitter.emit('btn_blue');
    log('btn_blue');
});

robot.devices.goal1.on('push', function() {
    emitter.emit('goal_red');
    log('goal_red');
});

robot.devices.goal2.on('push', function() {
    emitter.emit('goal_blue');
    log('goal_blue');
});

log('starting robot');
robot.start();
log('robot started');

exports.init = function(conf){

    //emitter.led_blue=led_blue;
    //emitter.led_red=led_red;

    return emitter
};
