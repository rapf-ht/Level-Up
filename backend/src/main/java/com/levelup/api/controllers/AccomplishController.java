package com.levelup.api.controllers;

import com.levelup.api.dtos.AccomplishDTO;
import com.levelup.api.dtos.PunishmentResultDTO;
import com.levelup.api.dtos.QuestCompletionDTO;
import com.levelup.api.dtos.QuestStatsDTO;
import com.levelup.api.enums.AccomplishStatus;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.service.AccomplishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accomplish")
@RequiredArgsConstructor
public class AccomplishController {

    private final AccomplishService accomplishService;

    @GetMapping
    public ResponseEntity<List<AccomplishDTO>> list(
            @AuthenticationPrincipal AccountUserDetails principal,
            @RequestParam(required = false) String status
    ) {
        AccomplishStatus parsedStatus = AccomplishStatus.fromString(status);
        return ResponseEntity.ok(accomplishService.listByAccount(principal.getIdAccount(), parsedStatus));
    }

    @GetMapping("/stats")
    public ResponseEntity<QuestStatsDTO> stats(
            @AuthenticationPrincipal AccountUserDetails principal,
            @RequestParam(required = false) String category
    ) {
        QuestCategory parsedCategory = QuestCategory.fromString(category);
        return ResponseEntity.ok(accomplishService.getStats(principal.getIdAccount(), parsedCategory));
    }

    @PostMapping("/quests/{questId}/start")
    public ResponseEntity<AccomplishDTO> startQuest(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long questId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(accomplishService.startQuest(principal.getIdAccount(), questId));
    }

    @PostMapping("/quests/{questId}/complete")
    public ResponseEntity<QuestCompletionDTO> completeQuest(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long questId
    ) {
        return ResponseEntity.ok(accomplishService.completeQuest(principal.getIdAccount(), questId));
    }

    @PostMapping("/quests/{questId}/fail")
    public ResponseEntity<PunishmentResultDTO> failQuest(
            @AuthenticationPrincipal AccountUserDetails principal,
            @PathVariable Long questId
    ) {
        return ResponseEntity.ok(accomplishService.failQuest(principal.getIdAccount(), questId));
    }

    @PostMapping("/check-failed")
    public ResponseEntity<PunishmentResultDTO> checkFailedDailies(
            @AuthenticationPrincipal AccountUserDetails principal
    ) {
        return ResponseEntity.ok(accomplishService.checkFailedDailies(principal.getIdAccount()));
    }
}
