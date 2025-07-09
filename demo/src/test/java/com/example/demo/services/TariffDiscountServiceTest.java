package com.example.demo.services;

import com.example.demo.entities.TariffDiscountEntity;
import com.example.demo.repositories.TariffDiscountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TariffDiscountServiceTest {

    @InjectMocks
    private TariffDiscountService service;

    @Mock
    private TariffDiscountRepository repository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAll() {
        List<TariffDiscountEntity> mockList = List.of(
                new TariffDiscountEntity(1L, "discount", "10% off", 0.1f, "15 minutes"),
                new TariffDiscountEntity(2L, "tariff", "5000 per ride", 5000f, "10 minutes")
        );
        when(repository.findAll()).thenReturn(mockList);

        List<TariffDiscountEntity> result = service.getAll();
        assertEquals(2, result.size());
        verify(repository).findAll();
    }

    @Test
    void testSave() {
        TariffDiscountEntity entity = new TariffDiscountEntity(null, "discount", "5% off", 0.05f, "20 minutes");
        TariffDiscountEntity saved = new TariffDiscountEntity(1L, "discount", "5% off", 0.05f, "20 minutes");
        when(repository.save(entity)).thenReturn(saved);

        TariffDiscountEntity result = service.save(entity);
        assertNotNull(result.getId());
        assertEquals("discount", result.getType());
        verify(repository).save(entity);
    }

    @Test
    void testGetByIdFound() {
        TariffDiscountEntity entity = new TariffDiscountEntity(1L, "tariff", "3000 per lap", 3000f, "10 minutes");
        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        Optional<TariffDiscountEntity> result = service.getById(1L);
        assertTrue(result.isPresent());
        assertEquals("tariff", result.get().getType());
        verify(repository).findById(1L);
    }

    @Test
    void testGetByIdNotFound() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        Optional<TariffDiscountEntity> result = service.getById(999L);
        assertFalse(result.isPresent());
        verify(repository).findById(999L);
    }

    @Test
    void testDeleteById() {
        Long idToDelete = 1L;

        service.deleteById(idToDelete);

        verify(repository).deleteById(idToDelete);
    }
}
