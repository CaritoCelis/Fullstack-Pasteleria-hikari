// src/pages/Admin/AdminPedidos.jsx
import React, { useState, useEffect } from "react";
import { getPedidos, actualizarEstadoPedido } from "../../api/adminService";
import "../../styles/Admin.css";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      alert("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      alert("✅ Estado actualizado correctamente");
      cargarPedidos();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("❌ Error al actualizar estado");
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === "todos") return true;
    return p.status?.toLowerCase() === filtro.toLowerCase();
  });

  if (loading) {
    return <div className="admin-loading">Cargando pedidos...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📦 Gestión de Pedidos</h1>
        <div className="filtros">
          <button
            className={filtro === "todos" ? "active" : ""}
            onClick={() => setFiltro("todos")}
          >
            Todos ({pedidos.length})
          </button>
          <button
            className={filtro === "PENDIENTE" ? "active" : ""}
            onClick={() => setFiltro("PENDIENTE")}
          >
            Pendientes
          </button>
          <button
            className={filtro === "CONFIRMADO" ? "active" : ""}
            onClick={() => setFiltro("CONFIRMADO")}
          >
            Confirmados
          </button>
          <button
            className={filtro === "ENVIADO" ? "active" : ""}
            onClick={() => setFiltro("ENVIADO")}
          >
            Enviados
          </button>
          <button
            className={filtro === "ENTREGADO" ? "active" : ""}
            onClick={() => setFiltro("ENTREGADO")}
          >
            Entregados
          </button>
        </div>
      </div>

      <div className="pedidos-tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay pedidos para mostrar
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.usuario?.nombre || pedido.usuario?.email || "Usuario desconocido"}</td>
                  <td>
                    {pedido.createdAt
                      ? new Date(pedido.createdAt).toLocaleDateString("es-CL")
                      : "N/A"}
                  </td>
                  <td>${Number(pedido.total || 0).toLocaleString("es-CL")}</td>
                  <td>
                    <span className={`badge badge-${pedido.status?.toLowerCase()}`}>
                      {pedido.status || "PENDIENTE"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={pedido.status || "PENDIENTE"}
                      onChange={(e) =>
                        handleCambiarEstado(pedido.id, e.target.value)
                      }
                      className="select-estado"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADO">Confirmado</option>
                      <option value="EN_PREPARACION">En Preparación</option>
                      <option value="ENVIADO">Enviado</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}