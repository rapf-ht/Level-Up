package com.levelup.api.dtos;

import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;

public record ItemDTO(
        Long idItem,
        String name,
        String description,
        String icon,
        Integer gcPrice,
        Integer sellPrice,
        ItemType type,
        Long idQuest
) {
    public static ItemDTO fromEntity(Item item) {
        return new ItemDTO(
                item.getIdItem(),
                item.getName(),
                item.getDescription(),
                item.getIcon(),
                item.getGcPrice(),
                item.getSellPrice(),
                item.getItemType(),
                item.getQuest() != null ? item.getQuest().getIdQuest() : null
        );
    }
}
