$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  var $yes_button = $('#vote-yes');
  var $yes_display = $('#yes_display');
  var $yes_hotkey_display = $('#yes_hotkey');
  var yes_hotkey = 89;
  $yes_button.on('click', function() {
    vote(true);
  });


  var $no_button = $('#vote-no');
  var $no_hotkey_display = $('#no_hotkey');
  var $no_display = $('#no_display');
  var no_hotkey = 78;
  $no_button.on('click', function() {
    vote(false);
  });

  var yes_count = 0;
  var no_count = 0;
  var socket = io();

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  setTimeout(changeHotkeys, 5000);

  function changeHotkey(yes, hotkey) {
    var key = '(' + String.fromCharCode(hotkey) + ')';
    if (yes) {
      yes_hotkey = hotkey;
      $yes_hotkey_display.text(key);
      $yes_button.toggleClass('activated', false);
    } else {
      no_hotkey = hotkey;
      $no_hotkey_display.text(key);
      $no_button.toggleClass('activated', false);
    }
  }

  function changeHotkeys() {
    //65 - 90 = [A - Z]
    yes_hotkey = Math.floor((Math.random() * 25) + 65);
    no_hotkey = yes_hotkey;

    while (yes_hotkey === no_hotkey) {
      no_hotkey = Math.floor((Math.random() * 25) + 65);
    }

    changeHotkey(true, yes_hotkey);
    changeHotkey(false, no_hotkey);

    setTimeout(changeHotkeys, Math.random() * 5 * 1000);
  }

  function vote(val) {
    if (val) {
      updateCount(val, ++yes_count);
    } else {
      updateCount(val, ++no_count);
    }

    socket.emit('vote', val);
  }

  function updateCount(yes, count) {
    if (yes) {
      yes_count = count;
      $yes_display.text(yes_count);
    } else  {
      no_count = count;
      $no_display.text(no_count);
    }
    updateGauge(yes_count, no_count);
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }


  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keyup(function (event) {
    // Auto-focus the current input when a key is typed
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (!username) {
        setUsername();
        return;
      }
    }

    if(event.keyCode == yes_hotkey) {
      vote(true);
      $yes_button.toggleClass('activated', false);
    } else if(event.keyCode == no_hotkey) {
      $no_button.toggleClass('activated', false);
      vote(false);
    }
  });

  $window.keydown(function (event) {
    if(event.keyCode == yes_hotkey) {
      $yes_button.toggleClass('activated', true);
    } else if(event.keyCode == no_hotkey) {
      $no_button.toggleClass('activated', true);
    }
  });



  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $usernameInput.focus();
  });


  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    console.log(data);
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('updated_count', function (counts) {
    updateCount(true, counts.yes);
    updateCount(false, counts.no);
  });

  socket.on('restart', function (counts) {
    updateCount(true, counts.yes);
    updateCount(false, counts.no);
  });

});
