package com.example.demo.repositories;

import com.example.demo.entities.ReservationEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ReservationRepositoryTest {

    @Autowired
    private ReservationRepository reservationRepository;

    @Test
    public void testSaveAndFindByDate() {
        LocalDate date = LocalDate.of(2025, 5, 10);
        ReservationEntity reservation = ReservationEntity.builder()
                .reservationDate(date)
                .reservationTime(LocalTime.of(15, 0))
                .numberOfPeople(5)
                .trackTime("10 minutes")
                .totalPrice(75000.0)
                .build();

        reservationRepository.save(reservation);

        List<ReservationEntity> results = reservationRepository.findByReservationDate(date);
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getNumberOfPeople()).isEqualTo(5);
    }

    @Test
    public void testFindByDateAndTime() {
        LocalDate date = LocalDate.of(2025, 5, 11);
        LocalTime time = LocalTime.of(14, 0);
        ReservationEntity reservation = ReservationEntity.builder()
                .reservationDate(date)
                .reservationTime(time)
                .numberOfPeople(3)
                .trackTime("15 minutes")
                .totalPrice(60000.0)
                .build();

        reservationRepository.save(reservation);

        List<ReservationEntity> results = reservationRepository.findByReservationDateAndReservationTime(date, time);
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getTrackTime()).isEqualTo("15 minutes");
    }

    @Test
    public void testFindByDateBetween() {
        LocalDate start = LocalDate.of(2025, 5, 1);
        LocalDate end = LocalDate.of(2025, 5, 31);

        ReservationEntity res1 = ReservationEntity.builder()
                .reservationDate(LocalDate.of(2025, 5, 5))
                .reservationTime(LocalTime.of(16, 0))
                .numberOfPeople(4)
                .trackTime("20 minutes")
                .totalPrice(100000.0)
                .build();

        ReservationEntity res2 = ReservationEntity.builder()
                .reservationDate(LocalDate.of(2025, 5, 20))
                .reservationTime(LocalTime.of(17, 0))
                .numberOfPeople(2)
                .trackTime("10 minutes")
                .totalPrice(30000.0)
                .build();

        reservationRepository.save(res1);
        reservationRepository.save(res2);

        List<ReservationEntity> results = reservationRepository.findByReservationDateBetween(start, end);
        assertThat(results).hasSize(2);
    }
}
