import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Inventario() {
  const [activos, setActivos] = useState([]);
  
  // Configuración Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Configuración Filtros
  const [filtroArea, setFiltroArea] = useState(""); // Para el Dropdown
  const [busqueda, setBusqueda] = useState("");     // Para el input de texto

  // LISTA DE ÁREAS ACTUALIZADA
const AREAS_DISPONIBLES = [
  "ADMISION PLATINO", "ADMISIONES", "ALTA COMPLEJIDAD", "AMBIENTAL", "ARCHIVO", 
  "AUDITORIA EXTERNA", "AUDITORIA HOSPITALIZACION", "AUDITORIA URGENCIAS", "AUTORIZACIONES", 
  "BIOMEDICINA", "CADENA DE VALOR", "CAJA", "CARTERA/ENVIOS", "CIRUGIA", 
  "COOR ASISTENCIAL", "COOR MEDICA", "COMUNICACIONES", "CONSULTA EXTERNA", "CONTABILIDAD", 
  "CONTROL INTERNO", "CUENTAS MEDICAS", "DIRECTOR ADTIVO", "EPIDEMIOLOGIA", 
  "FACTURACION 3ER PISO", "FACTURACION NOPBS", "FACTURACION URGENCIAS", "FARMACIA", 
  "GERENCIA", "GERENCIA ECONOMICA", "HOSPITALIZACION 3ER PISO", "HOSPITALIZACION COOR", 
  "HOSPITALIZACION PLATINO", "HOSPITALIZACION SECC A", "HOSPITALIZACION SECC B", 
  "HOSPITALIZACION SECC C", "HOSPITALIZACION UCI ADULTO A", "HOSPITALIZACION UCI ADULTO B", 
  "HOSPITALIZACION UCI NEONATO", "JURIDICA", "LABORATORIO", "LIDERES ASISTENCIALES", 
  "MANTENIMIENTO", "NUTRICION", "PRESIDENCIA", "PROGRAMACION CIRUGIA", 
  "PROYECTOS UNIVERSITARIOS", "RADIOLOGIA", "REVISORIA FISCAL", "SALA RESPIRATORIA", 
  "SEGURIDAD", "SEGURIDAD DEL PACIENTE", "SERVICIOS GENERALES", "SIAU", "SST", 
  "SUMINISTRO", "TALENTO HUMANO", "TESORERIA", "TICS", "TICS CC A", "TICS CC B", 
  "TICS CC C", "TICS CC D", "TICS CC E", "UNIDAD TRANSFUSIONAL", "URGENCIAS CONSULTORIO", 
  "URGENCIAS MATERNIDAD", "URGENCIAS PEDIATRIA", "URGENCIAS PLATINO", "OBSERVACION VIP",
  "URGENCIAS STAR 1", "URGENCIAS STAR 2", "URGENCIAS TRIAGE", "VACUNACION", "CAPS"
];

  const obtenerInventario = async () => {
    try {
      const res = await axiosClient.get("/inventario", {
        params: {
          page: pagina,
          limit: 14,     // Ajustado a 14 por página
          area: filtroArea, 
          search: busqueda // Enviamos lo que se escriba en el buscador
        }
      });

      setActivos(res.data.data);
      setTotalPaginas(res.data.pagination.totalPages);
      
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  // Se ejecuta si cambia Pagina, Area seleccionada o Texto de búsqueda
  useEffect(() => {
    obtenerInventario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, filtroArea, busqueda]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventario de Activos</h2>

      {/* ➤ BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="row mb-3" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        
        {/* 1. Dropdown de Áreas */}
        <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Filtrar por Área:</label>
            <select 
                className="form-select" 
                value={filtroArea}
                onChange={(e) => {
                    setFiltroArea(e.target.value);
                    setPagina(1); // Reset a pág 1 al cambiar filtro
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '5px' }}
            >
                <option value="">-- Todas las Áreas --</option>
                {AREAS_DISPONIBLES.map((area) => (
                    <option key={area} value={area}>{area}</option>
                ))}
            </select>
        </div>

        {/* 2. Buscador General (Serial, Modelo, etc) */}
        <div style={{ flex: 2, minWidth: '300px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Buscar (Serial, Modelo, Marca...):</label>
            <input 
                type="text" 
                placeholder="Escribe serial, placa o modelo..." 
                value={busqueda}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPagina(1); // Reset a pág 1 al buscar
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
        </div>
      </div>

      {/* ➤ TABLA DE RESULTADOS */}
      <table className="table table-striped"> 
        <thead>
          <tr>
            <th>Estado</th>
            <th>Área</th>
            <th>PC</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serial CPU</th>
            <th>Monitor Marca</th>
            <th>Serial Monitor</th>
            <th>Placa</th>
            <th>Obs.</th>
          </tr>
        </thead>
        <tbody>
          {activos.length > 0 ? (
            activos.map((a) => (
              <tr key={a.id}>
                <td>{a.estado}</td>
                <td>{a.area}</td>
                <td>{a.pc}</td>
                <td>{a.marca}</td>
                <td>{a.modelo}</td>
                <td>{a.serial_cpu}</td>
                <td>{a.monitor_marca}</td>
                <td>{a.serial_monitor}</td>
                <td>{a.placa}</td>
                <td>{a.observaciones}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "30px" }}>
                ⚠️ No se encontraron resultados con esos filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ➤ CONTROLES DE PAGINACIÓN */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={() => setPagina(pagina - 1)} 
          disabled={pagina === 1}
          style={{ padding: '8px 16px', cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>
          Página {pagina} de {totalPaginas || 1}
        </span>
        <button 
          onClick={() => setPagina(pagina + 1)} 
          disabled={pagina >= totalPaginas}
          style={{ padding: '8px 16px', cursor: pagina >= totalPaginas ? 'not-allowed' : 'pointer' }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}