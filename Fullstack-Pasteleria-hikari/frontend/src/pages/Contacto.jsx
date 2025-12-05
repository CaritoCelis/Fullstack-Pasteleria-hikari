import React, { useState } from "react";
import axios from "axios";
import "../styles/contacto.css";
import "../styles/styles.css";

export default function Contacto() {
    const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
        const response = await axios.post("http://localhost:8081/api/contacto", form);
    
    // La respuesta ya viene en response.data
        setAlert({ tipo: "success", mensaje: "✅ " + response.data.message });
        setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
    
        } catch (error) {
        const mensaje = error.response?.data?.message || "Error al enviar el mensaje";
        setAlert({ tipo: "error", mensaje: "❌ " + mensaje });
        } finally {
        setLoading(false);
    }
    };

    return (
        <main className="contacto-container">
            <h1>Contáctanos</h1>
            <p className="intro">
                ¿Tienes dudas, pedidos especiales o comentarios? Escríbenos y te responderemos lo antes posible.
            </p>

            {alert && (
                <div className={`alert ${alert.tipo}`}>
                    {alert.mensaje}
                </div>
            )}

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
                    <small>Debe estar registrado en el sistema</small>
                </div>

                <div className="form-group">
                    <label htmlFor="asunto">Asunto:</label>
                    <input
                        type="text"
                        id="asunto"
                        value={form.asunto}
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

                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                </button>
            </form>
        </main>
    );
}