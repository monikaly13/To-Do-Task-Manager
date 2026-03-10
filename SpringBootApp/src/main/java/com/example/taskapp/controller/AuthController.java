package com.example.taskapp.controller;

import com.example.taskapp.dto.AuthResponse;
import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.SignupRequest;
import com.example.taskapp.model.User;
import com.example.taskapp.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        var userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(new AuthResponse(false, "User not found. Please sign up first."));
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.ok(new AuthResponse(false, "Invalid password."));
        }
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        return ResponseEntity.ok(new AuthResponse(true, "Login successful", user.getId(), user.getUsername()));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpSession session) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.ok(new AuthResponse(false, "Username already exists."));
        }
        String hash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getUsername(), hash);
        user = userRepository.save(user);
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        return ResponseEntity.ok(new AuthResponse(true, "Signup successful", user.getId(), user.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new AuthResponse(true, "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        if (userId == null || username == null) {
            return ResponseEntity.ok(new AuthResponse(false, "Not logged in"));
        }
        return ResponseEntity.ok(new AuthResponse(true, "Logged in", userId, username));
    }
}
