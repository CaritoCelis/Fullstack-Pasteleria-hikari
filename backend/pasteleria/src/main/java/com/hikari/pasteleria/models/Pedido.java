package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idPedido;

    @OneToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    @OneToOne
    @JoinColumn(name = "id_boleta", nullable = false)
    private Boleta boleta;

    @OneToOne
    @JoinColumn(name = "id_envio", nullable = false)
    private Envio envio;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false, length = 50)
    private String estadoPedido; // Ej.: Pendiente, Enviado, Entregado

    @Column(nullable = false)
    private Double total;

    @Column(length = 500)
    private String observaciones;

    public Pedido() {
    }

    public Pedido(Carrito carrito, Boleta boleta, Envio envio, Double total, String estadoPedido) {
        this.carrito = carrito;
        this.boleta = boleta;
        this.envio = envio;
        this.total = total;
        this.estadoPedido = estadoPedido;
        this.fechaCreacion = LocalDateTime.now();
    }

    // Getters y Setters
    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public Boleta getBoleta() {
        return boleta;
    }

    public void setBoleta(Boleta boleta) {
        this.boleta = boleta;
    }

    public Envio getEnvio() {
        return envio;
    }

    public void setEnvio(Envio envio) {
        this.envio = envio;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
