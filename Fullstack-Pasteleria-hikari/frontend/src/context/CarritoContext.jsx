// src/context/CarritoContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const normalizarProducto = (p) => {
    if (!p) return null;
    return {
      id: Number(p.id ?? p._id ?? p.id_producto ?? 0),
      nombre: String(p.nombre ?? p.title ?? p.name ?? "Producto"),
      precio: Number(p.precio ?? p.price ?? p.cost ?? 0) || 0,
      imagen: p.imagen ?? p.image ?? "",
      cantidad: Math.max(1, Number(p.cantidad ?? p.cant ?? p.qty ?? 1) || 1),
    };
  };

  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      const map = new Map();
      parsed.forEach((raw) => {
        const p = normalizarProducto(raw);
        if (!p) return;
        if (map.has(p.id)) {
          const prev = map.get(p.id);
          prev.cantidad += p.cantidad;
          map.set(p.id, prev);
        } else {
          map.set(p.id, p);
        }
      });
      return Array.from(map.values());
    } catch (e) {
      console.error("Error parsing carrito from localStorage:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (e) {
      console.error("Error saving carrito:", e);
    }
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const p = normalizarProducto(producto);
    if (!p || p.id === 0) return;
    const cant = Math.max(1, Number(cantidad) || 1);

    setCarrito((prev) => {
      const idx = prev.findIndex((it) => it.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cant };
        return next;
      }
      return [...prev, { ...p, cantidad: cant }];
    });
  };

  const actualizarCantidad = (id, cantidad) => {
    const nueva = Math.max(1, Number(cantidad) || 1);
    setCarrito((prev) =>
      prev.map((it) => (it.id === Number(id) ? { ...it, cantidad: nueva } : it))
    );
  };

  const eliminarItem = (id) =>
    setCarrito((prev) => prev.filter((it) => it.id !== Number(id)));

  const vaciarCarrito = () => setCarrito([]);

  // 🧠 useMemo - Totales dinámicos
  const totalCantidad = useMemo(
    () => carrito.reduce((sum, it) => sum + (Number(it.cantidad) || 0), 0),
    [carrito]
  );

  const totalPrecio = useMemo(
    () =>
      carrito.reduce(
        (sum, it) =>
          sum +
          (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
        0
      ),
    [carrito]
  );

  // 🔥 👉 NUEVO: función auxiliar para forzar actualización (solo para test)
  const recargar = () => setCarrito((prev) => [...prev]);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarItem,
        vaciarCarrito,
        totalCantidad,
        totalPrecio,
        recargar, // 👈 Importante para Test Renderer
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
