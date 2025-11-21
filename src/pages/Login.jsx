import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import "../App.css"; 

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await axiosClient.post("/auth/login", {
        username: user,
        password,
      });

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        // Opcional: Guardar datos del usuario si los necesitas luego
        // localStorage.setItem("user", JSON.stringify(res.data.usuario)); 
        
        alert(`Inicio de sesión correcto - Bienvenido, ${res.data.usuario.username}`);
        window.location.href = "/";
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error(err); // Útil para depurar en consola sin molestar al usuario
      setError("Usuario incorrecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Lado izquierdo — Formulario */}
      <div className="login-left">
        <div className="login-card">
          <h2>Inicia Sesión</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <label htmlFor="username">Usuario *</label>
            <input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button type="submit" disabled={loading} className="btn btn-login">
              {loading ? (
                <span>Verificando...</span>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Lado derecho — Branding e Identidad */}
      <div className="login-right">
        <div className="brand-container">
          <h3>Sistemas de Gestión</h3>
          <h1>CONTROLA</h1>
        </div>
      </div>
    </div>
  );
}