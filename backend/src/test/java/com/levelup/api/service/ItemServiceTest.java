package com.levelup.api.service;

import com.levelup.api.dtos.ItemDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Item;
import com.levelup.api.entities.Quest;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.ItemType;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    private ItemService itemService;

    @BeforeEach
    void setUp() {
        itemService = new ItemService(itemRepository);
    }

    @Test
    void shouldListAllItemsOrderedWhenTypeIsNull() {
        Item casa = new Item(1L, "Casa Nova", "Desc", "/banners/banner_casa.png", 150, ItemType.CASA, null);
        Item espada = new Item(2L, "Espada Curta", "Desc", "/ui/espada.png", 350, ItemType.EQUIPAMENTO, null);
        when(itemRepository.findAllByOrderByGcPriceAscIdItemAsc()).thenReturn(List.of(casa, espada));

        List<ItemDTO> result = itemService.listCatalog(null);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).name()).isEqualTo("Casa Nova");
        assertThat(result.get(1).sellPrice()).isEqualTo(175);
        verify(itemRepository).findAllByOrderByGcPriceAscIdItemAsc();
    }

    @Test
    void shouldListFilteredItemsByType() {
        Item espada = new Item(2L, "Espada Curta", "Desc", "/ui/espada.png", 350, ItemType.EQUIPAMENTO, null);
        when(itemRepository.findByItemTypeOrderByGcPriceAscIdItemAsc(ItemType.EQUIPAMENTO))
                .thenReturn(List.of(espada));

        List<ItemDTO> result = itemService.listCatalog(ItemType.EQUIPAMENTO);

        assertThat(result).hasSize(1);
        assertThat(result.getFirst().type()).isEqualTo(ItemType.EQUIPAMENTO);
        verify(itemRepository).findByItemTypeOrderByGcPriceAscIdItemAsc(ItemType.EQUIPAMENTO);
    }

    @Test
    void shouldMapSellPriceAndQuestIdOnGetById() {
        Account owner = new Account(1L, "Heroi", "h@levelup.com", "hash", ClassPlayer.GUERREIRO, 1, 0, 100, 0);
        Quest quest = new Quest(42L, "Desafio Lendário", null, 100, 50, QuestDifficulty.LENDARIO, QuestCategory.SAUDE, owner, LocalDateTime.now());
        Item sword = new Item(10L, "Espada Curta", "Lâmina", "/ui/espada.png", 350, ItemType.EQUIPAMENTO, quest);

        when(itemRepository.findById(10L)).thenReturn(Optional.of(sword));

        ItemDTO dto = itemService.getById(10L);

        assertThat(dto.idItem()).isEqualTo(10L);
        assertThat(dto.gcPrice()).isEqualTo(350);
        assertThat(dto.sellPrice()).isEqualTo(175);
        assertThat(dto.idQuest()).isEqualTo(42L);
    }

    @Test
    void shouldThrowResourceNotFoundWhenItemDoesNotExist() {
        when(itemRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> itemService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Item não encontrado");
    }
}
