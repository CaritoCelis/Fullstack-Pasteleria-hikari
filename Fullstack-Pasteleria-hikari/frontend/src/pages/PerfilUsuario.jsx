// src/pages/PerfilUsuario.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
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

        // ✅ CORREGIDO: Usar api (axios) en vez de fetch
        const response = await api.get("/usuarios/me");
        
        if (response.data) {
          const data = response.data;
          
          console.log("✅ Datos del usuario cargados:", data);
          
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
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
        
        // Si falla, intentar cargar desde localStorage
        const usuarioGuardado = localStorage.getItem("usuario");
        if (usuarioGuardado) {
          const data = JSON.parse(usuarioGuardado);
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
        }
      } finally {
        setCargando(false);
      }
    };

    // ✅ Cargar historial de pedidos desde el backend
    const cargarPedidos = async () => {
      try {
        const response = await api.get("/pedidos");
        console.log("✅ Pedidos cargados:", response.data);
        setPedidos(response.data);
      } catch (error) {
        console.error("❌ Error al cargar pedidos:", error);
        // Fallback: cargar desde localStorage
        const pedidosGuardados = JSON.parse(localStorage.getItem("historialPedidos")) || [];
        setPedidos(pedidosGuardados);
      }
    };

    cargarDatosUsuario();
    cargarPedidos();
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
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
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
            <div className="campo-form">
              <label>Nombre:</label>
              <input name="nombre" value={usuario.nombre} onChange={handleChange} disabled />
            </div>
            <div className="campo-form">
              <label>Apellido:</label>
              <input name="apellido" value={usuario.apellido} onChange={handleChange} disabled />
            </div>
            <div className="campo-form">
              <label>Email:</label>
              <input name="email" value={usuario.email} onChange={handleChange} disabled />
            </div>
            <div className="campo-form">
              <label>Teléfono:</label>
              <input name="telefono" value={usuario.telefono} onChange={handleChange} placeholder="Ingresa tu teléfono" />
            </div>
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
            <div className="campo-form">
              <label>Dirección:</label>
              <input name="direccion" value={usuario.direccion} onChange={handleChange} placeholder="Calle y número" />
            </div>
            <div className="campo-form">
              <label>Comuna:</label>
              <input name="comuna" value={usuario.comuna} onChange={handleChange} placeholder="Comuna" />
            </div>
            <div className="campo-form">
              <label>Región:</label>
              <input name="region" value={usuario.region} onChange={handleChange} placeholder="Región" />
            </div>
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
          <div className="campo-form">
            <label>Número de tarjeta:</label>
            <input
              name="tarjeta"
              value={usuario.tarjeta}
              onChange={handleChange}
              placeholder="**** **** **** 1234"
            />
          </div>
        ) : (
          <p>{usuario.tarjeta ? usuario.tarjeta : "No hay tarjeta registrada."}</p>
        )}
      </div>

      {/* Botones Editar / Guardar */}
      <div className="btn-contenedor">
        {modoEdicion ? (
          <>
            <button onClick={guardarCambios} className="btn-guardar">💾 Guardar Cambios</button>
            <button onClick={() => setModoEdicion(false)} className="btn-cancelar">❌ Cancelar</button>
          </>
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
              <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleDateString('es-CL')}</p>
              <p><strong>Total:</strong> ${pedido.total?.toLocaleString() || '0'} CLP</p>
              <p><strong>Estado:</strong> {pedido.status || 'PENDIENTE'}</p>
              {pedido.items && pedido.items.length > 0 && (
                <ul>
                  {pedido.items.map((item, idx) => (
                    <li key={idx}>{item.producto?.name || 'Producto'} x{item.quantity}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}