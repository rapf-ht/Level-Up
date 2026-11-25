package com.levelup.api.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

public enum QuestCategory {
    SAUDE,
    ESTUDOS,
    AGENDA,
    PLANEJAMENTO,
    ORGANIZACAO,
    LAZER,
    FINANCAS,
    OUTROS;

    @JsonCreator
    public static QuestCategory fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT);
        try {
            return QuestCategory.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            String validValues = Arrays.stream(values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Categoria inválida: '" + value + "'. Valores aceitos: " + validValues + "."
            );
        }
    }
}
