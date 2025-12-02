package com.hikari.pasteleria.service;

import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {
    private final UsuarioRepository repo;
    public UsuarioService(UsuarioRepository repo){ this.repo = repo; }
    public Optional<Usuario> findByUsername(String username){ return repo.findByUsername(username); }
    public Usuario save(Usuario u){ return repo.save(u); }
}
