package com.hikari.pasteleria.repository;

import com.hikari.pasteleria.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioId(String usuarioId);

}