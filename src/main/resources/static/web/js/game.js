const urlParams = new URLSearchParams(window.location.search);
const gp = urlParams.get('gp');
var gamePlayerId = parseInt(gp)



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
        turn: 1,
        salvosPlayer: [],
        salvosOpponnent: [],
        salvos: [],
        nsalvos: 0,
        jsonSalvo: [],
    },
    methods: {

        paintLocations: function () {

            app.nships = app.gameView.ships.length;
            for (x = 0; x < app.gameView.ships.length; x++) {
                let shp = 1
                for (i = 0; i < app.gameView.ships[x].locations.length; i++) {
                    if (app.gameView.ships[x].locations[0][0] == app.gameView.ships[x].locations[1][0]) {
                        document.getElementById(app.gameView.ships[x].locations[i]).classList.toggle(app.gameView.ships[x].type + shp);
                    } else {
                        document.getElementById(app.gameView.ships[x].locations[i]).classList.toggle(app.gameView.ships[x].type + shp);
                        document.getElementById(app.gameView.ships[x].locations[i]).style.transform = 'rotate(90deg)';
                    }
                    shp += 1;
                    app.shipLocations.push(app.gameView.ships[x].locations[i]);
                }
            }

        },
        salvoLocations: function () {

            this.salvosPlayer = app.gameView.salvoes.filter(em => em.playerId == app.currentPlayer.id)
            this.salvosOpponnent = app.gameView.salvoes.filter(em => em.playerId != app.currentPlayer.id)

            for (i = 0; i < this.salvosPlayer.length; i++) {
                for (x = 0; x < this.salvosPlayer[i].locations.length; x++) {
                    document.getElementById(this.salvosPlayer[i].locations[x].toLowerCase()).classList.toggle("salvo");
                    document.getElementById(this.salvosPlayer[i].locations[x].toLowerCase()).innerHTML = this.salvosPlayer[i].turn;
                }
            }
            for (i = 0; i < this.salvosOpponnent.length; i++) {
                for (x = 0; x < this.salvosOpponnent[i].locations.length; x++) {
                    document.getElementById(this.salvosOpponnent[i].locations[x]).classList.toggle("salvoAdversary");
                    document.getElementById(this.salvosOpponnent[i].locations[x]).innerHTML = this.salvosOpponnent[i].turn;

                    app.OpponnentShots.push(this.salvosOpponnent[i].locations[x]);
                }
            }
            this.turn = 1;
            this.turn += this.salvosPlayer.length;
            console.log("current turn is: " + this.turn);

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
            let shp = 1
            if (this.nships < 5) {
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
                                    document.getElementById(this.possitions[x]).classList.toggle(this.actualShip + shp, true);
                                    shp += 1
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
                                    document.getElementById(this.possitions[i]).classList.toggle(this.actualShip + shp, true);
                                    document.getElementById(this.possitions[i]).style.transform = 'rotate(90deg)';
                                    shp += 1
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
                    if ((parseInt(c) + this.actualLocations - 1) <= 10) {
                        for (i = 0; i < this.actualLocations; i++) {
                            document.getElementById(r + (parseInt(c) + i)).classList.toggle("pre-selected", true);
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



        setSalvoes: function (row, column) {
        let salvoShots = {
            turn: 0,
            locations: [],
        }
            

            if (this.gameView.ships != null && this.gameView.ships.length == 5) {

                function taken(spot) {
                    return spot == row.toUpperCase() + column;
                }

                if (app.salvos.includes(row.toUpperCase() + column)) {
                    document.getElementById(row + column).classList.toggle('shot', false);
                    //this.salvos.indexOf(row + column) = null
                    if (this.salvos.indexOf(row.toUpperCase() + column) > -1) {
                        this.salvos.splice(this.salvos.indexOf(row.toUpperCase() + column), 1);
                    }
                    this.nsalvos -= 1;
                } else {
                    if (this.nsalvos < 5) {
                        if (this.salvosPlayer.length != 0 && !this.salvosPlayer[this.turn - 1].locations.some(taken)) {
                            document.getElementById(row + column).classList.toggle("shot", true);
                            this.salvos.push(row.toUpperCase() + column);
                            this.nsalvos += 1;

                        } else {

                            if (!this.salvos.some(taken)) {

                                document.getElementById(row + column).classList.toggle("shot", true);
                                this.salvos.push(row.toUpperCase() + column);
                                this.nsalvos += 1;
                            }
                        }
                    }
                }
            }
        
            salvoShots.locations = this.salvos;
            salvoShots.turn = this.turn;
            this.jsonSalvo.push(salvoShots);
            console.log(this.salvos);
            console.log(row.toLowerCase() + column);
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


        createSalvoes: function () {
            $.post({
                url: "http://localhost:8080/api/games/players/" + gamePlayerId + "/salvos",
                data: JSON.stringify(app.jsonSalvo),
                contentType: "application/json"
            }).done(function () {
                location.reload();
            })
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

        element = document.querySelectorAll(':hover')

        app.toggleOrientation();

        let poss = element[element.length - 1];
        if (poss.tagName == 'TD') {
            let r = poss.id.charAt(0);
            let c = poss.id.substring(1);

            app.hover(r, c);
        }
    }
});