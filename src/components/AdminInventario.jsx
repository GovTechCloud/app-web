import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

// Lista de áreas
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

export default function AdminInventario() {
  const [form, setForm] = useState({
    estado: "ACTIVO", area: "", pc: "ESCRITORIO", marca: "", modelo: "",
    serial_cpu: "", monitor_marca: "", serial_monitor: "", placa: "", observaciones: ""
  });

  const [serialBusqueda, setSerialBusqueda] = useState(""); 
  const [idEdicion, setIdEdicion] = useState(null); 

  // --- FUNCIONES (Sin cambios en lógica) ---
  const buscarPorSerial = async () => {
    if (!serialBusqueda) return alert("Escribe un serial CPU para buscar");
    try {
      const res = await axiosClient.get("/inventario", { params: { search: serialBusqueda, limit: 1 } });
      if (res.data.data.length > 0) {
        const activo = res.data.data[0];
        setForm(activo);      
        setIdEdicion(activo.id); 
        alert("Equipo encontrado.");
      } else {
        alert("No se encontró ningún equipo con ese serial.");
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/inventario", form);
      alert("Activo creado con éxito");
      limpiarFormulario();
    } catch (error) {
      alert("Error al crear activo.");
    }
  };

  const handleActualizar = async () => {
    try {
      await axiosClient.put(`/inventario/${idEdicion}`, form);
      alert("Activo actualizado con éxito");
      limpiarFormulario();
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este equipo permanentemente?")) return;
    try {
      await axiosClient.delete(`/inventario/${idEdicion}`);
      alert("Activo eliminado.");
      limpiarFormulario();
    } catch (error) {
      alert("Error al eliminar.");
    }
  };

  const limpiarFormulario = () => {
    setForm({
      estado: "ACTIVO", area: "", pc: "ESCRITORIO", marca: "", modelo: "",
      serial_cpu: "", monitor_marca: "", serial_monitor: "", placa: "", observaciones: ""
    });
    setIdEdicion(null);
    setSerialBusqueda("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-container">
      <div className="card">
        <div
          className="card-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--color-bg)",
          }}
        >
          {/* Ícono SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef2590"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icon-tabler-device-desktop-cog"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 16h-8a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7" />
            <path d="M7 20h5" />
            <path d="M9 16v4" />
            <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M19.001 15.5v1.5" />
            <path d="M19.001 21v1.5" />
            <path d="M22.032 17.25l-1.299 .75" />
            <path d="M17.27 20l-1.3 .75" />
            <path d="M15.97 17.25l1.3 .75" />
            <path d="M20.733 20l1.3 .75" />
          </svg>

          <h2 style={{ margin: 0 }}>Administración de Equipos</h2>
        </div>
        
        <div className="card-body">
          
          {/* ➤ SECCIÓN DE BÚSQUEDA */}
          <div className="search-section">
            <div style={{ flex: 1 }}>
              <label>Buscar por Serial CPU (Editar/Borrar):</label>
              <input 
                type="text" 
                placeholder="Ej: 6DK4FF3" 
                value={serialBusqueda}
                onChange={(e) => setSerialBusqueda(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <button
              className="btn btn-search"
              onClick={buscarPorSerial}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px", // espacio entre ícono y texto
              }}
            >
              {/* Ícono de report-search */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef2590"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-report-search"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
                <path d="M18 12v-5a2 2 0 0 0 -2 -2h-2" />
                <path d="M8 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M8 11h4" />
                <path d="M8 15h3" />
                <path d="M16.5 17.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
                <path d="M18.5 19.5l2.5 2.5" />
              </svg>

              Buscar
            </button>
            <button
              className="btn btn-secondary"
              onClick={limpiarFormulario}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px", // espacio entre ícono y texto
              }}
            >
              {/* Ícono Clear All */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef2590"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icon-tabler-clear-all"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 6h12" />
                <path d="M6 12h12" />
                <path d="M4 18h12" />
              </svg>

              Limpiar
            </button>
          </div>

          {/* ➤ FORMULARIO */}
          <form onSubmit={idEdicion ? (e) => e.preventDefault() : handleCrear}>
            <h3
              className="text-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
                marginBottom: "20px",
              }}
            >
              {/* Mostrar ícono según el estado */}
              {idEdicion ? (
                // Ícono EDITAR
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef2590"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icon-tabler-edit"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>
              ) : (
                // Ícono AGREGAR
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef2590"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icon-tabler-plus"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
              )}

              {/* Texto del título */}
              {idEdicion
                ? `Editando Equipo ID: ${idEdicion}`
                : "Datos del Nuevo Equipo"}
            </h3>

            <div className="form-grid">
              {/* Fila 1 */}
              <div>
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="BAJA">BAJA</option>
                  <option value="EN REVISION">EN REVISION</option>
                </select>
              </div>

              <div>
                <label>Tipo PC</label>
                <select name="pc" value={form.pc} onChange={handleChange}>
                  <option value="ESCRITORIO">ESCRITORIO</option>
                  <option value="PORTATIL">PORTATIL</option>
                  <option value="TODO EN UNO">TODO EN UNO</option>
                </select>
              </div>

              {/* Fila 2: Área (Full Width) */}
              <div className="full-width">
                <label>Área Asignada</label>
                <select name="area" value={form.area} onChange={handleChange} required>
                  <option value="">-- Seleccione Área --</option>
                  {AREAS_DISPONIBLES.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              {/* Fila 3 */}
              <div>
                <label>Marca Equipo</label>
                <input type="text" name="marca" value={form.marca} onChange={handleChange} required />
              </div>

              <div>
                <label>Modelo</label>
                <input type="text" name="modelo" value={form.modelo} onChange={handleChange} required />
              </div>

              {/* Fila 4 */}
              <div>
                <label>Serial CPU (Único)</label>
                <input 
                  type="text" 
                  name="serial_cpu" 
                  value={form.serial_cpu} 
                  onChange={handleChange} 
                  required 
                  style={{ borderLeft: '4px solid var(--color-primary)' }} 
                />
              </div>

              <div>
                <label>Placa Inventario</label>
                <input type="text" name="placa" value={form.placa} onChange={handleChange} />
              </div>

              {/* Fila 5 */}
              <div>
                <label>Marca Monitor</label>
                <input type="text" name="monitor_marca" value={form.monitor_marca} onChange={handleChange} />
              </div>

              <div>
                <label>Serial Monitor</label>
                <input type="text" name="serial_monitor" value={form.serial_monitor} onChange={handleChange} />
              </div>

              {/* Fila 6: Observaciones */}
              <div className="full-width">
                <label>Observaciones</label>
                <textarea name="observaciones" rows="3" value={form.observaciones} onChange={handleChange}></textarea>
              </div>

              {/* ➤ BOTONES DE ACCIÓN */}
              <div className="actions-container">
                {idEdicion ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleActualizar}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px", // espacio entre ícono y texto
                      }}
                    >
                      {/* Ícono de disquete */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef2590"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icon-tabler-device-floppy"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
                        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M14 4l0 4l-6 0l0 -4" />
                      </svg>

                      Guardar Cambios
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleEliminar}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px", // separación entre ícono y texto
                      }}
                    >
                      {/* Ícono de basurero */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ef2590"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icon-tabler-trash"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                      Eliminar
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px", // espacio entre ícono y texto
                    }}
                  >
                    {/* Ícono "plus" */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef2590"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icon-tabler-plus"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>

                    Guardar Nuevo Equipo
                  </button>
                )}
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
}