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
bj_round = 0;
bj_turn = "";
bj_played = false;
bj_cards = [
    "as_pica",
    "2_pica",
    "3_pica",
    "4_pica",
    "5_pica",
    "6_pica",
    "7_pica",
    "8_pica",
    "9_pica",
    "10_pica",
    "jack_pica",
    "queen_pica",
    "king_pica"
]

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/', 'index.html'));
    app.use(express.static(path.join(__dirname, 'static')));
    app.use(express.static(path.join(__dirname, 'static/assets')));
});

server.listen(3000, function() {
    console.log('Starting server on port 3000');
});

io.on('connection', function(socket) {
    if(bj_status=="ingame") {
        socket.emit('reject', "Game in progress");
        socket.disconnect();
        return;
    }
    //console.log("new connection from " + socket.ip);
    socket.on('disconnect', function(data) {
        for(i = 0;i < playerlist.length;i++) {
            if(playerlist[i]==socket.nickname) {
                playerlist.splice(i, 1);
            }
        }
    updateUsernames();
        
    });
    
    socket.on('new_player', function(data, callback) {
        data = data.replace("<", "&lt");
        data = data.replace(">", "&gt");
        socket.emit('log', "Bienvenido");
		callback(true); // PARA LLAMAR FUNCION Y REEMITIR PAQUETE - functin(data, callback) {}
        socket.nickname = data;
        if(bj_status=="ingame") {
            socket.emit('reject', "Game in progress");
            socket.disconnect();
            return;
        } else {
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
        gameplay();
    }    
    function updateRound(data) {
        io.sockets.emit('update_round', data)
    }
    function updateTurn(turnof, time) {
        io.sockets.emit('update_turn', turnof, time);
    }
    function sturn(list) {
        console.log("LLL" + list.length);
        console.log(list);
        if(!list) {
            console.log("onno")
        }
        if(list.length==0) {
            gameplay();
            
        } else {
            console.log(list.length);
            clearInterval(i);
            bj_turn = list[0];
            bj_played = false;
            turntime = 7;
            console.log("Listbefore: " + list);
            list.shift();
            console.log("Listafter: " + list);
            var i = setInterval(function() {
                if(turntime<=0) {
                    clearInterval(i);
                    sturn(list);
                }
                if(bj_played==false) {
                    updateTurn(bj_turn, turntime);
                    turntime --;
                    
                } else {
                    clearInterval(i);
                    sturn(list);
                }
    
            }, 1000);
        }
    }
    function gameplay() {
        if(bj_round==0) {
            bj_round = 1;
            updateRound(bj_round);
            var altpl = []
            for(i=0;i<playerlist.length;i++) {
                altpl.push(playerlist[i]);
            }
            sturn(altpl);
        } else {
            bj_round++;
            updateRound(bj_round);
            var altpl = []
            for(i=0;i<playerlist.length;i++) {
                altpl.push(playerlist[i]);
            }
            sturn(altpl);


        }
    }

    function startCooldown() {
        if(bj_status=="ingame"||bj_status=="starting") {
            return;
        }
        bj_status = "starting";
        var cdt = 10;
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