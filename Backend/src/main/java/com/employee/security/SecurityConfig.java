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
import org.springframework.web.cors.CorsConfigurationSource;
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
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.PUT, "/auth/change-password").authenticated()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/employees/me").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/employees/me/profile").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/employees/{id}").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PUT, "/employees/{id}").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers("/employees", "/employees/**").hasRole("MANAGER")
                        .requestMatchers("/attendance/checkin", "/attendance/checkout", "/attendance/my-history", "/attendance/today").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers("/attendance/all", "/attendance/search").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.POST, "/leaves").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers("/leaves/my-requests").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers("/leaves/pending", "/leaves/all", "/leaves/**").hasRole("MANAGER")
                        .requestMatchers("/notifications/**").hasAnyRole("MANAGER", "EMPLOYEE")
                        .requestMatchers("/reports/**").hasRole("MANAGER")
                        .requestMatchers("/dashboard/**").hasRole("MANAGER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

            String role = user.getRole();
            if (role != null && !role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .authorities(role != null ? role : "ROLE_EMPLOYEE")
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://spring-boot-project-gray.vercel.app"
    ));

    configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
    ));

    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
}
}