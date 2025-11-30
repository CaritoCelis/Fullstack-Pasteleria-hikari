// src/pages/Contacto.jsx
import React, { useState, useEffect } from "react";

import "../styles/contacto.css";
import "../styles/styles.css";

// Estas claves buscan cualquier usuario guardado en tu Login/Registro
const USUARIO_KEYS = ["usuario", "usuarioActivo", "usuarioActual", "usuarioNombre"];

function findUsuario() {
    for (let key of USUARIO_KEYS) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        try {
            const obj = JSON.parse(raw);
            if (obj && (obj.nombre || obj.email)) {
                return { key, val: obj };
            }
        } catch {
            return { key, val: raw };
        }
    }
    return null;
}

export default function Contacto() {
    const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
    const [usuario, setUsuario] = useState(findUsuario());

    useEffect(() => {
        const handleStorage = () => setUsuario(findUsuario());
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { nombre, email, mensaje } = form;

        if (!nombre || !email || !mensaje) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const nuevoMensaje = {
            nombre,
            email,
            mensaje,
            fecha: new Date().toLocaleString()
        };

        const mensajes = JSON.parse(localStorage.getItem("mensajesContacto")) || [];
        mensajes.push(nuevoMensaje);
        localStorage.setItem("mensajesContacto", JSON.stringify(mensajes));

        alert(`¡Gracias por contactarnos, ${nombre}! 🍰 Pronto responderemos tu mensaje.`);

        setForm({ nombre: "", email: "", mensaje: "" });
    };

    return (
        <main className="contacto-container">
            <h1>Contáctanos</h1>

            <p className="intro">
                ¿Tienes dudas, pedidos especiales o comentarios? Escríbenos y te responderemos lo antes posible.
            </p>

            <form id="form-contacto" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mensaje">Mensaje:</label>
                    <textarea
                        id="mensaje"
                        rows="5"
                        value={form.mensaje}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <button type="submit">Enviar</button>
            </form>

            <div className="info-extra">
                <h2>📍 Nuestra tienda</h2>
                <p>Av. Pastelillo 860, Santiago, Chile</p>
                <p>Tel: +56 9 1234 5678</p>
                <p>Email: contacto@pasteleriahikari.cl</p>
            </div>
        </main>
    );
}
