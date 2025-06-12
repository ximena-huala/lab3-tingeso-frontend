package com.example.demo.controllers;

import com.example.demo.entities.KartEntity;
import com.example.demo.services.KartServices;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KartController.class)
public class KartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KartServices kartService;

    private KartEntity kart;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        kart = KartEntity.builder()
                .id(1L)
                .code("KART001")
                .status("available")
                .build();

        objectMapper = new ObjectMapper();
    }

    @Test
    void testSaveKart() throws Exception {
        when(kartService.saveKart(any(KartEntity.class))).thenReturn(kart);

        mockMvc.perform(post("/api/karts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(kart)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("KART001"));
    }

    @Test
    void testGetAllKarts() throws Exception {
        when(kartService.getAllKarts()).thenReturn(Arrays.asList(kart));

        mockMvc.perform(get("/api/karts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("KART001"));
    }

    @Test
    void testGetKartById_Found() throws Exception {
        when(kartService.getKartById(1L)).thenReturn(Optional.of(kart));

        mockMvc.perform(get("/api/karts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("available"));
    }

    @Test
    void testGetKartById_NotFound() throws Exception {
        when(kartService.getKartById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/karts/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteKart() throws Exception {
        when(kartService.deleteKart(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/karts/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Kart deleted successfully"));
    }
}

