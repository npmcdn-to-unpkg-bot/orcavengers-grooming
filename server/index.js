var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var fs = require('fs');
var server = http.Server(app);
var secureServer = https.createServer({
      key: fs.readFileSync('pems/key.pem'),
      cert: fs.readFileSync('pems/cert.pem')
    }, app);
var socketio = require('socket.io');
var io = socketio(server);
var sio = socketio(secureServer);
var EventServer = require('./EventServer.js');
var path = require('path');
var compression = require('compression');

var DataService = require('./DataService.js');

app.use(compression());

app.use(express.static('public'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
});

EventServer.initServer(io);
EventServer.initServer(sio);

server.listen(3000, function () {
  console.log('Server started...');
});

secureServer.listen(3001, function () {
  console.log('Secure Server started...');
});
