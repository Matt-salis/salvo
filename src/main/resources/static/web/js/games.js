var app = new Vue({
    el: '#app',
    data: {
        player: [],
        games: [],
        gpid: "",
        scores: [],
        user: "",
        password: "",

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
        },
        login: function () {
            $.post("/api/login", {
                    username: app.user,
                    password: app.password
                })
                .done(function () {
                    console.log("logged in!");
                    location.reload();
                })
                .fail(function () {
                    alert("LOGGIN FAILED SUCCESFULLY!!");
                })
        },
        signup: function () {
            $.post("/api/players", {
                userName: app.user,
                password: app.password
            }).done(function () {
                $.post("/api/login", {
                        username: app.user,
                        password: app.password
                    })
                    .done(function () {
                        console.log("logged in!");
                        location.reload();
                    })
            }).fail(function () {
                alert("SIGN UP FAILED SUCCESFULLY!!");
            })
        },
        logout: function () {
            $.post("/api/logout").done(function () {
                console.log("logged out");
                location.reload();
            })
        },
        currentPlayer: function (player) {
            if (player != null) {
                console.log("curretn Player is: " + player.email)
                document.getElementById("iniciarSesion").classList.toggle('invisible');
            }
        },
        newGame: function () {
            $.post("/api/games")
                .done(function (datos) {
                    console.log(datos);
                    window.location.href = ("/web/game.html?gp=" + datos.gpid);
                    console.log("game created");
                })
                .fail(function () {
                    alert("GAME CREATION FAILED SUCCESFULLY!!");
                })
        },
        retGame: function (jg) {
            window.location.href = ("/web/game.html?gp=" + jg);
        },

        joinGame: function (game) {
            $.post("/api/games/" + game + "/players")
        .done(function (datos){
            window.location.href = ("/web/game.html?gp=" + datos.gpid);
        }).fail(function (){
            alert("Cant join game!");
        })
        },
    }
})


fetch('http://localhost:8080/api/games')
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (data) {

        app.games = data.games;
        app.player = data.player;
        app.gpid = data.gpid;
        console.log(data.gpid);
        app.scorePlayers(app.games);
        app.currentPlayer(app.player);
    })