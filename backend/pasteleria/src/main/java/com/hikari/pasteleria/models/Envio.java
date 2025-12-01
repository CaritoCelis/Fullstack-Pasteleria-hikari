package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "envio")
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String idEnvio;

    @OneToOne
    @JoinColumn(name = "id_boleta", nullable = false)
    private Boleta boleta;

    @Column(nullable = false, length = 150)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(nullable = false)
    private LocalDate fechaEstimadaEntrega;

    @Column(nullable = false, length = 50)
    private String estado; // pendiente, en camino, entregado

    public Envio() {
    }

    public Envio(Boleta boleta, String direccion, String ciudad, String region, LocalDate fechaEstimadaEntrega) {
        this.boleta = boleta;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.region = region;
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
        this.estado = "pendiente";
    }

    // Getters y Setters
    public String getIdEnvio() {
        return idEnvio;
    }

    public void setIdEnvio(String idEnvio) {
        this.idEnvio = idEnvio;
    }

    public Boleta getBoleta() {
        return boleta;
    }

    public void setBoleta(Boleta boleta) {
        this.boleta = boleta;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public LocalDate getFechaEstimadaEntrega() {
        return fechaEstimadaEntrega;
    }

    public void setFechaEstimadaEntrega(LocalDate fechaEstimadaEntrega) {
        this.fechaEstimadaEntrega = fechaEstimadaEntrega;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
