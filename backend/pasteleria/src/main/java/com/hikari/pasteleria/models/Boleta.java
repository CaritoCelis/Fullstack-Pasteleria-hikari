package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "boleta")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idBoleta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private LocalDateTime fechaEmision;

    @Column(nullable = false, length = 200)
    private String metodoPago;

    @Column(nullable = false)
    private String estado; // emitida, pagada, cancelada

    public Boleta() {
    }

    public Boleta(Usuario usuario, Double total, String metodoPago) {
        this.usuario = usuario;
        this.total = total;
        this.metodoPago = metodoPago;
        this.fechaEmision = LocalDateTime.now();
        this.estado = "emitida";
    }

    // Getters y Setters
    public String getIdBoleta() {
        return idBoleta;
    }

    public void setIdBoleta(String idBoleta) {
        this.idBoleta = idBoleta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
