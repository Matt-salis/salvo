fetch('http://localhost:8080/api/game_view/nn')
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(data) {

        app.game_view = data;

    })


var app = new Vue({
    el: '#app',
    data: {
        game_view: []


    }
})