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
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<?> create(@RequestBody OrderRequest orderReq) {
        
        try {
            // Obtener usuario autenticado desde el SecurityContext
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            System.out.println("🛒 [PedidoController] Usuario autenticado: " + username);
            System.out.println("🛒 [PedidoController] Items recibidos: " + orderReq.items.size());
            
            Usuario usuario = usuarioRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

            // Convertir items del request en entidades OrderItem
            List<OrderItem> items = new ArrayList<>();
            
            for (var itReq : orderReq.items) {
                System.out.println("🔍 [PedidoController] Buscando producto ID: " + itReq.productId);
                
                Producto p = productoRepo.findById(itReq.productId)
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + itReq.productId));
                
                System.out.println("✅ [PedidoController] Producto encontrado: " + p.getName());
                
                OrderItem it = new OrderItem();
                it.setProducto(p);
                it.setQuantity(itReq.quantity);
                it.setPrice(p.getPrice());
                items.add(it);
            }

            // Crear pedido
            Pedido pedido = pedidoService.createPedido(usuario, items);
            
            System.out.println("🎉 [PedidoController] Pedido creado exitosamente: " + pedido.getId());

            return ResponseEntity.ok(
                Map.of(
                    "pedidoId", pedido.getId(),
                    "total", pedido.getTotal(),
                    "status", pedido.getStatus()
                )
            );
            
        } catch (RuntimeException e) {
            System.err.println("❌ [PedidoController] Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(
                Map.of("error", e.getMessage())
            );
        }
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