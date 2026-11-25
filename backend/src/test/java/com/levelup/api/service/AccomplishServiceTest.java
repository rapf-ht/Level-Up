package com.levelup.api.service;

import com.levelup.api.dtos.AccomplishDTO;
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
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.repository.AccomplishRepository;
import com.levelup.api.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccomplishServiceTest {

    private static final ZoneId SAO_PAULO = ZoneId.of("America/Sao_Paulo");
    // Quarta-feira, 2026-11-25 10:00:00 America/Sao_Paulo
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-11-25T13:00:00Z"),
            SAO_PAULO
    );

    @Mock
    private AccomplishRepository accomplishRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private QuestService questService;

    private AccomplishService accomplishService;

    @BeforeEach
    void setUp() {
        accomplishService = new AccomplishService(accomplishRepository, accountRepository, questService, FIXED_CLOCK);
    }

    private Account account(Long id, ClassPlayer cls, int level, int xp, int hp, int gc) {
        return new Account(id, "Heroi" + id, "h" + id + "@levelup.com", "hash", cls, level, xp, hp, gc);
    }

    private Quest quest(Long id, QuestDifficulty diff, QuestCategory cat, Account owner) {
        return new Quest(
                id,
                "Missão " + id,
                "Descrição",
                diff.getXpReward(),
                diff.getGcReward(),
                diff,
                cat,
                owner,
                LocalDateTime.now(FIXED_CLOCK)
        );
    }

    @Test
    void shouldStartQuestAsPending() {
        Account acc = account(1L, ClassPlayer.GUERREIRO, 1, 0, 100, 0);
        Quest q = quest(10L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, acc);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(questService.findAccessibleQuestOrThrow(1L, 10L)).thenReturn(q);
        when(accomplishRepository.existsById(new AccomplishId(10L, 1L))).thenReturn(false);
        when(accomplishRepository.save(any(Accomplish.class))).thenAnswer(inv -> inv.getArgument(0));

        AccomplishDTO result = accomplishService.startQuest(1L, 10L);

        assertThat(result.status()).isEqualTo(AccomplishStatus.PENDING);
        assertThat(result.idQuest()).isEqualTo(10L);
        assertThat(result.idAccount()).isEqualTo(1L);
        assertThat(result.xpEarned()).isZero();
    }

    @Test
    void shouldRejectStartingAlreadyTrackedQuest() {
        Account acc = account(1L, ClassPlayer.GUERREIRO, 1, 0, 100, 0);
        Quest q = quest(10L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, acc);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(questService.findAccessibleQuestOrThrow(1L, 10L)).thenReturn(q);
        when(accomplishRepository.existsById(new AccomplishId(10L, 1L))).thenReturn(true);

        assertThatThrownBy(() -> accomplishService.startQuest(1L, 10L))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void shouldApplyMageStudyBonusAndTriggerLevelUpWithFullHealAndGoldBonus() {
        Account mage = account(1L, ClassPlayer.MAGO, 1, 10, 60, 20);
        Quest studyQuest = quest(20L, QuestDifficulty.LENDARIO, QuestCategory.ESTUDOS, mage);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(mage));
        when(questService.findAccessibleQuestOrThrow(1L, 20L)).thenReturn(studyQuest);
        when(accomplishRepository.findById(new AccomplishId(20L, 1L))).thenReturn(Optional.empty());
        when(accomplishRepository.save(any(Accomplish.class))).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        QuestCompletionDTO result = accomplishService.completeQuest(1L, 20L);

        // 100 XP * 1.2 (Mago em Estudos) = 120 XP -> 10 + 120 = 130 XP -> Lv 2 com 30 XP restante
        assertThat(result.xpEarned()).isEqualTo(120);
        assertThat(result.gcEarned()).isEqualTo(50);
        assertThat(result.leveledUp()).isTrue();
        assertThat(result.levelsGained()).isEqualTo(1);
        assertThat(result.levelUpGoldBonus()).isEqualTo(50);
        assertThat(result.account().level()).isEqualTo(2);
        assertThat(result.account().xpAmount()).isEqualTo(30);
        assertThat(result.account().hpAmount()).isEqualTo(100);
        // 20 inicial + 50 missão + 50 bônus level-up = 120
        assertThat(result.account().gcAmount()).isEqualTo(120);
    }

    @Test
    void shouldApplyRogueGoldBonusAndHandleMultiLevelUp() {
        // Lv 1 com 250 XP acumulados + 100 XP = 350 XP -> sobe Lv 1->2 (-100) e Lv 2->3 (-200), sobra 50 XP
        Account rogue = account(2L, ClassPlayer.LADINO, 1, 250, 40, 10);
        Quest legendary = quest(30L, QuestDifficulty.LENDARIO, QuestCategory.FINANCAS, rogue);

        when(accountRepository.findByIdForUpdate(2L)).thenReturn(Optional.of(rogue));
        when(questService.findAccessibleQuestOrThrow(2L, 30L)).thenReturn(legendary);
        when(accomplishRepository.findById(new AccomplishId(30L, 2L))).thenReturn(Optional.empty());
        when(accomplishRepository.save(any(Accomplish.class))).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        QuestCompletionDTO result = accomplishService.completeQuest(2L, 30L);

        assertThat(result.xpEarned()).isEqualTo(100);
        assertThat(result.gcEarned()).isEqualTo(60); // 50 * 1.2 (Ladino)
        assertThat(result.leveledUp()).isTrue();
        assertThat(result.levelsGained()).isEqualTo(2);
        assertThat(result.levelUpGoldBonus()).isEqualTo(100);
        assertThat(result.account().level()).isEqualTo(3);
        assertThat(result.account().xpAmount()).isEqualTo(50);
        assertThat(result.account().hpAmount()).isEqualTo(100);
        // 10 + 60 + 100 = 170
        assertThat(result.account().gcAmount()).isEqualTo(170);
    }

    @Test
    void shouldRejectCompletingAlreadyCompletedOrFailedQuest() {
        Account acc = account(1L, ClassPlayer.GUERREIRO, 1, 0, 100, 0);
        Quest q = quest(10L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, acc);

        Accomplish completed = new Accomplish(
                new AccomplishId(10L, 1L), q, acc, AccomplishStatus.COMPLETED, 10, 5,
                LocalDateTime.now(FIXED_CLOCK), LocalDateTime.now(FIXED_CLOCK), null
        );
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(questService.findAccessibleQuestOrThrow(1L, 10L)).thenReturn(q);
        when(accomplishRepository.findById(new AccomplishId(10L, 1L))).thenReturn(Optional.of(completed));

        assertThatThrownBy(() -> accomplishService.completeQuest(1L, 10L))
                .isInstanceOf(ConflictException.class);

        Accomplish failed = new Accomplish(
                new AccomplishId(10L, 1L), q, acc, AccomplishStatus.FAILED, 0, 0,
                LocalDateTime.now(FIXED_CLOCK), null, LocalDateTime.now(FIXED_CLOCK)
        );
        when(accomplishRepository.findById(new AccomplishId(10L, 1L))).thenReturn(Optional.of(failed));

        assertThatThrownBy(() -> accomplishService.completeQuest(1L, 10L))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void shouldRejectFailingAlreadyCompletedOrFailedQuest() {
        Account acc = account(1L, ClassPlayer.MAGO, 1, 0, 100, 0);
        Quest q = quest(10L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, acc);

        Accomplish completed = new Accomplish(
                new AccomplishId(10L, 1L), q, acc, AccomplishStatus.COMPLETED, 10, 5,
                LocalDateTime.now(FIXED_CLOCK), LocalDateTime.now(FIXED_CLOCK), null
        );
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(questService.findAccessibleQuestOrThrow(1L, 10L)).thenReturn(q);
        when(accomplishRepository.findById(new AccomplishId(10L, 1L))).thenReturn(Optional.of(completed));

        assertThatThrownBy(() -> accomplishService.failQuest(1L, 10L))
                .isInstanceOf(BusinessException.class);

        Accomplish failed = new Accomplish(
                new AccomplishId(10L, 1L), q, acc, AccomplishStatus.FAILED, 0, 0,
                LocalDateTime.now(FIXED_CLOCK), null, LocalDateTime.now(FIXED_CLOCK)
        );
        when(accomplishRepository.findById(new AccomplishId(10L, 1L))).thenReturn(Optional.of(failed));

        assertThatThrownBy(() -> accomplishService.failQuest(1L, 10L))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void shouldApplyWarriorDamageReductionOnFailQuest() {
        Account warrior = account(1L, ClassPlayer.GUERREIRO, 2, 40, 100, 50);
        Quest veteran = quest(15L, QuestDifficulty.VETERANO, QuestCategory.SAUDE, warrior);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(warrior));
        when(questService.findAccessibleQuestOrThrow(1L, 15L)).thenReturn(veteran);
        when(accomplishRepository.findById(new AccomplishId(15L, 1L))).thenReturn(Optional.empty());
        when(accomplishRepository.save(any(Accomplish.class))).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        PunishmentResultDTO result = accomplishService.failQuest(1L, 15L);

        // VETERANO penalty = 15 * 0.8 (Guerreiro) = 12 HP
        assertThat(result.failedQuestsCount()).isEqualTo(1);
        assertThat(result.damageTaken()).isEqualTo(12);
        assertThat(result.died()).isFalse();
        assertThat(result.account().hpAmount()).isEqualTo(88);
    }

    @Test
    void shouldTriggerDeathRuleWhenHpReachesZero() {
        Account mage = account(1L, ClassPlayer.MAGO, 3, 180, 20, 100);
        Quest legendary = quest(99L, QuestDifficulty.LENDARIO, QuestCategory.ESTUDOS, mage);

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(mage));
        when(questService.findAccessibleQuestOrThrow(1L, 99L)).thenReturn(legendary);
        when(accomplishRepository.findById(new AccomplishId(99L, 1L))).thenReturn(Optional.empty());
        when(accomplishRepository.save(any(Accomplish.class))).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        PunishmentResultDTO result = accomplishService.failQuest(1L, 99L);

        // 20 HP - 25 dano = -5 -> morte: HP restaurado para 100, XP zerado, perde 25% do ouro (100 -> 75)
        assertThat(result.damageTaken()).isEqualTo(25);
        assertThat(result.died()).isTrue();
        assertThat(result.xpLost()).isEqualTo(180);
        assertThat(result.gcLost()).isEqualTo(25);
        assertThat(result.account().hpAmount()).isEqualTo(100);
        assertThat(result.account().xpAmount()).isZero();
        assertThat(result.account().gcAmount()).isEqualTo(75);
    }

    @Test
    void shouldReturnZeroPunishmentWhenNoExpiredDailiesExist() {
        Account acc = account(1L, ClassPlayer.LADINO, 1, 30, 85, 40);
        LocalDateTime startOfToday = LocalDate.now(FIXED_CLOCK).atStartOfDay();

        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(accomplishRepository.findExpiredPendingDailies(1L, startOfToday)).thenReturn(List.of());

        PunishmentResultDTO result = accomplishService.checkFailedDailies(1L);

        assertThat(result.failedQuestsCount()).isZero();
        assertThat(result.damageTaken()).isZero();
        assertThat(result.died()).isFalse();
        assertThat(result.account().hpAmount()).isEqualTo(85);
    }

    @Test
    void shouldPunishExpiredPendingDailiesAtomicallyAndTriggerDeathWhenCumulativeDamageKills() {
        Account rogue = account(1L, ClassPlayer.LADINO, 1, 60, 15, 80);
        Quest q1 = quest(1L, QuestDifficulty.NOVATO, QuestCategory.AGENDA, rogue);
        Quest q2 = quest(2L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, rogue);

        LocalDateTime yesterday = LocalDateTime.now(FIXED_CLOCK).minusDays(1);
        Accomplish a1 = new Accomplish(new AccomplishId(1L, 1L), q1, rogue, AccomplishStatus.PENDING, 0, 0, yesterday, null, null);
        Accomplish a2 = new Accomplish(new AccomplishId(2L, 1L), q2, rogue, AccomplishStatus.PENDING, 0, 0, yesterday, null, null);

        LocalDateTime startOfToday = LocalDate.now(FIXED_CLOCK).atStartOfDay();
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(rogue));
        when(accomplishRepository.findExpiredPendingDailies(1L, startOfToday)).thenReturn(List.of(a1, a2));
        when(accomplishRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        PunishmentResultDTO result = accomplishService.checkFailedDailies(1L);

        // 15 HP - 20 dano = -5 -> morte: HP=100, XP=0 (perdeu 60), GC=60 (perdeu 20)
        assertThat(result.failedQuestsCount()).isEqualTo(2);
        assertThat(result.failedQuestIds()).containsExactly(1L, 2L);
        assertThat(result.damageTaken()).isEqualTo(20);
        assertThat(result.died()).isTrue();
        assertThat(result.xpLost()).isEqualTo(60);
        assertThat(result.gcLost()).isEqualTo(20);
        assertThat(result.account().hpAmount()).isEqualTo(100);
        assertThat(result.account().xpAmount()).isZero();
        assertThat(result.account().gcAmount()).isEqualTo(60);
        assertThat(a1.getStatus()).isEqualTo(AccomplishStatus.FAILED);
        assertThat(a2.getStatus()).isEqualTo(AccomplishStatus.FAILED);
    }

    @Test
    void shouldUseSaoPauloLocalDateAcrossUtcMidnightBoundary() {
        // 2026-11-26T01:30:00Z = 2026-11-25 22:30:00 America/Sao_Paulo (ainda dia 25 no Brasil!)
        Clock lateNightSpClock = Clock.fixed(Instant.parse("2026-11-26T01:30:00Z"), SAO_PAULO);
        AccomplishService spService = new AccomplishService(accomplishRepository, accountRepository, questService, lateNightSpClock);
        Account acc = account(1L, ClassPlayer.MAGO, 1, 0, 100, 0);

        LocalDateTime expectedStartOfLocalDay = LocalDateTime.of(2026, 11, 25, 0, 0);
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(acc));
        when(accomplishRepository.findExpiredPendingDailies(1L, expectedStartOfLocalDay)).thenReturn(List.of());

        spService.checkFailedDailies(1L);

        verify(accomplishRepository).findExpiredPendingDailies(1L, expectedStartOfLocalDay);
    }

    @Test
    void shouldCalculateStreakAndWeeklyXpUsingLocalClock() {
        Account acc = account(1L, ClassPlayer.MAGO, 1, 0, 100, 0);
        Quest estudo1 = quest(1L, QuestDifficulty.NOVATO, QuestCategory.ESTUDOS, acc);
        Quest estudo2 = quest(2L, QuestDifficulty.VETERANO, QuestCategory.ESTUDOS, acc);
        Quest saude = quest(3L, QuestDifficulty.NOVATO, QuestCategory.SAUDE, acc);
        Quest semanaPassada = quest(4L, QuestDifficulty.LENDARIO, QuestCategory.ESTUDOS, acc);

        // FIXED_CLOCK = Quarta 2026-11-25 (início da semana Domingo = 2026-11-22)
        Accomplish cToday = new Accomplish(
                new AccomplishId(1L, 1L), estudo1, acc, AccomplishStatus.COMPLETED, 12, 5,
                LocalDateTime.of(2026, 11, 25, 9, 0), LocalDateTime.of(2026, 11, 25, 9, 30), null
        );
        Accomplish cYesterday = new Accomplish(
                new AccomplishId(2L, 1L), estudo2, acc, AccomplishStatus.COMPLETED, 36, 15,
                LocalDateTime.of(2026, 11, 24, 10, 0), LocalDateTime.of(2026, 11, 24, 11, 0), null
        );
        Accomplish cTwoDaysAgo = new Accomplish(
                new AccomplishId(3L, 1L), saude, acc, AccomplishStatus.COMPLETED, 10, 5,
                LocalDateTime.of(2026, 11, 23, 8, 0), LocalDateTime.of(2026, 11, 23, 8, 15), null
        );
        Accomplish cPrevWeek = new Accomplish(
                new AccomplishId(4L, 1L), semanaPassada, acc, AccomplishStatus.COMPLETED, 120, 50,
                LocalDateTime.of(2026, 11, 18, 10, 0), LocalDateTime.of(2026, 11, 18, 12, 0), null
        );

        when(accomplishRepository.findCompletedByAccountIdWithQuest(1L))
                .thenReturn(List.of(cToday, cYesterday, cTwoDaysAgo, cPrevWeek));

        QuestStatsDTO stats = accomplishService.getStats(1L, QuestCategory.ESTUDOS);

        // Sequência global: seg(23), ter(24), qua(25) = 3 dias
        assertThat(stats.currentStreak()).isEqualTo(3);
        assertThat(stats.recordStreak()).isEqualTo(3);
        assertThat(stats.week()).hasSize(7);
        assertThat(stats.week().get(3).today()).isTrue(); // Quarta = índice 3 (Dom=0, Seg=1, Ter=2, Qua=3)
        // XP semanal filtrado por ESTUDOS: ter(36) + qua(12) = 48; semana anterior = 120
        assertThat(stats.weeklyXpTotal()).isEqualTo(48);
        assertThat(stats.previousWeekXpTotal()).isEqualTo(120);
        assertThat(stats.weeklyXpDays().get(2)).isEqualTo(36);
        assertThat(stats.weeklyXpDays().get(3)).isEqualTo(12);
    }
}
