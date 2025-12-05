// src/pages/Confirmacion.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";
import "../styles/confirmacion.css";

export default function Confirmacion() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { vaciarCarrito } = useContext(CarritoContext);
  
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state?.metodo === "paypal") {
      simularPagoPayPal();
    } else {
      crearPedidoContraentrega();
    }
  }, []);

  const simularPagoPayPal = async () => {
    setLoading(true);
    
    // Simular delay de PayPal (3 segundos)
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Crear pedido con método PayPal
      const pedidoData = {
        items: state.productos.map(p => ({
          productId: p.id,
          quantity: p.cantidad
        }))
      };

      const response = await api.post("/pedidos", pedidoData);
      
      setPedidoId(response.data.pedidoId);
      vaciarCarrito();
      setLoading(false);
    } catch (err) {
      console.error("Error creando pedido:", err);
      setError("Error al procesar el pedido");
      setLoading(false);
    }
  };

  const crearPedidoContraentrega = async () => {
    setLoading(true);

    try {
      const pedidoData = {
        items: state.productos.map(p => ({
          productId: p.id,
          quantity: p.cantidad
        }))
      };

      const response = await api.post("/pedidos", pedidoData);
      
      setPedidoId(response.data.pedidoId);
      vaciarCarrito();
      setLoading(false);
    } catch (err) {
      console.error("Error creando pedido:", err);
      setError("Error al procesar el pedido");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="confirmacion-container">
        <div className="loading-paypal">
          <div className="spinner"></div>
          <h2>
            {state?.metodo === "paypal" 
              ? "🔄 Procesando pago con PayPal..." 
              : "🔄 Procesando pedido..."}
          </h2>
          <p>Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmacion-container">
        <div className="error-pedido">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/checkout")}>Volver a intentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmacion-container">
      <div className="confirmacion-exitosa">
        <div className="success-icon">✅</div>
        <h2>🎉 ¡Pedido confirmado!</h2>
        <p className="pedido-numero">Pedido #{pedidoId}</p>

        {state?.metodo === "paypal" && (
          <div className="paypal-simulado">
            <p className="badge-simulado">✨ Pago simulado con PayPal</p>
            <p className="info-simulado">
              (En producción, aquí se procesaría el pago real)
            </p>
          </div>
        )}

        <h3>🧍 Datos del Cliente</h3>
        <div className="datos-cliente">
          <p><strong>Nombre:</strong> {state?.nombre} {state?.apellido}</p>
          <p><strong>Email:</strong> {state?.email}</p>
          <p><strong>Teléfono:</strong> {state?.telefono}</p>
        </div>

        {state?.metodo === "paypal" ? (
          <div className="info-envio">
            <h3>🚚 Envío a domicilio</h3>
            <p>{state?.direccion}, {state?.comuna}, {state?.region}</p>
            <p><strong>Costo de envío:</strong> $3.000 CLP</p>
          </div>
        ) : (
          <div className="info-retiro">
            <h3>🏬 Retiro en tienda</h3>
            <p><strong>Dirección:</strong> Av. Central 123, Santiago</p>
            <p><strong>Horario:</strong> Lunes a Viernes 10:00 - 18:00</p>
          </div>
        )}

        <h3>🛒 Productos Comprados</h3>
        <div className="productos-lista">
          {state?.productos?.map((item, index) => (
            <div key={index} className="producto-item">
              <p>🧁 {item.nombre} x{item.cantidad}</p>
              <p className="precio-item">${(item.precio * item.cantidad).toLocaleString()} CLP</p>
            </div>
          ))}
        </div>

        <div className="resumen-pago">
          <h3>💰 Resumen de Pago</h3>
          <p><strong>Subtotal:</strong> ${(state?.totalFinal - state?.costoEnvio).toLocaleString()} CLP</p>
          <p><strong>Envío:</strong> {state?.metodo === "paypal" ? "$3.000 CLP" : "Gratis"}</p>
          <h2 className="total-final">Total: ${state?.totalFinal?.toLocaleString()} CLP</h2>
        </div>

        <div className="acciones-finales">
          <button onClick={() => navigate("/")} className="btn-inicio">
            🏠 Volver al inicio
          </button>
          <button onClick={() => navigate("/perfil")} className="btn-perfil">
            📋 Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
}