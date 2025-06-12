package com.example.demo.repositories;

import com.example.demo.entities.CustomerEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest

class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void testSaveAndFindByRut() {
        // Given
        CustomerEntity customer = new CustomerEntity();
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customerRepository.save(customer);

        // When
        Optional<CustomerEntity> found = customerRepository.findByRut("12345678-9");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("juan@example.com");
    }

    @Test
    void testSaveAndFindByEmail() {
        // Given
        CustomerEntity customer = new CustomerEntity();
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customerRepository.save(customer);

        // When
        Optional<CustomerEntity> found = customerRepository.findByEmail("juan@example.com");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getRut()).isEqualTo("12345678-9");
    }

    @Test
    void testExistsByRutAndEmail() {
        // Given
        CustomerEntity customer = new CustomerEntity();
        customer.setRut("12345678-9");
        customer.setEmail("juan@example.com");
        customerRepository.save(customer);

        // When
        boolean existsByRut = customerRepository.existsByRut("12345678-9");
        boolean existsByEmail = customerRepository.existsByEmail("juan@example.com");

        // Then
        assertThat(existsByRut).isTrue();
        assertThat(existsByEmail).isTrue();
    }

}

