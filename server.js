//blackjack-socket.io coded by lMartin3
//SERVERSIDe
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

playerlist = [];
bj_status = "waiting"; //waiting, cooldown, ingame, finishing

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/', 'index.html'));
    app.use(express.static(path.join(__dirname, 'static')));
});

// Starts the server.
server.listen(3000, function() {
    console.log('Starting server on port 3000');
});


io.on('connection', function(socket) {
    console.log("new connection from " + socket.ip);
    socket.on('disconnect', function(data) {
        console.log('Disconected: s sockets connected');
        playerlist.splice(playerlist.indexOf(socket.username), 1);
        updateUsernames();
    });


    socket.on('algo', function(data) {
        if(data=="algo") {
        }
    });


    socket.on('new_player', function(data) {
		//callback(true); // PARA LLAMAR FUNCION Y REEMITIR PAQUETE - functin(data, callback) {}
        socket.nickname = data;
        if(data=="sandra") {
            socket.emit('reject');
            socket.disconnect();
            return;
        }
		playerlist.push(socket.nickname);
        updateUsernames();
        console.log(playerlist.length);
        if(playerlist.lenght > 1) {
            console.log("hooorayy")
            cdt = 20;
            while(cdt>=0) {
                plzLog("testing");
            }
        }
	})
	function updateUsernames() {
		io.sockets.emit('refresh_players', playerlist);
    }
    function plzLog(data) {
        io.sockets.emit('log', data);
    }
    
});