package com.levelup.api.controllers;

import com.levelup.api.config.SecurityConfig;
import com.levelup.api.dtos.ItemDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.ItemType;
import com.levelup.api.exceptions.GlobalExceptionHandler;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.security.CustomUserDetailsService;
import com.levelup.api.security.JwtAuthenticationFilter;
import com.levelup.api.security.JwtService;
import com.levelup.api.security.RestAccessDeniedHandler;
import com.levelup.api.security.RestAuthenticationEntryPoint;
import com.levelup.api.service.ItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ItemController.class)
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
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private ItemService itemService;

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
        mockMvc.perform(get("/api/items"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldListItemsFilteredByType() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(
                4L, "Espada Curta", "Uma lâmina leve para iniciantes.", "/ui/espada.png",
                350, 175, ItemType.EQUIPAMENTO, null
        );
        when(itemService.listCatalog(ItemType.EQUIPAMENTO)).thenReturn(List.of(sword));

        mockMvc.perform(get("/api/items")
                        .param("type", "equipamento")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Espada Curta"))
                .andExpect(jsonPath("$[0].type").value("EQUIPAMENTO"))
                .andExpect(jsonPath("$[0].sellPrice").value(175));
    }

    @Test
    void shouldListAllItemsWhenTypeIsOmitted() throws Exception {
        String token = authenticatedToken();
        ItemDTO house = new ItemDTO(
                2L, "Casa Nova", "Um lar aconchegante.", "/banners/banner_casa.png",
                150, 75, ItemType.CASA, null
        );
        when(itemService.listCatalog(null)).thenReturn(List.of(house));

        mockMvc.perform(get("/api/items")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Casa Nova"))
                .andExpect(jsonPath("$[0].type").value("CASA"));
    }

    @Test
    void shouldGetItemById() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(
                4L, "Espada Curta", "Uma lâmina leve para iniciantes.", "/ui/espada.png",
                350, 175, ItemType.EQUIPAMENTO, 12L
        );
        when(itemService.getById(4L)).thenReturn(sword);

        mockMvc.perform(get("/api/items/4")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.idItem").value(4))
                .andExpect(jsonPath("$.sellPrice").value(175))
                .andExpect(jsonPath("$.idQuest").value(12));
    }

    @Test
    void shouldReturn400WhenTypeFilterIsInvalid() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/items")
                        .param("type", "invalido")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Tipo de item inválido")));
    }

    @Test
    void shouldReturn400WhenPathIdIsNotNumeric() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/items/abc")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("id")));
    }

    @Test
    void shouldReturn404WhenItemNotFound() throws Exception {
        String token = authenticatedToken();
        when(itemService.getById(99L)).thenThrow(new ResourceNotFoundException("Item não encontrado."));

        mockMvc.perform(get("/api/items/99")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Item não encontrado."));
    }
}
