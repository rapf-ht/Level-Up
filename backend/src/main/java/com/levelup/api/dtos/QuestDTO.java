package com.levelup.api.dtos;

import com.levelup.api.entities.Quest;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;

import java.time.LocalDateTime;

public record QuestDTO(
        Long idQuest,
        String title,
        String description,
        Integer xpReward,
        Integer gcAmount,
        QuestDifficulty difficulty,
        QuestCategory category,
        Long idAccount,
        LocalDateTime createdAt
) {
    public static QuestDTO fromEntity(Quest quest) {
        return new QuestDTO(
                quest.getIdQuest(),
                quest.getTitle(),
                quest.getDescription(),
                quest.getXpReward(),
                quest.getGcAmount(),
                quest.getDifficulty(),
                quest.getCategory(),
                quest.getAccount() != null ? quest.getAccount().getIdAccount() : null,
                quest.getCreatedAt()
        );
    }
}
