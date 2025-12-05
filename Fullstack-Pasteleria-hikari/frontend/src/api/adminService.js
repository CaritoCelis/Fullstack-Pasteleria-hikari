// src/services/adminService.js
import api from "../api/api";

// Dashboard - Estadísticas generales
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Usuarios
export const getUsuarios = async () => {
  const response = await api.get("/admin/usuarios");
  return response.data;
};

// Productos
export const getProductosAdmin = async () => {
  const response = await api.get("/productos");
  return response.data;
};

export const crearProducto = async (producto) => {
  const response = await api.post("/productos", producto);
  return response.data;
};

export const actualizarProducto = async (id, producto) => {
  const response = await api.put(`/productos/${id}`, producto);
  return response.data;
};

export const eliminarProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

// Pedidos
export const getPedidos = async () => {
  const response = await api.get("/admin/pedidos");
  return response.data;
};

export const actualizarEstadoPedido = async (id, estado) => {
  const response = await api.put(`/admin/pedidos/${id}/estado`, { estado });
  return response.data;
};

// Mensajes de contacto
export const getMensajes = async () => {
  const response = await api.get("/admin/mensajes");
  return response.data;
};

export const marcarMensajeLeido = async (id) => {
  const response = await api.put(`/admin/mensajes/${id}/marcar-leido`);
  return response.data;
};

// Pagos
export const getPagos = async () => {
  const response = await api.get("/admin/pagos");
  return response.data;
};