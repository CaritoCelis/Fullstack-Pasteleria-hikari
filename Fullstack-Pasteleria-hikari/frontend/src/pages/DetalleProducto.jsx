// src/pages/DetalleProducto.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";

import "../styles/detalle_producto.css";
import "../styles/productos.css";
import "../styles/styles.css";

export default function DetalleProducto() {
    const { id } = useParams();
    const { agregarAlCarrito } = useContext(CarritoContext);

    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const response = await api.get(`/productos/${id}`);
                setProducto(response.data);
            } catch (error) {
                console.error("Error cargando producto:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarProducto();
    }, [id]);

    if (loading) {
        return (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
                Cargando...
            </p>
        );
    }

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
                    <img src={producto.imageUrl} alt={producto.name} />
                </div>

                <div className="info-producto">
                    <h2>{producto.name}</h2>

                    <p className="descripcion">{producto.description}</p>

                    <p className="precio">${Number(producto.price).toLocaleString()}</p>

                    <div className="cantidad-container">
                        <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}>-</button>
                        <span>{cantidad}</span>
                        <button onClick={() => setCantidad((c) => c + 1)}>+</button>
                    </div>

                    <button
                        className="btn-carrito"
                        onClick={() => agregarAlCarrito({
                            id: producto.id,
                            nombre: producto.name,
                            precio: producto.price,
                            imagen: producto.imageUrl
                        }, cantidad)}
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