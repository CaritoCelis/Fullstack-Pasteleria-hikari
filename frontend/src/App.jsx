import React from "react";
import { Routes, Route } from "react-router-dom";

import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
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

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Routes>
          {/* Layout envuelve todas las páginas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Productos />} />
            <Route path="detalle/:id" element={<DetalleProducto />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="perfil" element={<PerfilUsuario />} />

            {/* Rutas protegidas */}
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
        </Routes>
      </CarritoProvider>
    </AuthProvider>
  );
}
