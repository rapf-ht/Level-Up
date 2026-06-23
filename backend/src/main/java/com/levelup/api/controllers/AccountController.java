package com.levelup.api.controllers;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.LoginDTO;
import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController diz que esta classe vai responder requisições web devolvendo dados (JSON).
@RestController
// @RequestMapping define o caminho base para todas as rotas dessa classe.
@RequestMapping("/api/account")

// ATENÇÃO AQUI: Vi seu comentário "//Rever isso".
// A porta 5432 é a porta padrão do banco de dados PostgreSQL.
// O @CrossOrigin serve para permitir que seu Front-end faça requisições para esta API.
// Você deve colocar aqui a URL de onde o Front-end estará rodando (ex: http://localhost:3000,
// http://localhost:5173 ou a porta do Live Server do Figma/UI que vocês estão construindo).
@CrossOrigin("http://localhost:5432")
public class AccountController {

    // @Autowired injeta a dependência do AccountService automaticamente.
    // É o Service que contém as regras de negócio reais (salvar no banco, checar senha, etc).
    @Autowired
    private AccountService accountService;

    // Rota: POST http://localhost:8080/api/account/register
    @PostMapping("/register")
    // @RequestBody diz ao Spring para pegar o JSON que veio na requisição e converter em SignupDTO.
    public ResponseEntity<?> register(@RequestBody SignupDTO signup) {
        try {
            // Tenta registrar a conta usando o Service.
            var account = accountService.register(signup);
            // Se der certo, retorna status 200 (OK) e a conta formatada como AccountDTO (sem a senha).
            return ResponseEntity.ok(new AccountDTO(account));
        } catch (RuntimeException i) {
            // Se algo der errado (ex: email já existe), retorna status 400 (Bad Request) com a mensagem de erro.
            return ResponseEntity.badRequest().body(i.getMessage());
        }
    }

    // Rota: POST http://localhost:8080/api/account/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        // Tenta fazer o login buscando no Service
        var account = accountService.login(login.email, login.password);

        // Se a conta for encontrada (isPresent() do Optional for verdadeiro)...
        if (account.isPresent()) {
            // Retorna a conta logada com status 200 (OK)
            return ResponseEntity.ok(new AccountDTO(account.get()));
        }

        // Se não encontrar ou a senha estiver errada, retorna status 401 (Unauthorized).
        return ResponseEntity.status(401).body("Credencias inválidas");
    }
}