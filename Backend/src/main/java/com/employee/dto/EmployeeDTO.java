package com.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EmployeeDTO {

    private Integer id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @Email(message = "Enter a valid email")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @Positive(message = "Salary must be greater than zero")
    private Double salary;

    @NotBlank(message = "Department cannot be empty")
    private String department;

    private String phone;

    private String joiningDate;

    private String address;

    private String profilePicture;
}