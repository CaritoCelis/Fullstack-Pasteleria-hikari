package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.ContactMessage;
import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.ContactMessageRepository;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final ContactMessageRepository contactRepository;
    private final EmailService emailService;
    private final UsuarioRepository usuarioRepository;

    public ContactController(ContactMessageRepository contactRepository, 
                           EmailService emailService,
                           UsuarioRepository usuarioRepository) {
        this.contactRepository = contactRepository;
        this.emailService = emailService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> enviarMensaje(@RequestBody ContactMessage mensaje) {
    try {
        // Verificar que el email esté registrado
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(mensaje.getEmail());
        
        if (usuarioOpt.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "El correo no está registrado. Por favor, regístrate primero.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Guardar mensaje en BD
        ContactMessage mensajeGuardado = contactRepository.save(mensaje);
        
        // Enviar correo de confirmación
        try {
            emailService.enviarCorreoContacto(mensaje.getEmail(), mensaje.getNombre());
        } catch (Exception e) {
            System.err.println("❌ ERROR ENVIANDO CORREO: " + e.getMessage());
            e.printStackTrace(); // ← AGREGAR ESTO
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Mensaje enviado correctamente. Revisa tu correo.");
        
        return ResponseEntity.ok(response);
        
        } catch (Exception e) {
        System.err.println("❌ ERROR GENERAL: " + e.getMessage());
        e.printStackTrace(); // ← AGREGAR ESTO
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Error al enviar el mensaje");
        return ResponseEntity.status(500).body(response);
    }
    }
}