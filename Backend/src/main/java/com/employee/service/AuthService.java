package com.employee.service;

import com.employee.entity.User;
import com.employee.entity.Employee;
import com.employee.repository.UserRepository;
import com.employee.repository.EmployeeRepository;
import com.employee.security.JwtService;
import com.employee.dto.RegisterRequest;
import com.employee.exception.EmailAlreadyExistsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("ROLE_EMPLOYEE");
        }
        return userRepository.save(user);
    }

    @Transactional
    public void registerEmployee(RegisterRequest request) {
        if (userRepository.findByUsername(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered in system.");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Employee profile with this email already exists.");
        }

        // Create User record
        User user = new User();
        user.setUsername(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_EMPLOYEE");
        userRepository.save(user);

        // Create Employee record
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setSalary(50000.0); // Default base starting salary
        employeeRepository.save(employee);
    }

    public String login(String username, String password, String portal) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String role = user.getRole();
        if (role != null && !role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        if ("MANAGER".equalsIgnoreCase(portal)) {
            if (!"ROLE_MANAGER".equals(role)) {
                throw new RuntimeException("This account is not a Manager account. Please use Employee Portal.");
            }
        } else if ("EMPLOYEE".equalsIgnoreCase(portal)) {
            if ("ROLE_MANAGER".equals(role)) {
                throw new RuntimeException("This account is a Manager account. Please use Manager Login.");
            }
        }

        return jwtService.generateToken(user.getUsername(), user.getRole());
    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
