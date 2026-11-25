package com.levelup.api.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

public enum QuestDifficulty {
    NOVATO("NOVATO", 10, 5, 10),
    VETERANO("VETERANO", 30, 15, 15),
    LENDARIO("LENDÁRIO", 100, 50, 25);

    private final String label;
    private final int xpReward;
    private final int gcReward;
    private final int hpPenalty;

    QuestDifficulty(String label, int xpReward, int gcReward, int hpPenalty) {
        this.label = label;
        this.xpReward = xpReward;
        this.gcReward = gcReward;
        this.hpPenalty = hpPenalty;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public int getXpReward() {
        return xpReward;
    }

    public int getGcReward() {
        return gcReward;
    }

    public int getHpPenalty() {
        return hpPenalty;
    }

    @JsonCreator
    public static QuestDifficulty fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase(Locale.ROOT);
        try {
            return QuestDifficulty.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            String validValues = Arrays.stream(values())
                    .map(QuestDifficulty::getLabel)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Dificuldade inválida: '" + value + "'. Valores aceitos: " + validValues + "."
            );
        }
    }
}
