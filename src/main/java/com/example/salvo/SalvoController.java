package com.example.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    GameRepository gameRepository;

   // @Autowired
   // ShipRepository shipRepository;
//
   // @RequestMapping("/game_view")
   // public List<Map<String, Object> getAllBoards(){
   //     return shipRepository.findAll().stream().map(this::makeShipDTO).collect(toList());
   // }
   // private Map<String, Object> makeShipDTO(Ship ship) {
   //     Map<String, Object> dto = new LinkedHashMap<String, Object>();
   //     dto.put("id", ship.getId());
   //     dto.put("locations", ship.getLocations());
   //     dto.put("shipType", ship.getType());
   //     dto.put("gamePlayers", ship.getGamePlayer().stream().map(this::makeGamePlayerDTO).collect(toList()));
   //     return dto;
   // }


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

}

