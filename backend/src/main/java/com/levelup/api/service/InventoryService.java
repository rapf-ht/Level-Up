package com.levelup.api.service;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.InventoryItemDTO;
import com.levelup.api.dtos.PurchaseResultDTO;
import com.levelup.api.dtos.SaleResultDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Inventory;
import com.levelup.api.entities.Item;
import com.levelup.api.enums.ItemType;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final AccountRepository accountRepository;
    private final ItemService itemService;
    private final Clock clock;

    @Transactional(readOnly = true)
    public List<InventoryItemDTO> listInventory(Long accountId, ItemType type) {
        List<Inventory> items = type == null
                ? inventoryRepository.findAllByAccountIdWithItem(accountId)
                : inventoryRepository.findByAccountIdAndItemTypeWithItem(accountId, type);

        return items.stream()
                .map(InventoryItemDTO::fromEntity)
                .toList();
    }

    @Transactional
    public PurchaseResultDTO buyItem(Long accountId, Long itemId) {
        Account account = findAccountForUpdate(accountId);
        Item item = itemService.findItemOrThrow(itemId);

        if (inventoryRepository.existsByAccount_IdAccountAndItem_IdItem(accountId, item.getIdItem())) {
            throw new ConflictException("Você já possui este item.");
        }

        int currentGold = account.getGcAmount() != null ? account.getGcAmount() : 0;
        int price = item.getGcPrice() != null ? item.getGcPrice() : 0;
        if (currentGold < price) {
            int missing = price - currentGold;
            throw new BusinessException("Ouro insuficiente. Faltam " + missing + " GC.");
        }

        account.setGcAmount(currentGold - price);

        Inventory inventory = new Inventory();
        inventory.setAccount(account);
        inventory.setItem(item);
        inventory.setEquipped(false);
        inventory.setAcquiredAt(LocalDateTime.now(clock));

        Inventory savedInventory = inventoryRepository.save(inventory);
        Account savedAccount = accountRepository.save(account);

        return new PurchaseResultDTO(
                InventoryItemDTO.fromEntity(savedInventory),
                price,
                AccountDTO.fromEntity(savedAccount)
        );
    }

    @Transactional
    public SaleResultDTO sellItem(Long accountId, Long inventoryId) {
        Account account = findAccountForUpdate(accountId);
        Inventory inventory = findOwnedInventoryOrThrow(accountId, inventoryId);

        Item item = inventory.getItem();
        int sellPrice = item.getSellPrice();
        boolean wasEquipped = Boolean.TRUE.equals(inventory.getEquipped());
        int currentGold = account.getGcAmount() != null ? account.getGcAmount() : 0;

        account.setGcAmount(currentGold + sellPrice);

        inventoryRepository.delete(inventory);
        Account savedAccount = accountRepository.save(account);

        return new SaleResultDTO(
                item.getIdItem(),
                item.getName(),
                sellPrice,
                wasEquipped,
                AccountDTO.fromEntity(savedAccount)
        );
    }

    @Transactional
    public InventoryItemDTO equip(Long accountId, Long inventoryId) {
        findAccountForUpdate(accountId);
        Inventory target = findOwnedInventoryOrThrow(accountId, inventoryId);

        if (Boolean.TRUE.equals(target.getEquipped())) {
            return InventoryItemDTO.fromEntity(target);
        }

        List<Inventory> equippedSameType = inventoryRepository.findEquippedByAccountIdAndItemType(
                accountId,
                target.getItem().getItemType()
        );
        List<Inventory> toUnequip = equippedSameType.stream()
                .filter(inv -> !inv.getIdInventory().equals(target.getIdInventory()))
                .peek(inv -> inv.setEquipped(false))
                .toList();

        if (!toUnequip.isEmpty()) {
            inventoryRepository.saveAll(toUnequip);
        }

        target.setEquipped(true);
        return InventoryItemDTO.fromEntity(inventoryRepository.save(target));
    }

    @Transactional
    public InventoryItemDTO unequip(Long accountId, Long inventoryId) {
        findAccountForUpdate(accountId);
        Inventory target = findOwnedInventoryOrThrow(accountId, inventoryId);

        target.setEquipped(false);
        return InventoryItemDTO.fromEntity(inventoryRepository.save(target));
    }

    private Account findAccountForUpdate(Long accountId) {
        return accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));
    }

    private Inventory findOwnedInventoryOrThrow(Long accountId, Long inventoryId) {
        return inventoryRepository.findByIdAndAccountIdWithItem(inventoryId, accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado no seu inventário."));
    }
}
