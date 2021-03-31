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
    public CommandLineRunner initPlayers(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository,ShipRepository shipRepository) {
        return (args) -> {

            Game game1 = new Game(LocalDateTime.now());
            Game game2 = new Game(LocalDateTime.now().plusHours(1));
            Player player1 = new Player("j.bauer@ctu.gov");
            Player player2 = new Player("c.obrian@ctu.gov");
            Player player3 = new Player("kim_bauer@gmail.com");
            GamePlayer gamePlayer1 = new GamePlayer(LocalDateTime.now(), game1, player1);
            GamePlayer gamePlayer2 = new GamePlayer(LocalDateTime.now(), game1, player2);

            playerRepository.save(player1);
            playerRepository.save(player2);
            playerRepository.save(player3);;
            playerRepository.save(new Player("t.almeida@ctu.gov"));

            gameRepository.save(game1);
            gameRepository.save(game2);

            gamePlayerRepository.save(gamePlayer1);
            gamePlayerRepository.save(gamePlayer2);
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


        };
    }
}


