package com.lashstudio.entity;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
 
@Entity
@Table(name = "CITA")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cita {
 
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID_Cita")
    private UUID id;
 
    @Column(name = "Fecha")
    private LocalDate fecha;
 
    @Column(name = "Hora")
    private LocalTime hora;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Cliente")
    private Cliente cliente;
 
    /** Nombre libre cuando el admin agenda sin cliente registrado */
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Servicio")
    private Servicio servicio;
}