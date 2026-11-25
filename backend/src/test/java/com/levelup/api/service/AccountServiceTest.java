package com.levelup.api.service;

import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.AuthResponseDTO;
import com.levelup.api.dtos.LoginDTO;
import com.levelup.api.dtos.SignupDTO;
import com.levelup.api.dtos.UpdateAccountDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.InvalidCredentialsException;
import com.levelup.api.repository.AccountRepository;
import com.levelup.api.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtService = new JwtService("test-secret-key-with-at-least-32-characters-for-hs256", 3_600_000L);
        accountService = new AccountService(accountRepository, passwordEncoder, jwtService);
    }

    @Test
    void shouldRegisterAccountAndReturnJwt() {
        SignupDTO signup = new SignupDTO("RafaelDev", "Rafael@Email.com", "SenhaForte1", ClassPlayer.MAGO);

        when(accountRepository.existsByEmailIgnoreCase("rafael@email.com")).thenReturn(false);
        when(accountRepository.existsByUsernameIgnoreCase("RafaelDev")).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account saved = invocation.getArgument(0);
            saved.setIdAccount(10L);
            return saved;
        });

        AuthResponseDTO response = accountService.register(signup);

        assertThat(response.token()).isNotBlank();
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.account().idAccount()).isEqualTo(10L);
        assertThat(response.account().email()).isEqualTo("rafael@email.com");
        assertThat(response.account().classPlayer()).isEqualTo(ClassPlayer.MAGO);
        assertThat(response.account().level()).isEqualTo(1);
        assertThat(response.account().hpAmount()).isEqualTo(100);
        assertThat(jwtService.extractEmail(response.token())).isEqualTo("rafael@email.com");
    }

    @Test
    void shouldThrowConflictWhenEmailAlreadyExists() {
        SignupDTO signup = new SignupDTO("RafaelDev", "dup@email.com", "SenhaForte1", ClassPlayer.GUERREIRO);
        when(accountRepository.existsByEmailIgnoreCase("dup@email.com")).thenReturn(true);

        assertThatThrownBy(() -> accountService.register(signup))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void shouldThrowConflictWhenUsernameAlreadyExists() {
        SignupDTO signup = new SignupDTO("TakenName", "novo@email.com", "SenhaForte1", ClassPlayer.LADINO);
        when(accountRepository.existsByEmailIgnoreCase("novo@email.com")).thenReturn(false);
        when(accountRepository.existsByUsernameIgnoreCase("TakenName")).thenReturn(true);

        assertThatThrownBy(() -> accountService.register(signup))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Username já está em uso");
    }

    @Test
    void shouldLoginAndReturnJwt() {
        Account stored = new Account();
        stored.setIdAccount(5L);
        stored.setUsername("LadinoPro");
        stored.setEmail("ladino@email.com");
        stored.setPassword(passwordEncoder.encode("SenhaForte1"));
        stored.setClassPlayer(ClassPlayer.LADINO);

        when(accountRepository.findByEmailIgnoreCase("ladino@email.com")).thenReturn(Optional.of(stored));

        AuthResponseDTO response = accountService.login(new LoginDTO("LADINO@email.com", "SenhaForte1"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.account().username()).isEqualTo("LadinoPro");
    }

    @Test
    void shouldRejectInvalidPasswordOnLogin() {
        Account stored = new Account();
        stored.setIdAccount(5L);
        stored.setEmail("ladino@email.com");
        stored.setPassword(passwordEncoder.encode("SenhaForte1"));
        stored.setClassPlayer(ClassPlayer.LADINO);

        when(accountRepository.findByEmailIgnoreCase("ladino@email.com")).thenReturn(Optional.of(stored));

        assertThatThrownBy(() -> accountService.login(new LoginDTO("ladino@email.com", "SenhaErrada")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void shouldUpdateUsernameAndClass() {
        Account stored = new Account();
        stored.setIdAccount(1L);
        stored.setUsername("AntigoNome");
        stored.setEmail("hero@email.com");
        stored.setClassPlayer(ClassPlayer.GUERREIRO);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(stored));
        when(accountRepository.existsByUsernameIgnoreCase("NovoNome")).thenReturn(false);
        when(accountRepository.save(any(Account.class))).thenAnswer(inv -> inv.getArgument(0));

        AccountDTO updated = accountService.update(1L, new UpdateAccountDTO("NovoNome", ClassPlayer.MAGO));

        assertThat(updated.username()).isEqualTo("NovoNome");
        assertThat(updated.classPlayer()).isEqualTo(ClassPlayer.MAGO);
    }
}
