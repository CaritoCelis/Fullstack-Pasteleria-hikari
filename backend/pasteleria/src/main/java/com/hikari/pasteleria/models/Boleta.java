package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "boletas")
public class Boleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numero;
    @ManyToOne private Usuario usuario;
    private BigDecimal total;
    private LocalDateTime fecha = LocalDateTime.now();
    // getters/setters
    public Boleta() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getNumero() { return numero; } public void setNumero(String numero) { this.numero = numero; }
    public Usuario getUsuario() { return usuario; } public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public BigDecimal getTotal() { return total; } public void setTotal(BigDecimal total) { this.total = total; }
    public LocalDateTime getFecha() { return fecha; } public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
