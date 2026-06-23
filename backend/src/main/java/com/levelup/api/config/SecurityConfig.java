package com.levelup.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// @Configuration avisa ao Spring: "Leia este arquivo ao iniciar a aplicação,
// pois ele contém configurações importantes para o sistema."
@Configuration
public class SecurityConfig {
    // @Bean indica que o objeto retornado por este método será gerenciado pelo Spring.
    // Assim, você pode injetar (usar) esse PasswordEncoder em qualquer lugar do projeto.
    @Bean
    public PasswordEncoder passwordEncoder() { //Criptografica a senha em um hash embaralhado e "sem sentido" para o banco de dados
        return new BCryptPasswordEncoder();
    }

    @Bean // Desabilita autenticação para teste - IGNORAR, NÃO É DEFINITIVO.
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
