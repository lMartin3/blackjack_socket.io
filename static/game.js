$(function(){
    var $loginform = $('#loginform');
    var $username = $('#username');
    var $gameform = $('#gameform');
    var $players = $('#players');
    var $ou = $('#ou');
    var $status = $('#status');
    var $controls = $('#controls');
    var $round = $('#round');
    var $turn = $('#turn');
    var $cards = $('#cards');
    var $cardlist = $('#cardlist');

    var pong = false;
    var firstcon = false;

    const rnam_first =[
        "potato",
        "earth",
        "keyboard",
        "screen",
        "campus",
        "sandra",
        "test",
        "car",
        "dab",
        "kek",
        "cheater",
        "pootis",
        "spy",
        "onii",
        "mongol",
        "peron",
        "ali",
        "souza",
        "nisman",
        "liberman",
        "decaroli",
        "cora",
        "leaderman",
        "lilita",
        "gucchi",
        "lucía",
        "lección",
        "a_nisman_lo_mataron",
        "macri",
        "macrisis",
        "cristina",
        "ese_del_sindicato_de_camioneros"
    ];
    const rnam_second = [
        "destroyer",
        "smasher",
        "killer",
        "assasin",
        "sandranaitor",
        "backstabber",
        "fucker",
        "sucker",
        "builder",
        "chan",
        "sapper",
        "corrupter",
        "uwuer",
        "player",
        "hertz",
        "thepro",
        "volleyballkicker",
        "passtheball",
        "carrió",
        "ganger",
        "gastón",
        "escrita"
    ];
    const rnam_third = [
        "696",
        "969",
        "777",
        "404",
        "666",
        "161",
        "333",
        "123",
        "321",
        "080",
        "000",
        "021",
        "420",
        "111"
    ]
    
    
    $gameform.hide();
    $controls.hide();
    var randomnameone = rnam_first[Math.floor(Math.random() * rnam_first.length)];
    var randomnametwo = rnam_second[Math.floor(Math.random() * rnam_second.length)];
    var randomnamethree = rnam_third[Math.floor(Math.random() * rnam_third.length)];
    var rname = randomnameone + "_" + randomnametwo + "_" + randomnamethree;
    $username.val(rname);
    var socket = io.connect();



    
    document.getElementById("joinGame").addEventListener("click", function(){
        console.log($username.val());
        socket.emit('new_player', $username.val(), function(data) {
            if(data){
                $loginform.hide();
                $gameform.show();
                $controls.hide();
            }
        })
    });
    document.getElementById("askforcard").addEventListener("click", function(){
        console.log("asking for card");
        socket.emit('ask_for_card');
    });
    socket.on('reject', function(data) {
        console.log("lol u rejected");
        alert("Kicked by Server System" +  "\nReason: " + data);
        window.location.reload();
    });
    socket.on('refresh_players', function(data){
        console.log("Refreshing players...")
        var html = '';
        for(i = 0;i < data.length;i++) {
            if(data[i]==$username.val()) {
                
                html += '<li class="pltabme" id="'+ data[i] +'">'+data[i]+'</li>';
            } else {
                html += '<li class="pltab" id="'+ data[i] +'">'+data[i]+'</li>';    
            }
        }
        $players.html(html);
        ouhtml = i+' Players online';
        $ou.html(ouhtml);
    });
    socket.on('log', function(data){
        console.log("[SERVER-LOG] " + data);
    })
    socket.on('update_status', function(data) {
        console.log("Satuts update: " + data)
        var suhtml = 'Status: ' + data;
        $status.html(suhtml);
    })
    socket.on('start_game', function() {
        var audio = new Audio('audio_background.mp3');
        audio.play();        
        $controls.show();
    })
    socket.on('update_round', function(data) {
        urhtml = 'Round ' + data;
        $round.html(urhtml);
    })
    socket.on('update_turn', function(turnof, time) {
        uthtml = turnof + "'s turn " + "(" + time + ")";
        $turn.html(uthtml);
    })
    socket.on('got_card', function(data) {
        var chtml='';
        for(i=0;i<data.length;i++) {
            chtml += '<img height="135" width="90" src="' + data[i] +'.png"></img>';
        }
        $cardlist.html(chtml);
    })






    function ping() {
        var d = new Date();
        socket.emit('cct', d.getTime());
        console.log("PING! " + d);
    }
    function pif() {
        ping();
        setTimeout(function(){
            if(pong!=true) {
                Alert.error('No response from server', 'Connection error', {displayDuration: 0});
            } else {
                if(firstcon==false) {
                    Alert.success('You have established connection with the server', 'Connection successful!');
                    firstcon = true;
                }
            }
            pong=false;
        }, 3000)
    }
    
    socket.on('scr', function(dif) {
        console.log("PONG! ms:"+dif);
        pong = true;
    })
    pif();
    
    
    pingiv = setInterval(function(){
        pif();
    }, 5000);
    
});
$( document ).ready(function() {
    Alert.info('Connecting to server...', 'Welcome!', {displayDuration: 4000});
});