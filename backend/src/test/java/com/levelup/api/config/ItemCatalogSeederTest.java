package com.levelup.api.config;

import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;
import com.levelup.api.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.DefaultApplicationArguments;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ItemCatalogSeederTest {

    @Mock
    private ItemRepository itemRepository;

    private ItemCatalogSeeder seeder;

    @BeforeEach
    void setUp() {
        seeder = new ItemCatalogSeeder(itemRepository);
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldSeedInitialCatalogWhenEmpty() {
        when(itemRepository.count()).thenReturn(0L);

        seeder.run(new DefaultApplicationArguments());

        ArgumentCaptor<List<Item>> captor = ArgumentCaptor.forClass(List.class);
        verify(itemRepository).saveAll(captor.capture());

        List<Item> seeded = captor.getValue();
        assertThat(seeded).hasSize(5);
        assertThat(seeded).extracting(Item::getName).containsExactly(
                "Armadura Anciã",
                "Casa Nova",
                "Dragão Filhote",
                "Espada Curta",
                "Escudo de Madeira"
        );
        assertThat(seeded).extracting(Item::getItemType).containsExactly(
                ItemType.ROUPA,
                ItemType.CASA,
                ItemType.PET,
                ItemType.EQUIPAMENTO,
                ItemType.EQUIPAMENTO
        );
    }

    @Test
    void shouldSkipSeedingWhenCatalogAlreadyHasItems() {
        when(itemRepository.count()).thenReturn(3L);

        seeder.run(new DefaultApplicationArguments());

        verify(itemRepository, never()).saveAll(any());
    }
}
