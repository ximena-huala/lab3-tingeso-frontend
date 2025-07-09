package com.example.demo.repositories;

import com.example.demo.entities.KartEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class KartRepositoryTest {

    @Autowired
    private KartRepository kartRepository;

    private KartEntity kart;

    @BeforeEach
    void setUp() {
        kart = KartEntity.builder()
                .code("KART001")
                .status("available")
                .build();
        kartRepository.save(kart);
    }

    @Test
    void testFindByCode() {
        Optional<KartEntity> found = kartRepository.findByCode("KART001");
        assertThat(found).isPresent();
        assertThat(found.get().getStatus()).isEqualTo("available");
    }

    @Test
    void testExistsByCode() {
        boolean exists = kartRepository.existsByCode("KART001");
        assertThat(exists).isTrue();
    }

    @Test
    void testFindByStatus() {
        List<KartEntity> result = kartRepository.findByStatus("available");
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getCode()).isEqualTo("KART001");
    }
}
