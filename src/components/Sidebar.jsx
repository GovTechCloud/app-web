import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/inventario">Inventario</Link></li>
        <li><Link to="/admin-inventario">Administrar Equipos</Link></li>
        <li><Link to="/reportes">Reportes</Link></li>
      </ul>
    </aside>
  );
}