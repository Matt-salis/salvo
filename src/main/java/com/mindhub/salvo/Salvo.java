package com.mindhub.salvo;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.http.ResponseEntity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    private Integer turn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name = "Locations")
    private List<String> locations = new ArrayList<>();


    public Salvo() {
    }

    public Salvo(GamePlayer gamePlayer, Integer turn, List<String> locations ) {
        this.gamePlayer = gamePlayer;
        this.turn = turn;
        this.locations = locations;
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Integer getTurn() {
        return turn;
    }

    public void setTurn(Integer turn) {
        this.turn = turn;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public List<String> getLocations() {
        return locations;
    }

    public void setLocations(List<String> locations) {
        this.locations = locations;
    }

    public  List<String> getHits(){
        List<String> hits = new ArrayList<>();
        Optional<GamePlayer> opponent = this.gamePlayer.getOpponentOpt();

        if(opponent.isPresent()){
            List<String> ships = opponent.get().getShips().stream().flatMap(s -> s.getLocations().stream()).collect(toList());
            hits = ships.stream().filter(x -> this.getLocations().contains(x)).collect(Collectors.toList());
        }
        return hits;
    }

    public  List<Ship> getSunkedShips() {
        Optional<GamePlayer> opponent = this.gamePlayer.getOpponentOpt();
        List<Ship> sunks = new ArrayList<>();
        List<String> allHitsLocations = this.getGamePlayer().getSalvos().stream().filter(a -> a.turn <= this.getTurn()).flatMap(a -> a.getHits().stream()).collect(toList());

        if(opponent.isPresent()){
           sunks = opponent.get().getShips().stream().filter(x -> allHitsLocations.containsAll(x.getLocations())).collect(toList());
        }
        return sunks;
    }
}