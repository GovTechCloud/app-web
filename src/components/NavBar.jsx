import React from "react";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Controla</h1>
      <div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}