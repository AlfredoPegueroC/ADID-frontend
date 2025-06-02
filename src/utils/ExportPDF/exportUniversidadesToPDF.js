import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportUniversidadesToPDF(universidades, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  const headers = [
    ["#", "Código", "Nombre", "Dirección", "Teléfono", "Email", "Sitio Web", "Rector", "Estado"]
  ];

  const data = universidades.map((u, index) => [
    index + 1 + (page - 1) * pageSize,
    u.UniversidadCodigo,
    u.UniversidadNombre,
    u.UniversidadDireccion,
    u.UniversidadTelefono,
    u.UniversidadEmail,
    u.UniversidadSitioWeb,
    u.UniversidadRector,
  ]);

  // Fecha actual
  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString(); // Para mostrar en el PDF
  const fechaNombreArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`; // Para usar en el nombre del archivo

  // Título y fecha visible en el PDF
  doc.setFontSize(12);
  doc.text("Lista de Universidades", 14, 15);
  doc.setFontSize(10);
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 22);

  // Tabla
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 'wrap' },
      6: { cellWidth: 40 },
    },
  });

  // Guardar archivo con la fecha
  doc.save(`universidades_${fechaNombreArchivo}.pdf`);
}
