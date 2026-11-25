package com.levelup.api.service;

import com.levelup.api.dtos.AccomplishDTO;
import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.PunishmentResultDTO;
import com.levelup.api.dtos.QuestCompletionDTO;
import com.levelup.api.dtos.QuestStatsDTO;
import com.levelup.api.entities.Accomplish;
import com.levelup.api.entities.AccomplishId;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Quest;
import com.levelup.api.enums.AccomplishStatus;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccomplishRepository;
import com.levelup.api.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AccomplishService {

    public static final int MAX_HP = 100;
    public static final int LEVEL_UP_XP_MULTIPLIER = 100;
    public static final int LEVEL_UP_GOLD_BONUS = 50;
    public static final double DEATH_GOLD_RETENTION = 0.75;
    public static final double CLASS_REWARD_BONUS_MULTIPLIER = 1.2;
    public static final double WARRIOR_DAMAGE_MULTIPLIER = 0.8;

    private final AccomplishRepository accomplishRepository;
    private final AccountRepository accountRepository;
    private final QuestService questService;
    private final Clock clock;

    @Transactional
    public AccomplishDTO startQuest(Long accountId, Long questId) {
        Account account = findAccountOrThrow(accountId);
        Quest quest = questService.findAccessibleQuestOrThrow(accountId, questId);

        AccomplishId id = new AccomplishId(quest.getIdQuest(), account.getIdAccount());
        if (accomplishRepository.existsById(id)) {
            throw new ConflictException("Esta missão já está registrada na sua jornada.");
        }

        Accomplish accomplish = new Accomplish();
        accomplish.setId(id);
        accomplish.setQuest(quest);
        accomplish.setAccount(account);
        accomplish.setStatus(AccomplishStatus.PENDING);
        accomplish.setXpEarned(0);
        accomplish.setGcEarned(0);
        accomplish.setCreatedAt(LocalDateTime.now(clock));

        return AccomplishDTO.fromEntity(accomplishRepository.save(accomplish));
    }

    @Transactional
    public QuestCompletionDTO completeQuest(Long accountId, Long questId) {
        Account account = findAccountOrThrow(accountId);
        Quest quest = questService.findAccessibleQuestOrThrow(accountId, questId);

        AccomplishId id = new AccomplishId(quest.getIdQuest(), account.getIdAccount());
        LocalDateTime now = LocalDateTime.now(clock);

        Accomplish accomplish = accomplishRepository.findById(id).orElseGet(() -> {
            Accomplish created = new Accomplish();
            created.setId(id);
            created.setQuest(quest);
            created.setAccount(account);
            created.setStatus(AccomplishStatus.PENDING);
            created.setCreatedAt(now);
            return created;
        });

        if (accomplish.getStatus() == AccomplishStatus.COMPLETED) {
            throw new ConflictException("Esta missão já foi concluída.");
        }
        if (accomplish.getStatus() == AccomplishStatus.FAILED) {
            throw new BusinessException("Não é possível concluir uma missão que já falhou.");
        }

        int xpEarned = calculateXpReward(account, quest);
        int gcEarned = calculateGoldReward(account, quest);

        accomplish.setStatus(AccomplishStatus.COMPLETED);
        accomplish.setXpEarned(xpEarned);
        accomplish.setGcEarned(gcEarned);
        accomplish.setCompletedAt(now);

        account.setXpAmount(safeInt(account.getXpAmount(), 0) + xpEarned);
        account.setGcAmount(safeInt(account.getGcAmount(), 0) + gcEarned);

        int level = Math.max(1, safeInt(account.getLevel(), 1));
        account.setLevel(level);

        int levelsGained = 0;
        int levelUpGoldBonus = 0;

        while (account.getXpAmount() >= account.getLevel() * LEVEL_UP_XP_MULTIPLIER) {
            int xpNeeded = account.getLevel() * LEVEL_UP_XP_MULTIPLIER;
            account.setXpAmount(account.getXpAmount() - xpNeeded);
            account.setLevel(account.getLevel() + 1);
            account.setHpAmount(MAX_HP);
            account.setGcAmount(account.getGcAmount() + LEVEL_UP_GOLD_BONUS);
            levelsGained++;
            levelUpGoldBonus += LEVEL_UP_GOLD_BONUS;
        }

        Accomplish savedAccomplish = accomplishRepository.save(accomplish);
        Account savedAccount = accountRepository.save(account);

        return new QuestCompletionDTO(
                AccomplishDTO.fromEntity(savedAccomplish),
                xpEarned,
                gcEarned,
                levelsGained > 0,
                levelsGained,
                levelUpGoldBonus,
                AccountDTO.fromEntity(savedAccount)
        );
    }

    @Transactional
    public PunishmentResultDTO failQuest(Long accountId, Long questId) {
        Account account = findAccountOrThrow(accountId);
        Quest quest = questService.findAccessibleQuestOrThrow(accountId, questId);

        AccomplishId id = new AccomplishId(quest.getIdQuest(), account.getIdAccount());
        LocalDateTime now = LocalDateTime.now(clock);

        Accomplish accomplish = accomplishRepository.findById(id).orElseGet(() -> {
            Accomplish created = new Accomplish();
            created.setId(id);
            created.setQuest(quest);
            created.setAccount(account);
            created.setStatus(AccomplishStatus.PENDING);
            created.setXpEarned(0);
            created.setGcEarned(0);
            created.setCreatedAt(now);
            return created;
        });

        if (accomplish.getStatus() == AccomplishStatus.COMPLETED) {
            throw new BusinessException("Não é possível marcar como falha uma missão já concluída.");
        }
        if (accomplish.getStatus() == AccomplishStatus.FAILED) {
            throw new ConflictException("Esta missão já foi marcada como falha.");
        }

        accomplish.setStatus(AccomplishStatus.FAILED);
        accomplish.setFailedAt(now);

        int damage = calculateDamage(account, quest.getDifficulty().getHpPenalty());
        DamageOutcome outcome = applyPunishment(account, damage);

        accomplishRepository.save(accomplish);
        Account savedAccount = accountRepository.save(account);

        return new PunishmentResultDTO(
                1,
                List.of(quest.getIdQuest()),
                damage,
                outcome.died(),
                outcome.xpLost(),
                outcome.gcLost(),
                AccountDTO.fromEntity(savedAccount)
        );
    }

    @Transactional
    public PunishmentResultDTO checkFailedDailies(Long accountId) {
        Account account = findAccountOrThrow(accountId);
        LocalDateTime now = LocalDateTime.now(clock);
        LocalDateTime startOfToday = LocalDate.now(clock).atStartOfDay();

        List<Accomplish> expiredDailies = accomplishRepository.findExpiredPendingDailies(accountId, startOfToday);
        if (expiredDailies.isEmpty()) {
            return new PunishmentResultDTO(
                    0,
                    List.of(),
                    0,
                    false,
                    0,
                    0,
                    AccountDTO.fromEntity(account)
            );
        }

        int totalDamage = 0;
        List<Long> failedQuestIds = new ArrayList<>();

        for (Accomplish accomplish : expiredDailies) {
            accomplish.setStatus(AccomplishStatus.FAILED);
            accomplish.setFailedAt(now);
            totalDamage += calculateDamage(account, accomplish.getQuest().getDifficulty().getHpPenalty());
            failedQuestIds.add(accomplish.getQuest().getIdQuest());
        }

        DamageOutcome outcome = applyPunishment(account, totalDamage);

        accomplishRepository.saveAll(expiredDailies);
        Account savedAccount = accountRepository.save(account);

        return new PunishmentResultDTO(
                expiredDailies.size(),
                failedQuestIds,
                totalDamage,
                outcome.died(),
                outcome.xpLost(),
                outcome.gcLost(),
                AccountDTO.fromEntity(savedAccount)
        );
    }

    @Transactional(readOnly = true)
    public List<AccomplishDTO> listByAccount(Long accountId, AccomplishStatus status) {
        List<Accomplish> records = status == null
                ? accomplishRepository.findAllByAccountIdWithQuest(accountId)
                : accomplishRepository.findByAccountIdAndStatusWithQuest(accountId, status);

        return records.stream()
                .map(AccomplishDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuestStatsDTO getStats(Long accountId, QuestCategory category) {
        List<Accomplish> completed = accomplishRepository.findCompletedByAccountIdWithQuest(accountId);
        LocalDate today = LocalDate.now(clock);
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() % 7);
        LocalDate previousWeekStart = startOfWeek.minusDays(7);

        Set<LocalDate> completedDays = new HashSet<>();
        int[] weeklyXp = new int[7];
        int previousWeekXp = 0;

        for (Accomplish accomplish : completed) {
            LocalDate completedDate = accomplish.getCompletedAt().toLocalDate();
            completedDays.add(completedDate);

            if (category == null || accomplish.getQuest().getCategory() == category) {
                int xp = safeInt(accomplish.getXpEarned(), 0) > 0
                        ? accomplish.getXpEarned()
                        : safeInt(accomplish.getQuest().getXpReward(), 0);

                if (!completedDate.isBefore(startOfWeek)) {
                    long dayIndex = ChronoUnit.DAYS.between(startOfWeek, completedDate);
                    if (dayIndex >= 0 && dayIndex < 7) {
                        weeklyXp[(int) dayIndex] += xp;
                    }
                } else if (!completedDate.isBefore(previousWeekStart)) {
                    previousWeekXp += xp;
                }
            }
        }

        int currentStreak = calculateCurrentStreak(completedDays, today);
        int recordStreak = calculateRecordStreak(completedDays);

        List<QuestStatsDTO.WeekDayStatusDTO> week = new ArrayList<>(7);
        List<Integer> weeklyXpDays = new ArrayList<>(7);
        int weeklyXpTotal = 0;

        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            week.add(new QuestStatsDTO.WeekDayStatusDTO(day, completedDays.contains(day), day.equals(today)));
            weeklyXpDays.add(weeklyXp[i]);
            weeklyXpTotal += weeklyXp[i];
        }

        return new QuestStatsDTO(
                currentStreak,
                recordStreak,
                week,
                weeklyXpDays,
                weeklyXpTotal,
                previousWeekXp
        );
    }

    private int calculateXpReward(Account account, Quest quest) {
        int baseXp = safeInt(quest.getXpReward(), quest.getDifficulty().getXpReward());
        if (account.getClassPlayer() == ClassPlayer.MAGO && quest.getCategory() == QuestCategory.ESTUDOS) {
            return (int) Math.round(baseXp * CLASS_REWARD_BONUS_MULTIPLIER);
        }
        return baseXp;
    }

    private int calculateGoldReward(Account account, Quest quest) {
        int baseGold = safeInt(quest.getGcAmount(), quest.getDifficulty().getGcReward());
        if (account.getClassPlayer() == ClassPlayer.LADINO) {
            return (int) Math.round(baseGold * CLASS_REWARD_BONUS_MULTIPLIER);
        }
        return baseGold;
    }

    private int calculateDamage(Account account, int baseDamage) {
        if (account.getClassPlayer() == ClassPlayer.GUERREIRO) {
            return (int) Math.round(baseDamage * WARRIOR_DAMAGE_MULTIPLIER);
        }
        return baseDamage;
    }

    private DamageOutcome applyPunishment(Account account, int damageTaken) {
        int currentHp = safeInt(account.getHpAmount(), MAX_HP);
        int remainingHp = currentHp - damageTaken;

        if (remainingHp <= 0) {
            int xpLost = safeInt(account.getXpAmount(), 0);
            int currentGold = safeInt(account.getGcAmount(), 0);
            int retainedGold = (int) Math.floor(currentGold * DEATH_GOLD_RETENTION);
            int gcLost = currentGold - retainedGold;

            account.setHpAmount(MAX_HP);
            account.setXpAmount(0);
            account.setGcAmount(retainedGold);
            return new DamageOutcome(true, xpLost, gcLost);
        }

        account.setHpAmount(remainingHp);
        return new DamageOutcome(false, 0, 0);
    }

    private int calculateCurrentStreak(Set<LocalDate> completedDays, LocalDate today) {
        LocalDate cursor = completedDays.contains(today) ? today : today.minusDays(1);
        int streak = 0;
        while (completedDays.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }

    private int calculateRecordStreak(Set<LocalDate> completedDays) {
        int record = 0;
        for (LocalDate day : completedDays) {
            if (completedDays.contains(day.minusDays(1))) {
                continue;
            }
            int run = 0;
            LocalDate cursor = day;
            while (completedDays.contains(cursor)) {
                run++;
                cursor = cursor.plusDays(1);
            }
            record = Math.max(record, run);
        }
        return record;
    }

    private Account findAccountOrThrow(Long accountId) {
        return accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));
    }

    private int safeInt(Integer value, int defaultValue) {
        return value != null ? value : defaultValue;
    }

    private record DamageOutcome(boolean died, int xpLost, int gcLost) {
    }
}
