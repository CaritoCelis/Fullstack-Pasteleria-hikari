// src/pages/PagoExitoso.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";
import "../styles/pago.css";

export default function PagoExitoso() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [pedidoId, setPedidoId] = useState(null);
  const navigate = useNavigate();
  const { vaciarCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const token = searchParams.get("token"); // PayPal Order ID

    if (token) {
      capturarPago(token);
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  const capturarPago = async (orderId) => {
    try {
      // Capturar el pago en PayPal
      const response = await api.post(`/pagos/capturar/${orderId}`);

      if (response.data.success) {
        setStatus("success");
        setPedidoId(response.data.pedidoId);
        
        // Limpiar carrito
        vaciarCarrito();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error capturando pago:", error);
      setStatus("error");
    }
  };

  if (status === "processing") {
    return (
      <div className="pago-container">
        <div className="pago-processing">
          <div className="spinner"></div>
          <h2>🔄 Procesando tu pago con PayPal...</h2>
          <p>Por favor espera mientras verificamos el pago</p>
          <p className="info-sandbox">💡 Estás usando PayPal Sandbox (modo prueba)</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="pago-container">
        <div className="pago-success">
          <div className="success-icon">✅</div>
          <h2>¡Pago exitoso!</h2>
          <p>Tu pedido #{pedidoId} ha sido confirmado.</p>
          <p>Recibirás un email con los detalles de tu compra.</p>
          <div className="info-sandbox">
            <p>💡 Pago procesado con PayPal Sandbox (modo prueba)</p>
            <p>En producción, aquí se procesaría el pago real</p>
          </div>
          <div className="pago-actions">
            <button onClick={() => navigate("/perfil")} className="btn-primary">
              Ver mis pedidos
            </button>
            <button onClick={() => navigate("/")} className="btn-secondary">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pago-container">
      <div className="pago-error">
        <div className="error-icon">❌</div>
        <h2>Error en el pago</h2>
        <p>Hubo un problema al procesar tu pago con PayPal.</p>
        <p>Si el dinero fue debitado, se te reembolsará automáticamente.</p>
        <button onClick={() => navigate("/checkout")} className="btn-primary">
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}