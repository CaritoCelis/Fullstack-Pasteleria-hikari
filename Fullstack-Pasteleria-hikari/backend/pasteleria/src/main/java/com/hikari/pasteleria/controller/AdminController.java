package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.*;
import com.hikari.pasteleria.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final PaymentRepository paymentRepository;
    private final ContactMessageRepository contactRepository;

    public AdminController(UsuarioRepository usuarioRepository, PedidoRepository pedidoRepository,
                          ProductoRepository productoRepository, PaymentRepository paymentRepository,
                          ContactMessageRepository contactRepository) {
        this.usuarioRepository = usuarioRepository;
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.paymentRepository = paymentRepository;
        this.contactRepository = contactRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> obtenerDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsuarios", usuarioRepository.count());
        stats.put("totalPedidos", pedidoRepository.count());
        stats.put("totalProductos", productoRepository.count());
        stats.put("mensajesNoLeidos", contactRepository.countByLeidoFalse());
        stats.put("pedidosPendientes", pedidoRepository.countByStatus("PENDIENTE")); // Cambié estado por status
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> obtenerPedidos() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }

    @PutMapping("/pedidos/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setStatus(body.get("estado")); // Cambié setEstado por setStatus
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    @GetMapping("/mensajes")
    public ResponseEntity<List<ContactMessage>> obtenerMensajes() {
        return ResponseEntity.ok(contactRepository.findAllByOrderByFechaEnvioDesc());
    }

    @PutMapping("/mensajes/{id}/marcar-leido")
    public ResponseEntity<?> marcarMensajeLeido(@PathVariable Long id) {
        ContactMessage mensaje = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mensaje no encontrado"));
        mensaje.setLeido(true);
        contactRepository.save(mensaje);
        return ResponseEntity.ok(mensaje);
    }

    @GetMapping("/pagos")
    public ResponseEntity<List<Payment>> obtenerPagos() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }
}