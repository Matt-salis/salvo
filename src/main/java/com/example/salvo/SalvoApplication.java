package com.example.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication
public class SalvoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class);
    }

    LocalDateTime dateTime = LocalDateTime.now();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    @Bean
    public CommandLineRunner initPlayers(PlayerRepository playerRepository, GameRepository gameRepository) {
        return (args) -> {
            // save a couple of customers
            playerRepository.save(new Player("j.bauer@ctu.gov"));
            playerRepository.save(new Player("c.obrian@ctu.gov"));
            playerRepository.save(new Player("kim_bauer@gmail.com"));
            playerRepository.save(new Player("t.almeida@ctu.gov"));

            gameRepository.save(new Game(dateTime.format(formatter)));
            gameRepository.save(new Game("20/03/2021"));
            gameRepository.save(new Game("21/03/2021"));

        };
    }

}

