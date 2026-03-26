package com.lashstudio.repository;

import com.lashstudio.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AdminRepository extends JpaRepository<Admin, UUID> {
    Optional<Admin> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
