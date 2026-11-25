package com.levelup.api.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

public enum AccomplishStatus {
    PENDING,
    COMPLETED,
    FAILED;

    @JsonCreator
    public static AccomplishStatus fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return AccomplishStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            String validValues = Arrays.stream(values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Status inválido: '" + value + "'. Valores aceitos: " + validValues + "."
            );
        }
    }
}
