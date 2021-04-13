var app = new Vue({
    el: '#app',
    data: {
        games: [],
        leaderBoard: {
            totalScore1: 0,
            numberOfWins: 0,
            numberOfLost: 0,
            numberOfTies: 0,
            emails: [],
            

        },
        methods: {

        },

    }
})

fetch('http://localhost:8080/api/games')
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (data) {

        app.games = data;
        console.log(app.games);
        players();
    })



    function players(){
        for(var i = 0; i < app.games.length; i++){
            for(j=0; j < app.games[i].gamePlayers.length; j++){
                if(!app.leaderBoard.emails.includes(app.games[i].gamePlayers[j].player.email)){
                    app.leaderBoard.emails.push(app.games[i].gamePlayers[j].player.email);  
                }
            }
        }
        console.log(app.leaderBoard.emails);
    }

    function score() 
