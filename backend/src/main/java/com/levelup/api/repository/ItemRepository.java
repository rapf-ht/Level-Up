package com.levelup.api.repository;

import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findAllByOrderByGcPriceAscIdItemAsc();

    List<Item> findByItemTypeOrderByGcPriceAscIdItemAsc(ItemType itemType);
}
