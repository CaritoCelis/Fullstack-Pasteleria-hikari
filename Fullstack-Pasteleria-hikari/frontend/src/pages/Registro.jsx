import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import "../styles/registro.css";

function Registro() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",      // 🔹 Campo username
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            // ✅ Usa /auth/register
            const response = await api.post("/auth/register", {
                username: formData.username || formData.email, // Si no hay username, usa email
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password,
                fechaNacimiento: formData.fechaNacimiento
            });

            console.log("Registro exitoso:", response.data);
            alert("✅ Usuario registrado exitosamente. Por favor inicia sesión.");
            navigate("/login");

        } catch (err) {
            console.error("Error en registro:", err);
            if (err.response?.data?.error) {
                const errorMsg = err.response.data.error;
                if (errorMsg === "username exists") {
                    setError("El nombre de usuario ya está en uso");
                } else if (errorMsg === "email exists") {
                    setError("El correo electrónico ya está registrado");
                } else {
                    setError(errorMsg);
                }
            } else {
                setError("Error de conexión con el servidor");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Crear Cuenta</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Nombre de usuario" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="apellido" 
                    placeholder="Apellido" 
                    value={formData.apellido} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="date" 
                    name="fechaNacimiento" 
                    value={formData.fechaNacimiento} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Correo electrónico" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Contraseña" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    minLength="6"
                />
                <input 
                    type="password" 
                    name="confirmPassword" 
                    placeholder="Confirmar contraseña" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Registrarme"}
                </button>
            </form>
            
            <p className="small">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
        </div>
    );
}

export default Registro;