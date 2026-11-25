package com.levelup.api.config;

import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;
import com.levelup.api.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.seed", name = "items", havingValue = "true", matchIfMissing = true)
public class ItemCatalogSeeder implements ApplicationRunner {

    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (itemRepository.count() > 0) {
            return;
        }

        List<Item> initialCatalog = List.of(
                new Item(null, "Armadura Anciã", "Vestes encantadas de um herói esquecido.", null, 200, ItemType.ROUPA, null),
                new Item(null, "Casa Nova", "Um lar aconchegante para descansar após as missões.", "/banners/banner_casa.png", 150, ItemType.CASA, null),
                new Item(null, "Dragão Filhote", "Um companheiro leal que solta faíscas.", null, 500, ItemType.PET, null),
                new Item(null, "Espada Curta", "Uma lâmina leve para iniciantes.", "/ui/espada.png", 350, ItemType.EQUIPAMENTO, null),
                new Item(null, "Escudo de Madeira", "Proteção básica feita de carvalho.", "/ui/escudo.png", 200, ItemType.EQUIPAMENTO, null)
        );

        itemRepository.saveAll(initialCatalog);
        log.info("Catálogo inicial populado com {} itens.", initialCatalog.size());
    }
}
