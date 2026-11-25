package com.levelup.api.dtos;

public record QuestCompletionDTO(
        AccomplishDTO accomplish,
        int xpEarned,
        int gcEarned,
        boolean leveledUp,
        int levelsGained,
        int levelUpGoldBonus,
        AccountDTO account
) {
}
