package com.lashstudio.controller;

import com.lashstudio.dto.LoginRequest;
import com.lashstudio.dto.LoginResponse;
import com.lashstudio.entity.Admin;
import com.lashstudio.entity.Cliente;
import com.lashstudio.repository.AdminRepository;
import com.lashstudio.repository.ClienteRepository;
import com.lashstudio.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService            jwtService;
    private final AdminRepository       adminRepository;
    private final ClienteRepository     clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token  = jwtService.generateToken(userDetails);
            String correo = userDetails.getUsername();
            String role   = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "").toLowerCase())
                .orElse("cliente");

            String nombre;
            String id;
            java.util.Optional<Admin> adminOpt = adminRepository.findByCorreo(correo);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                nombre = admin.getNombre() != null ? admin.getNombre() : "Admin";
                id     = admin.getId().toString();
            } else {
                Cliente cliente = clienteRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                nombre = cliente.getNombre();
                id     = cliente.getId().toString();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", role);
            response.put("correo", correo);
            response.put("nombre", nombre);
            response.put("id", id);
            
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Credenciales incorrectas");
            error.put("message", "Correo o contraseña inválidos");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error interno");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}