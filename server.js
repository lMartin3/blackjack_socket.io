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
    console.log("new connection from " + socket.ip);

    socket.on('disconnect', function(data) {
        console.log('Disconected: s sockets connected');
        playerlist.splice(playerlist.indexOf(socket.nickname), 1);
        updateUsernames();
        console.log("-"+socket.nickname)
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
        console.log("+"+socket.nickname);
        updateUsernames();
        
        console.log(playerlist);
        console.log(playerlist.length);
        if(playerlist.length > 1) {
            console.log("hooorayy");
            var cdt = 20;
            var now = new Date().getTime();
            var countDownDate = new Date(Date.getTime() + 20*1000);
            // Update the count down every 1 second
            var x = setInterval(function() {
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                // Time calculations for days, hours, minutes and seconds
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                // Display the result in the element with id="demo"
                // If the count down is finished, write some text 
                
                if (distance < 0) {
                    clearInterval(x);
                }
                cdt = distance;
                updateStatus("Starting... " + cdt + " seconds left!");
                
        });
    }
});
    function updateStatus(status) {
        io.sockets.emit('update_status', status);
    }
	function updateUsernames() {
		io.sockets.emit('refresh_players', playerlist);
    }
    function plzLog(data) {
        io.sockets.emit('log', data);
    }
    
});