package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.dto.OrderRequest;
import com.hikari.pasteleria.models.*;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.repository.ProductoRepository;
import com.hikari.pasteleria.service.PedidoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final UsuarioRepository usuarioRepo;
    private final ProductoRepository productoRepo;
    private final PedidoService pedidoService;

    public PedidoController(UsuarioRepository usuarioRepo, ProductoRepository productoRepo, PedidoService pedidoService) {
        this.usuarioRepo = usuarioRepo;
        this.productoRepo = productoRepo;
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader("Authorization") String authHeader,
                                    @RequestBody OrderRequest orderReq) {

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No autorizado");
        }

        // Obtener usuario autenticado desde el SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepo.findByUsername(username).orElseThrow();

        // Convertir items del request en entidades OrderItem
        List<OrderItem> items = new ArrayList<>();
        orderReq.items.forEach(itReq -> {
            Producto p = productoRepo.findById(itReq.productId).orElseThrow();
            OrderItem it = new OrderItem();
            it.setProducto(p);
            it.setQuantity(itReq.quantity);
            it.setPrice(p.getPrice());
            items.add(it);
        });

        // Crear pedido
        Pedido pedido = pedidoService.createPedido(usuario, items);

        return ResponseEntity.ok(
            Map.of(
                "pedidoId", pedido.getId(),
                "total", pedido.getTotal(),
                "status", pedido.getStatus()
            )
        );
    }

    @GetMapping
    public ResponseEntity<?> listMyOrders() {

        // Usuario autenticado
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepo.findByUsername(username).orElseThrow();

        // Obtener pedidos del usuario
        List<Pedido> pedidos = pedidoService.findPedidosByUsuario(usuario.getId());

        return ResponseEntity.ok(pedidos);
    }
}
