package com.example.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.time.LocalDateTime;
import java.util.List;


@SpringBootApplication
public class SalvoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class);
    }

    @Bean
    public CommandLineRunner initPlayers(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository,ShipRepository shipRepository,SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
        return (args) -> {

            Game game1 = new Game(LocalDateTime.now());
            Game game2 = new Game(LocalDateTime.now().plusHours(1));
            Game game3 = new Game(LocalDateTime.now().plusHours(2));
            Game game4 = new Game(LocalDateTime.now().plusHours(3));
            Game game5 = new Game(LocalDateTime.now().plusHours(4));

            Player player1 = new Player("j.bauer@ctu.gov");
            Player player2 = new Player("c.obrian@ctu.gov");
            Player player3 = new Player("kim_bauer@gmail.com");
            GamePlayer gamePlayer1 = new GamePlayer(LocalDateTime.now(), game1, player1);
            GamePlayer gamePlayer2 = new GamePlayer(LocalDateTime.now(), game1, player2);
            GamePlayer gamePlayer3 = new GamePlayer(LocalDateTime.now(), game4, player1);
            GamePlayer gamePlayer4 = new GamePlayer(LocalDateTime.now(), game4, player2);
            GamePlayer gamePlayer5 = new GamePlayer(LocalDateTime.now(), game3, player1);
            GamePlayer gamePlayer6 = new GamePlayer(LocalDateTime.now(), game3, player2);
            GamePlayer gamePlayer7 = new GamePlayer(LocalDateTime.now(), game5, player1);
            GamePlayer gamePlayer8 = new GamePlayer(LocalDateTime.now(), game5, player3);

            playerRepository.save(player1);
            playerRepository.save(player2);
            playerRepository.save(player3);;
            playerRepository.save(new Player("t.almeida@ctu.gov"));

            gameRepository.save(game1);
            gameRepository.save(game2);
            gameRepository.save(game3);
            gameRepository.save(game4);
            gameRepository.save(game5);

            gamePlayerRepository.save(gamePlayer1);
            gamePlayerRepository.save(gamePlayer2);
            gamePlayerRepository.save(gamePlayer3);
            gamePlayerRepository.save(gamePlayer4);
            gamePlayerRepository.save(gamePlayer5);
            gamePlayerRepository.save(gamePlayer6);
            gamePlayerRepository.save(gamePlayer7);
            gamePlayerRepository.save(gamePlayer8);
            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game2, player3));
            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game2, player2));

            Ship ship1 = new Ship(gamePlayer1,"Destroyer", List.of("H2", "H3", "H4") );
            Ship ship2 = new Ship(gamePlayer1,"Patrol", List.of("J2", "J3") );
            Ship ship3 = new Ship(gamePlayer1,"Battleship", List.of("A2","B2","C2","D2") );
            Ship ship4 = new Ship(gamePlayer1,"Submarine", List.of("C8","D8","E8") );
            Ship ship5 = new Ship(gamePlayer1,"Carrier", List.of("F2","F3","F4","F5","F6") );
            Ship ship6 = new Ship(gamePlayer2,"Destroyer", List.of("B3","B4","B5") );
            Ship ship7 = new Ship(gamePlayer2,"Patrol", List.of("A1","B1") );
            Ship ship8 = new Ship(gamePlayer2,"Battleship", List.of("E5","E6","E7","E8") );
            Ship ship9 = new Ship(gamePlayer2,"Submarine", List.of("G1","H1","I1") );
            Ship ship10 = new Ship(gamePlayer2,"Carrier", List.of("E3","F3","G3","H3","I3") );
            shipRepository.save(ship1);
            shipRepository.save(ship2);
            shipRepository.save(ship3);
            shipRepository.save(ship4);
            shipRepository.save(ship5);
            shipRepository.save(ship6);
            shipRepository.save(ship7);
            shipRepository.save(ship8);
            shipRepository.save(ship9);
            shipRepository.save(ship10);

            Salvo salvo1 = new Salvo(gamePlayer1, 1, List.of("G3","F1","A6","D2","E1"));
            Salvo salvo2 = new Salvo(gamePlayer2, 1, List.of("E5","H1","G3","I3","F3"));
            Salvo salvo3 = new Salvo(gamePlayer1, 2, List.of("A2","A4","G6","A3","H6"));
            Salvo salvo4 = new Salvo(gamePlayer2, 2, List.of("E1","H3","A7","C5","C6"));
            salvoRepository.save(salvo1);
            salvoRepository.save(salvo2);
            salvoRepository.save(salvo3);
            salvoRepository.save(salvo4);

            Score score1 = new Score(LocalDateTime.now().plusMinutes(30), player1, game1, 1.0 );
            Score score2 = new Score(LocalDateTime.now().plusMinutes(30), player2, game1, 0.0 );
            Score score3 = new Score(LocalDateTime.now().plusMinutes(90), player2, game2, 1.0 );
            Score score4 = new Score(LocalDateTime.now().plusMinutes(90), player3, game2, 0.0 );
            Score score5 = new Score(LocalDateTime.now().plusMinutes(150), player1, game3, 0.5 );
            Score score6 = new Score(LocalDateTime.now().plusMinutes(150), player2, game3, 0.5 );
            Score score7 = new Score(LocalDateTime.now().plusMinutes(210), player1, game4, 0.5 );
            Score score8 = new Score(LocalDateTime.now().plusMinutes(210), player2, game4, 0.5 );
            scoreRepository.save(score1);
            scoreRepository.save(score2);
            scoreRepository.save(score3);
            scoreRepository.save(score4);
            scoreRepository.save(score5);
            scoreRepository.save(score6);
            scoreRepository.save(score7);
            scoreRepository.save(score8);

        };
    }
}


