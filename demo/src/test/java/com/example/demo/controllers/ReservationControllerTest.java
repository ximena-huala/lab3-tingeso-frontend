package com.example.demo.controllers;

import com.example.demo.entities.ReservationEntity;
import com.example.demo.services.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
public class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservationService reservationService;

    @Autowired
    private ObjectMapper objectMapper;

    private ReservationEntity sampleReservation;

    @BeforeEach
    void setUp() {
        sampleReservation = ReservationEntity.builder()
                .id(1L)
                .reservationDate(LocalDate.of(2025, 5, 15))
                .reservationTime(LocalTime.of(14, 0))
                .numberOfPeople(3)
                .trackTime("10 minutes")
                .totalPrice(45000.0)
                .build();
    }

    @Test
    void testCreateReservationSuccess() throws Exception {
        ReservationController.ReservationRequest request = new ReservationController.ReservationRequest();
        request.setReservation(sampleReservation);
        request.setCustomerRuts(List.of("12345678-9"));

        when(reservationService.createReservation(any(), any())).thenReturn(sampleReservation);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numberOfPeople").value(3))
                .andExpect(jsonPath("$.trackTime").value("10 minutes"));
    }

    @Test
    void testGetAllReservations() throws Exception {
        when(reservationService.getAllReservations()).thenReturn(List.of(sampleReservation));

        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(sampleReservation.getId()));
    }

    @Test
    void testGetAvailableTimes() throws Exception {
        LocalDate date = LocalDate.of(2025, 5, 20);
        when(reservationService.getAvailableTimesForDate(date)).thenReturn(List.of("14:00", "15:00"));

        mockMvc.perform(get("/api/reservations/available-times")
                        .param("date", date.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("14:00"))
                .andExpect(jsonPath("$[1]").value("15:00"));
    }

    @Test
    void testDeleteReservation() throws Exception {
        doNothing().when(reservationService).deleteReservationById(1L);

        mockMvc.perform(delete("/api/reservations/1"))
                .andExpect(status().isOk());
    }
}
