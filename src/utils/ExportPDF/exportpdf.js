import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDashboardDataPdf({
  profesores,
  secciones,
  asignaturas,
  filename = "reporte-academico.pdf",
}) {
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
  // ===== TÍTULO =====
  let y = 45;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Reportes Académicos", 14, y);
  y += 12;

  // ========= PROFESORES =========
  doc.setFontSize(13);
  doc.text("Profesores por Modalidad", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Modalidad", "Cantidad"]],
    body: profesores.profesoresPorModalidad.labels.map((l, i) => [
      l,
      profesores.profesoresPorModalidad.datasets[0].data[i],
    ]),
  });

  y = doc.lastAutoTable.finalY + 8;

  doc.text("Profesores por Asignatura", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Asignatura", "Cantidad"]],
    body: profesores.profesoresPorAsignatura.labels.map((l, i) => [
      l,
      profesores.profesoresPorAsignatura.datasets[0].data[i],
    ]),
  });

  y = doc.lastAutoTable.finalY + 10;

  // ========= SECCIONES =========
  // doc.text("Secciones por Campus", 14, y);
  y += 20;

  autoTable(doc, {
    startY: y,
    pageBreak: "always",
    head: [["Campus", "Cantidad"]],
    body: secciones.seccionesPorCampus.labels.map((l, i) => [
      l,
      secciones.seccionesPorCampus.datasets[0].data[i],
    ]),
    didDrawPage: () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Secciones por Campus", 14, 10);
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  doc.text("Secciones por Modalidad", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Modalidad", "Cantidad"]],
    body: secciones.seccionesPorModalidad.labels.map((l, i) => [
      l,
      secciones.seccionesPorModalidad.datasets[0].data[i],
    ]),
  });

  y = doc.lastAutoTable.finalY + 8;

  // ========= ASIGNATURAS =========
  doc.text("Asignaturas por Modalidad", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Modalidad", "Cantidad"]],
    body: asignaturas.asignaturasPorModalidad.labels.map((l, i) => [
      l,
      asignaturas.asignaturasPorModalidad.datasets[0].data[i],
    ]),
  });

  y = doc.lastAutoTable.finalY + 8;

  y += 20;

  autoTable(doc, {
    startY: y,
    pageBreak: "always",
    head: [["Campus", "Cantidad"]],
    body: asignaturas.asignaturasPorCampus.labels.map((l, i) => [
      l,
      asignaturas.asignaturasPorCampus.datasets[0].data[i],
    ]),
    didDrawPage: () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Asignaturas por Campus", 14, 10);
    },
  });

  doc.save(filename);
}
