package com.levelup.api.controllers;

import com.levelup.api.dtos.ItemDTO;
import com.levelup.api.enums.ItemType;
import com.levelup.api.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemDTO>> list(@RequestParam(required = false) String type) {
        ItemType parsedType = ItemType.fromString(type);
        return ResponseEntity.ok(itemService.listCatalog(parsedType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getById(id));
    }
}
