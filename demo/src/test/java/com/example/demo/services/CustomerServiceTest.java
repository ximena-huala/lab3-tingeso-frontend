package com.example.demo.services;

import com.example.demo.entities.CustomerEntity;
import com.example.demo.repositories.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServices customerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCustomers() {
        CustomerEntity c1 = new CustomerEntity();
        c1.setId(1L);
        c1.setFullName("Juan Pérez");

        CustomerEntity c2 = new CustomerEntity();
        c2.setId(2L);
        c2.setFullName("María López");

        when(customerRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        List<CustomerEntity> customers = customerService.getAllCustomers();

        assertEquals(2, customers.size());
        assertEquals("Juan Pérez", customers.get(0).getFullName());
    }

    @Test
    void testGetCustomerById() {
        CustomerEntity customer = new CustomerEntity();
        customer.setId(1L);
        customer.setFullName("Pedro Test");

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        Optional<CustomerEntity> result = customerService.getCustomerById(1L);

        assertTrue(result.isPresent());
        assertEquals("Pedro Test", result.get().getFullName());
    }

    @Test
    void testCreateCustomer() {
        CustomerEntity customer = new CustomerEntity();
        customer.setFullName("Nuevo Cliente");

        when(customerRepository.save(customer)).thenReturn(customer);

        CustomerEntity saved = customerService.saveCustomer(customer);

        assertNotNull(saved);
        assertEquals("Nuevo Cliente", saved.getFullName());
        verify(customerRepository, times(1)).save(customer);
    }

    @Test
    void testUpdateCustomer() {
        CustomerEntity customer = new CustomerEntity();
        customer.setId(1L);
        customer.setFullName("Nombre Actualizado");

        when(customerRepository.save(customer)).thenReturn(customer);

        CustomerEntity result = customerService.updateCustomer(customer);

        assertEquals("Nombre Actualizado", result.getFullName());
        verify(customerRepository).save(customer);
    }

    @Test
    void testDeleteCustomer() throws Exception {
        Long id = 1L;
        doNothing().when(customerRepository).deleteById(id);

        boolean deleted = customerService.deleteCustomer(id);

        assertTrue(deleted);
        verify(customerRepository, times(1)).deleteById(id);
    }
}
