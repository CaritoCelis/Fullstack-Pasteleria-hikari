// src/utils/generarBoletaPDF.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generarBoletaPDF = (pedido) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Boleta de Compra - Pastelería Hikari", 20, 20);
  doc.setFontSize(12);
  doc.text(`Cliente: ${pedido.usuario.nombre}`, 20, 30);
  doc.text(`Email: ${pedido.usuario.email}`, 20, 37);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 44);

  const items = pedido.items.map((item) => [
    item.nombre,
    item.cantidad,
    `$${item.precio}`,
    `$${item.precio * item.cantidad}`,
  ]);

  doc.autoTable({
    startY: 60,
    head: [["Producto", "Cant.", "Precio", "Subtotal"]],
    body: items,
  });

  doc.text(`Total pagado: $${pedido.total}`, 20, doc.lastAutoTable.finalY + 10);
  
  doc.save(`Boleta_Pedido_${pedido.id}.pdf`);
};
