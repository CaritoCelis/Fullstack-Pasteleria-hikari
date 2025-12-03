package com.hikari.pasteleria.repository;

import com.hikari.pasteleria.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> { }
