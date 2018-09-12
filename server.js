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