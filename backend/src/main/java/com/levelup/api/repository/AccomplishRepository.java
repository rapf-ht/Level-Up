package com.levelup.api.repository;

import com.levelup.api.entities.Accomplish;
import com.levelup.api.entities.AccomplishId;
import com.levelup.api.enums.AccomplishStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccomplishRepository extends JpaRepository<Accomplish, AccomplishId> {

    @Query("""
            SELECT a FROM Accomplish a
            JOIN FETCH a.quest q
            LEFT JOIN FETCH q.account
            WHERE a.account.idAccount = :accountId
            ORDER BY a.createdAt DESC, q.idQuest DESC
            """)
    List<Accomplish> findAllByAccountIdWithQuest(@Param("accountId") Long accountId);

    @Query("""
            SELECT a FROM Accomplish a
            JOIN FETCH a.quest q
            LEFT JOIN FETCH q.account
            WHERE a.account.idAccount = :accountId
              AND a.status = :status
            ORDER BY a.createdAt DESC, q.idQuest DESC
            """)
    List<Accomplish> findByAccountIdAndStatusWithQuest(
            @Param("accountId") Long accountId,
            @Param("status") AccomplishStatus status
    );

    @Query("""
            SELECT a FROM Accomplish a
            JOIN FETCH a.quest q
            WHERE a.account.idAccount = :accountId
              AND a.status = com.levelup.api.enums.AccomplishStatus.PENDING
              AND q.difficulty = com.levelup.api.enums.QuestDifficulty.NOVATO
              AND a.createdAt < :startOfToday
            ORDER BY a.createdAt ASC
            """)
    List<Accomplish> findExpiredPendingDailies(
            @Param("accountId") Long accountId,
            @Param("startOfToday") LocalDateTime startOfToday
    );

    @Query("""
            SELECT a FROM Accomplish a
            JOIN FETCH a.quest q
            WHERE a.account.idAccount = :accountId
              AND a.status = com.levelup.api.enums.AccomplishStatus.COMPLETED
              AND a.completedAt IS NOT NULL
            """)
    List<Accomplish> findCompletedByAccountIdWithQuest(@Param("accountId") Long accountId);
}
