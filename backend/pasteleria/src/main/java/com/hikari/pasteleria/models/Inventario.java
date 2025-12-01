package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idInventario;

    @OneToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;

    public Inventario() {
    }

    public Inventario(Producto producto, Integer stock) {
        this.producto = producto;
        this.stock = stock;
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Getters y Setters

    public String getIdInventario() {
        return idInventario;
    }

    public void setIdInventario(String idInventario) {
        this.idInventario = idInventario;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
        this.fechaActualizacion = LocalDateTime.now(); // siempre actualiza al modificar stock
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}
