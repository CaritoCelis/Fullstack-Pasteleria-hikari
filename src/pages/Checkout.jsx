import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [metodo, setMetodo] = useState("");
  const navigate = useNavigate();

  const handleContinuar = () => {
    if (!metodo) return alert("Selecciona un método de pago");
    navigate("/checkout/datos", { state: { metodo } });
  };

  return (
    <div className="checkout-container">
      <h2>Selecciona tu método de pago</h2>

      <label>
        <input
          type="radio"
          value="tarjeta"
          checked={metodo === "tarjeta"}
          onChange={() => setMetodo("tarjeta")}
        />
        Tarjeta (Crédito / Débito) + Envío $3.000 CLP
      </label>

      <label>
        <input
          type="radio"
          value="contraentrega"
          checked={metodo === "contraentrega"}
          onChange={() => setMetodo("contraentrega")}
        />
        Contraentrega (Retiro en tienda) - GRATIS
      </label>

      <button onClick={handleContinuar}>Continuar</button>
    </div>
  );
}
