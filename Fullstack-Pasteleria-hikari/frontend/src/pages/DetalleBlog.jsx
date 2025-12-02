// src/pages/DetalleBlog.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/detalle_blog.css";

const noticias = [
    {
        id: 34,
        titulo: "🎂 Pastelería Hikari deslumbra con un pastel de 5 metros en matrimonio",
        imagenes: ["/img/grande_2.jpg", "/img/grande_3.jpg"],
        contenido: `
            <p>¡Un momento que quedará en la memoria de todos! 💖</p>
            <p>Pastelería Hikari sorprendió con un <strong>pastel de 5 metros</strong> en un matrimonio realizado en Santiago, causando sensación entre los invitados.</p>
            
            <p>Este increíble pastel fue elaborado con cinco niveles, cada uno con un sabor diferente: chocolate belga, frutos rojos, vainilla clásica, caramelo salado y matcha japonés. Cada detalle fue hecho a mano por nuestros maestros pasteleros.</p>

            <h3>✨ ¿Sabías que…?</h3>
            <ul>
                <li>El pastel pesó más de <strong>95 kilos</strong>.</li>
                <li>Tomó <strong>46 horas de trabajo</strong> entre preparación y montaje.</li>
                <li>Incluyó luces LED internas y flores comestibles.</li>
            </ul>

            <h3>💡 Tip del maestro pastelero</h3>
            <p>Para pasteles altos, la clave es usar una estructura interna firme y mantener refrigeración por etapas. Esto evita que se desarme durante el montaje.</p>
        `
    },
    {
        id: 35,
        titulo: "Curiosidad: La miel prolonga la frescura de los panes 🍯",
        imagenes: ["/img/miel.jpg"],
        contenido: `
            <p>En nuestra panadería utilizamos <strong>miel natural</strong> para mejorar la frescura de algunos panes ¡y funciona increíble!</p>

            <p>La miel actúa como un humectante natural, evitando que el pan se endurezca rápidamente.</p>

            <h3>🍯 ¿Por qué funciona?</h3>
            <ul>
                <li>Retiene la humedad del pan.</li>
                <li>Contiene antioxidantes naturales.</li>
                <li>Aporta un sabor suave y ligeramente dulce.</li>
            </ul>

            <h3>✨ Dato curioso</h3>
            <p>En la antigüedad la miel se utilizaba para conservar alimentos por su capacidad antibacterial.</p>

            <h3>💡 Tip para casa</h3>
            <p>Reemplaza una cucharadita de azúcar por miel en tu pan casero: queda más esponjoso y se mantiene fresco por más tiempo.</p>
        `
    },
    {
        id: 36,
        titulo: "Novedad: Cheesecake de temporada 🍓🍫",
        imagenes: ["/img/cheesecake_5.jpeg", "/img/cheesecake_6.jpeg", "/img/cheesecake_7.jpeg", "/img/cheesecake_9.jpeg"],
        contenido: `
            <p>¡Llegaron los nuevos <strong>cheesecakes de temporada</strong>! Hikari presenta una línea de sabores elaborados con frutas frescas recogidas cada mañana.</p>

            <p>Los sabores destacados incluyen:</p>
            <ul>
                <li><strong>Frutilla fresca</strong> con salsa casera.</li>
                <li><strong>Chocolate intenso</strong> con base crocante.</li>
                <li><strong>Mix berries</strong> con arándanos, frambuesas y mora.</li>
            </ul>

            <h3>🍰 ¿Qué hace especial a nuestros cheesecakes?</h3>
            <ul>
                <li>Usamos queso crema suave de producción local.</li>
                <li>Las bases son horneadas artesanalmente.</li>
                <li>No llevan colorantes ni saborizantes artificiales.</li>
            </ul>

            <h3>💡 Tip dulce</h3>
            <p>Déjalo a temperatura ambiente por 10 minutos antes de comer: el sabor se vuelve más cremoso e intenso.</p>
        `
    },
    {
        id: 37,
        titulo: "Dato curioso: El pan integral y sus beneficios 🌾🍞",
        imagenes: ["/img/panes.jpg"],
        contenido: `
            <p>El pan integral es uno de los favoritos entre los clientes de Hikari, no solo por su sabor sino por sus beneficios nutricionales.</p>

            <p>Se elabora con <strong>granos enteros</strong> que conservan el salvado, germen y endospermo, lo que lo convierte en una opción más saludable.</p>

            <h3>🌾 Beneficios del pan integral</h3>
            <ul>
                <li>Aporta más fibra que el pan blanco.</li>
                <li>Mantiene la energía estable por más tiempo.</li>
                <li>Es rico en vitaminas del complejo B y minerales.</li>
            </ul>

            <h3>✨ Dato interesante</h3>
            <p>Los primeros panes creados por civilizaciones antiguas eran integrales, ya que no existía la harina refinada.</p>

            <h3>💡 Tip saludable</h3>
            <p>Para un desayuno perfecto: pan integral + palta + huevo o miel. Fácil, sabroso y nutritivo.</p>
        `
    }
];

export default function DetalleBlog() {
    const { id } = useParams();
    const noticia = noticias.find((n) => n.id === Number(id));

    if (!noticia) {
        return <h2>Noticia no encontrada</h2>;
    }

    return (
        <div className="detalle-blog">
            <h1 className="titulo-blog">{noticia.titulo}</h1>

            <div className="imagenes-blog">
                {noticia.imagenes.map((img, index) => (
                    <img key={index} src={img} alt={noticia.titulo} className="img-blog" />
                ))}
            </div>

            <div
                className="contenido-blog"
                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            ></div>

            {/* BOTÓN VOLVER AL BLOG */}
            <Link to="/blog" className="btn-volver-blog">
                ⬅ Volver al Blog
            </Link>
        </div>
    );
}
