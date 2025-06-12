package com.example.demo.controllers;

import com.example.demo.entities.CustomerEntity;
import com.example.demo.services.CustomerServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CustomerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CustomerServices customerServices;

    @InjectMocks
    private CustomerController customerController;

    @BeforeEach
    void setup() {
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(customerController).build();
    }

    @Test
    void testGetAllCustomers() throws Exception {
        List<CustomerEntity> list = new ArrayList<>();
        CustomerEntity c = new CustomerEntity();
        c.setFullName("Test Cliente");
        list.add(c);

        when(customerServices.getAllCustomers()).thenReturn(list);

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("Test Cliente"));
    }

    @Test
    void testGetCustomerByIdFound() throws Exception {
        CustomerEntity c = new CustomerEntity();
        c.setId(1L);
        c.setFullName("Cliente Uno");

        when(customerServices.getCustomerById(1L)).thenReturn(Optional.of(c));

        mockMvc.perform(get("/api/customers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Cliente Uno"));
    }

    @Test
    void testGetCustomerByIdNotFound() throws Exception {
        when(customerServices.getCustomerById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/customers/99"))
                .andExpect(status().isNotFound());
    }
}
