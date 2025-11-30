import React from "react";
import { render, act } from "@testing-library/react";
import { CarritoProvider, CarritoContext } from "../context/CarritoContext";

describe("CarritoContext", () => {
  let contextValue;

  const TestComponent = () => (
    <CarritoContext.Consumer>
      {(value) => {
        contextValue = value;
        return null;
      }}
    </CarritoContext.Consumer>
  );

  beforeEach(() => {
    localStorage.clear();
    render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    );
  });

  it("agrega productos al carrito", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 });
    });
    expect(contextValue.carrito.length).toBe(1);
    expect(contextValue.carrito[0].nombre).toBe("Torta");
    expect(contextValue.carrito[0].cantidad).toBe(1);
  });

  it("acumula cantidad si el producto ya existe", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 });
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 }, 2);
    });
    expect(contextValue.carrito[0].cantidad).toBe(3);
  });

  it("actualiza cantidad correctamente", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 2, nombre: "Panqueque", precio: 2500 });
      contextValue.actualizarCantidad(2, 5);
    });
    expect(contextValue.carrito[0].cantidad).toBe(5);
  });

  it("elimina un producto del carrito", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 3, nombre: "Brownie", precio: 1500 });
      contextValue.eliminarItem(3);
    });
    expect(contextValue.carrito.length).toBe(0);
  });

  it("vacía el carrito", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 });
      contextValue.agregarAlCarrito({ id: 2, nombre: "Pie", precio: 3500 });
      contextValue.vaciarCarrito();
    });
    expect(contextValue.carrito.length).toBe(0);
  });

  it("calcula totalCantidad correctamente", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 }, 2);
      contextValue.agregarAlCarrito({ id: 2, nombre: "Pie", precio: 3500 }, 3);
    });
    expect(contextValue.totalCantidad).toBe(5);
  });

  it("calcula totalPrecio correctamente", () => {
    act(() => {
      contextValue.agregarAlCarrito({ id: 1, nombre: "Torta", precio: 5000 }, 2);
      contextValue.agregarAlCarrito({ id: 2, nombre: "Pie", precio: 3500 }, 1);
    });
    expect(contextValue.totalPrecio).toBe(13500);
  });
});
