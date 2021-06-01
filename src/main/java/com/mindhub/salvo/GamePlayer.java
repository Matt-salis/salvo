package com.mindhub.salvo;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@Entity
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Ship> ships;

    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Salvo> salvos;

    private LocalDateTime date;

    public GamePlayer() {
    }

    public GamePlayer(LocalDateTime date, Game game1, Player player1) {
        this.date = date;
        this.player = player1;
        this.game = game1;
    }

    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
    }

    public Optional<Score> getScore() {
        return player.getScore(game);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public void setShips(Set<Ship> ships) {
        this.ships = ships;
    }

    public Set<Salvo> getSalvos() {
        return salvos;
    }

    public void setSalvos(Set<Salvo> salvos) {
        this.salvos = salvos;
    }


    public Optional<GamePlayer> getOpponentOpt() {
        return this.getGame().getGamePlayers().stream().filter(gp -> gp.getId() != this.getId()).findFirst();

    }

    public GameStatus gameStatus() {
        if (this.getShips().isEmpty()) {
            return GameStatus.PLACE_SHIPS;
        } else {
            if (this.getOpponentOpt().isPresent()) {
                if (this.getOpponentOpt().get().getShips().isEmpty()) {
                    return GameStatus.WAIT_OPPONENT;
                } else {
                    if (this.getSalvos().stream().noneMatch(em -> em.getTurn() == this.getSalvos().size())) {
                        return GameStatus.PLACE_SALVOES;
                    } else {
                        if (this.getOpponentOpt().get().getSalvos().stream().noneMatch(em -> em.getTurn() == this.getOpponentOpt().get().getSalvos().size())) {
                            return GameStatus.WAIT_OPPONENT;
                        } else if (this.getSalvos().size() == this.getOpponentOpt().get().getSalvos().size()) {
                            List<Long> mySunks = this.getSalvos().stream().filter(x -> x.getTurn() == this.getSalvos().size()).flatMap(x -> x.getSunkedShips().stream()).map(Ship::getId).collect(toList());
                            List<Long> oppSunks = new ArrayList<>();

                            if (this.getOpponentOpt().isPresent()) {
                                oppSunks = this.getOpponentOpt().get().getSalvos().stream().filter(x -> x.getTurn() == this.getSalvos().size()).flatMap(x -> x.getSunkedShips().stream()).map(Ship::getId).collect(toList());
                            }

                            if (mySunks.size() == 5 && oppSunks.size() == 5) {
                                return GameStatus.TIE;
                            } else if (mySunks.size() == 5) {
                                return GameStatus.WIN;
                            } else if (oppSunks.size() == 5) {
                                return GameStatus.LOSE;
                            } else {
                                return GameStatus.PLACE_SALVOES;
                            }
                        } else {
                            List<Long> mySunks = this.getSalvos().stream().filter(x -> x.getTurn() == this.getSalvos().size()).flatMap(x -> x.getSunkedShips().stream()).map(Ship::getId).collect(toList());
                            if (mySunks.size() == 5) {
                                return GameStatus.WAIT_OPPONENT;
                            }else if(this.getSalvos().size() - this.getOpponentOpt().get().getSalvos().size() == 1){
                                return GameStatus.WAIT_OPPONENT;
                            }else{
                                return GameStatus.PLACE_SALVOES;
                            }
                        }
                    }
                }
            } else {
                return GameStatus.WAIT_OPPONENT;
            }
        }

    }


}








