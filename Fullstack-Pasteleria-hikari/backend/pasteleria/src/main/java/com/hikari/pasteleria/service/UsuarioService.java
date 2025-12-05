package com.hikari.pasteleria.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Usuario> findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public Usuario save(Usuario u) {
        return repo.save(u);
    }

    // 🔹 Método para registrar usuarios - AHORA ENCRIPTA LA CONTRASEÑA
    public Usuario registrar(Usuario usuario) {
        // Encriptar la contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return repo.save(usuario);
    }

    public List<Usuario> listar() {
        return repo.findAll();
    }
}