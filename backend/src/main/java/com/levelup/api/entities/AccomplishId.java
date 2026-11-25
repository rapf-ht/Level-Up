package com.levelup.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class AccomplishId implements Serializable {

    @Column(name = "id_quest", nullable = false)
    private Long idQuest;

    @Column(name = "id_account", nullable = false)
    private Long idAccount;
}
