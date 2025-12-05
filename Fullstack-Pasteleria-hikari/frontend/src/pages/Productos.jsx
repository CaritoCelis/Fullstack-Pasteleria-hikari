// src/pages/Productos.jsx
import React, { useContext, useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";
import "../styles/productos.css";

export default function Productos() {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await api.get("/productos");
        setProductos(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    cargarProductos();
  }, []);

  return (
    <main className="productos-container">
      <h1>Nuestros Productos</h1>
      <div className="lista-productos">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={{
              id: producto.id,
              nombre: producto.name,
              precio: producto.price,
              imagen: producto.imageUrl,
              descripcion: producto.description
            }}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>
    </main>
  );
}