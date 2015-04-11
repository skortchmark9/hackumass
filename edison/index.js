// hackumass2015s
// Innovate411412

// Activate the touch button
// This code will work for BOTH the capactive button and the "standard" button with a black tip
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  var touch = new five.Button(2);
  var led = new five.Led(3);


  touch.on("press", function() {
    led.on();
    console.log("Pressed!");
  });
  touch.on("release", function() {
    led.off();
    console.log("Released!");
  });
  touch.on("hold", function() {
    console.log("Holding...");
  });
});
/*
// Blink an LED
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
	  var led = new five.Led(3);
	    led.blink(1000);
});
*/
