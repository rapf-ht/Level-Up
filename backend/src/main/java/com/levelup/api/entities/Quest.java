package com.levelup.api.entities;

import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "quest")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_quest")
    private Long idQuest;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward = 0;

    @Column(name = "gc_amount", nullable = false)
    private Integer gcAmount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false, length = 20)
    private QuestDifficulty difficulty;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private QuestCategory category = QuestCategory.OUTROS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_account")
    private Account account;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.category == null) {
            this.category = QuestCategory.OUTROS;
        }
    }
}
