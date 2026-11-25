package com.levelup.api.entities;

import com.levelup.api.enums.AccomplishStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "accomplish")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Accomplish {

    @EmbeddedId
    private AccomplishId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idQuest")
    @JoinColumn(name = "id_quest", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Quest quest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idAccount")
    @JoinColumn(name = "id_account", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AccomplishStatus status = AccomplishStatus.PENDING;

    @Column(name = "xp_earned", nullable = false)
    private Integer xpEarned = 0;

    @Column(name = "gc_earned", nullable = false)
    private Integer gcEarned = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failed_at")
    private LocalDateTime failedAt;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = AccomplishStatus.PENDING;
        }
        if (this.xpEarned == null) {
            this.xpEarned = 0;
        }
        if (this.gcEarned == null) {
            this.gcEarned = 0;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
