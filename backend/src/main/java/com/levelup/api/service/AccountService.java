package com.levelup.api.service;

import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Account register(SignupDTO signup) {
        if (accountRepository.existsByEmail(signup.email)) {
            throw new RuntimeException("Email já cadastrado.");
        }

        Account account = new Account();
        account.setUsername(signup.username);
        account.setEmail(signup.email);

        // Senha -> decodificar primeiro
        account.setPassword(passwordEncoder.encode(signup.password));

        // Transformando String em Enum
        account.setClasses(ClassPlayer.valueOf(signup.classPlayer.toUpperCase()));

        return accountRepository.save(account);
    }

    public Optional<Account> login(String email, String password) {
        Optional<Account> accountOptional = accountRepository.findByEmail(email);

        if (accountOptional.isEmpty()) {
            return Optional.empty();
        }

        Account account = accountOptional.get();

        boolean passwordMatcher = passwordEncoder.matches(password, account.getPassword());

        return passwordMatcher ? Optional.of(account) : Optional.empty();
    }
}
