package com.hikari.pasteleria.controller;

import com.hikari.pasteleria.dto.AuthRequest;
import com.hikari.pasteleria.dto.RegisterRequest;
import com.hikari.pasteleria.models.Role;
import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.RoleRepository;
import com.hikari.pasteleria.repository.UsuarioRepository;
import com.hikari.pasteleria.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final RoleRepository roleRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepo, RoleRepository roleRepo, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo; this.roleRepo = roleRepo; this.jwtUtil = jwtUtil; this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if(usuarioRepo.findByUsername(req.username()).isPresent()) return ResponseEntity.badRequest().body(Map.of("error","username exists"));
        if(usuarioRepo.findByEmail(req.email()).isPresent()) return ResponseEntity.badRequest().body(Map.of("error","email exists"));
        Usuario u = new Usuario();
        u.setUsername(req.username()); u.setEmail(req.email());
        u.setPassword(passwordEncoder.encode(req.password()));
        Role r = roleRepo.findByName("ROLE_USER").orElse(new Role("ROLE_USER"));
        roleRepo.save(r);
        u.getRoles().add(r);
        usuarioRepo.save(u);
        return ResponseEntity.ok(Map.of("message","registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        Optional<Usuario> uOpt = usuarioRepo.findByUsername(req.username());
        if(uOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error","user not found"));
        Usuario u = uOpt.get();
        if(!passwordEncoder.matches(req.password(), u.getPassword())) return ResponseEntity.status(401).body(Map.of("error","invalid credentials"));
        String token = jwtUtil.generateToken(u.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", u.getUsername()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if(authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).build();
        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromJwt(token);
        Optional<Usuario> uOpt = usuarioRepo.findByUsername(username);
        if(uOpt.isEmpty()) return ResponseEntity.status(404).build();
        Usuario u = uOpt.get();
        Map<String,Object> out = new HashMap<>();
        out.put("username", u.getUsername());
        out.put("email", u.getEmail());
        out.put("roles", u.getRoles().stream().map(Role::getName));
        return ResponseEntity.ok(out);
    }
}
