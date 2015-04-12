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
  
  var photo_sensor = new five.Sensor({
    pin: "A1",
    threshold: 8
  });

  photo_sensor.on("change",function(){
    if (active){
      console.log("making decision...");
      if (give_cookie){
        hammer.to(180,1000);
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
    console.log("move complete");
    hammer.stop();
  });

  start_interaction.on("release", function() {
    console.log("initiating interaction...");
    active = true;
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


