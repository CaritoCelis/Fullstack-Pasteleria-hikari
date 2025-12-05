package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.models.Role;
import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registrar")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    @GetMapping("/listar")
    public List<Usuario> listar() {
        return usuarioService.listar();
    }
    
    // ✅ NUEVO ENDPOINT
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            System.out.println("👤 [UsuarioController /me] Usuario autenticado: " + username);
            
            Usuario u = usuarioRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            Map<String, Object> out = new HashMap<>();
            out.put("id", u.getId());
            out.put("username", u.getUsername());
            out.put("email", u.getEmail());
            out.put("nombre", u.getNombre());
            out.put("apellido", u.getApellido());
            out.put("fechaNacimiento", u.getFechaNacimiento() != null ? u.getFechaNacimiento().toString() : null);
            out.put("roles", u.getRoles().stream().map(Role::getName).toList());
            
            return ResponseEntity.ok(out);
            
        } catch (Exception e) {
            System.err.println("❌ [UsuarioController /me] Error: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}