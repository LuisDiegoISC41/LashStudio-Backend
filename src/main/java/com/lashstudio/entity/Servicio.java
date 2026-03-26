package com.lashstudio.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SERVICIO")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID_Servicio")
    private UUID id;

    @Column(name = "Nombre", length = 50)
    private String nombre;

    @Column(name = "Descripcion", length = 150)
    private String descripcion;

    @Column(name = "Precio")
    private Integer precio;
}
