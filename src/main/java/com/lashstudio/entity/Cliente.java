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
@Table(name = "Cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID_Cliente")
    private UUID id;

    @Column(name = "Nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "Apellido_Paterno", length = 50)
    private String apellidoPaterno;

    @Column(name = "Apellido_Materno", length = 50)
    private String apellidoMaterno;

    @Column(name = "Telefono", length = 10)
    private String telefono;

    @Column(name = "Correo", unique = true, nullable = false, length = 50)
    private String correo;

    @Column(name = "Password", nullable = false, length = 100)
    private String password;
}
