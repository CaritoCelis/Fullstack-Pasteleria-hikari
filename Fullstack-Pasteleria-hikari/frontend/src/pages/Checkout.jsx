// src/pages/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";
import "../styles/checkout.css";

export default function Checkout() {
  const [metodo, setMetodo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { carrito, totalPrecio } = useContext(CarritoContext);

  const handleContinuar = async () => {
    if (!metodo) return alert("Selecciona un método de pago");

    if (metodo === "contraentrega") {
      navigate("/checkout/datos", { state: { metodo } });
    } else if (metodo === "paypal") {
      await procesarPayPal();
    }
  };

  const procesarPayPal = async () => {
    setLoading(true);
    try {
      // Crear pedido primero
      const pedidoData = {
        items: carrito.map(p => ({
          productId: p.id,
          quantity: p.cantidad
        }))
      };

      const pedidoResponse = await api.post("/pedidos", pedidoData);
      const pedidoId = pedidoResponse.data.pedidoId;

      // Convertir a USD (ajusta la tasa según necesites)
      const costoEnvio = 3000;
      const totalCLP = totalPrecio + costoEnvio;
      const totalUSD = (totalCLP / 900).toFixed(2);

      // Crear orden de PayPal
      const pagoResponse = await api.post("/pagos/crear", {
        pedidoId: pedidoId,
        monto: totalUSD
      });

      // Redirigir a PayPal
      if (pagoResponse.data.approveUrl) {
        window.location.href = pagoResponse.data.approveUrl;
      } else {
        alert("Error: No se obtuvo la URL de PayPal");
      }
    } catch (error) {
      console.error("Error procesando PayPal:", error);
      alert("Error al procesar el pago. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Selecciona tu método de pago</h2>

      <label className="metodo-pago-label">
        <input
          type="radio"
          value="paypal"
          checked={metodo === "paypal"}
          onChange={() => setMetodo("paypal")}
          disabled={loading}
        />
        <span className="metodo-texto">💳 PayPal + Envío $3.000 CLP</span>
      </label>

      <label className="metodo-pago-label">
        <input
          type="radio"
          value="contraentrega"
          checked={metodo === "contraentrega"}
          onChange={() => setMetodo("contraentrega")}
          disabled={loading}
        />
        <span className="metodo-texto">🏪 Contraentrega (Retiro en tienda) - GRATIS</span>
      </label>

      <button className="btn-continuar" onClick={handleContinuar} disabled={loading}>
        {loading ? "Conectando con PayPal..." : "Continuar"}
      </button>
    </div>
  );
}