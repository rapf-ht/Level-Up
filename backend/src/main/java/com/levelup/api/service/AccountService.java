package com.levelup.api.service;

import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

// @Service avisa ao Spring: "Esta classe contém a lógica de negócio do sistema.
// Por favor, gerencie ela para mim e a torne disponível para ser injetada em outros lugares."
@Service
public class AccountService {

    // @Autowired faz a "Injeção de Dependência".
    // O Spring cria a instância do AccountRepository e entrega pronta para você usar aqui,
    // sem precisar fazer "new AccountRepository()".
    @Autowired
    private AccountRepository accountRepository;

    // Injeta o PasswordEncoder que você configurou lá no SecurityConfig.java
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método responsável pelo CADASTRO (Registro)
    public Account register(SignupDTO signup) {
        // Regra de negócio 1: Não permitir dois jogadores com o mesmo email.
        if (accountRepository.existsByEmail(signup.email)) {
            // Se já existir, interrompe o processo e lança um erro.
            throw new RuntimeException("Email já cadastrado.");
        }

        // Instancia uma nova entidade vazia para ser preenchida com os dados do DTO.
        Account account = new Account();

        // Dica: Cuidado aqui! No seu DTO estava 'public String user;', e na entidade 'private String user;'.
        // O método gerado pelo Lombok na entidade Account seria setUser(), e não setUsername().
        // Se der erro de compilação, basta trocar para: account.setUser(signup.user);
        account.setUsername(signup.username);
        account.setEmail(signup.email);

        // Regra de negócio 2: Criptografia.
        // Pega a senha em "texto limpo" (ex: "123456"), passa pelo encriptador (BCrypt)
        // e salva o hash seguro (ex: "$2a$10$xyz...") na entidade.
        account.setPassword(passwordEncoder.encode(signup.password));

        // Regra de negócio 3: Transformando a String do DTO em um Enum seguro para o banco.
        // O .toUpperCase() garante que mesmo que o usuário envie "guerreiro",
        // o sistema procure por "GUERREIRO" no Enum.
        account.setClasses(ClassPlayer.valueOf(signup.classPlayer.toUpperCase()));

        // Manda o repositório salvar no banco de dados e retorna a conta salva (agora com um ID gerado).
        return accountRepository.save(account);
    }

    // Método responsável pelo LOGIN
    public Optional<Account> login(String email, String password) {
        // Busca a conta no banco usando o email. O resultado vem dentro da caixa "Optional".
        Optional<Account> accountOptional = accountRepository.findByEmail(email);

        // Se a caixa estiver vazia (usuário não existe), retorna vazio para o Controller lidar com isso.
        if (accountOptional.isEmpty()) {
            return Optional.empty();
        }

        // Se chegou aqui, a conta existe. Tiramos a conta de dentro do Optional usando o .get().
        Account account = accountOptional.get();

        // Regra de negócio 4: Verificação de senha segura.
        // O método .matches() compara a senha crua digitada no login com a senha criptografada
        // que está salva no banco, fazendo a matemática por trás para ver se "batem".
        boolean passwordMatcher = passwordEncoder.matches(password, account.getPassword());

        // Operador ternário (if/else enxuto):
        // Se a senha bater (true), retorna um Optional com a conta dentro.
        // Se a senha estiver errada (false), retorna um Optional vazio (negando o login).
        return passwordMatcher ? Optional.of(account) : Optional.empty();
    }
}