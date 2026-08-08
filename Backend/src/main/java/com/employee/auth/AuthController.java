package com.employee.auth;

import com.employee.entity.User;
import com.employee.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody com.employee.dto.RegisterRequest request) {
        authService.registerEmployee(request);
        return "Registration successful";
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String token = authService.login(
                    request.getUsername(),
                    request.getPassword(),
                    request.getPortal());
            return org.springframework.http.ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/change-password")
    public String changePassword(java.security.Principal principal,
                                 @RequestBody java.util.Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        authService.changePassword(principal.getName(), currentPassword, newPassword);
        return "Password changed successfully";
    }

}