import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // <--- 1. CAMBIO EN EL IMPORT

export default function Reportes() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerHistorial = async () => {
    try {
      const res = await axiosClient.get("/reportes"); 
      setHistorial(res.data);
    } catch (error) {
      console.error("Error cargando historial", error);
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  const generarPDF = async () => {
    setCargando(true);
    try {
      const res = await axiosClient.get("/inventario?limit=10000"); 
      const datosInventario = res.data.data;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(22, 191, 201); 
      doc.text("Reporte General de Inventario", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total de activos: ${datosInventario.length}`, 14, 35);

      const tableColumn = ["ID", "Estado", "Área", "Equipo", "Marca", "Serial CPU", "Placa"];
      const tableRows = datosInventario.map(item => [
        item.id,
        item.estado,
        item.area,
        item.pc,
        item.marca,
        item.serial_cpu,
        item.placa
      ]);

      // ➤ 2. CORRECCIÓN AQUÍ:
      // En lugar de doc.autoTable, pasamos 'doc' como primer parámetro a la función importada
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 191, 201] },
        alternateRowStyles: { fillColor: [240, 253, 253] }
      });

      const nombreArchivo = `Inventario_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nombreArchivo);

      await axiosClient.post("/reportes", {
        tipo: "Reporte General PDF",
        usuario: "Admin"
      });

      obtenerHistorial();
      alert("Reporte generado y descargado correctamente.");

    } catch (error) {
      console.error("Error generando reporte:", error);
      alert("Hubo un error al generar el PDF: " + error.message);
    }
    setCargando(false);
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
          }}
        >
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
            className="icon icon-tabler icon-tabler-report-analytics"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
            <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
            <path d="M9 17v-5" />
            <path d="M12 17v-1" />
            <path d="M15 17v-3" />
          </svg>

          <h2 style={{ margin: 0 }}>Reportes y Descargas</h2>
        </div>
        <div className="card-body">
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Genera un archivo PDF con el estado actual de todos los activos. El archivo se descargará automáticamente en tu equipo.
          </p>
          
          <div className="search-section" style={{ alignItems: 'center' }}>
             <div style={{ flex: 1 }}>
                <label>Fecha Inicio:</label>
                <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{margin: 0}} />
             </div>
             <div style={{ flex: 1 }}>
                <label>Fecha Fin:</label>
                <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{margin: 0}} />
             </div>
             
             <div style={{ flex: 1 }}>
              <button
                className="btn btn-success"
                onClick={generarPDF}
                disabled={cargando}
                style={{
                  width: "100%",
                  marginTop: "23px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {cargando ? (
                  <>
                    {/* Ícono de reloj de arena */}
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
                      className="icon icon-tabler icon-tabler-hourglass"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M6.5 7h11" />
                      <path d="M6.5 17h11" />
                      <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
                      <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
                    </svg>

                    Creando PDF...
                  </>
                ) : (
                  <>
                    {/* Ícono de descarga */}
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
                      className="icon icon-tabler icon-tabler-file-download"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M12 17v-6" />
                      <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
                    </svg>

                    Descargar Reporte PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div
            className="card-header"
            style={{
              background: "var(--color-bg)",
              display: "flex",
              alignItems: "center",
              gap: "8px", // espacio entre el ícono y el texto
            }}
          >
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
              className="icon icon-tabler icon-tabler-clock"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 7v5l3 3" />
            </svg>

            <h3 style={{ margin: 0 }}>Historial de Generación</h3>
          </div>
        <div className="card-body">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Generación</th>
                  <th>Tipo</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.length > 0 ? (
                  historial.map((h) => (
                    <tr key={h.id}>
                      <td>{h.id}</td>
                      <td>{new Date(h.fecha_generacion).toLocaleString()}</td>
                      <td>{h.tipo_reporte}</td>
                      <td>{h.usuario}</td>
                      <td>
                        <span className="badge badge-primary" style={{ backgroundColor: 'var(--color-success)', color: 'black' }}>
                          Completado
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      No hay historial de reportes aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}