package com.levelup.api.controllers;

import com.levelup.api.dtos.CreateQuestDTO;
import com.levelup.api.dtos.QuestDTO;
import com.levelup.api.dtos.UpdateQuestDTO;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.service.QuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    @PostMapping
    public ResponseEntity<QuestDTO> create(
            @AuthenticationPrincipal AccountUserDetails principal,
            @Valid @RequestBody CreateQuestDTO dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(questService.create(principal.getIdAccount(), dto));
    }

    @GetMapping
    public ResponseEntity<List<QuestDTO>> list(
            @AuthenticationPrincipal AccountUserDetails principal,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category
    ) {
        QuestDifficulty parsedDifficulty = QuestDifficulty.fromString(difficulty);
        QuestCategory parsedCategory = QuestCategory.fromString(category);
        return ResponseEntity.ok(
                questService.listAccessible(principal.getIdAccount(), parsedDifficulty, parsedCategory)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestDTO> getById(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(questService.getById(principal.getIdAccount(), id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<QuestDTO> update(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestDTO dto
    ) {
        return ResponseEntity.ok(questService.update(principal.getIdAccount(), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long id
    ) {
        questService.delete(principal.getIdAccount(), id);
        return ResponseEntity.noContent().build();
    }
}
