import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../styles/confirmacion.css"; // 👈 IMPORTANTE: importar el CSS

export default function Confirmacion() {
  const { state } = useLocation();
  const [estadoPedido, setEstadoPedido] = useState("Procesando");

  useEffect(() => {
    const timer = setTimeout(() => setEstadoPedido("Enviado"), 4000);
    const timer2 = setTimeout(() => setEstadoPedido("Entregado"), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleDescargarBoleta = () => {
    alert("📄 La boleta está siendo generada (simulado).");
  };

  return (
    <div className="confirmacion-container">
      <h2>🎉 ¡Pedido confirmado!</h2>
      <p><strong>Estado del pedido:</strong> <span className={`estado ${estadoPedido.toLowerCase()}`}>{estadoPedido}</span></p>

      <h3>🧍 Datos del Cliente</h3>
      <p>{state.nombre} {state.apellido}</p>
      <p>{state.email}</p>
      <p>{state.telefono}</p>

      {state.metodo === "tarjeta" ? (
        <>
          <h3>🚚 Envío a domicilio</h3>
          <p>{state.direccion}, {state.comuna}, {state.region}</p>
          <p><strong>Envío:</strong> $3.000 CLP</p>
        </>
      ) : (
        <>
          <h3>🏬 Retiro en tienda</h3>
          <p><strong>Dirección:</strong> Av. Central 123, Santiago</p>
          <p><strong>Horario:</strong> Lunes a Viernes 10:00 - 18:00</p>
        </>
      )}

      <h3>🛒 Productos Comprados</h3>
      {state.productos && state.productos.map((item, index) => (
        <div key={index} className="producto-item">
          <p>🧁 {item.nombre} x{item.cantidad} - ${item.precio * item.cantidad}</p>
        </div>
      ))}

      <h3>💰 Resumen de Pago</h3>
      <p><strong>Total Productos:</strong> ${(state.totalFinal - state.costoEnvio).toLocaleString()} CLP</p>
      <p><strong>Envío:</strong> {state.metodo === "tarjeta" ? "$3.000 CLP" : "Gratis"}</p>
      <h2><strong>Total Final: ${state.totalFinal.toLocaleString()} CLP</strong></h2>

      <button onClick={handleDescargarBoleta} className="boton-boleta">
        📄 Descargar Boleta
      </button>
    </div>
  );
}
