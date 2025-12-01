import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // ✅ USAR CONTEXTO

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const usuarioRegistrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

    // Validación de login
    if (
      usuarioRegistrado &&
      usuarioRegistrado.email === email &&
      usuarioRegistrado.password === password
    ) {

      localStorage.setItem("usuario", JSON.stringify(usuarioRegistrado));

      login(usuarioRegistrado);  // ✅  ACTUALIZA EL CONTEXTO

      navigate("/"); // Ir al home
    } else {
      setError("Correo o contraseña incorrectos");
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
