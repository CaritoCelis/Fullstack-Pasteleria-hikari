import React, { useEffect, useState } from "react";
import "../styles/perfilUsuario.css";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: "",
    tarjeta: "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosCheckout"));
    const pedidosGuardados = JSON.parse(localStorage.getItem("historialPedidos"));

    if (datosGuardados) setUsuario(datosGuardados);
    if (pedidosGuardados) setPedidos(pedidosGuardados);
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    localStorage.setItem("datosCheckout", JSON.stringify(usuario));
    setModoEdicion(false);
    alert("✔ Datos actualizados correctamente.");
  };

  return (
    <div className="perfil-container">
      <h2>👤 Mi Perfil</h2>

      {/* Información Personal */}
      <div className="perfil-card">
        <h3>📌 Información Personal</h3>

        {modoEdicion ? (
          <>
            <input name="nombre" value={usuario.nombre} onChange={handleChange} />
            <input name="apellido" value={usuario.apellido} onChange={handleChange} />
            <input name="email" value={usuario.email} onChange={handleChange} />
            <input name="telefono" value={usuario.telefono} onChange={handleChange} />
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          </>
        )}
      </div>

      {/* Dirección */}
      <div className="perfil-card">
        <h3>🏠 Dirección de Envío</h3>
        {modoEdicion ? (
          <>
            <input name="direccion" value={usuario.direccion} onChange={handleChange} />
            <input name="comuna" value={usuario.comuna} onChange={handleChange} />
            <input name="region" value={usuario.region} onChange={handleChange} />
          </>
        ) : (
          <p>{usuario.direccion}, {usuario.comuna}, {usuario.region}</p>
        )}
      </div>

      {/* Método de Pago */}
      <div className="perfil-card">
        <h3>💳 Tarjeta Registrada</h3>
        {modoEdicion ? (
          <input
            name="tarjeta"
            value={usuario.tarjeta}
            onChange={handleChange}
            placeholder="**** **** **** 1234"
          />
        ) : (
          <p>{usuario.tarjeta ? usuario.tarjeta : "No hay tarjeta registrada."}</p>
        )}
      </div>

      {/* Botones Editar / Guardar */}
      <div className="btn-contenedor">
        {modoEdicion ? (
          <button onClick={guardarCambios} className="btn-guardar">💾 Guardar Cambios</button>
        ) : (
          <button onClick={() => setModoEdicion(true)} className="btn-editar">✏️ Editar Perfil</button>
        )}
      </div>

      {/* Historial de Pedidos */}
      <div className="perfil-card">
        <h3>🛍️ Historial de Pedidos</h3>
        {pedidos.length === 0 ? (
          <p>No hay pedidos registrados.</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-box">
              <p><strong>Pedido N°:</strong> {pedido.id}</p>
              <p><strong>Fecha:</strong> {pedido.fecha}</p>
              <p><strong>Total:</strong> ${pedido.total.toLocaleString()} CLP</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <ul>
                {pedido.productos?.map((prod, idx) => (
                  <li key={idx}>{prod.nombre} x{prod.cantidad}</li>
                ))}
              </ul>
              <button onClick={() => window.open(pedido.boleta, "_blank")} className="boton-boleta">
                📄 Descargar Boleta
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
