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
  console.log('starting round');
  yes = 0;
  no = 0;
  io.sockets.emit('updated_count', {yes : yes, no : no});
  setTimeout(startRound, ROUND_LENGTH);
}
startRound();

io.on('connection', function (socket) {
  var addedUser = false;
  socket.emit('updated_count', {yes : yes, no : no});

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
    if (val) {
      yes += 1;
    } else {
      no += 1;
    }
    sendCounts(socket);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
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
