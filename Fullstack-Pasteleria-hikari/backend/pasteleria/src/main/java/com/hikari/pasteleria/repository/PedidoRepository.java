package com.hikari.pasteleria.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hikari.pasteleria.models.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    
    // Agregar estos métodos (usa "Status" porque tu campo se llama "status")
    Long countByStatus(String status);
}