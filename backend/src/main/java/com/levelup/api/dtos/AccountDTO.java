package com.levelup.api.dtos;

import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;

public record AccountDTO(
        Long idAccount,
        String username,
        String email,
        ClassPlayer classPlayer,
        Integer level,
        Integer xpAmount,
        Integer hpAmount,
        Integer gcAmount
) {
    public static AccountDTO fromEntity(Account account) {
        return new AccountDTO(
                account.getIdAccount(),
                account.getUsername(),
                account.getEmail(),
                account.getClassPlayer(),
                account.getLevel(),
                account.getXpAmount(),
                account.getHpAmount(),
                account.getGcAmount()
        );
    }
}
