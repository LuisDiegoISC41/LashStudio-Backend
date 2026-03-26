package com.lashstudio.dto;

import com.lashstudio.entity.Cita;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CitaResponse {

    private UUID      id;
    private LocalDate fecha;
    private LocalTime hora;
    private String    clienteNombre;
    private UUID      clienteId;
    private String    servicioNombre;

    public static CitaResponse from(Cita cita) {
        CitaResponse r = new CitaResponse();
        r.setId(cita.getId());
        r.setFecha(cita.getFecha());
        r.setHora(cita.getHora());

        if (cita.getCliente() != null) {
            r.setClienteId(cita.getCliente().getId());
            r.setClienteNombre(
                cita.getCliente().getNombre() + " " + cita.getCliente().getApellidoPaterno()
            );
        }
        if (cita.getServicio() != null) {
            r.setServicioNombre(cita.getServicio().getNombre());
        }
        return r;
    }
}
