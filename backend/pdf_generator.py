import io
import os
from flask import make_response
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def setup_unicode_fonts():
    """Attempts to register system TTF fonts for Unicode ₹ support; falls back cleanly."""
    font_candidates = [
        # (Regular, Bold, Italic)
        ("C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/ariali.ttf"),
        ("C:/Windows/Fonts/calibri.ttf", "C:/Windows/Fonts/calibrib.ttf", "C:/Windows/Fonts/calibrii.ttf"),
        (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf"
        ),
        (
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf"
        ),
        (
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Supplemental/Arial Italic.ttf"
        )
    ]
    
    for reg, bold, italic in font_candidates:
        if os.path.exists(reg) and os.path.exists(bold) and os.path.exists(italic):
            pdfmetrics.registerFont(TTFont("CustomSans", reg))
            pdfmetrics.registerFont(TTFont("CustomSans-Bold", bold))
            pdfmetrics.registerFont(TTFont("CustomSans-Italic", italic))
            return "CustomSans", "CustomSans-Bold", "CustomSans-Italic", "₹"

    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Rs."

def generate_receipt(slot_number, start_time, end_time, amount, transaction_id):
    amount = float(amount)
    tax = amount * 0.10
    total = amount + tax

    font_reg, font_bold, font_italic, curr = setup_unicode_fonts()

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter  # 612 x 792 points

    primary_brown = colors.HexColor("#A03B0D")
    banner_bg = colors.HexColor("#FEF9D9")
    border_color = colors.HexColor("#E0E0E0")

    # ================= 1. HEADER BANNER =================
    banner_x, banner_y, banner_w, banner_h = 50, 700, 512, 38
    p.setFillColor(banner_bg)
    p.rect(banner_x, banner_y, banner_w, banner_h, fill=1, stroke=0)

    p.setFont(font_bold, 16)
    p.setFillColor(primary_brown)
    p.drawCentredString(width / 2.0, banner_y + 12, "PARKING RECEIPT")

    p.setStrokeColor(primary_brown)
    p.setLineWidth(1.5)
    p.line(banner_x, 692, banner_x + banner_w, 692)

    # ================= 2. SELLER & META SECTION =================
    p.setFont(font_bold, 10)
    p.drawString(50, 672, "Seller")
    p.line(115, 680, 115, 620)

    p.setFont(font_reg, 9)
    p.setFillColor(colors.black)
    p.drawString(122, 672, "Smart Parking Solutions Ltd.")
    p.drawString(122, 658, "Block B, Tech Park Campus")
    p.drawString(122, 644, f"Slot Reserved: Slot #{slot_number}")
    p.drawString(122, 630, "Support: contact@smartparking.io")

    # Receipt Metadata (Right side)
    p.setFont(font_bold, 9)
    p.setFillColor(primary_brown)
    p.drawRightString(355, 672, "Receipt Number:")
    p.drawRightString(355, 656, "Receipt Date:")
    p.drawRightString(355, 640, "Payment Method:")

    p.setFont(font_reg, 9)
    p.setFillColor(colors.black)
    p.drawString(362, 672, str(transaction_id))
    p.drawString(362, 656, str(start_time))
    p.drawString(362, 640, "FASTag / UPI")

    # ================= 3. CUSTOMER & NOTES SECTION =================
    p.setFont(font_bold, 10)
    p.setFillColor(primary_brown)
    p.drawString(50, 595, "Customer")
    p.line(115, 603, 115, 545)

    p.setFont(font_reg, 9)
    p.setFillColor(colors.black)
    p.drawString(122, 595, "Registered Vehicle Owner")
    p.drawString(122, 581, f"Check-in: {start_time}")
    p.drawString(122, 567, f"Check-out: {end_time}")
    p.drawString(122, 553, "Status: Confirmed Paid")

    # Notes Box
    notes_x, notes_y, notes_w, notes_h = 265, 545, 297, 60
    p.setStrokeColor(border_color)
    p.setLineWidth(0.7)
    p.rect(notes_x, notes_y, notes_w, notes_h, fill=0, stroke=1)

    p.setFont(font_reg, 8)
    p.setFillColor(colors.HexColor("#444444"))
    p.drawString(notes_x + 5, notes_y + notes_h - 12, "[Notes]")
    p.drawString(notes_x + 8, notes_y + notes_h - 26, f"Automated entry & exit linked to Slot #{slot_number}.")
    p.drawString(notes_x + 8, notes_y + notes_h - 38, "Please retain this receipt for gate pass validation.")

    # ================= 4. ITEMIZED TABLE =================
    table_headers = ["QUANTITY", "DESCRIPTION", "UNIT PRICE", "SUBTOTAL", "TAX"]
    table_data = [
        table_headers,
        ["1 Session", f"Parking Slot #{slot_number} (Full Session)", f"{curr} {amount:.2f}", f"{curr} {amount:.2f}", f"{curr} {tax:.2f}"]
    ]
    for _ in range(7):
        table_data.append(["", "", "", "", ""])

    col_widths = [65, 207, 80, 80, 80]
    table = Table(table_data, colWidths=col_widths, rowHeights=[20] + [17] * 8)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), banner_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), primary_brown),
        ("FONTNAME", (0, 0), (-1, 0), font_bold),
        ("FONTSIZE", (0, 0), (-1, 0), 8.5),
        ("ALIGN", (0, 0), (1, -1), "LEFT"),
        ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (0, 1), (-1, -1), font_reg),
        ("FONTSIZE", (0, 1), (-1, -1), 8.5),
        ("TEXTCOLOR", (0, 1), (-1, -1), colors.black),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ("LINEBELOW", (0, 0), (-1, 0), 1.2, primary_brown),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))

    table.wrapOn(p, 50, 345)
    table.drawOn(p, 50, 345)

    # ================= 5. TOTALS SECTION =================
    totals_label_x = 350
    totals_val_x = 460

    p.setFont(font_reg, 9)
    p.setFillColor(colors.black)
    p.drawString(totals_label_x, 325, "Subtotal")
    p.drawRightString(totals_val_x, 325, f"{curr} {amount:.2f}")

    p.drawString(totals_label_x, 307, "Tax (10%)")
    p.drawRightString(totals_val_x, 307, f"{curr} {tax:.2f}")

    p.setFont(font_bold, 12)
    p.setFillColor(primary_brown)
    p.drawString(totals_label_x, 287, "Total")
    p.drawRightString(totals_val_x, 287, f"{curr} {total:.2f}")

    p.setStrokeColor(primary_brown)
    p.setLineWidth(1.5)
    p.line(325, 276, 562, 276)

    # ================= 6. DIGITAL SIGNATURE SECTION =================
    sig_box_x, sig_box_y, sig_box_w, sig_box_h = 320, 185, 242, 38
    p.setFillColor(colors.HexColor("#F9F9F9"))
    p.setStrokeColor(colors.HexColor("#D1B8A8"))
    p.setLineWidth(0.8)
    p.rect(sig_box_x, sig_box_y, sig_box_w, sig_box_h, fill=1, stroke=1)

    p.setFont(font_bold, 9)
    p.setFillColor(primary_brown)
    p.drawCentredString(sig_box_x + (sig_box_w / 2.0), sig_box_y + 22, "Digitally signed by the Company")
    p.setFont(font_reg, 8)
    p.setFillColor(colors.HexColor("#555555"))
    p.drawCentredString(sig_box_x + (sig_box_w / 2.0), sig_box_y + 9, "Smart Parking Systems | Verified Cryptographic Seal")

    # ================= 7. FOOTER (THANK YOU & COPYRIGHT) =================
    p.setFont(font_italic, 10)
    p.setFillColor(primary_brown)
    p.drawCentredString(width / 2.0, 120, "Thank you for the payment!")

    p.setFont(font_reg, 8.5)
    p.setFillColor(colors.HexColor("#777777"))
    p.drawCentredString(width / 2.0, 103, "© 2026 Smart Parking System | All Rights Reserved")

    p.showPage()
    p.save()

    buffer.seek(0)
    response = make_response(buffer.getvalue())
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "attachment; filename=parking_receipt.pdf"

    return response