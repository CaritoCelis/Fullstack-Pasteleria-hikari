// src/pages/Productos.jsx
import React, { useContext } from "react";
import ProductoCard from "../components/ProductoCard";
import { productosData } from "../data/productos";
import { CarritoContext } from "../context/CarritoContext";

import "../styles/productos.css";

export default function Productos() {
  const { agregarAlCarrito } = useContext(CarritoContext);

  return (
    <main className="productos-container">
      <h1>Nuestros Productos</h1>

      <div className="lista-productos">
        {productosData.map((producto) => (
          <ProductoCard
          key={producto.id}
          producto={producto}
          agregarAlCarrito={agregarAlCarrito}
        />
        ))}
      </div>
    </main>
  );
}
