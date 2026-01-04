import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDashboardPdf({ filename = "dashboard.pdf", data }) {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();


  const drawHeader = () => {
    // Logo
    doc.addImage("/LogoUASD.jpg", "jpg", pageWidth - 30, 10, 20, 20);

    // Universidad
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Universidad Autónoma de Santo Domingo", 14, 16);

    // Fecha
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha de creación: ${new Date().toLocaleDateString()}`, 14, 22);

    // Línea
    doc.setLineWidth(0.5);
    doc.line(14, 32, pageWidth - 14, 32);
  };

  drawHeader();

  let y = 45;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Dashboard Académico", 14, y);

  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Período: ${data.periodoActual ?? "Actual"}`, 14, y);

  y += 16;


  doc.text("Resumen General", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Indicador", "Total"]],
    body: [
      ["Asignaciones", data.totalAsignaciones],
      ["Docentes", data.totalDocentes],
      ["Asignaturas", data.totalAsignaturas],
      ["Facultades", data.totalFacultades],
      ["Campus", data.totalCampus],
      ["Categorías", data.totalCategorias],
      ["Tipos de Asignaturas", data.totalTiposDocente]
    ],
    margin: { top: 45 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  y = doc.lastAutoTable.finalY + 12;

  // =========================
  // PROFESORES POR CAMPUS
  // =========================

  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Campus", "Profesores"]],
    pageBreak: "always",
    body: data.profesoresPorCampus.map((r) => [
      r.campus || "No definido",
      r.total,
    ]),
    margin: { top: 45 },
    didDrawPage: () => {
      drawHeader();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Profesores por Campus", 14, 38);
    },
  });

  // =========================
  // DOCENTES POR SEMESTRE
  // =========================
 
  y += 4;
  autoTable(doc, {
    startY: y,
    pageBreak: "always",
    head: [["Semestre", "Docentes"]],
    body: data.docentesPorSemestre.map((r) => [
      r.periodo || "No definido",
      r.total,
    ]),
    margin: { top: 45 },
    didDrawPage: () => {
      drawHeader();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Docentes por Semestre", 14, 38);
    },
  });

  doc.save(filename);
}
