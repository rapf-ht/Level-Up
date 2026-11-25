package com.levelup.api.dtos;

import java.util.List;

public record PunishmentResultDTO(
        int failedQuestsCount,
        List<Long> failedQuestIds,
        int damageTaken,
        boolean died,
        int xpLost,
        int gcLost,
        AccountDTO account
) {
}
