package com.mindhub.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;



@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    GameRepository gameRepository;

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    GamePlayerRepository gamePlayerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Object> register(@RequestParam String userName, @RequestParam String password) {

        if (userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (playerRepository.findByUserName(userName) !=  null) {
            return new ResponseEntity<>("Name already in use", HttpStatus.FORBIDDEN);
        }

        playerRepository.save(new Player(userName, passwordEncoder.encode(password)));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/games/{nn}/players")
    public  ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long nn, Authentication authentication){

        if(!isGuest(authentication)) {
            Optional<Game> game = gameRepository.findById(nn);
            Player auth = playerRepository.findByUserName(authentication.getName());
            if(game.isPresent()){
                if(game.get().getGamePlayers().size() < 2){

                    GamePlayer gamePlayer = new GamePlayer(LocalDateTime.now(), game.get() , auth);
                    gamePlayerRepository.save(gamePlayer);
                    return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);

                }else{
                    return new  ResponseEntity<>(makeMap("Error", "This game is full!"), HttpStatus.FORBIDDEN);
                }
            }else{
                return new  ResponseEntity<>(makeMap("Error", "This game doesn't exist!"), HttpStatus.NOT_FOUND);
            }

        }else{
           return new  ResponseEntity<>(makeMap("Error", "Log in to join a new game!"), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/games")
    public ResponseEntity<Map<String, Object>> newGame(LocalDateTime date, Authentication authentication) {

        if(!isGuest(authentication)){
            Game newJuego = new Game(LocalDateTime.now());
            gameRepository.save(newJuego);
            Player auth = playerRepository.findByUserName(authentication.getName());
            GamePlayer gamePlayer = new GamePlayer(LocalDateTime.now(), newJuego, auth);
            gamePlayerRepository.save(gamePlayer);
            return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);

        }else{
            return new ResponseEntity<>(makeMap("Error", "No tenes acceso! inicia sesion"), HttpStatus.UNAUTHORIZED);
        }
    }

     @GetMapping("/game_view/{nn}")
     public  ResponseEntity<Map<String, Object>> findGamePlayer(@PathVariable Long nn, Authentication authentication) {

            if(!isGuest(authentication)){

                Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(nn);

               return gamePlayer.map(gp -> {

                    Player auth = playerRepository.findByUserName(authentication.getName());

                    if( auth.getId() == gp.getPlayer().getId()){
                        return new ResponseEntity<>(makeGameViewDTO(gp), HttpStatus.OK) ;
                    }
                    else{
                        return new ResponseEntity<>(makeMap("Error","no espies!"), HttpStatus.FORBIDDEN);
                    }
                }).orElse(new ResponseEntity<>(makeMap("Error","no existe!"), HttpStatus.NOT_FOUND));

            }else{
                return new ResponseEntity<>(makeMap("Error","No tenes acceso! inicia sesion"), HttpStatus.UNAUTHORIZED);
            }
    }



    @RequestMapping("/games")
    public  Map<String, Object> getAllGames(Authentication authentication) {

        List<Map<String, Object>> games = gameRepository.findAll().stream().map(this::makeGameDTO).collect(toList());



        Map<String, Object> currentPlayer;
        if(!isGuest(authentication)){
            Player auth = playerRepository.findByUserName(authentication.getName());
            currentPlayer = makePlayerDTO(auth);

        }else{
            currentPlayer = null;
        }
        Map<String, Object> dto = new LinkedHashMap<String, Object>();

        dto.put("player", currentPlayer);
        dto.put("games", games);
        return dto;
    }

    private Map<String, Object> makeGameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("date", game.getDate());
        dto.put("gamePlayers", game.getGamePlayers().stream().map(this::makeGamePlayerDTO).collect(toList()));
        return dto;
    }

    private Map<String, Object> makeGamePlayerDTO(GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        dto.put("score", gamePlayer.getScore().map(Score::getScore).orElse(null));
        return dto;
    }

    private Map<String, Object> makePlayerDTO(Player player){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        return dto;
    }

    private Map<String, Object> makeGameViewDTO(GamePlayer gamePlayer){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getGame().getId());
        dto.put("date", gamePlayer.getGame().getDate());
        dto.put("gamePlayers", gamePlayer.getGame().getGamePlayers().stream().map(this::makeGamePlayerDTO).collect(toList()));
        dto.put("ships", gamePlayer.getShips().stream().map(this::makeShipDTO).collect(toList()));
        dto.put("salvoes", gamePlayer.getGame().getGamePlayers().stream().flatMap((a) -> a.getSalvos().stream().map(this::makeSalvoDTO)));
        return dto;
     }

     private Map<String, Object> makeShipDTO(Ship ship){
         Map<String, Object> dto = new LinkedHashMap<String, Object>();
         dto.put("type", ship.getType());
         dto.put("locations", ship.getLocations());
         return dto;
     }

    private Map<String, Object> makeSalvoDTO(Salvo salvo){
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("playerId", salvo.getGamePlayer().getPlayer().getId());
        dto.put("turn", salvo.getTurn());
        dto.put("locations", salvo.getLocations());
        return dto;
    }

    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }


}

