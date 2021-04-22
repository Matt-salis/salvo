const urlParams = new URLSearchParams(window.location.search);
const gp = urlParams.get('gp');
console.log(gp);
var g = parseInt(gp)


fetch('http://localhost:8080/api/game_view/' + gp)
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (data) {

        console.log(data)
        app.gameView = data;
        app.paintLocations();
        app.playerIndex();
        app.salvoLocations();
        app.hittedShips();
    })


var app = new Vue({
    el: '#app',
    data: {
        gameView: [],
        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        rows2: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        currentPlayer: "",
        currentAdversary: "",
        OpponnentShots: [],
        shipLocations: [],
    },
    methods: {
        paintLocations: function () {
            for (x = 0; x < app.gameView.ships.length; x++) {
                for (i = 0; i < app.gameView.ships[x].locations.length; i++) {
                    document.getElementById(app.gameView.ships[x].locations[i]).classList.toggle("ship");

                    app.shipLocations.push(app.gameView.ships[x].locations[i]);
                }
            }

        },
        salvoLocations: function () {

            var salvosPlayer = app.gameView.salvoes.filter(em => em.playerId == app.currentPlayer.id)
            var salvosOpponnent = app.gameView.salvoes.filter(em => em.playerId != app.currentPlayer.id)

            for (i = 0; i < salvosPlayer.length; i++) {
                for (x = 0; x < salvosPlayer[i].locations.length; x++) {
                    document.getElementById(salvosPlayer[i].locations[x].toLowerCase()).classList.toggle("salvo");
                    document.getElementById(salvosPlayer[i].locations[x].toLowerCase()).innerHTML = salvosPlayer[i].turn;
                }
            }
            for (i = 0; i < salvosOpponnent.length; i++) {
                for (x = 0; x < salvosOpponnent[i].locations.length; x++) {
                    document.getElementById(salvosOpponnent[i].locations[x]).classList.toggle("salvoAdversary");
                    document.getElementById(salvosOpponnent[i].locations[x]).innerHTML = salvosOpponnent[i].turn;

                    app.OpponnentShots.push(salvosOpponnent[i].locations[x]);
                }
            }

        },
        playerIndex: function () {
            var g = parseInt(gp)
            var gamer = app.gameView.gamePlayers.find(em => em.id == g)
            var adversary = app.gameView.gamePlayers.find(em => em.id != g)
            console.log("jugador actual " + gamer.player.email)
            app.currentPlayer = gamer.player;
            app.currentAdversary = adversary.player;
        },

        hittedShips: function () {

            for (x = 0; x < app.OpponnentShots.length; x++) {
                for (i = 0; i < app.shipLocations.length; i++) {
                    if (app.shipLocations[i] == app.OpponnentShots[x]) {
                        //document.getElementById(app.OpponnentShots[x]).innerHTML = "X";
                        document.getElementById(app.OpponnentShots[x]).classList.toggle("salvo");
                        var turn = document.getElementById(app.OpponnentShots[x]).innerHTML
                        console.log("hitted!: " + app.OpponnentShots[x] + ", on turn: " + turn)
                    }
                }
            }
        },
        logout: function () {
            $.post("/api/logout").done(function () {
                console.log("logged out");
                window.location.replace("/web/games.html");
            })
        },

    },
})