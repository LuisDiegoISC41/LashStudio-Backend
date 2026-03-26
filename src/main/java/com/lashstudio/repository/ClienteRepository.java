package com.lashstudio.repository;

import com.lashstudio.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
    Optional<Cliente> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
