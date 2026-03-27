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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "${app.cors.allowed-origins}")
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

            return ResponseEntity.ok(new LoginResponse(token, role, correo, nombre, id));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas.");
        }
    }
    @GetMapping("/verify")
    public ResponseEntity<?> verify(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).body(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of(
            "authenticated", true,
            "username", auth.getName(),
            "roles", auth.getAuthorities().stream().map(a -> a.getAuthority()).toList()
        ));
    }
}
