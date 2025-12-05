import React from "react";
import { Routes, Route } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout"; // ← NUEVO
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Blog from "./pages/Blog";
import DetalleBlog from "./pages/DetalleBlog";
import Contacto from "./pages/Contacto";
import PrivateRoute from "./components/PrivateRoute";
import PerfilUsuario from "./pages/PerfilUsuario";

import Checkout from "./pages/Checkout";
import FormPagoEnvio from "./pages/FormPagoEnvio";
import Confirmacion from "./pages/Confirmacion";
import PagoExitoso from "./pages/PagoExitoso";
import PagoCancelado from "./pages/PagoCancelado";

// Rutas de Admin
import Dashboard from "./pages/Admin/Dashboard";
import AdminProductos from "./pages/Admin/AdminProductos";
import AdminPedidos from "./pages/Admin/AdminPedidos";
import AdminMensajes from "./pages/Admin/AdminMensajes";

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Routes>
          {/* ========== RUTAS PÚBLICAS CON LAYOUT NORMAL ========== */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Productos />} />
            <Route path="detalle/:id" element={<DetalleProducto />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="perfil" element={<PerfilUsuario />} />

            {/* Rutas protegidas de Checkout */}
            <Route
              path="checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="checkout/datos"
              element={
                <PrivateRoute>
                  <FormPagoEnvio />
                </PrivateRoute>
              }
            />
            <Route
              path="checkout/confirmar"
              element={
                <PrivateRoute>
                  <Confirmacion />
                </PrivateRoute>
              }
            />

            {/* Rutas de resultado de pago */}
            <Route path="pago-exitoso" element={<PagoExitoso />} />
            <Route path="pago-cancelado" element={<PagoCancelado />} />

            {/* Login y registro */}
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            {/* Blog */}
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<DetalleBlog />} />

            <Route path="contacto" element={<Contacto />} />

            {/* 404 */}
            <Route path="*" element={<h1>Página no encontrada</h1>} />
          </Route>

          {/* ========== RUTAS DE ADMIN CON ADMINLAYOUT ========== */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["ROLE_ADMIN"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="mensajes" element={<AdminMensajes />} />
          </Route>
        </Routes>
      </CarritoProvider>
    </AuthProvider>
  );
}