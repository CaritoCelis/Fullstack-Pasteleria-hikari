// src/pages/Admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../api/adminService";
import "../../styles/Admin.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Panel de Administrador</h1>
        <p>Bienvenido al panel de control de Pastelería Hikari</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsuarios || 0}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{stats?.totalPedidos || 0}</h3>
            <p>Pedidos Totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧁</div>
          <div className="stat-info">
            <h3>{stats?.totalProductos || 0}</h3>
            <p>Productos Activos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats?.mensajesNoLeidos || 0}</h3>
            <p>Mensajes Sin Leer</p>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats?.pedidosPendientes || 0}</h3>
            <p>Pedidos Pendientes</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/productos" className="admin-btn">
          🧁 Gestionar Productos
        </Link>
        <Link to="/admin/pedidos" className="admin-btn">
          📦 Ver Pedidos
        </Link>
        <Link to="/admin/mensajes" className="admin-btn">
          💬 Ver Mensajes
        </Link>
      </div>
    </div>
  );
}