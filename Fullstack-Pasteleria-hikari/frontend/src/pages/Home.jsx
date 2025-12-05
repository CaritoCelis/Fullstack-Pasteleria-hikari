// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CarritoContext } from "../context/CarritoContext";
import api from "../api/api";
import "../styles/home.css";

export default function Home() {
    const { agregarAlCarrito } = useContext(CarritoContext);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await api.get("/productos");
                setProductos(response.data);
            } catch (error) {
                console.error("Error cargando productos:", error);
            }
        };
        cargarProductos();
    }, []);

    return (
        <>
            <div className="banner">
                <img src="/img/fondo_5.jpg" alt="Banner Pastelería Hikari" />
            </div>

            <div className="productos-titulo">
                <h2>🍰 Productos Destacados</h2>
                <h3>Endulza tus momentos con la mejor repostería artesanal</h3>
            </div>

            <section className="grid-home-productos">
                {productos.slice(0, 12).map((p) => (
                    <div className="home-producto" key={p.id}>
                        <Link to={`/detalle/${p.id}`}>
                            <img src={p.imageUrl} alt={p.name} className="home-producto-img" />
                        </Link>
                        <h3>{p.name}</h3>
                        <p className="precio">${p.price?.toLocaleString()}</p>
                        <div className="acciones-producto">
                            <button onClick={() => agregarAlCarrito({id: p.id, nombre: p.name, precio: p.price, imagen: p.imageUrl})}>
                                Añadir al carrito
                            </button>
                            <Link to={`/detalle/${p.id}`} className="detalle">Detalle</Link>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}