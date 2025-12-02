package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
public class Inventario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Producto producto;
    private Integer cantidad;
    private String tipo; // IN, OUT
    private LocalDateTime fecha = LocalDateTime.now();
    public Inventario() {}
    // getters/setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Producto getProducto() { return producto; } public void setProducto(Producto producto) { this.producto = producto; }
    public Integer getCantidad() { return cantidad; } public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getTipo() { return tipo; } public void setTipo(String tipo) { this.tipo = tipo; }
    public LocalDateTime getFecha() { return fecha; } public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
