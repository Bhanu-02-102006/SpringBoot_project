package com.employee.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Name cannot be empty")
    @Column(nullable = false)
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email cannot be empty")
    @Column(nullable = false, unique = true)
    private String email;

    @Positive(message = "Salary must be greater than zero")
    @Column(nullable = false)
    private Double salary;

    @NotBlank(message = "Department cannot be empty")
    @Column(nullable = false)
    private String department;

    private String phone;

    private String joiningDate;

    private String address;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;
}