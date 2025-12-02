package com.hikari.pasteleria.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo){
        this.repo = repo;
    }

    // Método existente
    public Optional<Usuario> findByUsername(String username){
        return repo.findByUsername(username);
    }

    // Método existente
    public Usuario save(Usuario u){
        return repo.save(u);
    }

    // 🔹 Método nuevo para registrar usuarios
    public Usuario registrar(Usuario usuario) {
        return repo.save(usuario);
    }

    // 🔹 Método nuevo para listar todos los usuarios
    public List<Usuario> listar() {
        return repo.findAll();
    }
}