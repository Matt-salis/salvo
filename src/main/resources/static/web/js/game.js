const urlParams = new URLSearchParams(window.location.search);
const gp = urlParams.get('gp');
var gamePlayerId = parseInt(gp)

// var A = 1;
// var B = 2;
// var C = 3;
// var D = 4;
// var E = 5;
// var F = 6;
// var G = 7;
// var H = 8;
// var I = 9;
// var J = 10;

fetch('http://localhost:8080/api/game_view/' + gp)
    .then(function (respuesta) {
        if (respuesta.status == 200) {
            return respuesta.json();
        } else {
            throw new Error(respuesta.status);
        }
    })
    .then(function (data) {

        console.log(data)
        app.gameView = data;
        if (app.gameView != null) {
            app.paintLocations();
            app.playerIndex();
            app.salvoLocations();
            app.hittedShips();

        }
    }).catch(function (error) {

        alert("no puedes ver este juego");
        window.location.replace("/web/games.html");

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
        nships: 0,
        orientacion: "horizontal",
        actualShip: "",
        actualLocations: 0,
        placedShips: [],
        possitions: [],
        located: [],
        json: [],
    },
    methods: {
        paintLocations: function () {
            app.nships = app.gameView.ships.length;
            for (x = 0; x < app.gameView.ships.length; x++) {
                for (i = 0; i < app.gameView.ships[x].locations.length; i++) {
                    document.getElementById(app.gameView.ships[x].locations[i]).classList.toggle(app.gameView.ships[x].type);

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
            var gamePlayerId = parseInt(gp)
            var gamer = app.gameView.gamePlayers.find(em => em.id == gamePlayerId)
            var adversary = app.gameView.gamePlayers.find(em => em.id != gamePlayerId)
            if (adversary != null) {
                app.currentAdversary = adversary.player;
            }
            app.currentPlayer = gamer.player;


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

        // on click

        placed: function (r, c) {
            jsonLocation = {
                type: "",
                locations: []
            };

            document.getElementById("Destroyer").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Carrier").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Patrol").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Submarine").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Battleship").classList.replace("btn-danger", "btn-primary");


            if (!this.located.includes(this.actualShip)) {
                if (this.orientacion == "horizontal") {
                    if ((c + this.actualLocations - 1) <= 10) {
                        for (i = 0; i < this.actualLocations; i++) {
                            this.possitions.push(r + (c + i))
                        }

                        if (!this.placedShips.some(c => this.possitions.includes(c))) {
                            for (x = 0; x < this.possitions.length; x++) {
                                document.getElementById(this.possitions[x]).classList.toggle(this.actualShip, true);
                                this.placedShips.push(this.possitions[x])
                            }
                            this.located.push(this.actualShip);
                            document.getElementById(this.actualShip).classList.toggle("pressed", true)
                            this.nships += 1;
                            jsonLocation.type = this.actualShip;
                            jsonLocation.locations = this.possitions;
                            this.json.push(jsonLocation);
                            console.log(this.json);
                        }




                        this.possitions = [];
                    }


                } else if (this.orientacion == "vertical") {
                    if ((this.rows.indexOf(r) + this.actualLocations) <= 10) {
                        for (x = 0; x < this.actualLocations; x++) {
                            this.possitions.push((this.rows[this.rows.indexOf(r) + x]) + c)
                        }

                        if (!this.placedShips.some(c => this.possitions.includes(c))) {
                            for (i = 0; i < this.possitions.length; i++) {
                                document.getElementById(this.possitions[i]).classList.toggle(this.actualShip, true);
                                this.placedShips.push(this.possitions[i]);
                            }
                            this.located.push(this.actualShip);
                            document.getElementById(this.actualShip).classList.toggle("pressed", true) //
                            this.nships += 1;
                            jsonLocation.type = this.actualShip;
                            jsonLocation.locations = this.possitions;
                            this.json.push(jsonLocation);
                            console.log(this.json);

                        }



                        this.possitions = [];
                    }


                }
            }
        },

        //previsualization

        hover: function (r, c) {
            var allGrid = []
            for (i = 1; i <= 10; i++) {
                for (x = 0; x < 10; x++) {
                    allGrid.push(app.rows[x] + i);
                }
            }
            for (i = 0; i < 100; i++) {
                document.getElementById(allGrid[i]).classList.toggle("pre-selected", false);
            }
            if (!this.located.includes(this.actualShip)) {
                if (this.orientacion == "horizontal") {
                    if ((c + this.actualLocations - 1) <= 10) {
                        for (i = 0; i < this.actualLocations; i++) {
                            document.getElementById(r + (c + i)).classList.toggle("pre-selected", true);
                        }
                    }
                } else if (this.orientacion == "vertical") {
                    if ((this.rows.indexOf(r) + this.actualLocations) <= 10) {
                        for (x = 0; x < this.actualLocations; x++) {
                            document.getElementById((this.rows[this.rows.indexOf(r) + x]) + c).classList.toggle("pre-selected", true);

                        }
                    }
                }
            }
        },
        out: function (r, c) {
            if (app.orientacion == "horizontal") {
                if ((c + this.actualLocations - 1) <= 10) {
                    for (i = 0; i < this.actualLocations; i++) {
                        document.getElementById(r + (c + i)).classList.toggle("pre-selected", false);
                    }
                }
            } else if (this.orientacion == "vertical") {
                if ((this.rows.indexOf(r) + this.actualLocations) <= 10) {
                    for (x = 0; x < this.actualLocations; x++) {
                        document.getElementById((this.rows[this.rows.indexOf(r) + x]) + c).classList.toggle("pre-selected", false);
                    }
                }
            }
        },
        restart: function (r, c) {
            location.reload();
        },

        toggleOrientation: function () {
            if (this.orientacion == "horizontal") {
                this.orientacion = "vertical";
            } else {
                this.orientacion = "horizontal";
            }
        },

        setShipType: function (type, length) {
            document.getElementById("Destroyer").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Carrier").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Patrol").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Submarine").classList.replace("btn-danger", "btn-primary");
            document.getElementById("Battleship").classList.replace("btn-danger", "btn-primary");

            if (!document.getElementById(type).classList.contains("pressed")) {
                document.getElementById(type).classList.replace("btn-primary", "btn-danger");
            }
            this.actualShip = type;
            this.actualLocations = length;
        },

        logout: function () {
            $.post("/api/logout").done(function () {
                console.log("logged out");
                window.location.replace("/web/games.html");
            })
        },
        mainMenu: function () {
            window.location.replace("/web/games.html");
        },
        createShips: function () {
            $.post({
                url: "http://localhost:8080/api/games/players/" + gamePlayerId + "/ships",
                data: JSON.stringify(app.json),
                contentType: "application/json"
            }).done(function () {
                location.reload();
            })
        }

    },
})

document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 32) {

        app.toggleOrientation();
    }
});