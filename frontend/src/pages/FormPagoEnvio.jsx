// src/pages/FormPagoEnvio.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import "../styles/form_pago_envio.css";

export default function FormPagoEnvio() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const metodo = state?.metodo;
  const { carrito, totalPrecio } = useContext(CarritoContext); // ✅ Cambio: totalCarrito → totalPrecio

  const costoEnvio = metodo === "tarjeta" ? 3000 : 0;
  const totalFinal = totalPrecio + costoEnvio; // ✅ Ahora usa totalPrecio

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
  });

  // Validaciones básicas
  const validarFormulario = () => {
    if (!formData.nombre || !formData.apellido || !formData.email) {
      alert("Por favor completa los datos obligatorios.");
      return false;
    }

    if (metodo === "tarjeta") {
      const tarjetaValida = /^[0-9]{16}$/.test(formData.tarjeta);
      const cvvValido = /^[0-9]{3,4}$/.test(formData.cvv);

      if (!tarjetaValida) {
        alert("Número de tarjeta inválido. Debe tener 16 dígitos.");
        return false;
      }
      if (!cvvValido) {
        alert("CVV inválido.");
        return false;
      }
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
      {metodo === "tarjeta" ? (
        <>
          <h3>💳 Datos de la Tarjeta</h3>
          <input name="tarjeta" placeholder="Número de tarjeta (16 dígitos)" maxLength={16} onChange={handleChange} />
          <input name="vencimiento" placeholder="MM/AA" onChange={handleChange} />
          <input name="cvv" placeholder="CVV" maxLength={4} onChange={handleChange} />

          <h3>📦 Datos de envío</h3>
          <input name="nombre" placeholder="Nombre" onChange={handleChange} />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
          <input name="region" placeholder="Región" onChange={handleChange} />
          <input name="comuna" placeholder="Comuna" onChange={handleChange} />
          <input name="direccion" placeholder="Dirección" onChange={handleChange} />
        </>
      ) : (
        <>
          <h3>📍 Retiro en tienda</h3>
          <p><strong>Dirección:</strong> Av. Central 123, Santiago</p>
          <p><strong>Horario:</strong> Lunes a Viernes 10:00 - 18:00</p>

          <input name="nombre" placeholder="Nombre" onChange={handleChange} />
          <input name="apellido" placeholder="Apellido" onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        </>
      )}

      <h3>💰 Total a pagar: ${totalFinal.toLocaleString("es-CL")} CLP</h3>
      <button onClick={handleConfirmar}>Confirmar Pedido</button>
    </div>
  );
}