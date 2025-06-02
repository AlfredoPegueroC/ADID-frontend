import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDocentesToPDF(docentes, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(12);
  doc.text("Sistema de Gestión Académica", 14, 15);
  doc.setFontSize(10);
  doc.text("Universidad Nacional", 14, 22);
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 29);

  // Encabezados: sin Estado, Tipo, ni Categoría
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

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 2,
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

  doc.save(`docentes_${fechaArchivo}.pdf`);
}
