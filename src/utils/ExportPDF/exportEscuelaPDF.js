import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportEscuelasToPDF(escuelas, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 🖼️ Logo
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20);

  // 🏫 Nombre institucional
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Universidad Autónoma de Santo Domingo", 14, 15);

  // 📅 Fecha
  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 21);

  // 📋 Título
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Escuelas", 14, 30);

  // Encabezados
  const headers = [
    ["#", "Código", "Nombre", "Directora", "Teléfono", "Correo", "Universidad", "Facultad"]
  ];

  // Datos
  const data = escuelas.map((e, index) => [
    index + 1 + (page - 1) * pageSize,
    e.EscuelaCodigo,
    e.EscuelaNombre,
    e.EscuelaDirectora,
    e.EscuelaTelefono,
    e.EscuelaCorreo || "—",
    e.universidadNombre || "—",
    e.facultadNombre || "—"
  ]);

  // Tabla
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36,
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
      5: { cellWidth: 40 },  // Correo
      6: { cellWidth: 45 },  // Universidad
      7: { cellWidth: 45 },  // Facultad
    },
  });

  // Guardar PDF
  doc.save(`escuelas_${fechaArchivo}.pdf`);
}
