package com.hikari.pasteleria.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hikari.pasteleria.models.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Cambiado a Long
    List<Pedido> findByUsuarioId(Long usuarioId);
}
