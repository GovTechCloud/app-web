import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Reportes from "./pages/Reportes";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminInventario from "./components/AdminInventario";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login público */}
        <Route path="/login" element={<Login />} />

        {/* --- ZONA DEL DASHBOARD --- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* 1. Si entran a la raíz "/", carga Inventario */}
          <Route index element={<Inventario />} />

          {/* 2. Si entran a "/inventario", TAMBIÉN carga Inventario (ESTO ES LO QUE FALTABA) */}
          <Route path="inventario" element={<Inventario />} />

          {/* 3. Ruta de reportes */}
          <Route path="reportes" element={<Reportes />} />

          {/* 4. Ruta de administración de inventario */}
          <Route path="admin-inventario" element={<AdminInventario />} /> 
        </Route>

        {/* --- Agregar mas componentes --- */}
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;