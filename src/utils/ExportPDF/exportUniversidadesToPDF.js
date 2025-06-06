import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportUniversidadesToPDF(universidades, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 📌 Logo en la parte superior derecha
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20); // x, y, width, height


  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Universidad Autónoma de Santo Domingo", 14, 15);

  // 📅 Fecha justo debajo, también alineada
  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaNombreArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 21); // un poco más abajo

  // 📋 Título del documento (ya debajo del header visual)
  doc.setFontSize(12);
  doc.text("Lista de Universidades", 14, 30);

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
    u.UniversidadEstado
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36, // ajuste para dejar espacio suficiente arriba
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

  doc.save(`universidades_${fechaNombreArchivo}.pdf`);
}
