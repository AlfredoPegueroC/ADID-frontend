import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAsignacionesToPDF(columns, rows, selectedPeriodo, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // Logo
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20);

  // Encabezado institucional
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Universidad Autónoma de Santo Domingo", 14, 15);

  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 21);
  doc.text(`Periodo Académico: ${selectedPeriodo}`, 14, 26);

  // Título de tabla
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Listado de Asignaciones Docentes", 14, 33);

  // Excluir columnas innecesarias
  const excludedKeys = ["accion", "acciones"];

  const visibleColumns = columns
    .filter(
      (col) =>
        col.getIsVisible() &&
        col.columnDef.header &&
        !excludedKeys.includes(col.id || col.columnDef.accessorKey)
    )
    .map((col) => ({
      header: col.columnDef.header,
      accessorKey: col.columnDef.accessorKey,
    }));

  // Filas
  const data = rows.map((row, index) => [
    index + 1 + (currentPage - 1) * pageSize,
    ...visibleColumns.map((col) => {
      const value = row.original[col.accessorKey];
      return value !== undefined && value !== null ? String(value) : "";
    }),
  ]);

  const headers = [["#", ...visibleColumns.map((col) => col.header)]];

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 38,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: "center", // 💡 Centra el contenido
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" }, // Columna #
    },
  });

  doc.save(`asignaciones_${fechaArchivo}.pdf`);
}
