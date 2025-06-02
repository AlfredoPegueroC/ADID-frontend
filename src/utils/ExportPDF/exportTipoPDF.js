import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTipoDocenteToPDF(tipos, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  const headers = [
    ["#", "Código", "Descripción", "Estado", "Universidad"]
  ];

  const data = tipos.map((tipo, index) => [
    index + 1 + (page - 1) * pageSize,
    tipo.TipoDocenteCodigo,
    tipo.TipoDocenteDescripcion,
    tipo.universidadNombre || "—"
  ]);

  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(12);
  doc.text("Lista de Tipos de Docente", 14, 15);
  doc.setFontSize(10);
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 22);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 28,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10 },  // #
      1: { cellWidth: 25 },  // Código
      2: { cellWidth: 60 },  // Descripción
      3: { cellWidth: 50 },  // Universidad
    },
  });

  doc.save(`tipos_docente_${fechaArchivo}.pdf`);
}
