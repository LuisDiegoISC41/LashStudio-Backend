package com.lashstudio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "Admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID_Admin")
    private UUID id;

    @Column(name = "Nombre", length = 50)
    private String nombre;

    @Column(name = "Apellido_Paterno", length = 20)
    private String apellidoPaterno;

    @Column(name = "Apellido_Materno", length = 20)
    private String apellidoMaterno;

    @Column(name = "Correo", unique = true, nullable = false, length = 80)
    private String correo;

    @Column(name = "Password", length = 100)
    private String password;
}
