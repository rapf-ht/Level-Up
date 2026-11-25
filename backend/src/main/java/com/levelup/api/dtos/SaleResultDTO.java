package com.levelup.api.dtos;

public record SaleResultDTO(
        Long idItem,
        String itemName,
        int gcEarned,
        boolean wasEquipped,
        AccountDTO account
) {
}
