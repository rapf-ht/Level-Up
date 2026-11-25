package com.levelup.api.controllers;

import com.levelup.api.config.SecurityConfig;
import com.levelup.api.dtos.AccomplishDTO;
import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.PunishmentResultDTO;
import com.levelup.api.dtos.QuestCompletionDTO;
import com.levelup.api.dtos.QuestDTO;
import com.levelup.api.dtos.QuestStatsDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.AccomplishStatus;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.QuestCategory;
import com.levelup.api.enums.QuestDifficulty;
import com.levelup.api.exceptions.GlobalExceptionHandler;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.security.CustomUserDetailsService;
import com.levelup.api.security.JwtAuthenticationFilter;
import com.levelup.api.security.JwtService;
import com.levelup.api.security.RestAccessDeniedHandler;
import com.levelup.api.security.RestAuthenticationEntryPoint;
import com.levelup.api.service.AccomplishService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AccomplishController.class)
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
class AccomplishControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private AccomplishService accomplishService;

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
        mockMvc.perform(get("/api/accomplish"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldStartQuestAndReturn201() throws Exception {
        String token = authenticatedToken();
        QuestDTO quest = new QuestDTO(10L, "Ler 10 páginas", null, 10, 5, QuestDifficulty.NOVATO, QuestCategory.ESTUDOS, 1L, LocalDateTime.now());
        AccomplishDTO dto = new AccomplishDTO(10L, 1L, quest, AccomplishStatus.PENDING, 0, 0, LocalDateTime.now(), null, null);
        when(accomplishService.startQuest(1L, 10L)).thenReturn(dto);

        mockMvc.perform(post("/api/accomplish/quests/10/start")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idQuest").value(10))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldCompleteQuestAndReturnProgressionPayload() throws Exception {
        String token = authenticatedToken();
        QuestDTO quest = new QuestDTO(10L, "Estudar JPA", null, 100, 50, QuestDifficulty.LENDARIO, QuestCategory.ESTUDOS, 1L, LocalDateTime.now());
        AccomplishDTO accomplish = new AccomplishDTO(10L, 1L, quest, AccomplishStatus.COMPLETED, 120, 50, LocalDateTime.now(), LocalDateTime.now(), null);
        AccountDTO account = new AccountDTO(1L, "Heroi", "heroi@levelup.com", ClassPlayer.MAGO, 2, 20, 100, 100);
        QuestCompletionDTO response = new QuestCompletionDTO(accomplish, 120, 50, true, 1, 50, account);

        when(accomplishService.completeQuest(1L, 10L)).thenReturn(response);

        mockMvc.perform(post("/api/accomplish/quests/10/complete")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xpEarned").value(120))
                .andExpect(jsonPath("$.leveledUp").value(true))
                .andExpect(jsonPath("$.account.level").value(2));
    }

    @Test
    void shouldFailQuestAndReturnPunishmentResult() throws Exception {
        String token = authenticatedToken();
        AccountDTO account = new AccountDTO(1L, "Heroi", "heroi@levelup.com", ClassPlayer.MAGO, 1, 0, 100, 75);
        PunishmentResultDTO result = new PunishmentResultDTO(1, List.of(10L), 25, true, 50, 25, account);

        when(accomplishService.failQuest(1L, 10L)).thenReturn(result);

        mockMvc.perform(post("/api/accomplish/quests/10/fail")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.died").value(true))
                .andExpect(jsonPath("$.damageTaken").value(25))
                .andExpect(jsonPath("$.gcLost").value(25));
    }

    @Test
    void shouldCheckFailedDailies() throws Exception {
        String token = authenticatedToken();
        AccountDTO account = new AccountDTO(1L, "Heroi", "heroi@levelup.com", ClassPlayer.MAGO, 1, 10, 90, 20);
        PunishmentResultDTO result = new PunishmentResultDTO(1, List.of(5L), 10, false, 0, 0, account);

        when(accomplishService.checkFailedDailies(1L)).thenReturn(result);

        mockMvc.perform(post("/api/accomplish/check-failed")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.failedQuestsCount").value(1))
                .andExpect(jsonPath("$.account.hpAmount").value(90));
    }

    @Test
    void shouldReturn400WhenStatusFilterIsInvalid() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/accomplish")
                        .param("status", "desconhecido")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Status inválido")));
    }

    @Test
    void shouldReturnStatsWithCategoryFilter() throws Exception {
        String token = authenticatedToken();
        QuestStatsDTO stats = new QuestStatsDTO(
                3,
                5,
                List.of(new QuestStatsDTO.WeekDayStatusDTO(LocalDate.of(2026, 11, 25), true, true)),
                List.of(0, 10, 20, 30, 0, 0, 0),
                60,
                40
        );
        when(accomplishService.getStats(1L, QuestCategory.SAUDE)).thenReturn(stats);

        mockMvc.perform(get("/api/accomplish/stats")
                        .param("category", "Saúde")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentStreak").value(3))
                .andExpect(jsonPath("$.weeklyXpTotal").value(60));
    }

    @Test
    void shouldReturn400WhenQuestIdIsNotNumeric() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(post("/api/accomplish/quests/abc/complete")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("questId")));
    }
}
