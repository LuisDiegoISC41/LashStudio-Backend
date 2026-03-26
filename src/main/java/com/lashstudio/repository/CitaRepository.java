package com.lashstudio.repository;

import com.lashstudio.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface CitaRepository extends JpaRepository<Cita, UUID> {
    List<Cita> findByFecha(LocalDate fecha);
    List<Cita> findByFechaBetween(LocalDate start, LocalDate end);
    List<Cita> findByClienteId(UUID clienteId);
    boolean existsByFechaAndHora(LocalDate fecha, LocalTime hora);
    boolean existsByFechaAndHoraAndIdNot(LocalDate fecha, LocalTime hora, UUID id);
    boolean existsByIdAndClienteCorreo(UUID id, String correo);
}
