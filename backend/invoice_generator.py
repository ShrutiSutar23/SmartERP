from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
import io

def generate_invoice(sale_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # Company Header
    elements.append(Paragraph(f"<b>{sale_data['company_name']}</b>", styles['Title']))
    elements.append(Paragraph(f"GST: {sale_data['company_gst']}", styles['Normal']))
    elements.append(Paragraph(f"Address: {sale_data['company_address']}", styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Invoice Title
    elements.append(Paragraph(f"<b>INVOICE #{sale_data['invoice_id']}</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.1 * inch))

    # Customer Info
    elements.append(Paragraph(f"Bill To: {sale_data['customer_name']}", styles['Normal']))
    elements.append(Paragraph(f"Phone: {sale_data['customer_phone']}", styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Items Table
    table_data = [["Item", "Qty", "Price", "Total"]]
    for item in sale_data['items']:
        table_data.append([
            item['name'],
            str(item['quantity']),
            f"Rs. {item['price']}",
            f"Rs. {item['total']}"
        ])

    table_data.append(["", "", "Grand Total:", f"Rs. {sale_data['grand_total']}"])

    table = Table(table_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a56db')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f3f4f6')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.3 * inch))

    # Footer
    elements.append(Paragraph("Thank you for your business!", styles['Normal']))
    elements.append(Paragraph("This is a computer generated invoice.", styles['Normal']))

    doc.build(elements)
    buffer.seek(0)
    return buffer