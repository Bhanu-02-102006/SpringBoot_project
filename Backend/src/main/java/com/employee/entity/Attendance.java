package com.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String employeeEmail;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private LocalDate date;

    private String status; // PRESENT, LATE, ABSENT
}
