package com.example.demo.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String name;
    private String email;

    @Column(unique = true, nullable = false)
    private String rut;
    private String phoneNumber;
    private LocalDate dateOfBirth;

    @Column(name = "visit_count")
    private Integer visitCount;

    // Getters
    public String getRut() {
        return rut;
    }

    public String getFullName() {
        return name; // <-- Cambiado
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phoneNumber; // <-- Cambiado
    }

    public LocalDate getBirthday() {
        return dateOfBirth; // <-- Cambiado
    }

    public Integer getVisitCount() {
        return visitCount;
    }

    // Setters
    public void setRut(String rut) {
        this.rut = rut;
    }

    public void setFullName(String fullName) {
        this.name = fullName; // <-- Cambiado
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phoneNumber = phone; // <-- Cambiado
    }

    public void setBirthday(LocalDate birthday) {
        this.dateOfBirth = birthday; // <-- Cambiado
    }

    public void setVisitCount(Integer visitCount) {
        this.visitCount = visitCount;
    }
}
