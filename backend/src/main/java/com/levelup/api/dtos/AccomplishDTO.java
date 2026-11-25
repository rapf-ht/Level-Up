package com.levelup.api.dtos;

import com.levelup.api.entities.Accomplish;
import com.levelup.api.enums.AccomplishStatus;

import java.time.LocalDateTime;

public record AccomplishDTO(
        Long idQuest,
        Long idAccount,
        QuestDTO quest,
        AccomplishStatus status,
        Integer xpEarned,
        Integer gcEarned,
        LocalDateTime createdAt,
        LocalDateTime completedAt,
        LocalDateTime failedAt
) {
    public static AccomplishDTO fromEntity(Accomplish accomplish) {
        Long idQuest = accomplish.getId() != null && accomplish.getId().getIdQuest() != null
                ? accomplish.getId().getIdQuest()
                : accomplish.getQuest().getIdQuest();
        Long idAccount = accomplish.getId() != null && accomplish.getId().getIdAccount() != null
                ? accomplish.getId().getIdAccount()
                : accomplish.getAccount().getIdAccount();

        return new AccomplishDTO(
                idQuest,
                idAccount,
                QuestDTO.fromEntity(accomplish.getQuest()),
                accomplish.getStatus(),
                accomplish.getXpEarned(),
                accomplish.getGcEarned(),
                accomplish.getCreatedAt(),
                accomplish.getCompletedAt(),
                accomplish.getFailedAt()
        );
    }
}
