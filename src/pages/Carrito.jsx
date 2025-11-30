import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";

export default function Carrito() {
  const { carrito, actualizarCantidad, eliminarItem, vaciarCarrito, totalPrecio } = useContext(CarritoContext);
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFinalizarCompra = () => {
    if (!usuario) {
      alert("⚠ Debes iniciar sesión para continuar con la compra.");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <main className="carrito-container">
      <h1>🛒 Mi Carrito</h1>

      {carrito.length === 0 ? (
        <div className="vacio">
          <p>Tu carrito está vacío 😢</p>
          <Link to="/productos" className="seguir-comprando">Ir a comprar →</Link>
        </div>
      ) : (
        <>
          <table className="tabla-carrito">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Eliminar</th>
              </tr>
            </thead>

            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td>${Number(item.precio).toLocaleString("es-CL")}</td>
                  <td>
                    <div className="cantidad-controls">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(Number(item.precio) * Number(item.cantidad)).toLocaleString("es-CL")}</td>
                  <td>
                    <button onClick={() => eliminarItem(item.id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-carrito">
            <h2>Total a pagar: ${totalPrecio.toLocaleString("es-CL")}</h2>
          </div>

          <div className="acciones-carrito">
            <button onClick={vaciarCarrito}>Vaciar carrito 🗑️</button>
            {!usuario ? (
              <button onClick={() => navigate("/login")}>Iniciar sesión para pagar 🔐</button>
            ) : (
              <button onClick={handleFinalizarCompra}>Proceder al pago 💳</button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
