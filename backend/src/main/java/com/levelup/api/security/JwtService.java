package com.levelup.api.security;

import com.levelup.api.entities.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.secretKey = buildSecretKey(secret);
        this.expirationMs = expirationMs;
    }

    public String generateToken(Account account) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(account.getEmail())
                .claim("accountId", account.getIdAccount())
                .claim("username", account.getUsername())
                .claim("classPlayer", account.getClassPlayer().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractAccountId(String token) {
        Object claim = extractAllClaims(token).get("accountId");
        return claim instanceof Number number ? number.longValue() : null;
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email != null
                && email.equalsIgnoreCase(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey buildSecretKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            try {
                keyBytes = MessageDigest.getInstance("SHA-256").digest(keyBytes);
            } catch (NoSuchAlgorithmException ex) {
                throw new IllegalStateException("Algoritmo SHA-256 indisponível.", ex);
            }
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
