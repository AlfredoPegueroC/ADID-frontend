import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCampusToPDF(campusList, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

 
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20); // x, y, width, height

 
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

  // 📋 Título
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Campus", 14, 30);

  // Tabla
  const headers = [
    ["#", "Nombre", "Dirección", "Ciudad", "Provincia", "País", "Teléfono", "Correo"]
  ];

  const data = campusList.map((c, index) => [
    index + 1 + (currentPage - 1) * pageSize,
    c.CampusNombre,
    c.CampusDireccion,
    c.CampusCiudad,
    c.CampusProvincia,
    c.CampusPais,
    c.CampusTelefono,
    c.CampusCorreoContacto,
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36,
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.001,          
      lineColor: [0, 0, 0, 0.2], 
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 30 },
      7: { cellWidth: 45 },
    },
  });

  doc.save(`campus_${fechaArchivo}.pdf`);
}
