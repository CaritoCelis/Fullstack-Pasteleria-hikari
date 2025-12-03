package com.hikari.pasteleria.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hikari.pasteleria.dto.AuthRequest;
import com.hikari.pasteleria.dto.RegisterRequest;
import com.hikari.pasteleria.models.Role;
import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.RoleRepository;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final RoleRepository roleRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepo, RoleRepository roleRepo, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo; 
        this.roleRepo = roleRepo; 
        this.jwtUtil = jwtUtil; 
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Validar si ya existe
        if(usuarioRepo.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error","username exists"));
        }
        if(usuarioRepo.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error","email exists"));
        }
        
        // Crear usuario
        Usuario u = new Usuario();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setPassword(passwordEncoder.encode(req.password()));
        
        // Setear campos nuevos
        u.setNombre(req.nombre());
        u.setApellido(req.apellido());
        
        // Parsear fecha (viene como String "YYYY-MM-DD")
        if(req.fechaNacimiento() != null && !req.fechaNacimiento().isEmpty()) {
            u.setFechaNacimiento(java.time.LocalDate.parse(req.fechaNacimiento()));
        }
        
        // Asignar rol USER
        Role r = roleRepo.findByName("ROLE_USER")
            .orElseGet(() -> roleRepo.save(new Role("ROLE_USER")));
        u.getRoles().add(r);
        
        // Guardar
        usuarioRepo.save(u);
        
        return ResponseEntity.ok(Map.of(
            "message", "registered",
            "username", u.getUsername()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {

        Optional<Usuario> uOpt;

        // Si el usuario escribió un email, lo buscamos como email
        if (req.username().contains("@")) {
            uOpt = usuarioRepo.findByEmail(req.username());
        } else {
            // Si escribió username, lo buscamos como username
            uOpt = usuarioRepo.findByUsername(req.username());
        }

        if (uOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "user not found"));
        }

        Usuario u = uOpt.get();

        if (!passwordEncoder.matches(req.password(), u.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid credentials"));
        }

        String token = jwtUtil.generateToken(u.getUsername());
        
        // ✅ NUEVO: Devolver más información del usuario al hacer login
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", u.getUsername());
        response.put("email", u.getEmail());
        response.put("nombre", u.getNombre());
        response.put("apellido", u.getApellido());
        response.put("fechaNacimiento", u.getFechaNacimiento() != null ? u.getFechaNacimiento().toString() : null);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromJwt(token);
        Optional<Usuario> uOpt = usuarioRepo.findByUsername(username);
        
        if(uOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        
        Usuario u = uOpt.get();
        Map<String, Object> out = new HashMap<>();
        
        // ✅ NUEVO: Devolver toda la información del usuario
        out.put("id", u.getId());
        out.put("username", u.getUsername());
        out.put("email", u.getEmail());
        out.put("nombre", u.getNombre());
        out.put("apellido", u.getApellido());
        out.put("fechaNacimiento", u.getFechaNacimiento() != null ? u.getFechaNacimiento().toString() : null);
        out.put("roles", u.getRoles().stream().map(Role::getName).toList());
        
        return ResponseEntity.ok(out);
    }
}