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
    app.use(express.static(path.join(__dirname, 'static/assets')));
});

server.listen(3000, function() {
    console.log('Starting server on port 3000');
});

io.on('connection', function(socket) {
    //console.log("new connection from " + socket.ip);
    socket.on('disconnect', function(data) {
        for(i = 0;i < playerlist.length;i++) {
            if(playerlist[i]==socket.nickname) {
                playerlist.splice(i, 1);
            }
        }
    });
    updateUsernames();
    
    socket.on('new_player', function(data, callback) {
        socket.emit('log', "Bienvenido");
		callback(true); // PARA LLAMAR FUNCION Y REEMITIR PAQUETE - functin(data, callback) {}
        socket.nickname = data;
        if(data=="sandra") {
            socket.emit('reject', "Game in progress");
            socket.disconnect();
            return;
        }
        playerlist.push(socket.nickname);
        updateUsernames();
        if(bj_status!="starting" && bj_status!="ingame") {
            console.log(bj_status);
            if(playerlist.length > 1) {
                startCooldown();
            }   
        } else {
            console.log("already starting");
            if(bj_status=="ingame") {
                updateStatus("In game");
            }
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
    function startgame() {
        io.sockets.emit('start_game');
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
                    updateStatus("In game");
                    startgame();
                }
                cdt--;
            } else {
                updateStatus("Waiting for players...");
                bj_status="waiting";
            }
        }, 1000);
    }   
});