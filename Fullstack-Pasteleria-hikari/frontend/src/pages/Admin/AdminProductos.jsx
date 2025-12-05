// src/pages/Admin/AdminProductos.jsx
import React, { useState, useEffect } from "react";
import {
  getProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../api/adminService";
import "../../styles/Admin.css";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: ""
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductosAdmin();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mapear campos español -> inglés para el backend
      const productoParaBackend = {
        name: formData.nombre,
        description: formData.descripcion,
        price: formData.precio,
        imageUrl: formData.imagen
      };

      if (editando) {
        await actualizarProducto(editando.id, productoParaBackend);
        alert("✅ Producto actualizado correctamente");
      } else {
        await crearProducto(productoParaBackend);
        alert("✅ Producto creado correctamente");
      }

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: ""
      });
      setEditando(null);
      setMostrarForm(false);
      cargarProductos();
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("❌ Error al guardar producto");
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto);
    setFormData({
      nombre: producto.name,
      descripcion: producto.description,
      precio: producto.price,
      imagen: producto.imageUrl
    });
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await eliminarProducto(id);
      alert("✅ Producto eliminado correctamente");
      cargarProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("❌ Error al eliminar producto");
    }
  };

  const handleCancelar = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: ""
    });
    setEditando(null);
    setMostrarForm(false);
  };

  if (loading) {
    return <div className="admin-loading">Cargando productos...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🧁 Gestión de Productos</h1>
        <button
          className="btn-nuevo"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>{editando ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
          <form onSubmit={handleSubmit} className="producto-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Precio (CLP):</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>URL de Imagen:</label>
              <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar">
                {editando ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="productos-tabla">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>
                  {prod.imageUrl && (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{prod.name}</td>
                <td>
                  ${prod.price && !isNaN(prod.price) 
                  ? Number(prod.price).toLocaleString("es-CL") 
                  : "Sin precio"}
                </td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => handleEditar(prod)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(prod.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}