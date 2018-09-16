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
        var html = 'Status: ' + data;
        $status.html(html);
    })
    socket.on('start_game', function() {
        var audio = new Audio('audio_background.mp3');
        audio.play();        
        $controls.show();
    })
    socket.on('update_round', function(data) {
        html = 'Round ' + data;
        $round.html(html);
    })
    socket.on('update_turn', function(turnof, time) {
        html = turnof + "'s turn " + "(" + time + ")";
        $turn.html(html);
    })
});