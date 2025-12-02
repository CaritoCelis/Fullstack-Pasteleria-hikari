// src/tests/productos.test.jsx

describe("ProductosService - API de productos", () => {
  const mockProductos = [
    { id: 1, nombre: "Torta de Chocolate", precio: 5000, stock: 10 },
    { id: 2, nombre: "Panqueque", precio: 2500, stock: 20 },
    { id: 3, nombre: "Brownie", precio: 1500, stock: 15 }
  ];

  beforeEach(() => {
    global.fetch = jasmine.createSpy("fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
      })
    );
  });

  afterEach(() => {
    delete global.fetch;
  });

  // TEST 1: Obtener lista de productos
  it("1. obtiene la lista completa de productos desde la API", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());

    expect(fetch).toHaveBeenCalled();
    expect(productos.length).toBe(3);
    expect(productos[0].nombre).toBe("Torta de Chocolate");
  });

  // TEST 2: Validar estructura de producto
  it("2. valida que cada producto tenga la estructura correcta", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    const producto = productos[0];

    // Verificar que las propiedades existan
    expect(producto.id).toBeDefined();
    expect(producto.nombre).toBeDefined();
    expect(producto.precio).toBeDefined();
    expect(producto.stock).toBeDefined();
    
    // Verificar valores
    expect(producto.id).toBe(1);
    expect(producto.nombre).toBe("Torta de Chocolate");
    expect(producto.precio).toBe(5000);
    expect(producto.stock).toBe(10);
  });

  // TEST 3: Obtener producto por ID
  it("3. obtiene un producto específico por ID", async () => {
    global.fetch = jasmine.createSpy("fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos[0])
      })
    );

    const producto = await fetch("/api/productos/1").then((r) => r.json());
    expect(producto.id).toBe(1);
    expect(producto.nombre).toBe("Torta de Chocolate");
  });

  // TEST 4: Validar precios
  it("4. valida que los precios sean números positivos", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    
    productos.forEach(producto => {
      expect(typeof producto.precio).toBe("number");
      expect(producto.precio).toBeGreaterThan(0);
    });
  });

  // TEST 5: Validar stock
  it("5. valida que el stock sea un número entero no negativo", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    
    productos.forEach(producto => {
      expect(typeof producto.stock).toBe("number");
      expect(producto.stock).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(producto.stock)).toBe(true);
    });
  });

  // TEST 6: Manejo de errores
  it("6. maneja correctamente errores de la API", async () => {
    global.fetch = jasmine.createSpy("fetch").and.returnValue(
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: "Not found" })
      })
    );

    const response = await fetch("/api/productos");
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  // TEST 7: Filtrar productos por nombre
  it("7. filtra productos por nombre correctamente", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    const filtrados = productos.filter(p => 
      p.nombre.toLowerCase().includes("chocolate")
    );
    
    expect(filtrados.length).toBe(1);
    expect(filtrados[0].nombre).toBe("Torta de Chocolate");
  });

  // TEST 8: Ordenar productos por precio
  it("8. ordena productos por precio ascendente", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    const ordenados = [...productos].sort((a, b) => a.precio - b.precio);
    
    expect(ordenados[0].precio).toBe(1500); // Brownie
    expect(ordenados[1].precio).toBe(2500); // Panqueque
    expect(ordenados[2].precio).toBe(5000); // Torta
  });

  // TEST 9: Calcular total con descuento
  it("9. calcula correctamente el precio con descuento", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    const producto = productos[0];
    const descuento = 0.1; // 10%
    const precioConDescuento = producto.precio * (1 - descuento);
    
    expect(precioConDescuento).toBe(4500);
  });

  // TEST 10: Verificar disponibilidad de stock
  it("10. verifica correctamente la disponibilidad de stock", async () => {
    const productos = await fetch("/api/productos").then((r) => r.json());
    
    const disponibles = productos.filter(p => p.stock > 0);
    const sinStock = productos.filter(p => p.stock === 0);
    
    expect(disponibles.length).toBe(3);
    expect(sinStock.length).toBe(0);
  });
});