package com.hikari.pasteleria.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "envios")
public class Envio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String direccion;
    private String comuna;
    private String ciudad;
    private String estado; // e.g. PENDIENTE, EN_CAMINO, ENTREGADO
    private LocalDateTime fechaEnvio;

    @ManyToOne
    private Pedido pedido;

    public Envio() {}
    // getters/setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getDireccion() { return direccion; } public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getComuna() { return comuna; } public void setComuna(String comuna) { this.comuna = comuna; }
    public String getCiudad() { return ciudad; } public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    public String getEstado() { return estado; } public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaEnvio() { return fechaEnvio; } public void setFechaEnvio(LocalDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public Pedido getPedido() { return pedido; } public void setPedido(Pedido pedido) { this.pedido = pedido; }
}
