package com.employee.security;

import com.employee.entity.User;
import com.employee.entity.Employee;
import com.employee.repository.UserRepository;
import com.employee.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Manager
        if (userRepository.findByUsername("manager@technova.com").isEmpty()) {
            User manager = new User();
            manager.setUsername("manager@technova.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setRole("ROLE_MANAGER");
            userRepository.save(manager);
            System.out.println("Seeded Manager User: manager@technova.com / manager123");
        }

        // Seed Employee User
        if (userRepository.findByUsername("employee@technova.com").isEmpty()) {
            User employeeUser = new User();
            employeeUser.setUsername("employee@technova.com");
            employeeUser.setPassword(passwordEncoder.encode("employee123"));
            employeeUser.setRole("ROLE_EMPLOYEE");
            userRepository.save(employeeUser);
            System.out.println("Seeded Employee User: employee@technova.com / employee123");
        }

        // Seed corresponding Employee profile
        if (!employeeRepository.existsByEmail("employee@technova.com")) {
            Employee emp = new Employee();
            emp.setName("Jane Doe");
            emp.setEmail("employee@technova.com");
            emp.setSalary(75000.0);
            emp.setDepartment("Engineering");
            emp.setPhone("+1-555-0199");
            emp.setJoiningDate("2025-06-15");
            emp.setAddress("123 Tech Drive, Silicon Valley, CA");
            employeeRepository.save(emp);
            System.out.println("Seeded Employee Profile for employee@technova.com");
        }
    }
}
