package com.levelup.api.dtos;

import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateQuestDTO(
        @NotBlank(message = "Título da missão é obrigatório.")
        @Size(min = 3, max = 100, message = "Título deve ter entre 3 e 100 caracteres.")
        String title,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres.")
        String description,

        @NotNull(message = "Dificuldade da missão é obrigatória.")
        QuestDifficulty difficulty,

        QuestCategory category
) {
}
