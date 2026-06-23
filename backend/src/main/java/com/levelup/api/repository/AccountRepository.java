package com.levelup.api.repository;

import com.levelup.api.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// @Repository indica ao Spring que esta interface é responsável por interagir com o banco de dados.
@Repository
// Ao estender JpaRepository, você ganha de "brinde" vários métodos prontos:
// save(), findAll(), findById(), deleteById(), etc. Não é preciso escrever "INSERT INTO..." ou "SELECT *...".
// Os genéricos <Account, Long> informam: "Este repositório gerencia a entidade Account,
// e a Chave Primária (ID) dessa entidade é do tipo Long".
public interface AccountRepository extends JpaRepository<Account, Long> {

    // "Query Methods" (Métodos de Consulta): O Spring lê o nome do método e cria o SQL automaticamente!

    // findByEmail: O Spring entende "SELECT * FROM account WHERE email = ?"
    // Retorna um Optional. O Optional é uma caixa que pode ou não conter uma Conta.
    // Isso é excelente para evitar o temido erro NullPointerException caso o email não exista no banco.
    Optional<Account> findByEmail(String email);

    // existsByEmail: O Spring entende "SELECT count(*) > 0 FROM account WHERE email = ?"
    // Retorna um booleano (true/false) de forma muito rápida, ideal para validações
    // antes de salvar um novo registro.
    Boolean existsByEmail(String email);
}