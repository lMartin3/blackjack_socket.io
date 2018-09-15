$(function(){
    var $players = $('#players');
    var $ou = $('#ou');
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
        "ali"
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
        "player"
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
    var socket = io.connect();
    var randomnameone = rnam_first[Math.floor(Math.random() * rnam_first.length)];
    var randomnametwo = rnam_second[Math.floor(Math.random() * rnam_second.length)];
    var randomnamethree = rnam_third[Math.floor(Math.random() * rnam_third.length)];
    var rname = randomnameone + "_" + randomnametwo + "_" + randomnamethree;
    function askNickname() {
        nickname = prompt("Please enter your nickname:", rname);
    }
    askNickname();
    if(nickname==null || nickname=="") {
        nickname = rname;
    }
    console.log("2:" + nickname);
    console.log(rname);
    socket.emit('new_player', nickname);
    socket.on('reject', function(data) {
        console.log("lol u rejected");
        alert("Connection ended by server");
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
});