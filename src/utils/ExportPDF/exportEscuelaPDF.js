import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportEscuelasToPDF(escuelas, page, pageSize) {
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
  const headers = [
    ["#", "Código", "Nombre", "Directora", "Teléfono", "Universidad", "Facultad"]
  ];

  // Datos (sin Estado)
  const data = escuelas.map((e, index) => [
    index + 1 + (page - 1) * pageSize,
    e.EscuelaCodigo,
    e.EscuelaNombre,
    e.EscuelaDirectora,
    e.EscuelaTelefono,
    e.universidadNombre || "—",
    e.facultadNombre || "—"
  ]);

  // Tabla
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
      1: { cellWidth: 25 },  // Código
      2: { cellWidth: 35 },  // Nombre
      3: { cellWidth: 35 },  // Directora
      4: { cellWidth: 25 },  // Teléfono
      5: { cellWidth: 45 },  // Universidad
      6: { cellWidth: 45 },  // Facultad
    },
  });

  // Guardar archivo
  doc.save(`escuelas_${fechaArchivo}.pdf`);
}
