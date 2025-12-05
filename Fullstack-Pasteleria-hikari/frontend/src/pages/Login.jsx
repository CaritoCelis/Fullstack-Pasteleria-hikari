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
      // 1️⃣ Primer paso: Login y obtener token
      const response = await api.post("/auth/login", {
        username: email,
        password: password
      });

      const data = response.data;
      console.log("✅ Login exitoso:", data);

      // 2️⃣ Segundo paso: Obtener roles del usuario usando el token
      const meResponse = await api.get("/auth/me", {
        headers: { 
          Authorization: `Bearer ${data.token}` 
        }
      });

      console.log("✅ Datos completos con roles:", meResponse.data);

      // 3️⃣ Construir objeto usuario completo CON roles
      const usuarioCompleto = {
        id: meResponse.data.id,
        username: meResponse.data.username,
        email: meResponse.data.email,
        nombre: meResponse.data.nombre || "",
        apellido: meResponse.data.apellido || "",
        fechaNacimiento: meResponse.data.fechaNacimiento || "",
        roles: meResponse.data.roles || [], // ✅ AHORA SÍ TIENE ROLES
        token: data.token
      };

      console.log("👤 Usuario completo guardado:", usuarioCompleto);
      console.log("🔍 Roles del usuario:", usuarioCompleto.roles);

      // 4️⃣ Guardar en localStorage y contexto
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
      login(usuarioCompleto);

      // 5️⃣ Verificar si es admin y redirigir
      const esAdmin = usuarioCompleto.roles.includes("ROLE_ADMIN");
      console.log("🔐 ¿Es administrador?", esAdmin);

      if (esAdmin) {
        console.log("➡️ Redirigiendo al panel admin");
        navigate("/admin");
      } else {
        console.log("➡️ Redirigiendo al inicio");
        navigate("/");
      }

    } catch (err) {
      console.error("❌ Error en login:", err);
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