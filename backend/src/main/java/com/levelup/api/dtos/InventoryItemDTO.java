package com.levelup.api.dtos;

import com.levelup.api.entities.Inventory;

import java.time.LocalDateTime;

public record InventoryItemDTO(
        Long idInventory,
        ItemDTO item,
        Boolean equipped,
        LocalDateTime acquiredAt
) {
    public static InventoryItemDTO fromEntity(Inventory inventory) {
        return new InventoryItemDTO(
                inventory.getIdInventory(),
                ItemDTO.fromEntity(inventory.getItem()),
                inventory.getEquipped(),
                inventory.getAcquiredAt()
        );
    }
}
