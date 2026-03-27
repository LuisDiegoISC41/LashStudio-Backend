package com.lashstudio.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration}")
    private long expiration;

    private Key key() {
        byte[] keyBytes = secret.getBytes();
        System.out.println("🔑 Longitud de la clave secreta: " + keyBytes.length + " bytes");
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        try {
            String username = extractClaim(token, Claims::getSubject);
            System.out.println("📧 Username extraído: " + username);
            return username;
        } catch (Exception e) {
            System.out.println("❌ Error extrayendo username: " + e.getMessage());
            throw e;
        }
    }

    public boolean isTokenValid(String token, UserDetails user) {
        try {
            String username = extractUsername(token);
            boolean isExpired = isExpired(token);
            boolean usernameMatch = username.equals(user.getUsername());
            
            System.out.println("🔍 Validando token:");
            System.out.println("   - Username token: " + username);
            System.out.println("   - Username user: " + user.getUsername());
            System.out.println("   - Match: " + usernameMatch);
            System.out.println("   - Expired: " + isExpired);
            
            boolean isValid = usernameMatch && !isExpired;
            System.out.println("   - Token válido: " + isValid);
            
            return isValid;
        } catch (Exception e) {
            System.out.println("❌ Error en isTokenValid: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private boolean isExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        Date now = new Date();
        boolean expired = expiration.before(now);
        System.out.println("📅 Fecha expiración: " + expiration);
        System.out.println("📅 Fecha actual: " + now);
        System.out.println("⏰ Token expirado: " + expired);
        return expired;
    }

    private <T> T extractClaim(String token, Function<Claims, T> fn) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
            return fn.apply(claims);
        } catch (Exception e) {
            System.out.println("❌ Error extrayendo claims: " + e.getMessage());
            throw e;
        }
    }
}