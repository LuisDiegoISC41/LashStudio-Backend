package com.lashstudio.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lashstudio.entity.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, UUID> {
}