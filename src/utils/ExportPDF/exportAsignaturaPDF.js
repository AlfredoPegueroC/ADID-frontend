import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAsignaturasToPDF(asignaturas, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 📌 Logo en la parte superior derecha
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20);

  // 📌 Encabezado principal
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Universidad Autónoma de Santo Domingo", 14, 15);

  // 📅 Fecha
  const fecha = new Date();
  const fechaVisible = fecha.toLocaleDateString();
  const fechaNombreArchivo = `${fecha.getDate().toString().padStart(2, "0")}-${(
    fecha.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${fecha.getFullYear()}`;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de creación: ${fechaVisible}`, 14, 21);

  // 📋 Título del documento
  doc.setFontSize(12);
  doc.text("Lista de Asignaturas", 14, 30);

  // 📑 Cabeceras
  const headers = [
    [
      "#",
      "Código",
      "Nombre",
      "Créditos",
      "Horas Teóricas",
      "Horas Prácticas",
      "Estado",
      "Universidad",
      "Facultad",
      "Escuela",
    ],
  ];

  // 📊 Datos
  const data = asignaturas.map((a, index) => [
    index + 1 + (page - 1) * pageSize,
    a.AsignaturaCodigo,
    a.AsignaturaNombre,
    a.AsignaturaCreditos,
    a.AsignaturaHorasTeoricas,
    a.AsignaturaHorasPracticas,
    a.AsignaturaEstado,
    a.universidadNombre || "",
    a.facultadNombre || "",
    a.escuelaNombre || "",
  ]);

  // 📌 Tabla
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 36,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10 }, // #
      1: { cellWidth: 20 }, // Código
      2: { cellWidth: 35 }, // Nombre
      7: { cellWidth: 35 }, // Universidad
      8: { cellWidth: 35 }, // Facultad
      9: { cellWidth: 35 }, // Escuela
    },
  });

  // 📂 Guardar archivo
  doc.save(`asignaturas_${fechaNombreArchivo}.pdf`);
}
