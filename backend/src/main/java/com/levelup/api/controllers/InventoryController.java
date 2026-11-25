package com.levelup.api.controllers;

import com.levelup.api.dtos.InventoryItemDTO;
import com.levelup.api.dtos.PurchaseResultDTO;
import com.levelup.api.dtos.SaleResultDTO;
import com.levelup.api.enums.ItemType;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryItemDTO>> list(
            @AuthenticationPrincipal AccountUserDetails principal,
            @RequestParam(required = false) String type
    ) {
        ItemType parsedType = ItemType.fromString(type);
        return ResponseEntity.ok(inventoryService.listInventory(principal.getIdAccount(), parsedType));
    }

    @PostMapping("/items/{itemId}/buy")
    public ResponseEntity<PurchaseResultDTO> buyItem(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long itemId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventoryService.buyItem(principal.getIdAccount(), itemId));
    }

    @PostMapping("/{inventoryId}/sell")
    public ResponseEntity<SaleResultDTO> sellItem(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long inventoryId
    ) {
        return ResponseEntity.ok(inventoryService.sellItem(principal.getIdAccount(), inventoryId));
    }

    @PatchMapping("/{inventoryId}/equip")
    public ResponseEntity<InventoryItemDTO> equip(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long inventoryId
    ) {
        return ResponseEntity.ok(inventoryService.equip(principal.getIdAccount(), inventoryId));
    }

    @PatchMapping("/{inventoryId}/unequip")
    public ResponseEntity<InventoryItemDTO> unequip(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long inventoryId
    ) {
        return ResponseEntity.ok(inventoryService.unequip(principal.getIdAccount(), inventoryId));
    }
}
