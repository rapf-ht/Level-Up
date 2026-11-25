package com.levelup.api.controllers;

import com.levelup.api.config.SecurityConfig;
import com.levelup.api.dtos.QuestDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.GlobalExceptionHandler;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.security.CustomUserDetailsService;
import com.levelup.api.security.JwtAuthenticationFilter;
import com.levelup.api.security.JwtService;
import com.levelup.api.security.RestAccessDeniedHandler;
import com.levelup.api.security.RestAuthenticationEntryPoint;
import com.levelup.api.service.QuestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestController.class)
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
class QuestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private QuestService questService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private String authenticatedToken() {
        Account account = new Account(1L, "Heroi", "heroi@levelup.com", "hash", ClassPlayer.MAGO, 1, 0, 100, 0);
        when(userDetailsService.loadUserByUsername("heroi@levelup.com"))
                .thenReturn(new AccountUserDetails(account));
        return "Bearer " + jwtService.generateToken(account);
    }

    @Test
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/quests"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldCreateQuestAcceptingAccentedDifficultyAndCategory() throws Exception {
        String token = authenticatedToken();
        QuestDTO created = new QuestDTO(
                10L, "Maratona de estudos", "Revisar Spring Boot",
                100, 50, QuestDifficulty.LENDARIO, QuestCategory.SAUDE, 1L, LocalDateTime.now()
        );
        when(questService.create(eq(1L), any())).thenReturn(created);

        String body = """
                {
                  "title": "Maratona de estudos",
                  "description": "Revisar Spring Boot",
                  "difficulty": "Lendário",
                  "category": "Saúde"
                }
                """;

        mockMvc.perform(post("/api/quests")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idQuest").value(10))
                .andExpect(jsonPath("$.difficulty").value("LENDÁRIO"))
                .andExpect(jsonPath("$.category").value("SAUDE"))
                .andExpect(jsonPath("$.xpReward").value(100))
                .andExpect(jsonPath("$.gcAmount").value(50));
    }

    @Test
    void shouldReturn400WhenCreateQuestPayloadIsInvalid() throws Exception {
        String token = authenticatedToken();
        String body = """
                {
                  "title": "ab",
                  "difficulty": null
                }
                """;

        mockMvc.perform(post("/api/quests")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.difficulty").exists());
    }

    @Test
    void shouldListQuestsWithQueryFilters() throws Exception {
        String token = authenticatedToken();
        QuestDTO quest = new QuestDTO(
                1L, "Ler 10 páginas", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.ESTUDOS, 1L, LocalDateTime.now()
        );
        when(questService.listAccessible(1L, QuestDifficulty.NOVATO, QuestCategory.ESTUDOS))
                .thenReturn(List.of(quest));

        mockMvc.perform(get("/api/quests")
                        .param("difficulty", "novato")
                        .param("category", "estudos")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Ler 10 páginas"));
    }

    @Test
    void shouldReturn400WhenQueryFilterIsInvalid() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/quests")
                        .param("difficulty", "invalida")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Dificuldade inválida")));
    }

    @Test
    void shouldReturn400WhenPathIdIsNotNumeric() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/quests/abc")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("id")));
    }

    @Test
    void shouldReturn403WhenUpdatingGlobalQuest() throws Exception {
        String token = authenticatedToken();
        when(questService.update(eq(1L), eq(7L), any()))
                .thenThrow(new AccessDeniedException("Você não tem permissão para alterar missões globais."));

        mockMvc.perform(patch("/api/quests/7")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"Outro título\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturn404WhenUpdatingPrivateQuestOfAnotherUser() throws Exception {
        String token = authenticatedToken();
        when(questService.update(eq(1L), eq(99L), any()))
                .thenThrow(new ResourceNotFoundException("Missão não encontrada."));

        mockMvc.perform(patch("/api/quests/99")
                        .header(HttpHeaders.AUTHORIZATION, token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"Outro título\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteQuestAndReturn204() throws Exception {
        String token = authenticatedToken();
        doNothing().when(questService).delete(1L, 10L);

        mockMvc.perform(delete("/api/quests/10")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isNoContent());
    }
}
