package com.levelup.api.service;

import com.levelup.api.dtos.CreateQuestDTO;
import com.levelup.api.dtos.QuestDTO;
import com.levelup.api.dtos.UpdateQuestDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.entities.Quest;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.repository.QuestRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public QuestDTO create(Long accountId, CreateQuestDTO dto) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Conta não encontrada."));

        Quest quest = new Quest();
        quest.setTitle(normalizeAndValidateTitle(dto.title()));
        quest.setDescription(normalizeDescription(dto.description()));
        quest.setDifficulty(dto.difficulty());
        quest.setXpReward(dto.difficulty().getXpReward());
        quest.setGcAmount(dto.difficulty().getGcReward());
        quest.setCategory(dto.category() != null ? dto.category() : QuestCategory.OUTROS);
        quest.setAccount(account);
        quest.setCreatedAt(LocalDateTime.now());

        return QuestDTO.fromEntity(questRepository.save(quest));
    }

    @Transactional(readOnly = true)
    public List<QuestDTO> listAccessible(Long accountId, QuestDifficulty difficulty, QuestCategory category) {
        Specification<Quest> spec = buildAccessibleSpec(accountId, difficulty, category);
        Sort sort = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("idQuest"));

        return questRepository.findAll(spec, sort)
                .stream()
                .map(QuestDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuestDTO getById(Long accountId, Long questId) {
        Quest quest = findAccessibleQuestOrThrow(accountId, questId);
        return QuestDTO.fromEntity(quest);
    }

    @Transactional
    public QuestDTO update(Long accountId, Long questId, UpdateQuestDTO dto) {
        Quest quest = findOwnedQuestOrThrow(accountId, questId);

        if (dto.title() != null) {
            quest.setTitle(normalizeAndValidateTitle(dto.title()));
        }

        if (dto.description() != null) {
            quest.setDescription(normalizeDescription(dto.description()));
        }

        if (dto.difficulty() != null) {
            quest.setDifficulty(dto.difficulty());
            quest.setXpReward(dto.difficulty().getXpReward());
            quest.setGcAmount(dto.difficulty().getGcReward());
        }

        if (dto.category() != null) {
            quest.setCategory(dto.category());
        }

        return QuestDTO.fromEntity(questRepository.save(quest));
    }

    @Transactional
    public void delete(Long accountId, Long questId) {
        Quest quest = findOwnedQuestOrThrow(accountId, questId);
        questRepository.delete(quest);
    }

    @Transactional(readOnly = true)
    public Quest findAccessibleQuestOrThrow(Long accountId, Long questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Missão não encontrada."));

        if (quest.getAccount() != null && !quest.getAccount().getIdAccount().equals(accountId)) {
            throw new ResourceNotFoundException("Missão não encontrada.");
        }
        return quest;
    }

    private Quest findOwnedQuestOrThrow(Long accountId, Long questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Missão não encontrada."));

        if (quest.getAccount() == null) {
            throw new AccessDeniedException("Você não tem permissão para alterar missões globais.");
        }

        if (!quest.getAccount().getIdAccount().equals(accountId)) {
            throw new ResourceNotFoundException("Missão não encontrada.");
        }
        return quest;
    }

    private Specification<Quest> buildAccessibleSpec(
            Long accountId,
            QuestDifficulty difficulty,
            QuestCategory category
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Quest, Account> accountJoin = root.join("account", JoinType.LEFT);
            predicates.add(cb.or(
                    cb.equal(accountJoin.get("idAccount"), accountId),
                    cb.isNull(accountJoin.get("idAccount"))
            ));

            if (difficulty != null) {
                predicates.add(cb.equal(root.get("difficulty"), difficulty));
            }
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String normalizeAndValidateTitle(String title) {
        String trimmed = title == null ? "" : title.trim();
        if (trimmed.length() < 3 || trimmed.length() > 100) {
            throw new BusinessException("Título deve ter entre 3 e 100 caracteres.");
        }
        return trimmed;
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String trimmed = description.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
