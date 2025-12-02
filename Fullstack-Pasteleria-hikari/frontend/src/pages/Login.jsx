import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api.js";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username: email,
        password: password
      });

      const data = response.data;

      // ✅ CORREGIDO: Guardar TODOS los datos que devuelve el backend
      const usuarioCompleto = {
        username: data.username,
        email: data.email,
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        fechaNacimiento: data.fechaNacimiento || "",
        token: data.token
      };

      // Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

      // ✅ Actualizar contexto con TODOS los datos
      login(usuarioCompleto);

      console.log("Login exitoso:", usuarioCompleto);
      navigate("/");

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("Error conectando con el servidor");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form" noValidate>
          <label className="field">
            <span className="label-text">Correo electrónico</span>
            <input
              type="email"
              placeholder="tunombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="label-text">Contraseña</span>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          <button type="submit" className="btn-login">Iniciar sesión</button>
        </form>

        <p className="small">
          ¿No tienes cuenta? <a href="/registro" className="link-reg">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;