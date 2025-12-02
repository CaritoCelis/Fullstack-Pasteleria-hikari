import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-6 flex flex-col items-center gap-6 w-full">

      {/* Información de la pastelería */}
      <div className="info-extra text-center">
        <h2 className="text-lg font-semibold">📍 Nuestra tienda</h2>
        <p>Av. Pastelillo 860, Santiago, Chile</p>
        <p>Tel: +56 9 1234 5678</p>
        <p>Email: contacto@pasteleriahikari.cl</p>
        <p>© 2025 Pastelería Hikari — Todos los derechos reservados 🍰</p>
      </div>
    </footer>
  );
};

export default Footer;
