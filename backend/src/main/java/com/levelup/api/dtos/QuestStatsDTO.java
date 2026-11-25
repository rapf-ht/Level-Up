package com.levelup.api.dtos;

import java.time.LocalDate;
import java.util.List;

public record QuestStatsDTO(
        int currentStreak,
        int recordStreak,
        List<WeekDayStatusDTO> week,
        List<Integer> weeklyXpDays,
        int weeklyXpTotal,
        int previousWeekXpTotal
) {
    public record WeekDayStatusDTO(
            LocalDate date,
            boolean done,
            boolean today
    ) {
    }
}
