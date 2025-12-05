// src/components/AdminLayout.jsx
import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar de navegación */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>🍰 Hikari Admin</h2>
          <p className="admin-user">👤 {usuario?.nombre || usuario?.username}</p>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-item">
            📊 Dashboard
          </Link>
          <Link to="/admin/productos" className="admin-nav-item">
            🧁 Productos
          </Link>
          <Link to="/admin/pedidos" className="admin-nav-item">
            📦 Pedidos
          </Link>
          <Link to="/admin/mensajes" className="admin-nav-item">
            💬 Mensajes
          </Link>

          <hr className="admin-divider" />

          <Link to="/" className="admin-nav-item nav-tienda">
            🏠 Volver a la Tienda
          </Link>
          
          <button onClick={handleLogout} className="admin-nav-item btn-logout-admin">
            🚪 Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}