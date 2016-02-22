var express = require('express');
var app = express();
var socketio = require('socket.io');
var EventServer = require('./EventServer.js');
var path = require('path');
var compression = require('compression');

var DataService = require('./DataService.js');

app.use(compression());

app.use(express.static('public'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
});

if (process.env.NODE_ENV == 'production') {
  var http = require('http');
  var server = http.Server(app);
  var io = socketio(server);
  EventServer.initServer(io);
  server.listen(process.env.PORT, function() {
    console.log('Server started...');
  });
} else {
  var https = require('https');
  var http = require('http');
  var fs = require('fs');
  var server = http.Server(app);
  var secureServer = https.createServer({
    key: fs.readFileSync('pems/key.pem'),
    cert: fs.readFileSync('pems/cert.pem')
  }, app);
  var io = socketio(server);
  var sio = socketio(secureServer);
  EventServer.initServer(io);
  EventServer.initServer(sio);
  server.listen(3000, function() {
    console.log('Server started...');
  });
  secureServer.listen(3001, function() {
    console.log('Secure Server started...');
  });
}
