function addProductRow() {
    const table = document.getElementById("products-table").querySelector("tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" placeholder="Ítem"></td>
        <td><input type="number" value="1" onchange="updateTotals(this)"></td>
        <td><input type="text" placeholder="Descripción"></td>
        <td><input type="number" value="0" onchange="updateTotals(this)"></td>
        <td class="total-cell">$0.00</td>
        <td><button class="delete-btn" onclick="deleteProductRow(this)">Eliminar</button></td>
    `;

    table.appendChild(row);
}

function deleteProductRow(button) {
    button.closest("tr").remove();
    calculateTotals();
}

function updateTotals(input) {
    const row = input.closest("tr");
    const quantity = row.querySelector("td:nth-child(2) input").value;
    const unitPrice = row.querySelector("td:nth-child(4) input").value;
    const totalCell = row.querySelector(".total-cell");

    const total = (quantity * unitPrice).toFixed(2);
    totalCell.textContent = `$${total}`;

    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;

    document.querySelectorAll(".total-cell").forEach(cell => {
        subtotal += parseFloat(cell.textContent.replace("$", "")) || 0;
    });

    const iva = (subtotal * 0.15).toFixed(2);
    const total = (subtotal + parseFloat(iva)).toFixed(2);

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("iva").textContent = iva;
    document.getElementById("total").textContent = total;
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();


    doc.addImage("IEMI.png", "PNG", 15, 10, 18, 7);
    
    doc.setFont('Arial');
    doc.setFontSize(9);
    doc.text('SERVICIOS, PROVISIÓN DE INSUMOS DE INGENERÍA ELÉCTRICA, MECÁNICA E INDUSTRIAL', 15, 22);
    doc.text('RUC: 0401399936001', 15, 27);
    doc.text(`PROFORMA Nº: A-024-${document.getElementById("idinvoice").value}`, 105, 35, { align: "center" });


    doc.setFontSize(9);
    doc.text(`Cliente: ${document.getElementById("client").value}`, 15, 40);
    doc.text(`Atención: ${document.getElementById("attention").value}`, 15, 50);
    doc.text(`Fecha: ${document.getElementById("date").value}`, 15, 60);
    doc.text(`Dirección: ${document.getElementById("address").value}`, 15, 70);
    doc.text(`Teléfono: ${document.getElementById("phone").value}`, 15, 80);
    doc.text(`E-mail: ${document.getElementById("email").value}`, 10, 90);

    doc.text(`Validez: ${document.getElementById("validity").value}`, 105, 40);
    doc.text(`Entrega: ${document.getElementById("delivery").value}`, 105, 50);
    doc.text(`Pago: ${document.getElementById("payment").value}`, 105, 60);
    doc.text(`Garantía: ${document.getElementById("warranty").value}`, 105, 70);

    let yPosition = 110;
    doc.text("Productos:", 10, yPosition);
    yPosition += 10;

    document.querySelectorAll("#products-table tbody tr").forEach(row => {
        const item = row.querySelector("td:nth-child(1) input").value;
        const quantity = row.querySelector("td:nth-child(2) input").value;
        const description = row.querySelector("td:nth-child(3) input").value;
        const unitPrice = row.querySelector("td:nth-child(4) input").value;
        const total = row.querySelector(".total-cell").textContent;

        doc.text(`${item} - ${description} x${quantity} @ $${unitPrice} = ${total}`, 10, yPosition);
        yPosition += 10;
    });

    doc.text(`Subtotal: $${document.getElementById("subtotal").textContent}`, 10, yPosition + 10);
    doc.text(`IVA: $${document.getElementById("iva").textContent}`, 10, yPosition + 20);
    doc.text(`Total: $${document.getElementById("total").textContent}`, 10, yPosition + 30);

    const pdfUrl = doc.output('bloburl'); // Genera un URL para el PDF
    window.open(pdfUrl, '_blank');
}