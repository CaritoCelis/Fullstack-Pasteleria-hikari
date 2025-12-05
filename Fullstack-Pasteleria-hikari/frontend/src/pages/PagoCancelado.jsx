// src/pages/PagoCancelado.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pago.css";

export default function PagoCancelado() {
  const navigate = useNavigate();

  return (
    <div className="pago-container">
      <div className="pago-cancelado">
        <div className="cancel-icon">❌</div>
        <h2>Pago cancelado</h2>
        <p>Has cancelado el proceso de pago en PayPal.</p>
        <p>No se realizó ningún cargo a tu cuenta.</p>
        <div className="info-sandbox">
          <p>💡 Puedes volver a intentarlo cuando quieras</p>
          <p>Tus productos siguen en el carrito</p>
        </div>
        <div className="pago-actions">
          <button onClick={() => navigate("/checkout")} className="btn-primary">
            Volver al checkout
          </button>
          <button onClick={() => navigate("/carrito")} className="btn-secondary">
            Ver mi carrito
          </button>
          <button onClick={() => navigate("/productos")} className="btn-tertiary">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}