package com.levelup.api.service;

import com.levelup.api.dtos.CreateQuestDTO;
import com.levelup.api.dtos.QuestDTO;
import com.levelup.api.dtos.UpdateQuestDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Quest;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.repository.QuestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuestServiceTest {

    @Mock
    private QuestRepository questRepository;

    @Mock
    private AccountRepository accountRepository;

    private QuestService questService;

    @BeforeEach
    void setUp() {
        questService = new QuestService(questRepository, accountRepository);
    }

    private Account account(Long id) {
        return new Account(id, "Heroi" + id, "h" + id + "@levelup.com", "hash", ClassPlayer.GUERREIRO, 1, 0, 100, 0);
    }

    @Test
    void shouldCreateQuestWithRewardsDerivedFromDifficulty() {
        Account owner = account(1L);
        CreateQuestDTO dto = new CreateQuestDTO("  Ler 20 páginas  ", "  Capítulo de Java  ", QuestDifficulty.VETERANO, QuestCategory.ESTUDOS);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(questRepository.save(any(Quest.class))).thenAnswer(inv -> {
            Quest saved = inv.getArgument(0);
            saved.setIdQuest(42L);
            return saved;
        });

        QuestDTO result = questService.create(1L, dto);

        assertThat(result.idQuest()).isEqualTo(42L);
        assertThat(result.title()).isEqualTo("Ler 20 páginas");
        assertThat(result.description()).isEqualTo("Capítulo de Java");
        assertThat(result.xpReward()).isEqualTo(30);
        assertThat(result.gcAmount()).isEqualTo(15);
        assertThat(result.difficulty()).isEqualTo(QuestDifficulty.VETERANO);
        assertThat(result.category()).isEqualTo(QuestCategory.ESTUDOS);
        assertThat(result.idAccount()).isEqualTo(1L);
    }

    @Test
    void shouldRejectPaddedShortTitleOnCreate() {
        Account owner = account(1L);
        CreateQuestDTO dto = new CreateQuestDTO(" a ", null, QuestDifficulty.NOVATO, null);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(owner));

        assertThatThrownBy(() -> questService.create(1L, dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("3 e 100");
    }

    @Test
    void shouldDefaultCategoryToOutrosAndBlankDescriptionToNull() {
        Account owner = account(1L);
        CreateQuestDTO dto = new CreateQuestDTO("Beber água", "   ", QuestDifficulty.NOVATO, null);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(questRepository.save(any(Quest.class))).thenAnswer(inv -> inv.getArgument(0));

        QuestDTO result = questService.create(1L, dto);

        assertThat(result.category()).isEqualTo(QuestCategory.OUTROS);
        assertThat(result.description()).isNull();
        assertThat(result.xpReward()).isEqualTo(10);
        assertThat(result.gcAmount()).isEqualTo(5);
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldListAccessibleQuestsUsingDynamicSpecification() {
        Account owner = account(1L);
        Quest q1 = new Quest(1L, "Correr 5km", null, 100, 50, QuestDifficulty.LENDARIO, QuestCategory.SAUDE, owner, LocalDateTime.now());
        when(questRepository.findAll(any(Specification.class), any(Sort.class))).thenReturn(List.of(q1));

        List<QuestDTO> quests = questService.listAccessible(1L, QuestDifficulty.LENDARIO, QuestCategory.SAUDE);

        assertThat(quests).hasSize(1);
        assertThat(quests.getFirst().title()).isEqualTo("Correr 5km");
    }

    @Test
    void shouldAllowReadingGlobalQuest() {
        Quest global = new Quest(7L, "Missão Global", "Todos podem ver", 30, 15, QuestDifficulty.VETERANO, QuestCategory.ESTUDOS, null, LocalDateTime.now());
        when(questRepository.findById(7L)).thenReturn(Optional.of(global));

        QuestDTO result = questService.getById(1L, 7L);

        assertThat(result.idAccount()).isNull();
        assertThat(result.title()).isEqualTo("Missão Global");
    }

    @Test
    void shouldUpdateQuestAndRecalculateRewardsWhenDifficultyChanges() {
        Account owner = account(1L);
        Quest existing = new Quest(10L, "Tarefa inicial", "Desc", 10, 5, QuestDifficulty.NOVATO, QuestCategory.OUTROS, owner, LocalDateTime.now());

        when(questRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(questRepository.save(any(Quest.class))).thenAnswer(inv -> inv.getArgument(0));

        QuestDTO updated = questService.update(1L, 10L, new UpdateQuestDTO("Estudar Spring", "   ", QuestDifficulty.LENDARIO, QuestCategory.ESTUDOS));

        assertThat(updated.title()).isEqualTo("Estudar Spring");
        assertThat(updated.description()).isNull();
        assertThat(updated.xpReward()).isEqualTo(100);
        assertThat(updated.gcAmount()).isEqualTo(50);
        assertThat(updated.category()).isEqualTo(QuestCategory.ESTUDOS);
    }

    @Test
    void shouldReturn403WhenUpdatingGlobalQuest() {
        Quest global = new Quest(7L, "Global", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.OUTROS, null, LocalDateTime.now());
        when(questRepository.findById(7L)).thenReturn(Optional.of(global));

        assertThatThrownBy(() -> questService.update(1L, 7L, new UpdateQuestDTO("Hack", null, null, null)))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void shouldReturn404WhenUpdatingPrivateQuestOfAnotherUser() {
        Account owner = account(1L);
        Quest existing = new Quest(10L, "Privada", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.OUTROS, owner, LocalDateTime.now());
        when(questRepository.findById(10L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> questService.update(2L, 10L, new UpdateQuestDTO("Hack", null, null, null)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldHidePrivateQuestFromOtherUsersOnGetById() {
        Account owner = account(1L);
        Quest existing = new Quest(10L, "Privada", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.OUTROS, owner, LocalDateTime.now());
        when(questRepository.findById(10L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> questService.getById(2L, 10L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldDeleteOwnedQuest() {
        Account owner = account(1L);
        Quest existing = new Quest(10L, "Remover", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.OUTROS, owner, LocalDateTime.now());
        when(questRepository.findById(10L)).thenReturn(Optional.of(existing));

        questService.delete(1L, 10L);

        verify(questRepository).delete(existing);
    }
}
