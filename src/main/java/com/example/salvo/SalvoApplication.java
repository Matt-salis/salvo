package com.example.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.time.LocalDateTime;


@SpringBootApplication
public class SalvoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class);
    }

    @Bean
    public CommandLineRunner initPlayers(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository) {
        return (args) -> {

            Game game1 = new Game(LocalDateTime.now());
            Game game2 = new Game(LocalDateTime.now());
            Player player1 = new Player("j.bauer@ctu.gov");
            Player player2 = new Player("c.obrian@ctu.gov");
            Player player3 = new Player("kim_bauer@gmail.com");

            playerRepository.save(player1);
            playerRepository.save(player2);
            playerRepository.save(player3);;
            playerRepository.save(new Player("t.almeida@ctu.gov"));

            gameRepository.save(game1);
            gameRepository.save(game2);


            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game1, player1));
            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game1, player2));
            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game2, player3));
            gamePlayerRepository.save(new GamePlayer(LocalDateTime.now(), game2, player2));

        };
    }
}

