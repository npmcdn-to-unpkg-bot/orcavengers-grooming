var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
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

server.listen(3000, function () {
  console.log('Server started...');
});