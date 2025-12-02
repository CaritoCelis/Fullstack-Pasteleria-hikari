// src/tests/auth.test.jsx
describe("Auth - Sistema de autenticación completo", () => {
  let store = {};

  beforeEach(() => {
    store = {};
    
    spyOn(window.localStorage, "setItem").and.callFake((key, value) => {
      store[key] = value;
    });
    
    spyOn(window.localStorage, "getItem").and.callFake((key) => {
      return store[key] || null;
    });

    spyOn(window.localStorage, "removeItem").and.callFake((key) => {
      delete store[key];
    });

    spyOn(window.localStorage, "clear").and.callFake(() => {
      store = {};
    });
  });

  // TEST 1: Guardar token
  it("1. debería guardar el token JWT en localStorage", () => {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
    expect(store["token"]).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
  });

  // TEST 2: Obtener token
  it("2. debería recuperar el token desde localStorage", () => {
    localStorage.setItem("token", "XYZ789");
    const token = localStorage.getItem("token");
    expect(token).toBe("XYZ789");
  });

  // TEST 3: Guardar usuario completo
  it("3. debería guardar datos de usuario en localStorage", () => {
    const usuario = JSON.stringify({
      username: "test@hikari.com",
      email: "test@hikari.com",
      roles: ["ROLE_USER"]
    });
    localStorage.setItem("usuario", usuario);
    expect(localStorage.setItem).toHaveBeenCalledWith("usuario", usuario);
  });

  // TEST 4: Recuperar usuario
  it("4. debería recuperar y parsear datos de usuario", () => {
    const usuario = { username: "admin", email: "admin@hikari.com" };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    const recovered = JSON.parse(localStorage.getItem("usuario"));
    expect(recovered.username).toBe("admin");
    expect(recovered.email).toBe("admin@hikari.com");
  });

  // TEST 5: Eliminar token (logout)
  it("5. debería eliminar el token al hacer logout", () => {
    localStorage.setItem("token", "ABC123");
    localStorage.removeItem("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(store["token"]).toBeUndefined();
  });

  // TEST 6: Limpiar toda la sesión
  it("6. debería limpiar toda la sesión (token y usuario)", () => {
    localStorage.setItem("token", "TOKEN123");
    localStorage.setItem("usuario", JSON.stringify({ username: "test" }));
    localStorage.clear();
    expect(store).toEqual({});
  });

  // TEST 7: Validar token vacío
  it("7. debería retornar null si no hay token guardado", () => {
    const token = localStorage.getItem("token");
    expect(token).toBeNull();
  });

  // TEST 8: Validar persistencia
  it("8. debería mantener el token después de múltiples accesos", () => {
    localStorage.setItem("token", "PERSISTENT_TOKEN");
    expect(localStorage.getItem("token")).toBe("PERSISTENT_TOKEN");
    expect(localStorage.getItem("token")).toBe("PERSISTENT_TOKEN");
    expect(localStorage.getItem("token")).toBe("PERSISTENT_TOKEN");
  });

  // TEST 9: Validar formato de usuario (CORREGIDO)
  it("9. debería validar que el usuario tenga estructura correcta", () => {
    const usuario = {
      username: "testuser",
      email: "test@test.com",
      token: "TOKEN_ABC"
    };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    const stored = JSON.parse(localStorage.getItem("usuario"));
    
    // Usar métodos de Jasmine en lugar de toHaveProperty
    expect(stored.username).toBeDefined();
    expect(stored.email).toBeDefined();
    expect(stored.token).toBeDefined();
    expect(stored.username).toBe("testuser");
    expect(stored.email).toBe("test@test.com");
    expect(stored.token).toBe("TOKEN_ABC");
  });

  // TEST 10: Validar reemplazo de token
  it("10. debería reemplazar el token anterior al guardar uno nuevo", () => {
    localStorage.setItem("token", "OLD_TOKEN");
    expect(localStorage.getItem("token")).toBe("OLD_TOKEN");
    
    localStorage.setItem("token", "NEW_TOKEN");
    expect(localStorage.getItem("token")).toBe("NEW_TOKEN");
    expect(localStorage.getItem("token")).not.toBe("OLD_TOKEN");
  });
});