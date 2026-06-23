package com.levelup.api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.levelup.api.enums.ClassPlayer;

@Entity
@Table(name = "account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAccount;

    @Column(nullable = false, unique = true, length = 25)
    private String username;

    @Column(nullable = false, unique = true) //lenght padrão -> 255
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ClassPlayer classes;

    @Column(nullable = false)
    private Integer level = 1; //inicia lvl 1

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private Integer hp = 100; //inicia hp 100%

    @Column(nullable = false)
    private Integer gc = 0;
}