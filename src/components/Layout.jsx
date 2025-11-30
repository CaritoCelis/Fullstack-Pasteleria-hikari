import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Layout({ onLogout }) {
  return (
    <div>
      <Header onLogout={onLogout} />
      <Outlet />
    </div>
  );
}
