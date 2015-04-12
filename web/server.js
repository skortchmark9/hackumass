// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var yes = 0;
var no = 0;
var ROUND_LENGTH = 10 * 1000;
var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
var width = 320;
var height = 240;


// Routing
app.use(express.static(__dirname + '/public'));

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

function sendCounts(socket) {
    socket.broadcast.emit('updated_count', {
      yes: yes,
      no: no
    });
}

function startRound() {
  yes = 0;
  no = 0;
  console.log('restarting');
  io.sockets.emit('restart', {yes : yes, no : no});
  setTimeout(endVoting, ROUND_LENGTH);
}

function endVoting() {
  console.log('voting ended');
  io.sockets.emit('end_voting');
}

io.on('connection', function (socket) {
    /* Video Stuff! */
  var streamHeader = new Buffer(8);

  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.emit('video', streamHeader, { binary: true });


  var addedUser = false;
  socket.emit('updated_count', {yes : yes, no : no});

  socket.on('start_voting', function() {startRound();})

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('vote', function(val) {
    console.log('voting received');
    if (val) {
      yes += 1;
    } else {
      no += 1;
    }
    sendCounts(socket);
  });

  socket.on('message', function(data, options) {
	socket.broadcast.emit('video', data, options);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log('disconnected');
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
