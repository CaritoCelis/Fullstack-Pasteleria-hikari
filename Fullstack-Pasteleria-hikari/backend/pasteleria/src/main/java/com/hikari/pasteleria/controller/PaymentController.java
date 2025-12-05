package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.Payment;
import com.hikari.pasteleria.models.Pedido;
import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.PaymentRepository;
import com.hikari.pasteleria.repository.PedidoRepository;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.service.EmailService;
import com.hikari.pasteleria.service.PaypalService;
import com.paypal.orders.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pagos")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final PaypalService payPalService;
    private final PaymentRepository paymentRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public PaymentController(PaypalService payPalService, PaymentRepository paymentRepository,
                           PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository,
                           EmailService emailService) {
        this.payPalService = payPalService;
        this.paymentRepository = paymentRepository;
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearPago(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            System.out.println("💳 [PaymentController] Iniciando creación de pago");
            System.out.println("💳 [PaymentController] Usuario autenticado: " + auth.getName());
            
            Long pedidoId = Long.parseLong(request.get("pedidoId").toString());
            BigDecimal monto = new BigDecimal(request.get("monto").toString());
            
            System.out.println("💳 [PaymentController] Pedido ID: " + pedidoId);
            System.out.println("💳 [PaymentController] Monto: " + monto);
            
            Pedido pedido = pedidoRepository.findById(pedidoId)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
            
            // CORREGIDO: Buscar por username en vez de email
            Usuario usuario = usuarioRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            System.out.println("💳 [PaymentController] Usuario encontrado: " + usuario.getUsername());
            System.out.println("💳 [PaymentController] Creando orden en PayPal...");
            
            // Crear orden en PayPal
            Order order = payPalService.crearOrden(monto, "USD", pedidoId);
            
            System.out.println("✅ [PaymentController] Orden PayPal creada: " + order.id());
            
            // Guardar pago en BD
            Payment payment = new Payment();
            payment.setPedido(pedido);
            payment.setUsuario(usuario);
            payment.setPaypalOrderId(order.id());
            payment.setMonto(monto);
            payment.setEstado(Payment.PaymentStatus.CREATED);
            paymentRepository.save(payment);
            
            System.out.println("💾 [PaymentController] Pago guardado en BD");
            
            String approveUrl = order.links().stream()
                    .filter(link -> link.rel().equals("approve"))
                    .findFirst()
                    .map(link -> link.href())
                    .orElse(null);
            
            System.out.println("🔗 [PaymentController] URL de aprobación: " + approveUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.id());
            response.put("approveUrl", approveUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ [PaymentController] Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/capturar/{orderId}")
    public ResponseEntity<?> capturarPago(@PathVariable String orderId) {
        try {
            Order order = payPalService.capturarOrden(orderId);
            
            Payment payment = paymentRepository.findByPaypalOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
            
            payment.setEstado(Payment.PaymentStatus.COMPLETED);
            payment.setFechaAprobacion(LocalDateTime.now());
            payment.setPaypalPaymentId(order.purchaseUnits().get(0).payments()
                    .captures().get(0).id());
            paymentRepository.save(payment);
            
            // Actualizar pedido
            Pedido pedido = payment.getPedido();
            pedido.setStatus("CONFIRMADO");
            pedidoRepository.save(pedido);
            
            // Enviar correo de confirmación
            emailService.enviarCorreoPedidoConfirmado(
                    payment.getUsuario().getEmail(),
                    payment.getUsuario().getNombre(),
                    pedido.getId(),
                    payment.getMonto()
            );
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Pago procesado exitosamente",
                    "pedidoId", pedido.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}