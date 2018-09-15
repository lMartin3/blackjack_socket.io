$(function(){
    var $loginform = $('#loginform');
    var $username = $('#username');
    var $gameform = $('#gameform');
    var $players = $('#players');
    var $ou = $('#ou');
    var $status = $('#status');
    
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
        "lección"
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
    var randomnameone = rnam_first[Math.floor(Math.random() * rnam_first.length)];
    var randomnametwo = rnam_second[Math.floor(Math.random() * rnam_second.length)];
    var randomnamethree = rnam_third[Math.floor(Math.random() * rnam_third.length)];
    var rname = randomnameone + "_" + randomnametwo + "_" + randomnamethree;
    $username.val(rname);
    var socket = io.connect();
    document.getElementById("joinGame").addEventListener("click", function(){
        console.log($username.val());
        socket.emit('new_player', $username.val());
        $loginform.hide();
        $gameform.show();
        $username.val('');
    });

    socket.on('reject', function(data) {
        console.log("lol u rejected");
        alert("Kicked by Server System" +  "\nReason: " + data);
    });
    socket.on('refresh_players', function(data){
        console.log("Refreshing players...")
        var html = '';
        for(i = 0;i < data.length;i++) {
            html += '<li class="list-group-item">'+data[i]+'</li>';
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
        console.log("Che esto funcionó re bien");
    })
});