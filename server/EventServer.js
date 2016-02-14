var Dispatcher = require('flux').Dispatcher;
var EventTypes = require('../EventTypes.js');

var socketio = null;
var dispatcher = new Dispatcher();

var initServer = function(io){
  socketio = io;
  io.on('connection', function(socket){
    socket.on('event', function(event, cb){
      event.socket = socket;
      event.callback = cb;
      dispatcher.dispatch(event);
    });
    socket.on('disconnect', function(){
      dispatcher.dispatch({
        type:EventTypes.SOCKET_DISCONNECT,
        socket: socket
      });
    });

    dispatcher.dispatch({
      type: EventTypes.SOCKET_CONNECT,
      socket: socket
    });
  });
};

var broadcast = function(type, data){
  socketio.emit('event', {
    type: type,
    data: data
  });
};

var send = function(socket, type, data){
  socket.emit('event', {
    type: type,
    data: data
  });
};

module.exports = {
  initServer: initServer,
  register: dispatcher.register.bind(dispatcher),
  broadcast: broadcast,
  send: send,
  waitFor: dispatcher.waitFor.bind(dispatcher)
};