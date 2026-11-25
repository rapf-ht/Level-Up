package com.levelup.api.controllers;

import com.levelup.api.config.SecurityConfig;
import com.levelup.api.dtos.AccountDTO;
import com.levelup.api.dtos.InventoryItemDTO;
import com.levelup.api.dtos.ItemDTO;
import com.levelup.api.dtos.PurchaseResultDTO;
import com.levelup.api.dtos.SaleResultDTO;
import com.levelup.api.entities.Account;
import com.levelup.api.enums.ClassPlayer;
import com.levelup.api.enums.ItemType;
import com.levelup.api.exceptions.BusinessException;
import com.levelup.api.exceptions.ConflictException;
import com.levelup.api.exceptions.GlobalExceptionHandler;
import com.levelup.api.exceptions.ResourceNotFoundException;
import com.levelup.api.security.AccountUserDetails;
import com.levelup.api.security.CustomUserDetailsService;
import com.levelup.api.security.JwtAuthenticationFilter;
import com.levelup.api.security.JwtService;
import com.levelup.api.security.RestAccessDeniedHandler;
import com.levelup.api.security.RestAuthenticationEntryPoint;
import com.levelup.api.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InventoryController.class)
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
class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @MockitoBean
    private InventoryService inventoryService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private String authenticatedToken() {
        Account account = new Account(1L, "Heroi", "heroi@levelup.com", "hash", ClassPlayer.MAGO, 1, 0, 100, 500);
        when(userDetailsService.loadUserByUsername("heroi@levelup.com"))
                .thenReturn(new AccountUserDetails(account));
        return "Bearer " + jwtService.generateToken(account);
    }

    @Test
    void shouldReturn401WhenUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldListInventoryItems() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(4L, "Espada Curta", "Lâmina", "/ui/espada.png", 350, 175, ItemType.EQUIPAMENTO, null);
        InventoryItemDTO entry = new InventoryItemDTO(10L, sword, true, LocalDateTime.now());
        when(inventoryService.listInventory(1L, null)).thenReturn(List.of(entry));

        mockMvc.perform(get("/api/inventory")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].idInventory").value(10))
                .andExpect(jsonPath("$[0].equipped").value(true))
                .andExpect(jsonPath("$[0].item.name").value("Espada Curta"));
    }

    @Test
    void shouldBuyItemAndReturn201() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(4L, "Espada Curta", "Lâmina", "/ui/espada.png", 350, 175, ItemType.EQUIPAMENTO, null);
        InventoryItemDTO invItem = new InventoryItemDTO(10L, sword, false, LocalDateTime.now());
        AccountDTO acc = new AccountDTO(1L, "Heroi", "heroi@levelup.com", ClassPlayer.MAGO, 1, 0, 100, 150);
        PurchaseResultDTO purchase = new PurchaseResultDTO(invItem, 350, acc);

        when(inventoryService.buyItem(1L, 4L)).thenReturn(purchase);

        mockMvc.perform(post("/api/inventory/items/4/buy")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.gcSpent").value(350))
                .andExpect(jsonPath("$.account.gcAmount").value(150))
                .andExpect(jsonPath("$.inventoryItem.equipped").value(false));
    }

    @Test
    void shouldReturn409WhenBuyingAlreadyOwnedItem() throws Exception {
        String token = authenticatedToken();
        when(inventoryService.buyItem(1L, 4L)).thenThrow(new ConflictException("Você já possui este item."));

        mockMvc.perform(post("/api/inventory/items/4/buy")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Você já possui este item."));
    }

    @Test
    void shouldReturn400WhenGoldIsInsufficient() throws Exception {
        String token = authenticatedToken();
        when(inventoryService.buyItem(1L, 4L)).thenThrow(new BusinessException("Ouro insuficiente. Faltam 250 GC."));

        mockMvc.perform(post("/api/inventory/items/4/buy")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Ouro insuficiente")));
    }

    @Test
    void shouldSellItemAndReturn200() throws Exception {
        String token = authenticatedToken();
        AccountDTO acc = new AccountDTO(1L, "Heroi", "heroi@levelup.com", ClassPlayer.MAGO, 1, 0, 100, 325);
        SaleResultDTO sale = new SaleResultDTO(4L, "Espada Curta", 175, true, acc);

        when(inventoryService.sellItem(1L, 10L)).thenReturn(sale);

        mockMvc.perform(post("/api/inventory/10/sell")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gcEarned").value(175))
                .andExpect(jsonPath("$.wasEquipped").value(true))
                .andExpect(jsonPath("$.account.gcAmount").value(325));
    }

    @Test
    void shouldEquipAndUnequipItem() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(4L, "Espada Curta", "Lâmina", "/ui/espada.png", 350, 175, ItemType.EQUIPAMENTO, null);
        InventoryItemDTO equippedDto = new InventoryItemDTO(10L, sword, true, LocalDateTime.now());
        InventoryItemDTO unequippedDto = new InventoryItemDTO(10L, sword, false, LocalDateTime.now());

        when(inventoryService.equip(1L, 10L)).thenReturn(equippedDto);
        when(inventoryService.unequip(1L, 10L)).thenReturn(unequippedDto);

        mockMvc.perform(patch("/api/inventory/10/equip")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equipped").value(true));

        mockMvc.perform(patch("/api/inventory/10/unequip")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.equipped").value(false));
    }

    @Test
    void shouldReturn400WhenTypeFilterIsInvalid() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(get("/api/inventory")
                        .param("type", "xyz")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Tipo de item inválido")));
    }

    @Test
    void shouldReturn400WhenInventoryIdIsNotNumeric() throws Exception {
        String token = authenticatedToken();

        mockMvc.perform(post("/api/inventory/abc/sell")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("inventoryId")));
    }

    @Test
    void shouldListInventoryFilteredByType() throws Exception {
        String token = authenticatedToken();
        ItemDTO sword = new ItemDTO(4L, "Espada Curta", "Lâmina", "/ui/espada.png", 350, 175, ItemType.EQUIPAMENTO, null);
        InventoryItemDTO entry = new InventoryItemDTO(10L, sword, false, LocalDateTime.now());
        when(inventoryService.listInventory(1L, ItemType.EQUIPAMENTO)).thenReturn(List.of(entry));

        mockMvc.perform(get("/api/inventory")
                        .param("type", "equipamento")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].item.type").value("EQUIPAMENTO"));
    }

    @Test
    void shouldReturn404WhenSellingOrEquippingMissingInventoryItem() throws Exception {
        String token = authenticatedToken();
        when(inventoryService.sellItem(1L, 99L))
                .thenThrow(new ResourceNotFoundException("Item não encontrado no seu inventário."));

        mockMvc.perform(post("/api/inventory/99/sell")
                        .header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Item não encontrado no seu inventário."));
    }
}
