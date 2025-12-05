package com.hikari.pasteleria.security;

import com.hikari.pasteleria.models.Usuario;
import com.hikari.pasteleria.repository.UsuarioRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public JwtFilter(JwtUtil jwtUtil, UsuarioRepository usuarioRepository) {
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        
        System.out.println("🔍 [JwtFilter] Header Authorization: " + header);
        
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            
            System.out.println("🔑 [JwtFilter] Token extraído");
            
            try {
                if (jwtUtil.validateJwtToken(token)) {
                    String username = jwtUtil.getUsernameFromJwt(token);
                    
                    System.out.println("✅ [JwtFilter] Token válido para usuario: " + username);
                    
                    Usuario u = usuarioRepository.findByUsername(username).orElse(null);
                    
                    if (u != null) {
                        System.out.println("👤 [JwtFilter] Usuario encontrado: " + u.getUsername());
                        System.out.println("🎭 [JwtFilter] Roles del usuario: " + u.getRoles());
                        
                        var authorities = u.getRoles().stream()
                                .map(r -> {
                                    String roleName = r.getName();
                                    // Asegurarse de que el rol tenga el prefijo ROLE_
                                    if (!roleName.startsWith("ROLE_")) {
                                        roleName = "ROLE_" + roleName;
                                    }
                                    System.out.println("🔐 [JwtFilter] Authority agregada: " + roleName);
                                    return new SimpleGrantedAuthority(roleName);
                                })
                                .collect(Collectors.toList());
                        
                        var auth = new UsernamePasswordAuthenticationToken(u.getUsername(), null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        
                        System.out.println("🎉 [JwtFilter] Autenticación establecida exitosamente");
                    } else {
                        System.out.println("❌ [JwtFilter] Usuario no encontrado en BD");
                    }
                } else {
                    System.out.println("❌ [JwtFilter] Token inválido");
                }
            } catch (Exception e) {
                System.out.println("💥 [JwtFilter] Excepción: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("⚠️ [JwtFilter] No hay token Bearer en el header");
        }
        
        filterChain.doFilter(request, response);
    }
}