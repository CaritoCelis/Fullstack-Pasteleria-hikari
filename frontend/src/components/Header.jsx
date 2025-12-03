import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";
import "../styles/responsividad.css";
import "../styles/header.css"; // Asegúrate de tener estilos de burbuja

const Header = () => {
  const [menuActivo, setMenuActivo] = useState(false);
  const { totalCantidad } = useContext(CarritoContext);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuActivo(!menuActivo);
  const closeMenu = () => setMenuActivo(false);

  const cerrarSesion = () => {
    logout?.();
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-titulo">
          <Link to="/" onClick={closeMenu}>
            <img src="/img/logo_5.png" alt="Logo Pastelería Hikari" width="120" />
          </Link>
          <div className="titulo-logo">Pastelería Hikari</div>
        </div>

        <button id="menu-toggle" aria-label="Abrir menú" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`menu-navegacion ${menuActivo ? "active" : ""}`}>
          <ul>
            {usuario?.nombre && (
              <li className="bienvenida">¡Bienvenido, {usuario.nombre}!</li>
            )}
            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/productos" onClick={closeMenu}>Productos</Link></li>
            <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
            <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>

            <li className="carrito-header">
              <Link to="/carrito" onClick={closeMenu}>
                🛒
                {totalCantidad > 0 && (
                  <span className="contador-carrito">{totalCantidad}</span>
                )}
              </Link>
            </li>

            {!usuario ? (
              <>
                <li><Link to="/login" onClick={closeMenu}>Iniciar sesión</Link></li>
                <li><Link to="/registro" onClick={closeMenu}>Registrarse</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/perfil" onClick={closeMenu}>Mi perfil</Link></li>
                <li>
                  <button className="btn-logout" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
