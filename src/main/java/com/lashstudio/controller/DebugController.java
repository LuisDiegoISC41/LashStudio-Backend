package com.lashstudio.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/public-test")
    public ResponseEntity<?> publicTest() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Public endpoint works",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/auth-check")
    public ResponseEntity<?> authCheck(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of(
                "authenticated", false,
                "message", "Not authenticated"
            ));
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "username", userDetails.getUsername(),
            "roles", userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .toList(),
            "message", "Authentication successful"
        ));
    }
}