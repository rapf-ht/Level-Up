package com.levelup.api.controllers;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.AuthResponseDTO;
import com.levelup.api.dtos.LoginDTO;
import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.dtos.UpdateAccountDTO;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody SignupDTO signup) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.register(signup));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO login) {
        return ResponseEntity.ok(accountService.login(login));
    }

    @GetMapping("/me")
    public ResponseEntity<AccountDTO> me(@AuthenticationPrincipal AccountUserDetails principal) {
        return ResponseEntity.ok(accountService.getById(principal.getIdAccount()));
    }

    @PatchMapping("/me")
    public ResponseEntity<AccountDTO> updateMe(
            @AuthenticationPrincipal AccountUserDetails principal,
            @Valid @RequestBody UpdateAccountDTO dto
    ) {
        return ResponseEntity.ok(accountService.update(principal.getIdAccount(), dto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal AccountUserDetails principal) {
        accountService.delete(principal.getIdAccount());
        return ResponseEntity.noContent().build();
    }
}
