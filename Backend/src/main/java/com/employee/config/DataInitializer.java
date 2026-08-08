package com.employee.config;

import com.employee.entity.User;
import com.employee.entity.Employee;
import com.employee.repository.UserRepository;
import com.employee.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initManagerAccount(UserRepository userRepository,
                                                 EmployeeRepository employeeRepository,
                                                 PasswordEncoder passwordEncoder) {
        return args -> {
            String managerEmail = "manager@technova.com";

            // Check and create Manager User
            if (!userRepository.existsByUsername(managerEmail)) {
                User manager = new User();
                manager.setUsername(managerEmail);
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setRole("ROLE_MANAGER");
                userRepository.save(manager);
                System.out.println("Default manager user created.");
            }

            // Check and create Manager Employee Profile
            if (!employeeRepository.existsByEmail(managerEmail)) {
                Employee employee = new Employee();
                employee.setName("System Manager");
                employee.setEmail(managerEmail);
                employee.setDepartment("Management");
                employee.setSalary(100000.0);
                employee.setPhone("9876543210");
                employee.setAddress("TechNova Head Office");
                employee.setJoiningDate(LocalDate.now().toString());
                employeeRepository.save(employee);
                System.out.println("Default manager employee profile created.");
            }
        };
    }
}
