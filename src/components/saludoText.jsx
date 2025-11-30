// src/components/Saludo.test.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import Saludo from "../Saludo";

describe("Componente Saludo", () => {
    it("muestra el nombre correctamente", () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    root.render(<Saludo nombre="Caro" />);
    
    expect(container.textContent).toContain("Caro");
    });
});
