//blackjack-socket.io coded by lMartin3
//SERVERSIDe
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 3000);
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
    app.use(express.static(path.join(__dirname, 'static')));
  });
  // Starts the server.
  server.listen(3000, function() {
    console.log('Starting server on port 3000');
  });
  io.on('connection', function(socket) {
    console.log("new connection from " + socket.ip);
  });