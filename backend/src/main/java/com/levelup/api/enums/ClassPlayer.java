package com.levelup.api.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum ClassPlayer {
    GUERREIRO,
    MAGO,
    LADINO;

    @JsonCreator
    public static ClassPlayer fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return ClassPlayer.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            String validValues = Arrays.stream(values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Classe inválida: '" + value + "'. Valores aceitos: " + validValues + "."
            );
        }
    }
}
