// auth.test.js
describe("Auth - manejo de tokens", () => {
    let store = {};

    beforeEach(() => {
    store = {};

    spyOn(window.localStorage, "setItem").and.callFake((key, value) => {
        store[key] = value;
    });

    spyOn(window.localStorage, "getItem").and.callFake((key) => {
        return store[key] || null;
    });
    });

    it("debería guardar el token en localStorage", () => {
    localStorage.setItem("token", "ABC123");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "ABC123");
    });

    it("debería obtener el token desde localStorage", () => {
    localStorage.setItem("token", "XYZ789");
    const token = localStorage.getItem("token");
    expect(token).toBe("XYZ789");
    });
});
