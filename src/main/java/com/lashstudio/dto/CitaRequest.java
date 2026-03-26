package com.lashstudio.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CitaRequest {
    private LocalDate fecha;
    private LocalTime hora;
    private UUID idCliente;
    private UUID idServicio;
}
