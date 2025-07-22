package com.evoting.evoting_backend.controller;

import com.evoting.evoting_backend.model.Admin;
import com.evoting.evoting_backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AdminRepository adminRepo;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Admin admin) {
        Optional<Admin> existing = adminRepo.findByEmail(admin.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }

        adminRepo.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin loginReq) {
        Optional<Admin> adminOpt = adminRepo.findByEmail(loginReq.getEmail());
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(loginReq.getPassword())) {
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
