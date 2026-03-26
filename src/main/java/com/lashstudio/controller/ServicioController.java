package com.lashstudio.controller;

import com.lashstudio.entity.Servicio;
import com.lashstudio.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class ServicioController {

    private final ServicioRepository servicioRepository;

    /** Público — cualquiera puede ver los servicios */
    @GetMapping
    public List<Servicio> getAll() {
        return servicioRepository.findAll();
    }

    /** Solo admin */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> create(@RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioRepository.save(servicio));
    }

    /** Solo admin */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> update(@PathVariable UUID id, @RequestBody Servicio body) {
        return servicioRepository.findById(id).map(s -> {
            s.setNombre(body.getNombre());
            s.setDescripcion(body.getDescripcion());
            s.setPrecio(body.getPrecio());
            return ResponseEntity.ok(servicioRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Solo admin */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!servicioRepository.existsById(id)) return ResponseEntity.notFound().build();
        servicioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
