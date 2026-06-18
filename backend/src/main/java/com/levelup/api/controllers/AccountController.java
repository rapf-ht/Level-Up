package com.levelup.api.controllers;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.LoginDTO;
import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@CrossOrigin("http://localhost:5432") //Rever isso
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupDTO signup) {
        try {
            var account = accountService.register(signup);
            return ResponseEntity.ok(new AccountDTO(account));
        } catch (RuntimeException i) {
            return ResponseEntity.badRequest().body(i.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        var account = accountService.login(login.email, login.password);

        if (account.isPresent()) {
            return ResponseEntity.ok(new AccountDTO(account.get()));
        }

        return ResponseEntity.status(401).body("Credencias inválidas");
    }
}
