import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDocentesToPDF(docentes, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 🖼️ Logo
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20); // x, y, width, height

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
  doc.text("Lista de Docentes", 14, 30);

  // Encabezados
  const headers = [[
    "#", "Nombre", "Apellido", "Sexo", "Estado Civil", "Nacimiento",
    "Ingreso", "Nacionalidad", "Teléfono", "Correo", "Universidad"
  ]];

  // Filas
  const data = docentes.map((d, index) => [
    index + 1 + (currentPage - 1) * pageSize,
    d.DocenteNombre,
    d.DocenteApellido,
    d.DocenteSexo,
    d.DocenteEstadoCivil,
    d.DocenteFechaNacimiento,
    d.DocenteFechaIngreso,
    d.DocenteNacionalidad,
    d.DocenteTelefono,
    d.DocenteCorreoElectronico,
    d.universidadNombre || "—"
  ]);

  // Tabla
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineWidth: 0.001,          
      lineColor: [0, 0, 0, 0.2], 
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 15 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
      9: { cellWidth: 40 },
      10: { cellWidth: 40 },
    },
  });

  // Guardar PDF
  doc.save(`docentes_${fechaArchivo}.pdf`);
}
