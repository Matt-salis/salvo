package com.example.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.DoubleStream;

@Entity
public class GamePlayer {
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
        @GenericGenerator(name = "native", strategy = "native")
        private long id;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name="player_id")
        private Player player;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name="game_id")
        private Game game;

        @OneToMany(mappedBy ="gamePlayer", fetch = FetchType.EAGER)
        Set<Ship> ships;

        @OneToMany(mappedBy ="gamePlayer", fetch = FetchType.EAGER)
        Set<Salvo> salvos;

        private LocalDateTime date;

        public GamePlayer(){}

        public GamePlayer(LocalDateTime date, Game game1, Player player1) {
                this.date = date;
                this.player = player1;
                this.game = game1;
        }

        public void addShip(Ship ship) {
                ship.setGamePlayer(this);
        }

        public Optional<Score> getScore(){
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
}





