// src/context/PedidoContext.jsx
import React, { createContext, useState, useContext } from "react";

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
  const [pedido, setPedido] = useState(() => {
    return JSON.parse(localStorage.getItem("pedido")) || null;
  });

  const guardarPedido = (nuevoPedido) => {
    setPedido(nuevoPedido);
    localStorage.setItem("pedido", JSON.stringify(nuevoPedido));
  };

  return (
    <PedidoContext.Provider value={{ pedido, guardarPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedido = () => useContext(PedidoContext);
