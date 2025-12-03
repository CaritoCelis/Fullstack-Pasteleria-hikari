// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Al montar el componente, recuperar sesión del localStorage
  useEffect(() => {
    const recuperarSesion = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        // ✅ Verificar si el token está expirado
        if (isTokenExpired(token)) {
          console.log("Token expirado, limpiando sesión");
          logout();
          setLoading(false);
          return;
        }

        // ✅ NUEVO: Obtener datos actualizados del usuario desde el backend
        try {
          const response = await fetch("http://localhost:8080/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const datosUsuario = await response.json();
            setUsuario({ ...datosUsuario, token });
            localStorage.setItem("usuario", JSON.stringify({ ...datosUsuario, token }));
          } else {
            // Si el token no es válido, cerrar sesión
            logout();
          }
        } catch (error) {
          console.error("Error al validar sesión:", error);
          // Mantener la sesión local si hay error de red
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

  // 🔹 Función para verificar si el token está expirado
  const isTokenExpired = (token) => {
    try {
      // JWT tiene 3 partes: header.payload.signature
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= exp;
    } catch (error) {
      console.error("Error verificando token:", error);
      return true; // Si hay error, asumir que está expirado
    }
  };

  // 🔹 Login: guardar usuario y token
  const login = (datosUsuario) => {
    try {
      // ✅ Asegurar que el usuario tenga todos los campos necesarios
      const usuarioCompleto = {
        id: datosUsuario.id,
        username: datosUsuario.username,
        email: datosUsuario.email,
        nombre: datosUsuario.nombre || "",
        apellido: datosUsuario.apellido || "",
        fechaNacimiento: datosUsuario.fechaNacimiento || "",
        roles: datosUsuario.roles || [],
        token: datosUsuario.token
      };

      setUsuario(usuarioCompleto);
      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
      localStorage.setItem("token", usuarioCompleto.token);
      
      console.log("Sesión iniciada correctamente:", usuarioCompleto);
    } catch (error) {
      console.error("Error al guardar sesión:", error);
    }
  };

  // 🔹 Logout: limpiar TODO
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    console.log("Sesión cerrada");
  };

  // 🔹 Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!usuario || !usuario.roles) return false;
    return usuario.roles.includes(role);
  };

  // 🔹 Obtener el token actual
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ✅ NUEVO: Actualizar datos del usuario (útil después de editar perfil)
  const actualizarUsuario = (nuevosDatos) => {
    const usuarioActualizado = { ...usuario, ...nuevosDatos };
    setUsuario(usuarioActualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
  };

  const value = {
    usuario,
    login,
    logout,
    hasRole,
    getToken,
    actualizarUsuario,
    loading,
    isAuthenticated: !!usuario
  };

  // Mostrar loading mientras recupera la sesión
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