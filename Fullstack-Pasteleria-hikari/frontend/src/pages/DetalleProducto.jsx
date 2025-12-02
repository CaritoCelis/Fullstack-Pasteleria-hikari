// src/pages/DetalleProducto.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";

import "../styles/detalle_producto.css";
import "../styles/productos.css";
import "../styles/styles.css";

import { productosData } from "../data/productos";

export default function DetalleProducto() {
    const { id } = useParams();
    const { agregarAlCarrito } = useContext(CarritoContext);

    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
    const encontrado = productosData.find((p) => Number(p.id) === Number(id));
    setProducto(encontrado);
    }, [id]);




    if (!producto) {
        return (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
                Producto no encontrado ❌
            </p>
        );
    }

    return (
        <main className="detalle-producto-container">
            <div className="detalle-producto">

                <div className="imagen-producto">
                    <img src={producto.imagen} alt={producto.nombre} />
                </div>

                <div className="info-producto">
                    <h2>{producto.nombre}</h2>

                    <p className="descripcion">{producto.descripcion}</p>

                    <p className="precio">${producto.precio.toLocaleString()}</p>

                    <div className="cantidad-container">
                        <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}>-</button>

                        <span>{cantidad}</span>

                        <button onClick={() => setCantidad((c) => c + 1)}>+</button>
                    </div>

                    <button
                        className="btn-carrito"
                        onClick={() => agregarAlCarrito(producto, cantidad)}
                    >
                        Añadir al carrito
                    </button>

                    <Link className="volver" to="/productos">
                        ← Volver
                    </Link>
                </div>
            </div>
        </main>
    );
}
