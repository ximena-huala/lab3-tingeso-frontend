package com.example.demo.services;

import com.example.demo.entities.ReservationEntity;
import com.example.demo.repositories.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReportService reportService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerateTrackTimeReport() {
        ReservationEntity r1 = new ReservationEntity();
        r1.setTrackTime("10 minutes");
        r1.setReservationDate(LocalDate.of(2024, 5, 1));
        r1.setTotalPrice(15000.0);

        ReservationEntity r2 = new ReservationEntity();
        r2.setTrackTime("15 minutes");
        r2.setReservationDate(LocalDate.of(2024, 5, 1));
        r2.setTotalPrice(20000.0);

        List<ReservationEntity> reservations = Arrays.asList(r1, r2);
        when(reservationRepository.findAll()).thenReturn(reservations);

        var result = reportService.generateTrackTimeReport(2024, 5, 5);

        assertEquals(15000, result.get("10 minutes").get("MAY"));
        assertEquals(20000, result.get("15 minutes").get("MAY"));
    }

    @Test
    void testGenerateGroupSizeReport() {
        ReservationEntity r1 = new ReservationEntity();
        r1.setNumberOfPeople(2);
        r1.setReservationDate(LocalDate.of(2024, 5, 1));
        r1.setTotalPrice(10000.0);

        ReservationEntity r2 = new ReservationEntity();
        r2.setNumberOfPeople(6);
        r2.setReservationDate(LocalDate.of(2024, 5, 1));
        r2.setTotalPrice(30000.0);

        List<ReservationEntity> reservations = Arrays.asList(r1, r2);
        when(reservationRepository.findAll()).thenReturn(reservations);

        var result = reportService.generateGroupSizeReport(2024, 5, 5);

        assertEquals(10000, result.get("1-2").get("MAY"));
        assertEquals(30000, result.get("6-10").get("MAY"));
    }
}
