import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registro({ setUsuarioActivo }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    email: "",
    password: "",
    confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    const usuario = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        fechaNacimiento: formData.fechaNacimiento
    };

    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
    localStorage.setItem("usuario", JSON.stringify(usuario));
    if (setUsuarioActivo) setUsuarioActivo(usuario);

    navigate("/"); // Ir al Home
    };

    return (
    <div className="register-container">
        <h2>Crear Cuenta</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required />
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Registrarme</button>
        </form>
    </div>
    );
}

export default Registro;
