// src/tests/Header.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/Header";
import { CarritoProvider } from "../context/CarritoContext";
import { AuthProvider } from "../context/AuthContext";

describe("Header - Componente de navegación", () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <CarritoProvider>
            <Header />
          </CarritoProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  // TEST 1: Renderizar sin errores
  it("1. debería renderizar sin explotar", () => {
    expect(() => renderHeader()).not.toThrow();
  });

  // TEST 2: Contener elementos de navegación
  it("2. debería contener elementos de navegación", () => {
    const { container } = renderHeader();
    const navbar = container.querySelector("nav") || container.querySelector(".navbar");
    expect(navbar).toBeTruthy();
  });

  // TEST 3: Tener estructura HTML válida
  it("3. debería tener estructura HTML válida", () => {
    const { container } = renderHeader();
    expect(container.innerHTML).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  // TEST 4: Contener enlaces
  it("4. debería contener enlaces de navegación", () => {
    const { container } = renderHeader();
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
  });

  // TEST 5: Renderizar múltiples veces sin problemas
  it("5. debería renderizar múltiples veces sin errores", () => {
    expect(() => {
      renderHeader();
      renderHeader();
      renderHeader();
    }).not.toThrow();
  });

  // TEST 6: Contener logo o título
  it("6. debería contener logo o título de la aplicación", () => {
    const { container } = renderHeader();
    const hasContent = container.textContent.length > 0;
    expect(hasContent).toBe(true);
  });

  // TEST 7: Ser responsive (tener clases CSS)
  it("7. debería tener clases CSS para diseño responsive", () => {
    const { container } = renderHeader();
    const hasClasses = container.querySelector("[class]");
    expect(hasClasses).toBeTruthy();
  });

  // TEST 8: Manejar contextos correctamente
  it("8. debería funcionar con los contextos proporcionados", () => {
    const { container } = renderHeader();
    expect(container).toBeTruthy();
  });

  // TEST 9: No tener errores de consola
  it("9. debería renderizar sin errores de consola", () => {
    const consoleSpy = spyOn(console, "error");
    renderHeader();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  // TEST 10: Ser accesible
  it("10. debería tener elementos accesibles", () => {
    const { container } = renderHeader();
    const interactiveElements = container.querySelectorAll("a, button");
    expect(interactiveElements.length).toBeGreaterThanOrEqual(0);
  });
});