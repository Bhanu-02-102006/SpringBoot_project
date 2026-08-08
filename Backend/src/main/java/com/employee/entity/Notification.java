package com.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String employeeEmail;

    @Column(nullable = false)
    private String message;

    private LocalDateTime timestamp;

    private boolean isRead;
}
