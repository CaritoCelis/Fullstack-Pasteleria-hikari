// src/components/ProductoCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductoCard = ({ producto, agregarAlCarrito }) => {
    return (
    <div className="producto">
      {/* usa el campo 'imagen' tal cual viene en productosData */}
        <img src={producto.imagen} alt={producto.nombre} />

        <h3>{producto.nombre}</h3>

        <p className="precio">
        ${Number(producto.precio).toLocaleString("es-CL")}
        </p>

        <div className="acciones-producto">
        {/* PASA el producto COMPLETO */}
        <button onClick={() => agregarAlCarrito(producto)}>
            Añadir al carrito
        </button>

        <Link to={`/detalle/${producto.id}`} className="detalle">
            Ver detalle
        </Link>
        </div>
    </div>
    );
};

export default ProductoCard;
