package com.levelup.api.service;

import com.levelup.api.dtos.InventoryItemDTO;
import com.levelup.api.dtos.PurchaseResultDTO;
import com.levelup.api.dtos.SaleResultDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Inventory;
import com.levelup.api.entities.Item;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.ItemType;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    private static final ZoneId SAO_PAULO = ZoneId.of("America/Sao_Paulo");
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-11-25T13:00:00Z"),
            SAO_PAULO
    );

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private ItemService itemService;

    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryService(inventoryRepository, accountRepository, itemService, FIXED_CLOCK);
    }

    private Account account(Long id, int gc) {
        return new Account(id, "Heroi" + id, "h" + id + "@levelup.com", "hash", ClassPlayer.GUERREIRO, 1, 0, 100, gc);
    }

    private Item item(Long id, String name, int price, ItemType type) {
        return new Item(id, name, "Descrição " + name, null, price, type, null);
    }

    @Test
    void shouldBuyItemAndDeductGoldUsingPessimisticLockAndFixedClock() {
        Account acc = account(1L, 500);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(itemService.findItemOrThrow(4L)).thenReturn(sword);
        when(inventoryRepository.existsByAccount_IdAccountAndItem_IdItem(1L, 4L)).thenReturn(false);
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(inv -> {
            Inventory saved = inv.getArgument(0);
            saved.setIdInventory(100L);
            return saved;
        });
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        PurchaseResultDTO result = inventoryService.buyItem(1L, 4L);

        verify(accountRepository).findByIdForUpdate(1L);
        assertThat(result.gcSpent()).isEqualTo(350);
        assertThat(result.account().gcAmount()).isEqualTo(150);
        assertThat(result.inventoryItem().idInventory()).isEqualTo(100L);
        assertThat(result.inventoryItem().equipped()).isFalse();
        assertThat(result.inventoryItem().acquiredAt()).isEqualTo(LocalDateTime.now(FIXED_CLOCK));
    }

    @Test
    void shouldRejectPurchaseWhenGoldIsInsufficientWithoutModifyingAccountOrInventory() {
        Account acc = account(1L, 100);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(itemService.findItemOrThrow(4L)).thenReturn(sword);
        when(inventoryRepository.existsByAccount_IdAccountAndItem_IdItem(1L, 4L)).thenReturn(false);

        assertThatThrownBy(() -> inventoryService.buyItem(1L, 4L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Faltam 250 GC");

        assertThat(acc.getGcAmount()).isEqualTo(100);
        verify(inventoryRepository, never()).save(any());
        verify(accountRepository, never()).save(any());
    }

    @Test
    void shouldRejectPurchaseWhenAccountAlreadyOwnsItem() {
        Account acc = account(1L, 500);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(itemService.findItemOrThrow(4L)).thenReturn(sword);
        when(inventoryRepository.existsByAccount_IdAccountAndItem_IdItem(1L, 4L)).thenReturn(true);

        assertThatThrownBy(() -> inventoryService.buyItem(1L, 4L))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("já possui");

        verify(inventoryRepository, never()).save(any());
    }

    @Test
    void shouldSellEquippedItemForHalfPriceAndDeleteFromInventory() {
        Account acc = account(1L, 100);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);
        Inventory inv = new Inventory(10L, sword, acc, true, LocalDateTime.now(FIXED_CLOCK));

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(inventoryRepository.findByIdAndAccountIdWithItem(10L, 1L)).thenReturn(Optional.of(inv));
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));

        SaleResultDTO result = inventoryService.sellItem(1L, 10L);

        verify(accountRepository).findByIdForUpdate(1L);
        verify(inventoryRepository).delete(inv);
        assertThat(result.idItem()).isEqualTo(4L);
        assertThat(result.itemName()).isEqualTo("Espada Curta");
        assertThat(result.gcEarned()).isEqualTo(175);
        assertThat(result.wasEquipped()).isTrue();
        assertThat(result.account().gcAmount()).isEqualTo(275);
    }

    @Test
    void shouldThrowNotFoundWhenSellingMissingOrAnotherUsersInventoryItem() {
        Account acc = account(1L, 100);
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(inventoryRepository.findByIdAndAccountIdWithItem(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> inventoryService.sellItem(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("inventário");
    }

    @Test
    void shouldUnequipOtherItemOfSameTypeWhenEquippingNewOne() {
        Account acc = account(1L, 100);
        Item shield = item(5L, "Escudo de Madeira", 200, ItemType.EQUIPAMENTO);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);

        Inventory equippedShield = new Inventory(11L, shield, acc, true, LocalDateTime.now(FIXED_CLOCK).minusDays(1));
        Inventory targetSword = new Inventory(12L, sword, acc, false, LocalDateTime.now(FIXED_CLOCK));

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(inventoryRepository.findByIdAndAccountIdWithItem(12L, 1L)).thenReturn(Optional.of(targetSword));
        when(inventoryRepository.findEquippedByAccountIdAndItemType(1L, ItemType.EQUIPAMENTO))
                .thenReturn(List.of(equippedShield));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(i -> i.getArgument(0));

        InventoryItemDTO result = inventoryService.equip(1L, 12L);

        assertThat(equippedShield.getEquipped()).isFalse();
        assertThat(result.equipped()).isTrue();
        verify(inventoryRepository).saveAll(List.of(equippedShield));
        verify(inventoryRepository).save(targetSword);
    }

    @Test
    void shouldBeIdempotentWhenEquippingAlreadyEquippedItem() {
        Account acc = account(1L, 100);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);
        Inventory targetSword = new Inventory(12L, sword, acc, true, LocalDateTime.now(FIXED_CLOCK));

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(inventoryRepository.findByIdAndAccountIdWithItem(12L, 1L)).thenReturn(Optional.of(targetSword));

        InventoryItemDTO result = inventoryService.equip(1L, 12L);

        assertThat(result.equipped()).isTrue();
        verify(inventoryRepository, never()).findEquippedByAccountIdAndItemType(any(), any());
        verify(inventoryRepository, never()).save(any());
    }

    @Test
    void shouldUnequipItem() {
        Account acc = account(1L, 100);
        Item sword = item(4L, "Espada Curta", 350, ItemType.EQUIPAMENTO);
        Inventory targetSword = new Inventory(12L, sword, acc, true, LocalDateTime.now(FIXED_CLOCK));

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(inventoryRepository.findByIdAndAccountIdWithItem(12L, 1L)).thenReturn(Optional.of(targetSword));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(i -> i.getArgument(0));

        InventoryItemDTO result = inventoryService.unequip(1L, 12L);

        assertThat(result.equipped()).isFalse();
        verify(inventoryRepository).save(targetSword);
    }
}
