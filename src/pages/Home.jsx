// src/pages/Home.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import { productosData } from "../data/productos";

import "../styles/home.css";
import "../styles/styles.css";
import "../styles/header.css";

export default function Home() {
    const { agregarAlCarrito } = useContext(CarritoContext);

    return (
        <>
            {/* Banner */}
            <div className="banner">
                <img src="/img/fondo_5.jpg" alt="Banner Pastelería Hikari" />
            </div>

            {/* Título */}
            <div className="productos-titulo">
                <h2>🍰 Productos Destacados</h2>
                <h3>Endulza tus momentos con la mejor repostería artesanal</h3>
            </div>

            {/* Grid productos inicio */}
            <section className="grid-home-productos">
                {productosData.slice(0, 12).map((p) => (
                    <div className="home-producto" key={p.id}>
                        <Link to={`/detalle/${p.id}`}>
                            <img
                                src={p.imagen}
                                alt={p.nombre}
                                className="home-producto-img"
                            />
                        </Link>

                        <h3>{p.nombre}</h3>
                        <p className="precio">${p.precio.toLocaleString()}</p>

                        <div className="acciones-producto">
                            <button onClick={() => agregarAlCarrito(p)}>
                                Añadir al carrito
                            </button>

                            <Link to={`/detalle/${p.id}`} className="detalle">
                                Detalle
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}
