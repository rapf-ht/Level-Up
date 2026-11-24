package com.levelup.api.entities;

import com.levelup.api.enums.ClassPlayer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_account")
    private Long idAccount;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "class", nullable = false, length = 20)
    private ClassPlayer classPlayer;

    @Column(name = "level", nullable = false)
    private Integer level = 1;

    @Column(name = "xp_amount", nullable = false)
    private Integer xpAmount = 0;

    @Column(name = "hp_amount", nullable = false)
    private Integer hpAmount = 100;

    @Column(name = "gc_amount", nullable = false)
    private Integer gcAmount = 0;
}
