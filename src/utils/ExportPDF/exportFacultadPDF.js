import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportFacultadesToPDF(facultades, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 🖼️ Logo en la parte superior derecha
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20); // x, y, width, height

  // 🏫 Nombre de la universidad alineado con el logo
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Universidad Autónoma de Santo Domingo", 14, 15);

  // 📅 Fecha de creación
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
  doc.text("Lista de Facultades", 14, 30);

  // Tabla
  const headers = [
    [
      "Código",
      "Nombre",
      "Decano",
      "Teléfono",
      "Dirección",
      "Correo",
      "Universidad",
      "Campus"
    ]
  ];

  const data = facultades.map((fac) => [
    fac.FacultadCodigo,
    fac.FacultadNombre,
    fac.FacultadDecano,
    fac.FacultadTelefono,
    fac.FacultadDireccion,
    fac.FacultadEmail,
    fac.universidadNombre || "—",
    fac.campusNombre || "—",
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36, // espacio suficiente debajo del encabezado
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.001,          
      lineColor: [0, 0, 0, 0.2], 
    },
    columnStyles: {
      0: { cellWidth: 20 }, // Código
      1: { cellWidth: 30 }, // Nombre
      2: { cellWidth: 30 }, // Decano
      3: { cellWidth: 25 }, // Teléfono
      4: { cellWidth: 40 }, // Dirección
      5: { cellWidth: 35 }, // Correo
      6: { cellWidth: 35 }, // Universidad
      7: { cellWidth: 30 }, // Campus
    },
  });

  doc.save(`facultades_${fechaArchivo}.pdf`);
}
