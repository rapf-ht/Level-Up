package com.levelup.api.dtos;

public record PurchaseResultDTO(
        InventoryItemDTO inventoryItem,
        int gcSpent,
        AccountDTO account
) {
}
