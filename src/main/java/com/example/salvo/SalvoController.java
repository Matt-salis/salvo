package com.example.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    GameRepository gameRepository;

    @Autowired
    GamePlayerRepository gamePlayerRepository;

    @Autowired
    ShipRepository shipRepository;

     
     @GetMapping("/game_view/{nn}")
     public Map<String, Object> findGamePlayer(@PathVariable Long nn) {
             return makeGameViewDTO(gamePlayerRepository.findById(nn).get());
     }

    @RequestMapping("/games")
    public  List<Map<String, Object>> getAllGames(){
        return gameRepository.findAll().stream().map(this::makeGameDTO).collect(toList());
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

}

