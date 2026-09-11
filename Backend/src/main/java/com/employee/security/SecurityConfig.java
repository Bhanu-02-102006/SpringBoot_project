package com.employee.security;

import com.employee.entity.User;
import com.employee.repository.UserRepository;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // Disable CSRF for stateless REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS using CorsConfigurationSource bean from CorsConfig
                .cors(Customizer.withDefaults())

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Change password
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/auth/change-password"
                        ).authenticated()

                        // Login / Register / Forgot password
                        .requestMatchers(
                                "/auth/**"
                        ).permitAll()

                        // Employee profile
                        .requestMatchers(
                                HttpMethod.GET,
                                "/employees/me"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/employees/me/profile"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        // Employee by ID
                        .requestMatchers(
                                HttpMethod.GET,
                                "/employees/{id}"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/employees/{id}"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        // Employee management
                        .requestMatchers(
                                "/employees",
                                "/employees/**"
                        ).hasRole("MANAGER")

                        // Attendance
                        .requestMatchers(
                                "/attendance/checkin",
                                "/attendance/checkout",
                                "/attendance/my-history",
                                "/attendance/today"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        .requestMatchers(
                                "/attendance/all",
                                "/attendance/search"
                        ).hasRole("MANAGER")

                        // Leave requests
                        .requestMatchers(
                                HttpMethod.POST,
                                "/leaves"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        .requestMatchers(
                                "/leaves/my-requests"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        .requestMatchers(
                                "/leaves/pending",
                                "/leaves/all",
                                "/leaves/**"
                        ).hasRole("MANAGER")

                        // Notifications
                        .requestMatchers(
                                "/notifications/**"
                        ).hasAnyRole("MANAGER", "EMPLOYEE")

                        // Reports
                        .requestMatchers(
                                "/reports/**"
                        ).hasRole("MANAGER")

                        // Dashboard
                        .requestMatchers(
                                "/dashboard/**"
                        ).hasRole("MANAGER")

                        // Everything else
                        .anyRequest().authenticated()
                )

                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(
            UserRepository userRepository
    ) {

        return username -> {

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "User not found: " + username
                            )
                    );

            String role = user.getRole();

            if (role != null && !role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }

            return org.springframework.security.core.userdetails.User
                    .builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .authorities(
                            role != null
                                    ? role
                                    : "ROLE_EMPLOYEE"
                    )
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration(
            JwtAuthenticationFilter filter
    ) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}