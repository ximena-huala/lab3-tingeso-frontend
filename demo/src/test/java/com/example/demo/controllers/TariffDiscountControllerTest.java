package com.example.demo.controllers;

import com.example.demo.entities.TariffDiscountEntity;
import com.example.demo.services.TariffDiscountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TariffDiscountController.class)
class TariffDiscountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TariffDiscountService service;

    @Autowired
    private ObjectMapper objectMapper;

    private TariffDiscountEntity discount;

    @BeforeEach
    void setUp() {
        discount = new TariffDiscountEntity(1L, "discount", "Grupo grande 20%", 0.2f, "15 minutos");
    }

    @Test
    void testGetAll() throws Exception {
        Mockito.when(service.getAll()).thenReturn(List.of(discount));

        mockMvc.perform(get("/api/tariff-discounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("discount"));
    }

    @Test
    void testCreate() throws Exception {
        Mockito.when(service.save(any(TariffDiscountEntity.class))).thenReturn(discount);

        mockMvc.perform(post("/api/tariff-discounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(discount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("discount"));
    }

    @Test
    void testUpdateFound() throws Exception {
        Mockito.when(service.getById(1L)).thenReturn(Optional.of(discount));
        Mockito.when(service.save(any(TariffDiscountEntity.class))).thenReturn(discount);

        mockMvc.perform(put("/api/tariff-discounts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(discount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Grupo grande 20%"));
    }

    @Test
    void testUpdateNotFound() throws Exception {
        Mockito.when(service.getById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/tariff-discounts/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(discount)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete() throws Exception {
        mockMvc.perform(delete("/api/tariff-discounts/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted successfully"));
    }
}

