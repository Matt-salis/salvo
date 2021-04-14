var app = new Vue({
    el: '#app',
    data: {
        games: [],
        scores: [],
    }
})

fetch('http://localhost:8080/api/games')
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (data) {

        app.games = data;
        console.log(app.games);
        scorePlayers(app.games);
    })



function scorePlayers(games) {
    for (i = 0; i < games.length; i++) {
        var gameplayers = games[i].gamePlayers
        for (j = 0; j < gameplayers.length; j++) {
            var index = app.scores.findIndex(scorePlayer => scorePlayer.player === gameplayers[j].player.email)

            if (index == -1) {
                var Score = {
                    player: gameplayers[j].player.email,
                    lost: 0,
                    tied: 0,
                    wins: 0,
                    total: 0,
                };
                if (gameplayers[j].score != null) {
                    if (gameplayers[j].score == 0.0) Score.lost++;
                    else if (gameplayers[j].score == 0.5) Score.tied++;
                    else if (gameplayers[j].score == 1.0) Score.wins++;

                    Score.total += gameplayers[j].score;

                    app.scores.push(Score)
                }
            } else {
                if (gameplayers[j].score != null) {
                    if (gameplayers[j].score == 0.0) app.scores[index].lost++;
                    else if (gameplayers[j].score == 0.5) app.scores[index].tied++;
                    else if (gameplayers[j].score == 1.0) app.scores[index].wins++;
                    app.scores[index].total += gameplayers[j].score;
                }
            }
        }
    }
    console.log(app.scores);
}