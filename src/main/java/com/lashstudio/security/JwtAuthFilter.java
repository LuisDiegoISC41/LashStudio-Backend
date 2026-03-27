package com.lashstudio.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService             jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest  request,
            HttpServletResponse response,
            FilterChain         chain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        System.out.println("🔍 JwtAuthFilter ejecutándose para: " + method + " " + path);
        
        // Allow public endpoints
        if (path.startsWith("/api/auth/") || 
            path.startsWith("/api/clientes/register") || 
            path.startsWith("/api/debug/") ||
            (method.equals("GET") && path.startsWith("/api/servicios"))) {  // ← AGREGAR ESTA LÍNEA
            System.out.println("📢 Endpoint público, continuando sin autenticación");
            chain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        System.out.println("📋 Authorization header: " + (authHeader != null ? authHeader.substring(0, Math.min(authHeader.length(), 50)) : "null"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ No hay token Bearer, retornando 401");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"No authorization token provided\"}");
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("🔑 Token recibido (primeros 50 chars): " + token.substring(0, Math.min(token.length(), 50)) + "...");
        
        try {
            String username = jwtService.extractUsername(token);
            System.out.println("👤 Username extraído del token: " + username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userDetailsService.loadUserByUsername(username);
                System.out.println("✅ Usuario cargado desde BD: " + user.getUsername());
                System.out.println("🎭 Roles del usuario: " + user.getAuthorities());

                boolean isValid = jwtService.isTokenValid(token, user);
                System.out.println("🔒 Token válido: " + isValid);
                
                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅✅✅ Autenticación ESTABLECIDA para: " + username);
                    System.out.println("🎭 Authorities en contexto: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                } else {
                    System.out.println("❌ Token inválido para: " + username);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Invalid token\"}");
                    return;
                }
            }
        } catch (Exception e) {
            System.out.println("❌ ERROR procesando token: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token processing error: " + e.getMessage() + "\"}");
            return;
        }

        chain.doFilter(request, response);
    }
}