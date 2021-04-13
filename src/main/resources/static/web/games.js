var app = new Vue({
    el: '#app',
    data: {
        games: [],
        leaderBoard: {
            totalScore1: 0,
            numberOfWins: 0,
            numberOfLost: 0,
            numberOfTies: 0,
            player1: [],
            player2: [],
            player3: [],

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
        puntaje();
        console.log(app.leaderBoard.player1);
        console.log(
            app.leaderBoard.player1.reduce((a, b) => a + b, 0)
        )
        console.log(app.leaderBoard.player2);
        console.log(app.leaderBoard.player3);
    })

function puntaje() {

    for (i = 0; i < app.games.length; i++) {
        for (x = 0; x < app.games[i].gamePlayers.length; x++) {
            if (app.games[i].gamePlayers[x].player.id == 1) {
                app.leaderBoard.player1.push(app.games[i].gamePlayers[x].score);
            }
        }
    }
}

