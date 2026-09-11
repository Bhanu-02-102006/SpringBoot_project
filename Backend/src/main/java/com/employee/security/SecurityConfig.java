package com.employee.security;

import com.employee.entity.User;
import com.employee.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF because this is a stateless REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS and explicitly use our CORS configuration
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Allow browser CORS preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Change password requires authentication
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/auth/change-password"
                        ).authenticated()

                        // Login, registration, forgot password, etc.
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

                        // Employee management - Manager only
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

                        // Reports - Manager only
                        .requestMatchers(
                                "/reports/**"
                        ).hasRole("MANAGER")

                        // Dashboard - Manager only
                        .requestMatchers(
                                "/dashboard/**"
                        ).hasRole("MANAGER")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // JWT filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * Loads users from the database for Spring Security authentication.
     */
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

            // Ensure Spring Security receives ROLE_MANAGER / ROLE_EMPLOYEE
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

    /**
     * Password encoder used for storing passwords securely.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication manager used by the authentication service.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    /**
     * Global CORS configuration.
     *
     * Allows:
     * - Local Vite development
     * - Production Vercel frontend
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // Allowed frontend origins
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://spring-boot-project-gray.vercel.app"
        ));

        // Allowed HTTP methods
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        // Allow all request headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials such as Authorization headers/cookies
        configuration.setAllowCredentials(true);

        // Register configuration for every endpoint
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}