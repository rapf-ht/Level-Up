package com.levelup.api.dtos;

import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import jakarta.validation.constraints.Size;

public record UpdateQuestDTO(
        @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres.")
        String title,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres.")
        String description,

        QuestDifficulty difficulty,

        QuestCategory category
) {
}
