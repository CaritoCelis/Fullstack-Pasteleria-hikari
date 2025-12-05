// src/pages/Admin/AdminMensajes.jsx
import React, { useState, useEffect } from "react";
import { getMensajes, marcarMensajeLeido } from "../../api/adminService";
import "../../styles/Admin.css";

export default function AdminMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cargarMensajes = async () => {
    try {
      const data = await getMensajes();
      setMensajes(data);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      alert("Error al cargar mensajes");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarLeido = async (id) => {
    try {
      await marcarMensajeLeido(id);
      cargarMensajes();
    } catch (error) {
      console.error("Error marcando mensaje como leído:", error);
    }
  };

  const handleVerMensaje = (mensaje) => {
    setMensajeSeleccionado(mensaje);
    if (!mensaje.leido) {
      handleMarcarLeido(mensaje.id);
    }
  };

  if (loading) {
    return <div className="admin-loading">Cargando mensajes...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>💬 Mensajes de Contacto</h1>
        <p>
          Total: {mensajes.length} |{" "}
          <strong>
            Sin leer: {mensajes.filter((m) => !m.leido).length}
          </strong>
        </p>
      </div>

      <div className="mensajes-grid">
        <div className="mensajes-lista">
          {mensajes.length === 0 ? (
            <p className="sin-mensajes">No hay mensajes</p>
          ) : (
            mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`mensaje-item ${!mensaje.leido ? "no-leido" : ""} ${
                  mensajeSeleccionado?.id === mensaje.id ? "activo" : ""
                }`}
                onClick={() => handleVerMensaje(mensaje)}
              >
                <div className="mensaje-header">
                  <strong>{mensaje.nombre}</strong>
                  {!mensaje.leido && <span className="badge-nuevo">Nuevo</span>}
                </div>
                <p className="mensaje-asunto">{mensaje.asunto}</p>
                <p className="mensaje-fecha">
                  {mensaje.fechaEnvio
                    ? new Date(mensaje.fechaEnvio).toLocaleString("es-CL")
                    : "Sin fecha"}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mensaje-detalle">
          {mensajeSeleccionado ? (
            <>
              <div className="detalle-header">
                <h2>{mensajeSeleccionado.asunto}</h2>
                <span
                  className={`badge ${
                    mensajeSeleccionado.leido ? "badge-leido" : "badge-no-leido"
                  }`}
                >
                  {mensajeSeleccionado.leido ? "Leído" : "No leído"}
                </span>
              </div>

              <div className="detalle-info">
                <p>
                  <strong>De:</strong> {mensajeSeleccionado.nombre}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${mensajeSeleccionado.email}`}>
                    {mensajeSeleccionado.email}
                  </a>
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {mensajeSeleccionado.fechaEnvio
                    ? new Date(mensajeSeleccionado.fechaEnvio).toLocaleString(
                        "es-CL"
                      )
                    : "Sin fecha"}
                </p>
              </div>

              <div className="detalle-mensaje">
                <h3>Mensaje:</h3>
                <p>{mensajeSeleccionado.mensaje}</p>
              </div>

              <div className="detalle-acciones">
                <a
                  href={`mailto:${mensajeSeleccionado.email}?subject=Re: ${mensajeSeleccionado.asunto}`}
                  className="btn-responder"
                >
                  📧 Responder
                </a>
              </div>
            </>
          ) : (
            <div className="sin-seleccion">
              <p>Selecciona un mensaje para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}