package com.levelup.api.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.levelup.api.enums.ClassPlayer;

// @Entity diz ao JPA/Hibernate que esta classe representa uma tabela no banco de dados.
@Entity
// @Table permite especificar o nome exato da tabela no banco.
@Table(name = "account")
// As anotações do Lombok geram automaticamente os métodos Getters, Setters e os Construtores,
// mantendo o código limpo e evitando aquele monte de linhas repetitivas.
@Getter
@Setter
@NoArgsConstructor // Cria um construtor vazio (exigência do JPA)
@AllArgsConstructor // Cria um construtor com todos os atributos
public class Account {

    // @Id define que este campo é a Chave Primária (PK) da tabela.
    @Id
    // @GeneratedValue com IDENTITY delega ao banco de dados a responsabilidade
    // de gerar esse ID automaticamente (como um AUTO_INCREMENT no SQL).
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAccount;

    // @Column mapeia o atributo para uma coluna.
    // nullable = false (não pode ser nulo/vazio), unique = true (não podem existir dois iguais).
    @Column(nullable = false, unique = true, length = 25)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    // @Enumerated(EnumType.STRING) salva o nome do Enum (ex: "GUERREIRO") no banco de dados
    // em vez do número da posição dele (0, 1, 2), o que facilita a leitura no banco.
    @Enumerated(EnumType.STRING)
    private ClassPlayer classes;

    // Valores padrão (default) para quando uma conta for criada pela primeira vez:
    @Column(nullable = false)
    private Integer level = 1;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private Integer hp = 100;

    @Column(nullable = false)
    private Integer gc = 0;
}