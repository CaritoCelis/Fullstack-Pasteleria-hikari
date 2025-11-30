import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../components/Header";
import { CarritoProvider } from "../context/CarritoContext";
import { AuthProvider } from "../context/AuthContext";

describe("Header component", () => {
    it("debería renderizar sin explotar", () => {
    expect(() => {
        render(
        <BrowserRouter>
            <AuthProvider>
            <CarritoProvider>
                <Header />
            </CarritoProvider>
            </AuthProvider>
        </BrowserRouter>
        );
    }).not.toThrow();
    });
});
