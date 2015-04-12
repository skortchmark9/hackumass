// hackumass2015s
// Innovate411412

// Activate the touch button
// This code will work for BOTH the capactive button and the "standard" button with a black tip
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});
var led = new five.Led(3);

var socket = require( 'socket.io-client' )('http://52.10.1.31:3000');

board.on("ready", function() {
  var touch = new five.Button(2);
  var servo = new five.Servo({
    pin: 9,
    type: "continuous"
  });

  touch.on("press", function() {
    servo.cw(1);
    console.log("Pressed!");
  });
  touch.on("release", function() {
    servo.to(90);
    console.log("Released!");
  });
});

socket.on('connect', function () {
  console.log("callback...");
  socket.on('updated_count', function(data){
    if (data.yes > data.no) {
      led.on();
    } else {
      led.off();
    }
  })
});

