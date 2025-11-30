import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
    <footer className="footer-container">

      {/* Enlaces de navegación */}
        <nav className="footer-links">
        <Link to="/">Inicio</Link>
        <span> | </span>
        <Link to="/productos">Productos</Link>
        <span> | </span>
        <Link to="/blog">Blog</Link>
        <span> | </span>
        <Link to="/contacto">Contacto</Link>
        </nav>

      {/* Redes sociales */}
        <div className="social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            <i className="bi bi-facebook"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <i className="bi bi-instagram"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <i className="bi bi-twitter"></i>
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            <i className="bi bi-youtube"></i>
        </a>
        </div>

      {/* Newsletter */}
        <div className="newsletter">
        <p>Suscríbete a nuestro boletín:</p>
        <div className="newsletter-box">
            <input 
            type="email" 
            placeholder="Ingresa tu correo" 
            aria-label="Correo para suscripción"
            />
            <button className="btn-newsletter">Suscribirse</button>
        </div>
        </div>

      {/* Derechos */}
        <p className="footer-copy">
        © 2025 Pastelería Hikari — Todos los derechos reservados 🍰
        </p>
    </footer>
    );
};

export default Footer;
