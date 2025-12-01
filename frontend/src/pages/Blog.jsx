// src/usuario/pages/Blog.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/styles.css";
import "../styles/blog.css";


const noticias = [
    {
        id: 34,
        titulo: "El pastel más grande del país, creado por Hikari 🎂",
        texto: "En un evento inolvidable, Pastelería Hikari preparó un pastel de 5 metros de largo...",
        imgs: [
            process.env.PUBLIC_URL + "/img/grande_2.jpg",
            process.env.PUBLIC_URL + "/img/grande_3.jpg"
        ],
    },
    {
        id: 35,
        titulo: "Curiosidad: La miel prolonga la frescura de los panes 🍯",
        texto: "En nuestra panadería, usamos miel natural en algunas recetas...",
        imgs: [
            process.env.PUBLIC_URL + "/img/miel.jpg"
        ],
    },
    {
        id: 36,
        titulo: "Novedad: Cheesecake de temporada 🍓🍫",
        texto: "Hikari presenta su nueva línea de cheesecakes artesanales...",
        imgs: [
            process.env.PUBLIC_URL + "/img/cheesecake_5.jpeg",
            process.env.PUBLIC_URL + "/img/cheesecake_6.jpeg",
            process.env.PUBLIC_URL + "/img/cheesecake_7.jpeg",
            process.env.PUBLIC_URL + "/img/cheesecake_9.jpeg"
        ],
    },
    {
        id: 37,
        titulo: "Dato curioso: El pan integral y sus beneficios 🌾🍞",
        texto: "El pan integral se elabora con granos enteros...",
        imgs: [
            process.env.PUBLIC_URL + "/img/panes.jpg"
        ],
    },
];


export default function Blog() {
    return (
        <>
            <header className="blog-header">
                <h1>
                    Blog de <span className="resaltado">Pastelería Hikari</span>
                </h1>
                <p>Descubre noticias, curiosidades y secretos dulces para endulzar tu día 🍰</p>
            </header>

            <main>
                {noticias.map((n) => (
                    <article key={n.id} className="bloque-noticia">
                        <div className="imagenes-noticia">
                            {n.imgs.map((img, idx) => (
                                <img key={idx} src={img} alt={n.titulo} className="imagen-noticia" />
                            ))}
                        </div>

                        <div className="contenido">
                            <h2>{n.titulo}</h2>
                            <p>{n.texto}</p>
                            <Link to={`/blog/${n.id}`} className="btn-ver-mas">
                                Ver más
                            </Link>
                        </div>
                    </article>
                ))}
            </main>
        </>
    );
}
