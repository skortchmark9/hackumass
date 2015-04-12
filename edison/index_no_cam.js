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
var active = false;
var give_cookie = true;

board.on("ready", function() {
  var start_interaction = new five.Button(2);
  var hammer = new five.Servo.Continuous(9);
  var gate = new five.Servo(6);
  var photo_sensor = new five.Sensor({
    pin: "A1",
    threshold: 8
  });

  photo_sensor.on("change",function(){
    if (active){
      console.log("making decision...");
      if (give_cookie){
	hammer.to(180,1000); //go forward for 1s before emitting move:complete
        led.on();
      }
      else {
	hammer.stop();
        led.off();
      }
      active = false;
    }
  });
  
  hammer.on("move:complete",function(){
    console.log("move complete!");
    hammer.stop();
  });

  start_interaction.on("release", function() {
    gate.to(80);
    console.log("initiating interaction...");
    active = true;
  });
});

socket.on('connect', function () {
  socket.on('updated_count', function(data){
    give_cookie = data.yes > data.no;
  })
});

