//blackjack-socket.io coded by lMartin3 and MQRLZ
//SERVERSIDe
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

var playerlist = [];
bj_status = "waiting"; //waiting, cooldown, ingame, finishing

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/', 'index.html'));
    app.use(express.static(path.join(__dirname, 'static')));
});

server.listen(3000, function() {
    console.log('Starting server on port 3000');
});

io.on('connection', function(socket) {
    //console.log("new connection from " + socket.ip);
    socket.on('disconnect', function(data) {
        playerlist.splice(playerlist.indexOf(socket.nickname), 1);
        updateUsernames();
    });

    socket.on('new_player', function(data) {
        socket.emit('log', "Bienvenido");
		//callback(true); // PARA LLAMAR FUNCION Y REEMITIR PAQUETE - functin(data, callback) {}
        socket.nickname = data;
        if(data=="sandra") {
            socket.emit('reject', "Game in progress");
            socket.disconnect();
            return;
        }
        playerlist.push(socket.nickname);
        updateUsernames();
        if(playerlist.length > 1) {
            startCooldown();
        }
    });

    function updateStatus(status) {
        console.log("Sending status update: " + status);
        io.sockets.emit('update_status', status);
    }
	function updateUsernames() {
		io.sockets.emit('refresh_players', playerlist);
    }
    function plzLog(data) {
        io.sockets.emit('log', data);
    }


    function startCooldown() {
        bj_status = "starting";
        var cdt = 20;
        var x = setInterval(function() {
            if(playerlist.length>1) {
                updateStatus("Starting... " + "[" + cdt + "]");
                if(cdt<=0) {
                    clearInterval(x);
                    bj_status="ingame";
                }
                cdt--;
            } else {
                updateStatus("Waiting for players...");
                bj_status="waiting";
            }
        }, 1000);
    }   
});