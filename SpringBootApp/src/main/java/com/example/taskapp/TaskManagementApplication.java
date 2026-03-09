package com.example.taskapp;

import com.example.taskapp.model.User;
import com.example.taskapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class TaskManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagementApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                String passwordHash = encoder.encode("admin12345");
                User admin = new User("admin", passwordHash);
                admin.setRole("ADMIN");
                userRepository.save(admin);
            }
        };
    }

}
