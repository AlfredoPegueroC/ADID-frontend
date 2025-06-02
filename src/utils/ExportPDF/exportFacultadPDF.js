import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportFacultadesToPDF(facultades, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  const headers = [
    ["Código", "Nombre", "Decano", "Teléfono", "Universidad", "Campus"]
  ];

  const data = facultades.map((fac) => [
    fac.FacultadCodigo,
    fac.FacultadNombre,
    fac.FacultadDecano,
    fac.FacultadTelefono,
    fac.universidadNombre || "—",
    fac.campusNombre || "—",
  ]);

  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(12);
  doc.text("Lista de Facultades", 14, 15);
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
      0: { cellWidth: 25 }, // Código
      1: { cellWidth: 35 }, // Nombre
      2: { cellWidth: 35 }, // Decano
      3: { cellWidth: 25 }, // Teléfono
      4: { cellWidth: 40 }, // Universidad
      5: { cellWidth: 30 }, // Campus
    },
  });

  doc.save(`facultades_${fechaArchivo}.pdf`);
}
