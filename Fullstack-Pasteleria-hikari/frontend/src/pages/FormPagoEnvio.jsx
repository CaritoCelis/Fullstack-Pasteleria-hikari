// src/pages/FormPagoEnvio.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import "../styles/form_pago_envio.css";

export default function FormPagoEnvio() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const metodo = state?.metodo;
  const { carrito, totalPrecio } = useContext(CarritoContext);

  const costoEnvio = metodo === "paypal" ? 3000 : 0;
  const totalFinal = totalPrecio + costoEnvio;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const validarFormulario = () => {
    if (!formData.nombre || !formData.apellido || !formData.email) {
      alert("Por favor completa los datos obligatorios.");
      return false;
    }

    if (metodo === "paypal" && !formData.direccion) {
      alert("Por favor completa la dirección de envío.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmar = () => {
    if (!validarFormulario()) return;

    navigate("/checkout/confirmar", {
      state: {
        ...formData,
        metodo,
        productos: carrito,
        totalFinal,
        costoEnvio,
      },
    });
  };

  return (
    <div className="form-container">
      {metodo === "paypal" ? (
        <>
          <h3>📦 Datos de envío para PayPal</h3>
          <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
          <input name="region" placeholder="Región" onChange={handleChange} />
          <input name="comuna" placeholder="Comuna" onChange={handleChange} />
          <input name="direccion" placeholder="Dirección completa" onChange={handleChange} required />
        </>
      ) : (
        <>
          <h3>📍 Retiro en tienda</h3>
          <p><strong>Dirección:</strong> Av. Central 123, Santiago</p>
          <p><strong>Horario:</strong> Lunes a Viernes 10:00 - 18:00</p>

          <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        </>
      )}

      <h3 className="total-pagar">💰 Total a pagar: ${totalFinal.toLocaleString("es-CL")} CLP</h3>
      <button className="btn-confirmar" onClick={handleConfirmar}>
        {metodo === "paypal" ? "Ir a PayPal (Simulado)" : "Confirmar Pedido"}
      </button>
    </div>
  );
}