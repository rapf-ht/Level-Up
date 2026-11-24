package com.levelup.api.service;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.AuthResponseDTO;
import com.levelup.api.dtos.LoginDTO;
import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.dtos.UpdateAccountDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.InvalidCredentialsException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponseDTO register(SignupDTO signup) {
        String normalizedEmail = signup.email().trim().toLowerCase();
        String normalizedUsername = signup.username().trim();

        if (accountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("Email já cadastrado.");
        }

        if (accountRepository.existsByUsernameIgnoreCase(normalizedUsername)) {
            throw new ConflictException("Username já está em uso.");
        }

        Account account = new Account();
        account.setUsername(normalizedUsername);
        account.setEmail(normalizedEmail);
        account.setPassword(passwordEncoder.encode(signup.password()));
        account.setClassPlayer(signup.classPlayer());

        Account saved = accountRepository.save(account);
        String token = jwtService.generateToken(saved);
        return AuthResponseDTO.bearer(token, jwtService.getExpirationMs(), saved);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginDTO login) {
        String normalizedEmail = login.email().trim().toLowerCase();

        Account account = accountRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Credenciais inválidas."));

        if (!passwordEncoder.matches(login.password(), account.getPassword())) {
            throw new InvalidCredentialsException("Credenciais inválidas.");
        }

        String token = jwtService.generateToken(account);
        return AuthResponseDTO.bearer(token, jwtService.getExpirationMs(), account);
    }

    @Transactional(readOnly = true)
    public AccountDTO getById(Long idAccount) {
        Account account = findAccountOrThrow(idAccount);
        return AccountDTO.fromEntity(account);
    }

    @Transactional
    public AccountDTO update(Long idAccount, UpdateAccountDTO dto) {
        Account account = findAccountOrThrow(idAccount);

        if (dto.username() != null && !dto.username().isBlank()) {
            String normalizedUsername = dto.username().trim();
            if (!normalizedUsername.equalsIgnoreCase(account.getUsername())
                    && accountRepository.existsByUsernameIgnoreCase(normalizedUsername)) {
                throw new ConflictException("Username já está em uso.");
            }
            account.setUsername(normalizedUsername);
        }

        if (dto.classPlayer() != null) {
            account.setClassPlayer(dto.classPlayer());
        }

        return AccountDTO.fromEntity(accountRepository.save(account));
    }

    @Transactional
    public void delete(Long idAccount) {
        Account account = findAccountOrThrow(idAccount);
        accountRepository.delete(account);
    }

    private Account findAccountOrThrow(Long idAccount) {
        return accountRepository.findById(idAccount)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));
    }
}
