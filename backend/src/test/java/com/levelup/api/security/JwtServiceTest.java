package com.levelup.api.security;

import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "test-secret-key-with-at-least-32-characters-for-hs256";

    private Account sampleAccount(Long id, String email) {
        Account account = new Account();
        account.setIdAccount(id);
        account.setUsername("Heroi" + id);
        account.setEmail(email);
        account.setPassword("encoded-password");
        account.setClassPlayer(ClassPlayer.GUERREIRO);
        return account;
    }

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService(SECRET, 60_000L);
        Account account = sampleAccount(1L, "hero@levelup.com");

        String token = jwtService.generateToken(account);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractEmail(token)).isEqualTo("hero@levelup.com");
        assertThat(jwtService.extractAccountId(token)).isEqualTo(1L);
        assertThat(jwtService.isTokenValid(token, new AccountUserDetails(account))).isTrue();
    }

    @Test
    void shouldRejectTokenForDifferentUser() {
        JwtService jwtService = new JwtService(SECRET, 60_000L);
        Account owner = sampleAccount(1L, "owner@levelup.com");
        Account other = sampleAccount(2L, "other@levelup.com");

        String token = jwtService.generateToken(owner);

        assertThat(jwtService.isTokenValid(token, new AccountUserDetails(other))).isFalse();
    }

    @Test
    void shouldRejectExpiredToken() {
        JwtService jwtService = new JwtService(SECRET, -1_000L);
        Account account = sampleAccount(1L, "expired@levelup.com");

        String token = jwtService.generateToken(account);

        assertThatThrownBy(() -> jwtService.extractEmail(token))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void shouldSupportShortSecretUsingSha256Derivation() {
        JwtService jwtService = new JwtService("short-secret", 60_000L);
        Account account = sampleAccount(7L, "short@levelup.com");

        String token = jwtService.generateToken(account);

        assertThat(jwtService.extractEmail(token)).isEqualTo("short@levelup.com");
        assertThat(jwtService.extractAccountId(token)).isEqualTo(7L);
    }
}
