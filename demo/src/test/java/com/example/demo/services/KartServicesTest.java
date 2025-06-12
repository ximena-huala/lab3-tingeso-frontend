package com.example.demo.services;

import com.example.demo.entities.KartEntity;
import com.example.demo.repositories.KartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class KartServicesTest {

    @Mock
    private KartRepository kartRepository;

    @InjectMocks
    private KartServices kartServices;

    private KartEntity kart;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        kart = KartEntity.builder()
                .id(1L)
                .code("KART123")
                .status("available")
                .build();
    }

    @Test
    public void testSaveKart() {
        when(kartRepository.save(kart)).thenReturn(kart);
        KartEntity saved = kartServices.saveKart(kart);
        assertEquals("KART123", saved.getCode());
    }

    @Test
    public void testGetAllKarts() {
        when(kartRepository.findAll()).thenReturn(Arrays.asList(kart));
        List<KartEntity> karts = kartServices.getAllKarts();
        assertEquals(1, karts.size());
    }

    @Test
    public void testGetKartById() {
        when(kartRepository.findById(1L)).thenReturn(Optional.of(kart));
        Optional<KartEntity> result = kartServices.getKartById(1L);
        assertTrue(result.isPresent());
        assertEquals("KART123", result.get().getCode());
    }

    @Test
    public void testGetKartByCode() {
        when(kartRepository.findByCode("KART123")).thenReturn(Optional.of(kart));
        Optional<KartEntity> result = kartServices.getKartByCode("KART123");
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    public void testExistsByCode() {
        when(kartRepository.existsByCode("KART123")).thenReturn(true);
        assertTrue(kartServices.existsByCode("KART123"));
    }

    @Test
    public void testGetKartsByStatus() {
        when(kartRepository.findByStatus("available")).thenReturn(Arrays.asList(kart));
        List<KartEntity> karts = kartServices.getKartsByStatus("available");
        assertEquals(1, karts.size());
    }

    @Test
    public void testUpdateKart() {
        when(kartRepository.save(kart)).thenReturn(kart);
        KartEntity updated = kartServices.updateKart(kart);
        assertEquals("KART123", updated.getCode());
    }

    @Test
    public void testDeleteKart() throws Exception {
        doNothing().when(kartRepository).deleteById(1L);
        boolean result = kartServices.deleteKart(1L);
        assertTrue(result);
        verify(kartRepository, times(1)).deleteById(1L);
    }
}
