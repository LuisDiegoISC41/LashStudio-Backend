package com.lashstudio.controller;

import com.lashstudio.dto.CitaRequest;
import com.lashstudio.dto.CitaResponse;
import com.lashstudio.entity.Cita;
import com.lashstudio.entity.Cliente;
import com.lashstudio.entity.Servicio;
import com.lashstudio.repository.CitaRepository;
import com.lashstudio.repository.ClienteRepository;
import com.lashstudio.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
//@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class CitaController {

    private final CitaRepository      citaRepository;
    private final ClienteRepository   clienteRepository;
    private final ServicioRepository  servicioRepository;

    /** Citas del día — usuario autenticado */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<CitaResponse> getByFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return citaRepository.findByFecha(fecha).stream()
                .map(CitaResponse::from)
                .toList();
    }

    /** Citas de un mes completo — usuario autenticado (calendario) */
    @GetMapping("/mes")
    @PreAuthorize("isAuthenticated()")
    public List<CitaResponse> getByMes(@RequestParam String mes) {
        YearMonth ym    = YearMonth.parse(mes);
        LocalDate start = ym.atDay(1);
        LocalDate end   = ym.atEndOfMonth();
        return citaRepository.findByFechaBetween(start, end).stream()
                .map(CitaResponse::from)
                .toList();
    }

    /** Todas las citas de un cliente — usuario autenticado */
    @GetMapping("/cliente/{id}")
    @PreAuthorize("isAuthenticated()")
    public List<CitaResponse> getByCliente(@PathVariable UUID id) {
        return citaRepository.findByClienteId(id).stream()
                .map(CitaResponse::from)
                .toList();
    }

    /** Reservar cita — usuario autenticado */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(@RequestBody CitaRequest request) {
        if (citaRepository.existsByFechaAndHora(request.getFecha(), request.getHora())) {
            return ResponseEntity.badRequest().body("Horario no disponible.");
        }

        Cliente  cliente  = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Servicio servicio = servicioRepository.findById(request.getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        Cita cita = Cita.builder()
                .fecha(request.getFecha())
                .hora(request.getHora())
                .cliente(cliente)
                .servicio(servicio)
                .build();

        return ResponseEntity.ok(CitaResponse.from(citaRepository.save(cita)));
    }

    /** Reagendar cita — usuario autenticado */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> reagendar(@PathVariable UUID id, @RequestBody CitaRequest request) {
        Cita cita = citaRepository.findById(id).orElse(null);
        if (cita == null) return ResponseEntity.notFound().build();
        if (citaRepository.existsByFechaAndHoraAndIdNot(request.getFecha(), request.getHora(), id)) {
            return ResponseEntity.badRequest().body("Horario no disponible.");
        }
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());
        return ResponseEntity.ok(CitaResponse.from(citaRepository.save(cita)));
    }

    /** Cancelar cita — admin o dueño de la cita */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable UUID id, Authentication authentication) {
        if (!citaRepository.existsById(id)) return ResponseEntity.notFound().build();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !citaRepository.existsByIdAndClienteCorreo(id, authentication.getName())) {
            return ResponseEntity.status(403).build();
        }
        citaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
