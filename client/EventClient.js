var io = require('socket.io-client');
var Dispatcher = require('flux').Dispatcher;
var Promise = require('lie');

var socket = io();

var dispatcher = new Dispatcher();

socket.on('event', function(event) {
  dispatcher.dispatch(event);
});

var emit = function(type, data) {
  return new Promise(function(resolve, reject) {
    socket.emit('event', {
      type: type,
      data: data
    }, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  register: dispatcher.register.bind(dispatcher),
  dispatch: dispatcher.dispatch.bind(dispatcher),
  emit: emit
};