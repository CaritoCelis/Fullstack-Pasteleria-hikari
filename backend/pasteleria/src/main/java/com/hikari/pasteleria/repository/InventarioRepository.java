package com.hikari.pasteleria.repository;

import com.hikari.pasteleria.models.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> { }
