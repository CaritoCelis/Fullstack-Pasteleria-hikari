// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        if (isTokenExpired(token)) {
          console.log("Token expirado, limpiando sesión");
          logout();
          setLoading(false);
          return;
        }

        try {
          const response = await api.get("/usuarios/me");
          
          if (response.data) {
            const datosUsuario = response.data;
            setUsuario({ ...datosUsuario, token });
            localStorage.setItem("usuario", JSON.stringify({ ...datosUsuario, token }));
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error al validar sesión:", error);
          const usuarioGuardado = localStorage.getItem("usuario");
          if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
          }
        }
      } catch (error) {
        console.error("Error recuperando sesión:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    recuperarSesion();
  }, []);

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      console.error("Error verificando token:", error);
      return true;
    }
  };

  const login = (datosUsuario) => {
    try {
      const usuarioCompleto = {
        id: datosUsuario.id,
        username: datosUsuario.username,
        email: datosUsuario.email,
        nombre: datosUsuario.nombre || "",
        apellido: datosUsuario.apellido || "",
        roles: datosUsuario.roles || [],
        token: datosUsuario.token
      };

      setUsuario(usuarioCompleto);
      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
      localStorage.setItem("token", usuarioCompleto.token);
      
      console.log("Sesión iniciada:", usuarioCompleto);
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    console.log("Sesión cerrada");
  };

  const isAdmin = () => {
    if (!usuario || !usuario.roles) return false;
    return usuario.roles.some(role => 
      role.nombre === "ROLE_ADMIN" || role === "ROLE_ADMIN"
    );
  };

  const hasRole = (roleName) => {
    if (!usuario || !usuario.roles) return false;
    return usuario.roles.some(role => 
      role.nombre === roleName || role === roleName
    );
  };

  const value = {
    usuario,
    login,
    logout,
    hasRole,
    isAdmin,
    loading,
    isAuthenticated: !!usuario
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Poppins, sans-serif',
        color: '#d06992'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}