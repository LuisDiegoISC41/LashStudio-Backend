package com.lashstudio.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<Map<String, Object>> publicTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Public endpoint works");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/auth-check")
    public ResponseEntity<Map<String, Object>> authCheck(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            response.put("authenticated", false);
            response.put("message", "Not authenticated");
            return ResponseEntity.status(401).body(response);
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        response.put("authenticated", true);
        response.put("username", userDetails.getUsername());
        response.put("roles", userDetails.getAuthorities().stream()
            .map(a -> a.getAuthority())
            .collect(Collectors.toList()));
        response.put("message", "Authentication successful");
        
        return ResponseEntity.ok(response);
    }
}