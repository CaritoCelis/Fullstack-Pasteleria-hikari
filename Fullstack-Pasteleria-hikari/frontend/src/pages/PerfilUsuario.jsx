import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/perfilUsuario.css";

export default function PerfilUsuario() {
  const { usuario: usuarioAuth } = useContext(AuthContext);
  
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: "",
    tarjeta: "",
    fechaNacimiento: "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ Cargar datos del usuario desde el backend
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No hay token de sesión");
          setCargando(false);
          return;
        }

        const response = await fetch("http://localhost:8080/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Combinar datos del backend con datos locales (dirección, teléfono, etc.)
          const datosLocales = JSON.parse(localStorage.getItem("datosCheckout")) || {};
          
          setUsuario({
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            email: data.email || "",
            fechaNacimiento: data.fechaNacimiento || "",
            telefono: datosLocales.telefono || "",
            direccion: datosLocales.direccion || "",
            comuna: datosLocales.comuna || "",
            region: datosLocales.region || "",
            tarjeta: datosLocales.tarjeta || "",
          });
        } else {
          console.error("Error al cargar datos del usuario");
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      } finally {
        setCargando(false);
      }
    };

    // Cargar historial de pedidos
    const pedidosGuardados = JSON.parse(localStorage.getItem("historialPedidos"));
    if (pedidosGuardados) setPedidos(pedidosGuardados);

    cargarDatosUsuario();
  }, []);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    // Guardar datos locales (dirección, teléfono, tarjeta)
    const datosLocales = {
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      comuna: usuario.comuna,
      region: usuario.region,
      tarjeta: usuario.tarjeta,
    };
    
    localStorage.setItem("datosCheckout", JSON.stringify(datosLocales));
    setModoEdicion(false);
    alert("✔ Datos actualizados correctamente.");
  };

  if (cargando) {
    return (
      <div className="perfil-container">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <h2>👤 Mi Perfil</h2>

      {/* Información Personal */}
      <div className="perfil-card">
        <h3>📌 Información Personal</h3>

        {modoEdicion ? (
          <>
            <input name="nombre" value={usuario.nombre} onChange={handleChange} disabled />
            <input name="apellido" value={usuario.apellido} onChange={handleChange} disabled />
            <input name="email" value={usuario.email} onChange={handleChange} disabled />
            <input name="telefono" value={usuario.telefono} onChange={handleChange} placeholder="Teléfono" />
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono || "No registrado"}</p>
            {usuario.fechaNacimiento && (
              <p><strong>Fecha de Nacimiento:</strong> {new Date(usuario.fechaNacimiento).toLocaleDateString('es-CL')}</p>
            )}
          </>
        )}
      </div>

      {/* Dirección */}
      <div className="perfil-card">
        <h3>🏠 Dirección de Envío</h3>
        {modoEdicion ? (
          <>
            <input name="direccion" value={usuario.direccion} onChange={handleChange} placeholder="Dirección" />
            <input name="comuna" value={usuario.comuna} onChange={handleChange} placeholder="Comuna" />
            <input name="region" value={usuario.region} onChange={handleChange} placeholder="Región" />
          </>
        ) : (
          <p>
            {usuario.direccion || usuario.comuna || usuario.region
              ? `${usuario.direccion}, ${usuario.comuna}, ${usuario.region}`
              : "No hay dirección registrada"}
          </p>
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