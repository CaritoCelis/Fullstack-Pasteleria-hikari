// src/tests/productos.test.jsx

describe("ProductosService", () => {
    beforeEach(() => {
    // Mock global fetch
    global.fetch = jasmine.createSpy("fetch").and.returnValue(
        Promise.resolve({
        json: () =>
            Promise.resolve([
            { id: "1", nombre: "Pastel de Chocolate", precio: 5000 },
            ]),
        })
    );
    });

    it("debería obtener la lista de productos", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());

    expect(fetch).toHaveBeenCalled();
    expect(productos.length).toBeGreaterThan(0);
    expect(productos[0].nombre).toBe("Pastel de Chocolate");
    });
});
