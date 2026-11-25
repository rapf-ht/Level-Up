package com.levelup.api.repository;

import com.levelup.api.entities.Inventory;
import com.levelup.api.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("""
            SELECT inv FROM Inventory inv
            JOIN FETCH inv.item i
            LEFT JOIN FETCH i.quest
            WHERE inv.account.idAccount = :accountId
            ORDER BY inv.acquiredAt DESC, inv.idInventory DESC
            """)
    List<Inventory> findAllByAccountIdWithItem(@Param("accountId") Long accountId);

    @Query("""
            SELECT inv FROM Inventory inv
            JOIN FETCH inv.item i
            LEFT JOIN FETCH i.quest
            WHERE inv.account.idAccount = :accountId
              AND i.itemType = :itemType
            ORDER BY inv.acquiredAt DESC, inv.idInventory DESC
            """)
    List<Inventory> findByAccountIdAndItemTypeWithItem(
            @Param("accountId") Long accountId,
            @Param("itemType") ItemType itemType
    );

    @Query("""
            SELECT inv FROM Inventory inv
            JOIN FETCH inv.item i
            LEFT JOIN FETCH i.quest
            WHERE inv.idInventory = :inventoryId
              AND inv.account.idAccount = :accountId
            """)
    Optional<Inventory> findByIdAndAccountIdWithItem(
            @Param("inventoryId") Long inventoryId,
            @Param("accountId") Long accountId
    );

    @Query("""
            SELECT inv FROM Inventory inv
            JOIN FETCH inv.item i
            WHERE inv.account.idAccount = :accountId
              AND i.itemType = :itemType
              AND inv.equipped = true
            """)
    List<Inventory> findEquippedByAccountIdAndItemType(
            @Param("accountId") Long accountId,
            @Param("itemType") ItemType itemType
    );

    boolean existsByAccount_IdAccountAndItem_IdItem(Long accountId, Long itemId);
}
