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

    })
   
   




var app = new Vue({
    el: '#app',
    data: {
        gameView: [],
        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        currentPlayer: "",
        currentAdversary: "",
    },
    methods: {
        paintLocations: function () {
            for (x = 0; x < app.gameView.ships.length; x++) {
                for (i = 0; i < app.gameView.ships[x].locations.length; i++) {
                    document.getElementById(app.gameView.ships[x].locations[i]).classList.toggle("ship" + x);
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
        }
    }

})