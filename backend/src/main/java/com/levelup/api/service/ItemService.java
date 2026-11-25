package com.levelup.api.service;

import com.levelup.api.dtos.ItemDTO;
import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;

    @Transactional(readOnly = true)
    public List<ItemDTO> listCatalog(ItemType type) {
        List<Item> items = type == null
                ? itemRepository.findAllByOrderByGcPriceAscIdItemAsc()
                : itemRepository.findByItemTypeOrderByGcPriceAscIdItemAsc(type);

        return items.stream()
                .map(ItemDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItemDTO getById(Long id) {
        return ItemDTO.fromEntity(findItemOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Item findItemOrThrow(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado."));
    }
}
