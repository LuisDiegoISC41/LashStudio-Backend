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

        String authHeader = request.getHeader("Authorization");

        System.out.println("🔍 JwtAuthFilter - URL: " + request.getRequestURI());
        System.out.println("🔍 JwtAuthFilter - Auth Header: " + (authHeader != null ? "Presente" : "Ausente"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ No hay token Bearer, continuando sin autenticación");
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("🔑 Token recibido (primeros 20 chars): " + token.substring(0, Math.min(20, token.length())) + "...");
        
        String username = jwtService.extractUsername(token);
        System.out.println("👤 Username extraído del token: " + username);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("🔍 Cargando UserDetails para: " + username);
            UserDetails user = userDetailsService.loadUserByUsername(username);
            System.out.println("✅ UserDetails cargado: " + user.getUsername());
            System.out.println("✅ Autoridades en UserDetails: " + user.getAuthorities());

            if (jwtService.isTokenValid(token, user)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                System.out.println("✅✅✅ AUTENTICACIÓN EXITOSA para: " + username);
                System.out.println("✅✅✅ Roles asignados: " + user.getAuthorities());
            } else {
                System.out.println("❌ Token inválido para usuario: " + username);
            }
        } else {
            System.out.println("⚠️ Username es null o ya hay autenticación en contexto");
        }

        System.out.println("=========================================");
        chain.doFilter(request, response);
    }
}