package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "carritos")
public class Carrito {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL)
    private List<CarritoDetalle> detalles;

    @OneToOne
    private Usuario usuario;

    public Carrito() {}
    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public List<CarritoDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<CarritoDetalle> detalles) { this.detalles = detalles; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
