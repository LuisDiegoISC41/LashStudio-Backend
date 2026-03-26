package com.lashstudio.controller;

import com.lashstudio.entity.Cliente;
import com.lashstudio.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder   passwordEncoder;

    /** Lista de clientes — solo admin */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Cliente> getAll() {
        return clienteRepository.findAll();
    }

    /** Registro de nuevo cliente — público */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Cliente cliente) {
        if (clienteRepository.existsByCorreo(cliente.getCorreo())) {
            return ResponseEntity.badRequest().body("El correo ya está registrado.");
        }
        cliente.setPassword(passwordEncoder.encode(cliente.getPassword()));
        return ResponseEntity.ok(clienteRepository.save(cliente));
    }

    /** Actualizar perfil — usuario autenticado */
    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> update(@PathVariable java.util.UUID id, @RequestBody Cliente body) {
        return clienteRepository.findById(id).map(c -> {
            c.setNombre(body.getNombre());
            c.setApellidoPaterno(body.getApellidoPaterno());
            c.setApellidoMaterno(body.getApellidoMaterno());
            c.setTelefono(body.getTelefono());
            if (body.getCorreo() != null && !body.getCorreo().isBlank()) {
                c.setCorreo(body.getCorreo());
            }
            if (body.getPassword() != null && !body.getPassword().isBlank()) {
                c.setPassword(passwordEncoder.encode(body.getPassword()));
            }
            return ResponseEntity.ok(clienteRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }
}
