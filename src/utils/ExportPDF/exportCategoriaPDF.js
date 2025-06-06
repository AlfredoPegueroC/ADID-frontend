import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCategoriasToPDF(categorias, currentPage, pageSize) {
  const doc = new jsPDF({ orientation: "landscape" });

  // 🖼️ Logo
  doc.addImage("/LogoUASD.jpg", "jpg", 250, 11, 20, 20); // x, y, width, height

  // 🏫 Nombre de la universidad
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


  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Lista de Categorías de Docente", 14, 30);

  // Tabla
  const headers = [["#", "Código", "Nombre", "Universidad"]];

  const data = categorias.map((cat, index) => [
    index + 1 + (currentPage - 1) * pageSize,
    cat.categoriaCodigo,
    cat.CategoriaNombre,
    cat.universidadNombre || "—",
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
      1: { cellWidth: 30 },  // Código
      2: { cellWidth: 50 },  // Nombre
      3: { cellWidth: 80 },  // Universidad
    },
  });

  doc.save(`categorias_docente_${fechaArchivo}.pdf`);
}
