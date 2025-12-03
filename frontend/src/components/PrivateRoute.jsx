// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a proteger
 * @param {string[]} props.roles - Roles permitidos (opcional)
 */
export default function PrivateRoute({ children, roles = [] }) {
  const { usuario } = useContext(AuthContext);

  // 1. Si no hay usuario, redirige al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay restricción de roles, verificar que el usuario tenga alguno
  if (roles.length > 0) {
    const userRoles = usuario.roles || [];
    const hasPermission = roles.some(role => 
      userRoles.includes(role)
    );

    // Si no tiene el rol necesario, redirige al home
    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  // 3. Si todo está ok, renderiza el componente hijo
  return children;
}

// Ejemplo de uso con roles:
// <PrivateRoute roles={["ROLE_ADMIN"]}>
//   <AdminPanel />
// </PrivateRoute>