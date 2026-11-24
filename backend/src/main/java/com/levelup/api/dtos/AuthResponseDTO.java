package com.levelup.api.dtos;

import com.levelup.api.entities.Account;

public record AuthResponseDTO(
        String token,
        String tokenType,
        long expiresIn,
        AccountDTO account
) {
    public static AuthResponseDTO bearer(String token, long expiresIn, Account account) {
        return new AuthResponseDTO(token, "Bearer", expiresIn, AccountDTO.fromEntity(account));
    }
}
