package com.hikari.pasteleria.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    // 🔹 Buscar por username (email o username según tu modelo)
    public Optional<Usuario> findByUsername(String username) {
        return repo.findByUsername(username);
    }

    // 🔹 Guardar usuario directamente (solo si no requiere encriptación)
    public Usuario save(Usuario u) {
        return repo.save(u);
    }

    // 🔹 Registrar usuario (ENCRIPTA LA CONTRASEÑA)
    public Usuario registrar(Usuario usuario) {
        // Encriptar password antes de guardar
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        return repo.save(usuario);
    }

    // 🔹 Listar todos los usuarios
    public List<Usuario> listar() {
        return repo.findAll();
    }
}
