import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCategoriasToPDF(categorias, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  // Encabezado
  doc.setFontSize(12);
  doc.text("Sistema de Gestión Académica", 14, 15);
  doc.setFontSize(10);
  doc.text("Universidad Nacional", 14, 22);
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 29);

  // Encabezados de tabla (sin Estado)
  const headers = [["#", "Código", "Nombre", "Universidad"]];

  // Datos
  const data = categorias.map((cat, index) => [
    index + 1 + (currentPage - 1) * pageSize,
    cat.categoriaCodigo,
    cat.CategoriaNombre,
    cat.universidadNombre || "—",
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10 },  // #
      1: { cellWidth: 30 },  // Código
      2: { cellWidth: 50 },  // Nombre
      3: { cellWidth: 80 },  // Universidad
    },
  });

  doc.save(`categorias_docente_${fechaArchivo}.pdf`);
}
