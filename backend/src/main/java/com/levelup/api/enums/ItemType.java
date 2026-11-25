package com.levelup.api.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

public enum ItemType {
    PET,
    CASA,
    ROUPA,
    EQUIPAMENTO;

    @JsonCreator
    public static ItemType fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT);
        try {
            return ItemType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            String validValues = Arrays.stream(values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Tipo de item inválido: '" + value + "'. Valores aceitos: " + validValues + "."
            );
        }
    }
}
