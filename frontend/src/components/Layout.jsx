import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout({ onLogout }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={onLogout} />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
