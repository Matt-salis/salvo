
const urlParams = new URLSearchParams(window.location.search);
const gp = urlParams.get('gp');
console.log(gp)
var barco = []

fetch('http://localhost:8080/api/game_view/' + gp)
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(data) {

        console.log(data)
       app.game_view = data;

    })
    .then(function(tipo){
        function compare( a, b ) {
            if ( a.type < b.type ){
              return -1;
            }
            if ( a.type > b.type ){
              return 1;
            }
            return 0;
          }
          
        barco = app.game_view[0].ships.sort( compare )
    })
    .then(function(color){
        for(i=0; i<barco[0].locations.length; i++){
            document.getElementById(barco[0].locations[i]).classList.toggle("ship");
            
        }
        for(i=0; i<barco[1].locations.length; i++){
            document.getElementById(barco[1].locations[i]).classList.toggle("ship");
            
        }
        for(i=0; i<barco[2].locations.length; i++){
            document.getElementById(barco[2].locations[i]).classList.toggle("ship");
            
        }
        for(i=0; i<barco[3].locations.length; i++){
            document.getElementById(barco[3].locations[i]).classList.toggle("ship");
            
        }
        for(i=0; i<barco[4].locations.length; i++){
            document.getElementById(barco[4].locations[i]).classList.toggle("ship");
            
        }

    })




var app = new Vue({
    el: '#app',
    data: {
        game_view: [],
        columns: [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10],
        rows: ["A","B","C","D","E","F","G","H","I","J"],

    },


})


// document.getElementById('A1').classList.toggle("ship");
// document.getElementById('A2').classList.toggle("ship");
// document.getElementById('A3').classList.toggle("ship");

