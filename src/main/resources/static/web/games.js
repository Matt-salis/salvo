var app = new Vue({
    el: '#app',
    data: {
        games: [],
        scores: [],
    },
    methods: {
        scorePlayers: function (games) {
            for (i = 0; i < games.length; i++) {
                var gameplayers = games[i].gamePlayers
                for (j = 0; j < gameplayers.length; j++) {

                    //app.scores inicialmente esta vacio.. pero al realizar el primer for un ciclo completo ya hay valores pusheados en app.score
                    //y para ese caso que el app.score no tiene valores aun, para eso es el primer if que setea todo a un 0 default
                    var playerIndex = app.scores.findIndex(scorePlayer => scorePlayer.player === gameplayers[j].player.email)

                    if (gameplayers[j].score != null) {
                        if (playerIndex == -1) {
                            var Score = {
                                player: gameplayers[j].player.email,
                                lost: 0,
                                tied: 0,
                                wins: 0,
                                total: 0,
                            };
                            if (gameplayers[j].score == 0.0) Score.lost++;
                            else if (gameplayers[j].score == 0.5) Score.tied++;
                            else if (gameplayers[j].score == 1.0) Score.wins++;
                            Score.total += gameplayers[j].score;
                            app.scores.push(Score);

                        } else {
                            if (gameplayers[j].score == 0.0) app.scores[playerIndex].lost++;
                            else if (gameplayers[j].score == 0.5) app.scores[playerIndex].tied++;
                            else if (gameplayers[j].score == 1.0) app.scores[playerIndex].wins++;
                            app.scores[playerIndex].total += gameplayers[j].score;


                        }
                    }
                }
            }
            console.log(app.scores);
        }
    }
})

fetch('http://localhost:8080/api/games')
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (data) {

        app.games = data;
        console.log(app.games);
        app.scorePlayers(app.games);
    })