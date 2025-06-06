import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportTipoDocenteToPDF(tipos, page, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20);


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

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Tipos de Docente", 14, 30);

  // Datos
  const headers = [["#", "Código", "Descripción", "Universidad"]];

  const data = tipos.map((tipo, index) => [
    index + 1 + (page - 1) * pageSize,
    tipo.TipoDocenteCodigo,
    tipo.TipoDocenteDescripcion,
    tipo.universidadNombre || "—"
  ]);


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
      2: { cellWidth: 60 },  // Descripción
      3: { cellWidth: 50 },  // Universidad
    },
  });

  // 💾 Guardar PDF
  doc.save(`tipos_docente_${fechaArchivo}.pdf`);
}
