package com.levelup.api.controllers;

import com.levelup.api.config.SecurityConfig;
import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.AuthResponseDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.exceptions.GlobalExceptionHandler;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.security.CustomUserDetailsService;
import com.levelup.api.security.JwtAuthenticationFilter;
import com.levelup.api.security.JwtService;
import com.levelup.api.security.RestAccessDeniedHandler;
import com.levelup.api.security.RestAuthenticationEntryPoint;
import com.levelup.api.service.AccountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccountController.class)
@Import({
        SecurityConfig.class,
        JwtService.class,
        JwtAuthenticationFilter.class,
        RestAuthenticationEntryPoint.class,
        RestAccessDeniedHandler.class,
        GlobalExceptionHandler.class
})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-with-at-least-32-characters-for-hs256",
        "app.jwt.expiration-ms=3600000",
        "app.cors.allowed-origins=http://localhost:5173"
})
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private AccountService accountService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void shouldReturn400WithFieldErrorsWhenSignupPayloadIsInvalid() throws Exception {
        String invalidBody = """
                {
                  "username": "ab",
                  "email": "nao-e-email",
                  "password": "fraca",
                  "classPlayer": null
                }
                """;

        mockMvc.perform(post("/api/account/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.username").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists())
                .andExpect(jsonPath("$.fieldErrors.classPlayer").exists());
    }

    @Test
    void shouldAcceptCaseInsensitiveClassPlayerOnRegister() throws Exception {
        Account account = new Account(1L, "Heroi", "heroi@levelup.com", "hash", ClassPlayer.GUERREIRO, 1, 0, 100, 0);
        when(accountService.register(any())).thenReturn(AuthResponseDTO.bearer("jwt-token", 3_600_000L, account));

        String validBody = """
                {
                  "username": "Heroi",
                  "email": "heroi@levelup.com",
                  "password": "SenhaForte1",
                  "classPlayer": "Guerreiro"
                }
                """;

        mockMvc.perform(post("/api/account/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.account.classPlayer").value("GUERREIRO"));
    }

    @Test
    void shouldReturn400WhenClassPlayerIsInvalid() throws Exception {
        String body = """
                {
                  "username": "Heroi",
                  "email": "heroi@levelup.com",
                  "password": "SenhaForte1",
                  "classPlayer": "ARQUEIRO"
                }
                """;

        mockMvc.perform(post("/api/account/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Classe inválida")));
    }

    @Test
    void shouldReturn401OnProtectedEndpointWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/account/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.path").value("/api/account/me"));
    }

    @Test
    void shouldAllowProtectedEndpointWithValidJwt() throws Exception {
        Account account = new Account(1L, "Heroi", "heroi@levelup.com", "hash", ClassPlayer.MAGO, 2, 40, 100, 25);
        String token = jwtService.generateToken(account);

        when(userDetailsService.loadUserByUsername("heroi@levelup.com"))
                .thenReturn(new AccountUserDetails(account));
        when(accountService.getById(1L)).thenReturn(AccountDTO.fromEntity(account));

        mockMvc.perform(get("/api/account/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idAccount").value(1))
                .andExpect(jsonPath("$.username").value("Heroi"))
                .andExpect(jsonPath("$.classPlayer").value("MAGO"));
    }

    @Test
    void shouldAllowConfiguredCorsOrigin() throws Exception {
        mockMvc.perform(options("/api/account/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"));
    }

    @Test
    void shouldRejectUnconfiguredCorsOrigin() throws Exception {
        mockMvc.perform(options("/api/account/login")
                        .header(HttpHeaders.ORIGIN, "http://evil.example.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }
}
