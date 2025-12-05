// src/services/paymentService.js
import api from "../api/api";

// Crear orden de pago en PayPal
export const crearPagoPayPal = async (pedidoId, monto) => {
  const response = await api.post("/pagos/crear", {
    pedidoId,
    monto
  });
  return response.data;
};

// Capturar pago después de que el usuario apruebe en PayPal
export const capturarPagoPayPal = async (orderId) => {
  const response = await api.post(`/pagos/capturar/${orderId}`);
  return response.data;
};

// Enviar mensaje de contacto
export const enviarMensajeContacto = async (mensaje) => {
  const response = await api.post("/contacto", mensaje);
  return response.data;
};