// hackumass2015s
// Innovate411412

// Activate the touch button
// This code will work for BOTH the capactive button and the "standard" button with a black tip
var five = require("johnny-five");
var Edison = require("edison-io");
var socket = require( 'socket.io-client' )('http://52.10.1.31:3000');
var http = require('http');
var childProcess = require('child_process');


var board = new five.Board({
  io: new Edison()
});
var led = new five.Led(3);

var active = false;
var give_cookie = true;

board.on("ready", function() {
  var start_interaction = new five.Button(2);
  var hammer = new five.Servo.Continuous(9);
  var led_signal = new five.Pin(4);

  socket.on("end_voting", function(){
    console.log("making decision...");
    if (give_cookie){
      led_signal.high();
      led.on();
      setTimeout(function (){hammer.to(180,1000)},1000);
    }
    else {
      hammer.stop();
      led.off();
    }
    active = false;
  });

  hammer.on("move:complete",function(){
    console.log("done!");
    hammer.stop();
    led.off();
    led_signal.low();
  });

  start_interaction.on("release", function() {
    if (active){
      console.log("cancelling interaction...");
      active = false;  
    }
    else {
      console.log("initiating interaction...");
      socket.emit("start_voting",true);
      active = true;
    }
  });
});

var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
var width = 320;
var height = 240;


socket.on('connect', function () {
  socket.on('updated_count', function(data){
    var give_cookie = data.yes > data.no;
  });

  /* Video Stuff! */
  var streamHeader = new Buffer(8);

  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, { binary: true });
});

// configuration files
var streamPort = 8082;
http.createServer(function (req, res) {
   req.on('data', function (data) {
     socket.send(data, {binary : true});
   });
}).listen(streamPort, function() {
  childProcess.exec('bin/do_ffmpeg.sh');
});


